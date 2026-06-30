import PortalLayout from '@/Layouts/PortalLayout';
import { statusBadgeClass } from '@/utils/badges';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ middlemen }) {
    function toggleActive(m) {
        router.post(route('portal.admin.middlemen.toggleActive', m.id), {}, { preserveScroll: true });
    }

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">Middlemen</h2>}>
            <Head title="Middlemen" />

            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">Manage contacts who bring in outside projects</p>
                <Link href={route('portal.admin.middlemen.edit')} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">
                    + Add Middleman
                </Link>
            </div>

            {middlemen.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-sm text-gray-400">No middlemen yet.</div>
            ) : (
                <div className="space-y-3">
                    {middlemen.map((m) => (
                        <div key={m.id} className="rounded-lg border border-gray-200 bg-white p-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                                    {m.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-semibold text-gray-900">{m.name}</span>
                                        {m.company && <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{m.company}</span>}
                                        <span className={`rounded px-2 py-0.5 text-xs font-semibold ${m.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {m.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="mt-1 flex gap-3 text-xs text-gray-500">
                                        {m.phone && <span>{m.phone}</span>}
                                        {m.email && <span>{m.email}</span>}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-amber-600">{m.projectCount}</div>
                                    <div className="text-xs text-gray-400">Projects</div>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={route('portal.admin.middlemen.edit', m.id)} className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                                        Edit
                                    </Link>
                                    <button onClick={() => toggleActive(m)} className={`rounded-md border px-3 py-1.5 text-xs font-medium ${m.isActive ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                                        {m.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                </div>
                            </div>
                            {m.projects.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                                    {m.projects.map((p) => (
                                        <Link key={p.id} href={route('portal.admin.contracts.edit', p.id)} className="flex items-center gap-2 rounded-md bg-gray-50 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100">
                                            {p.title}
                                            <span className={`rounded px-1.5 py-0.5 text-[10px] ${statusBadgeClass(p.status)}`}>{p.status}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </PortalLayout>
    );
}
