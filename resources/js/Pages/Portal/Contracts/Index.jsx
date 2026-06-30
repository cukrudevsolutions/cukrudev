import PortalLayout from '@/Layouts/PortalLayout';
import { statusBadgeClass, statusLabel } from '@/utils/badges';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const ROLE_LABELS = {
    lead: { label: 'Project Lead', cls: 'bg-blue-100 text-blue-700' },
    contributor: { label: 'Contributor', cls: 'bg-amber-100 text-amber-700' },
    task: { label: 'Task Member', cls: 'bg-gray-100 text-gray-600' },
};

const STEPS = ['pending', 'active', 'completed', 'paid'];
const STEP_LABELS = ['Pending', 'Active', 'Completed', 'Paid'];

export default function Index({ projects }) {
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');

    const counts = projects.reduce((acc, p) => ({ ...acc, [p.status]: (acc[p.status] || 0) + 1 }), {});
    const filtered = projects
        .filter((p) => !filter || p.status === filter)
        .filter((p) => !search || p.title.toLowerCase().includes(search.toLowerCase()));

    const totalValue = projects.reduce((sum, p) => sum + (p.totalValue || 0), 0);
    const paidValue = projects.filter((p) => p.status === 'paid').reduce((sum, p) => sum + (p.totalValue || 0), 0);

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">My Contracts</h2>}>
            <Head title="My Contracts" />

            <p className="mb-4 text-sm text-gray-500">{projects.length} contract{projects.length === 1 ? '' : 's'} you are involved in</p>

            {projects.length > 0 && (
                <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                        <div className="text-xs text-gray-500">Total Contracts</div>
                        <div className="font-mono text-lg font-bold">{projects.length}</div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                        <div className="text-xs text-gray-500">Active Now</div>
                        <div className="font-mono text-lg font-bold text-amber-600">{counts.active || 0}</div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                        <div className="text-xs text-gray-500">Portfolio Value</div>
                        <div className="font-mono text-lg font-bold">RM {totalValue.toFixed(0)}</div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                        <div className="text-xs text-gray-500">Paid Out</div>
                        <div className="font-mono text-lg font-bold text-green-600">RM {paidValue.toFixed(0)}</div>
                    </div>
                </div>
            )}

            <div className="mb-4 flex flex-wrap gap-2">
                <button onClick={() => setFilter('')} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${!filter ? 'border-amber-500 bg-amber-50' : 'border-gray-200 text-gray-600'}`}>
                    All {projects.length}
                </button>
                {['active', 'pending', 'completed', 'paid', 'cancelled'].map((s) => (
                    <button key={s} onClick={() => setFilter(s)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${filter === s ? 'border-amber-500 bg-amber-50' : 'border-gray-200 text-gray-600'}`}>
                        {s} {counts[s] || 0}
                    </button>
                ))}
            </div>

            {projects.length > 0 && (
                <input
                    type="text" placeholder="Search contracts by name…" value={search} onChange={(e) => setSearch(e.target.value)}
                    className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
            )}

            {filtered.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-sm text-gray-400">
                    No contracts found.
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((p) => {
                        const role = ROLE_LABELS[p.myRole] ?? ROLE_LABELS.task;
                        const currentIdx = STEPS.indexOf(p.status);

                        return (
                            <div key={p.id} className="rounded-lg border border-gray-200 bg-white p-4">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1 flex flex-wrap items-center gap-2">
                                            <span className={`rounded px-2 py-0.5 text-xs font-semibold ${statusBadgeClass(p.status)}`}>{statusLabel(p.status)}</span>
                                            <span className={`rounded px-2 py-0.5 text-xs font-semibold ${role.cls}`}>{role.label}</span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900">{p.title}</h3>
                                        <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                                            {p.clientName && <span>{p.clientName}</span>}
                                            {p.leadName && <span>Lead: {p.leadName}</span>}
                                        </div>
                                        {p.description && <p className="mt-2 text-xs text-gray-500 line-clamp-2">{p.description}</p>}
                                    </div>
                                    {p.totalValue && (
                                        <div className="shrink-0 text-right">
                                            <div className="text-xs text-gray-400">Contract Value</div>
                                            <div className="font-mono text-lg font-bold text-amber-600">RM {p.totalValue.toFixed(2)}</div>
                                        </div>
                                    )}
                                </div>

                                {p.status !== 'cancelled' ? (
                                    <div className="mt-3 flex border-t border-gray-100 pt-3">
                                        {STEP_LABELS.map((label, i) => (
                                            <div key={label} className="flex flex-1 flex-col items-center gap-1">
                                                <div className={`h-3 w-3 rounded-full ${i <= currentIdx ? 'bg-amber-500' : 'border-2 border-gray-200'}`} />
                                                <span className={`text-[10px] ${i <= currentIdx ? 'text-amber-600' : 'text-gray-400'}`}>{label}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mt-3 border-t border-gray-100 pt-3 text-xs font-semibold text-red-500">Contract cancelled</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </PortalLayout>
    );
}
