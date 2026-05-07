<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogPostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'title'        => $this->title,
            'slug'         => $this->slug,
            'excerpt'      => $this->excerpt,
            'content'      => $this->content,
            'image'        => $this->image,
            'author'       => $this->author,
            'author_avatar'=> $this->author_avatar,
            'category'     => $this->category,
            'tags'         => $this->tags ?? [],
            'published_at' => $this->published_at?->toDateString(),
            'is_published' => $this->is_published,
        ];
    }
}
