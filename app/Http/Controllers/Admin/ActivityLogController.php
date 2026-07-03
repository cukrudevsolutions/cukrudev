<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $moduleFilter = trim((string) $request->query('module', ''));
        $search = trim((string) $request->query('search', ''));

        $query = ActivityLog::with('user');

        if ($moduleFilter !== '') {
            $query->where('module', $moduleFilter);
        }
        if ($search !== '') {
            $query->where('description', 'like', "%{$search}%");
        }

        $logs = $query->orderByDesc('created_at')->orderByDesc('id')->limit(200)->get();

        return Inertia::render('Admin/ActivityLog/Index', [
            'logs' => $logs->map(fn (ActivityLog $l) => [
                'id' => $l->id,
                'userName' => $l->user?->full_name,
                'action' => $l->action,
                'module' => $l->module,
                'description' => $l->description,
                'createdAt' => $l->created_at->toIso8601String(),
            ]),
            'modules' => ActivityLog::query()->distinct()->orderBy('module')->pluck('module'),
            'moduleFilter' => $moduleFilter,
            'search' => $search,
        ]);
    }
}
