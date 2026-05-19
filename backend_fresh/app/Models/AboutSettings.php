<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutSettings extends Model
{
    protected $table = 'about_settings';

    protected $fillable = [
        'hero_badge',
        'hero_title',
        'hero_subtitle',
        'story_title',
        'story_paragraph1',
        'story_paragraph2',
        'stat_years',
        'stat_patients',
        'stat_doctors',
        'accreditations',
        'values',
        'clinic_image_url',
    ];

    protected $casts = [
        'accreditations' => 'array',
        'values'         => 'array',
    ];
}
