<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff_users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('full_name', 160);
            $table->string('slug', 80)->unique();
            $table->string('email', 190)->unique();
            $table->string('phone', 40)->nullable();
            $table->string('password_hash');
            $table->string('position', 120)->nullable();
            $table->string('short_title', 160)->nullable();
            $table->text('bio')->nullable();
            $table->text('expertise')->nullable()->comment('JSON array of skill strings');
            $table->longText('skill_tags')->nullable();
            $table->enum('availability_status', ['available', 'busy', 'unavailable'])->default('available');
            $table->string('profile_image')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('github_url')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('tiktok_url')->nullable();
            $table->string('youtube_url')->nullable();
            $table->string('website_url')->nullable();
            $table->string('whatsapp_number', 40)->nullable();
            $table->boolean('is_admin')->default(false);
            $table->boolean('is_active')->default(true);
            $table->string('bank_name', 200)->nullable();
            $table->string('bank_account_no', 100)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff_users');
    }
};
