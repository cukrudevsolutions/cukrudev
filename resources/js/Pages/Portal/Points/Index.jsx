import PortalLayout from '@/Layouts/PortalLayout';
import { Head, usePage } from '@inertiajs/react';

const GIG_POINT_VALUES = [
    ['Minor Fix', '1 pt'], ['Small Bug Fix', '2 pts'], ['Simple UI Task', '3 pts'], ['Setup Task', '3 pts'],
    ['Medium Feature', '4 pts'], ['Module Feature', '6 pts'], ['Complex Feature', '8 pts'], ['Full Contract Lead', '12 pts'],
];

export default function Index({ myPoints, myRank, totalStaff, isNext, nextPerson, leaderboard, topPoints, history }) {
    const myId = usePage().props.auth.user.id;

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">Opportunity Points</h2>}>
            <Head title="My Points" />
            <p className="mb-4 text-sm text-gray-500">Fair gig rotation system for the team</p>

            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-white p-5 text-center">
                    <div className="mb-2 text-xs font-semibold uppercase text-gray-400">My Points</div>
                    <div className="font-mono text-4xl font-extrabold text-amber-600">{myPoints}</div>
                    <div className="mt-1 text-xs text-gray-400">pts accumulated</div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-5 text-center">
                    <div className="mb-2 text-xs font-semibold uppercase text-gray-400">My Rank</div>
                    <div className={`font-mono text-4xl font-extrabold ${myRank === 1 ? 'text-green-500' : 'text-gray-900'}`}>#{myRank}</div>
                    <div className="mt-1 text-xs text-gray-400">out of {totalStaff} team members</div>
                </div>
                <div className={`rounded-lg border p-5 text-center ${isNext ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-white'}`}>
                    <div className="mb-2 text-xs font-semibold uppercase text-gray-400">Next Gig Goes To</div>
                    {isNext ? (
                        <>
                            <div className="text-xl font-bold text-green-500">You! 🎯</div>
                            <div className="mt-1 text-xs text-green-500">Highest priority right now</div>
                        </>
                    ) : (
                        <>
                            <div className="text-lg font-bold text-gray-900">{nextPerson?.full_name ?? '—'}</div>
                            <div className="mt-1 text-xs text-gray-400">{nextPerson?.total_points ?? 0} pts — rank #1</div>
                        </>
                    )}
                </div>
            </div>

            <div className="mb-4 rounded-lg border border-gray-200 border-l-4 border-l-amber-500 bg-white p-5">
                <h2 className="mb-3 font-semibold text-gray-800">How This System Works</h2>
                <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-md bg-gray-50 p-3 text-xs">
                        <div className="mb-1 font-bold text-amber-600">① Complete a Gig → Earn Points</div>
                        Every completed gig earns you points based on difficulty. Points never reset.
                    </div>
                    <div className="rounded-md bg-gray-50 p-3 text-xs">
                        <div className="mb-1 font-bold text-amber-600">② Fewer Points = Higher Priority</div>
                        The person with the fewest points gets priority for the next gig offer.
                    </div>
                    <div className="rounded-md bg-gray-50 p-3 text-xs">
                        <div className="mb-1 font-bold text-amber-600">③ Automatic &amp; Fair Rotation</div>
                        Admin offers new gigs to Rank #1 first, then rotates if declined.
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {GIG_POINT_VALUES.map(([name, pts]) => (
                        <div key={name} className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs">
                            <span>{name}</span>
                            <span className="font-mono font-bold text-amber-600">{pts}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-4 rounded-lg border border-gray-200 bg-white p-5">
                <h2 className="mb-3 font-semibold text-gray-800">Team Leaderboard</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-xs text-gray-400">
                            <tr><th className="py-1">Rank</th><th>Name</th><th className="text-right">Points</th><th>Progress</th></tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((r) => {
                                const isMine = r.id === myId;
                                const barPct = topPoints > 0 ? Math.max(2, Math.round((r.total_points / topPoints) * 100)) : 0;

                                return (
                                    <tr key={r.id} className={isMine ? 'bg-amber-50' : ''}>
                                        <td className="py-2 font-mono font-bold text-gray-500">
                                            {r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : `#${r.rank}`}
                                        </td>
                                        <td className="py-2">{r.full_name} {isMine && <span className="text-xs font-bold text-amber-600">(you)</span>}</td>
                                        <td className="py-2 text-right font-mono font-bold">{r.total_points}</td>
                                        <td className="py-2">
                                            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-gray-100">
                                                <div className={`h-full rounded-full ${r.rank === 1 ? 'bg-green-400' : 'bg-amber-400'}`} style={{ width: `${barPct}%` }} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5">
                <h2 className="mb-3 font-semibold text-gray-800">Points History</h2>
                {history.length === 0 ? (
                    <p className="py-6 text-center text-sm text-gray-400">No points yet. Complete a gig to start earning.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-xs text-gray-400">
                                <tr><th className="py-1">Date</th><th>Gig</th><th>Contract</th><th className="text-right">Points</th><th>Status</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {history.map((h, i) => (
                                    <tr key={i}>
                                        <td className="py-2 font-mono text-xs">{h.date}</td>
                                        <td className="py-2">{h.taskTitle}</td>
                                        <td className="py-2 text-gray-500">{h.projectTitle ?? '—'}</td>
                                        <td className="py-2 text-right font-mono font-bold text-amber-600">+{h.point}</td>
                                        <td className="py-2 text-xs capitalize text-gray-500">{h.reason.replace('_', ' ')}</td>
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
