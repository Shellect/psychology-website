<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\PaymentStatus;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    /**
     * Get dashboard stats for admin
     */
    public function adminStats(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Доступ запрещён'
            ], 403);
        }

        $clientRole = Role::client();
        $pendingPaymentStatus = PaymentStatus::pending();
        $paidPaymentStatus = PaymentStatus::paid();

        $stats = [
            'total_appointments' => Appointment::count(),
            'pending_appointments' => Appointment::where('status', 'pending')->count(),
            'confirmed_appointments' => Appointment::where('status', 'confirmed')->count(),
            'completed_appointments' => Appointment::where('status', 'completed')->count(),
            'cancelled_appointments' => Appointment::where('status', 'cancelled')->count(),
            'total_clients' => $clientRole ? User::where('role_id', $clientRole->id)->count() : 0,
            'pending_payments' => Appointment::where('payment_status_id', $pendingPaymentStatus?->id)
                ->where('status', 'confirmed')
                ->count(),
            'total_revenue' => Appointment::where('payment_status_id', $paidPaymentStatus?->id)->sum('price') ?? 0,
            'today_appointments' => Appointment::whereDate('preferred_date', today())->count(),
            'this_week_appointments' => Appointment::whereBetween('preferred_date', [
                now()->startOfWeek(),
                now()->endOfWeek()
            ])->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Get all appointments for admin
     */
    public function allAppointments(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Доступ запрещён'
            ], 403);
        }

        $query = Appointment::with(['user', 'paymentStatus'])
            ->orderBy('preferred_date', 'desc')
            ->orderBy('preferred_time', 'desc');

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by payment status
        if ($request->has('payment_status') && $request->payment_status !== 'all') {
            $paymentStatus = PaymentStatus::findByName($request->payment_status);
            if ($paymentStatus) {
                $query->where('payment_status_id', $paymentStatus->id);
            }
        }

        // Filter by date range
        if ($request->has('date_from')) {
            $query->whereDate('preferred_date', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->whereDate('preferred_date', '<=', $request->date_to);
        }

        $appointments = $query->paginate(20);

        // Add payment_status name for frontend compatibility
        $appointments->getCollection()->transform(function ($appointment) {
            $appointment->payment_status = $appointment->payment_status_name;
            return $appointment;
        });

        return response()->json([
            'success' => true,
            'data' => $appointments
        ]);
    }

    /**
     * Update appointment status (admin only)
     */
    public function updateAppointmentStatus(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Доступ запрещён'
            ], 403);
        }

        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Запись не найдена'
            ], 404);
        }

        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
        ]);

        $oldStatus = $appointment->status;
        $appointment->status = $request->status;

        // Set price when confirming
        if ($request->status === 'confirmed' && !$appointment->price) {
            $appointment->price = Appointment::getPriceForService($appointment->service_type);
        }

        $appointment->save();

        Log::info("Статус записи #{$id} изменён: {$oldStatus} -> {$request->status}");

        $appointment->load('paymentStatus');
        $appointment->payment_status = $appointment->payment_status_name;

        return response()->json([
            'success' => true,
            'message' => 'Статус обновлён',
            'data' => $appointment
        ]);
    }

    /**
     * Get client's own appointments
     */
    public function myAppointments(Request $request): JsonResponse
    {
        $user = $request->user();

        $appointments = Appointment::with('paymentStatus')
            ->where(function($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->orWhere('email', $user->email);
            })
            ->orderBy('preferred_date', 'desc')
            ->orderBy('preferred_time', 'desc')
            ->get();

        // Add payment_status name for frontend compatibility
        $appointments->transform(function ($appointment) {
            $appointment->payment_status = $appointment->payment_status_name;
            return $appointment;
        });

        return response()->json([
            'success' => true,
            'data' => $appointments
        ]);
    }

    /**
     * Get client dashboard stats
     */
    public function clientStats(Request $request): JsonResponse
    {
        $user = $request->user();
        $pendingPaymentStatus = PaymentStatus::pending();
        $paidPaymentStatus = PaymentStatus::paid();

        $baseQuery = Appointment::where(function($query) use ($user) {
            $query->where('user_id', $user->id)
                ->orWhere('email', $user->email);
        });

        $stats = [
            'total_appointments' => (clone $baseQuery)->count(),
            'upcoming_appointments' => (clone $baseQuery)
                ->whereDate('preferred_date', '>=', today())
                ->whereIn('status', ['pending', 'confirmed'])
                ->count(),
            'completed_appointments' => (clone $baseQuery)
                ->where('status', 'completed')
                ->count(),
            'pending_payments' => (clone $baseQuery)
                ->where('payment_status_id', $pendingPaymentStatus?->id)
                ->where('status', 'confirmed')
                ->count(),
            'total_paid' => (clone $baseQuery)
                ->where('payment_status_id', $paidPaymentStatus?->id)
                ->sum('price') ?? 0,
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Process payment for an appointment
     */
    public function processPayment(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $appointment = Appointment::with('paymentStatus')
            ->where('id', $id)
            ->where(function($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->orWhere('email', $user->email);
            })
            ->first();

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Запись не найдена'
            ], 404);
        }

        if ($appointment->status !== 'confirmed') {
            return response()->json([
                'success' => false,
                'message' => 'Оплата возможна только для подтверждённых записей'
            ], 422);
        }

        if ($appointment->isPaymentPaid()) {
            return response()->json([
                'success' => false,
                'message' => 'Эта запись уже оплачена'
            ], 422);
        }

        // Here you would integrate with a real payment provider
        // For now, we'll simulate a successful payment
        $request->validate([
            'payment_method' => 'required|in:card,sbp',
        ]);

        $appointment->markAsPaid();

        Log::info("✅ Оплата записи #{$id} выполнена пользователем #{$user->id}");

        $appointment = $appointment->fresh(['paymentStatus']);
        $appointment->payment_status = $appointment->payment_status_name;

        return response()->json([
            'success' => true,
            'message' => 'Оплата успешно выполнена!',
            'data' => $appointment
        ]);
    }

    /**
     * Get single appointment details
     */
    public function getAppointment(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $appointment = Appointment::with(['user', 'paymentStatus'])->find($id);
        } else {
            $appointment = Appointment::with('paymentStatus')
                ->where('id', $id)
                ->where(function($query) use ($user) {
                    $query->where('user_id', $user->id)
                        ->orWhere('email', $user->email);
                })
                ->first();
        }

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Запись не найдена'
            ], 404);
        }

        $appointment->payment_status = $appointment->payment_status_name;

        return response()->json([
            'success' => true,
            'data' => $appointment
        ]);
    }

    /**
     * Admin can mark payment as completed manually
     */
    public function markPaymentComplete(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Доступ запрещён'
            ], 403);
        }

        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Запись не найдена'
            ], 404);
        }

        $appointment->markAsPaid();

        Log::info("✅ Оплата записи #{$id} отмечена администратором #{$user->id}");

        $appointment = $appointment->fresh(['paymentStatus']);
        $appointment->payment_status = $appointment->payment_status_name;

        return response()->json([
            'success' => true,
            'message' => 'Оплата отмечена как выполненная',
            'data' => $appointment
        ]);
    }

    /**
     * Get all clients (admin only)
     */
    public function allClients(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Доступ запрещён'
            ], 403);
        }

        $clientRole = Role::client();
        
        $clients = User::where('role_id', $clientRole?->id)
            ->withCount('appointments')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $clients
        ]);
    }
}
