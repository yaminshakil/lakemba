<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'slug', 'icon', 'description', 'full_description',
        'image', 'is_featured', 'order',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
    ];
}
