<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_categories', function (Blueprint $table) {
            $table->increments('id');
            $table->string('source', 50);
            $table->string('display_name', 100);
            $table->string('config_key', 100);
            $table->string('color', 30)->default('#888888');
            $table->decimal('pct', 5, 2)->default(0);
            $table->unsignedTinyInteger('sort_order')->default(0);
            $table->boolean('is_core')->default(false);
            $table->boolean('is_variable')->default(false);
            $table->string('remainder_to', 100)->default('company');

            $table->unique(['source', 'config_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_categories');
    }
};
