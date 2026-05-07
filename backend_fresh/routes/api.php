<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\BlogPostController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\HomepageController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\FeesController;
use App\Http\Controllers\Admin\AuthController;

/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
*/

// Doctors
Route::get('/doctors',          [DoctorController::class, 'index']);
Route::get('/doctors/{doctor}', [DoctorController::class, 'show']);

// Services
Route::get('/services',           [ServiceController::class, 'index']);
Route::get('/services/{service}', [ServiceController::class, 'show']);

// Testimonials
Route::get('/testimonials', [TestimonialController::class, 'index']);

// Blog
Route::get('/blog',         [BlogPostController::class, 'index']);
Route::get('/blog/{post}',  [BlogPostController::class, 'show']);

// FAQs
Route::get('/faqs', [FaqController::class, 'index']);

// Gallery
Route::get('/gallery', [GalleryController::class, 'index']);

// Homepage sections
Route::get('/homepage',      [HomepageController::class, 'index']);
Route::get('/homepage/{key}',[HomepageController::class, 'show']);

// Contact
Route::get('/contact',        [ContactController::class, 'show']);
Route::post('/contact/submit',[ContactController::class, 'submit']);

// Newsletter
Route::post('/newsletter/subscribe', [ContactController::class, 'subscribe']);

// Settings (public read)
Route::get('/settings',      [SettingController::class, 'index']);
Route::get('/settings/{key}',[SettingController::class, 'show']);

// SEO meta
Route::get('/seo/{page}', [SettingController::class, 'seo']);

// Fees & Information
Route::get('/fees', [FeesController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Admin Authentication
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->group(function () {
    Route::post('/login',    [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout',   [AuthController::class, 'logout']);
        Route::get('/dashboard', [AuthController::class, 'dashboard']);

        // Admin Doctors
        Route::apiResource('doctors',      DoctorController::class)->except(['index', 'show']);

        // Admin Services
        Route::apiResource('services',     ServiceController::class)->except(['index', 'show']);

        // Admin Blog
        Route::apiResource('blog',         BlogPostController::class)->except(['index', 'show']);

        // Admin Testimonials
        Route::apiResource('testimonials', TestimonialController::class)->except(['index']);

        // Admin FAQs
        Route::apiResource('faqs',         FaqController::class)->except(['index']);

        // Admin Gallery
        Route::post('/gallery',            [GalleryController::class, 'store']);
        Route::delete('/gallery/{gallery}',[GalleryController::class, 'destroy']);

        // Admin Homepage
        Route::put('/homepage/{key}',       [HomepageController::class, 'update']);
        Route::post('/homepage/{key}/image',[HomepageController::class, 'uploadImage']);

        // Admin Contact
        Route::put('/contact',             [ContactController::class, 'update']);

        // Admin Settings
        Route::put('/settings',            [SettingController::class, 'update']);
        Route::put('/seo/{page}',          [SettingController::class, 'updateSeo']);

        // Admin Fees & Information
        Route::put('/fees',                [FeesController::class, 'update']);
    });
});
