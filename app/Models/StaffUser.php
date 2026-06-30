<?php

namespace App\Models;

use Database\Factories\StaffUserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StaffUser extends Authenticatable
{
    /** @use HasFactory<StaffUserFactory> */
    use HasFactory, Notifiable;

    protected $table = 'staff_users';

    protected $fillable = [
        'full_name',
        'slug',
        'email',
        'phone',
        'password_hash',
        'position',
        'short_title',
        'bio',
        'expertise',
        'skill_tags',
        'availability_status',
        'profile_image',
        'linkedin_url',
        'github_url',
        'instagram_url',
        'tiktok_url',
        'youtube_url',
        'website_url',
        'whatsapp_number',
        'is_admin',
        'is_active',
        'bank_name',
        'bank_account_no',
    ];

    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'expertise' => 'array',
            'is_admin' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function getAuthPassword(): string
    {
        return $this->password_hash;
    }

    public function avatarUrl(): ?string
    {
        if ($this->profile_image && Storage::disk('public')->exists('staff/'.$this->profile_image)) {
            return Storage::disk('public')->url('staff/'.$this->profile_image);
        }

        return null;
    }

    public function initials(): string
    {
        $words = preg_split('/\s+/', trim($this->full_name)) ?: [];
        $initials = '';

        foreach (array_slice($words, 0, 2) as $word) {
            $initials .= Str::upper(Str::substr($word, 0, 1));
        }

        return $initials !== '' ? $initials : '?';
    }

    public function whatsappLink(): ?string
    {
        if (! $this->whatsapp_number) {
            return null;
        }

        return 'https://wa.me/'.preg_replace('/\D/', '', $this->whatsapp_number);
    }

    public static function safeUrl(?string $url): ?string
    {
        $url = trim((string) $url);

        if ($url === '') {
            return null;
        }

        if (! preg_match('#^https?://#i', $url)) {
            $url = 'https://'.$url;
        }

        return filter_var($url, FILTER_VALIDATE_URL) ?: null;
    }

    public function tasksAssigned(): HasMany
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    public function projectContributions(): HasMany
    {
        return $this->hasMany(ProjectContributor::class, 'user_id');
    }

    public function earnings(): HasMany
    {
        return $this->hasMany(Earning::class, 'user_id');
    }

    public function staffProjects(): HasMany
    {
        return $this->hasMany(StaffProject::class, 'staff_id');
    }

    public function staffServices(): HasMany
    {
        return $this->hasMany(StaffService::class, 'staff_id');
    }

    public function taskOffers(): HasMany
    {
        return $this->hasMany(TaskOffer::class, 'offered_to');
    }

    public function clientsHandled(): HasMany
    {
        return $this->hasMany(Client::class, 'handled_by');
    }

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_contributors', 'user_id', 'project_id')
            ->using(ProjectContributor::class)
            ->withPivot('role', 'dev_share_pct')
            ->withTimestamps();
    }
}
