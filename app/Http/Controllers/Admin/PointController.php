<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\ContributionPoint;
use App\Models\OpportunityPoint;
use App\Models\Project;
use App\Models\StaffUser;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PointController extends Controller
{
    public function index(): Response
    {
        $contributions = ContributionPoint::with(['project', 'user', 'creator'])
            ->orderByDesc('created_at')->limit(100)->get();

        $opportunities = OpportunityPoint::with(['task', 'user'])
            ->orderByDesc('created_at')->limit(100)->get();

        return Inertia::render('Admin/Points/Index', [
            'leaderboard' => StaffUser::rankedByPoints(),
            'contributions' => $contributions->map(fn (ContributionPoint $c) => [
                'id' => $c->id,
                'projectTitle' => $c->project?->project_title,
                'staffName' => $c->user?->full_name,
                'point' => $c->point,
                'remark' => $c->remark,
                'createdByName' => $c->creator?->full_name,
                'createdAt' => $c->created_at->toIso8601String(),
            ]),
            'opportunities' => $opportunities->map(fn (OpportunityPoint $o) => [
                'id' => $o->id,
                'taskTitle' => $o->task?->title,
                'staffName' => $o->user?->full_name,
                'point' => $o->point,
                'reason' => $o->reason,
                'createdAt' => $o->created_at->toIso8601String(),
            ]),
            'projects' => Project::orderBy('project_title')->get(['id', 'project_title']),
            'tasks' => Task::orderByDesc('created_at')->limit(200)->get(['id', 'title']),
            'staff' => StaffUser::where('is_active', true)->orderBy('full_name')->get(['id', 'full_name']),
        ]);
    }

    public function storeContribution(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'project_id' => ['required', 'integer', 'exists:projects,id'],
            'user_id' => ['required', 'integer', 'exists:staff_users,id'],
            'point' => ['required', 'integer', 'min:1', 'max:255'],
            'remark' => ['nullable', 'string'],
        ]);

        $validated['created_by'] = $request->user()->id;
        ContributionPoint::create($validated);

        $staffName = StaffUser::find($validated['user_id'])?->full_name;
        ActivityLog::record($request->user()->id, 'contribution_point_awarded', 'points',
            "Awarded {$validated['point']} contribution point(s) to {$staffName}");

        return back()->with('success', 'Contribution point awarded.');
    }

    public function storeOpportunity(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'task_id' => ['required', 'integer', 'exists:tasks,id'],
            'user_id' => ['required', 'integer', 'exists:staff_users,id'],
            'point' => ['required', 'integer', 'min:1', 'max:255'],
            'reason' => ['nullable', 'string', 'max:300'],
        ]);

        OpportunityPoint::create($validated);

        $staffName = StaffUser::find($validated['user_id'])?->full_name;
        ActivityLog::record($request->user()->id, 'opportunity_point_awarded', 'points',
            "Awarded {$validated['point']} opportunity point(s) to {$staffName}");

        return back()->with('success', 'Opportunity point awarded.');
    }
}
