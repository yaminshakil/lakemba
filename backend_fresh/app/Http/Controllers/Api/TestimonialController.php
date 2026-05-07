<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index()
    {
        $testimonials = Testimonial::orderByDesc('date')->get();
        return TestimonialResource::collection($testimonials);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_name'   => 'required|string|max:100',
            'rating'         => 'required|integer|between:1,5',
            'review'         => 'required|string|max:1000',
            'service'        => 'nullable|string|max:100',
            'date'           => 'nullable|date',
            'is_featured'    => 'boolean',
            'patient_avatar' => 'nullable|string|max:500',
        ]);

        if (empty($validated['date'])) {
            $validated['date'] = now()->toDateString();
        }

        $testimonial = Testimonial::create($validated);
        return new TestimonialResource($testimonial);
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        $validated = $request->validate([
            'patient_name' => 'sometimes|string|max:100',
            'rating'       => 'sometimes|integer|between:1,5',
            'review'       => 'sometimes|string|max:1000',
            'service'      => 'nullable|string|max:100',
            'date'         => 'nullable|date',
            'is_featured'  => 'boolean',
        ]);

        $testimonial->update($validated);
        return new TestimonialResource($testimonial);
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();
        return response()->json(['message' => 'Testimonial deleted successfully']);
    }
}
