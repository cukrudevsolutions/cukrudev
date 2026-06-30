<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Middleman;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MiddlemanController extends Controller
{
    public function index(): Response
    {
        $middlemen = Middleman::orderBy('name')->get();
        $projectCounts = Project::whereNotNull('middleman_id')
            ->selectRaw('middleman_id, count(*) as n')
            ->groupBy('middleman_id')->pluck('n', 'middleman_id');

        $linkedProjects = Project::whereNotNull('middleman_id')
            ->get(['id', 'middleman_id', 'project_title', 'status', 'total_value'])
            ->groupBy('middleman_id');

        return Inertia::render('Admin/Middlemen/Index', [
            'middlemen' => $middlemen->map(fn (Middleman $m) => [
                'id' => $m->id,
                'name' => $m->name,
                'company' => $m->company,
                'phone' => $m->phone,
                'email' => $m->email,
                'notes' => $m->notes,
                'isActive' => $m->is_active,
                'projectCount' => $projectCounts[$m->id] ?? 0,
                'projects' => ($linkedProjects[$m->id] ?? collect())->map(fn ($p) => [
                    'id' => $p->id,
                    'title' => $p->project_title,
                    'status' => $p->status,
                    'totalValue' => $p->total_value ? (float) $p->total_value : null,
                ])->values(),
            ]),
        ]);
    }

    public function edit(?Middleman $middleman = null): Response
    {
        return Inertia::render('Admin/Middlemen/Edit', [
            'middleman' => $middleman ? [
                'id' => $middleman->id,
                'name' => $middleman->name,
                'company' => $middleman->company,
                'phone' => $middleman->phone,
                'email' => $middleman->email,
                'notes' => $middleman->notes,
                'isActive' => $middleman->is_active,
            ] : null,
        ]);
    }

    public function store(Request $request, ?Middleman $middleman = null): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:200'],
            'company' => ['nullable', 'string', 'max:200'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:200'],
            'notes' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $isNew = ! $middleman;
        $middleman ??= new Middleman();
        $middleman->fill($validated);
        $middleman->save();

        ActivityLog::record($request->user()->id, $isNew ? 'middleman_created' : 'middleman_updated', 'middlemen',
            ($isNew ? 'Added' : 'Updated').' middleman: '.$middleman->name);

        return redirect()->route('portal.admin.middlemen.edit', $middleman)
            ->with('success', 'Middleman '.($isNew ? 'added' : 'updated').'.');
    }

    public function toggleActive(Request $request, Middleman $middleman): RedirectResponse
    {
        $middleman->update(['is_active' => ! $middleman->is_active]);

        ActivityLog::record($request->user()->id, $middleman->is_active ? 'middleman_activated' : 'middleman_deactivated',
            'middlemen', "Middleman \"{$middleman->name}\" ".($middleman->is_active ? 'activated' : 'deactivated').' by admin');

        return back()->with('success', 'Middleman status updated.');
    }
}
