const STATUS_COLORS = {
    pending: 'bg-gray-100 text-gray-700',
    offered: 'bg-blue-100 text-blue-700',
    accepted: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-amber-100 text-amber-700',
    submitted: 'bg-blue-100 text-blue-700',
    revision: 'bg-orange-100 text-orange-700',
    completed: 'bg-green-100 text-green-700',
    paid: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    active: 'bg-amber-100 text-amber-700',
    calculated: 'bg-blue-100 text-blue-700',
};

export function statusBadgeClass(status) {
    return STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-700';
}

export function statusLabel(status) {
    return (status ?? '').replace(/_/g, ' ');
}
