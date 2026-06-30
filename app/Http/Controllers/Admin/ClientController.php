<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Client;
use App\Models\StaffUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    private const SOURCES = ['referral', 'instagram', 'tiktok', 'website', 'walk_in', 'cold_outreach', 'other'];

    public function index(): Response
    {
        $clients = Client::with('handler')->orderByDesc('created_at')->get();

        return Inertia::render('Admin/Clients/Index', [
            'clients' => $clients->map(fn (Client $c) => [
                'id' => $c->id,
                'clientName' => $c->client_name,
                'contactPerson' => $c->contact_person,
                'phone' => $c->phone,
                'email' => $c->email,
                'source' => $c->source,
                'handlerName' => $c->handler?->full_name,
                'createdAt' => $c->created_at->toDateString(),
            ]),
        ]);
    }

    public function edit(?Client $client = null): Response
    {
        return Inertia::render('Admin/Clients/Edit', [
            'client' => $client ? [
                'id' => $client->id,
                'clientName' => $client->client_name,
                'contactPerson' => $client->contact_person,
                'phone' => $client->phone,
                'email' => $client->email,
                'source' => $client->source,
                'handledBy' => $client->handled_by,
                'notes' => $client->notes,
            ] : null,
            'staff' => StaffUser::where('is_active', true)->orderBy('full_name')->get(['id', 'full_name']),
            'sources' => self::SOURCES,
        ]);
    }

    public function store(Request $request, ?Client $client = null): RedirectResponse
    {
        $validated = $request->validate([
            'client_name' => ['required', 'string', 'max:200'],
            'contact_person' => ['nullable', 'string', 'max:200'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:200'],
            'source' => ['nullable', 'string', 'in:'.implode(',', self::SOURCES)],
            'handled_by' => ['nullable', 'integer', 'exists:staff_users,id'],
            'notes' => ['nullable', 'string'],
        ]);

        $isNew = ! $client;
        $client ??= new Client();
        $client->fill($validated);
        $client->save();

        ActivityLog::record($request->user()->id, $isNew ? 'client_created' : 'client_updated', 'clients',
            ($isNew ? 'Created' : 'Updated').' client: '.$client->client_name);

        return redirect()->route('portal.admin.clients.edit', $client)
            ->with('success', 'Client '.($isNew ? 'created' : 'updated').' successfully.');
    }
}
