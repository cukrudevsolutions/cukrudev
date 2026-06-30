import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

const STATUS_BADGE = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-amber-100 text-amber-700',
    proposal_sent: 'bg-blue-100 text-blue-700',
    won: 'bg-green-100 text-green-700',
    lost: 'bg-red-100 text-red-700',
    archived: 'bg-gray-100 text-gray-500',
};

function statusLabel(s) {
    return s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Index({ inquiries, counts, statuses, statusFilter, search, selectedId }) {
    const selected = inquiries.find((i) => i.id === selectedId) ?? inquiries[0];
    const { data, setData, post } = useForm({ inquiry_id: selected?.id, status: selected?.status ?? '' });

    function buildUrl(params) {
        const merged = { status: statusFilter || undefined, search: search || undefined, ...params };
        const qs = new URLSearchParams(Object.entries(merged).filter(([, v]) => v)).toString();

        return route('portal.admin.inquiries.index') + (qs ? `?${qs}` : '');
    }

    function updateStatus(inquiryId, status) {
        router.post(route('portal.admin.inquiries.updateStatus'), { inquiry_id: inquiryId, status }, { preserveScroll: true });
    }

    const totalAll = Object.values(counts).reduce((a, b) => a + Number(b), 0);

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">Inquiries</h2>}>
            <Head title="Inquiries" />
            <p className="mb-4 text-sm text-gray-500">{totalAll} inquiry{totalAll === 1 ? '' : 'ies'} total</p>

            <div className="mb-4 flex flex-wrap gap-2">
                <Link href={buildUrl({ status: undefined })} className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${!statusFilter ? 'border-amber-500 bg-amber-50' : 'border-gray-200 text-gray-600'}`}>
                    All {totalAll}
                </Link>
                {statuses.map((s) => (
                    <Link key={s} href={buildUrl({ status: s })} className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${statusFilter === s ? 'border-amber-500 bg-amber-50' : 'border-gray-200 text-gray-600'}`}>
                        {statusLabel(s)} <span className={`ml-1 rounded px-1.5 ${STATUS_BADGE[s]}`}>{counts[s] || 0}</span>
                    </Link>
                ))}
            </div>

            <form
                onSubmit={(e) => { e.preventDefault(); router.get(buildUrl({ search: new FormData(e.target).get('search') })); }}
                className="mb-4 flex gap-2"
            >
                <input type="text" name="search" defaultValue={search} placeholder="Search name, email, company…" className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm" />
                <button type="submit" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Search</button>
            </form>

            <div className="flex items-start gap-4">
                <div className="w-80 shrink-0 rounded-lg border border-gray-200 bg-white">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2 text-xs font-semibold uppercase text-gray-400">
                        <span>Inquiries</span>
                        <span>{inquiries.length} record{inquiries.length === 1 ? '' : 's'}</span>
                    </div>
                    <div className="max-h-[70vh] overflow-y-auto">
                        {inquiries.length === 0 && <p className="p-6 text-center text-sm text-gray-400">No inquiries found</p>}
                        {inquiries.map((i) => (
                            <Link
                                key={i.id}
                                href={buildUrl({ id: i.id })}
                                className={`block border-b border-gray-50 px-4 py-3 ${selected?.id === i.id ? 'border-l-2 border-l-amber-500 bg-amber-50' : 'hover:bg-gray-50'}`}
                            >
                                <div className="mb-1 flex items-start justify-between gap-2">
                                    <span className="text-sm font-semibold text-gray-800">{i.fullName}</span>
                                    <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${STATUS_BADGE[i.status]}`}>{statusLabel(i.status)}</span>
                                </div>
                                <div className="text-xs text-gray-500">{i.company || '—'}</div>
                                <div className="text-[10px] text-gray-400">{new Date(i.createdAt).toLocaleDateString()}</div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    {!selected ? (
                        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center text-sm text-gray-400">Select an inquiry to view details</div>
                    ) : (
                        <>
                            <div className="mb-3 rounded-lg border border-gray-200 bg-white p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">{selected.fullName}</h2>
                                        <div className="text-sm text-gray-500">{selected.company || '—'}</div>
                                        <div className="mt-1 text-xs text-gray-400">Received: {new Date(selected.createdAt).toLocaleString()}</div>
                                    </div>
                                    <span className={`rounded px-3 py-1 text-xs font-bold ${STATUS_BADGE[selected.status]}`}>{statusLabel(selected.status)}</span>
                                </div>
                            </div>

                            <div className="mb-3 rounded-lg border border-gray-200 bg-white p-5">
                                <h3 className="mb-3 font-semibold text-gray-800">Contact Details</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {[
                                        ['Email', selected.email, `mailto:${selected.email}`],
                                        ['Phone', selected.phone, `tel:${selected.phone}`],
                                        ['Country', selected.country],
                                        ['Project Type', selected.projectType],
                                        ['Source', selected.source],
                                    ].filter(([, v]) => v).map(([label, val, href]) => (
                                        <div key={label}>
                                            <div className="text-[10px] font-semibold uppercase text-gray-400">{label}</div>
                                            {href ? <a href={href} className="text-amber-600">{val}</a> : <div className="text-gray-800">{val}</div>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selected.message && (
                                <div className="mb-3 rounded-lg border border-gray-200 bg-white p-5">
                                    <h3 className="mb-2 font-semibold text-gray-800">Message</h3>
                                    <p className="whitespace-pre-wrap text-sm text-gray-700">{selected.message}</p>
                                </div>
                            )}

                            <div className="rounded-lg border border-gray-200 bg-white p-5">
                                <h3 className="mb-3 font-semibold text-gray-800">Update Status</h3>
                                <div className="flex flex-wrap items-center gap-2">
                                    <select value={data.status} onChange={(e) => setData('status', e.target.value)} className="rounded-md border border-gray-300 px-3 py-2 text-sm">
                                        {statuses.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
                                    </select>
                                    <button type="button" onClick={() => updateStatus(selected.id, data.status)} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">
                                        Save Status
                                    </button>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {statuses.filter((s) => s !== selected.status).map((s) => (
                                        <button key={s} onClick={() => updateStatus(selected.id, s)} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[s]}`}>
                                            &rarr; {statusLabel(s)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </PortalLayout>
    );
}
