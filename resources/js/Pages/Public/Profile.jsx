import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const SOCIAL_ICONS = {
    linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
    instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
    tiktok: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.53V6.78a4.84 4.84 0 01-1.01-.09z',
    youtube: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
};

function NfcOverlay({ name, onDone }) {
    useEffect(() => {
        const hideTimer = setTimeout(onDone, 2400);

        return () => clearTimeout(hideTimer);
    }, [onDone]);

    return (
        <div className="nfc-overlay" aria-hidden="true">
            <div className="nfc-anim">
                <div className="nfc-ring nfc-ring-3"></div>
                <div className="nfc-ring nfc-ring-2"></div>
                <div className="nfc-ring nfc-ring-1"></div>
                <div className="nfc-core">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12a7 7 0 0 1 14 0" />
                        <path d="M8.5 12a3.5 3.5 0 0 1 7 0" />
                        <circle cx="12" cy="12" r="1" fill="currentColor" />
                        <path d="M2 12a10 10 0 0 1 20 0" />
                    </svg>
                </div>
            </div>
            <p className="nfc-label">NFC Tap Detected</p>
            <p className="nfc-sub">{name}'s contact card</p>
        </div>
    );
}

export default function Profile({ staff, projects, services, isNfc }) {
    const [showNfc, setShowNfc] = useState(isNfc);
    const pageTitle = `${staff.fullName} | ${staff.position || 'Team Member'} | CukruDev Solutions`;

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                {staff.bio && <meta name="description" content={staff.bio.slice(0, 160)} />}
                <link rel="icon" type="image/png" href="/images/favicon.png" />
                <link rel="stylesheet" href="/css/staff-profile.css" />
            </Head>

            <div className="atmosphere" aria-hidden="true"></div>

            {showNfc && <NfcOverlay name={staff.fullName} onDone={() => setShowNfc(false)} />}

            <div className="beams" aria-hidden="true">
                <span className="beam"></span>
                <span className="beam"></span>
                <span className="beam"></span>
            </div>

            <nav className="sp-topbar" aria-label="Site navigation">
                <a href="/" className="sp-brand">
                    <span className="sp-nav-logo" aria-hidden="true">
                        <img src="/images/footer-logo-white.png" alt="CukruDev" />
                    </span>
                    <span className="sp-brand-text">
                        <span className="sp-bname">Cukru<span style={{ color: 'var(--blue)' }}>Dev</span></span>
                        <span className="sp-bsub">Solutions</span>
                    </span>
                </a>
                <a href={`/download-vcard/${staff.slug}`} className="sp-topbar-save">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                    Save Contact
                </a>
            </nav>

            <main className="sp-page">
                <div className="sp-shell">
                    <header className="sp-profile-card reveal">
                        <div className="sp-avatar-orbit">
                            <span className="orbit-ring" aria-hidden="true"></span>
                            {staff.avatarUrl ? (
                                <img src={staff.avatarUrl} alt={staff.fullName} />
                            ) : (
                                <div className="sp-initials" aria-label={staff.fullName}>{staff.initials}</div>
                            )}
                        </div>

                        <h1 className="sp-name">{staff.fullName}</h1>

                        {staff.position && <p className="sp-position">{staff.position}</p>}

                        <div className="sp-staffid">
                            <span>#{String(staff.id).padStart(3, '0')}</span>
                        </div>

                        {staff.shortTitle && <p className="sp-short-title">{staff.shortTitle}</p>}

                        {Object.keys(staff.socialLinks).length > 0 && (
                            <nav className="sp-social-row" aria-label="Social media">
                                {Object.entries(staff.socialLinks).map(([key, link]) => (
                                    <a key={key} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label} title={link.label}>
                                        <svg viewBox="0 0 24 24" fill="currentColor"><path d={SOCIAL_ICONS[key]} /></svg>
                                    </a>
                                ))}
                            </nav>
                        )}
                    </header>

                    <section className="sp-link-stack" aria-label="Contact options">
                        {staff.whatsappLink && (
                            <a className="link-card reveal" href={staff.whatsappLink} target="_blank" rel="noopener noreferrer">
                                <span className="link-icon ic-wa">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.55 0 .24 5.3.24 11.84c0 2.08.54 4.11 1.56 5.9L0 24l6.45-1.7a11.78 11.78 0 0 0 5.63 1.44h.01c6.53 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.41-8.42zM12.09 21.7h-.01a9.77 9.77 0 0 1-4.98-1.36l-.36-.21-3.83 1 1.02-3.73-.24-.38a9.77 9.77 0 0 1-1.5-5.18c0-5.39 4.39-9.78 9.79-9.78 2.61 0 5.07 1.02 6.92 2.88a9.72 9.72 0 0 1 2.86 6.9c0 5.39-4.39 9.78-9.77 9.78z" /></svg>
                                </span>
                                <span>
                                    <strong>WhatsApp</strong>
                                    <small>Chat directly — fastest way to reach me.</small>
                                </span>
                                <span className="link-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></span>
                            </a>
                        )}

                        <a className="link-card primary reveal" href={`/download-vcard/${staff.slug}`}>
                            <span className="link-icon ic-save">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <span>
                                <strong>Save Contact</strong>
                                <small>Download my vCard — add me to your contacts.</small>
                            </span>
                            <span className="link-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></span>
                        </a>

                        <a className="link-card reveal" href={`mailto:${staff.email}`}>
                            <span className="link-icon ic-email">
                                <svg viewBox="0 0 24 24"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-11Zm2.5-.5 6.5 5 6.5-5h-13Zm13.5 2.2-7 5.4-7-5.4v9.3c0 .28.22.5.5.5h13a.5.5 0 0 0 .5-.5V8.2Z" fill="currentColor" /></svg>
                            </span>
                            <span>
                                <strong>Email</strong>
                                <small>{staff.email}</small>
                            </span>
                            <span className="link-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></span>
                        </a>

                        <a className="link-card reveal" href={staff.websiteUrl} target="_blank" rel="noopener noreferrer">
                            <span className="link-icon ic-web">
                                <img src="/images/footer-logo-white.png" alt="CukruDev" />
                            </span>
                            <span>
                                <strong>Company Website</strong>
                                <small>Explore our services, portfolio, and solutions.</small>
                            </span>
                            <span className="link-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></span>
                        </a>

                        <a className="link-card reveal" href="/#contact">
                            <span className="link-icon ic-quote">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                            </span>
                            <span>
                                <strong>Request Quotation</strong>
                                <small>Start your project — get a free quote today.</small>
                            </span>
                            <span className="link-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></span>
                        </a>
                    </section>

                    {staff.bio && (
                        <div className="sp-content-card reveal">
                            <p className="sp-eyebrow">About</p>
                            <p className="sp-bio">{staff.bio}</p>
                        </div>
                    )}

                    {staff.expertise.length > 0 && (
                        <div className="sp-content-card reveal">
                            <p className="sp-eyebrow">Expertise</p>
                            <div className="sp-chips" role="list">
                                {staff.expertise.map((skill) => (
                                    <span className="sp-chip" role="listitem" key={skill}>{skill}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {services.length > 0 && (
                        <div className="sp-content-card reveal">
                            <p className="sp-eyebrow">Services</p>
                            <div className="sp-services-grid">
                                {services.map((svc) => (
                                    <div className="sp-service-item" key={svc.title}>
                                        {svc.icon && <div className="sp-service-icon" aria-hidden="true">{svc.icon}</div>}
                                        <h3>{svc.title}</h3>
                                        {svc.description && <p>{svc.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {projects.length > 0 && (
                        <div className="sp-content-card reveal">
                            <p className="sp-eyebrow">Featured Projects</p>
                            <div className="sp-projects-grid">
                                {projects.map((proj) => (
                                    <div className="sp-project-item" key={proj.title}>
                                        {proj.imageUrl && (
                                            <img src={proj.imageUrl} alt={proj.title} className="sp-project-img" loading="lazy" />
                                        )}
                                        <div className="sp-project-body">
                                            <h3>{proj.title}</h3>
                                            {proj.description && <p>{proj.description}</p>}
                                            {proj.projectUrl && (
                                                <a href={proj.projectUrl} target="_blank" rel="noopener noreferrer" className="sp-project-link">
                                                    View Project &rarr;
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className="sp-footer reveal">
                <div className="sp-footer-logo">
                    <img src="/images/footer-logo-white.png" alt="CukruDev" />
                </div>
                <p className="sp-footer-name">CukruDev Solutions</p>
                <p className="sp-footer-tag">Think Tech. Build Better.</p>
                <span>
                    <span className="reg">202603102656 (003842967-W)</span>
                    Pekan, Pahang, Malaysia<br />
                    <a href="https://cukrudev.com" target="_blank" rel="noopener noreferrer">cukrudev.com</a>
                </span>
            </footer>
        </>
    );
}
