<?php

namespace App\Services;

use App\Models\StaffUser;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class StaffCardService
{
    public function updateAvatar(StaffUser $staff, UploadedFile $file): string
    {
        if ($staff->profile_image) {
            Storage::disk('public')->delete('staff/'.$staff->profile_image);
        }

        $filename = $staff->slug.'_'.Str::random(12).'.jpg';

        $image = Image::read($file)->cover(600, 600)->toJpeg(quality: 85);
        Storage::disk('public')->put('staff/'.$filename, (string) $image);

        return $filename;
    }

    public function removeAvatar(StaffUser $staff): void
    {
        if ($staff->profile_image) {
            Storage::disk('public')->delete('staff/'.$staff->profile_image);
        }
    }

    /**
     * @param  array<int, array{title?: string, description?: string, project_url?: string}>  $projects
     */
    public function syncProjects(StaffUser $staff, array $projects): void
    {
        $staff->staffProjects()->delete();

        foreach (array_values($projects) as $i => $p) {
            $title = trim((string) ($p['title'] ?? ''));

            if ($title === '') {
                continue;
            }

            $staff->staffProjects()->create([
                'title' => Str::limit($title, 160, ''),
                'description' => trim((string) ($p['description'] ?? '')) ?: null,
                'project_url' => StaffUser::safeUrl($p['project_url'] ?? null),
                'sort_order' => $i,
            ]);
        }
    }

    /**
     * @param  array<int, array{title?: string, description?: string, icon?: string}>  $services
     */
    public function syncServices(StaffUser $staff, array $services): void
    {
        $staff->staffServices()->delete();

        foreach (array_values($services) as $i => $s) {
            $title = trim((string) ($s['title'] ?? ''));

            if ($title === '') {
                continue;
            }

            $staff->staffServices()->create([
                'title' => Str::limit($title, 160, ''),
                'description' => trim((string) ($s['description'] ?? '')) ?: null,
                'icon' => trim((string) ($s['icon'] ?? '')) ?: null,
                'sort_order' => $i,
            ]);
        }
    }

    public function urlToHandle(?string $url, string $base): string
    {
        $url = trim((string) $url);

        if ($url === '') {
            return '';
        }

        foreach (['https://www.'.$base, 'http://www.'.$base, 'https://'.$base, 'http://'.$base] as $prefix) {
            if (stripos($url, $prefix) === 0) {
                return rtrim(substr($url, strlen($prefix)), '/');
            }
        }

        return $url;
    }

    public function handleToUrl(?string $handle, string $base): ?string
    {
        $handle = trim((string) $handle);

        if ($handle === '') {
            return null;
        }

        if (preg_match('#^https?://#i', $handle)) {
            return $handle;
        }

        if (str_ends_with($base, '/@') && str_starts_with($handle, '@')) {
            $handle = ltrim($handle, '@');
        }

        return 'https://'.$base.ltrim($handle, '/');
    }
}
