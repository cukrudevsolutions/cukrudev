<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_contributors', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('project_id');
            $table->unsignedInteger('user_id');
            $table->string('role', 100)->nullable();
            $table->decimal('dev_share_pct', 5, 2)->nullable()->comment('explicit % of dev pool; NULL = equal split');
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['project_id', 'user_id']);
            $table->foreign('project_id')->references('id')->on('projects')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('staff_users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_contributors');
    }
};
