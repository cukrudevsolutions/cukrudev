import PortalLayout from '@/Layouts/PortalLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ leaderboard, contributions, opportunities, projects, tasks, staff }) {
    const contributionForm = useForm({ project_id: '', user_id: '', point: 1, remark: '' });
    const opportunityForm = useForm({ task_id: '', user_id: '', point: 1, reason: '' });

    function submitContribution(e) {
        e.preventDefault();
        contributionForm.post(route('portal.admin.points.contributions.store'), {
            preserveScroll: true,
            onSuccess: () => contributionForm.reset('remark'),
        });
    }

    function submitOpportunity(e) {
        e.preventDefault();
        opportunityForm.post(route('portal.admin.points.opportunities.store'), {
            preserveScroll: true,
            onSuccess: () => opportunityForm.reset('reason'),
        });
    }

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">Points</h2>}>
            <Head title="Points" />

            <div className="mb-8 overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-xs text-gray-500">
                        <tr>
                            <th className="px-4 py-2">Rank</th><th className="px-4 py-2">Staff</th><th className="px-4 py-2">Task Points (fair-rotation)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {leaderboard.map((s) => (
                            <tr key={s.id}>
                                <td className="px-4 py-2 font-mono text-xs">#{s.rank}</td>
                                <td className="px-4 py-2 font-medium text-gray-800">{s.full_name}</td>
                                <td className="px-4 py-2">{s.total_points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <h3 className="mb-3 text-sm font-semibold text-gray-800">Award Contribution Point</h3>
                    <form onSubmit={submitContribution} className="space-y-3">
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Project *</label>
                            <select value={contributionForm.data.project_id} onChange={(e) => contributionForm.setData('project_id', e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                <option value="">— Select —</option>
                                {projects.map((p) => <option key={p.id} value={p.id}>{p.project_title}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Staff *</label>
                            <select value={contributionForm.data.user_id} onChange={(e) => contributionForm.setData('user_id', e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                <option value="">— Select —</option>
                                {staff.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Points *</label>
                            <input type="number" min="1" value={contributionForm.data.point} onChange={(e) => contributionForm.setData('point', e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Remark</label>
                            <textarea rows={2} value={contributionForm.data.remark} onChange={(e) => contributionForm.setData('remark', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <button type="submit" disabled={contributionForm.processing} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
                            Award
                        </button>
                    </form>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <h3 className="mb-3 text-sm font-semibold text-gray-800">Award Opportunity Point</h3>
                    <form onSubmit={submitOpportunity} className="space-y-3">
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Task *</label>
                            <select value={opportunityForm.data.task_id} onChange={(e) => opportunityForm.setData('task_id', e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                <option value="">— Select —</option>
                                {tasks.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Staff *</label>
                            <select value={opportunityForm.data.user_id} onChange={(e) => opportunityForm.setData('user_id', e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                <option value="">— Select —</option>
                                {staff.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Points *</label>
                            <input type="number" min="1" value={opportunityForm.data.point} onChange={(e) => opportunityForm.setData('point', e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Reason</label>
                            <input type="text" value={opportunityForm.data.reason} onChange={(e) => opportunityForm.setData('reason', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <button type="submit" disabled={opportunityForm.processing} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
                            Award
                        </button>
                    </form>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-800">Recent Contribution Points</h3>
                    {contributions.length === 0 ? (
                        <p className="text-sm text-gray-400">None yet.</p>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-left text-xs text-gray-500">
                                    <tr><th className="px-3 py-2">Staff</th><th className="px-3 py-2">Project</th><th className="px-3 py-2">Pts</th><th className="px-3 py-2">By</th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {contributions.map((c) => (
                                        <tr key={c.id}>
                                            <td className="px-3 py-2 font-medium text-gray-800">{c.staffName}</td>
                                            <td className="px-3 py-2">{c.projectTitle ?? '—'}</td>
                                            <td className="px-3 py-2">{c.point}</td>
                                            <td className="px-3 py-2 text-gray-400">{c.createdByName ?? '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-800">Recent Opportunity Points</h3>
                    {opportunities.length === 0 ? (
                        <p className="text-sm text-gray-400">None yet.</p>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-left text-xs text-gray-500">
                                    <tr><th className="px-3 py-2">Staff</th><th className="px-3 py-2">Task</th><th className="px-3 py-2">Pts</th><th className="px-3 py-2">Reason</th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {opportunities.map((o) => (
                                        <tr key={o.id}>
                                            <td className="px-3 py-2 font-medium text-gray-800">{o.staffName}</td>
                                            <td className="px-3 py-2">{o.taskTitle ?? '—'}</td>
                                            <td className="px-3 py-2">{o.point}</td>
                                            <td className="px-3 py-2 text-gray-400">{o.reason ?? '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </PortalLayout>
    );
}
