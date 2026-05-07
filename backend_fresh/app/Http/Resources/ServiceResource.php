<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'title'            => $this->title,
            'slug'             => $this->slug,
            'icon'             => $this->icon,
            'description'      => $this->description,
            'full_description' => $this->full_description,
            'image'            => $this->image,
            'is_featured'      => $this->is_featured,
            'order'            => $this->order,
        ];
    }
}
