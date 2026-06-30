<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('opportunity_points', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('task_id');
            $table->unsignedInteger('user_id');
            $table->unsignedTinyInteger('point');
            $table->string('reason', 300)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('task_id')->references('id')->on('tasks')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('staff_users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('opportunity_points');
    }
};
