<?php

use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\InquiryController;
use App\Http\Controllers\Public\LinksController;
use App\Http\Controllers\Public\ProfileController;
use App\Http\Controllers\Public\VCardController;
use App\Http\Controllers\Portal\CardController;
use App\Http\Controllers\Portal\ContractController;
use App\Http\Controllers\Portal\DashboardController;
use App\Http\Controllers\Portal\EarningController;
use App\Http\Controllers\Portal\GigController;
use App\Http\Controllers\Portal\OfferController;
use App\Http\Controllers\Portal\PointController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');
Route::post('/submit-inquiry', [InquiryController::class, 'store'])->name('inquiry.store');
Route::get('/links', LinksController::class)->name('links');
Route::get('/download-vcard/{slug}', [VCardController::class, 'download'])->name('vcard.download');

Route::middleware('auth')->prefix('portal')->name('portal.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/availability', [DashboardController::class, 'updateAvailability'])->name('availability.update');

    Route::get('/card', [CardController::class, 'show'])->name('card.show');
    Route::get('/card/edit', [CardController::class, 'edit'])->name('card.edit');
    Route::post('/card', [CardController::class, 'update'])->name('card.update');

    Route::get('/contracts', [ContractController::class, 'index'])->name('contracts.index');

    Route::get('/gigs', [GigController::class, 'index'])->name('gigs.index');
    Route::get('/gigs/{task}', [GigController::class, 'show'])->name('gigs.show');
    Route::post('/gigs/update', [GigController::class, 'update'])->name('gigs.update');

    Route::get('/offers', [OfferController::class, 'index'])->name('offers.index');
    Route::post('/offers/respond', [OfferController::class, 'respond'])->name('offers.respond');

    Route::get('/points', [PointController::class, 'index'])->name('points.index');
    Route::get('/earnings', [EarningController::class, 'index'])->name('earnings.index');

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
