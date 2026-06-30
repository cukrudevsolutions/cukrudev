<?php

namespace Tests\Feature\Portal;

use App\Models\Project;
use App\Models\StaffUser;
use App\Models\Task;
use App\Models\TaskOffer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortalSmokeTest extends TestCase
{
    use RefreshDatabase;

    public function test_all_staff_portal_pages_render_for_an_authenticated_staff_member(): void
    {
        $staff = StaffUser::factory()->create();
        $project = Project::create([
            'project_title' => 'Test Project',
            'project_lead_id' => $staff->id,
            'status' => 'active',
        ]);
        $task = Task::create([
            'project_id' => $project->id,
            'title' => 'Test Task',
            'task_type' => 'medium_feature',
            'task_point' => 4,
            'task_value' => 1000,
            'assigned_to' => $staff->id,
            'status' => 'in_progress',
        ]);
        TaskOffer::create([
            'task_id' => $task->id,
            'offered_to' => $staff->id,
            'response' => 'pending',
        ]);

        $this->actingAs($staff);

        foreach ([
            'portal.dashboard',
            'portal.card.show',
            'portal.card.edit',
            'portal.contracts.index',
            'portal.gigs.index',
            'portal.offers.index',
            'portal.points.index',
            'portal.earnings.index',
        ] as $routeName) {
            $this->get(route($routeName))->assertOk();
        }

        $this->get(route('portal.gigs.show', $task))->assertOk();
    }
}
