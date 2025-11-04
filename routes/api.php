<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectController;

// Routes pour les projets
Route::apiResource('projects', ProjectController::class)->except(['update']);
Route::post('projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
Route::delete('projects/{project}/secondary-images/{imagePath}', [ProjectController::class, 'deleteSecondaryImage'])
    ->where('imagePath', '.*') // Permet d'avoir des slashes dans le chemin
    ->name('projects.secondary-images.destroy');

// Routes pour les services
Route::apiResource('services', \App\Http\Controllers\Api\ServiceController::class);
