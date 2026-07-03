import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';

const staffNavItems = [
    { label: 'Dashboard', route: 'portal.dashboard' },
    { label: 'My Card', route: 'portal.card.show' },
    { label: 'My Contracts', route: 'portal.contracts.index' },
    { label: 'My Gigs', route: 'portal.gigs.index' },
    { label: 'Offers', route: 'portal.offers.index', badge: true },
    { label: 'My Points', route: 'portal.points.index' },
    { label: 'Earnings', route: 'portal.earnings.index' },
];

const adminNavItems = [
    { label: 'Admin Dashboard', route: 'portal.admin.dashboard' },
    { label: 'Projects', route: 'portal.admin.projects.index' },
    { label: 'Tasks', route: 'portal.admin.tasks.index' },
    { label: 'Clients', route: 'portal.admin.clients.index' },
    { label: 'Staff', route: 'portal.admin.staff.index' },
    { label: 'Middlemen', route: 'portal.admin.middlemen.index' },
    { label: 'Inquiries', route: 'portal.admin.inquiries.index' },
    { label: 'Points', route: 'portal.admin.points.index' },
    { label: 'Activity Log', route: 'portal.admin.activityLog.index' },
    { label: 'Distribution Settings', route: 'portal.admin.paymentCategories.index' },
];

function isActive(routeName) {
    return route().current(routeName) || route().current(routeName + '.*');
}

export default function PortalLayout({ header, children }) {
    const { auth, flash, pendingOffersCount } = usePage().props;
    const user = auth.user;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside className="w-64 shrink-0 bg-gray-900 text-gray-200">
                <div className="flex h-16 items-center px-4">
                    <Link href={route('portal.dashboard')}>
                        <ApplicationLogo className="h-8 w-auto fill-current text-white" />
                    </Link>
                </div>

                <nav className="mt-4 space-y-1 px-2">
                    {staffNavItems.map((item) => (
                        <Link
                            key={item.route}
                            href={route(item.route)}
                            className={`flex items-center justify-between rounded px-3 py-2 text-sm font-medium ${
                                isActive(item.route)
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <span>{item.label}</span>
                            {item.badge && pendingOffersCount > 0 && (
                                <span className="ml-2 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-gray-900">
                                    {pendingOffersCount}
                                </span>
                            )}
                        </Link>
                    ))}

                    {user.is_admin && (
                        <>
                            <div className="mt-6 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Admin
                            </div>
                            {adminNavItems.map((item) => (
                                <Link
                                    key={item.route}
                                    href={route(item.route)}
                                    className={`block rounded px-3 py-2 text-sm font-medium ${
                                        isActive(item.route)
                                            ? 'bg-gray-800 text-white'
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </>
                    )}
                </nav>
            </aside>

            <div className="flex flex-1 flex-col">
                <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
                    <div>{header}</div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                            {user.full_name}
                        </span>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="text-sm text-gray-500 hover:text-gray-800"
                        >
                            Log Out
                        </Link>
                    </div>
                </header>

                {flash?.success && (
                    <div className="bg-green-50 px-6 py-3 text-sm text-green-800">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="bg-red-50 px-6 py-3 text-sm text-red-800">
                        {flash.error}
                    </div>
                )}

                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
