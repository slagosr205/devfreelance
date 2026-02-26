<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'log_name',
        'user_id',
        'project_id',
        'description',
        'properties',
    ];

    protected $casts = [
        'properties' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public static function log(string $description, ?int $projectId = null, array $properties = []): self
    {
        return self::create([
            'user_id' => auth()->check() ? auth()->id() : null,
            'project_id' => $projectId,
            'description' => $description,
            'properties' => $properties,
        ]);
    }
}
