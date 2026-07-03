<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Client;
use App\Models\Middleman;
use App\Models\PaymentCategory;
use App\Models\Project;
use App\Models\ProjectDistribution;
use App\Models\StaffUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    private const TYPES = ['small_job', 'big_project', 'maintenance', 'internal_product'];

    private const SOURCES = ['team_sourced', 'mentor_led', 'middleman', 'investor'];

    private const STATUSES = ['pending', 'active', 'completed', 'paid', 'cancelled'];

    public function index(): Response
    {
        $projects = Project::with('client')->orderByDesc('created_at')->get();

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects->map(fn (Project $p) => [
                'id' => $p->id,
                'title' => $p->project_title,
                'clientName' => $p->client?->client_name,
                'type' => $p->project_type,
                'source' => $p->project_source,
                'status' => $p->status,
                'totalValue' => $p->total_value ? (float) $p->total_value : null,
                'createdAt' => $p->created_at->toDateString(),
            ]),
            'statuses' => self::STATUSES,
        ]);
    }

    public function edit(?Project $project = null): Response
    {
        return Inertia::render('Admin/Projects/Edit', [
            'project' => $project ? [
                'id' => $project->id,
                'clientId' => $project->client_id,
                'projectTitle' => $project->project_title,
                'projectType' => $project->project_type,
                'projectSource' => $project->project_source,
                'mentorId' => $project->mentor_id,
                'middlemanId' => $project->middleman_id,
                'investorName' => $project->investor_name,
                'mentorPct' => $project->mentor_pct,
                'investorPct' => $project->investor_pct,
                'totalValue' => $project->total_value,
                'status' => $project->status,
                'projectLeadId' => $project->project_lead_id,
                'description' => $project->description,
                'repoUrl' => $project->repo_url,
                'warrantyMonths' => $project->warranty_months,
                'warrantyNotes' => $project->warranty_notes,
                'contributors' => $project->contributors()->get()->map(fn (StaffUser $s) => [
                    'id' => $s->id,
                    'fullName' => $s->full_name,
                    'role' => $s->pivot->role,
                    'devSharePct' => $s->pivot->dev_share_pct,
                ]),
            ] : null,
            'clients' => Client::orderBy('client_name')->get(['id', 'client_name']),
            'middlemen' => Middleman::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'staff' => StaffUser::where('is_active', true)->orderBy('full_name')->get(['id', 'full_name']),
            'types' => self::TYPES,
            'sources' => self::SOURCES,
            'statuses' => self::STATUSES,
            'categoriesBySource' => PaymentCategory::whereIn('source', self::SOURCES)
                ->orderBy('sort_order')->orderBy('id')->get()
                ->groupBy('source')
                ->map(fn ($group) => $group->map(fn (PaymentCategory $c) => [
                    'configKey' => $c->config_key,
                    'displayName' => $c->display_name,
                    'color' => $c->color,
                    'pct' => (float) $c->pct,
                    'isVariable' => $c->is_variable,
                ])->values()),
            'savedDistributions' => $project
                ? ProjectDistribution::where('project_id', $project->id)->get()->keyBy('category_key')->map(fn ($d) => (float) $d->pct)
                : (object) [],
        ]);
    }

    public function store(Request $request, ?Project $project = null): RedirectResponse
    {
        $validated = $request->validate([
            'client_id' => ['nullable', 'integer', 'exists:clients,id'],
            'project_title' => ['required', 'string', 'max:300'],
            'project_type' => ['required', 'string', 'in:'.implode(',', self::TYPES)],
            'project_source' => ['required', 'string', 'in:'.implode(',', self::SOURCES)],
            'mentor_id' => ['nullable', 'integer', 'exists:staff_users,id'],
            'middleman_id' => ['nullable', 'integer', 'exists:middlemen,id'],
            'investor_name' => ['nullable', 'string', 'max:200'],
            'mentor_pct' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'investor_pct' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'total_value' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', 'string', 'in:'.implode(',', self::STATUSES)],
            'project_lead_id' => ['nullable', 'integer', 'exists:staff_users,id'],
            'description' => ['nullable', 'string'],
            'repo_url' => ['nullable', 'string', 'max:500'],
            'warranty_months' => ['nullable', 'integer', 'min:0', 'max:255'],
            'warranty_notes' => ['nullable', 'string'],
        ]);

        $validated['mentor_pct'] ??= 0;
        $validated['investor_pct'] ??= 0;

        $isNew = ! $project;
        $project ??= new Project();

        if ($isNew) {
            $validated['created_by'] = $request->user()->id;
        }

        $project->fill($validated);
        $project->save();

        if ($request->filled('dist')) {
            ProjectDistribution::where('project_id', $project->id)->delete();

            foreach ((array) $request->input('dist') as $key => $dv) {
                if (! is_array($dv)) {
                    continue;
                }

                ProjectDistribution::create([
                    'project_id' => $project->id,
                    'category_name' => Str::limit(trim($dv['name'] ?? ''), 100, '') ?: 'Unknown',
                    'category_key' => Str::limit((string) $key, 100, ''),
                    'color' => $dv['color'] ?? '#888888',
                    'pct' => max(0, min(100, (float) ($dv['pct'] ?? 0))),
                    'is_variable' => (bool) ($dv['is_variable'] ?? false),
                ]);
            }
        }

        ActivityLog::record($request->user()->id, $isNew ? 'project_created' : 'project_updated', 'projects',
            ($isNew ? 'Created' : 'Updated').' project: '.$project->project_title);

        return redirect()->route('portal.admin.projects.edit', $project)
            ->with('success', 'Project '.($isNew ? 'created' : 'updated').' successfully.');
    }

    public function addContributor(Request $request, Project $project): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:staff_users,id'],
            'role' => ['nullable', 'string', 'max:100'],
            'dev_share_pct' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ]);

        $project->contributors()->syncWithoutDetaching([
            $validated['user_id'] => [
                'role' => $validated['role'] ?? null,
                'dev_share_pct' => $validated['dev_share_pct'] ?? null,
            ],
        ]);

        $staffName = StaffUser::find($validated['user_id'])?->full_name;
        ActivityLog::record($request->user()->id, 'project_contributor_added', 'projects',
            "Added contributor {$staffName} to project: {$project->project_title}");

        return back()->with('success', 'Contributor added.');
    }

    public function removeContributor(Request $request, Project $project, StaffUser $staff): RedirectResponse
    {
        $project->contributors()->detach($staff->id);

        ActivityLog::record($request->user()->id, 'project_contributor_removed', 'projects',
            "Removed contributor {$staff->full_name} from project: {$project->project_title}");

        return back()->with('success', 'Contributor removed.');
    }
}
