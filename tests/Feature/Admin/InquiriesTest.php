<?php

namespace Tests\Feature\Admin;

use App\Models\ProjectInquiry;
use App\Models\StaffUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InquiriesTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_inquiries_and_update_status(): void
    {
        $admin = StaffUser::factory()->admin()->create();
        $inquiry = ProjectInquiry::create([
            'full_name' => 'Jane Client',
            'email' => 'jane@example.com',
            'phone' => '+60123456789',
            'company' => 'Jane Co',
            'project_type' => 'Website / Landing Page',
            'message' => 'Need a website',
            'status' => 'new',
        ]);
        $this->actingAs($admin);

        $this->get(route('portal.admin.inquiries.index'))->assertOk();

        $this->post(route('portal.admin.inquiries.updateStatus'), [
            'inquiry_id' => $inquiry->id,
            'status' => 'contacted',
        ])->assertRedirect();

        $this->assertSame('contacted', $inquiry->fresh()->status);
    }

    public function test_non_admin_cannot_access_inquiries(): void
    {
        $staff = StaffUser::factory()->create(['is_admin' => false]);
        $this->actingAs($staff);

        $this->get(route('portal.admin.inquiries.index'))->assertForbidden();
    }
}
