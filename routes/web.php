<?php

use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\InquiryController;
use App\Http\Controllers\Public\LinksController;
use App\Http\Controllers\Public\ProfileController;
use App\Http\Controllers\Public\VCardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');
Route::post('/submit-inquiry', [InquiryController::class, 'store'])->name('inquiry.store');
Route::get('/links', LinksController::class)->name('links');
Route::get('/download-vcard/{slug}', [VCardController::class, 'download'])->name('vcard.download');

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

// Catch-all staff profile slug — must stay last so it doesn't swallow routes above.
Route::get('/{slug}', [ProfileController::class, 'show'])
    ->where('slug', '[a-zA-Z0-9_-]+')
    ->name('profile.show');
