import PortalLayout from '@/Layouts/PortalLayout';
import { statusBadgeClass, statusLabel } from '@/utils/badges';
import { Head, Link, useForm } from '@inertiajs/react';

const STATUS_ORDER = ['pending', 'offered', 'accepted', 'in_progress', 'submitted', 'revision', 'completed', 'paid'];

const NEXT_STATUS_LABEL = {
    in_progress: 'Mark In Progress',
    submitted: 'Submit for Review',
};

export default function Show({ task, allowedNextStatuses }) {
    const { data, setData, post, processing } = useForm({
        task_id: task.id,
        new_status: '',
        progress_notes: task.progressNotes ?? '',
    });

    const currentIdx = STATUS_ORDER.indexOf(task.status);

    function submit(newStatus) {
        setData('new_status', newStatus);
        post(route('portal.gigs.update'), {
            data: { task_id: task.id, new_status: newStatus, progress_notes: data.progress_notes },
            preserveScroll: true,
        });
    }

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">{task.title}</h2>}>
            <Head title={task.title} />

            <nav className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                <Link href={route('portal.gigs.index')} className="hover:underline">My Gigs</Link>
                <span>/</span>
                <span>{task.title}</span>
            </nav>

            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">{task.projectTitle || 'No contract'}</p>
                <span className={`rounded px-3 py-1 text-sm font-semibold ${statusBadgeClass(task.status)}`}>{statusLabel(task.status)}</span>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <h2 className="mb-3 font-semibold text-gray-800">Gig Details</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{statusLabel(task.taskType)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Opportunity Points</span><span className="font-semibold text-amber-600">{task.taskPoint} pts</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Due Date</span><span>{task.dueDate || 'No deadline'}</span></div>
                        {task.completedAt && <div className="flex justify-between"><span className="text-gray-500">Completed</span><span className="text-green-600">{task.completedAt}</span></div>}
                    </div>
                    {task.description && (
                        <div className="mt-4 border-t border-gray-100 pt-3">
                            <div className="mb-1 text-xs font-semibold uppercase text-gray-400">Description</div>
                            <p className="whitespace-pre-line text-sm text-gray-600">{task.description}</p>
                        </div>
                    )}
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <h2 className="mb-4 font-semibold text-gray-800">Progress</h2>
                    <div className="mb-4 flex items-center">
                        {STATUS_ORDER.map((s, i) => (
                            <div key={s} className="flex flex-1 items-center">
                                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i < currentIdx ? 'bg-amber-500 text-white' : i === currentIdx ? 'border-2 border-amber-500 text-amber-600' : 'border-2 border-gray-200 text-gray-300'}`}>
                                    {i < currentIdx ? '✓' : i + 1}
                                </div>
                                {i < STATUS_ORDER.length - 1 && <div className={`h-0.5 flex-1 ${i < currentIdx ? 'bg-amber-500' : 'bg-gray-200'}`} />}
                            </div>
                        ))}
                    </div>
                    <div className="mb-4 text-center">
                        <div className="mb-1 text-xs font-semibold uppercase text-gray-400">Current Status</div>
                        <span className={`rounded px-3 py-1 text-sm font-semibold ${statusBadgeClass(task.status)}`}>{statusLabel(task.status)}</span>
                    </div>

                    {allowedNextStatuses.length > 0 ? (
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Progress Notes</label>
                            <textarea
                                rows={3}
                                value={data.progress_notes}
                                onChange={(e) => setData('progress_notes', e.target.value)}
                                placeholder="What have you done so far…"
                                className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                            <div className="flex flex-wrap gap-2">
                                {allowedNextStatuses.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        disabled={processing}
                                        onClick={() => submit(s)}
                                        className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
                                    >
                                        {NEXT_STATUS_LABEL[s] || statusLabel(s)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : task.status === 'submitted' ? (
                        <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-700">Submitted for review. Waiting for admin approval.</div>
                    ) : task.status === 'completed' ? (
                        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">Gig completed! Opportunity points have been awarded.</div>
                    ) : null}
                </div>
            </div>
        </PortalLayout>
    );
}
