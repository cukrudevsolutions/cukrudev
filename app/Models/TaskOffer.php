<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskOffer extends Model
{
    protected $fillable = ['task_id', 'offered_to', 'response', 'reason', 'responded_at'];

    protected function casts(): array
    {
        return ['responded_at' => 'datetime'];
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function offeredTo(): BelongsTo
    {
        return $this->belongsTo(StaffUser::class, 'offered_to');
    }
}
