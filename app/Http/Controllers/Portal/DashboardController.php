<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\StaffUser;
use App\Models\Task;
use App\Models\TaskOffer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $staff = $request->user();

        $myTasks = Task::assignedTo($staff->id)->where('status', 'in_progress')
            ->orderByDesc('created_at')->get();

        $pendingOffers = TaskOffer::with(['task.project'])
            ->where('offered_to', $staff->id)->where('response', 'pending')
            ->orderByDesc('created_at')->get();

        $myPoints = Task::assignedTo($staff->id)->countingTowardPoints()->sum('task_point');
        $pendingEarning = $staff->earnings()->where('status', 'pending')->sum('amount');
        $paidEarning = $staff->earnings()->where('status', 'paid')->sum('amount');

        $ranked = StaffUser::rankedByPoints();
        $mine = $ranked->firstWhere('id', $staff->id);

        $checks = [
            'Photo' => (bool) $staff->profile_image,
            'Bio' => filled(trim((string) $staff->bio)),
            'Expertise' => filled($staff->expertise),
            'WhatsApp' => filled($staff->whatsapp_number),
            'LinkedIn' => filled($staff->linkedin_url),
            'Services' => $staff->staffServices()->exists(),
            'Contracts' => $staff->staffProjects()->exists(),
        ];
        $completedChecks = count(array_filter($checks));

        $adminStats = null;
        if ($staff->is_admin) {
            $adminStats = [
                'totalClients' => DB::table('clients')->count(),
                'activeProjects' => DB::table('projects')->where('status', 'active')->count(),
                'pendingTasks' => DB::table('tasks')->where('status', 'pending')->count(),
                'pendingOffers' => DB::table('task_offers')->where('response', 'pending')->count(),
                'companyFund' => (float) DB::table('payment_distributions')->where('status', 'paid')->sum('company_cut_amount'),
            ];
        }

        return Inertia::render('Portal/Dashboard', [
            'staff' => [
                'fullName' => $staff->full_name,
                'firstName' => explode(' ', trim($staff->full_name))[0],
                'position' => $staff->position,
                'slug' => $staff->slug,
                'avatarUrl' => $staff->avatarUrl(),
                'initials' => $staff->initials(),
                'availabilityStatus' => $staff->availability_status,
            ],
            'stats' => [
                'activeGigs' => $myTasks->count(),
                'pendingOffers' => $pendingOffers->count(),
                'opportunityPoints' => $myPoints,
                'myRank' => $mine['rank'] ?? 0,
                'totalStaff' => $ranked->count(),
                'pendingEarning' => (float) $pendingEarning,
                'paidEarning' => (float) $paidEarning,
            ],
            'myTasks' => $myTasks->take(5)->map(fn (Task $t) => [
                'id' => $t->id,
                'title' => $t->title,
                'status' => $t->status,
                'dueDate' => $t->due_date?->format('d M'),
            ]),
            'pendingOffers' => $pendingOffers->take(3)->map(fn (TaskOffer $o) => [
                'id' => $o->id,
                'taskTitle' => $o->task->title,
                'projectTitle' => $o->task->project?->project_title,
                'taskPoint' => $o->task->task_point,
            ]),
            'checklist' => $checks,
            'checklistPct' => (int) round($completedChecks / count($checks) * 100),
            'leaderboard' => $ranked->take(5)->values(),
            'adminStats' => $adminStats,
        ]);
    }

    public function updateAvailability(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:available,busy,unavailable'],
        ]);

        $request->user()->update(['availability_status' => $validated['status']]);

        return back();
    }
}
