<?php

namespace Tests\Feature\Admin;

use App\Models\Client;
use App\Models\Middleman;
use App\Models\StaffUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCrudSmokeTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_staff_cannot_access_admin_pages(): void
    {
        $staff = StaffUser::factory()->create(['is_admin' => false]);
        $this->actingAs($staff);

        $this->get(route('portal.admin.middlemen.index'))->assertForbidden();
        $this->get(route('portal.admin.clients.index'))->assertForbidden();
        $this->get(route('portal.admin.staff.index'))->assertForbidden();
    }

    public function test_admin_can_view_and_create_a_middleman(): void
    {
        $admin = StaffUser::factory()->admin()->create();
        $this->actingAs($admin);

        $this->get(route('portal.admin.middlemen.index'))->assertOk();
        $this->get(route('portal.admin.middlemen.edit'))->assertOk();

        $this->post(route('portal.admin.middlemen.store'), [
            'name' => 'Test Middleman',
            'company' => 'Acme Sdn Bhd',
            'is_active' => true,
        ])->assertRedirect();

        $this->assertDatabaseHas('middlemen', ['name' => 'Test Middleman']);
    }

    public function test_admin_can_toggle_middleman_active_status(): void
    {
        $admin = StaffUser::factory()->admin()->create();
        $middleman = Middleman::create(['name' => 'M1', 'is_active' => true]);
        $this->actingAs($admin);

        $this->post(route('portal.admin.middlemen.toggleActive', $middleman))->assertRedirect();

        $this->assertFalse($middleman->fresh()->is_active);
    }

    public function test_admin_can_view_and_create_a_client(): void
    {
        $admin = StaffUser::factory()->admin()->create();
        $this->actingAs($admin);

        $this->get(route('portal.admin.clients.index'))->assertOk();
        $this->get(route('portal.admin.clients.edit'))->assertOk();

        $this->post(route('portal.admin.clients.store'), [
            'client_name' => 'Test Client Sdn Bhd',
            'source' => 'referral',
        ])->assertRedirect();

        $this->assertDatabaseHas('clients', ['client_name' => 'Test Client Sdn Bhd']);
    }

    public function test_admin_can_edit_an_existing_client(): void
    {
        $admin = StaffUser::factory()->admin()->create();
        $client = Client::create(['client_name' => 'Old Name']);
        $this->actingAs($admin);

        $this->get(route('portal.admin.clients.edit', $client))->assertOk();

        $this->post(route('portal.admin.clients.store', $client), [
            'client_name' => 'New Name',
        ])->assertRedirect();

        $this->assertSame('New Name', $client->fresh()->client_name);
    }

    public function test_admin_can_view_staff_list_and_create_new_staff_with_unique_slug(): void
    {
        $admin = StaffUser::factory()->admin()->create();
        StaffUser::factory()->create(['slug' => 'johndoe', 'full_name' => 'John Doe']);
        $this->actingAs($admin);

        $this->get(route('portal.admin.staff.index'))->assertOk();
        $this->get(route('portal.admin.staff.edit'))->assertOk();

        $this->post(route('portal.admin.staff.store'), [
            'full_name' => 'John Doe',
            'email' => 'john2@example.com',
            'availability_status' => 'available',
            'password' => 'password123',
        ])->assertRedirect();

        $newStaff = StaffUser::where('email', 'john2@example.com')->first();
        $this->assertNotNull($newStaff);
        $this->assertNotSame('johndoe', $newStaff->slug);
        $this->assertStringStartsWith('johndoe_', $newStaff->slug);
    }

    public function test_admin_can_toggle_staff_active_status(): void
    {
        $admin = StaffUser::factory()->admin()->create();
        $staff = StaffUser::factory()->create(['is_active' => true]);
        $this->actingAs($admin);

        $this->post(route('portal.admin.staff.toggleActive', $staff))->assertRedirect();

        $this->assertFalse($staff->fresh()->is_active);
    }
}
