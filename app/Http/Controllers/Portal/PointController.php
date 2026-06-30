<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\StaffUser;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PointController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = $request->user()->id;
        $ranked = StaffUser::rankedByPoints();
        $mine = $ranked->firstWhere('id', $userId);
        $topPoints = $ranked->max('total_points') ?? 0;
        $nextPerson = $ranked->sortBy('total_points')->first();

        $history = Task::assignedTo($userId)->countingTowardPoints()
            ->with('project')
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (Task $t) => [
                'taskTitle' => $t->title,
                'projectTitle' => $t->project?->project_title,
                'point' => $t->task_point,
                'reason' => $t->status,
                'date' => $t->updated_at->toDateString(),
            ]);

        return Inertia::render('Portal/Points/Index', [
            'myPoints' => $mine['total_points'] ?? 0,
            'myRank' => $mine['rank'] ?? 0,
            'totalStaff' => $ranked->count(),
            'isNext' => $nextPerson && $nextPerson['id'] === $userId,
            'nextPerson' => $nextPerson,
            'leaderboard' => $ranked->values(),
            'topPoints' => $topPoints,
            'history' => $history,
        ]);
    }
}
