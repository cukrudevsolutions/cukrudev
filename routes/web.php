<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/portal/dashboard');

Route::middleware('auth')->prefix('portal')->name('portal.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Portal/Dashboard');
    })->name('dashboard');

    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('dashboard');
    });
});

require __DIR__.'/auth.php';
