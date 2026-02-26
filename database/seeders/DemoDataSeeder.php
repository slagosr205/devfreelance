<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Payment;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Juan Pérez',
                'email' => 'juan@example.com',
                'password' => 'password123',
                'is_admin' => false,
                'status' => 'active',
            ],
            [
                'name' => 'María García',
                'email' => 'maria@example.com',
                'password' => 'password123',
                'is_admin' => false,
                'status' => 'active',
            ],
            [
                'name' => 'Carlos López',
                'email' => 'carlos@example.com',
                'password' => 'password123',
                'is_admin' => false,
                'status' => 'prospect',
            ],
            [
                'name' => 'Ana Martínez',
                'email' => 'ana@example.com',
                'password' => 'password123',
                'is_admin' => false,
                'status' => 'inactive',
            ],
        ];

        foreach ($users as $userData) {
            $status = $userData['status'];
            unset($userData['status']);

            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );

            if ($status !== 'prospect') {
                Client::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'company_name' => fake()->company(),
                        'phone' => fake()->phoneNumber(),
                        'country' => fake()->country(),
                        'city' => fake()->city(),
                        'status' => $status,
                    ]
                );
            }
        }

        $clients = Client::all();

        $projectTypes = ['sap_b1', 'odoo', 'custom', 'integration', 'consulting'];
        $projectStatuses = ['pending', 'in_progress', 'completed', 'on_hold'];

        $projectsData = [
            ['name' => 'Implementación SAP Business One', 'type' => 'sap_b1', 'status' => 'completed', 'budget' => 15000],
            ['name' => 'Módulo de inventario personalizado', 'type' => 'custom', 'status' => 'in_progress', 'budget' => 5500],
            ['name' => 'Integración Odoo con WooCommerce', 'type' => 'integration', 'status' => 'completed', 'budget' => 3200],
            ['name' => 'Consultoría ERP', 'type' => 'consulting', 'status' => 'pending', 'budget' => 1500],
            ['name' => 'Desarrollo módulo facturas', 'type' => 'odoo', 'status' => 'on_hold', 'budget' => 2800],
            ['name' => 'Migración de datos SAP', 'type' => 'sap_b1', 'status' => 'in_progress', 'budget' => 8500],
            ['name' => 'Sistema de nómina', 'type' => 'custom', 'status' => 'pending', 'budget' => 6200],
            ['name' => 'Implementación Odoo completo', 'type' => 'odoo', 'status' => 'completed', 'budget' => 12000],
        ];

        foreach ($clients as $index => $client) {
            $projectData = $projectsData[$index % count($projectsData)];

            $project = Project::create([
                'client_id' => $client->id,
                'name' => $projectData['name'],
                'description' => fake()->paragraph(2),
                'type' => $projectData['type'],
                'status' => $projectData['status'],
                'budget' => $projectData['budget'],
                'start_date' => fake()->dateTimeBetween('-6 months', 'now'),
                'end_date' => fake()->dateTimeBetween('now', '+3 months'),
                'requirements' => fake()->paragraph(),
            ]);

            if (in_array($projectData['status'], ['completed', 'in_progress'])) {
                $paymentStatuses = $projectData['status'] === 'completed' ? ['completed', 'completed'] : ['completed', 'pending'];

                foreach ($paymentStatuses as $status) {
                    Payment::create([
                        'client_id' => $client->id,
                        'project_id' => $project->id,
                        'paypal_payment_id' => 'PAYID-'.strtoupper(fake()->uuid()),
                        'paypal_payer_id' => 'PAYER-'.strtoupper(fake()->uuid()),
                        'amount' => $projectData['budget'] / 2,
                        'currency' => 'USD',
                        'status' => $status,
                        'description' => 'Pago parcial para '.$projectData['name'],
                    ]);
                }
            }
        }

        $this->command->info('Datos de demo creados exitosamente!');
        $this->command->info('Usuarios creados: '.(User::count() - 1));
        $this->command->info('Clientes creados: '.Client::count());
        $this->command->info('Proyectos creados: '.Project::count());
        $this->command->info('Pagos creados: '.Payment::count());
    }
}
