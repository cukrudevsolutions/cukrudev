<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_stages', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('project_id')->nullable();
            $table->unsignedInteger('task_id')->nullable();
            $table->unsignedTinyInteger('stage_order')->default(1);
            $table->string('stage_label', 100)->default('Payment');
            $table->decimal('percentage', 5, 2)->nullable();
            $table->decimal('amount', 12, 2)->default(0);
            $table->string('invoice_ref', 60)->nullable();
            $table->timestamp('invoice_sent_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->string('receipt_ref', 60)->nullable();
            $table->timestamp('receipt_sent_at')->nullable();
            $table->enum('status', ['pending', 'invoiced', 'paid'])->default('pending');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->index('project_id');
            $table->index('task_id');
            $table->foreign('project_id')->references('id')->on('projects')->cascadeOnDelete();
            $table->foreign('task_id')->references('id')->on('tasks')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_stages');
    }
};
