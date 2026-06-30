import { Head, Link } from '@inertiajs/react';

export default function ProfileNotFound() {
    return (
        <>
            <Head title="Profile not found" />
            <div style={{
                minHeight: '100vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                fontFamily: 'Inter, sans-serif', background: '#0b1220', color: '#fff', padding: '2rem',
            }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Profile not found</h1>
                <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>This staff profile doesn't exist or is no longer active.</p>
                <Link href="/" style={{ color: '#3b82f6' }}>Back to CukruDev Solutions</Link>
            </div>
        </>
    );
}
