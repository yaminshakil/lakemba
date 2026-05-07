<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fees_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('bulk_billing_available')->default(true);
            $table->text('bulk_billing_details')->nullable();
            $table->json('bulk_billing_eligibility')->nullable(); // array of eligibility items
            $table->json('fee_schedule')->nullable();             // [{service, fee, concession_fee, notes}]
            $table->json('payment_methods')->nullable();          // ['Cash', 'EFTPOS', ...]
            $table->text('cancellation_policy')->nullable();
            $table->text('after_hours_info')->nullable();
            $table->text('health_fund_info')->nullable();
            $table->text('medicare_info')->nullable();
            $table->json('additional_sections')->nullable();      // [{title, content}]
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fees_settings');
    }
};
