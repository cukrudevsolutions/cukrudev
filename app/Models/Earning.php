<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use LogicException;

class Earning extends Model
{
    /** Columns that may still change after an earning row is created (marking it transferred). */
    private const MUTABLE_AFTER_CREATE = ['transfer_ref', 'transferred_at', 'status', 'paid_at', 'updated_at'];

    protected $fillable = [
        'payment_id', 'task_id', 'source_type', 'user_id', 'amount', 'earning_type',
        'status', 'paid_at', 'transfer_ref', 'transferred_at',
    ];

    protected function casts(): array
    {
        return [
            'paid_at' => 'datetime',
            'transferred_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::updating(function (Earning $earning) {
            $changed = array_keys($earning->getDirty());

            if (array_diff($changed, self::MUTABLE_AFTER_CREATE) !== []) {
                throw new LogicException('Earning rows are immutable except for transfer/payment status fields.');
            }
        });
    }

    public function paymentDistribution(): BelongsTo
    {
        return $this->belongsTo(PaymentDistribution::class, 'payment_id');
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(StaffUser::class, 'user_id');
    }
}
