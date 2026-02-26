<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            if (! Schema::hasColumn('payments', 'invoice_id')) {
                $table->foreignId('invoice_id')->nullable()->constrained()->nullOnDelete();
            }
            if (! Schema::hasColumn('payments', 'paid_at')) {
                $table->timestamp('paid_at')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['invoice_id']);
            $table->dropColumn(['invoice_id', 'paid_at']);
        });
    }
};
