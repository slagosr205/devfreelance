<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Work extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'client',
        'image',
        'images',
        'category',
        'link',
        'published',
        'sort_order',
    ];

    protected $casts = [
        'published' => 'boolean',
        'images' => 'array',
    ];

    public function scopePublished($query)
    {
        return $query->where('published', true)->orderBy('sort_order');
    }
}
