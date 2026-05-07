<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'name'             => $this->name,
            'slug'             => $this->slug,
            'image'            => $this->image,
            'qualifications'   => $this->qualifications,
            'specialty'        => $this->specialty,
            'experience_years' => $this->experience_years,
            'biography'        => $this->biography,
            'languages'        => $this->languages ?? [],
            'available_days'   => $this->available_days ?? [],
            'is_featured'      => $this->is_featured,
            'order'            => $this->order,
            'social_links'     => $this->social_links ?? [],
        ];
    }
}
