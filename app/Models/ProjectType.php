<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectType extends Model
{
    public $timestamps = false;

    protected $fillable = ['name', 'is_active'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }
}
