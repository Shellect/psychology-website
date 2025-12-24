<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Psychologist API',
        'version' => '1.0.0',
        'timestamp' => now()->toDateTimeString()
    ]);
});

// Public routes
Route::post('/appointments', [AppointmentController::class, 'store']);

// Auth routes (guest only)
Route::middleware('guest')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
});

// Protected routes (session auth via Sanctum SPA)
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    
    // Client dashboard
    Route::get('/dashboard/my-appointments', [DashboardController::class, 'myAppointments']);
    Route::get('/dashboard/my-stats', [DashboardController::class, 'clientStats']);
    Route::get('/dashboard/appointments/{id}', [DashboardController::class, 'getAppointment']);
    Route::post('/dashboard/appointments/{id}/pay', [DashboardController::class, 'processPayment']);
    
    // Admin only routes
    Route::get('/admin/stats', [DashboardController::class, 'adminStats']);
    Route::get('/admin/appointments', [DashboardController::class, 'allAppointments']);
    Route::put('/admin/appointments/{id}/status', [DashboardController::class, 'updateAppointmentStatus']);
    Route::post('/admin/appointments/{id}/mark-paid', [DashboardController::class, 'markPaymentComplete']);
    Route::get('/admin/clients', [DashboardController::class, 'allClients']);
});
