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

Route::post('/appointments', [AppointmentController::class, 'store']);
Route::get('/appointments', function() {
    return response()->json(['message' => 'Список заявок (требует авторизации)']);
})->middleware('auth:sanctum');
