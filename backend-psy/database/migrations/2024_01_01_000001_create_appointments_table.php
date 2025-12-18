<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->text('message');
            $table->date('preferred_date')->nullable();
            $table->time('preferred_time')->nullable();
            $table->enum('service_type', ['individual', 'couple', 'online'])->default('individual');
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->boolean('cookie_consent')->default(false);
            $table->timestamps();

            $table->index(['email']);
            $table->index(['status']);
            $table->index(['created_at']);
            $table->index(['service_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
