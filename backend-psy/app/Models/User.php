<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'phone',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the role that the user belongs to
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->role?->isAdmin() ?? false;
    }

    /**
     * Check if user is client
     */
    public function isClient(): bool
    {
        return $this->role?->isClient() ?? true;
    }

    /**
     * Get role name
     */
    public function getRoleNameAttribute(): string
    {
        return $this->role?->name ?? Role::CLIENT;
    }

    /**
     * Get appointments for this user
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    /**
     * Assign role by name
     */
    public function assignRole(string $roleName): void
    {
        $role = Role::findByName($roleName);
        if ($role) {
            $this->role_id = $role->id;
            $this->save();
        }
    }
}
