<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'description',
    ];

    /**
     * Role constants
     */
    public const ADMIN = 'admin';
    public const CLIENT = 'client';

    /**
     * Get users with this role
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Check if this role is admin
     */
    public function isAdmin(): bool
    {
        return $this->name === self::ADMIN;
    }

    /**
     * Check if this role is client
     */
    public function isClient(): bool
    {
        return $this->name === self::CLIENT;
    }

    /**
     * Get role by name
     */
    public static function findByName(string $name): ?self
    {
        return static::where('name', $name)->first();
    }

    /**
     * Get admin role
     */
    public static function admin(): ?self
    {
        return static::findByName(self::ADMIN);
    }

    /**
     * Get client role
     */
    public static function client(): ?self
    {
        return static::findByName(self::CLIENT);
    }
}

