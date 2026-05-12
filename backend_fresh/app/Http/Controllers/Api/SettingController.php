<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json(['data' => $settings]);
    }

    public function show($key)
    {
        $value = Setting::get($key);
        if ($value === null) {
            return response()->json(['message' => 'Setting not found'], 404);
        }
        return response()->json(['data' => ['value' => $value]]);
    }

    public function update(Request $request)
    {
        $request->validate(['*' => 'nullable|string|max:2000']);

        foreach ($request->all() as $key => $value) {
            Setting::set($key, $value);
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }

    public function seo($page)
    {
        return response()->json([
            'data' => [
                'title'       => Setting::get("seo_{$page}_title",       config('app.name')),
                'description' => Setting::get("seo_{$page}_description", ''),
                'keywords'    => Setting::get("seo_{$page}_keywords",    ''),
                'og_image'    => Setting::get("seo_{$page}_og_image",    ''),
            ],
        ]);
    }

    public function updateSeo(Request $request, $page)
    {
        $data = $request->validate([
            'title'       => 'nullable|string|max:200',
            'description' => 'nullable|string|max:500',
            'keywords'    => 'nullable|string|max:300',
            'og_image'    => 'nullable|string|max:500',
        ]);

        foreach ($data as $key => $value) {
            Setting::set("seo_{$page}_{$key}", $value, 'seo');
        }

        return response()->json(['message' => 'SEO settings updated successfully']);
    }

    public function testEmail(Request $request)
    {
        $notifyEmail = Setting::get('notification_email') ?: Setting::get('email_primary');

        if (!$notifyEmail) {
            return response()->json(['message' => 'No notification email configured.'], 422);
        }

        // Apply DB mail settings at runtime
        $map = [
            'mail_host'         => 'mail.mailers.smtp.host',
            'mail_port'         => 'mail.mailers.smtp.port',
            'mail_username'     => 'mail.mailers.smtp.username',
            'mail_password'     => 'mail.mailers.smtp.password',
            'mail_encryption'   => 'mail.mailers.smtp.encryption',
            'mail_from_address' => 'mail.from.address',
            'mail_from_name'    => 'mail.from.name',
        ];
        foreach ($map as $key => $cfg) {
            $v = Setting::get($key);
            if ($v) config([$cfg => $v]);
        }
        if (Setting::get('mail_host')) config(['mail.default' => 'smtp']);

        try {
            Mail::raw(
                "This is a test email from your Lakemba GMP admin panel.\n\nIf you received this, your email notifications are configured correctly.",
                function ($m) use ($notifyEmail) {
                    $m->to($notifyEmail)->subject('Test Email – Lakemba GMP Admin');
                }
            );
            return response()->json(['message' => "Test email sent to {$notifyEmail}."]);
        } catch (\Throwable $e) {
            Log::error('Test email failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed: ' . $e->getMessage()], 500);
        }
    }

    public function uploadLogo(Request $request)
    {
        $request->validate(['logo' => 'required|image|mimes:jpeg,png,gif,svg,webp|max:2048']);

        $oldPath = Setting::get('site_logo');
        if ($oldPath) {
            Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('logo')->store('logo', 'public');
        Setting::set('site_logo', $path, 'branding');

        return response()->json(['data' => ['logo_url' => Storage::disk('public')->url($path)]]);
    }
}
