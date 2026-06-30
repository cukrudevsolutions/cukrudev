<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\TaskOffer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OfferController extends Controller
{
    public function index(Request $request): Response
    {
        $offers = TaskOffer::with(['task.project'])
            ->where('offered_to', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        $present = fn (TaskOffer $o) => [
            'id' => $o->id,
            'taskTitle' => $o->task->title,
            'projectTitle' => $o->task->project?->project_title,
            'taskType' => $o->task->task_type,
            'taskPoint' => $o->task->task_point,
            'taskValue' => $o->task->task_value ? (float) $o->task->task_value : null,
            'middlemanApplies' => $o->task->middleman_applies,
            'dueDate' => $o->task->due_date?->toDateString(),
            'description' => $o->task->description,
            'repoUrl' => $o->task->repo_url,
            'response' => $o->response,
            'reason' => $o->reason,
            'createdAt' => $o->created_at->toIso8601String(),
            'respondedAt' => $o->responded_at?->toIso8601String(),
            'breakdown' => $o->task->task_value > 0 ? $this->payBreakdown((float) $o->task->task_value, $o->task->middleman_applies) : null,
        ];

        return Inertia::render('Portal/Offers/Index', [
            'pending' => $offers->where('response', 'pending')->values()->map($present),
            'history' => $offers->where('response', '!=', 'pending')->values()->map($present),
        ]);
    }

    public function respond(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'offer_id' => ['required', 'integer'],
            'response' => ['required', 'in:accepted,rejected'],
            'reason' => ['nullable', 'string'],
        ]);

        $offer = TaskOffer::where('id', $validated['offer_id'])
            ->where('offered_to', $request->user()->id)
            ->where('response', 'pending')
            ->first();

        if (! $offer) {
            return redirect()->route('portal.offers.index')->with('error', 'Offer not found or already responded.');
        }

        $offer->update([
            'response' => $validated['response'],
            'reason' => $validated['reason'] ?? null,
            'responded_at' => now(),
        ]);

        if ($validated['response'] === 'accepted') {
            $offer->task->update(['status' => 'accepted', 'assigned_to' => $offer->offered_to]);
        } else {
            $offer->task->update(['status' => 'pending', 'assigned_to' => null]);
        }

        $message = $validated['response'] === 'accepted'
            ? 'Task offer accepted! It is now in your tasks.'
            : 'Task offer rejected.';

        return redirect()->route('portal.offers.index')->with('success', $message);
    }

    /** @return array{dev: array{pct:int,amt:float}, comp: array{pct:int,amt:float}, mm: array{pct:int,amt:float}} */
    private function payBreakdown(float $value, bool $hasMiddleman): array
    {
        $devPct = 70;
        $mmPct = $hasMiddleman ? 10 : 0;
        $compPct = $hasMiddleman ? 20 : 30;

        return [
            'dev' => ['pct' => $devPct, 'amt' => $value * $devPct / 100],
            'comp' => ['pct' => $compPct, 'amt' => $value * $compPct / 100],
            'mm' => ['pct' => $mmPct, 'amt' => $value * $mmPct / 100],
        ];
    }
}
