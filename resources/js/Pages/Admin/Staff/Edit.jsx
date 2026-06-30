import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

const BANKS = [
    'Maybank', 'CIMB Bank', 'Public Bank', 'RHB Bank', 'Hong Leong Bank', 'AmBank',
    'Affin Bank', 'Alliance Bank', 'Bank Islam', 'Bank Rakyat', 'BSN', 'MBSB Bank',
    "Touch 'n Go eWallet", 'MAE (Maybank)', 'Boost', 'GrabPay', 'ShopeePay',
];

export default function Edit({ staff }) {
    const isNew = !staff;
    const [expertiseInput, setExpertiseInput] = useState('');
    const { data, setData, post, processing, errors } = useForm({
        full_name: staff?.fullName ?? '',
        email: staff?.email ?? '',
        position: staff?.position ?? '',
        phone: staff?.phone ?? '',
        bio: staff?.bio ?? '',
        slug: staff?.slug ?? '',
        availability_status: staff?.availabilityStatus ?? 'available',
        expertise: staff?.expertise ?? [],
        is_admin: staff?.isAdmin ?? false,
        is_active: staff?.isActive ?? true,
        bank_name: staff?.bankName ?? '',
        bank_account_no: staff?.bankAccountNo ?? '',
        password: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('portal.admin.staff.store', staff?.id));
    }

    function addExpertise() {
        const value = expertiseInput.trim();
        if (value && !data.expertise.includes(value)) {
            setData('expertise', [...data.expertise, value]);
        }
        setExpertiseInput('');
    }

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">{isNew ? 'Add Staff Member' : 'Edit Staff Member'}</h2>}>
            <Head title={isNew ? 'Add Staff' : 'Edit Staff'} />

            <Link href={route('portal.admin.staff.index')} className="mb-4 inline-block text-sm text-gray-500 hover:underline">&larr; Staff List</Link>

            {Object.keys(errors).length > 0 && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{Object.values(errors).join(' — ')}</div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <h2 className="mb-3 font-semibold text-gray-800">Personal Info</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Full Name *</label>
                            <input type="text" value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Position / Role</label>
                            <input type="text" value={data.position} onChange={(e) => setData('position', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Email *</label>
                            <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Phone</label>
                            <input type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="mb-1 block text-xs font-semibold text-gray-600">Bio</label>
                        <textarea rows={3} value={data.bio} onChange={(e) => setData('bio', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                    </div>
                    <div className="mt-4">
                        <label className="mb-1 block text-xs font-semibold text-gray-600">Skill Tags</label>
                        <div className="mb-2 flex flex-wrap gap-1.5">
                            {data.expertise.map((tag) => (
                                <span key={tag} className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                                    {tag}
                                    <button type="button" onClick={() => setData('expertise', data.expertise.filter((t) => t !== tag))} className="text-gray-400 hover:text-gray-700">×</button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text" value={expertiseInput} onChange={(e) => setExpertiseInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addExpertise(); } }}
                            placeholder="Add skill + Enter" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <h2 className="mb-3 font-semibold text-gray-800">Account &amp; Access</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Card URL (Slug) *</label>
                            <div className="flex items-center overflow-hidden rounded-md border border-gray-300">
                                <span className="bg-gray-50 px-3 py-2 text-xs text-gray-500">cukrudev.com/</span>
                                <input type="text" value={data.slug} onChange={(e) => setData('slug', e.target.value)} placeholder="e.g. akmalrashd" className="flex-1 px-3 py-2 text-sm outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Availability</label>
                            <select value={data.availability_status} onChange={(e) => setData('availability_status', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                <option value="available">Available</option>
                                <option value="busy">Busy</option>
                                <option value="unavailable">Unavailable</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-6">
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} /> Active Account
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={data.is_admin} onChange={(e) => setData('is_admin', e.target.checked)} /> Admin Access
                        </label>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <h2 className="mb-1 font-semibold text-gray-800">Bank / Payment Info</h2>
                    <p className="mb-3 text-xs text-gray-400">Used on payment confirmation pages so admin knows where to transfer salary.</p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Bank / E-Wallet</label>
                            <select value={data.bank_name} onChange={(e) => setData('bank_name', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                <option value="">— Select —</option>
                                {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Account Number</label>
                            <input type="text" value={data.bank_account_no} onChange={(e) => setData('bank_account_no', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <h2 className="mb-1 font-semibold text-gray-800">{isNew ? 'Set Password' : 'Change Password'}</h2>
                    {!isNew && <p className="mb-2 text-xs text-gray-400">Leave blank to keep current password.</p>}
                    <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} required={isNew} autoComplete="new-password" className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm" />
                </div>

                <div className="flex justify-end gap-2">
                    <Link href={route('portal.admin.staff.index')} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</Link>
                    <button type="submit" disabled={processing} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
                        {isNew ? 'Create Staff' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </PortalLayout>
    );
}
