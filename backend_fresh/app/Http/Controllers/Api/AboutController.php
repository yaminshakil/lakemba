<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AboutSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AboutController extends Controller
{
    public function show()
    {
        $settings = AboutSettings::first();

        if (!$settings) {
            return response()->json(['data' => $this->defaults()]);
        }

        return response()->json(['data' => $settings]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'hero_badge'          => 'nullable|string|max:100',
            'hero_title'          => 'nullable|string|max:200',
            'hero_subtitle'       => 'nullable|string|max:500',
            'story_title'         => 'nullable|string|max:200',
            'story_paragraph1'    => 'nullable|string',
            'story_paragraph2'    => 'nullable|string',
            'stat_years'          => 'nullable|string|max:20',
            'stat_patients'       => 'nullable|string|max:20',
            'stat_doctors'        => 'nullable|string|max:20',
            'accreditations'      => 'nullable|array',
            'accreditations.*'    => 'string|max:200',
            'values'              => 'nullable|array',
            'values.*.icon'       => 'required|string|max:50',
            'values.*.title'      => 'required|string|max:100',
            'values.*.desc'       => 'required|string|max:500',
            'clinic_image_url'    => 'sometimes|nullable|string|max:500',
        ]);

        $settings = AboutSettings::updateOrCreate(['id' => 1], $validated);

        return response()->json(['data' => $settings]);
    }

    public function uploadImage(Request $request)
    {
        $request->validate(['image' => 'required|image|mimes:jpeg,png,gif,webp|max:4096']);

        $settings = AboutSettings::first();
        if ($settings?->clinic_image_url && Storage::disk('public')->exists($settings->clinic_image_url)) {
            Storage::disk('public')->delete($settings->clinic_image_url);
        }

        $path = $request->file('image')->store('about', 'public');

        AboutSettings::updateOrCreate(['id' => 1], ['clinic_image_url' => $path]);

        return response()->json(['data' => ['path' => $path]]);
    }

    private function defaults(): array
    {
        return [
            'hero_badge'       => 'About Our Practice',
            'hero_title'       => 'Caring for Lakemba Since 2009',
            'hero_subtitle'    => 'We are a passionate team of GPs dedicated to providing exceptional healthcare to our community.',
            'story_title'      => 'A Practice Built on Trust & Community',
            'story_paragraph1' => "Lakemba General Medical Practice was established in 2009 with a simple mission: to provide high-quality, accessible healthcare to one of Sydney's most vibrant and diverse communities.",
            'story_paragraph2' => 'Over 15 years, we have grown from a small family practice into a full-service medical centre with over 10 GPs and a dedicated support team — all united by a commitment to patient-centred care. We are proud to serve patients from across Lakemba, Wiley Park, Punchbowl, and beyond.',
            'stat_years'       => '15+',
            'stat_patients'    => '5K+',
            'stat_doctors'     => '10+',
            'accreditations'   => [
                'RACGP Accredited Practice',
                'Medicare Provider',
                'Mental Health Care Plans',
                'Chronic Disease Management',
                'Travel Medicine',
                'Allied Health Referrals',
            ],
            'values' => [
                ['icon' => 'Heart', 'title' => 'Compassionate Care',  'desc' => 'We treat every patient with empathy, dignity, and respect, recognising the whole person behind each health concern.'],
                ['icon' => 'Award', 'title' => 'Clinical Excellence',  'desc' => 'Our GPs are committed to evidence-based medicine and continuous professional development.'],
                ['icon' => 'Users', 'title' => 'Community Focus',      'desc' => 'We are deeply rooted in the Lakemba community and proud to serve its diverse, multicultural population.'],
                ['icon' => 'Clock', 'title' => 'Accessibility',        'desc' => 'From flexible appointment times to bulk billing, we work hard to remove barriers to quality healthcare.'],
            ],
            'clinic_image_url' => null,
        ];
    }
}
