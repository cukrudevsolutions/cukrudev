import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ staffList, search: initialSearch, filter: initialFilter }) {
    const [search, setSearch] = useState(initialSearch);
    const [filter, setFilter] = useState(initialFilter);

    function applyFilters(e) {
        e.preventDefault();
        router.get(route('portal.admin.staff.index'), { q: search, status: filter });
    }

    function toggleActive(s) {
        router.post(route('portal.admin.staff.toggleActive', s.id), {}, { preserveScroll: true });
    }

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">Staff Management</h2>}>
            <Head title="Manage Staff" />

            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">{staffList.length} members</p>
                <Link href={route('portal.admin.staff.edit')} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">
                    + Add Staff
                </Link>
            </div>

            <form onSubmit={applyFilters} className="mb-4 flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-white p-4">
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, position…" className="min-w-[200px] flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm" />
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-md border border-gray-300 px-3 py-2 text-sm">
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <button type="submit" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Filter</button>
            </form>

            {staffList.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-sm text-gray-400">No staff found.</div>
            ) : (
                <div className="space-y-3">
                    {staffList.map((s) => (
                        <div key={s.id} className="rounded-lg border border-gray-200 bg-white p-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600">
                                    {s.avatarUrl ? <img src={s.avatarUrl} alt="" className="h-11 w-11 rounded-full object-cover" /> : s.initials}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-semibold text-gray-900">{s.fullName}</span>
                                        {s.isAdmin && <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">Admin</span>}
                                        <span className={`rounded px-2 py-0.5 text-xs font-semibold ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{s.isActive ? 'Active' : 'Inactive'}</span>
                                        <span className={`rounded px-2 py-0.5 text-xs ${s.availabilityStatus === 'available' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{s.availabilityStatus}</span>
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500">{s.position} {s.email && `· ${s.email}`}</div>
                                    {s.skillTags.length > 0 && (
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {s.skillTags.slice(0, 5).map((tag) => <span key={tag} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">{tag}</span>)}
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-amber-600">{s.totalPoints}</div>
                                    <div className="text-xs text-gray-400">pts</div>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={route('portal.admin.staff.edit', s.id)} className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">Edit</Link>
                                    <button onClick={() => toggleActive(s)} className={`rounded-md border px-3 py-1.5 text-xs font-medium ${s.isActive ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                                        {s.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PortalLayout>
    );
}
