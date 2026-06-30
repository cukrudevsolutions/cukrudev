import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ staff, checklist }) {
    const profileUrl = `${window.location.origin}/${staff.slug}`;

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">My Digital Card</h2>}>
            <Head title="My Digital Card" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">My Digital Card</h1>
                    <p className="text-sm text-gray-500">Your public NFC profile — live at cukrudev.com/{staff.slug}</p>
                </div>
                <div className="flex gap-2">
                    <a href={`/${staff.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Preview Card
                    </a>
                    <Link href={route('portal.card.edit')} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">
                        Edit Profile
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-semibold text-gray-800">Your Card</h2>
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Live</span>
                    </div>
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-600">
                            {staff.avatarUrl ? <img src={staff.avatarUrl} alt="" className="h-14 w-14 rounded-full object-cover" /> : staff.initials}
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">{staff.fullName}</div>
                            <div className="text-xs text-gray-500">{staff.position || 'Team Member'}</div>
                            {staff.shortTitle && <div className="text-xs text-gray-400">{staff.shortTitle}</div>}
                        </div>
                    </div>

                    <div className="rounded-md bg-gray-50 p-3">
                        <div className="mb-1 text-xs font-semibold text-gray-500">NFC Chip URL</div>
                        <div className="break-all font-mono text-xs text-gray-700">{profileUrl}</div>
                        <div className="mt-2 flex gap-2">
                            <button
                                type="button"
                                onClick={() => navigator.clipboard.writeText(profileUrl)}
                                className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-white"
                            >
                                Copy URL
                            </button>
                            <a href={`/download-vcard/${staff.slug}`} className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-white">
                                Download vCard
                            </a>
                        </div>
                    </div>

                    {staff.expertise.length > 0 && (
                        <div className="mt-4">
                            <div className="mb-2 text-xs font-semibold uppercase text-gray-400">Expertise</div>
                            <div className="flex flex-wrap gap-1.5">
                                {staff.expertise.map((tag) => (
                                    <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="font-semibold text-gray-800">Completion</h2>
                            <span className="font-bold text-amber-600">{checklist.pct}%</span>
                        </div>
                        <div className="mb-3 space-y-1.5">
                            {Object.entries(checklist.items).map(([label, done]) => (
                                <div key={label} className={`flex items-center gap-2 rounded px-2 py-1.5 text-xs ${done ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                                    <span>{done ? '✓' : '○'}</span> {label}
                                </div>
                            ))}
                        </div>
                        <div className="mb-3 h-2 overflow-hidden rounded-full bg-gray-100">
                            <div className="h-full rounded-full bg-amber-500" style={{ width: `${checklist.pct}%` }} />
                        </div>
                        <Link href={route('portal.card.edit')} className="block rounded-md bg-amber-500 py-2 text-center text-sm font-semibold text-white hover:bg-amber-600">
                            Edit Profile
                        </Link>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="font-semibold text-gray-800">Account</h2>
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Read-only</span>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Staff ID</span><span className="font-mono">#{String(staff.id).padStart(3, '0')}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Email</span><span>{staff.email}</span></div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status</span>
                                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${staff.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {staff.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                        <div className="mt-3 rounded-md bg-blue-50 p-2 text-xs text-blue-700">
                            To change email or card URL, contact your admin.
                        </div>
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
}
