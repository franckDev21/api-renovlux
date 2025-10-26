<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectController;

// Routes pour les projets
Route::apiResource('projects', ProjectController::class)->except(['update']);
Route::post('projects/{project}', [ProjectController::class, 'update'])->name('projects.update');

// Routes pour les services
Route::apiResource('services', \App\Http\Controllers\Api\ServiceController::class);
