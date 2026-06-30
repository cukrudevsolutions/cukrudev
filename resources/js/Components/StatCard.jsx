export default function StatCard({ label, value, meta, valueClassName = 'text-gray-900' }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</div>
            <div className={`mt-1 font-mono text-2xl font-bold ${valueClassName}`}>{value}</div>
            {meta && <div className="mt-1 text-xs text-gray-500">{meta}</div>}
        </div>
    );
}
