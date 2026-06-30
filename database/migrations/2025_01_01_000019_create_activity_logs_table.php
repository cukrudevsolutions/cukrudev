<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id')->nullable();
            $table->string('action', 100);
            $table->string('module', 100);
            $table->text('description');
            $table->timestamp('created_at')->useCurrent();

            $table->index('module');
            $table->index('created_at');
            $table->foreign('user_id')->references('id')->on('staff_users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
