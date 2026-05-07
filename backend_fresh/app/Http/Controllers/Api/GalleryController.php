<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    public function index()
    {
        $images = Gallery::orderBy('order')->orderBy('id')->get();
        return response()->json([
            'data' => $images->map(fn($img) => [
                'id'       => $img->id,
                'title'    => $img->title,
                'image'    => $img->image,
                'category' => $img->category,
                'order'    => $img->order,
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'    => 'required|string|max:200',
            'category' => 'nullable|string|max:100',
            'order'    => 'nullable|integer',
            'image'    => 'required|image|max:8192',
        ]);

        $validated['image'] = $request->file('image')->store('gallery', 'public');

        $image = Gallery::create($validated);
        return response()->json(['data' => $image, 'message' => 'Image uploaded successfully']);
    }

    public function destroy(Gallery $gallery)
    {
        if ($gallery->image) Storage::disk('public')->delete($gallery->image);
        $gallery->delete();
        return response()->json(['message' => 'Image deleted successfully']);
    }
}
