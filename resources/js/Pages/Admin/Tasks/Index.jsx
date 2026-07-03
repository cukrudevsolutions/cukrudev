import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link, router } from '@inertiajs/react';

const STATUS_COLORS = {
    pending: 'bg-gray-100 text-gray-600',
    offered: 'bg-purple-100 text-purple-700',
    accepted: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-blue-100 text-blue-700',
    submitted: 'bg-yellow-100 text-yellow-700',
    revision: 'bg-orange-100 text-orange-700',
    completed: 'bg-green-100 text-green-700',
    paid: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function Index({ tasks, statuses, projects, statusFilter, projectFilter }) {
    function updateFilter(key, value) {
        router.get(route('portal.admin.tasks.index'), {
            status: key === 'status' ? value : statusFilter,
            project: key === 'project' ? value : (projectFilter ?? ''),
        }, { preserveState: true, replace: true });
    }

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">Tasks</h2>}>
            <Head title="Tasks" />

            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">{tasks.length} total</p>
                <Link href={route('portal.admin.tasks.edit')} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">
                    + Add Task
                </Link>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
                <select
                    value={statusFilter} onChange={(e) => updateFilter('status', e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                    <option value="">All statuses</option>
                    {statuses.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
                <select
                    value={projectFilter ?? ''} onChange={(e) => updateFilter('project', e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                    <option value="">All projects</option>
                    {projects.map((p) => <option key={p.id} value={p.id}>{p.project_title}</option>)}
                </select>
            </div>

            {tasks.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-sm text-gray-400">No tasks found.</div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left text-xs text-gray-500">
                            <tr>
                                <th className="px-4 py-2">Task</th><th className="px-4 py-2">Project</th><th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Points</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Assignee</th>
                                <th className="px-4 py-2">Due</th><th className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tasks.map((t) => (
                                <tr key={t.id}>
                                    <td className="px-4 py-2 font-medium text-gray-800">{t.title}</td>
                                    <td className="px-4 py-2">{t.projectTitle ?? '—'}</td>
                                    <td className="px-4 py-2">
                                        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{t.taskType.replace('_', ' ')}</span>
                                    </td>
                                    <td className="px-4 py-2">{t.taskPoint}</td>
                                    <td className="px-4 py-2">
                                        <span className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[t.status] ?? 'bg-gray-100 text-gray-600'}`}>{t.status.replace('_', ' ')}</span>
                                    </td>
                                    <td className="px-4 py-2">{t.assigneeName ?? '—'}</td>
                                    <td className="px-4 py-2 font-mono text-xs">{t.dueDate ?? '—'}</td>
                                    <td className="px-4 py-2">
                                        <Link href={route('portal.admin.tasks.edit', t.id)} className="text-xs font-medium text-amber-600 hover:underline">Edit</Link>
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
