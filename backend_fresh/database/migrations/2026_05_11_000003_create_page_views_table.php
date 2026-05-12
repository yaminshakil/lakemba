<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_views', function (Blueprint $table) {
            $table->id();
            $table->string('page', 255)->default('/');
            $table->string('ip_hash', 64)->nullable();
            $table->string('session_id', 64)->nullable();
            $table->timestamp('visited_at')->useCurrent();
            $table->index('visited_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_views');
    }
};
