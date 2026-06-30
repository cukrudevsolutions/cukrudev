import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ client, staff, sources }) {
    const isNew = !client;
    const { data, setData, post, processing, errors } = useForm({
        client_name: client?.clientName ?? '',
        contact_person: client?.contactPerson ?? '',
        phone: client?.phone ?? '',
        email: client?.email ?? '',
        source: client?.source ?? '',
        handled_by: client?.handledBy ?? '',
        notes: client?.notes ?? '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('portal.admin.clients.store', client?.id));
    }

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">{isNew ? 'Add Client' : 'Edit Client'}</h2>}>
            <Head title={isNew ? 'Add Client' : 'Edit Client'} />

            <Link href={route('portal.admin.clients.index')} className="mb-4 inline-block text-sm text-gray-500 hover:underline">&larr; Clients</Link>

            {Object.keys(errors).length > 0 && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{Object.values(errors).join(' — ')}</div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Client / Company Name *</label>
                            <input type="text" value={data.client_name} onChange={(e) => setData('client_name', e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Contact Person</label>
                            <input type="text" value={data.contact_person} onChange={(e) => setData('contact_person', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Phone</label>
                            <input type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Email</label>
                            <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Source</label>
                            <select value={data.source} onChange={(e) => setData('source', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                <option value="">— Select source —</option>
                                {sources.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Handled By</label>
                            <select value={data.handled_by} onChange={(e) => setData('handled_by', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                <option value="">— Unassigned —</option>
                                {staff.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="mb-1 block text-xs font-semibold text-gray-600">Notes</label>
                        <textarea rows={3} value={data.notes} onChange={(e) => setData('notes', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Link href={route('portal.admin.clients.index')} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</Link>
                    <button type="submit" disabled={processing} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
                        {isNew ? 'Create Client' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </PortalLayout>
    );
}
