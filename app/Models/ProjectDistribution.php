<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectDistribution extends Model
{
    public $timestamps = false;

    protected $fillable = ['project_id', 'category_name', 'category_key', 'color', 'pct', 'is_variable'];

    protected function casts(): array
    {
        return ['is_variable' => 'boolean'];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
