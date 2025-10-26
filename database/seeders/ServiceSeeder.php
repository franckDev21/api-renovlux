<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 5 services, each with 3-5 service items
        \App\Models\Service::factory()
            ->count(5)
            ->has(\App\Models\ServiceItem::factory()->count(rand(3, 5)))
            ->create();
    }
}
