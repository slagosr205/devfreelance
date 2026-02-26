<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'project_id',
        'quote_id',
        'invoice_number',
        'status',
        'subtotal',
        'tax_rate',
        'tax_amount',
        'discount',
        'total',
        'paid_amount',
        'due_amount',
        'issue_date',
        'due_date',
        'notes',
        'terms',
        'sent_at',
        'viewed_at',
        'paid_at',
        'created_by',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'due_amount' => 'decimal:2',
        'issue_date' => 'date',
        'due_date' => 'date',
        'sent_at' => 'datetime',
        'viewed_at' => 'datetime',
        'paid_at' => 'datetime',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class)->orderBy('order');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public static function generateInvoiceNumber(): string
    {
        $year = date('Y');
        $lastInvoice = self::where('invoice_number', 'like', "INV{$year}%")
            ->orderBy('invoice_number', 'desc')
            ->first();

        $nextNumber = $lastInvoice
            ? (int) substr($lastInvoice->invoice_number, -5) + 1
            : 1;

        return sprintf('INV%d-%05d', $year, $nextNumber);
    }

    public function calculateTotals(): void
    {
        $this->subtotal = $this->items->sum('subtotal');
        $this->tax_amount = $this->subtotal * ($this->tax_rate / 100);
        $this->total = $this->subtotal + $this->tax_amount - $this->discount;
        $this->due_amount = $this->total - $this->paid_amount;
    }

    public function markAsPaid(): void
    {
        $this->status = 'paid';
        $this->paid_amount = $this->total;
        $this->due_amount = 0;
        $this->paid_at = now();
        $this->save();
    }
}
