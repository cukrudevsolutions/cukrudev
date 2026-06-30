import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const SOCIALS = [
    { label: 'Instagram', href: 'https://www.instagram.com/cukrudev', path: 'M7.75 3h8.5A4.75 4.75 0 0 1 21 7.75v8.5A4.75 4.75 0 0 1 16.25 21h-8.5A4.75 4.75 0 0 1 3 16.25v-8.5A4.75 4.75 0 0 1 7.75 3zm0 1.8A2.95 2.95 0 0 0 4.8 7.75v8.5A2.95 2.95 0 0 0 7.75 19.2h8.5a2.95 2.95 0 0 0 2.95-2.95v-8.5a2.95 2.95 0 0 0-2.95-2.95h-8.5zm8.95 1.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM12 7.6a4.4 4.4 0 1 1 0 8.8 4.4 4.4 0 0 1 0-8.8zm0 1.8a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2z' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@cukrudev', path: 'M14.5 3.5c.32 1.7 1.36 3.06 3 3.62v2.36a6.34 6.34 0 0 1-3-1.02v5.62a4.92 4.92 0 1 1-4.93-4.92c.32 0 .63.03.93.09v2.55a2.36 2.36 0 0 0-.93-.19 2.47 2.47 0 1 0 2.47 2.47V3.5h2.46z' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/cukrudev/', path: 'M6.94 8.5a1.44 1.44 0 1 1 0-2.88 1.44 1.44 0 0 1 0 2.88zM5.7 9.75h2.48V18H5.7V9.75zm4.02 0h2.37v1.12h.03c.33-.62 1.14-1.27 2.35-1.27 2.52 0 2.99 1.66 2.99 3.81V18H15v-4.02c0-.96-.02-2.2-1.34-2.2-1.34 0-1.55 1.05-1.55 2.13V18H9.72V9.75z' },
    { label: 'Facebook', href: 'https://www.facebook.com/share/1E26jyKXcJ/', path: 'M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.87.25-1.46 1.5-1.46h1.6V4.96c-.27-.04-1.2-.12-2.28-.12-2.25 0-3.8 1.38-3.8 3.9V11H8v3h2.52v8h2.98z' },
    { label: 'YouTube', href: 'https://www.youtube.com/@cukrudev', path: 'M21.6 7.2a2.98 2.98 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5a2.98 2.98 0 0 0-2.1 2.1C1.9 9 1.9 12 1.9 12s0 3 .5 4.8a2.98 2.98 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a2.98 2.98 0 0 0 2.1-2.1c.5-1.8.5-4.8.5-4.8s0-3-.5-4.8zM10.2 15.5V8.5L15.8 12l-5.6 3.5z' },
];

const LINKS = [
    { label: 'Official Website', desc: 'Explore services, workflow, reviews, and inquiry form.', href: '/', primary: true, logo: true },
    { label: 'WhatsApp', desc: 'Talk to us about your website, system, app, or automation.', href: 'https://wa.me/60147978792?text=Hi%20CukruDev%2C%20I%20would%20like%20to%20discuss%20a%20project.', icon: 'M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.55 0 .24 5.3.24 11.84c0 2.08.54 4.11 1.56 5.9L0 24l6.45-1.7a11.78 11.78 0 0 0 5.63 1.44h.01c6.53 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.41-8.42z' },
    { label: 'Email', desc: 'cukrudev@gmail.com', href: 'mailto:cukrudev@gmail.com', icon: 'M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-11Z' },
    { label: 'LinkedIn', desc: 'Company updates and professional profile.', href: 'https://www.linkedin.com/company/cukrudev/', icon: SOCIALS[2].path },
    { label: 'Instagram', desc: 'Visual updates, design progress, and announcements.', href: 'https://www.instagram.com/cukrudev', icon: SOCIALS[0].path },
    { label: 'TikTok', desc: 'Short updates and behind-the-build content.', href: 'https://www.tiktok.com/@cukrudev', icon: SOCIALS[1].path },
    { label: 'Facebook', desc: 'Follow our official page.', href: 'https://www.facebook.com/share/1E26jyKXcJ/', icon: SOCIALS[3].path },
];

const BUBBLE = 'Need a premium website?';

export default function Links() {
    const [reveal, setReveal] = useState(false);

    useEffect(() => setReveal(true), []);

    return (
        <>
            <Head>
                <title>CukruDev Links</title>
                <meta name="description" content="Official CukruDev links for website, social media, email, and WhatsApp contact." />
                <link rel="icon" type="image/png" href="/images/favicon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="/css/links.css" />
            </Head>

            <main className="links-page">
                <div className="bg-grid" aria-hidden="true"></div>
                <div className="beam beam-one" aria-hidden="true"></div>
                <div className="beam beam-two" aria-hidden="true"></div>

                <section className="links-shell">
                    <header className={`profile-card${reveal ? ' visible' : ''} reveal`}>
                        <a className="logo-orbit" href="/" aria-label="Open CukruDev website">
                            <span className="orbit-ring"></span>
                            <img src="/images/logo.png" alt="CukruDev logo" />
                        </a>
                        <p className="eyebrow">Official links</p>
                        <h1>Cukru<span>Dev</span></h1>
                        <p className="tagline">Think Tech. Build Better.</p>

                        <nav className="social-row" aria-label="CukruDev social links">
                            {SOCIALS.map((s) => (
                                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}>
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d={s.path} /></svg>
                                </a>
                            ))}
                        </nav>
                    </header>

                    <section className="link-stack" aria-label="Main CukruDev links">
                        {LINKS.map((link) => (
                            <a
                                key={link.label}
                                className={`link-card${link.primary ? ' primary' : ''}${reveal ? ' visible' : ''} reveal`}
                                href={link.href}
                                target={link.href.startsWith('http') ? '_blank' : undefined}
                                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            >
                                <span className={`link-icon${link.logo ? ' logo-mini' : ''}`}>
                                    {link.logo ? (
                                        <img src="/images/logo.png" alt="" />
                                    ) : (
                                        <svg viewBox="0 0 24 24"><path d={link.icon} /></svg>
                                    )}
                                </span>
                                <span>
                                    <strong>{link.label}</strong>
                                    <small>{link.desc}</small>
                                </span>
                                <i aria-hidden="true"></i>
                            </a>
                        ))}
                    </section>

                    <footer className={`links-footer${reveal ? ' visible' : ''} reveal`}>
                        <p>CukruDev Solutions</p>
                        <span>202603102656 (003842967-W)</span>
                    </footer>
                </section>
            </main>

            <div className="wa-widget">
                <div className="wa-bubble" aria-live="polite">{BUBBLE}</div>
                <a href="https://wa.me/60147978792?text=Hi%20CukruDev%2C%20I%20came%20from%20your%20links%20page." target="_blank" rel="noopener noreferrer" className="wa-float" aria-label="Chat on WhatsApp" title="Chat on WhatsApp">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.55 0 .24 5.3.24 11.84c0 2.08.54 4.11 1.56 5.9L0 24l6.45-1.7a11.78 11.78 0 0 0 5.63 1.44h.01c6.53 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.41-8.42z" /></svg>
                </a>
            </div>
        </>
    );
}
