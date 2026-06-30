<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('client_id')->nullable();
            $table->string('project_title', 300);
            $table->enum('project_type', ['small_job', 'big_project', 'maintenance', 'internal_product'])->default('small_job');
            $table->enum('project_source', ['team_sourced', 'mentor_led', 'middleman', 'investor'])->default('team_sourced');
            $table->unsignedInteger('mentor_id')->nullable();
            $table->unsignedInteger('middleman_id')->nullable();
            $table->string('investor_name', 200)->nullable();
            $table->decimal('mentor_pct', 5, 2)->default(0);
            $table->decimal('investor_pct', 5, 2)->default(0);
            $table->decimal('total_value', 12, 2)->nullable();
            $table->enum('status', ['pending', 'active', 'completed', 'paid', 'cancelled'])->default('pending');
            $table->unsignedInteger('created_by')->nullable();
            $table->unsignedInteger('project_lead_id')->nullable();
            $table->text('description')->nullable();
            $table->string('repo_url', 500)->nullable();
            $table->unsignedTinyInteger('warranty_months')->nullable();
            $table->text('warranty_notes')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('client_id')->references('id')->on('clients')->nullOnDelete();
            $table->foreign('mentor_id')->references('id')->on('staff_users')->nullOnDelete();
            $table->foreign('middleman_id')->references('id')->on('middlemen')->nullOnDelete();
            $table->foreign('created_by')->references('id')->on('staff_users')->nullOnDelete();
            $table->foreign('project_lead_id')->references('id')->on('staff_users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
