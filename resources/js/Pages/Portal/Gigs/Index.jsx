import PortalLayout from '@/Layouts/PortalLayout';
import { statusBadgeClass, statusLabel } from '@/utils/badges';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const STATUS_OPTIONS = ['pending', 'accepted', 'in_progress', 'submitted', 'revision', 'completed', 'paid'];

export default function Index({ tasks, counts, filterStatus, filterProject }) {
    const [search, setSearch] = useState('');
    const total = Object.values(counts).reduce((a, b) => a + Number(b), 0);
    const filtered = tasks.filter((t) => !search || t.title.toLowerCase().includes(search.toLowerCase()));

    function filterUrl(status) {
        const params = new URLSearchParams();
        if (status) params.set('status', status);
        if (filterProject) params.set('project', filterProject);
        const qs = params.toString();

        return route('portal.gigs.index') + (qs ? `?${qs}` : '');
    }

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">My Gigs</h2>}>
            <Head title="My Gigs" />

            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">All gigs assigned to you</p>
                <Link href={route('portal.points.index')} className="text-sm font-medium text-amber-600 hover:underline">My Points</Link>
            </div>

            {total > 0 && (
                <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                        <div className="text-xs text-gray-500">Total Gigs</div>
                        <div className="font-mono text-lg font-bold">{total}</div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                        <div className="text-xs text-gray-500">In Progress</div>
                        <div className="font-mono text-lg font-bold text-amber-600">{counts.in_progress || 0}</div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                        <div className="text-xs text-gray-500">Awaiting</div>
                        <div className="font-mono text-lg font-bold text-blue-600">{(counts.pending || 0) + (counts.accepted || 0)}</div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                        <div className="text-xs text-gray-500">Completed</div>
                        <div className="font-mono text-lg font-bold text-green-600">{(counts.completed || 0) + (counts.paid || 0)}</div>
                    </div>
                </div>
            )}

            <div className="mb-4 flex flex-wrap gap-2">
                <Link href={filterUrl('')} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${!filterStatus ? 'border-amber-500 bg-amber-50' : 'border-gray-200 text-gray-600'}`}>
                    All {total}
                </Link>
                {STATUS_OPTIONS.map((s) => (
                    <Link key={s} href={filterUrl(s)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${filterStatus === s ? 'border-amber-500 bg-amber-50' : 'border-gray-200 text-gray-600'}`}>
                        {statusLabel(s)} {counts[s] || 0}
                    </Link>
                ))}
            </div>

            {total > 0 && (
                <input
                    type="text" placeholder="Search gigs by name…" value={search} onChange={(e) => setSearch(e.target.value)}
                    className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
            )}

            {filtered.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-sm text-gray-400">No gigs found.</div>
            ) : (
                <div className="space-y-2">
                    {filtered.map((t) => (
                        <Link key={t.id} href={route('portal.gigs.show', t.id)} className="block rounded-lg border border-gray-200 bg-white p-4 hover:border-amber-300">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1 flex flex-wrap items-center gap-2">
                                        <span className={`rounded px-2 py-0.5 text-xs font-semibold ${statusBadgeClass(t.status)}`}>{statusLabel(t.status)}</span>
                                        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{statusLabel(t.taskType)}</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900">{t.title}</h3>
                                    {t.projectTitle && <div className="mt-1 text-xs text-gray-500">{t.projectTitle}</div>}
                                </div>
                                <div className="shrink-0 text-right">
                                    {t.taskPoint > 0 && <span className="block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">{t.taskPoint} pts</span>}
                                    {t.dueDate && <span className="mt-1 block text-xs text-gray-400">{t.dueDate}</span>}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </PortalLayout>
    );
}
