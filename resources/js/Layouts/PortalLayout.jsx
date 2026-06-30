import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';

const staffNavItems = [
    { label: 'Dashboard', route: 'portal.dashboard' },
];

const adminNavItems = [
    { label: 'Admin Dashboard', route: 'portal.admin.dashboard' },
];

export default function PortalLayout({ header, children }) {
    const { auth, flash } = usePage().props;
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
                            className={`block rounded px-3 py-2 text-sm font-medium ${
                                route().current(item.route)
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            {item.label}
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
                                        route().current(item.route)
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
