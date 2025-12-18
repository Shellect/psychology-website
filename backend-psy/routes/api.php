<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AppointmentController;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Psychologist API',
        'version' => '1.0.0',
        'timestamp' => now()->toDateTimeString()
    ]);
});

Route::prefix('v1')->group(function () {
    Route::post('/appointments', [AppointmentController::class, 'store']);
    
    Route::get('/appointments', function() {
        return response()->json(['message' => 'Список заявок (требует авторизации)']);
    })->middleware('auth:sanctum');
});