<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class AppointmentController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email',
                'phone' => 'nullable|string|max:20',
                'message' => 'required|string|min:10',
                'preferred_date' => 'nullable|date',
                'preferred_time' => 'nullable|date_format:H:i',
                'service_type' => 'nullable|in:individual,couple,online',
            ]);

            $appointment = Appointment::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'message' => strip_tags($validated['message']),
                'preferred_date' => $validated['preferred_date'] ?? null,
                'preferred_time' => $validated['preferred_time'] ?? null,
                'service_type' => $validated['service_type'] ?? 'individual',
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'status' => 'pending'
            ]);

            Log::info('Новая заявка от: ' . $appointment->email, $appointment->toArray());

            return response()->json([
                'success' => true,
                'message' => 'Заявка успешно отправлена! Я свяжусь с вами в ближайшее время.',
                'data' => [
                    'id' => $appointment->id,
                    'name' => $appointment->name,
                    'email' => $appointment->email,
                    'service_type' => $appointment->service_type,
                    'created_at' => $appointment->created_at->format('d.m.Y H:i')
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('Ошибка создания заявки: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже или свяжитесь по телефону.'
            ], 500);
        }
    }
}