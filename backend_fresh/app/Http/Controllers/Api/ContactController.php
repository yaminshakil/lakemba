<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
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

        // In production, send an actual email here:
        // Mail::to(Setting::get('email_primary'))->send(new ContactFormMail($request->validated()));

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
            'phone'          => 'sometimes|string|max:20',
            'phone_secondary'=> 'nullable|string|max:20',
            'email'          => 'sometimes|email|max:200',
            'address'        => 'sometimes|string|max:300',
            'suburb'         => 'sometimes|string|max:100',
            'state'          => 'sometimes|string|max:50',
            'postcode'       => 'sometimes|string|max:10',
        ]);

        foreach ($data as $key => $value) {
            Setting::set("contact_{$key}", $value, 'contact');
        }

        return response()->json(['message' => 'Contact details updated successfully.']);
    }
}
