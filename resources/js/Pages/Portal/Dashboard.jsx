import StatCard from '@/Components/StatCard';
import PortalLayout from '@/Layouts/PortalLayout';
import { statusBadgeClass, statusLabel } from '@/utils/badges';
import { Head, Link, useForm } from '@inertiajs/react';

function AvailabilityToggle({ current }) {
    const { post, processing } = useForm({});
    const options = [
        { value: 'available', label: 'Available' },
        { value: 'busy', label: 'Busy' },
        { value: 'unavailable', label: 'Unavailable' },
    ];

    function setStatus(status) {
        post(route('portal.availability.update'), {
            data: { status },
            preserveScroll: true,
        });
    }

    return (
        <div className="flex gap-2">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    disabled={processing}
                    onClick={() => setStatus(opt.value)}
                    className={`flex-1 rounded-md border px-3 py-1.5 text-xs font-semibold ${
                        current === opt.value
                            ? opt.value === 'available'
                                ? 'border-green-600 bg-green-50 text-green-700'
                                : opt.value === 'busy'
                                    ? 'border-amber-600 bg-amber-50 text-amber-700'
                                    : 'border-gray-600 bg-gray-100 text-gray-700'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

export default function Dashboard({ staff, stats, myTasks, pendingOffers, checklist, checklistPct, leaderboard, adminStats }) {
    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>}>
            <Head title="Dashboard" />

            <div className="mb-1 text-2xl font-bold text-gray-900">Hi, {staff.firstName} 👋</div>
            <p className="mb-6 text-sm text-gray-500">Welcome back to your CukruDev portal.</p>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Active Gigs" value={stats.activeGigs} meta="in progress" />
                <StatCard label="Pending Offers" value={stats.pendingOffers} valueClassName="text-amber-600" meta="awaiting response" />
                <StatCard label="Opportunity Points" value={stats.opportunityPoints} valueClassName="text-amber-600" meta={`Rank ${stats.myRank} of ${stats.totalStaff}`} />
                <StatCard label="Pending Earnings" value={`RM ${stats.pendingEarning.toFixed(2)}`} meta={`Paid: RM ${stats.paidEarning.toFixed(2)}`} />
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="font-semibold text-gray-800">My Profile</h2>
                        <Link href={route('portal.card.show')} className="text-sm text-amber-600 hover:underline">View Card</Link>
                    </div>
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-600">
                            {staff.avatarUrl ? <img src={staff.avatarUrl} alt="" className="h-14 w-14 rounded-full object-cover" /> : staff.initials}
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">{staff.fullName}</div>
                            <div className="text-xs text-gray-500">{staff.position || 'Team Member'}</div>
                            <div className="font-mono text-xs text-gray-400">cukrudev.com/{staff.slug}</div>
                        </div>
                    </div>
                    <div className="mb-2 text-xs font-semibold uppercase text-gray-400">Availability</div>
                    <AvailabilityToggle current={staff.availabilityStatus} />
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="font-semibold text-gray-800">Card Completion</h2>
                        <Link href={route('portal.card.edit')} className="text-sm text-amber-600 hover:underline">Edit</Link>
                    </div>
                    <div className="mb-3 grid grid-cols-2 gap-2">
                        {Object.entries(checklist).map(([label, done]) => (
                            <div key={label} className={`flex items-center gap-2 rounded px-2 py-1.5 text-xs ${done ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                                <span>{done ? '✓' : '○'}</span> {label}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{Object.values(checklist).filter(Boolean).length}/{Object.keys(checklist).length} complete</span>
                        <span>{checklistPct}%</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-amber-500" style={{ width: `${checklistPct}%` }} />
                    </div>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="font-semibold text-gray-800">Active Gigs</h2>
                        <Link href={route('portal.gigs.index')} className="text-sm text-amber-600 hover:underline">All Gigs</Link>
                    </div>
                    {myTasks.length === 0 ? (
                        <p className="py-6 text-center text-sm text-gray-400">No active tasks</p>
                    ) : (
                        <div className="space-y-2">
                            {myTasks.map((t) => (
                                <Link key={t.id} href={route('portal.gigs.show', t.id)} className="flex items-center gap-2 rounded p-2 text-sm hover:bg-gray-50">
                                    <span className={`rounded px-2 py-0.5 text-xs ${statusBadgeClass(t.status)}`}>{statusLabel(t.status)}</span>
                                    <span className="flex-1 truncate text-gray-700">{t.title}</span>
                                    {t.dueDate && <span className="text-xs text-gray-400">{t.dueDate}</span>}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="font-semibold text-gray-800">Gig Offers</h2>
                        <Link href={route('portal.offers.index')} className="text-sm text-amber-600 hover:underline">All Offers</Link>
                    </div>
                    {pendingOffers.length === 0 ? (
                        <p className="py-6 text-center text-sm text-gray-400">No pending offers</p>
                    ) : (
                        <div className="space-y-2">
                            {pendingOffers.map((o) => (
                                <div key={o.id} className="rounded border border-gray-200 p-3">
                                    <div className="text-sm font-medium text-gray-800">{o.taskTitle}</div>
                                    <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                                        <span>{o.projectTitle || 'No contract'}</span>
                                        <span className="rounded bg-amber-100 px-2 py-0.5 font-semibold text-amber-700">{o.taskPoint} pts</span>
                                    </div>
                                    <Link href={route('portal.offers.index')} className="mt-2 inline-block text-xs font-semibold text-green-600 hover:underline">Respond</Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-800">Opportunity Points Ranking</h2>
                    <Link href={route('portal.points.index')} className="text-sm text-amber-600 hover:underline">My History</Link>
                </div>
                <div className="mb-4 flex items-center gap-4">
                    <div className="font-mono text-4xl font-extrabold text-amber-600">{stats.opportunityPoints}</div>
                    <div>
                        <div className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Rank {stats.myRank} of {stats.totalStaff}</div>
                        <div className="mt-1 text-xs text-gray-500">Opportunity Points</div>
                    </div>
                </div>
                <div className="space-y-1">
                    {leaderboard.map((r) => (
                        <div key={r.id} className={`flex items-center gap-3 rounded px-3 py-2 text-sm ${r.id === staff.slug ? '' : ''}`}>
                            <span className={`w-6 font-mono font-bold ${r.rank <= 3 ? 'text-amber-600' : 'text-gray-400'}`}>{r.rank}</span>
                            <span className="flex-1 text-gray-700">{r.full_name}</span>
                            <span className="text-xs text-gray-500">{r.total_points} pts</span>
                        </div>
                    ))}
                </div>
            </div>

            {adminStats && (
                <div className="border-t border-gray-200 pt-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold text-gray-800">Admin Overview</h2>
                            <p className="text-xs text-gray-500">Company stats at a glance</p>
                        </div>
                        <Link href={route('portal.admin.dashboard')} className="text-sm text-amber-600 hover:underline">Full Dashboard</Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        <StatCard label="Clients" value={adminStats.totalClients} />
                        <StatCard label="Active Contracts" value={adminStats.activeProjects} valueClassName="text-amber-600" />
                        <StatCard label="Pending Gigs" value={adminStats.pendingTasks} />
                        <StatCard label="Pending Offers" value={adminStats.pendingOffers} valueClassName={adminStats.pendingOffers > 0 ? 'text-amber-600' : ''} />
                        <StatCard label="Company Fund" value={`RM ${adminStats.companyFund.toFixed(0)}`} />
                    </div>
                </div>
            )}
        </PortalLayout>
    );
}
