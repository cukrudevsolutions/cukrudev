<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_offers', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('task_id');
            $table->unsignedInteger('offered_to');
            $table->enum('response', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->text('reason')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('task_id')->references('id')->on('tasks')->cascadeOnDelete();
            $table->foreign('offered_to')->references('id')->on('staff_users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_offers');
    }
};
