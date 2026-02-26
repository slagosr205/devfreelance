<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            $table->string('approval_token')->nullable()->unique()->after('accepted_at');
            $table->timestamp('approval_token_expires_at')->nullable()->after('approval_token');
        });
    }

    public function down(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            $table->dropColumn(['approval_token', 'approval_token_expires_at']);
        });
    }
};
