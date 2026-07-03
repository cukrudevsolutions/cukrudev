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
use App\Http\Controllers\Admin\ActivityLogController as AdminActivityLogController;
use App\Http\Controllers\Admin\ClientController;
use App\Http\Controllers\Admin\InquiryController as AdminInquiryController;
use App\Http\Controllers\Admin\MiddlemanController;
use App\Http\Controllers\Admin\PaymentCategoryController as AdminPaymentCategoryController;
use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Admin\PointController as AdminPointController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Admin\StaffController as AdminStaffController;
use App\Http\Controllers\Admin\TaskController as AdminTaskController;
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

        Route::get('/middlemen', [MiddlemanController::class, 'index'])->name('middlemen.index');
        Route::get('/middlemen-edit/{middleman?}', [MiddlemanController::class, 'edit'])->name('middlemen.edit');
        Route::post('/middlemen-edit/{middleman?}', [MiddlemanController::class, 'store'])->name('middlemen.store');
        Route::post('/middlemen/{middleman}/toggle-active', [MiddlemanController::class, 'toggleActive'])->name('middlemen.toggleActive');

        Route::get('/clients', [ClientController::class, 'index'])->name('clients.index');
        Route::get('/clients-edit/{client?}', [ClientController::class, 'edit'])->name('clients.edit');
        Route::post('/clients-edit/{client?}', [ClientController::class, 'store'])->name('clients.store');

        Route::get('/staff', [AdminStaffController::class, 'index'])->name('staff.index');
        Route::get('/staff-edit/{staff?}', [AdminStaffController::class, 'edit'])->name('staff.edit');
        Route::post('/staff-edit/{staff?}', [AdminStaffController::class, 'store'])->name('staff.store');
        Route::post('/staff/{staff}/toggle-active', [AdminStaffController::class, 'toggleActive'])->name('staff.toggleActive');

        Route::get('/inquiries', [AdminInquiryController::class, 'index'])->name('inquiries.index');
        Route::post('/inquiries', [AdminInquiryController::class, 'updateStatus'])->name('inquiries.updateStatus');

        Route::get('/projects', [AdminProjectController::class, 'index'])->name('projects.index');
        Route::get('/projects-edit/{project?}', [AdminProjectController::class, 'edit'])->name('projects.edit');
        Route::post('/projects-edit/{project?}', [AdminProjectController::class, 'store'])->name('projects.store');
        Route::post('/projects/{project}/contributors', [AdminProjectController::class, 'addContributor'])->name('projects.contributors.add');
        Route::delete('/projects/{project}/contributors/{staff}', [AdminProjectController::class, 'removeContributor'])->name('projects.contributors.remove');

        Route::get('/tasks', [AdminTaskController::class, 'index'])->name('tasks.index');
        Route::get('/tasks-edit/{task?}', [AdminTaskController::class, 'edit'])->name('tasks.edit');
        Route::post('/tasks-edit/{task?}', [AdminTaskController::class, 'store'])->name('tasks.store');
        Route::post('/tasks/{task}/offer', [AdminTaskController::class, 'offer'])->name('tasks.offer');
        Route::delete('/tasks/{task}/offer/{offer}', [AdminTaskController::class, 'withdrawOffer'])->name('tasks.offer.withdraw');

        Route::get('/points', [AdminPointController::class, 'index'])->name('points.index');
        Route::post('/points/contributions', [AdminPointController::class, 'storeContribution'])->name('points.contributions.store');
        Route::post('/points/opportunities', [AdminPointController::class, 'storeOpportunity'])->name('points.opportunities.store');

        Route::get('/activity-log', [AdminActivityLogController::class, 'index'])->name('activityLog.index');

        Route::get('/payments/project/{project}', [AdminPaymentController::class, 'project'])->name('payments.project');
        Route::post('/payments/project/{project}', [AdminPaymentController::class, 'processProject'])->name('payments.project.process');
        Route::get('/payments/task/{task}', [AdminPaymentController::class, 'task'])->name('payments.task');
        Route::post('/payments/task/{task}', [AdminPaymentController::class, 'processTask'])->name('payments.task.process');
        Route::post('/payments/stages', [AdminPaymentController::class, 'addStage'])->name('payments.stages.add');
        Route::post('/payments/stages/{stage}/invoice', [AdminPaymentController::class, 'markStageInvoiced'])->name('payments.stages.invoice');
        Route::post('/payments/stages/{stage}/paid', [AdminPaymentController::class, 'markStagePaid'])->name('payments.stages.paid');
        Route::delete('/payments/stages/{stage}', [AdminPaymentController::class, 'deleteStage'])->name('payments.stages.delete');
        Route::post('/payments/earnings/{earning}/transfer', [AdminPaymentController::class, 'markTransferred'])->name('payments.earnings.transfer');

        Route::get('/payment-categories', [AdminPaymentCategoryController::class, 'index'])->name('paymentCategories.index');
        Route::post('/payment-categories', [AdminPaymentCategoryController::class, 'update'])->name('paymentCategories.update');
    });
});

require __DIR__.'/auth.php';

// Catch-all staff profile slug — must stay last so it doesn't swallow routes above.
Route::get('/{slug}', [ProfileController::class, 'show'])
    ->where('slug', '[a-zA-Z0-9_-]+')
    ->name('profile.show');
