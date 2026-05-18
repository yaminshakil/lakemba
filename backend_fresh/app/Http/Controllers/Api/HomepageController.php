<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HomepageController extends Controller
{
    private function getDefaultSections(): array
    {
        return [
            [
                'key'      => 'hero',
                'title'    => 'Your Health, Our Priority',
                'subtitle' => 'Trusted, compassionate general practice in the heart of Lakemba.',
                'content'  => 'Expert care for every member of your family.',
                'is_active'=> true,
                'metadata' => [
                    'clinic_name'         => 'Lakemba General Medical Practice',
                    'tagline_prefix'      => 'Healthcare for',
                    'tagline_highlight'   => 'Every Generation',
                    'description'         => 'Trusted, compassionate general practice in the heart of Lakemba. Expert care for every member of your family — from routine check-ups to complex health needs.',
                    'cta_primary_text'    => 'Book Appointment',
                    'phone'               => '(02) 9759 1234',
                    'hours'               => 'Mon–Fri 8:30am–6pm',
                    'location'            => 'Lakemba NSW 2195',
                    'info_card_main'      => 'Lakemba General Medical Practice is open 6 days a week, and provides quality healthcare to the local community. Our team of highly experienced GPs offer a range of healthcare services including chronic disease management, mental health, men\'s health, women\'s health, skin checks, and vaccinations.',
                    'info_card_secondary' => 'Same-day appointments are available, and we accept walk-ins. The practice is wheelchair accessible with public transport stops nearby. Bulk billing is available for eligible patients.',
                    'info_card_notice'    => 'If you are experiencing any acute respiratory symptoms please wear a mask and notify reception on arrival.',
                    'image'               => '',
                ],
            ],
            [
                'key'      => 'stats',
                'title'    => 'Our Numbers',
                'is_active'=> true,
                'metadata' => [
                    'patients'     => '5000+',
                    'years'        => '15+',
                    'doctors'      => '10+',
                    'satisfaction' => '98%',
                ],
            ],
            [
                'key'      => 'services',
                'title'    => 'Comprehensive Care for Your Whole Family',
                'subtitle' => 'From preventive care to specialist referrals.',
                'is_active'=> true,
            ],
            [
                'key'      => 'doctors',
                'title'    => 'Meet Our Expert Doctors',
                'subtitle' => 'Multilingual team of experienced GPs.',
                'is_active'=> true,
            ],
            [
                'key'      => 'why_us',
                'title'    => 'Why Choose Us',
                'subtitle' => 'Healthcare you can trust.',
                'is_active'=> true,
            ],
            [
                'key'      => 'testimonials',
                'title'    => 'What Our Patients Say',
                'is_active'=> true,
            ],
        ];
    }

    public function index()
    {
        $sections = $this->getDefaultSections();
        $dbValues = Setting::where('group', 'homepage')->get()->keyBy('key');
        foreach ($sections as &$section) {
            if ($dbValues->has("homepage_{$section['key']}_title")) {
                $section['title'] = $dbValues["homepage_{$section['key']}_title"]->value;
            }
        }
        return response()->json(['data' => $sections]);
    }

    public function show($key)
    {
        $defaults = collect($this->getDefaultSections())->firstWhere('key', $key);
        if (!$defaults) return response()->json(['message' => 'Section not found'], 404);

        $dbTitle = Setting::get("homepage_{$key}_title");
        if ($dbTitle) $defaults['title'] = $dbTitle;

        $dbSubtitle = Setting::get("homepage_{$key}_subtitle");
        if ($dbSubtitle) $defaults['subtitle'] = $dbSubtitle;

        $dbMetadata = Setting::get("homepage_{$key}_metadata");
        if ($dbMetadata) {
            $decoded = json_decode($dbMetadata, true);
            if (is_array($decoded)) {
                $defaults['metadata'] = array_merge($defaults['metadata'] ?? [], $decoded);
            }
        }

        $dbImage = Setting::get("homepage_{$key}_image");
        if ($dbImage) {
            $defaults['metadata']['image'] = $dbImage;
        }

        return response()->json(['data' => $defaults]);
    }

    public function update(Request $request, $key)
    {
        $data = $request->validate([
            'title'    => 'nullable|string|max:300',
            'subtitle' => 'nullable|string|max:500',
            'content'  => 'nullable|string',
            'is_active'=> 'boolean',
            'metadata' => 'nullable|array',
        ]);

        foreach ($data as $field => $value) {
            Setting::set("homepage_{$key}_{$field}", is_array($value) ? json_encode($value) : $value, 'homepage');
        }

        return response()->json(['message' => 'Section updated successfully']);
    }

    public function uploadImage(Request $request, $key)
    {
        $request->validate(['image' => 'required|image|max:4096']);

        $oldPath = Setting::get("homepage_{$key}_image");
        if ($oldPath) {
            Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('image')->store("homepage/{$key}", 'public');
        Setting::set("homepage_{$key}_image", $path, 'homepage');

        return response()->json([
            'data' => [
                'image_url' => Storage::disk('public')->url($path),
            ]
        ]);
    }
}
