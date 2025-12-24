<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // pending, paid, refunded
            $table->string('display_name'); // Ожидает оплаты, Оплачено, Возврат
            $table->string('color')->nullable(); // CSS color for UI
            $table->timestamps();
        });


        DB::table('payment_statuses')->insert([
            [
                'id' => 1,
                'name' => 'pending',
                'display_name' => 'Ожидает оплаты',
                'color' => '#6c757d',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 2,
                'name' => 'paid',
                'display_name' => 'Оплачено',
                'color' => '#198754',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 3,
                'name' => 'refunded',
                'display_name' => 'Возврат',
                'color' => '#ffc107',
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);

        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->text('message');
            $table->date('preferred_date')->nullable();
            $table->time('preferred_time')->nullable();
            $table->enum('service_type', ['individual', 'couple', 'online'])->default('individual');
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            $table->foreignId('payment_status_id')
                ->default(1)
                ->constrained('payment_statuses')
                ->onDelete('restrict');
            $table->decimal('price', 10, 2)->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->boolean('cookie_consent')->default(false);
            $table->timestamps();

            $table->index(['user_id']);
            $table->index(['email']);
            $table->index(['status']);
            $table->index(['payment_status_id']);
            $table->index(['created_at']);
            $table->index(['service_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('payment_statuses');
    }
};
