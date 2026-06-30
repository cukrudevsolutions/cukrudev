<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffProject extends Model
{
    public $timestamps = false;

    protected $fillable = ['staff_id', 'title', 'description', 'project_image', 'project_url', 'sort_order'];

    public function staff(): BelongsTo
    {
        return $this->belongsTo(StaffUser::class, 'staff_id');
    }
}
