<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\StaffUser;
use App\Services\StaffCardService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class CardController extends Controller
{
    public function __construct(private StaffCardService $cardService) {}

    public function show(Request $request): Response
    {
        $staff = $request->user();

        return Inertia::render('Portal/Card/Show', [
            'staff' => $this->staffPayload($staff),
            'checklist' => $this->checklist($staff),
        ]);
    }

    public function edit(Request $request): Response
    {
        $staff = $request->user();

        return Inertia::render('Portal/Card/Edit', [
            'staff' => $this->staffPayload($staff),
            'checklist' => $this->checklist($staff),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $staff = $request->user();

        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:160'],
            'position' => ['nullable', 'string', 'max:120'],
            'short_title' => ['nullable', 'string', 'max:160'],
            'phone' => ['nullable', 'string', 'max:40'],
            'bio' => ['nullable', 'string', 'max:300'],
            'expertise' => ['array'],
            'expertise.*' => ['string', 'max:60'],
            'whatsapp_number' => ['nullable', 'string', 'max:40'],
            'website_url' => ['nullable', 'string', 'max:255'],
            'linkedin_url' => ['nullable', 'string', 'max:255'],
            'github_url' => ['nullable', 'string', 'max:255'],
            'instagram_url' => ['nullable', 'string', 'max:255'],
            'tiktok_url' => ['nullable', 'string', 'max:255'],
            'youtube_url' => ['nullable', 'string', 'max:255'],
            'profile_image' => ['nullable', 'image', 'max:5120'],
            'remove_image' => ['boolean'],
            'services' => ['array'],
            'services.*.title' => ['nullable', 'string', 'max:160'],
            'services.*.description' => ['nullable', 'string'],
            'services.*.icon' => ['nullable', 'string', 'max:8'],
            'projects' => ['array'],
            'projects.*.title' => ['nullable', 'string', 'max:160'],
            'projects.*.description' => ['nullable', 'string'],
            'projects.*.project_url' => ['nullable', 'string', 'max:255'],
            'current_password' => ['nullable', 'string'],
            'password' => ['nullable', 'string', 'min:8', 'same:password_confirm'],
            'password_confirm' => ['nullable', 'string'],
        ]);

        if (filled($validated['password'] ?? null)) {
            if (! Hash::check($request->input('current_password', ''), $staff->password_hash)) {
                return back()->withErrors(['current_password' => 'Current password is incorrect.'])->withInput();
            }
        }

        $update = [
            'full_name' => $validated['full_name'],
            'position' => $validated['position'] ?? null,
            'short_title' => $validated['short_title'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'bio' => $validated['bio'] ?? null,
            'expertise' => array_values(array_filter($validated['expertise'] ?? [])),
            'whatsapp_number' => $validated['whatsapp_number'] ?? null,
            'website_url' => StaffUser::safeUrl($validated['website_url'] ?? null),
            'linkedin_url' => $this->cardService->handleToUrl($validated['linkedin_url'] ?? null, 'linkedin.com/in/'),
            'github_url' => $this->cardService->handleToUrl($validated['github_url'] ?? null, 'github.com/'),
            'instagram_url' => $this->cardService->handleToUrl($validated['instagram_url'] ?? null, 'instagram.com/'),
            'tiktok_url' => $this->cardService->handleToUrl($validated['tiktok_url'] ?? null, 'tiktok.com/@'),
            'youtube_url' => $this->cardService->handleToUrl($validated['youtube_url'] ?? null, 'youtube.com/@'),
        ];

        if ($request->boolean('remove_image')) {
            $this->cardService->removeAvatar($staff);
            $update['profile_image'] = null;
        } elseif ($request->hasFile('profile_image')) {
            $update['profile_image'] = $this->cardService->updateAvatar($staff, $request->file('profile_image'));
        }

        if (filled($validated['password'] ?? null)) {
            $update['password_hash'] = Hash::make($validated['password']);
        }

        $staff->update($update);

        $this->cardService->syncServices($staff, $validated['services'] ?? []);
        $this->cardService->syncProjects($staff, $validated['projects'] ?? []);

        return back()->with('success', 'Profile updated successfully.');
    }

    private function staffPayload($staff): array
    {
        return [
            'id' => $staff->id,
            'fullName' => $staff->full_name,
            'slug' => $staff->slug,
            'email' => $staff->email,
            'position' => $staff->position,
            'shortTitle' => $staff->short_title,
            'phone' => $staff->phone,
            'bio' => $staff->bio,
            'expertise' => $staff->expertise ?? [],
            'whatsappNumber' => $staff->whatsapp_number,
            'websiteUrl' => $staff->website_url,
            'linkedinHandle' => $this->cardService->urlToHandle($staff->linkedin_url, 'linkedin.com/in/'),
            'githubHandle' => $this->cardService->urlToHandle($staff->github_url, 'github.com/'),
            'instagramHandle' => $this->cardService->urlToHandle($staff->instagram_url, 'instagram.com/'),
            'tiktokHandle' => $this->cardService->urlToHandle($staff->tiktok_url, 'tiktok.com/@'),
            'youtubeHandle' => $this->cardService->urlToHandle($staff->youtube_url, 'youtube.com/@'),
            'avatarUrl' => $staff->avatarUrl(),
            'initials' => $staff->initials(),
            'isActive' => $staff->is_active,
            'availabilityStatus' => $staff->availability_status,
            'services' => $staff->staffServices()->orderBy('sort_order')->get(['title', 'description', 'icon']),
            'projects' => $staff->staffProjects()->orderBy('sort_order')->get(['title', 'description', 'project_url']),
        ];
    }

    private function checklist($staff): array
    {
        $checks = [
            'Photo' => (bool) $staff->profile_image,
            'Bio' => filled(trim((string) $staff->bio)),
            'Expertise' => filled($staff->expertise),
            'WhatsApp' => filled($staff->whatsapp_number),
            'LinkedIn' => filled($staff->linkedin_url),
            'Services' => $staff->staffServices()->exists(),
            'Projects' => $staff->staffProjects()->exists(),
        ];

        return [
            'items' => $checks,
            'pct' => (int) round(count(array_filter($checks)) / count($checks) * 100),
        ];
    }
}
