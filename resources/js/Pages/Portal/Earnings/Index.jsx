import StatCard from '@/Components/StatCard';
import PortalLayout from '@/Layouts/PortalLayout';
import { Head } from '@inertiajs/react';

const TYPE_LABELS = {
    dev_share: 'Dev Share',
    task_share: 'Task Dev',
    sales_share: 'Sales Share',
    lead_bonus: 'Lead Bonus',
    contribution_bonus: 'Contribution',
};

export default function Index({ stats, earnings }) {
    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">My Earnings</h2>}>
            <Head title="My Earnings" />
            <p className="mb-4 text-sm text-gray-500">Your total earnings from projects &amp; tasks</p>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Pending Payout" value={`RM ${stats.pending.toFixed(2)}`} valueClassName="text-amber-600" meta="awaiting payment" />
                <StatCard label="Total Paid Out" value={`RM ${stats.paid.toFixed(2)}`} meta="all time" />
                <StatCard label="From Projects" value={`RM ${stats.projectTotal.toFixed(2)}`} meta={`${stats.projectCount} record(s)`} />
                <StatCard label="From Tasks" value={`RM ${stats.taskTotal.toFixed(2)}`} meta={`${stats.taskCount} record(s)`} />
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5">
                <h2 className="mb-3 font-semibold text-gray-800">Earnings History</h2>
                {earnings.length === 0 ? (
                    <p className="py-10 text-center text-sm text-gray-400">Your earnings will appear here once a project or task is paid by admin.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-xs text-gray-400">
                                <tr>
                                    <th className="py-1">Date</th><th>Source</th><th>Project / Task</th><th>Type</th>
                                    <th className="text-right">Amount</th><th>Status</th><th>Paid On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {earnings.map((e) => (
                                    <tr key={e.id}>
                                        <td className="py-2 font-mono text-xs">{e.createdAt}</td>
                                        <td className="py-2">
                                            <span className={`rounded px-2 py-0.5 text-xs font-semibold ${e.sourceType === 'task' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {e.sourceType === 'task' ? 'Task' : 'Project'}
                                            </span>
                                        </td>
                                        <td className="py-2">
                                            {e.sourceType === 'task' ? e.taskTitle : e.projectTitle}
                                            {e.sourceType === 'task' && e.projectTitle && <div className="text-xs text-gray-400">{e.projectTitle}</div>}
                                        </td>
                                        <td className="py-2"><span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{TYPE_LABELS[e.earningType] ?? e.earningType}</span></td>
                                        <td className="py-2 text-right font-mono font-bold text-amber-600">RM {e.amount.toFixed(2)}</td>
                                        <td className="py-2">
                                            <span className={`rounded px-2 py-0.5 text-xs font-semibold ${e.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{e.status}</span>
                                        </td>
                                        <td className="py-2 font-mono text-xs">{e.paidAt ?? '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </PortalLayout>
    );
}
