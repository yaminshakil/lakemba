<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactMessageReceived;
use App\Mail\ContactMessageReply;
use App\Models\ContactMessage;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function show()
    {
        return response()->json([
            'data' => [
                'phone'         => Setting::get('phone_primary',   '(02) 9759 1234'),
                'phone_secondary'=> Setting::get('phone_secondary', ''),
                'email'         => Setting::get('email_primary',   'info@lakembagmp.com.au'),
                'address'       => Setting::get('address',         '123 Lakemba Street'),
                'suburb'        => Setting::get('suburb',          'Lakemba'),
                'state'         => Setting::get('state',           'NSW'),
                'postcode'      => Setting::get('postcode',        '2195'),
                'opening_hours' => [
                    ['day' => 'Monday – Friday', 'open' => '8:30am', 'close' => '6:00pm', 'is_closed' => false],
                    ['day' => 'Saturday',        'open' => '9:00am', 'close' => '1:00pm', 'is_closed' => false],
                    ['day' => 'Sunday',          'open' => null,     'close' => null,      'is_closed' => true],
                ],
            ],
        ]);
    }

    public function submit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'    => 'required|string|max:100',
            'email'   => 'required|email|max:200',
            'phone'   => 'nullable|string|max:20',
            'message' => 'required|string|max:2000',
            'subject' => 'nullable|string|max:200',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $contactMessage = ContactMessage::create($validator->validated());

        $notifyEmail = Setting::get('notification_email') ?: Setting::get('email_primary') ?: config('mail.from.address');

        if ($notifyEmail && Setting::get('notifications_enabled', '1') !== '0') {
            try {
                $this->applyMailConfig();
                Mail::to($notifyEmail)->send(new ContactMessageReceived($contactMessage));
            } catch (\Throwable $e) {
                Log::error('Contact notification mail failed: ' . $e->getMessage());
            }
        }

        return response()->json(['message' => 'Your message has been received. We will be in touch soon.']);
    }

    public function subscribe(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        // Store subscriber in DB or forward to email service provider
        return response()->json(['message' => 'Thank you for subscribing to our newsletter.']);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'phone_primary'  => 'sometimes|string|max:20',
            'phone_secondary'=> 'nullable|string|max:20',
            'email_primary'  => 'sometimes|email|max:200',
            'address'        => 'sometimes|string|max:300',
            'suburb'         => 'sometimes|string|max:100',
            'state'          => 'sometimes|string|max:50',
            'postcode'       => 'sometimes|string|max:10',
        ]);

        foreach ($data as $key => $value) {
            Setting::set($key, $value, 'contact');
        }

        return response()->json(['message' => 'Contact details updated successfully.']);
    }

    // ── Mail config helper ────────────────────────────────────────────────────

    private function applyMailConfig(): void
    {
        $map = [
            'mail_host'         => 'mail.mailers.smtp.host',
            'mail_port'         => 'mail.mailers.smtp.port',
            'mail_username'     => 'mail.mailers.smtp.username',
            'mail_password'     => 'mail.mailers.smtp.password',
            'mail_encryption'   => 'mail.mailers.smtp.encryption',
            'mail_from_address' => 'mail.from.address',
            'mail_from_name'    => 'mail.from.name',
        ];

        foreach ($map as $settingKey => $configKey) {
            $value = Setting::get($settingKey);
            if ($value !== null && $value !== '') {
                config([$configKey => $value]);
            }
        }

        // Use smtp mailer if host is configured
        if (Setting::get('mail_host')) {
            config(['mail.default' => 'smtp']);
        }
    }

    // ── Admin: messages ───────────────────────────────────────────────────────

    public function adminIndex(Request $request)
    {
        $query = ContactMessage::latest();

        if ($request->filter === 'unread') {
            $query->where('is_read', false);
        }

        $messages = $query->paginate(20);
        return response()->json(['data' => $messages]);
    }

    public function adminShow(ContactMessage $message)
    {
        if (!$message->is_read) {
            $message->update(['is_read' => true]);
        }
        return response()->json(['data' => $message]);
    }

    public function adminMarkRead(ContactMessage $message)
    {
        $message->update(['is_read' => true]);
        return response()->json(['data' => $message]);
    }

    public function adminDestroy(ContactMessage $message)
    {
        $message->delete();
        return response()->json(['message' => 'Message deleted.']);
    }

    public function adminUnreadCount()
    {
        return response()->json(['data' => ['count' => ContactMessage::where('is_read', false)->count()]]);
    }

    public function adminReply(Request $request, ContactMessage $message)
    {
        $data = $request->validate([
            'body' => 'required|string|max:5000',
        ]);

        try {
            $this->applyMailConfig();
            Mail::to($message->email)->send(new ContactMessageReply($message, $data['body']));
        } catch (\Throwable $e) {
            Log::error('Reply mail failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to send reply: ' . $e->getMessage()], 500);
        }

        // Mark as read when replied
        $message->update(['is_read' => true]);

        return response()->json(['message' => 'Reply sent successfully.']);
    }
}
