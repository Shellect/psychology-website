<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $adminRole = Role::admin();
        $clientRole = Role::client();

        User::firstOrCreate(
            ['email' => 'admin@psychology.ru'],
            [
                'name' => 'Администратор',
                'password' => bcrypt('admin123'),
                'role_id' => $adminRole->id,
                'phone' => '+7 (999) 123-45-67',
            ]
        );

        User::firstOrCreate(
            ['email' => 'client@example.com'],
            [
                'name' => 'Тестовый Клиент',
                'password' => bcrypt('client123'),
                'role_id' => $clientRole->id,
                'phone' => '+7 (999) 765-43-21',
            ]
        );
    }
}
