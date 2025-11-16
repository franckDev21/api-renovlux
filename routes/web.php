<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('company-services/home', function () {
        return Inertia::render('company-services/home');
    })->name('company-services.home');

    Route::get('company-services/create', function () {
        return Inertia::render('company-services/create');
    })->name('company-services.create');

    Route::get('products/home', function () {
        return Inertia::render('products/home');
    })->name('products.home');

    Route::get('products/create', function () {
        return Inertia::render('products/create');
    })->name('products.create');

    Route::get('products/{id}', function (string $id) {
        return Inertia::render('products/show', ['id' => $id]);
    })->name('products.show');

    Route::get('products/{id}/edit', function (string $id) {
        return Inertia::render('products/edit', ['id' => $id]);
    })->name('products.edit');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
