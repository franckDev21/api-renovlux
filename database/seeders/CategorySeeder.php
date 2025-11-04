<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Rénovation Intérieure',
                'slug' => Str::slug('Rénovation Intérieure')
            ],
            [
                'name' => 'Travaux de Maçonnerie',
                'slug' => Str::slug('Travaux de Maçonnerie')
            ],
            [
                'name' => 'Électricité & Éclairage',
                'slug' => Str::slug('Électricité & Éclairage')
            ],
            [
                'name' => 'Plomberie & Sanitaire',
                'slug' => Str::slug('Plomberie & Sanitaire')
            ],
            [
                'name' => 'Isolation & Performance Énergétique',
                'slug' => Str::slug('Isolation & Performance Énergétique')
            ]
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
