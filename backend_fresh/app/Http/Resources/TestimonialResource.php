<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestimonialResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'patient_name'   => $this->patient_name,
            'patient_avatar' => $this->patient_avatar,
            'rating'         => $this->rating,
            'review'         => $this->review,
            'service'        => $this->service,
            'date'           => $this->date,
            'is_featured'    => $this->is_featured,
        ];
    }
}
