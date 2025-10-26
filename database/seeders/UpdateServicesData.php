<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UpdateServicesData extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('fr_FR');
        
        $services = \App\Models\Service::all();
        
        foreach ($services as $service) {
            // Mettre à jour le nom avec un nom aléatoire
            $service->name = $faker->unique()->words(3, true);
            
            // Mettre à jour la durée à "30 jours"
            $service->duration = '30 jours';
            
            // Mettre à jour l'image avec une URL d'image aléatoire si elle est nulle
            if (empty($service->image)) {
                $service->image = 'https://source.unsplash.com/random/400x300/?service';
            }
            
            $service->save();
        }
    }
}
