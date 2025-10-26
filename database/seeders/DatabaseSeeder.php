<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Créer un utilisateur de test
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Exécuter les seeders pour les catégories, les projets et les services
        $this->call([
            CategorySeeder::class,
            ProjectSeeder::class,
            ServiceSeeder::class,
        ]);
    }
}
