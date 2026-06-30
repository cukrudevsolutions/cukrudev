<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_distributions', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('project_id');
            $table->string('category_name', 100);
            $table->string('category_key', 100);
            $table->string('color', 30)->default('#888888');
            $table->decimal('pct', 5, 2)->default(0);
            $table->boolean('is_variable')->default(false);

            $table->unique(['project_id', 'category_key']);
            $table->foreign('project_id')->references('id')->on('projects')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_distributions');
    }
};
