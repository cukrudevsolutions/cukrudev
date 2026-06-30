<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contribution_points', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('project_id');
            $table->unsignedInteger('user_id');
            $table->unsignedTinyInteger('point');
            $table->text('remark')->nullable();
            $table->unsignedInteger('created_by')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('project_id')->references('id')->on('projects')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('staff_users')->cascadeOnDelete();
            $table->foreign('created_by')->references('id')->on('staff_users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contribution_points');
    }
};
