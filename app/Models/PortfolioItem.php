<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioItem extends Model
{
    protected $table = 'portfolio_items';

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
