<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffService extends Model
{
    public $timestamps = false;

    protected $fillable = ['staff_id', 'title', 'description', 'icon', 'sort_order'];

    public function staff(): BelongsTo
    {
        return $this->belongsTo(StaffUser::class, 'staff_id');
    }
}
