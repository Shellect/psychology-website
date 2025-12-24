<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255|min:2',
                'email' => 'required|email|max:255|unique:users,email',
                'password' => 'required|string|min:8|confirmed',
                'phone' => 'nullable|string|max:20',
            ], [
                'name.required' => 'Пожалуйста, введите ваше имя',
                'name.min' => 'Имя должно содержать не менее 2 символов',
                'email.required' => 'Пожалуйста, введите ваш email',
                'email.email' => 'Введите корректный email адрес',
                'email.unique' => 'Этот email уже зарегистрирован',
                'password.required' => 'Пожалуйста, введите пароль',
                'password.min' => 'Пароль должен содержать не менее 8 символов',
                'password.confirmed' => 'Пароли не совпадают',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

            $validated = $validator->validated();

            $clientRole = Role::client();
            if (!$clientRole) {
                Log::error('Client role not found in database');
                return response()->json([
                    'success' => false,
                    'message' => 'Ошибка конфигурации системы'
                ], 500);
            }

            $user = User::create([
                'name' => trim($validated['name']),
                'email' => strtolower(trim($validated['email'])),
                'password' => $validated['password'],
                'phone' => isset($validated['phone']) ? trim($validated['phone']) : null,
                'role_id' => $clientRole->id,
            ]);

            // Link any existing appointments with this email to the new user
            Appointment::where('email', $user->email)
                ->whereNull('user_id')
                ->update(['user_id' => $user->id]);

            // Login user via session
            Auth::login($user);
            $request->session()->regenerate();

            Log::info('✅ Пользователь зарегистрирован. ID: ' . $user->id);

            return response()->json([
                'success' => true,
                'message' => 'Регистрация успешна!',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role_name,
                        'phone' => $user->phone,
                    ],
                ]
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка валидации',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('❌ Ошибка регистрации:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Ошибка регистрации. Попробуйте позже.'
            ], 500);
        }
    }

    /**
     * Login user
     */
    public function login(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string',
            ], [
                'email.required' => 'Введите email',
                'email.email' => 'Введите корректный email',
                'password.required' => 'Введите пароль',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

            $credentials = [
                'email' => strtolower(trim($request->email)),
                'password' => $request->password,
            ];

            if (!Auth::attempt($credentials)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Неверный email или пароль'
                ], 401);
            }

            $request->session()->regenerate();

            $user = Auth::user()->load('role');

            Log::info('✅ Пользователь вошёл. ID: ' . $user->id);

            return response()->json([
                'success' => true,
                'message' => 'Вход выполнен успешно!',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role_name,
                        'phone' => $user->phone,
                    ],
                ]
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка валидации',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('❌ Ошибка входа:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Ошибка входа. Попробуйте позже.'
            ], 500);
        }
    }

    /**
     * Logout user
     */
    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Выход выполнен успешно'
        ]);
    }

    /**
     * Get current user
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('role');

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role_name,
                    'phone' => $user->phone,
                ]
            ]
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255|min:2',
                'phone' => 'nullable|string|max:20',
                'current_password' => 'required_with:new_password|string',
                'new_password' => 'nullable|string|min:8|confirmed',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

            if ($request->has('name')) {
                $user->name = trim($request->name);
            }

            if ($request->has('phone')) {
                $user->phone = trim($request->phone);
            }

            if ($request->filled('new_password')) {
                if (!Hash::check($request->current_password, $user->password)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Текущий пароль неверен'
                    ], 422);
                }
                $user->password = $request->new_password;
            }

            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Профиль обновлён',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role_name,
                        'phone' => $user->phone,
                    ]
                ]
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка валидации',
                'errors' => $e->errors()
            ], 422);
        }
    }
}
