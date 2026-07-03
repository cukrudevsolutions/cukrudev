import PortalLayout from '@/Layouts/PortalLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ logs, modules, moduleFilter, search }) {
    const [searchInput, setSearchInput] = useState(search);

    function updateModule(value) {
        router.get(route('portal.admin.activityLog.index'), { module: value, search: searchInput }, { preserveState: true, replace: true });
    }

    function submitSearch(e) {
        e.preventDefault();
        router.get(route('portal.admin.activityLog.index'), { module: moduleFilter, search: searchInput }, { preserveState: true, replace: true });
    }

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">Activity Log</h2>}>
            <Head title="Activity Log" />

            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">{logs.length} recent entries</p>
            </div>

            <form onSubmit={submitSearch} className="mb-4 flex flex-wrap gap-2">
                <input
                    type="text" placeholder="Search description…" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <select
                    value={moduleFilter} onChange={(e) => updateModule(e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                    <option value="">All modules</option>
                    {modules.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <button type="submit" className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">Search</button>
            </form>

            {logs.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-sm text-gray-400">No activity found.</div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left text-xs text-gray-500">
                            <tr>
                                <th className="px-4 py-2">When</th><th className="px-4 py-2">User</th><th className="px-4 py-2">Module</th>
                                <th className="px-4 py-2">Action</th><th className="px-4 py-2">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {logs.map((l) => (
                                <tr key={l.id}>
                                    <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-gray-500">{new Date(l.createdAt).toLocaleString()}</td>
                                    <td className="px-4 py-2">{l.userName ?? '—'}</td>
                                    <td className="px-4 py-2"><span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{l.module}</span></td>
                                    <td className="px-4 py-2 text-xs text-gray-500">{l.action}</td>
                                    <td className="px-4 py-2 text-gray-700">{l.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </PortalLayout>
    );
}
