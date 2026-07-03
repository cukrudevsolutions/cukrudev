import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

function fmt(n) {
    return 'RM ' + Number(n || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ProjectPayment({ project, payment, distributions, devSplit, defaultAmount, earnings, stages }) {
    const isProcessed = !!payment;
    const [amount, setAmount] = useState(defaultAmount || 0);

    const devPct = distributions.find((d) => d.categoryKey === 'dev')?.pct ?? 0;

    const payForm = useForm({
        total_amount: defaultAmount || '',
        transfer_refs: Object.fromEntries(devSplit.map((d) => [d.userId, ''])),
    });

    const stageForm = useForm({ project_id: project.id, task_id: '', stage_label: '', amount: '', percentage: '' });

    const allRefsFilled = devSplit.every((d) => (payForm.data.transfer_refs[d.userId] ?? '').trim() !== '');

    function submitPayment(e) {
        e.preventDefault();
        if (!confirm(`Confirm payment of RM ${payForm.data.total_amount}? This cannot be undone.`)) return;
        payForm.post(route('portal.admin.payments.project.process', project.id));
    }

    function submitStage(e) {
        e.preventDefault();
        stageForm.post(route('portal.admin.payments.stages.add'), {
            preserveScroll: true,
            onSuccess: () => stageForm.reset('stage_label', 'amount', 'percentage'),
        });
    }

    const totalStaged = stages.reduce((sum, s) => sum + s.amount, 0);

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">{isProcessed ? 'Payment Summary' : 'Process Payment'}</h2>}>
            <Head title="Process Payment" />

            <Link href={route('portal.admin.projects.edit', project.id)} className="mb-4 inline-block text-sm text-gray-500 hover:underline">&larr; {project.title}</Link>

            {Object.keys(payForm.errors).length > 0 && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{Object.values(payForm.errors).join(' — ')}</div>
            )}

            <div className="mb-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 sm:grid-cols-5">
                {[
                    ['Client', project.clientName ?? '—'],
                    ['Type', project.type.replace('_', ' ')],
                    ['Source', project.source.replace('_', ' ')],
                    ['Status', project.status],
                    ['Value', project.totalValue ? fmt(project.totalValue) : '—'],
                ].map(([label, val]) => (
                    <div key={label} className="bg-white px-4 py-3">
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</div>
                        <div className="text-sm font-semibold text-gray-800">{val}</div>
                    </div>
                ))}
            </div>

            {isProcessed ? (
                <div className="mb-4 rounded-lg border border-gray-200 bg-white p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-800">Distribution Summary</h3>
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Processed {new Date(payment.createdAt).toLocaleString()}
                        </span>
                    </div>
                    <div className="mb-4 text-2xl font-black text-amber-600">{fmt(payment.totalAmount)}</div>
                    <DistributionTable distributions={distributions} amount={payment.totalAmount} />
                </div>
            ) : (
                <form onSubmit={submitPayment} id="payform">
                    <div className="mb-4 rounded-lg border border-gray-200 bg-white p-5">
                        <h3 className="mb-3 text-sm font-semibold text-gray-800">Amount Received from Client</h3>
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-gray-500">RM</span>
                            <input
                                type="number" min="0.01" step="0.01" value={payForm.data.total_amount}
                                onChange={(e) => { payForm.setData('total_amount', e.target.value); setAmount(parseFloat(e.target.value) || 0); }}
                                required className="w-48 rounded-md border border-gray-300 px-3 py-2 text-lg font-bold text-amber-600"
                            />
                            {project.totalValue && <span className="text-xs text-gray-500">Project value: <strong>{fmt(project.totalValue)}</strong></span>}
                        </div>
                    </div>

                    <div className="mb-4 rounded-lg border border-gray-200 bg-white p-5">
                        <h3 className="mb-3 text-sm font-semibold text-gray-800">Payment Distribution</h3>
                        <DistributionTable distributions={distributions} amount={amount} />
                    </div>

                    <div className="mb-4 rounded-lg border border-gray-200 bg-white p-5">
                        <h3 className="mb-3 text-sm font-semibold text-gray-800">Dev Pool — Team Split</h3>
                        {devSplit.length === 0 ? (
                            <p className="text-sm text-gray-400">No contributors or completed tasks found. Add contributors to the project first.</p>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="text-left text-xs text-gray-500">
                                    <tr><th className="py-1">Member</th><th className="py-1 text-right">%</th><th className="py-1 text-right">Dev Share</th><th className="py-1 text-right">Bank Ref *</th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {devSplit.map((d) => (
                                        <tr key={d.userId}>
                                            <td className="py-2">
                                                <div className="font-medium text-gray-800">{d.fullName}</div>
                                                {(d.bankName || d.bankAccountNo) ? (
                                                    <div className="text-xs text-gray-400">{d.bankName} · {d.bankAccountNo}</div>
                                                ) : (
                                                    <div className="text-xs text-red-500">No bank info on file</div>
                                                )}
                                            </td>
                                            <td className="py-2 text-right font-mono">{d.pct}%</td>
                                            <td className="py-2 text-right font-mono font-bold text-amber-600">{fmt(amount * devPct / 100 * d.pct / 100)}</td>
                                            <td className="py-2 text-right">
                                                <input
                                                    type="text" placeholder="e.g. TT2405250001" required
                                                    value={payForm.data.transfer_refs[d.userId] ?? ''}
                                                    onChange={(e) => payForm.setData('transfer_refs', { ...payForm.data.transfer_refs, [d.userId]: e.target.value })}
                                                    className="w-48 rounded-md border border-gray-300 px-2 py-1 text-xs font-mono"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="mb-4 flex justify-end">
                        <button
                            type="submit" disabled={payForm.processing || !allRefsFilled}
                            className="rounded-md bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-40"
                            title={!allRefsFilled ? 'Enter bank transfer ref for all staff first' : ''}
                        >
                            Confirm &amp; Record Distribution
                        </button>
                    </div>
                </form>
            )}

            {isProcessed && earnings.length > 0 && (
                <div className="mb-4 rounded-lg border border-gray-200 bg-white p-5">
                    <h3 className="mb-3 text-sm font-semibold text-gray-800">Staff Transfers</h3>
                    <div className="divide-y divide-gray-100">
                        {earnings.map((e) => (
                            <EarningRow key={e.id} earning={e} />
                        ))}
                    </div>
                </div>
            )}

            <div className="rounded-lg border border-gray-200 bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">Payment Stages</h3>
                </div>

                {!isProcessed && (
                    <form onSubmit={submitStage} className="mb-4 flex flex-wrap items-end gap-2 rounded-md bg-gray-50 p-3">
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Label</label>
                            <input type="text" value={stageForm.data.stage_label} onChange={(e) => stageForm.setData('stage_label', e.target.value)} required placeholder="e.g. Deposit" className="rounded-md border border-gray-300 px-2 py-1.5 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Amount (RM)</label>
                            <input type="number" min="0.01" step="0.01" value={stageForm.data.amount} onChange={(e) => stageForm.setData('amount', e.target.value)} required className="w-32 rounded-md border border-gray-300 px-2 py-1.5 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">%</label>
                            <input type="number" min="0" max="100" step="0.01" value={stageForm.data.percentage} onChange={(e) => stageForm.setData('percentage', e.target.value)} className="w-24 rounded-md border border-gray-300 px-2 py-1.5 text-sm" />
                        </div>
                        <button type="submit" disabled={stageForm.processing} className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">Add Stage</button>
                    </form>
                )}

                {stages.length === 0 ? (
                    <p className="text-sm text-gray-400">No stages yet.</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="text-left text-xs text-gray-500">
                            <tr><th className="py-1">#</th><th className="py-1">Label</th><th className="py-1 text-right">Amount</th><th className="py-1">Status</th><th className="py-1 text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stages.map((s) => <StageRow key={s.id} stage={s} viewOnly={isProcessed} />)}
                        </tbody>
                    </table>
                )}
            </div>
        </PortalLayout>
    );
}

function DistributionTable({ distributions, amount }) {
    const total = distributions.reduce((sum, d) => sum + (amount * d.pct / 100), 0);

    return (
        <>
            <div className="mb-4 flex h-2.5 overflow-hidden rounded-full bg-gray-100">
                {distributions.filter((d) => d.pct > 0).map((d) => (
                    <div key={d.categoryKey} style={{ width: `${d.pct}%`, background: d.color || '#888' }} title={`${d.categoryName}: ${d.pct}%`} />
                ))}
            </div>
            <table className="w-full text-sm">
                <thead className="text-left text-xs text-gray-500">
                    <tr><th className="py-1">Category</th><th className="py-1 text-right">%</th><th className="py-1 text-right">Amount</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {distributions.map((d) => (
                        <tr key={d.categoryKey}>
                            <td className="py-1.5 flex items-center gap-2">
                                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: d.color || '#888' }} />
                                {d.categoryName}
                            </td>
                            <td className="py-1.5 text-right font-mono">{d.pct.toFixed(1)}%</td>
                            <td className="py-1.5 text-right font-mono font-bold text-amber-600">{fmt(amount * d.pct / 100)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="border-t-2 border-gray-300">
                        <td className="py-1.5 font-semibold" colSpan={2}>Total</td>
                        <td className="py-1.5 text-right font-mono font-black text-amber-600">{fmt(total)}</td>
                    </tr>
                </tfoot>
            </table>
        </>
    );
}

function EarningRow({ earning }) {
    const form = useForm({ transfer_ref: '' });
    const isTransferred = !!earning.transferredAt;

    function submit(e) {
        e.preventDefault();
        form.post(route('portal.admin.payments.earnings.transfer', earning.id), { preserveScroll: true });
    }

    return (
        <div className="flex flex-wrap items-start gap-4 py-3">
            <div className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${isTransferred ? 'bg-green-400' : 'bg-gray-300'}`} />
            <div className="min-w-[160px] flex-1">
                <div className="font-semibold text-gray-800">{earning.staffName}</div>
                <div className="text-xs uppercase tracking-wide text-gray-400">{earning.earningType.replace('_', ' ')}</div>
                {(earning.bankName || earning.bankAccountNo) && (
                    <div className="mt-1 text-xs text-gray-500">{earning.bankName} · {earning.bankAccountNo}</div>
                )}
            </div>
            <div className="min-w-[120px] text-right">
                <div className="text-[10px] uppercase tracking-wide text-gray-400">Amount</div>
                <div className="font-mono text-xl font-black text-amber-600">{fmt(earning.amount)}</div>
                {isTransferred && <div className="mt-1 text-xs font-semibold text-green-600">Transferred {new Date(earning.transferredAt).toLocaleDateString()}</div>}
                {earning.transferRef && <div className="font-mono text-xs text-gray-400">{earning.transferRef}</div>}
            </div>
            {isTransferred ? (
                <span className="self-center rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">Done</span>
            ) : (
                <form onSubmit={submit} className="flex items-end gap-2">
                    <input type="text" placeholder="Bank ref" required value={form.data.transfer_ref} onChange={(e) => form.setData('transfer_ref', e.target.value)} className="w-40 rounded-md border border-gray-300 px-2 py-1 text-xs font-mono" />
                    <button type="submit" disabled={form.processing} className="rounded-md bg-gray-800 px-3 py-1 text-xs font-semibold text-white hover:bg-gray-700 disabled:opacity-50">Mark Transferred</button>
                </form>
            )}
        </div>
    );
}

function StageRow({ stage, viewOnly }) {
    const invoiceForm = useForm({});
    const paidForm = useForm({});
    const deleteForm = useForm({});

    const badge = { paid: 'bg-green-100 text-green-700', invoiced: 'bg-blue-100 text-blue-700', pending: 'bg-gray-100 text-gray-600' }[stage.status];

    return (
        <tr>
            <td className="py-2 text-xs font-bold text-gray-400">{stage.order}</td>
            <td className="py-2 font-medium">{stage.label}</td>
            <td className="py-2 text-right font-mono font-bold text-amber-600">{fmt(stage.amount)}</td>
            <td className="py-2"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badge}`}>{stage.status}</span></td>
            <td className="py-2 text-right">
                {!viewOnly && stage.status === 'pending' && (
                    <span className="inline-flex gap-2">
                        <button
                            type="button"
                            onClick={() => invoiceForm.post(route('portal.admin.payments.stages.invoice', stage.id), { preserveScroll: true })}
                            className="text-xs font-medium text-amber-600 hover:underline"
                        >Send Invoice</button>
                        <button
                            type="button"
                            onClick={() => { if (confirm('Delete this stage?')) deleteForm.delete(route('portal.admin.payments.stages.delete', stage.id), { preserveScroll: true }); }}
                            className="text-xs font-medium text-red-600 hover:underline"
                        >Delete</button>
                    </span>
                )}
                {!viewOnly && stage.status === 'invoiced' && (
                    <button
                        type="button"
                        onClick={() => { if (confirm('Mark this stage as paid?')) paidForm.post(route('portal.admin.payments.stages.paid', stage.id), { preserveScroll: true }); }}
                        className="text-xs font-medium text-green-600 hover:underline"
                    >Mark as Paid</button>
                )}
            </td>
        </tr>
    );
}
