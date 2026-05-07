<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'image', 'qualifications', 'specialty',
        'experience_years', 'biography', 'languages', 'available_days',
        'is_featured', 'order', 'social_links',
    ];

    protected $casts = [
        'languages'     => 'array',
        'available_days'=> 'array',
        'social_links'  => 'array',
        'is_featured'   => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($doctor) {
            if (empty($doctor->slug)) {
                $doctor->slug = \Str::slug($doctor->name);
            }
        });
    }
}
