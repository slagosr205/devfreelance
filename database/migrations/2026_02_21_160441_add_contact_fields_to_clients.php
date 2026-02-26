<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->string('contact_name')->nullable()->after('city');
            $table->string('contact_email')->nullable()->after('contact_name');
            $table->string('contact_service')->nullable()->after('contact_email');
            $table->text('contact_message')->nullable()->after('contact_service');
        });
    }

    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn(['contact_name', 'contact_email', 'contact_service', 'contact_message']);
        });
    }
};
