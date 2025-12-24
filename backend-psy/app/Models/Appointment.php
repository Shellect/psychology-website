<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'email', 
        'phone',
        'message',
        'preferred_date',
        'preferred_time',
        'service_type',
        'ip_address',
        'user_agent',
        'cookie_consent',
        'status',
        'payment_status_id',
        'price',
        'paid_at'
    ];

    protected $casts = [
        'preferred_date' => 'date',
        'cookie_consent' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'paid_at' => 'datetime',
        'price' => 'decimal:2'
    ];

    /**
     * Get the user that owns the appointment
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the payment status
     */
    public function paymentStatus()
    {
        return $this->belongsTo(PaymentStatus::class);
    }

    /**
     * Get payment status name
     */
    public function getPaymentStatusNameAttribute(): string
    {
        return $this->paymentStatus?->name ?? PaymentStatus::PENDING;
    }

    /**
     * Check if payment is pending
     */
    public function isPaymentPending(): bool
    {
        return $this->paymentStatus?->isPending() ?? true;
    }

    /**
     * Check if payment is paid
     */
    public function isPaymentPaid(): bool
    {
        return $this->paymentStatus?->isPaid() ?? false;
    }

    /**
     * Scope for pending payments
     */
    public function scopePendingPayment($query)
    {
        $pendingStatus = PaymentStatus::pending();
        return $query->where('payment_status_id', $pendingStatus?->id);
    }

    /**
     * Scope for paid appointments
     */
    public function scopePaid($query)
    {
        $paidStatus = PaymentStatus::paid();
        return $query->where('payment_status_id', $paidStatus?->id);
    }

    /**
     * Scope for confirmed appointments
     */
    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    /**
     * Mark as paid
     */
    public function markAsPaid(): void
    {
        $paidStatus = PaymentStatus::paid();
        $this->update([
            'payment_status_id' => $paidStatus?->id,
            'paid_at' => now()
        ]);
    }

    /**
     * Mark as refunded
     */
    public function markAsRefunded(): void
    {
        $refundedStatus = PaymentStatus::refunded();
        $this->update([
            'payment_status_id' => $refundedStatus?->id,
        ]);
    }

    /**
     * Get price for service type
     */
    public static function getPriceForService(string $serviceType): float
    {
        return match($serviceType) {
            'individual' => 3000.00,
            'couple' => 5000.00,
            'online' => 2500.00,
            default => 3000.00
        };
    }
}
