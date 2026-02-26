<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@devfreelance.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
                'is_admin' => true,
            ]
        );
    }
}
