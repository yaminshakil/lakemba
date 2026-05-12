<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DoctorResource;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DoctorController extends Controller
{
    public function index(Request $request)
    {
        $query = Doctor::orderBy('order')->orderBy('name');

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }
        if ($request->has('limit')) {
            $query->limit((int) $request->limit);
        }

        $doctors = $query->get();
        return DoctorResource::collection($doctors);
    }

    public function show($id)
    {
        $doctor = Doctor::where('id', $id)->orWhere('slug', $id)->firstOrFail();
        return new DoctorResource($doctor);
    }

    private function decodeJsonArrayFields(Request $request): void
    {
        foreach (['languages', 'available_days', 'social_links'] as $field) {
            $value = $request->input($field);
            if (is_string($value)) {
                $decoded = json_decode($value, true);
                $request->merge([$field => is_array($decoded) ? $decoded : []]);
            }
        }
    }

    public function store(Request $request)
    {
        $this->decodeJsonArrayFields($request);

        $validated = $request->validate([
            'name'             => 'required|string|max:200',
            'qualifications'   => 'required|string|max:300',
            'specialty'        => 'required|string|max:200',
            'experience_years' => 'required|integer|min:0',
            'biography'        => 'nullable|string',
            'languages'        => 'required|array',
            'available_days'   => 'required|array',
            'is_featured'      => 'boolean',
            'order'            => 'nullable|integer',
            'image'            => 'nullable|image|max:4096',
            'social_links'     => 'nullable|array',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('doctors', 'public');
        }

        $validated['slug'] = Str::slug($validated['name']);

        $doctor = Doctor::create($validated);
        return new DoctorResource($doctor);
    }

    public function update(Request $request, Doctor $doctor)
    {
        $this->decodeJsonArrayFields($request);

        $validated = $request->validate([
            'name'             => 'sometimes|string|max:200',
            'qualifications'   => 'sometimes|string|max:300',
            'specialty'        => 'sometimes|string|max:200',
            'experience_years' => 'sometimes|integer|min:0',
            'biography'        => 'nullable|string',
            'languages'        => 'sometimes|array',
            'available_days'   => 'sometimes|array',
            'is_featured'      => 'boolean',
            'order'            => 'nullable|integer',
            'image'            => 'nullable|image|max:4096',
            'social_links'     => 'nullable|array',
        ]);

        if ($request->hasFile('image')) {
            if ($doctor->image) Storage::disk('public')->delete($doctor->image);
            $validated['image'] = $request->file('image')->store('doctors', 'public');
        }

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $doctor->update($validated);
        return new DoctorResource($doctor);
    }

    public function destroy(Doctor $doctor)
    {
        if ($doctor->image) Storage::disk('public')->delete($doctor->image);
        $doctor->delete();
        return response()->json(['message' => 'Doctor deleted successfully']);
    }
}
