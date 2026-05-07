<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

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
}
