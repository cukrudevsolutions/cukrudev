<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Client;
use App\Models\Middleman;
use App\Models\Project;
use App\Models\StaffUser;
use App\Models\Task;
use App\Models\TaskOffer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    private const TYPES = [
        'minor_fix', 'small_bug_fix', 'simple_ui_task', 'setup_task',
        'medium_feature', 'module_feature', 'complex_feature', 'full_project_lead',
    ];

    private const STATUSES = [
        'pending', 'offered', 'accepted', 'in_progress', 'submitted',
        'revision', 'completed', 'paid', 'cancelled',
    ];

    public function index(Request $request): Response
    {
        $statusFilter = trim((string) $request->query('status', ''));
        $projectFilter = (int) $request->query('project', 0);

        $query = Task::with(['project', 'assignee']);

        if ($statusFilter !== '' && in_array($statusFilter, self::STATUSES, true)) {
            $query->where('status', $statusFilter);
        }
        if ($projectFilter) {
            $query->where('project_id', $projectFilter);
        }

        $tasks = $query->orderByDesc('created_at')->get();

        return Inertia::render('Admin/Tasks/Index', [
            'tasks' => $tasks->map(fn (Task $t) => [
                'id' => $t->id,
                'title' => $t->title,
                'projectId' => $t->project_id,
                'projectTitle' => $t->project?->project_title,
                'taskType' => $t->task_type,
                'taskPoint' => $t->task_point,
                'status' => $t->status,
                'assigneeName' => $t->assignee?->full_name,
                'dueDate' => $t->due_date?->toDateString(),
            ]),
            'statuses' => self::STATUSES,
            'projects' => Project::orderByDesc('created_at')->get(['id', 'project_title']),
            'statusFilter' => $statusFilter,
            'projectFilter' => $projectFilter ?: null,
        ]);
    }

    public function edit(?Task $task = null): Response
    {
        $pendingOffer = $task?->offers()->where('response', 'pending')->with('offeredTo')->first();

        return Inertia::render('Admin/Tasks/Edit', [
            'task' => $task ? [
                'id' => $task->id,
                'projectId' => $task->project_id,
                'clientId' => $task->client_id,
                'title' => $task->title,
                'description' => $task->description,
                'repoUrl' => $task->repo_url,
                'taskType' => $task->task_type,
                'taskPoint' => $task->task_point,
                'taskValue' => $task->task_value,
                'middlemanApplies' => $task->middleman_applies,
                'middlemanId' => $task->middleman_id,
                'assignedTo' => $task->assigned_to,
                'assigneeName' => $task->assignee?->full_name,
                'status' => $task->status,
                'progressNotes' => $task->progress_notes,
                'dueDate' => $task->due_date?->toDateString(),
                'warrantyMonths' => $task->warranty_months,
                'warrantyNotes' => $task->warranty_notes,
                'pendingOffer' => $pendingOffer ? [
                    'id' => $pendingOffer->id,
                    'staffName' => $pendingOffer->offeredTo->full_name,
                    'createdAt' => $pendingOffer->created_at->toIso8601String(),
                ] : null,
                'offerHistory' => $task->offers()->with('offeredTo')->orderByDesc('created_at')->get()->map(fn (TaskOffer $o) => [
                    'id' => $o->id,
                    'staffName' => $o->offeredTo->full_name,
                    'response' => $o->response,
                    'reason' => $o->reason,
                    'createdAt' => $o->created_at->toIso8601String(),
                    'respondedAt' => $o->responded_at?->toIso8601String(),
                ]),
            ] : null,
            'projects' => Project::orderBy('project_title')->get(['id', 'project_title', 'client_id']),
            'clients' => Client::orderBy('client_name')->get(['id', 'client_name']),
            'middlemen' => Middleman::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'rankedStaff' => StaffUser::rankedByPoints(),
            'types' => self::TYPES,
            'statuses' => self::STATUSES,
        ]);
    }

    public function store(Request $request, ?Task $task = null): RedirectResponse
    {
        $validated = $request->validate([
            'project_id' => ['nullable', 'integer', 'exists:projects,id'],
            'client_id' => ['nullable', 'integer', 'exists:clients,id'],
            'title' => ['required', 'string', 'max:300'],
            'description' => ['nullable', 'string'],
            'repo_url' => ['nullable', 'string', 'max:500'],
            'task_type' => ['required', 'string', 'in:'.implode(',', self::TYPES)],
            'task_point' => ['required', 'integer', 'min:0', 'max:255'],
            'task_value' => ['nullable', 'numeric', 'min:0'],
            'middleman_applies' => ['boolean'],
            'middleman_id' => ['nullable', 'integer', 'exists:middlemen,id'],
            'status' => ['required', 'string', 'in:'.implode(',', self::STATUSES)],
            'progress_notes' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'warranty_months' => ['nullable', 'integer', 'min:0', 'max:255'],
            'warranty_notes' => ['nullable', 'string'],
        ]);

        $isNew = ! $task;
        $task ??= new Task();
        $task->fill($validated);
        $task->save();

        ActivityLog::record($request->user()->id, $isNew ? 'task_created' : 'task_updated', 'tasks',
            ($isNew ? 'Created' : 'Updated').' task: '.$task->title);

        return redirect()->route('portal.admin.tasks.edit', $task)
            ->with('success', 'Task '.($isNew ? 'created' : 'updated').' successfully.');
    }

    public function offer(Request $request, Task $task): RedirectResponse
    {
        if ($task->offers()->where('response', 'pending')->exists() || $task->assigned_to) {
            return back()->with('error', 'This task already has a pending offer or an assignee.');
        }

        $validated = $request->validate([
            'staff_id' => ['required', 'integer', 'exists:staff_users,id'],
        ]);

        TaskOffer::create([
            'task_id' => $task->id,
            'offered_to' => $validated['staff_id'],
            'response' => 'pending',
        ]);
        $task->update(['status' => 'offered']);

        $staffName = StaffUser::find($validated['staff_id'])?->full_name;
        ActivityLog::record($request->user()->id, 'task_offered', 'tasks',
            "Offered task \"{$task->title}\" to {$staffName}");

        return back()->with('success', 'Task offered to '.$staffName.'.');
    }

    public function withdrawOffer(Request $request, Task $task, TaskOffer $offer): RedirectResponse
    {
        if ($offer->task_id !== $task->id || $offer->response !== 'pending') {
            return back()->with('error', 'Offer not found or already responded.');
        }

        $offer->delete();
        $task->update(['status' => 'pending']);

        ActivityLog::record($request->user()->id, 'task_offer_withdrawn', 'tasks',
            'Withdrew pending offer for task: '.$task->title);

        return back()->with('success', 'Offer withdrawn.');
    }
}
