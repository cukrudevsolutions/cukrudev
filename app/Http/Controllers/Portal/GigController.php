<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GigController extends Controller
{
    /** Mirrors the legacy allowed status transitions a staff member may self-trigger. */
    private const ALLOWED_TRANSITIONS = [
        'accepted' => ['in_progress'],
        'in_progress' => ['submitted'],
        'revision' => ['in_progress'],
    ];

    public function index(Request $request): Response
    {
        $userId = $request->user()->id;
        $status = $request->query('status', '');
        $projectId = (int) $request->query('project', 0);

        $query = Task::assignedTo($userId)->with('project');

        if ($status) {
            $query->where('status', $status);
        }
        if ($projectId) {
            $query->where('project_id', $projectId);
        }

        $tasks = $query->orderByDesc('created_at')->get();

        $counts = Task::assignedTo($userId)
            ->selectRaw('status, count(*) as n')
            ->groupBy('status')
            ->pluck('n', 'status');

        return Inertia::render('Portal/Gigs/Index', [
            'tasks' => $tasks->map(fn (Task $t) => [
                'id' => $t->id,
                'title' => $t->title,
                'status' => $t->status,
                'taskType' => $t->task_type,
                'taskPoint' => $t->task_point,
                'dueDate' => $t->due_date?->toDateString(),
                'completedAt' => $t->completed_at?->toDateString(),
                'projectId' => $t->project_id,
                'projectTitle' => $t->project?->project_title,
            ]),
            'counts' => $counts,
            'filterStatus' => $status,
            'filterProject' => $projectId ?: null,
        ]);
    }

    public function show(Request $request, Task $task): Response|RedirectResponse
    {
        if ($task->assigned_to !== $request->user()->id) {
            return redirect()->route('portal.gigs.index')->with('error', 'Task not found or not assigned to you.');
        }

        $task->load('project');

        return Inertia::render('Portal/Gigs/Show', [
            'task' => [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'status' => $task->status,
                'taskType' => $task->task_type,
                'taskPoint' => $task->task_point,
                'dueDate' => $task->due_date?->toDateString(),
                'completedAt' => $task->completed_at?->toDateString(),
                'progressNotes' => $task->progress_notes,
                'projectTitle' => $task->project?->project_title,
            ],
            'allowedNextStatuses' => self::ALLOWED_TRANSITIONS[$task->status] ?? [],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'task_id' => ['required', 'integer'],
            'new_status' => ['required', 'string'],
            'progress_notes' => ['nullable', 'string'],
        ]);

        $task = Task::findOrFail($validated['task_id']);

        if ($task->assigned_to !== $request->user()->id) {
            return redirect()->route('portal.gigs.index')->with('error', 'Task not found.');
        }

        $allowed = self::ALLOWED_TRANSITIONS[$task->status] ?? [];

        if (! in_array($validated['new_status'], $allowed, true)) {
            return redirect()->route('portal.gigs.show', $task)->with('error', 'Invalid status transition.');
        }

        $task->update([
            'status' => $validated['new_status'],
            'progress_notes' => $validated['progress_notes'] ?: null,
        ]);

        return redirect()->route('portal.gigs.show', $task)
            ->with('success', 'Task updated to '.str_replace('_', ' ', $validated['new_status']).'.');
    }
}
