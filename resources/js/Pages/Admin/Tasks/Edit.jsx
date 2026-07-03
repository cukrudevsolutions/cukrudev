import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ task, projects, clients, middlemen, rankedStaff, types, statuses }) {
    const isNew = !task;
    const { data, setData, post, processing, errors } = useForm({
        project_id: task?.projectId ?? '',
        client_id: task?.clientId ?? '',
        title: task?.title ?? '',
        description: task?.description ?? '',
        repo_url: task?.repoUrl ?? '',
        task_type: task?.taskType ?? types[0],
        task_point: task?.taskPoint ?? 1,
        task_value: task?.taskValue ?? '',
        middleman_applies: task?.middlemanApplies ?? false,
        middleman_id: task?.middlemanId ?? '',
        status: task?.status ?? statuses[0],
        progress_notes: task?.progressNotes ?? '',
        due_date: task?.dueDate ?? '',
        warranty_months: task?.warrantyMonths ?? '',
        warranty_notes: task?.warrantyNotes ?? '',
    });

    const offerForm = useForm({ staff_id: rankedStaff[0]?.id ?? '' });

    function submit(e) {
        e.preventDefault();
        post(route('portal.admin.tasks.store', task?.id));
    }

    function sendOffer(e) {
        e.preventDefault();
        offerForm.post(route('portal.admin.tasks.offer', task.id), { preserveScroll: true });
    }

    function withdrawOffer() {
        offerForm.delete(route('portal.admin.tasks.offer.withdraw', [task.id, task.pendingOffer.id]), { preserveScroll: true });
    }

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">{isNew ? 'Add Task' : 'Edit Task'}</h2>}>
            <Head title={isNew ? 'Add Task' : 'Edit Task'} />

            <Link href={route('portal.admin.tasks.index')} className="mb-4 inline-block text-sm text-gray-500 hover:underline">&larr; Tasks</Link>

            {Object.keys(errors).length > 0 && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{Object.values(errors).join(' — ')}</div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Task Title *</label>
                            <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Project</label>
                            <select value={data.project_id} onChange={(e) => setData('project_id', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                <option value="">— None —</option>
                                {projects.map((p) => <option key={p.id} value={p.id}>{p.project_title}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Client</label>
                            <select value={data.client_id} onChange={(e) => setData('client_id', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                <option value="">— None —</option>
                                {clients.map((c) => <option key={c.id} value={c.id}>{c.client_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Task Type *</label>
                            <select value={data.task_type} onChange={(e) => setData('task_type', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                {types.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Status *</label>
                            <select value={data.status} onChange={(e) => setData('status', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                {statuses.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Task Points *</label>
                            <input type="number" min="0" value={data.task_point} onChange={(e) => setData('task_point', e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Task Value (RM)</label>
                            <input type="number" step="0.01" min="0" value={data.task_value} onChange={(e) => setData('task_value', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Due Date</label>
                            <input type="date" value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div className="flex items-end gap-2 pb-2">
                            <input type="checkbox" id="middleman_applies" checked={data.middleman_applies} onChange={(e) => setData('middleman_applies', e.target.checked)} className="rounded border-gray-300" />
                            <label htmlFor="middleman_applies" className="text-xs font-semibold text-gray-600">Middleman cut applies</label>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Middleman</label>
                            <select value={data.middleman_id} onChange={(e) => setData('middleman_id', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                <option value="">— None —</option>
                                {middlemen.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Repo URL</label>
                            <input type="text" value={data.repo_url} onChange={(e) => setData('repo_url', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Warranty (months)</label>
                            <input type="number" min="0" value={data.warranty_months} onChange={(e) => setData('warranty_months', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="mb-1 block text-xs font-semibold text-gray-600">Description</label>
                        <textarea rows={3} value={data.description} onChange={(e) => setData('description', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                    </div>
                    <div className="mt-4">
                        <label className="mb-1 block text-xs font-semibold text-gray-600">Progress Notes</label>
                        <textarea rows={2} value={data.progress_notes} onChange={(e) => setData('progress_notes', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                    </div>
                    <div className="mt-4">
                        <label className="mb-1 block text-xs font-semibold text-gray-600">Warranty Notes</label>
                        <textarea rows={2} value={data.warranty_notes} onChange={(e) => setData('warranty_notes', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    {!isNew && (
                        <Link href={route('portal.admin.payments.task', task.id)} className="rounded-md border border-amber-300 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50">
                            Process Payment
                        </Link>
                    )}
                    <Link href={route('portal.admin.tasks.index')} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</Link>
                    <button type="submit" disabled={processing} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
                        {isNew ? 'Create Task' : 'Save Changes'}
                    </button>
                </div>
            </form>

            {!isNew && (
                <div className="mt-8 rounded-lg border border-gray-200 bg-white p-5">
                    <h3 className="mb-3 text-sm font-semibold text-gray-800">Assignment</h3>

                    {task.assignedTo ? (
                        <p className="text-sm text-gray-700">Assigned to <span className="font-medium">{task.assigneeName}</span>.</p>
                    ) : task.pendingOffer ? (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-700">
                                Offer pending with <span className="font-medium">{task.pendingOffer.staffName}</span>
                                <span className="ml-2 text-xs text-gray-400">since {new Date(task.pendingOffer.createdAt).toLocaleString()}</span>
                            </p>
                            <button type="button" onClick={withdrawOffer} className="text-xs font-medium text-red-600 hover:underline">Withdraw Offer</button>
                        </div>
                    ) : rankedStaff.length === 0 ? (
                        <p className="text-sm text-gray-400">No active staff available.</p>
                    ) : (
                        <form onSubmit={sendOffer} className="flex flex-wrap items-end gap-2">
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-600">Offer to staff (ranked by fewest points first)</label>
                                <select value={offerForm.data.staff_id} onChange={(e) => offerForm.setData('staff_id', e.target.value)} className="min-w-[16rem] rounded-md border border-gray-300 px-3 py-2 text-sm">
                                    {rankedStaff.map((s) => (
                                        <option key={s.id} value={s.id}>#{s.rank} {s.full_name} ({s.total_points} pts)</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" disabled={offerForm.processing} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
                                Send Offer
                            </button>
                        </form>
                    )}

                    {task.offerHistory.length > 0 && (
                        <table className="mt-4 w-full text-sm">
                            <thead className="text-left text-xs text-gray-500">
                                <tr>
                                    <th className="py-1 pr-4">Staff</th><th className="py-1 pr-4">Response</th><th className="py-1 pr-4">Reason</th><th className="py-1">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {task.offerHistory.map((o) => (
                                    <tr key={o.id}>
                                        <td className="py-2 pr-4">{o.staffName}</td>
                                        <td className="py-2 pr-4">
                                            <span className={`rounded px-2 py-0.5 text-xs font-medium ${o.response === 'accepted' ? 'bg-green-100 text-green-700' : o.response === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{o.response}</span>
                                        </td>
                                        <td className="py-2 pr-4 text-gray-500">{o.reason ?? '—'}</td>
                                        <td className="py-2 font-mono text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </PortalLayout>
    );
}
