<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
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
        'status'
    ];

    protected $casts = [
        'preferred_date' => 'date',
        'cookie_consent' => 'boolean',
        'created_at' => 'datetime',
        'update_at' => 'datetime'
    ];
}