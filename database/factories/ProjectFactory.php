<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $createdAt = $this->faker->dateTimeBetween('-1 year', 'now');
        
        return [
            'uuid' => (string) \Illuminate\Support\Str::uuid(),
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(3),
            'image' => 'projects/' . $this->faker->image('public/storage/projects', 800, 600, null, false),
            'category_id' => \App\Models\Category::factory(),
            'created_at' => $createdAt,
            'updated_at' => $this->faker->dateTimeBetween($createdAt, 'now'),
        ];
    }
}
