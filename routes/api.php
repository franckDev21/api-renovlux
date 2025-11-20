<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ServiceController;

// Routes pour les projets
Route::apiResource('projects', ProjectController::class)->except(['update']);
Route::post('projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
Route::delete('projects/{project}/secondary-images/{imagePath}', [ProjectController::class, 'deleteSecondaryImage'])
    ->where('imagePath', '.*') // Permet d'avoir des slashes dans le chemin
    ->name('projects.secondary-images.destroy');

// Routes pour les services (publiques pour la lecture)
Route::get('services', [\App\Http\Controllers\Api\ServiceController::class, 'index'])->name('services.index');
Route::get('services/{service}', [\App\Http\Controllers\Api\ServiceController::class, 'show'])->name('services.show');

// Routes pour les produits
// Routes publiques (pour le frontend Next.js)
Route::get('products', [ProductController::class, 'index'])->name('products.index');
Route::get('products/{product}', [ProductController::class, 'show'])->name('products.show');

// Routes authentifiées (pour le back-office Inertia)
// Utilisation de auth:web avec session (le middleware StartSessionForApi permet l'accès à la session)
Route::middleware('auth:web')->group(function () {
    Route::post('products', [ProductController::class, 'store'])->name('products.store');
    Route::post('products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::put('products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::patch('products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    
    // Routes authentifiées pour les services
    Route::post('services', [ServiceController::class, 'store'])->name('services.store');
    Route::put('services/{service}', [ServiceController::class, 'update'])->name('services.update');
    Route::patch('services/{service}', [ServiceController::class, 'update'])->name('services.update');
    Route::delete('services/{service}', [ServiceController::class, 'destroy'])->name('services.destroy');
    
    // Routes authentifiées pour les catégories (création/mise à jour/suppression)
    Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::patch('categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
});

// Routes publiques pour les catégories (lecture)
Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('categories/{category}', [CategoryController::class, 'show'])->name('categories.show');
