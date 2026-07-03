<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'client_id', 'project_title', 'project_type', 'project_source',
        'mentor_id', 'middleman_id', 'investor_name', 'mentor_pct', 'investor_pct',
        'total_value', 'status', 'created_by', 'project_lead_id', 'description',
        'repo_url', 'warranty_months', 'warranty_notes',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function mentor(): BelongsTo
    {
        return $this->belongsTo(StaffUser::class, 'mentor_id');
    }

    public function middleman(): BelongsTo
    {
        return $this->belongsTo(Middleman::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(StaffUser::class, 'created_by');
    }

    public function projectLead(): BelongsTo
    {
        return $this->belongsTo(StaffUser::class, 'project_lead_id');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function contributors(): BelongsToMany
    {
        return $this->belongsToMany(StaffUser::class, 'project_contributors', 'project_id', 'user_id')
            ->using(ProjectContributor::class)
            ->withPivot('role', 'dev_share_pct');
    }

    public function distributions(): HasMany
    {
        return $this->hasMany(ProjectDistribution::class);
    }

    public function paymentStages(): HasMany
    {
        return $this->hasMany(PaymentStage::class);
    }

    public function contributionPoints(): HasMany
    {
        return $this->hasMany(ContributionPoint::class);
    }
}
