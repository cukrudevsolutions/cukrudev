<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ContractController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = $request->user()->id;

        $leadIds = Project::where('project_lead_id', $userId)->pluck('id');
        $contributorIds = DB::table('project_contributors')->where('user_id', $userId)->pluck('project_id');
        $taskProjectIds = DB::table('tasks')->where('assigned_to', $userId)->whereNotNull('project_id')->pluck('project_id');

        $roleByProject = [];
        foreach ($leadIds as $id) {
            $roleByProject[$id] = 'lead';
        }
        foreach ($contributorIds as $id) {
            $roleByProject[$id] ??= 'contributor';
        }
        foreach ($taskProjectIds as $id) {
            $roleByProject[$id] ??= 'task';
        }

        $projects = Project::with(['client', 'projectLead'])
            ->whereIn('id', array_keys($roleByProject))
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Project $p) => [
                'id' => $p->id,
                'title' => $p->project_title,
                'status' => $p->status,
                'projectSource' => $p->project_source,
                'totalValue' => $p->total_value ? (float) $p->total_value : null,
                'description' => $p->description,
                'clientName' => $p->client?->client_name,
                'leadName' => $p->projectLead?->full_name,
                'myRole' => $roleByProject[$p->id],
            ]);

        return Inertia::render('Portal/Contracts/Index', [
            'projects' => $projects,
        ]);
    }
}
