import PortalLayout from '@/Layouts/PortalLayout';
import { statusLabel } from '@/utils/badges';
import { Head, useForm } from '@inertiajs/react';

function PaymentBreakdown({ breakdown, hasMiddleman, value }) {
    return (
        <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
            <div className="mb-3 text-xs font-semibold uppercase text-gray-400">Payment Breakdown</div>
            <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Gig Value</span>
                <span className="font-mono text-lg font-bold text-gray-900">RM {value.toFixed(2)}</span>
            </div>
            <div className="mb-3 flex h-2 overflow-hidden rounded-full bg-gray-200">
                <div style={{ width: `${breakdown.dev.pct}%` }} className="bg-green-400" />
                <div style={{ width: `${breakdown.comp.pct}%` }} className="bg-amber-500" />
                {hasMiddleman && <div style={{ width: `${breakdown.mm.pct}%` }} className="bg-sky-400" />}
            </div>
            <div className="space-y-1.5">
                <div className="flex items-center justify-between rounded-md bg-green-50 px-3 py-2">
                    <span className="text-sm font-semibold text-green-700">Your Share (Dev) · {breakdown.dev.pct}%</span>
                    <span className="font-mono font-bold text-green-700">RM {breakdown.dev.amt.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                    <div className="flex flex-1 items-center justify-between rounded-md bg-white px-3 py-2 text-xs">
                        <span>Company · {breakdown.comp.pct}%</span>
                        <span className="font-mono font-bold text-amber-600">RM {breakdown.comp.amt.toFixed(2)}</span>
                    </div>
                    {hasMiddleman && (
                        <div className="flex flex-1 items-center justify-between rounded-md bg-white px-3 py-2 text-xs">
                            <span>Middleman · {breakdown.mm.pct}%</span>
                            <span className="font-mono font-bold text-sky-600">RM {breakdown.mm.amt.toFixed(2)}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function OfferCard({ offer }) {
    const { data, setData, post, processing } = useForm({ offer_id: offer.id, response: '', reason: '' });

    function respond(response) {
        post(route('portal.offers.respond'), {
            data: { offer_id: offer.id, response, reason: data.reason },
            preserveScroll: true,
        });
    }

    return (
        <div className="overflow-hidden rounded-lg border-2 border-amber-400 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1">
                        <div className="mb-1 text-lg font-bold text-gray-900">{offer.taskTitle}</div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            {offer.projectTitle && <span>{offer.projectTitle}</span>}
                            <span className="rounded bg-gray-100 px-2 py-0.5">{statusLabel(offer.taskType)}</span>
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-700">{offer.taskPoint} opportunity pts</span>
                            {offer.dueDate && <span>Due {offer.dueDate}</span>}
                            {offer.repoUrl && <a href={offer.repoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 underline">Repository</a>}
                        </div>
                        {offer.description && <div className="mt-2 rounded-md border border-gray-100 bg-gray-50 p-2 text-xs text-gray-600">{offer.description}</div>}
                    </div>
                    <div className="shrink-0 text-right text-xs text-gray-400">
                        <div>Offered</div>
                        <div>{new Date(offer.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>

            {offer.breakdown ? (
                <PaymentBreakdown breakdown={offer.breakdown} hasMiddleman={offer.middlemanApplies} value={offer.taskValue} />
            ) : (
                <div className="border-b border-gray-100 bg-gray-50 px-5 py-3 text-xs text-gray-500">
                    Gig value not set yet — payment amount will be confirmed by admin.
                </div>
            )}

            <div className="px-5 py-4">
                <label className="mb-1 block text-xs font-semibold text-gray-600">Reason <span className="font-normal text-gray-400">(optional — required if rejecting)</span></label>
                <textarea
                    rows={2}
                    value={data.reason}
                    onChange={(e) => setData('reason', e.target.value)}
                    placeholder="Add a note about your decision…"
                    className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <div className="flex gap-2">
                    <button type="button" disabled={processing} onClick={() => respond('accepted')} className="flex-1 rounded-md border border-green-500 py-2 text-sm font-semibold text-green-600 hover:bg-green-50">
                        Accept Gig
                    </button>
                    <button type="button" disabled={processing} onClick={() => respond('rejected')} className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600">
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Index({ pending, history }) {
    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">Gig Offers</h2>}>
            <Head title="Gig Offers" />

            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">Gigs offered to you by admin</p>
                {pending.length > 0 && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">{pending.length} pending</span>
                )}
            </div>

            {pending.length > 0 ? (
                <div className="mb-8 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400">Pending Response</h3>
                    {pending.map((o) => <OfferCard key={o.id} offer={o} />)}
                </div>
            ) : history.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-sm text-gray-400">No offers yet</div>
            ) : null}

            {history.length > 0 && (
                <div>
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">History</h3>
                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-left text-xs text-gray-500">
                                <tr>
                                    <th className="px-4 py-2">Gig</th>
                                    <th className="px-4 py-2">Points</th>
                                    <th className="px-4 py-2">Value (RM)</th>
                                    <th className="px-4 py-2">Response</th>
                                    <th className="px-4 py-2">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {history.map((o) => (
                                    <tr key={o.id}>
                                        <td className="px-4 py-2 font-medium text-gray-800">{o.taskTitle}</td>
                                        <td className="px-4 py-2">{o.taskPoint}</td>
                                        <td className="px-4 py-2 font-mono">{o.taskValue ? `RM ${o.taskValue.toFixed(2)}` : '—'}</td>
                                        <td className="px-4 py-2">
                                            <span className={`rounded px-2 py-0.5 text-xs font-semibold ${o.response === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{o.response}</span>
                                        </td>
                                        <td className="px-4 py-2 text-xs text-gray-500">{o.respondedAt ? new Date(o.respondedAt).toLocaleDateString() : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </PortalLayout>
    );
}
