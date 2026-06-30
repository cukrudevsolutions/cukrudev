<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->increments('id');
            $table->string('client_name', 200);
            $table->string('contact_person', 200)->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('email', 200)->nullable();
            $table->string('source', 100)->nullable();
            $table->unsignedInteger('handled_by')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('handled_by')->references('id')->on('staff_users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
