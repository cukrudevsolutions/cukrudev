<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('full_name', 160);
            $table->string('email', 190);
            $table->string('phone', 40);
            $table->string('company', 190);
            $table->string('country', 100)->nullable();
            $table->unsignedInteger('project_type_id')->nullable();
            $table->string('project_type', 120);
            $table->text('message');
            $table->string('source', 80)->default('landing_page');
            $table->enum('status', ['new', 'contacted', 'proposal_sent', 'won', 'lost', 'archived'])->default('new');
            $table->enum('priority', ['low', 'normal', 'high'])->default('normal');
            $table->decimal('estimated_budget', 12, 2)->nullable();
            $table->char('preferred_currency', 3)->nullable();
            $table->string('preferred_timeline', 120)->nullable();
            $table->boolean('consent_marketing')->default(false);
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->index(['status', 'created_at']);
            $table->index('email');
            $table->index('project_type');
            $table->foreign('project_type_id')->references('id')->on('project_types')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_inquiries');
    }
};
