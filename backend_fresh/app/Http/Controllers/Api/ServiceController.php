<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::orderBy('order')->orderBy('title');

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }
        if ($request->has('limit')) {
            $query->limit((int) $request->limit);
        }

        return ServiceResource::collection($query->get());
    }

    public function show($service)
    {
        $model = Service::where('id', $service)->orWhere('slug', $service)->firstOrFail();
        return new ServiceResource($model);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:200',
            'icon'             => 'nullable|string|max:50',
            'description'      => 'required|string',
            'full_description' => 'nullable|string',
            'is_featured'      => 'boolean',
            'order'            => 'nullable|integer',
            'image'            => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('services', 'public');
        }
        $validated['slug'] = Str::slug($validated['title']);

        $service = Service::create($validated);
        return new ServiceResource($service);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'title'            => 'sometimes|string|max:200',
            'icon'             => 'nullable|string|max:50',
            'description'      => 'sometimes|string',
            'full_description' => 'nullable|string',
            'is_featured'      => 'boolean',
            'order'            => 'nullable|integer',
            'image'            => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('image')) {
            if ($service->image) Storage::disk('public')->delete($service->image);
            $validated['image'] = $request->file('image')->store('services', 'public');
        }
        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $service->update($validated);
        return new ServiceResource($service);
    }

    public function destroy(Service $service)
    {
        if ($service->image) Storage::disk('public')->delete($service->image);
        $service->delete();
        return response()->json(['message' => 'Service deleted successfully']);
    }
}
