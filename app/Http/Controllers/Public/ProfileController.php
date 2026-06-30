<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\StaffUser;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show(Request $request, string $slug)
    {
        $staff = StaffUser::where('slug', $slug)->first();

        if (! $staff || ! $staff->is_active) {
            return Inertia::render('Public/ProfileNotFound')
                ->toResponse($request)
                ->setStatusCode(HttpResponse::HTTP_NOT_FOUND);
        }

        $socialLinks = array_filter([
            'linkedin' => ['url' => StaffUser::safeUrl($staff->linkedin_url), 'label' => 'LinkedIn'],
            'github' => ['url' => StaffUser::safeUrl($staff->github_url), 'label' => 'GitHub'],
            'instagram' => ['url' => StaffUser::safeUrl($staff->instagram_url), 'label' => 'Instagram'],
            'tiktok' => ['url' => StaffUser::safeUrl($staff->tiktok_url), 'label' => 'TikTok'],
            'youtube' => ['url' => StaffUser::safeUrl($staff->youtube_url), 'label' => 'YouTube'],
        ], fn ($link) => $link['url'] !== null);

        return Inertia::render('Public/Profile', [
            'staff' => [
                'id' => $staff->id,
                'fullName' => $staff->full_name,
                'slug' => $staff->slug,
                'position' => $staff->position,
                'shortTitle' => $staff->short_title,
                'bio' => $staff->bio,
                'email' => $staff->email,
                'expertise' => $staff->expertise ?? [],
                'avatarUrl' => $staff->avatarUrl(),
                'initials' => $staff->initials(),
                'whatsappLink' => $staff->whatsappLink(),
                'websiteUrl' => StaffUser::safeUrl($staff->website_url) ?? 'https://cukrudev.com',
                'socialLinks' => $socialLinks,
            ],
            'projects' => $staff->staffProjects()->orderBy('sort_order')->orderBy('id')->get()->map(fn ($p) => [
                'title' => $p->title,
                'description' => $p->description,
                'imageUrl' => $p->project_image,
                'projectUrl' => $p->project_url,
            ]),
            'services' => $staff->staffServices()->orderBy('sort_order')->orderBy('id')->get()->map(fn ($s) => [
                'title' => $s->title,
                'description' => $s->description,
                'icon' => $s->icon,
            ]),
            'isNfc' => $request->query('src') === 'nfc',
        ]);
    }
}
