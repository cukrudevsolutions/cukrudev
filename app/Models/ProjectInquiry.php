<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectInquiry extends Model
{
    protected $fillable = [
        'full_name', 'email', 'phone', 'company', 'country',
        'project_type_id', 'project_type', 'message', 'source',
        'status', 'priority', 'estimated_budget', 'preferred_currency',
        'preferred_timeline', 'consent_marketing', 'ip_address', 'user_agent',
    ];

    protected function casts(): array
    {
        return ['consent_marketing' => 'boolean'];
    }

    public function projectTypeRelation(): BelongsTo
    {
        return $this->belongsTo(ProjectType::class, 'project_type_id');
    }
}
