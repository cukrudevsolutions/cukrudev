<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\StaffUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('q', ''));
        $filter = $request->query('status', 'all');

        $query = StaffUser::query();

        if ($search !== '') {
            $query->where(fn ($q) => $q
                ->where('full_name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('position', 'like', "%{$search}%"));
        }
        if ($filter === 'active') {
            $query->where('is_active', true);
        } elseif ($filter === 'inactive') {
            $query->where('is_active', false);
        }

        $staffList = $query->orderBy('id')->get();
        $pointsByUser = StaffUser::rankedByPoints()->pluck('total_points', 'id');

        return Inertia::render('Admin/Staff/Index', [
            'staffList' => $staffList->map(fn (StaffUser $s) => [
                'id' => $s->id,
                'fullName' => $s->full_name,
                'position' => $s->position,
                'email' => $s->email,
                'avatarUrl' => $s->avatarUrl(),
                'initials' => $s->initials(),
                'isAdmin' => $s->is_admin,
                'isActive' => $s->is_active,
                'availabilityStatus' => $s->availability_status,
                'skillTags' => $s->expertise ?? [],
                'totalPoints' => $pointsByUser[$s->id] ?? 0,
            ]),
            'search' => $search,
            'filter' => $filter,
        ]);
    }

    public function edit(?StaffUser $staff = null): Response
    {
        return Inertia::render('Admin/Staff/Edit', [
            'staff' => $staff ? [
                'id' => $staff->id,
                'fullName' => $staff->full_name,
                'email' => $staff->email,
                'position' => $staff->position,
                'phone' => $staff->phone,
                'bio' => $staff->bio,
                'slug' => $staff->slug,
                'availabilityStatus' => $staff->availability_status,
                'expertise' => $staff->expertise ?? [],
                'isAdmin' => $staff->is_admin,
                'isActive' => $staff->is_active,
                'bankName' => $staff->bank_name,
                'bankAccountNo' => $staff->bank_account_no,
            ] : null,
        ]);
    }

    public function store(Request $request, ?StaffUser $staff = null): RedirectResponse
    {
        $isNew = ! $staff;

        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:160'],
            'email' => ['required', 'email', 'max:190', 'unique:staff_users,email,'.($staff?->id ?? 'NULL').',id'],
            'position' => ['nullable', 'string', 'max:120'],
            'phone' => ['nullable', 'string', 'max:40'],
            'bio' => ['nullable', 'string'],
            'slug' => ['nullable', 'string', 'max:80'],
            'availability_status' => ['required', 'in:available,busy,unavailable'],
            'expertise' => ['array'],
            'expertise.*' => ['string', 'max:60'],
            'is_admin' => ['boolean'],
            'is_active' => ['boolean'],
            'bank_name' => ['nullable', 'string', 'max:200'],
            'bank_account_no' => ['nullable', 'string', 'max:100'],
            'password' => [$isNew ? 'required' : 'nullable', 'string', 'min:8'],
        ]);

        $slug = StaffUser::sanitizeSlug(($validated['slug'] ?? '') ?: $validated['full_name']);
        if ($slug === '') {
            return back()->withErrors(['slug' => 'Slug is required.'])->withInput();
        }

        if ($isNew) {
            $base = $slug;
            $n = 1;
            while (StaffUser::isSlugTaken($slug)) {
                $slug = $base.'_'.$n++;
            }
        } elseif (StaffUser::isSlugTaken($slug, $staff->id)) {
            return back()->withErrors(['slug' => "Slug \"/{$slug}\" is already taken."])->withInput();
        }

        $data = [
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'position' => $validated['position'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'bio' => $validated['bio'] ?? null,
            'slug' => $slug,
            'availability_status' => $validated['availability_status'],
            'expertise' => array_values(array_filter($validated['expertise'] ?? [])),
            'is_admin' => $request->boolean('is_admin'),
            'is_active' => $request->boolean('is_active'),
            'bank_name' => $validated['bank_name'] ?? null,
            'bank_account_no' => $validated['bank_account_no'] ?? null,
        ];

        if (filled($validated['password'] ?? null)) {
            $data['password_hash'] = Hash::make($validated['password']);
        }

        $isNew ? $staff = StaffUser::create($data) : $staff->update($data);

        ActivityLog::record($request->user()->id, $isNew ? 'staff_created' : 'staff_updated', 'staff',
            ($isNew ? 'Created' : 'Updated').' staff: '.$staff->full_name);

        return redirect()->route('portal.admin.staff.edit', $staff)
            ->with('success', 'Staff member '.($isNew ? 'created' : 'updated').' successfully.');
    }

    public function toggleActive(Request $request, StaffUser $staff): RedirectResponse
    {
        $staff->update(['is_active' => ! $staff->is_active]);

        ActivityLog::record($request->user()->id, $staff->is_active ? 'staff_activated' : 'staff_deactivated',
            'staff', "Staff \"{$staff->full_name}\" ".($staff->is_active ? 'activated' : 'deactivated').' by admin');

        return back()->with('success', 'Staff status updated.');
    }
}
