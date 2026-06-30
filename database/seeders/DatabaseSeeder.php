<?php

namespace Database\Seeders;

use App\Models\StaffUser;
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
        StaffUser::factory()->admin()->create([
            'full_name' => 'Test Admin',
            'email' => 'admin@example.com',
        ]);
    }
}
