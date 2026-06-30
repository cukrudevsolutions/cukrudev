<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    /** Statuses that count toward opportunity points — accepted and onward. */
    public const POINT_STATUSES = ['accepted', 'in_progress', 'submitted', 'revision', 'completed', 'paid'];

    protected $fillable = [
        'project_id', 'client_id', 'title', 'description', 'repo_url', 'task_type',
        'task_point', 'task_value', 'middleman_applies', 'middleman_id', 'assigned_to',
        'status', 'progress_notes', 'due_date', 'completed_at', 'warranty_months', 'warranty_notes',
    ];

    protected function casts(): array
    {
        return [
            'middleman_applies' => 'boolean',
            'due_date' => 'date',
            'completed_at' => 'datetime',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function middleman(): BelongsTo
    {
        return $this->belongsTo(Middleman::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(StaffUser::class, 'assigned_to');
    }

    public function offers(): HasMany
    {
        return $this->hasMany(TaskOffer::class);
    }

    public function paymentStages(): HasMany
    {
        return $this->hasMany(PaymentStage::class);
    }

    public function opportunityPoints(): HasMany
    {
        return $this->hasMany(OpportunityPoint::class);
    }

    public function scopeAssignedTo(Builder $query, int $userId): Builder
    {
        return $query->where('assigned_to', $userId);
    }

    public function scopeCountingTowardPoints(Builder $query): Builder
    {
        return $query->whereIn('status', self::POINT_STATUSES);
    }
}
