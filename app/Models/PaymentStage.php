<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentStage extends Model
{
    protected $fillable = [
        'project_id', 'task_id', 'stage_order', 'stage_label', 'percentage', 'amount',
        'invoice_ref', 'invoice_sent_at', 'paid_at', 'receipt_ref', 'receipt_sent_at', 'status',
    ];

    protected function casts(): array
    {
        return [
            'invoice_sent_at' => 'datetime',
            'paid_at' => 'datetime',
            'receipt_sent_at' => 'datetime',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}
