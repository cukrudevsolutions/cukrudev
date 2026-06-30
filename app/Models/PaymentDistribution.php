<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentDistribution extends Model
{
    protected $fillable = [
        'project_id', 'task_id', 'project_source', 'total_amount',
        'company_cut_pct', 'company_cut_amount', 'opex_pct', 'opex_amount',
        'mentor_pct', 'mentor_amount', 'middleman_pct', 'middleman_amount',
        'investor_pct', 'investor_amount', 'middleman_name', 'sales_pct', 'sales_amount',
        'dev_pool_pct', 'dev_pool_amount', 'status', 'paid_at',
    ];

    protected function casts(): array
    {
        return ['paid_at' => 'datetime'];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function earnings(): HasMany
    {
        return $this->hasMany(Earning::class, 'payment_id');
    }
}
