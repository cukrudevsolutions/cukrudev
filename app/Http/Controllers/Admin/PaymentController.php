<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Earning;
use App\Models\PaymentCategory;
use App\Models\PaymentDistribution;
use App\Models\PaymentStage;
use App\Models\Project;
use App\Models\ProjectContributor;
use App\Models\ProjectDistribution;
use App\Models\StaffUser;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function project(Project $project): Response
    {
        $payment = PaymentDistribution::where('project_id', $project->id)->orderByDesc('id')->first();
        $source = $project->project_source ?? 'team_sourced';

        $dists = $this->distributionsForProject($project, $source);
        $devPct = $dists->firstWhere('categoryKey', 'dev')['pct'] ?? 0;
        $defaultAmount = $payment ? (float) $payment->total_amount : (float) ($project->total_value ?? 0);

        $devSplit = $this->devPoolSplitWithStaff($project, $defaultAmount * $devPct / 100);

        $earnings = $payment
            ? Earning::where('payment_id', $payment->id)->with('user')->orderByDesc('amount')->get()
            : collect();

        return Inertia::render('Admin/Payments/Project', [
            'project' => [
                'id' => $project->id,
                'title' => $project->project_title,
                'clientName' => $project->client?->client_name,
                'type' => $project->project_type,
                'source' => $source,
                'status' => $project->status,
                'totalValue' => $project->total_value ? (float) $project->total_value : null,
            ],
            'payment' => $payment ? [
                'id' => $payment->id,
                'totalAmount' => (float) $payment->total_amount,
                'createdAt' => $payment->created_at->toIso8601String(),
            ] : null,
            'distributions' => $dists->values(),
            'devSplit' => $devSplit->values(),
            'defaultAmount' => $defaultAmount,
            'earnings' => $earnings->map(fn (Earning $e) => [
                'id' => $e->id,
                'staffName' => $e->user?->full_name,
                'amount' => (float) $e->amount,
                'earningType' => $e->earning_type,
                'status' => $e->status,
                'transferRef' => $e->transfer_ref,
                'transferredAt' => $e->transferred_at?->toIso8601String(),
                'bankName' => $e->user?->bank_name,
                'bankAccountNo' => $e->user?->bank_account_no,
            ]),
            'stages' => $this->stagesFor(projectId: $project->id),
        ]);
    }

    public function processProject(Request $request, Project $project): RedirectResponse
    {
        if (PaymentDistribution::where('project_id', $project->id)->exists()) {
            return back()->with('error', 'Payment already processed for this project.');
        }

        $validated = $request->validate([
            'total_amount' => ['required', 'numeric', 'min:0.01'],
            'transfer_refs' => ['array'],
            'transfer_refs.*' => ['nullable', 'string'],
        ]);

        $totalAmount = (float) $validated['total_amount'];
        $source = $project->project_source ?? 'team_sourced';

        $cats = $this->distributionsForProject($project, $source)
            ->keyBy('categoryKey')
            ->map(fn ($d) => ['pct' => $d['pct'], 'amount' => round($totalAmount * $d['pct'] / 100, 2)]);

        $devAmt = $cats['dev']['amount'] ?? 0;
        $devSplit = $devAmt > 0 ? $this->devPoolSplit($project, $devAmt) : collect();

        foreach ($devSplit as $row) {
            if (trim($validated['transfer_refs'][$row['userId']] ?? '') === '') {
                return back()->with('error', 'Enter bank transfer receipt number for every staff member before confirming.');
            }
        }

        $payment = PaymentDistribution::create([
            'project_id' => $project->id,
            'project_source' => $source,
            'total_amount' => $totalAmount,
            'company_cut_pct' => $cats['company']['pct'] ?? 0,
            'company_cut_amount' => $cats['company']['amount'] ?? 0,
            'opex_pct' => $cats['opex']['pct'] ?? 0,
            'opex_amount' => $cats['opex']['amount'] ?? 0,
            'dev_pool_pct' => $cats['dev']['pct'] ?? 0,
            'dev_pool_amount' => $devAmt,
            'mentor_pct' => $cats['mentor']['pct'] ?? 0,
            'mentor_amount' => $cats['mentor']['amount'] ?? 0,
            'middleman_pct' => $cats['middleman']['pct'] ?? 0,
            'middleman_amount' => $cats['middleman']['amount'] ?? 0,
            'investor_pct' => $cats['investor']['pct'] ?? 0,
            'investor_amount' => $cats['investor']['amount'] ?? 0,
            'sales_pct' => $cats['middleman']['pct'] ?? 0,
            'sales_amount' => $cats['middleman']['amount'] ?? 0,
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        foreach ($devSplit as $row) {
            $earning = Earning::create([
                'payment_id' => $payment->id,
                'user_id' => $row['userId'],
                'amount' => $row['amount'],
                'earning_type' => 'dev_share',
                'status' => 'pending',
                'source_type' => 'project',
            ]);
            $earning->update([
                'transfer_ref' => trim($validated['transfer_refs'][$row['userId']]),
                'transferred_at' => now(),
                'status' => 'paid',
                'paid_at' => now(),
            ]);
        }

        $mentorAmt = $cats['mentor']['amount'] ?? 0;
        if ($mentorAmt > 0 && $project->mentor_id) {
            Earning::create([
                'payment_id' => $payment->id,
                'user_id' => $project->mentor_id,
                'amount' => $mentorAmt,
                'earning_type' => 'dev_share',
                'status' => 'pending',
                'source_type' => 'project',
            ]);
        }

        $project->update(['status' => 'paid']);
        Task::where('project_id', $project->id)->where('status', 'completed')->update(['status' => 'paid']);

        ActivityLog::record($request->user()->id, 'payment_processed', 'payments',
            "Project #{$project->id} payment RM ".number_format($totalAmount, 2).' processed');

        return redirect()->route('portal.admin.payments.project', $project)
            ->with('success', 'Payment processed and all staff transfers recorded.');
    }

    public function task(Task $task): Response
    {
        $payment = PaymentDistribution::where('task_id', $task->id)->orderByDesc('id')->first();
        $source = $task->middleman_applies ? 'task_mm' : 'task';
        $cats = PaymentCategory::forSource($source)->get();

        $defaultAmount = $payment ? (float) $payment->total_amount : (float) ($task->task_value ?? 0);
        $middlemanName = $task->project?->middleman?->name;

        $earnings = $payment
            ? Earning::where('payment_id', $payment->id)->with('user')->orderByDesc('amount')->get()
            : collect();

        return Inertia::render('Admin/Payments/Task', [
            'task' => [
                'id' => $task->id,
                'title' => $task->title,
                'assigneeName' => $task->assignee?->full_name,
                'assignedTo' => $task->assigned_to,
                'projectTitle' => $task->project?->project_title,
                'taskType' => $task->task_type,
                'status' => $task->status,
                'taskValue' => $task->task_value ? (float) $task->task_value : null,
                'middlemanApplies' => $task->middleman_applies,
                'middlemanName' => $middlemanName,
                'bankName' => $task->assignee?->bank_name,
                'bankAccountNo' => $task->assignee?->bank_account_no,
            ],
            'payment' => $payment ? [
                'id' => $payment->id,
                'totalAmount' => (float) $payment->total_amount,
                'createdAt' => $payment->created_at->toIso8601String(),
            ] : null,
            'categories' => $cats->map(fn (PaymentCategory $c) => [
                'key' => $c->config_key,
                'name' => $c->display_name,
                'pct' => (float) $c->pct,
                'color' => $c->color,
            ]),
            'defaultAmount' => $defaultAmount,
            'earnings' => $earnings->map(fn (Earning $e) => [
                'id' => $e->id,
                'staffName' => $e->user?->full_name,
                'amount' => (float) $e->amount,
                'earningType' => $e->earning_type,
                'status' => $e->status,
                'transferRef' => $e->transfer_ref,
                'transferredAt' => $e->transferred_at?->toIso8601String(),
            ]),
            'stages' => $this->stagesFor(taskId: $task->id),
        ]);
    }

    public function processTask(Request $request, Task $task): RedirectResponse
    {
        if (PaymentDistribution::where('task_id', $task->id)->exists()) {
            return back()->with('error', 'Payment already processed for this task.');
        }
        if (! $task->assigned_to) {
            return back()->with('error', 'Task has no assignee.');
        }

        $validated = $request->validate([
            'total_amount' => ['required', 'numeric', 'min:0.01'],
            'transfer_ref' => ['required', 'string'],
        ]);

        $totalAmount = (float) $validated['total_amount'];
        $source = $task->middleman_applies ? 'task_mm' : 'task';
        $cats = PaymentCategory::forSource($source)->get()->keyBy('config_key');

        $devPct = (float) ($cats['dev']->pct ?? 70);
        $companyPct = (float) ($cats['company']->pct ?? 30);
        $middlemanPct = (float) ($cats['middleman']->pct ?? 0);

        $devAmt = round($totalAmount * $devPct / 100, 2);
        $companyAmt = round($totalAmount * $companyPct / 100, 2);
        $middlemanAmt = round($totalAmount * $middlemanPct / 100, 2);

        $payment = PaymentDistribution::create([
            'task_id' => $task->id,
            'project_source' => $source,
            'total_amount' => $totalAmount,
            'company_cut_pct' => $companyPct,
            'company_cut_amount' => $companyAmt,
            'dev_pool_pct' => $devPct,
            'dev_pool_amount' => $devAmt,
            'middleman_pct' => $middlemanPct,
            'middleman_amount' => $middlemanAmt,
            'sales_pct' => $middlemanPct,
            'sales_amount' => $middlemanAmt,
            'middleman_name' => $task->project?->middleman?->name,
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        $earning = Earning::create([
            'payment_id' => $payment->id,
            'task_id' => $task->id,
            'user_id' => $task->assigned_to,
            'amount' => $devAmt,
            'earning_type' => 'task_share',
            'status' => 'pending',
            'source_type' => 'task',
        ]);
        $earning->update([
            'transfer_ref' => trim($validated['transfer_ref']),
            'transferred_at' => now(),
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        $task->update(['status' => 'paid']);

        ActivityLog::record($request->user()->id, 'task_paid', 'payments',
            "Task #{$task->id} \"{$task->title}\" paid RM ".number_format($totalAmount, 2).
            ' — Dev: RM '.number_format($devAmt, 2).($middlemanAmt > 0 ? ' | MM: RM '.number_format($middlemanAmt, 2) : ''));

        return redirect()->route('portal.admin.payments.task', $task)
            ->with('success', 'Payment processed and transfer recorded.');
    }

    public function addStage(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'project_id' => ['nullable', 'integer', 'exists:projects,id'],
            'task_id' => ['nullable', 'integer', 'exists:tasks,id'],
            'stage_label' => ['required', 'string', 'max:100'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ]);

        $projectId = $validated['project_id'] ?? null;
        $taskId = $validated['task_id'] ?? null;

        $count = PaymentStage::where('project_id', $projectId)->where('task_id', $taskId)->count();

        PaymentStage::create([
            'project_id' => $projectId,
            'task_id' => $taskId,
            'stage_label' => $validated['stage_label'],
            'amount' => $validated['amount'],
            'percentage' => $validated['percentage'] ?? null,
            'stage_order' => $count + 1,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Stage added.');
    }

    public function markStageInvoiced(PaymentStage $stage): RedirectResponse
    {
        $prefix = $stage->project_id ? 'P'.sprintf('%03d', $stage->project_id) : 'T'.sprintf('%03d', $stage->task_id);

        $stage->update([
            'status' => 'invoiced',
            'invoice_ref' => 'INV-'.now()->format('Ymd').'-'.$prefix.'-S'.$stage->stage_order,
            'invoice_sent_at' => now(),
        ]);

        return back()->with('success', 'Invoice marked as sent.');
    }

    public function markStagePaid(PaymentStage $stage): RedirectResponse
    {
        $prefix = $stage->project_id ? 'P'.sprintf('%03d', $stage->project_id) : 'T'.sprintf('%03d', $stage->task_id);

        $stage->update([
            'status' => 'paid',
            'paid_at' => now(),
            'receipt_ref' => 'REC-'.now()->format('Ymd').'-'.$prefix.'-S'.$stage->stage_order,
        ]);

        return back()->with('success', 'Stage marked as paid.');
    }

    public function deleteStage(PaymentStage $stage): RedirectResponse
    {
        if ($stage->status === 'pending') {
            $stage->delete();
        }

        return back()->with('success', 'Stage deleted.');
    }

    public function markTransferred(Request $request, Earning $earning): RedirectResponse
    {
        $validated = $request->validate(['transfer_ref' => ['required', 'string']]);

        $earning->update([
            'transfer_ref' => trim($validated['transfer_ref']),
            'transferred_at' => now(),
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        return back()->with('success', 'Transfer marked as done.');
    }

    /** @return Collection<int, array{categoryKey:string,categoryName:string,pct:float,color:string}> */
    private function distributionsForProject(Project $project, string $source): Collection
    {
        $saved = ProjectDistribution::where('project_id', $project->id)->get();

        if ($saved->isNotEmpty()) {
            return $saved->map(fn (ProjectDistribution $d) => [
                'categoryKey' => $d->category_key,
                'categoryName' => $d->category_name,
                'pct' => (float) $d->pct,
                'color' => $d->color,
            ]);
        }

        return PaymentCategory::forSource($source)->get()->map(fn (PaymentCategory $c) => [
            'categoryKey' => $c->config_key,
            'categoryName' => $c->display_name,
            'pct' => (float) $c->pct,
            'color' => $c->color,
        ]);
    }

    /**
     * Authoritative dev-pool split: explicit contributor % > completed-task points > equal
     * split among contributors. Used identically for preview and for actual processing so
     * the two can never disagree.
     *
     * @return Collection<int, array{userId:int,pct:float,amount:float}>
     */
    private function devPoolSplit(Project $project, float $devAmt): Collection
    {
        $contributors = ProjectContributor::where('project_id', $project->id)->get();
        $explicitSum = $contributors->whereNotNull('dev_share_pct')->sum('dev_share_pct');

        if ($explicitSum > 0) {
            return $contributors->filter(fn (ProjectContributor $c) => $c->user_id && $c->dev_share_pct > 0)
                ->map(fn (ProjectContributor $c) => [
                    'userId' => $c->user_id,
                    'pct' => (float) $c->dev_share_pct,
                    'amount' => round($devAmt * $c->dev_share_pct / 100, 2),
                ])->values();
        }

        $taskPoints = Task::where('project_id', $project->id)
            ->whereIn('status', ['completed', 'paid'])
            ->whereNotNull('assigned_to')
            ->selectRaw('assigned_to, SUM(task_point) as pts')
            ->groupBy('assigned_to')
            ->get();
        $totalPts = $taskPoints->sum('pts');

        if ($totalPts > 0) {
            return $taskPoints->map(fn ($r) => [
                'userId' => $r->assigned_to,
                'pct' => round($r->pts / $totalPts * 100, 2),
                'amount' => round($devAmt * $r->pts / $totalPts, 2),
            ])->values();
        }

        $uids = $contributors->pluck('user_id')->filter()->unique()->values();
        if ($uids->count() > 0) {
            $equalPct = round(100 / $uids->count(), 2);
            $share = round($devAmt / $uids->count(), 2);

            return $uids->map(fn ($uid) => ['userId' => $uid, 'pct' => $equalPct, 'amount' => $share])->values();
        }

        return collect();
    }

    private function devPoolSplitWithStaff(Project $project, float $devAmt): Collection
    {
        $split = $this->devPoolSplit($project, $devAmt);
        $staffById = StaffUser::whereIn('id', $split->pluck('userId'))->get()->keyBy('id');

        return $split->map(fn ($row) => [
            ...$row,
            'fullName' => $staffById[$row['userId']]->full_name ?? '—',
            'bankName' => $staffById[$row['userId']]->bank_name ?? null,
            'bankAccountNo' => $staffById[$row['userId']]->bank_account_no ?? null,
        ]);
    }

    private function stagesFor(?int $projectId = null, ?int $taskId = null): Collection
    {
        return PaymentStage::query()
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->when($taskId, fn ($q) => $q->where('task_id', $taskId))
            ->orderBy('stage_order')
            ->get()
            ->map(fn (PaymentStage $s) => [
                'id' => $s->id,
                'order' => $s->stage_order,
                'label' => $s->stage_label,
                'amount' => (float) $s->amount,
                'percentage' => $s->percentage !== null ? (float) $s->percentage : null,
                'status' => $s->status,
                'invoiceRef' => $s->invoice_ref,
                'paidAt' => $s->paid_at?->toIso8601String(),
            ]);
    }
}
