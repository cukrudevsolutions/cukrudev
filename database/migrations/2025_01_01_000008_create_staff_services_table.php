<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff_services', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('staff_id');
            $table->string('title', 160);
            $table->text('description')->nullable();
            $table->string('icon', 80)->nullable()->comment('Emoji or icon class');
            $table->integer('sort_order')->default(0);
            $table->timestamp('created_at')->useCurrent();

            $table->index('staff_id');
            $table->foreign('staff_id')->references('id')->on('staff_users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff_services');
    }
};
