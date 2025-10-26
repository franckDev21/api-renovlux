<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // First add the columns as nullable
            $table->string('slug')->nullable()->after('title');
            $table->boolean('is_active')->default(true)->after('description');
            $table->string('image')->nullable()->after('is_active');
        });

        // Update existing records with slugs
        \App\Models\Service::all()->each(function ($service) {
            $service->update(['slug' => \Illuminate\Support\Str::slug($service->title)]);
        });

        // Now make the slug column unique
        Schema::table('services', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->unique()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['slug', 'is_active', 'image']);
        });
    }
};
