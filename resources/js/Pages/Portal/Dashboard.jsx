import PortalLayout from '@/Layouts/PortalLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <PortalLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                <div className="p-6 text-gray-900">You're logged in!</div>
            </div>
        </PortalLayout>
    );
}
