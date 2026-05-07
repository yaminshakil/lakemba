<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlogPostResource;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogPostController extends Controller
{
    public function index(Request $request)
    {
        $query = BlogPost::where('is_published', true)
            ->orderByDesc('published_at');

        if ($request->has('limit')) {
            $query->limit((int) $request->limit);
        }

        $perPage = $request->get('per_page', 9);
        $posts = $query->paginate($perPage);

        return BlogPostResource::collection($posts);
    }

    public function show($post)
    {
        $model = BlogPost::where('slug', $post)
            ->orWhere('id', $post)
            ->where('is_published', true)
            ->firstOrFail();
        return new BlogPostResource($model);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:300',
            'excerpt'      => 'required|string|max:500',
            'content'      => 'required|string',
            'author'       => 'required|string|max:100',
            'category'     => 'required|string|max:100',
            'tags'         => 'nullable|array',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
            'image'        => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('blog', 'public');
        }
        $validated['slug'] = Str::slug($validated['title']);
        if (empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $post = BlogPost::create($validated);
        return new BlogPostResource($post);
    }

    public function update(Request $request, BlogPost $blog)
    {
        $validated = $request->validate([
            'title'        => 'sometimes|string|max:300',
            'excerpt'      => 'sometimes|string|max:500',
            'content'      => 'sometimes|string',
            'author'       => 'sometimes|string|max:100',
            'category'     => 'sometimes|string|max:100',
            'tags'         => 'nullable|array',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
            'image'        => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('image')) {
            if ($blog->image) Storage::disk('public')->delete($blog->image);
            $validated['image'] = $request->file('image')->store('blog', 'public');
        }
        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $blog->update($validated);
        return new BlogPostResource($blog);
    }

    public function destroy(BlogPost $blog)
    {
        if ($blog->image) Storage::disk('public')->delete($blog->image);
        $blog->delete();
        return response()->json(['message' => 'Post deleted successfully']);
    }
}
