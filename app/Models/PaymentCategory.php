<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class PaymentCategory extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'source', 'display_name', 'config_key', 'color', 'pct',
        'sort_order', 'is_core', 'is_variable', 'remainder_to',
    ];

    protected function casts(): array
    {
        return [
            'is_core' => 'boolean',
            'is_variable' => 'boolean',
        ];
    }

    public function scopeForSource(Builder $query, string $source): Builder
    {
        return $query->where('source', $source)->orderBy('sort_order')->orderBy('id');
    }
}
