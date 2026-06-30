<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('earnings', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('payment_id')->nullable();
            $table->unsignedInteger('task_id')->nullable();
            $table->enum('source_type', ['project', 'task'])->default('project');
            $table->unsignedInteger('user_id');
            $table->decimal('amount', 12, 2);
            $table->enum('earning_type', ['dev_share', 'sales_share', 'lead_bonus', 'contribution_bonus', 'task_share'])->default('dev_share');
            $table->enum('status', ['pending', 'paid'])->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->string('transfer_ref', 200)->nullable();
            $table->timestamp('transferred_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('payment_id')->references('id')->on('payment_distributions')->nullOnDelete();
            $table->foreign('task_id')->references('id')->on('tasks')->nullOnDelete();
            $table->foreign('user_id')->references('id')->on('staff_users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('earnings');
    }
};
