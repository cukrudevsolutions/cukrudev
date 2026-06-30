<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProjectInquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InquiryController extends Controller
{
    private const STATUSES = ['new', 'contacted', 'proposal_sent', 'won', 'lost', 'archived'];

    public function index(Request $request): Response
    {
        $statusFilter = trim((string) $request->query('status', ''));
        $search = trim((string) $request->query('search', ''));
        $selectedId = (int) $request->query('id', 0);

        $query = ProjectInquiry::query();

        if ($statusFilter !== '' && in_array($statusFilter, self::STATUSES, true)) {
            $query->where('status', $statusFilter);
        }
        if ($search !== '') {
            $query->where(fn ($q) => $q
                ->where('full_name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('company', 'like', "%{$search}%"));
        }

        $inquiries = $query->orderByDesc('created_at')->orderByDesc('id')->get();
        $counts = ProjectInquiry::selectRaw('status, count(*) as n')->groupBy('status')->pluck('n', 'status');

        $selected = $selectedId
            ? ($inquiries->firstWhere('id', $selectedId) ?? ProjectInquiry::find($selectedId))
            : $inquiries->first();

        return Inertia::render('Admin/Inquiries/Index', [
            'inquiries' => $inquiries->map(fn (ProjectInquiry $i) => [
                'id' => $i->id,
                'fullName' => $i->full_name,
                'company' => $i->company,
                'email' => $i->email,
                'phone' => $i->phone,
                'country' => $i->country,
                'projectType' => $i->project_type,
                'source' => $i->source,
                'message' => $i->message,
                'status' => $i->status,
                'createdAt' => $i->created_at->toIso8601String(),
            ]),
            'counts' => $counts,
            'statuses' => self::STATUSES,
            'statusFilter' => $statusFilter,
            'search' => $search,
            'selectedId' => $selected?->id,
        ]);
    }

    public function updateStatus(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'inquiry_id' => ['required', 'integer'],
            'status' => ['required', 'in:'.implode(',', self::STATUSES)],
        ]);

        ProjectInquiry::whereKey($validated['inquiry_id'])->update(['status' => $validated['status']]);

        return back()->with('success', 'Status updated.');
    }
}
