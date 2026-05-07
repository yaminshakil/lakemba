<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FaqResource;
use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index(Request $request)
    {
        $query = Faq::orderBy('order')->orderBy('category');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        return FaqResource::collection($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:500',
            'answer'   => 'required|string',
            'category' => 'nullable|string|max:100',
            'order'    => 'nullable|integer',
        ]);

        $faq = Faq::create($validated);
        return new FaqResource($faq);
    }

    public function update(Request $request, Faq $faq)
    {
        $validated = $request->validate([
            'question' => 'sometimes|string|max:500',
            'answer'   => 'sometimes|string',
            'category' => 'nullable|string|max:100',
            'order'    => 'nullable|integer',
        ]);

        $faq->update($validated);
        return new FaqResource($faq);
    }

    public function destroy(Faq $faq)
    {
        $faq->delete();
        return response()->json(['message' => 'FAQ deleted successfully']);
    }
}
