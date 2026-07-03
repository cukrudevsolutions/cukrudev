import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const STATUS_COLORS = {
    pending: 'bg-gray-100 text-gray-600',
    active: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    paid: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
};

function formatValue(value) {
    if (value === null || value === undefined) return '—';

    return 'RM ' + value.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Index({ projects, statuses }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const filtered = projects.filter((p) => {
        const q = search.toLowerCase();
        const matchesSearch = !q || p.title.toLowerCase().includes(q) || (p.clientName ?? '').toLowerCase().includes(q);
        const matchesStatus = !statusFilter || p.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">Projects</h2>}>
            <Head title="Projects" />

            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">{projects.length} total</p>
                <Link href={route('portal.admin.projects.edit')} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">
                    + Add Project
                </Link>
            </div>

            {projects.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                    <input
                        type="text" placeholder="Search by project or client name…" value={search} onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <select
                        value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                        <option value="">All statuses</option>
                        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            )}

            {filtered.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-sm text-gray-400">No projects found.</div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left text-xs text-gray-500">
                            <tr>
                                <th className="px-4 py-2">Project</th><th className="px-4 py-2">Client</th><th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Status</th><th className="px-4 py-2">Value</th><th className="px-4 py-2">Added</th><th className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((p) => (
                                <tr key={p.id}>
                                    <td className="px-4 py-2 font-medium text-gray-800">{p.title}</td>
                                    <td className="px-4 py-2">{p.clientName ?? '—'}</td>
                                    <td className="px-4 py-2">
                                        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{p.type.replace('_', ' ')}</span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[p.status] ?? 'bg-gray-100 text-gray-600'}`}>{p.status}</span>
                                    </td>
                                    <td className="px-4 py-2">{formatValue(p.totalValue)}</td>
                                    <td className="px-4 py-2 font-mono text-xs">{p.createdAt}</td>
                                    <td className="px-4 py-2">
                                        <Link href={route('portal.admin.projects.edit', p.id)} className="text-xs font-medium text-amber-600 hover:underline">Edit</Link>
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
