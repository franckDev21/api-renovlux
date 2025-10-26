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
            // Rename title to name
            $table->renameColumn('title', 'name');
            
            // Add missing fields
            $table->decimal('price', 10, 2)->default(0)->after('description');
            $table->integer('duration')->default(30)->after('price')->comment('Duration in minutes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->renameColumn('name', 'title');
            $table->dropColumn(['price', 'duration']);
        });
    }
};
