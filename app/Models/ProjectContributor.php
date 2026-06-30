<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ProjectContributor extends Pivot
{
    public $incrementing = true;

    public $timestamps = false;

    protected $table = 'project_contributors';

    protected $fillable = ['project_id', 'user_id', 'role', 'dev_share_pct'];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(StaffUser::class, 'user_id');
    }
}
