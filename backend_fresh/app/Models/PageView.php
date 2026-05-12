<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageView extends Model
{
    public $timestamps = false;

    protected $fillable = ['page', 'ip_hash', 'session_id', 'visited_at'];

    protected $casts = ['visited_at' => 'datetime'];
}
