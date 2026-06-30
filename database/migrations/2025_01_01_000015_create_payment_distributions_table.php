<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_distributions', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('project_id')->nullable();
            $table->unsignedInteger('task_id')->nullable();
            $table->string('project_source', 30)->nullable();
            $table->decimal('total_amount', 12, 2);
            $table->decimal('company_cut_pct', 5, 2)->default(20);
            $table->decimal('company_cut_amount', 12, 2)->default(0);
            $table->decimal('opex_pct', 5, 2)->default(20);
            $table->decimal('opex_amount', 12, 2)->default(0);
            $table->decimal('mentor_pct', 5, 2)->default(0);
            $table->decimal('mentor_amount', 12, 2)->default(0);
            $table->decimal('middleman_pct', 5, 2)->default(0);
            $table->decimal('middleman_amount', 12, 2)->default(0);
            $table->decimal('investor_pct', 5, 2)->default(0);
            $table->decimal('investor_amount', 12, 2)->default(0);
            $table->string('middleman_name', 200)->nullable();
            $table->decimal('sales_pct', 5, 2)->default(0);
            $table->decimal('sales_amount', 12, 2)->default(0);
            $table->decimal('dev_pool_pct', 5, 2)->default(0);
            $table->decimal('dev_pool_amount', 12, 2)->default(0);
            $table->enum('status', ['pending', 'calculated', 'paid'])->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('project_id')->references('id')->on('projects')->nullOnDelete();
            $table->foreign('task_id')->references('id')->on('tasks')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_distributions');
    }
};
