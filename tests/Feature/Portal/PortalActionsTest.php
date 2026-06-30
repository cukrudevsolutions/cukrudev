<?php

namespace Tests\Feature\Portal;

use App\Models\StaffUser;
use App\Models\Task;
use App\Models\TaskOffer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortalActionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_can_update_availability(): void
    {
        $staff = StaffUser::factory()->create(['availability_status' => 'available']);
        $this->actingAs($staff);

        $this->post(route('portal.availability.update'), ['status' => 'busy'])->assertRedirect();

        $this->assertSame('busy', $staff->fresh()->availability_status);
    }

    public function test_staff_can_advance_an_accepted_gig_to_in_progress(): void
    {
        $staff = StaffUser::factory()->create();
        $task = Task::create([
            'title' => 'Test Task',
            'task_type' => 'medium_feature',
            'task_point' => 4,
            'assigned_to' => $staff->id,
            'status' => 'accepted',
        ]);
        $this->actingAs($staff);

        $this->post(route('portal.gigs.update'), [
            'task_id' => $task->id,
            'new_status' => 'in_progress',
            'progress_notes' => 'Starting work',
        ])->assertRedirect(route('portal.gigs.show', $task));

        $task->refresh();
        $this->assertSame('in_progress', $task->status);
        $this->assertSame('Starting work', $task->progress_notes);
    }

    public function test_staff_cannot_skip_directly_from_accepted_to_paid(): void
    {
        $staff = StaffUser::factory()->create();
        $task = Task::create([
            'title' => 'Test Task',
            'task_type' => 'medium_feature',
            'task_point' => 4,
            'assigned_to' => $staff->id,
            'status' => 'accepted',
        ]);
        $this->actingAs($staff);

        $this->post(route('portal.gigs.update'), [
            'task_id' => $task->id,
            'new_status' => 'paid',
        ])->assertRedirect(route('portal.gigs.show', $task));

        $this->assertSame('accepted', $task->fresh()->status);
    }

    public function test_staff_can_accept_a_pending_offer(): void
    {
        $staff = StaffUser::factory()->create();
        $task = Task::create([
            'title' => 'Test Task',
            'task_type' => 'medium_feature',
            'task_point' => 4,
            'status' => 'offered',
        ]);
        $offer = TaskOffer::create([
            'task_id' => $task->id,
            'offered_to' => $staff->id,
            'response' => 'pending',
        ]);
        $this->actingAs($staff);

        $this->post(route('portal.offers.respond'), [
            'offer_id' => $offer->id,
            'response' => 'accepted',
        ])->assertRedirect(route('portal.offers.index'));

        $this->assertSame('accepted', $offer->fresh()->response);
        $this->assertSame('accepted', $task->fresh()->status);
        $this->assertSame($staff->id, $task->fresh()->assigned_to);
    }

    public function test_staff_can_update_their_card(): void
    {
        $staff = StaffUser::factory()->create();
        $this->actingAs($staff);

        $this->post(route('portal.card.update'), [
            'full_name' => 'Updated Name',
            'expertise' => ['Laravel', 'React'],
            'services' => [['title' => 'Web Dev', 'description' => 'Building stuff', 'icon' => '🚀']],
            'projects' => [['title' => 'Cool Project', 'project_url' => 'https://example.com']],
        ])->assertRedirect();

        $staff->refresh();
        $this->assertSame('Updated Name', $staff->full_name);
        $this->assertSame(['Laravel', 'React'], $staff->expertise);
        $this->assertCount(1, $staff->staffServices);
        $this->assertCount(1, $staff->staffProjects);
    }
}
