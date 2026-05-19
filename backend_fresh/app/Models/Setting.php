<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = ['key', 'value', 'group'];

    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    public static function set(string $key, mixed $value, string $group = 'general'): void
    {
        $setting = static::where('key', $key)->first();
        if ($setting) {
            $setting->value = $value;
            $setting->group = $group;
            $setting->save();
        } else {
            static::create(['key' => $key, 'value' => $value, 'group' => $group]);
        }
    }
}
