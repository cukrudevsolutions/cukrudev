<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContributionPoint extends Model
{
    protected $fillable = ['project_id', 'user_id', 'point', 'remark', 'created_by'];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(StaffUser::class, 'user_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(StaffUser::class, 'created_by');
    }
}
