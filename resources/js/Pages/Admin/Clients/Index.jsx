import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ clients }) {
    const [search, setSearch] = useState('');
    const filtered = clients.filter((c) => {
        const q = search.toLowerCase();

        return !q || c.clientName.toLowerCase().includes(q) || (c.contactPerson ?? '').toLowerCase().includes(q);
    });

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">Clients</h2>}>
            <Head title="Clients" />

            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">{clients.length} total</p>
                <Link href={route('portal.admin.clients.edit')} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">
                    + Add Client
                </Link>
            </div>

            {clients.length > 0 && (
                <input
                    type="text" placeholder="Search by company or contact name…" value={search} onChange={(e) => setSearch(e.target.value)}
                    className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
            )}

            {filtered.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-sm text-gray-400">No clients found.</div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left text-xs text-gray-500">
                            <tr>
                                <th className="px-4 py-2">Client</th><th className="px-4 py-2">Contact</th><th className="px-4 py-2">Source</th>
                                <th className="px-4 py-2">Handler</th><th className="px-4 py-2">Added</th><th className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((c) => (
                                <tr key={c.id}>
                                    <td className="px-4 py-2">
                                        <div className="font-medium text-gray-800">{c.clientName}</div>
                                        {c.email && <div className="text-xs text-gray-400">{c.email}</div>}
                                    </td>
                                    <td className="px-4 py-2">
                                        {c.contactPerson ?? '—'}
                                        {c.phone && <div className="text-xs text-gray-400">{c.phone}</div>}
                                    </td>
                                    <td className="px-4 py-2">{c.source ? <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{c.source}</span> : '—'}</td>
                                    <td className="px-4 py-2">{c.handlerName ?? '—'}</td>
                                    <td className="px-4 py-2 font-mono text-xs">{c.createdAt}</td>
                                    <td className="px-4 py-2">
                                        <Link href={route('portal.admin.clients.edit', c.id)} className="text-xs font-medium text-amber-600 hover:underline">Edit</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </PortalLayout>
    );
}
