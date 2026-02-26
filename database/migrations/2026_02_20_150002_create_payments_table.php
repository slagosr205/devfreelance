<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->foreignId('project_id')->nullable()->constrained('projects')->onDelete('set null');
            $table->string('paypal_payment_id')->nullable();
            $table->string('paypal_payer_id')->nullable();
            $table->decimal('amount', 12, 2);
            $table->string('currency')->default('USD');
            $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
