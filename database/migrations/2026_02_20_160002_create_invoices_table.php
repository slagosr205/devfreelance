<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('quote_id')->nullable()->constrained()->onDelete('set null');
            $table->string('invoice_number')->unique();
            $table->enum('status', ['draft', 'sent', 'viewed', 'paid', 'partial', 'overdue', 'cancelled', 'refunded'])->default('draft');
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('tax_rate', 5, 2)->default(0);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->decimal('paid_amount', 12, 2)->default(0);
            $table->decimal('due_amount', 12, 2)->default(0);
            $table->date('issue_date');
            $table->date('due_date');
            $table->text('notes')->nullable();
            $table->text('terms')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('viewed_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
