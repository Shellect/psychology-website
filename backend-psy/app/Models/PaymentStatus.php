<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentStatus extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'color',
    ];

    /**
     * Status constants
     */
    public const PENDING = 'pending';
    public const PAID = 'paid';
    public const REFUNDED = 'refunded';

    /**
     * Get appointments with this payment status
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    /**
     * Check if this is pending status
     */
    public function isPending(): bool
    {
        return $this->name === self::PENDING;
    }

    /**
     * Check if this is paid status
     */
    public function isPaid(): bool
    {
        return $this->name === self::PAID;
    }

    /**
     * Check if this is refunded status
     */
    public function isRefunded(): bool
    {
        return $this->name === self::REFUNDED;
    }

    /**
     * Get status by name
     */
    public static function findByName(string $name): ?self
    {
        return static::where('name', $name)->first();
    }

    /**
     * Get pending status
     */
    public static function pending(): ?self
    {
        return static::findByName(self::PENDING);
    }

    /**
     * Get paid status
     */
    public static function paid(): ?self
    {
        return static::findByName(self::PAID);
    }

    /**
     * Get refunded status
     */
    public static function refunded(): ?self
    {
        return static::findByName(self::REFUNDED);
    }
}

