<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('middlemen', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 200);
            $table->string('phone', 50)->nullable();
            $table->string('email', 200)->nullable();
            $table->string('company', 200)->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('middlemen');
    }
};
