<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quote extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'project_id',
        'quote_number',
        'status',
        'subtotal',
        'tax_rate',
        'tax_amount',
        'discount',
        'total',
        'notes',
        'terms',
        'valid_until',
        'sent_at',
        'viewed_at',
        'accepted_at',
        'created_by',
        'approval_token',
        'approval_token_expires_at',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'valid_until' => 'date',
        'sent_at' => 'datetime',
        'viewed_at' => 'datetime',
        'accepted_at' => 'datetime',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(QuoteItem::class)->orderBy('order');
    }

    public function invoice(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public static function generateQuoteNumber(): string
    {
        $year = date('Y');
        $lastQuote = self::where('quote_number', 'like', "Q{$year}%")
            ->orderBy('quote_number', 'desc')
            ->first();

        $nextNumber = $lastQuote
            ? (int) substr($lastQuote->quote_number, -5) + 1
            : 1;

        return sprintf('Q%d-%05d', $year, $nextNumber);
    }

    public function calculateTotals(): void
    {
        $this->subtotal = $this->items->sum('subtotal');
        $this->tax_amount = $this->subtotal * ($this->tax_rate / 100);
        $this->total = $this->subtotal + $this->tax_amount - $this->discount;
    }
}
