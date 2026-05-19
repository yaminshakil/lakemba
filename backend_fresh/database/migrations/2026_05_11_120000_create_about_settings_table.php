<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('about_settings', function (Blueprint $table) {
            $table->id();
            $table->string('hero_badge')->nullable();
            $table->string('hero_title')->nullable();
            $table->text('hero_subtitle')->nullable();
            $table->string('story_title')->nullable();
            $table->text('story_paragraph1')->nullable();
            $table->text('story_paragraph2')->nullable();
            $table->string('stat_years')->nullable();
            $table->string('stat_patients')->nullable();
            $table->string('stat_doctors')->nullable();
            $table->json('accreditations')->nullable();
            $table->json('values')->nullable();          // [{icon, title, desc}]
            $table->string('clinic_image_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('about_settings');
    }
};
