<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\Earning;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EarningController extends Controller
{
    public function index(Request $request): Response
    {
        $earnings = Earning::with(['task.project', 'paymentDistribution.project'])
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        $pending = $earnings->where('status', 'pending')->sum('amount');
        $paid = $earnings->where('status', 'paid')->sum('amount');
        $projectEarnings = $earnings->where('source_type', 'project');
        $taskEarnings = $earnings->where('source_type', 'task');

        return Inertia::render('Portal/Earnings/Index', [
            'stats' => [
                'pending' => (float) $pending,
                'paid' => (float) $paid,
                'projectTotal' => (float) $projectEarnings->sum('amount'),
                'projectCount' => $projectEarnings->count(),
                'taskTotal' => (float) $taskEarnings->sum('amount'),
                'taskCount' => $taskEarnings->count(),
            ],
            'earnings' => $earnings->map(fn (Earning $e) => [
                'id' => $e->id,
                'sourceType' => $e->source_type,
                'projectTitle' => $e->source_type === 'task'
                    ? $e->task?->project?->project_title
                    : $e->paymentDistribution?->project?->project_title,
                'taskTitle' => $e->task?->title,
                'earningType' => $e->earning_type,
                'amount' => (float) $e->amount,
                'status' => $e->status,
                'createdAt' => $e->created_at->toDateString(),
                'paidAt' => $e->paid_at?->toDateString(),
            ]),
        ]);
    }
}
