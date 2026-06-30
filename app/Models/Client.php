<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    protected $fillable = [
        'client_name', 'contact_person', 'phone', 'email', 'source', 'handled_by', 'notes',
    ];

    public function handler(): BelongsTo
    {
        return $this->belongsTo(StaffUser::class, 'handled_by');
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
