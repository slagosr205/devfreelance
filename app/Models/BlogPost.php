<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlogPost extends Model
{
    protected $table = 'blog_posts';

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'image',
        'category',
        'published',
        'published_at',
        'user_id',
    ];

    protected $casts = [
        'published' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopePublished($query)
    {
        return $query->where('published', true)->whereNotNull('published_at');
    }
}
