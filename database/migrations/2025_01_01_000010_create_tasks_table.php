<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * client_id and middleman_id are not present in the legacy `tasks` table even though
     * portal/admin/gigs-edit.php submits them and staff-functions.php::save_task() writes
     * them — a live bug in the legacy app. Adding them here fixes that drift deliberately.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('project_id')->nullable();
            $table->unsignedInteger('client_id')->nullable();
            $table->string('title', 300);
            $table->text('description')->nullable();
            $table->string('repo_url', 500)->nullable();
            $table->enum('task_type', [
                'minor_fix', 'small_bug_fix', 'simple_ui_task', 'setup_task',
                'medium_feature', 'module_feature', 'complex_feature', 'full_project_lead',
            ])->default('medium_feature');
            $table->unsignedTinyInteger('task_point')->default(1);
            $table->decimal('task_value', 12, 2)->nullable()->comment('estimated RM value for this task');
            $table->boolean('middleman_applies')->default(false)->comment('1 if middleman cut applies');
            $table->unsignedInteger('middleman_id')->nullable();
            $table->unsignedInteger('assigned_to')->nullable();
            $table->enum('status', [
                'pending', 'offered', 'accepted', 'in_progress', 'submitted',
                'revision', 'completed', 'paid', 'cancelled',
            ])->default('pending');
            $table->text('progress_notes')->nullable();
            $table->date('due_date')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->unsignedTinyInteger('warranty_months')->nullable();
            $table->text('warranty_notes')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('project_id')->references('id')->on('projects')->nullOnDelete();
            $table->foreign('client_id')->references('id')->on('clients')->nullOnDelete();
            $table->foreign('middleman_id')->references('id')->on('middlemen')->nullOnDelete();
            $table->foreign('assigned_to')->references('id')->on('staff_users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
