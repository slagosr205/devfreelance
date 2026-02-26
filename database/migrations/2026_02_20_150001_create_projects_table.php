<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['sap_b1', 'odoo', 'custom', 'integration', 'consulting']);
            $table->enum('status', ['pending', 'in_progress', 'completed', 'cancelled', 'on_hold'])->default('pending');
            $table->decimal('budget', 12, 2)->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('requirements')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
