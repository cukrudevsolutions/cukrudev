import { Head, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

function makeStars(count) {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() < 0.25 ? 2.5 : Math.random() < 0.6 ? 1.8 : 1.2,
        duration: 2.4 + Math.random() * 3.2,
        delay: Math.random() * 5,
        depth: Math.random() < 0.5 ? 'near' : 'far',
    }));
}

const PROJECT_TYPES = [
    'Website / Landing Page',
    'Web System',
    'Mobile App',
    'Backend/API Development',
    'System Integration',
    'AI & Automation Solution',
    'Maintenance / Upgrade',
];

const SERVICES = [
    { label: 'Premium Website Design', path: 'M4 5.5h16A1.5 1.5 0 0 1 21.5 7v10A1.5 1.5 0 0 1 20 18.5H4A1.5 1.5 0 0 1 2.5 17V7A1.5 1.5 0 0 1 4 5.5zm0 1.5v2.5h16V7H4zm0 4v6h16v-6H4z' },
    { label: 'Web System Development', path: 'M4 4h16v5H4V4zm0 6.5h7.25V20H4v-9.5zm8.75 0H20V20h-7.25v-9.5zM5.5 5.5v2h13v-2h-13z' },
    { label: 'Mobile App Development', path: 'M8 2.5h8A2.5 2.5 0 0 1 18.5 5v14A2.5 2.5 0 0 1 16 21.5H8A2.5 2.5 0 0 1 5.5 19V5A2.5 2.5 0 0 1 8 2.5zm0 1.5A1 1 0 0 0 7 5v14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H8zm3 14.5h2a.75.75 0 1 1 0 1.5h-2a.75.75 0 1 1 0-1.5z' },
    { label: 'AI & Automation', path: 'M11.25 3h1.5v2.1a5.88 5.88 0 0 1 4.65 5.75V17A3.5 3.5 0 0 1 13.9 20.5H10.1A3.5 3.5 0 0 1 6.6 17v-6.15A5.88 5.88 0 0 1 11.25 5.1V3zM8.1 10.85V17A2 2 0 0 0 10.1 19h3.8a2 2 0 0 0 2-2v-6.15a4.38 4.38 0 1 0-7.8 0zM10 13.25a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z' },
    { label: 'Backend, API & Database', path: 'M12 3c4.42 0 8 1.34 8 3v12c0 1.66-3.58 3-8 3s-8-1.34-8-3V6c0-1.66 3.58-3 8-3zm0 1.5c-3.87 0-6.5 1.06-6.5 1.5s2.63 1.5 6.5 1.5 6.5-1.06 6.5-1.5S15.87 4.5 12 4.5zM5.5 8.22V10c0 .44 2.63 1.5 6.5 1.5s6.5-1.06 6.5-1.5V8.22C17.05 9.02 14.66 9 12 9s-5.05.02-6.5-.78zm0 4V14c0 .44 2.63 1.5 6.5 1.5s6.5-1.06 6.5-1.5v-1.78c-1.45.8-3.84.78-6.5.78s-5.05.02-6.5-.78zm0 4V18c0 .44 2.63 1.5 6.5 1.5s6.5-1.06 6.5-1.5v-1.78c-1.45.8-3.84.78-6.5.78s-5.05.02-6.5-.78z' },
    { label: 'Maintenance & Upgrade', path: 'M21 7.5l-5.6 5.6-3.5-3.5 5.6-5.6A6.5 6.5 0 0 0 9.7 12.4l-5.9 5.9a1.34 1.34 0 0 0 1.9 1.9l5.9-5.9A6.5 6.5 0 0 0 21 7.5z' },
];

const FEATURES = [
    {
        title: 'Development',
        desc: 'Built on modern tech stacks with clean architecture — so your product scales effortlessly as your business grows.',
        icon: <><polyline points="8 6 2 12 8 18" /><polyline points="16 6 22 12 16 18" /></>,
    },
    {
        title: 'Customization',
        desc: 'No templates. Every build is handcrafted around your brand identity, business workflow, and customer journey.',
        icon: <>
            <line x1="4" y1="6" x2="20" y2="6" /><circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" />
            <line x1="4" y1="12" x2="20" y2="12" /><circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
            <line x1="4" y1="18" x2="20" y2="18" /><circle cx="7" cy="18" r="2" fill="currentColor" stroke="none" />
        </>,
    },
    {
        title: 'Adaptable',
        desc: 'Future-proof solutions that grow with your team, adapt to new requirements, and stay relevant as your business evolves.',
        icon: <><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></>,
    },
    {
        title: 'Authorization',
        desc: 'Enterprise-grade authentication, role-based access, and encrypted data protection across every module and user level.',
        icon: <><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" /><polyline points="9 12 11 14 15 10" /></>,
    },
    {
        title: 'Management',
        desc: 'Powerful admin panels, real-time dashboards, and smart reporting tools to give you full control over your operations.',
        icon: <><rect x="3" y="12" width="4" height="8" /><rect x="10" y="7" width="4" height="13" /><rect x="17" y="3" width="4" height="17" /></>,
    },
    {
        title: 'Integration',
        desc: 'Seamlessly connect payment gateways, WhatsApp, AI engines, and any third-party API into one unified system.',
        icon: <><path d="M10 13a5 5 0 0 0 7.07 0l1.93-1.93a5 5 0 0 0-7.07-7.07L10.5 5.43" /><path d="M14 11a5 5 0 0 0-7.07 0L5 12.93a5 5 0 0 0 7.07 7.07L13.5 18.57" /></>,
    },
];

// Real WhatsApp brand glyph (outer bubble + inner handset detail), viewBox 0 0 448 512.
const WHATSAPP_VIEWBOX = '0 0 448 512';
const WHATSAPP_PATH = 'M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z';

const TRUST_GROUPS = [
    {
        category: 'Management',
        items: [
            {
                title: 'Discussions & Planning',
                desc: 'Direct communication with our team from kickoff to launch — no middlemen, no miscommunication.',
                icon: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
            },
            {
                title: 'Team Collaboration',
                desc: "Shared updates, milestone reviews, and full project visibility — you'll always know exactly where things stand.",
                icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
            },
            {
                title: 'Proven Delivery',
                desc: 'Clean code, structured handover docs, and post-launch support — every project ships production-ready.',
                icon: <><circle cx="12" cy="8" r="6" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></>,
            },
        ],
    },
    {
        category: 'Integration',
        items: [
            {
                title: 'Online Payment',
                desc: 'Accept payments seamlessly via Billplz, Stripe, or any gateway tailored to your market and customers.',
                icon: <><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></>,
            },
            {
                title: 'WhatsApp & Notifications',
                desc: 'Automate customer and team updates through WhatsApp, email alerts, and real-time in-app notifications.',
                filled: true,
                iconClass: 'wa',
                viewBox: WHATSAPP_VIEWBOX,
                icon: <path d={WHATSAPP_PATH} />,
            },
            {
                title: 'Artificial Intelligence',
                desc: 'Supercharge your system with AI — from smart automation to intelligent predictions that give you a competitive edge.',
                icon: <>
                    <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
                    <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
                    <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
                    <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
                    <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
                </>,
            },
        ],
    },
    {
        category: 'Security & Privacy',
        items: [
            {
                title: 'Data Security',
                desc: 'Security is built into every layer of development — your data stays protected from day one to production.',
                icon: <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />,
            },
            {
                title: 'Quality Assurance',
                desc: 'Rigorous testing ensures your system performs flawlessly under real-world conditions before going live.',
                icon: <><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><polyline points="9 14 11 16 15 11" /></>,
            },
            {
                title: 'Data Import/Export',
                desc: 'Move data in and out effortlessly with flexible import/export tools built for your operational needs.',
                icon: <><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></>,
            },
        ],
    },
];

const TEAM = [
    { name: 'MUHAMMAD ALIEFF BIN ROMIZA', title: 'General Manager', lead: true },
    { name: 'MUHAMMAD AKMAL BIN MOHD RASHID', title: 'Technical Manager' },
    { name: 'MUHAMMAD ALIF AIMAN BIN AZHAR', title: 'Account & Finance Manager' },
    { name: 'MUHAMMAD FAIQ BIN ISHAM', title: 'Sales & Marketing Manager' },
    { name: 'MUHAMMAD AMMAR BIN AZIZAN', title: 'Logistic Manager' },
    { name: 'MUHAMAD ADLI FARRIZ BIN AZLI', title: 'HR & Admin Manager' },
    { name: 'MUHAMMAD HIZBU FARHAN BIN ALIAS', title: 'Technical Executive' },
    { name: 'MEOR MUHAMMAD ANUAR FIRDAUS BIN AINOL SALLEH', title: 'Sales & Marketing Executive' },
];

const REVIEWS = [
    { quote: 'The website looks premium and the sections make our services much easier to understand. The inquiry flow feels very professional.', name: 'Aiman Hakimi', role: 'Founder, Retail Startup' },
    { quote: 'CukruDev gave us a clean dashboard concept and a landing page that finally matches how serious our business is.', name: 'Sarah Lim', role: 'Operations Manager' },
    { quote: 'Fast response, modern UI, and clear technical explanation. The design makes our brand look much more trustworthy.', name: 'Daniel Wong', role: 'Marketing Lead' },
    { quote: 'The team understood what we wanted quickly and turned it into a website structure that actually helps customers contact us.', name: 'Nur Amira', role: 'SME Business Owner' },
];

const WA_BUBBLE_MESSAGES = [
    'Need a website? Chat now.',
    'Request a project quotation.',
    'Want a premium landing page?',
    'Discuss your project scope.',
    'Build your system with us.',
];

function useReveal() {
    useEffect(() => {
        const items = document.querySelectorAll('.reveal');

        if (!('IntersectionObserver' in window)) {
            items.forEach((item) => item.classList.add('visible'));

            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 },
        );

        items.forEach((item, index) => {
            item.style.transitionDelay = `${Math.min(index * 40, 260)}ms`;
            observer.observe(item);
        });

        return () => observer.disconnect();
    }, []);
}

function normalizePhone(value) {
    const trimmed = value.trim();
    const hasPlus = trimmed.startsWith('+');
    const digits = trimmed.replace(/\D/g, '');

    return `${hasPlus ? '+' : ''}${digits}`;
}

export default function Home() {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        country: '',
        projectType: '',
        message: '',
    });

    const [activeService, setActiveService] = useState(0);
    const [activeReview, setActiveReview] = useState(0);
    const [navOpen, setNavOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [bubbleIndex, setBubbleIndex] = useState(0);
    const heroGlowRef = useRef(null);
    const servicesOrbRef = useRef(null);
    const starsNearRef = useRef(null);
    const starsFarRef = useRef(null);
    const stars = useMemo(() => makeStars(70), []);
    const starsNear = useMemo(() => stars.filter((s) => s.depth === 'near'), [stars]);
    const starsFar = useMemo(() => stars.filter((s) => s.depth === 'far'), [stars]);

    useReveal();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll);

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveReview((prev) => (prev + 1) % REVIEWS.length);
        }, 6500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setBubbleIndex((prev) => (prev + 1) % WA_BUBBLE_MESSAGES.length);
        }, 6000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let ticking = false;

        const onMouseMove = (e) => {
            if (ticking) return;
            ticking = true;

            window.requestAnimationFrame(() => {
                const cx = (e.clientX / window.innerWidth - 0.5) * 2;
                const cy = (e.clientY / window.innerHeight - 0.5) * 2;

                if (heroGlowRef.current) {
                    heroGlowRef.current.style.transform = `translate(${cx * 18}px, ${cy * 14}px)`;
                }
                if (servicesOrbRef.current) {
                    servicesOrbRef.current.style.transform = `rotateY(${cx * 12}deg) rotateX(${-cy * 8}deg)`;
                }
                if (starsNearRef.current) {
                    starsNearRef.current.style.transform = `translate(${cx * -22}px, ${cy * -16}px)`;
                }
                if (starsFarRef.current) {
                    starsFarRef.current.style.transform = `translate(${cx * -10}px, ${cy * -7}px)`;
                }

                ticking = false;
            });
        };

        document.addEventListener('mousemove', onMouseMove);

        return () => document.removeEventListener('mousemove', onMouseMove);
    }, []);

    useEffect(() => {
        const onCardMove = (e) => {
            const card = e.target.closest('.spotlight-card');
            if (!card) return;

            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
            card.style.setProperty('--my', `${e.clientY - rect.top}px`);
        };

        document.addEventListener('pointermove', onCardMove);

        return () => document.removeEventListener('pointermove', onCardMove);
    }, []);

    function submit(e) {
        e.preventDefault();

        post(route('inquiry.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    return (
        <>
            {/* Title, meta description, OG/Twitter tags, fonts, and landing.css are all
                rendered server-side from app.blade.php (scoped to the home route) so
                they're part of the very first HTML response — Inertia's <Head> only
                injects tags client-side after React hydrates, which crawlers/link-preview
                bots wouldn't see and also caused a flash of unstyled content on load. */}
            <Head>
                <link rel="icon" type="image/png" href="/images/favicon.png" />
            </Head>

            <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
                <nav className="navbar ldg-container">
                    <a className="brand" href="#home" aria-label="CukruDev home">
                        <img src="/images/footer-logo-white.png" alt="CukruDev logo" className="brand-logo" />
                        <span>Cukru<span>Dev</span></span>
                    </a>
                    <button
                        className="menu-toggle"
                        aria-label="Toggle navigation"
                        aria-expanded={navOpen}
                        onClick={() => setNavOpen((v) => !v)}
                    >
                        <span></span><span></span><span></span>
                    </button>
                    <ul className={`nav-links${navOpen ? ' active' : ''}`}>
                        <li><a href="#home" onClick={() => setNavOpen(false)}>Home</a></li>
                        <li><a href="#services" onClick={() => setNavOpen(false)}>Services</a></li>
                        <li><a href="#about" onClick={() => setNavOpen(false)}>About</a></li>
                    </ul>
                    <div className="nav-btns">
                        <a className="btn btn-nav-ghost" href="#about">Build With Us</a>
                        <a className="btn btn-nav-contact" href="#contact">Contact Us &rarr;</a>
                    </div>
                </nav>
            </header>

            <main id="home">
                <section className="hero">
                    <div className="hero-particles" aria-hidden="true"></div>
                    <div className="hero-stars hero-stars-far" ref={starsFarRef} aria-hidden="true">
                        {starsFar.map((s) => (
                            <span
                                key={s.id}
                                className="star"
                                style={{
                                    left: `${s.left}%`,
                                    top: `${s.top}%`,
                                    width: s.size,
                                    height: s.size,
                                    animationDuration: `${s.duration}s`,
                                    animationDelay: `${s.delay}s`,
                                }}
                            />
                        ))}
                    </div>
                    <div className="hero-stars hero-stars-near" ref={starsNearRef} aria-hidden="true">
                        {starsNear.map((s) => (
                            <span
                                key={s.id}
                                className="star"
                                style={{
                                    left: `${s.left}%`,
                                    top: `${s.top}%`,
                                    width: s.size,
                                    height: s.size,
                                    animationDuration: `${s.duration}s`,
                                    animationDelay: `${s.delay}s`,
                                }}
                            />
                        ))}
                        <span className="shooting-star ss1" />
                        <span className="shooting-star ss2" />
                    </div>
                    <div className="hero-glow" ref={heroGlowRef} aria-hidden="true"></div>
                    <div className="ldg-container">
                        <div className="hero-center reveal">
                            <span className="hero-badge">PREMIUM DIGITAL SOLUTIONS IN MALAYSIA</span>
                            <h1>Launch a website that makes people <span className="grad-text">trust your brand</span> faster.</h1>
                            <p className="hero-sub">CukruDev Solutions designs and builds sharp websites, business systems, mobile apps, dashboards, and automation tools with a polished brand-first approach.</p>
                            <div className="hero-actions">
                                <a href="#contact" className="btn btn-hero-primary">Get Started &rarr;</a>
                                <a href="#services" className="btn btn-hero-ghost">Explore Services &#10022;</a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="services section" id="services">
                    <div className="ldg-container services-layout">
                        <div className="services-left reveal">
                            <p className="eyebrow">Our Services</p>
                            <h2>Everything you need to go digital — in one place</h2>
                            <p>From sleek landing pages to full-scale business systems, we cover every layer of your digital presence. Pick what you need below.</p>

                            <ul className="service-list">
                                {SERVICES.map((svc, i) => (
                                    <li
                                        key={svc.label}
                                        className={`service-item${activeService === i ? ' is-active' : ''}`}
                                        onClick={() => setActiveService(i)}
                                    >
                                        <div className="svc-icon" aria-hidden="true">
                                            <svg viewBox="0 0 24 24" fill="currentColor"><path d={svc.path} /></svg>
                                        </div>
                                        <span>{svc.label}</span>
                                    </li>
                                ))}
                                <li className="service-brand-item">
                                    <a href="https://gredku.com" target="_blank" rel="noopener noreferrer" className="service-brand-link">
                                        <img src="/images/logoGREDKU.png" alt="GredKu" />
                                        <span>GredKu</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="services-right reveal" aria-hidden="true">
                            <div className="svc-grid-bg"></div>
                            <div className="services-orb" ref={servicesOrbRef}>
                                <div className="orb-ring r1"></div>
                                <div className="orb-ring r2"></div>
                                <div className="orb-core">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="fss section">
                    <div className="ldg-container">
                        <div className="fss-head reveal">
                            <h2 className="fss-title">Faster. Smarter. Secure.</h2>
                            <p>Every project is engineered for speed, intelligence, and enterprise-grade security — so your brand performs at its best from day one.</p>
                        </div>
                        <div className="fss-card reveal">
                            <div className="fss-left">
                                <h3>Design, performance &amp; security — all built in</h3>
                                <p>Stop worrying about scattered vendors. Our team handles design, security, integrations, and quality assurance under one roof — so you can focus on growing your business.</p>
                                <a href="#contact" className="btn btn-outline">Contact Us &rarr;</a>
                            </div>
                            <div className="fss-right" aria-hidden="true">
                                <div className="pill-tag p1">WhatsApp Integration</div>
                                <div className="pill-tag p2">Payment Gateway</div>
                                <div className="pill-tag p3">Admin Panel</div>
                                <div className="pill-tag p4">Database Design</div>
                                <div className="pill-tag p5">Mobile App</div>
                                <div className="pill-tag p6">AI Automation</div>
                                <div className="pill-tag p7">Secure Auth</div>
                                <div className="pill-tag p8">REST API</div>
                                <div className="pill-tag p9">SEO Ready</div>
                                <div className="fss-orb">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                        <rect x="4" y="4" width="16" height="16" rx="2" />
                                        <rect x="9" y="9" width="6" height="6" />
                                        <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
                                        <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
                                        <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
                                        <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="feat-grid-section section">
                    <div className="ldg-container feat-grid reveal">
                        {FEATURES.map((f) => (
                            <div className="feat-item spotlight-card" key={f.title}>
                                <div className="feat-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        {f.icon}
                                    </svg>
                                </div>
                                <h4>{f.title}</h4>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="trust section">
                    <div className="ldg-container">
                        <div className="trust-head reveal">
                            <h2>Why businesses choose CukruDev</h2>
                            <p>We don't just build products — we become your technical partner. From discovery to delivery, your project gets full commitment and zero shortcuts.</p>
                        </div>

                        {TRUST_GROUPS.map((group) => (
                            <div className="trust-group reveal" key={group.category}>
                                <span className="trust-cat">{group.category}</span>
                                <div className="trust-row">
                                    {group.items.map((item) => (
                                        <div className="trust-item" key={item.title}>
                                            <div className={`trust-icon${item.iconClass ? ` ${item.iconClass}` : ''}`}>
                                                {item.filled ? (
                                                    <svg viewBox={item.viewBox ?? '0 0 24 24'} fill="currentColor">{item.icon}</svg>
                                                ) : (
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                        {item.icon}
                                                    </svg>
                                                )}
                                            </div>
                                            <h4>{item.title}</h4>
                                            <p>{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="cta-band section">
                    <div className="ldg-container cta-band-inner reveal">
                        <div className="cta-band-copy">
                            <p className="eyebrow">Ready to make the move?</p>
                            <h2>Let's Digitize Your Business</h2>
                            <p>Your competitors are already online. Take control of your digital presence with premium websites, systems, and tools engineered to convert visitors into customers.</p>
                        </div>
                        <a href="#contact" className="btn btn-primary cta-band-btn">Contact Us &rarr;</a>
                    </div>
                </section>

                <section className="team section" id="about">
                    <div className="ldg-container">
                        <div className="about-layout">
                            <div className="section-copy about-story reveal">
                                <p className="eyebrow">About CukruDev</p>
                                <h2>Calm thinking. Sharp execution.</h2>
                                <p><strong>CukruDev Solutions</strong> is a digital product studio building premium websites, systems, apps, and automation tools for businesses that want to look serious and operate smarter.</p>
                                <p>The name <strong>Cukru</strong> is inspired by the calm sound of a bird — representing a steady, thoughtful approach to every project. The owl in our identity embodies wisdom, focus, and the sharp observation needed to turn raw ideas into polished digital products.</p>
                                <p><strong>Dev</strong> stands for development with purpose. <strong>Solutions</strong> reflects our commitment to solving real business problems — not just writing code.</p>
                            </div>
                        </div>
                        <div className="section-copy team-intro reveal">
                            <p className="eyebrow">Team structure</p>
                            <h2>Small team. Big impact.</h2>
                            <p>Strategy, technology, finance, and engineering — all aligned under one roof so every project ships with speed and precision.</p>
                        </div>
                        <div className="team-grid reveal">
                            {TEAM.map((member) => (
                                member.lead ? (
                                    <article className="team-lead spotlight-card" key={member.name}>
                                        <h3>{member.name}</h3>
                                        <p>{member.title}</p>
                                    </article>
                                ) : (
                                    <article className="spotlight-card" key={member.name}>
                                        <h3>{member.name}</h3>
                                        <p>{member.title}</p>
                                    </article>
                                )
                            ))}
                        </div>
                    </div>
                </section>

                <section className="reviews section" id="reviews">
                    <div className="ldg-container">
                        <div className="section-copy centered reveal">
                            <p className="eyebrow">Client feedback</p>
                            <h2>Real results. Real feedback.</h2>
                        </div>
                        <div className="review-carousel reveal" aria-label="Client review carousel">
                            <button className="carousel-btn prev" type="button" aria-label="Previous review"
                                onClick={() => setActiveReview((p) => (p - 1 + REVIEWS.length) % REVIEWS.length)}>
                                &lsaquo;
                            </button>
                            <div className="review-window">
                                <div className="review-track" style={{ transform: `translateX(-${activeReview * 100}%)` }}>
                                    {REVIEWS.map((r) => (
                                        <article className="review-card spotlight-card" key={r.name}>
                                            <div className="stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                                            <p>"{r.quote}"</p>
                                            <div className="reviewer">
                                                <strong>{r.name}</strong>
                                                <span>{r.role}</span>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                            <button className="carousel-btn next" type="button" aria-label="Next review"
                                onClick={() => setActiveReview((p) => (p + 1) % REVIEWS.length)}>
                                &rsaquo;
                            </button>
                        </div>
                        <div className="carousel-dots" aria-label="Review carousel pagination">
                            {REVIEWS.map((r, i) => (
                                <button
                                    key={r.name}
                                    type="button"
                                    className={i === activeReview ? 'active' : ''}
                                    aria-label={`Show review ${i + 1}`}
                                    onClick={() => setActiveReview(i)}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="contact section" id="contact">
                    <div className="ldg-container contact-layout">
                        <div className="contact-copy reveal">
                            <p className="eyebrow">Let's talk</p>
                            <h2>Tell us what you want to build.</h2>
                            <p>Share your project goal, business type, and timeline — we'll get back to you with a clear direction and practical next steps within 24 hours.</p>
                            <a className="btn btn-whatsapp" href="https://wa.me/60147978792?text=Hi%20CukruDev%2C%20I%20would%20like%20to%20discuss%20a%20project." target="_blank" rel="noopener noreferrer">
                                WhatsApp CukruDev
                            </a>
                        </div>
                        <form className="contact-form reveal" onSubmit={submit} noValidate>
                            <div className="form-grid">
                                <div className={`field${errors.fullName ? ' error' : ''}`}>
                                    <label htmlFor="fullName">Full Name <span className="required">*</span></label>
                                    <input type="text" id="fullName" autoComplete="name" value={data.fullName}
                                        onChange={(e) => setData('fullName', e.target.value)} />
                                    <small className="error-msg">{errors.fullName}</small>
                                </div>
                                <div className={`field${errors.email ? ' error' : ''}`}>
                                    <label htmlFor="email">Email <span className="required">*</span></label>
                                    <input type="email" id="email" autoComplete="email" value={data.email}
                                        onChange={(e) => setData('email', e.target.value)} />
                                    <small className="error-msg">{errors.email}</small>
                                </div>
                                <div className={`field${errors.phone ? ' error' : ''}`}>
                                    <label htmlFor="phone">Phone / WhatsApp Number <span className="required">*</span></label>
                                    <div className="phone-input-wrap">
                                        <span>+</span>
                                        <input type="tel" id="phone" placeholder="60123456789" inputMode="tel" autoComplete="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', normalizePhone(e.target.value))} />
                                    </div>
                                    <small className="field-hint">Use country code, e.g. +60123456789</small>
                                    <small className="error-msg">{errors.phone}</small>
                                </div>
                                <div className={`field${errors.company ? ' error' : ''}`}>
                                    <label htmlFor="company">Company / Organization <span className="required">*</span></label>
                                    <input type="text" id="company" value={data.company}
                                        onChange={(e) => setData('company', e.target.value)} />
                                    <small className="error-msg">{errors.company}</small>
                                </div>
                                <div className={`field${errors.country ? ' error' : ''}`}>
                                    <label htmlFor="country">Country / Market <span className="required">*</span></label>
                                    <input type="text" id="country" placeholder="Malaysia, Singapore, Global, etc." value={data.country}
                                        onChange={(e) => setData('country', e.target.value)} />
                                    <small className="error-msg">{errors.country}</small>
                                </div>
                                <div className={`field${errors.projectType ? ' error' : ''}`}>
                                    <label htmlFor="projectType">Project Type <span className="required">*</span></label>
                                    <select id="projectType" value={data.projectType}
                                        onChange={(e) => setData('projectType', e.target.value)}>
                                        <option value="">Select project type</option>
                                        {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    <small className="error-msg">{errors.projectType}</small>
                                </div>
                                <div className={`field field-full${errors.message ? ' error' : ''}`}>
                                    <label htmlFor="message">Message <span className="required">*</span></label>
                                    <textarea id="message" rows={5} value={data.message}
                                        onChange={(e) => setData('message', e.target.value)} />
                                    <small className="error-msg">{errors.message}</small>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary form-submit" disabled={processing}>
                                {processing ? 'Sending...' : 'Send Inquiry'}
                            </button>
                            <p className="form-status" aria-live="polite" style={{ color: recentlySuccessful ? '#16a34a' : '#dc2626' }}>
                                {recentlySuccessful ? 'Inquiry submitted successfully. Our team will contact you shortly.' : (Object.keys(errors).length > 0 ? 'Please correct the highlighted fields before sending.' : '')}
                            </p>
                        </form>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <div className="ldg-container footer-grid">
                    <div>
                        <a className="brand footer-brand" href="#home">
                            <img src="/images/footer-logo-white.png" alt="CukruDev logo" className="brand-logo" />
                            <span>Cukru<span>Dev</span></span>
                        </a>
                        <p className="footer-company">CukruDev Solutions</p>
                        <p className="footer-ssm">202603102656 (003842967-W)</p>
                        <p>Think Tech. Build Smarter.</p>
                    </div>
                    <div>
                        <h3>Company</h3>
                        <ul>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#reviews">Reviews</a></li>
                            <li><a href="#contact">Contact Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3>Services</h3>
                        <ul>
                            <li><a href="#services">Website Design</a></li>
                            <li><a href="#services">Web Systems</a></li>
                            <li><a href="#services">Mobile Apps</a></li>
                            <li><a href="#services">AI Automation</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3>Contact</h3>
                        <ul>
                            <li><a href="mailto:cukrudev@gmail.com">cukrudev@gmail.com</a></li>
                            <li><a href="https://maps.app.goo.gl/ji6btoXgDzBkzXZf7" target="_blank" rel="noopener noreferrer">Pahang, Malaysia</a></li>
                        </ul>
                    </div>
                </div>
                <div className="ldg-container footer-bottom">
                    <p>&copy; {new Date().getFullYear()} CukruDev Solutions. All rights reserved.</p>
                </div>
            </footer>

            <div className="wa-widget">
                <div className="wa-bubble" aria-live="polite">{WA_BUBBLE_MESSAGES[bubbleIndex]}</div>
                <a href="https://wa.me/60147978792?text=Hi%20CukruDev%2C%20I%20would%20like%20to%20get%20a%20quotation." target="_blank" rel="noopener noreferrer" className="wa-float" aria-label="Chat on WhatsApp">
                    <svg viewBox={WHATSAPP_VIEWBOX} aria-hidden="true">
                        <path d={WHATSAPP_PATH} />
                    </svg>
                </a>
            </div>
        </>
    );
}
