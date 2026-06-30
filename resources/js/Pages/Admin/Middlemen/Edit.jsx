import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ middleman }) {
    const isNew = !middleman;
    const { data, setData, post, processing, errors } = useForm({
        name: middleman?.name ?? '',
        company: middleman?.company ?? '',
        phone: middleman?.phone ?? '',
        email: middleman?.email ?? '',
        notes: middleman?.notes ?? '',
        is_active: middleman?.isActive ?? true,
    });

    function submit(e) {
        e.preventDefault();
        post(route('portal.admin.middlemen.store', middleman?.id));
    }

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">{isNew ? 'Add Middleman' : 'Edit Middleman'}</h2>}>
            <Head title={isNew ? 'Add Middleman' : 'Edit Middleman'} />

            <Link href={route('portal.admin.middlemen.index')} className="mb-4 inline-block text-sm text-gray-500 hover:underline">&larr; Middlemen</Link>

            {Object.keys(errors).length > 0 && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{Object.values(errors).join(' — ')}</div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Name *</label>
                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Company</label>
                            <input type="text" value={data.company} onChange={(e) => setData('company', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Phone</label>
                            <input type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Email</label>
                            <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="mb-1 block text-xs font-semibold text-gray-600">Notes</label>
                        <textarea rows={3} value={data.notes} onChange={(e) => setData('notes', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                    </div>
                    <label className="mt-4 flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                        Active
                    </label>
                </div>

                <div className="rounded-md bg-amber-50 p-4 text-sm text-amber-800">
                    <div className="mb-2 font-semibold">Distribution Structure — Projects via Middleman</div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                        <div>Company Share: <strong>20%</strong></div>
                        <div>Operating Cost: <strong>20%</strong></div>
                        <div>Team Distribution: <strong>35%</strong></div>
                        <div>Middleman: <strong>5%</strong></div>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Link href={route('portal.admin.middlemen.index')} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</Link>
                    <button type="submit" disabled={processing} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
                        {isNew ? 'Add Middleman' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </PortalLayout>
    );
}
