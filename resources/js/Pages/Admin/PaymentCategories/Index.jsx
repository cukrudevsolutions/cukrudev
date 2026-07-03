import PortalLayout from '@/Layouts/PortalLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

function rowsTotal(rows) {
    return rows.filter((r) => !r.delete).reduce((sum, r) => sum + (parseFloat(r.pct) || 0), 0);
}

function CategoryTab({ source, initialRows }) {
    const [rows, setRows] = useState(initialRows);
    const form = useForm({});

    function updateRow(idx, patch) {
        setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
    }

    function addRow() {
        setRows((prev) => [...prev, { id: null, name: '', color: '#888888', pct: 0, isVariable: false, isCore: false, delete: false }]);
    }

    function toggleDelete(idx) {
        setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, delete: !r.delete } : r)));
    }

    function save(e) {
        e.preventDefault();
        form.transform(() => ({
            source,
            categories: rows.map((r) => ({
                id: r.id,
                name: r.name,
                color: r.color,
                pct: r.pct,
                is_variable: r.isVariable,
                delete: r.delete,
            })),
        }));
        form.post(route('portal.admin.paymentCategories.update'), { preserveScroll: true });
    }

    const total = rowsTotal(rows);
    const ok = Math.abs(total - 100) < 0.1;

    return (
        <form onSubmit={save}>
            <div className="mb-4 flex h-2.5 overflow-hidden rounded-full bg-gray-100">
                {rows.filter((r) => !r.delete && r.pct > 0).map((r, i) => (
                    <div key={i} style={{ width: `${r.pct}%`, background: r.color }} title={`${r.name}: ${r.pct}%`} />
                ))}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="hidden grid-cols-[32px_1fr_180px_70px_36px] gap-2 border-b border-gray-100 px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:grid">
                    <span /><span>Category Name</span><span>Percentage</span><span className="text-right">%</span><span />
                </div>

                <div className="divide-y divide-gray-100">
                    {rows.map((r, idx) => (
                        <div key={idx} className={`grid grid-cols-1 items-center gap-2 px-4 py-3 sm:grid-cols-[32px_1fr_180px_70px_36px] ${r.delete ? 'opacity-40' : ''}`}>
                            <input
                                type="color" value={r.color} onChange={(e) => updateRow(idx, { color: e.target.value })}
                                className="h-6 w-6 cursor-pointer rounded border border-gray-300 p-0"
                            />
                            <div className="flex flex-col gap-1">
                                <input
                                    type="text" value={r.name} onChange={(e) => updateRow(idx, { name: e.target.value })}
                                    placeholder="Category name" className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                                />
                                <label className="flex items-center gap-1.5 text-[11px] text-gray-500">
                                    <input type="checkbox" checked={r.isVariable} onChange={(e) => updateRow(idx, { isVariable: e.target.checked })} />
                                    Variable <span className="text-gray-400">(max; remainder → Company)</span>
                                </label>
                            </div>
                            <input
                                type="range" min="0" max="100" step="0.5" value={r.pct}
                                onChange={(e) => updateRow(idx, { pct: parseFloat(e.target.value) })}
                                style={{ accentColor: r.color }} className="w-full"
                            />
                            <input
                                type="number" min="0" max="100" step="0.5" value={r.pct}
                                onChange={(e) => updateRow(idx, { pct: Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) })}
                                className="rounded-md border border-gray-300 px-2 py-1 text-right font-mono text-sm"
                            />
                            <div className="flex justify-center">
                                {r.isCore ? (
                                    <span title="Core — cannot delete" className="text-sm text-gray-400">🔒</span>
                                ) : (
                                    <button type="button" onClick={() => toggleDelete(idx)} className="flex h-7 w-7 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100">
                                        {r.delete ? '↩' : '×'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-3">
                    <button type="button" onClick={addRow} className="text-sm font-medium text-amber-600 hover:underline">+ Add Category</button>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
                    <span className="text-xs text-gray-500">Must total 100%</span>
                    <span className={`rounded-full px-3 py-1 font-mono text-sm font-bold ${ok ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {total.toFixed(1)}%
                    </span>
                </div>
            </div>

            <div className="mt-4 flex justify-end">
                <button type="submit" disabled={form.processing} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
                    Save Settings
                </button>
            </div>
        </form>
    );
}

export default function Index({ sources, categoriesBySource }) {
    const sourceKeys = Object.keys(sources);
    const [activeTab, setActiveTab] = useState(sourceKeys[0]);

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">Distribution Settings</h2>}>
            <Head title="Distribution Settings" />

            <p className="mb-4 text-sm text-gray-500">Manage default percentages, category names, and add new categories per acquisition source.</p>

            <div className="mb-4 flex flex-wrap gap-2 border-b border-gray-200">
                {sourceKeys.map((key) => {
                    const total = rowsTotal(categoriesBySource[key]);
                    const ok = Math.abs(total - 100) < 0.1;

                    return (
                        <button
                            key={key} type="button" onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium ${activeTab === key ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {sources[key]}
                            <span className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold ${ok ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {Math.round(total)}%
                            </span>
                        </button>
                    );
                })}
            </div>

            <CategoryTab key={activeTab} source={activeTab} initialRows={categoriesBySource[activeTab]} />
        </PortalLayout>
    );
}
