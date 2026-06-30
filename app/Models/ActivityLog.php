<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    public $timestamps = false;

    protected $fillable = ['user_id', 'action', 'module', 'description'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(StaffUser::class, 'user_id');
    }

    public static function record(?int $userId, string $action, string $module, string $description): self
    {
        return self::create([
            'user_id' => $userId,
            'action' => $action,
            'module' => $module,
            'description' => $description,
        ]);
    }
}
