import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

function templateActuals(cats) {
    return Object.fromEntries(cats.map((c) => [c.configKey, c.pct]));
}

function recalcCompany(cats, actuals) {
    const companyCat = cats.find((c) => c.configKey === 'company');
    if (!companyCat) return actuals;

    const varCats = cats.filter((c) => c.isVariable);
    let spared = 0;
    varCats.forEach((vc) => { spared += vc.pct - (actuals[vc.configKey] ?? 0); });

    return { ...actuals, company: Math.max(0, companyCat.pct + spared) };
}

export default function Edit({ project, clients, middlemen, staff, types, sources, statuses, categoriesBySource, savedDistributions }) {
    const isNew = !project;
    const { data, setData, post, transform, processing, errors } = useForm({
        client_id: project?.clientId ?? '',
        project_title: project?.projectTitle ?? '',
        project_type: project?.projectType ?? types[0],
        project_source: project?.projectSource ?? sources[0],
        mentor_id: project?.mentorId ?? '',
        middleman_id: project?.middlemanId ?? '',
        investor_name: project?.investorName ?? '',
        mentor_pct: project?.mentorPct ?? '',
        investor_pct: project?.investorPct ?? '',
        total_value: project?.totalValue ?? '',
        status: project?.status ?? statuses[0],
        project_lead_id: project?.projectLeadId ?? '',
        description: project?.description ?? '',
        repo_url: project?.repoUrl ?? '',
        warranty_months: project?.warrantyMonths ?? '',
        warranty_notes: project?.warrantyNotes ?? '',
    });

    const contributorForm = useForm({ user_id: '', role: '', dev_share_pct: '' });

    const originalSource = project?.projectSource;
    const cats = categoriesBySource[data.project_source] ?? [];
    const [distActuals, setDistActuals] = useState(() => {
        const useSaved = !isNew && data.project_source === originalSource && Object.keys(savedDistributions).length > 0;
        const initial = useSaved
            ? Object.fromEntries(cats.map((c) => [c.configKey, savedDistributions[c.configKey] ?? c.pct]))
            : templateActuals(cats);

        return recalcCompany(cats, initial);
    });

    const skipNextSourceReset = useRef(true);
    useEffect(() => {
        if (skipNextSourceReset.current) {
            skipNextSourceReset.current = false;
            return;
        }
        setDistActuals(recalcCompany(cats, templateActuals(cats)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.project_source]);

    function setVariablePct(configKey, value) {
        setDistActuals((prev) => recalcCompany(cats, { ...prev, [configKey]: value }));
    }

    const distTotal = cats.reduce((sum, c) => sum + (distActuals[c.configKey] ?? 0), 0);

    transform((formData) => ({
        ...formData,
        dist: Object.fromEntries(cats.map((c) => [
            c.configKey,
            { name: c.displayName, color: c.color, is_variable: c.isVariable, pct: distActuals[c.configKey] ?? 0 },
        ])),
    }));

    function submit(e) {
        e.preventDefault();
        post(route('portal.admin.projects.store', project?.id));
    }

    function addContributor(e) {
        e.preventDefault();
        contributorForm.post(route('portal.admin.projects.contributors.add', project.id), {
            preserveScroll: true,
            onSuccess: () => contributorForm.reset(),
        });
    }

    function removeContributor(staffId) {
        contributorForm.delete(route('portal.admin.projects.contributors.remove', [project.id, staffId]), { preserveScroll: true });
    }

    const availableStaff = staff.filter((s) => !project?.contributors?.some((c) => c.id === s.id));

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">{isNew ? 'Add Project' : 'Edit Project'}</h2>}>
            <Head title={isNew ? 'Add Project' : 'Edit Project'} />

            <Link href={route('portal.admin.projects.index')} className="mb-4 inline-block text-sm text-gray-500 hover:underline">&larr; Projects</Link>

            {Object.keys(errors).length > 0 && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{Object.values(errors).join(' — ')}</div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Project Title *</label>
                            <input type="text" value={data.project_title} onChange={(e) => setData('project_title', e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Client</label>
                            <select value={data.client_id} onChange={(e) => setData('client_id', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                <option value="">— None —</option>
                                {clients.map((c) => <option key={c.id} value={c.id}>{c.client_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Status *</label>
                            <select value={data.status} onChange={(e) => setData('status', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Project Type *</label>
                            <select value={data.project_type} onChange={(e) => setData('project_type', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                {types.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Project Source *</label>
                            <select value={data.project_source} onChange={(e) => setData('project_source', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                {sources.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Mentor</label>
                            <select value={data.mentor_id} onChange={(e) => setData('mentor_id', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                <option value="">— None —</option>
                                {staff.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Mentor %</label>
                            <input type="number" step="0.01" min="0" max="100" value={data.mentor_pct} onChange={(e) => setData('mentor_pct', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Middleman</label>
                            <select value={data.middleman_id} onChange={(e) => setData('middleman_id', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                <option value="">— None —</option>
                                {middlemen.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Investor Name</label>
                            <input type="text" value={data.investor_name} onChange={(e) => setData('investor_name', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Investor %</label>
                            <input type="number" step="0.01" min="0" max="100" value={data.investor_pct} onChange={(e) => setData('investor_pct', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Total Value (RM)</label>
                            <input type="number" step="0.01" min="0" value={data.total_value} onChange={(e) => setData('total_value', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Project Lead</label>
                            <select value={data.project_lead_id} onChange={(e) => setData('project_lead_id', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                <option value="">— None —</option>
                                {staff.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
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
                        <label className="mb-1 block text-xs font-semibold text-gray-600">Warranty Notes</label>
                        <textarea rows={2} value={data.warranty_notes} onChange={(e) => setData('warranty_notes', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <h3 className="mb-1 text-sm font-semibold text-gray-800">Payment Distribution</h3>
                    <p className="mb-3 text-xs text-gray-500">Adjust variable categories — the remainder flows to Company. Applies only to this project.</p>

                    <div className="mb-3 flex h-2 overflow-hidden rounded-full bg-gray-100">
                        {cats.filter((c) => (distActuals[c.configKey] ?? 0) > 0).map((c) => (
                            <div key={c.configKey} style={{ width: `${distActuals[c.configKey]}%`, background: c.color }} title={`${c.displayName}: ${distActuals[c.configKey].toFixed(1)}%`} />
                        ))}
                    </div>

                    <div className="divide-y divide-gray-100">
                        {cats.map((c) => (
                            <div key={c.configKey} className="grid grid-cols-[16px_1fr_180px_60px] items-center gap-3 py-2">
                                <span className="h-3 w-3 rounded" style={{ background: c.color }} />
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">{c.displayName}</span>
                                    {c.isVariable && <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">VARIABLE</span>}
                                    {c.configKey === 'company' && <span className="text-[10px] text-gray-400">(auto-adjusted)</span>}
                                </div>
                                {c.isVariable ? (
                                    <input
                                        type="range" min="0" max={c.pct} step="0.5"
                                        value={distActuals[c.configKey] ?? 0}
                                        onChange={(e) => setVariablePct(c.configKey, parseFloat(e.target.value))}
                                        className="w-full accent-amber-500"
                                    />
                                ) : (
                                    <div className="h-1 rounded-full opacity-40" style={{ background: c.color }} />
                                )}
                                <span className="text-right font-mono text-sm font-bold" style={{ color: c.color }}>
                                    {(distActuals[c.configKey] ?? 0).toFixed(1)}%
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-3 flex justify-end">
                        <span className={`rounded-full px-3 py-1 font-mono text-xs font-bold ${Math.abs(distTotal - 100) < 0.1 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {distTotal.toFixed(1)}%
                        </span>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    {!isNew && (
                        <Link href={route('portal.admin.payments.project', project.id)} className="rounded-md border border-amber-300 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50">
                            Process Payment
                        </Link>
                    )}
                    <Link href={route('portal.admin.projects.index')} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</Link>
                    <button type="submit" disabled={processing} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
                        {isNew ? 'Create Project' : 'Save Changes'}
                    </button>
                </div>
            </form>

            {!isNew && (
                <div className="mt-8 rounded-lg border border-gray-200 bg-white p-5">
                    <h3 className="mb-3 text-sm font-semibold text-gray-800">Contributors</h3>

                    {project.contributors.length === 0 ? (
                        <p className="mb-4 text-sm text-gray-400">No contributors assigned yet.</p>
                    ) : (
                        <table className="mb-4 w-full text-sm">
                            <thead className="text-left text-xs text-gray-500">
                                <tr>
                                    <th className="py-1 pr-4">Staff</th><th className="py-1 pr-4">Role</th><th className="py-1 pr-4">Dev Share %</th><th className="py-1"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {project.contributors.map((c) => (
                                    <tr key={c.id}>
                                        <td className="py-2 pr-4 font-medium text-gray-800">{c.fullName}</td>
                                        <td className="py-2 pr-4">{c.role ?? '—'}</td>
                                        <td className="py-2 pr-4">{c.devSharePct ?? 'equal split'}</td>
                                        <td className="py-2">
                                            <button type="button" onClick={() => removeContributor(c.id)} className="text-xs font-medium text-red-600 hover:underline">Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {availableStaff.length > 0 && (
                        <form onSubmit={addContributor} className="flex flex-wrap items-end gap-2">
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-600">Staff</label>
                                <select value={contributorForm.data.user_id} onChange={(e) => contributorForm.setData('user_id', e.target.value)} required className="rounded-md border border-gray-300 px-3 py-2 text-sm">
                                    <option value="">— Select —</option>
                                    {availableStaff.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-600">Role</label>
                                <input type="text" value={contributorForm.data.role} onChange={(e) => contributorForm.setData('role', e.target.value)} className="rounded-md border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-600">Dev Share %</label>
                                <input type="number" step="0.01" min="0" max="100" value={contributorForm.data.dev_share_pct} onChange={(e) => contributorForm.setData('dev_share_pct', e.target.value)} className="w-28 rounded-md border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                            <button type="submit" disabled={contributorForm.processing} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
                                + Add
                            </button>
                        </form>
                    )}
                </div>
            )}
        </PortalLayout>
    );
}
