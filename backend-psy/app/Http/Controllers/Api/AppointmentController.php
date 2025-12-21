<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AppointmentController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        Log::info('=== НОВАЯ ЗАЯВКА НА КОНСУЛЬТАЦИЮ ===');
        Log::info('IP: ' . $request->ip());
        Log::info('User-Agent: ' . $request->userAgent());
        Log::info('Данные запроса:', $request->all());
        
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255|min:2',
                'email' => 'required|email|max:255',
                'phone' => 'nullable|string|max:20',
                'message' => 'required|string|min:10|max:5000',
                'preferred_date' => 'nullable|date',
                'preferred_time' => 'nullable|date_format:H:i',
                'service_type' => 'nullable|in:individual,couple,online',
                'cookie_consent' => 'required|boolean'  // ← ДОБАВЬТЕ ЭТО
            ], [
                'name.required' => 'Пожалуйста, введите ваше имя',
                'name.min' => 'Имя должно содержать не менее 2 символов',
                'email.required' => 'Пожалуйста, введите ваш email',
                'email.email' => 'Введите корректный email адрес',
                'message.required' => 'Пожалуйста, опишите вашу проблему',
                'message.min' => 'Сообщение должно содержать не менее 10 символов',
                'cookie_consent.required' => 'Необходимо согласие на обработку данных',
                'cookie_consent.boolean' => 'Неверное значение согласия',
                'service_type.in' => 'Выберите корректный тип консультации'
            ]);
            
            if ($validator->fails()) {
                Log::warning('Валидация не пройдена:', $validator->errors()->toArray());
                
                throw new ValidationException($validator);
            }
            
            $validated = $validator->validated();
            Log::info('Валидация пройдена:', $validated);
            
            $appointment = Appointment::create([
                'name' => trim($validated['name']),
                'email' => strtolower(trim($validated['email'])),
                'phone' => isset($validated['phone']) ? trim($validated['phone']) : null,
                'message' => strip_tags($validated['message']),
                'preferred_date' => $validated['preferred_date'] ?? null,
                'preferred_time' => $validated['preferred_time'] ?? null,
                'service_type' => $validated['service_type'] ?? 'individual',
                'ip_address' => $request->ip() ?? 'unknown',
                'user_agent' => $request->userAgent() ?? 'unknown',
                'cookie_consent' => (bool)($validated['cookie_consent'] ?? false),  // ← ДОБАВЬТЕ ЭТО
                'status' => 'pending'
            ]);
            
            Log::info('✅ Заявка успешно создана. ID: ' . $appointment->id, [
                'name' => $appointment->name,
                'email' => $appointment->email
            ]);
            
            return response()->json([
                'success' => true,
                'message' => '✅ Заявка успешно отправлена! Я свяжусь с вами в ближайшее время.',
                'data' => [
                    'id' => $appointment->id,
                    'name' => $appointment->name,
                    'email' => $appointment->email,
                    'service_type' => $appointment->service_type,
                    'created_at' => $appointment->created_at->format('d.m.Y H:i')
                ]
            ], 201);
            
        } catch (ValidationException $e) {
            Log::warning('Ошибка валидации:', $e->errors());
            
            return response()->json([
                'success' => false,
                'message' => 'Пожалуйста, исправьте ошибки в форме',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('❌ Ошибка базы данных:', [
                'message' => $e->getMessage(),
                'sql' => $e->getSql(),
                'bindings' => $e->getBindings(),
                'code' => $e->getCode()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Ошибка базы данных. Пожалуйста, попробуйте позже.',
                'debug' => config('app.debug') ? $e->getMessage() : null
            ], 500);
            
        } catch (\Exception $e) {
            Log::error('🔥 Критическая ошибка в AppointmentController:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже или свяжитесь по телефону.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}