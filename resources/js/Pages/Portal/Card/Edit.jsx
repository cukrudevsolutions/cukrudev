import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

function TextField({ label, hint, ...props }) {
    return (
        <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">{label}</label>
            <input {...props} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500" />
            {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
        </div>
    );
}

export default function Edit({ staff, checklist }) {
    const [expertiseInput, setExpertiseInput] = useState('');
    const [removeImage, setRemoveImage] = useState(false);
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(staff.avatarUrl);

    const { data, setData, post, processing, errors } = useForm({
        full_name: staff.fullName,
        position: staff.position ?? '',
        short_title: staff.shortTitle ?? '',
        phone: staff.phone ?? '',
        bio: staff.bio ?? '',
        expertise: staff.expertise,
        whatsapp_number: staff.whatsappNumber ?? '',
        website_url: staff.websiteUrl ?? '',
        linkedin_url: staff.linkedinHandle ?? '',
        github_url: staff.githubHandle ?? '',
        instagram_url: staff.instagramHandle ?? '',
        tiktok_url: staff.tiktokHandle ?? '',
        youtube_url: staff.youtubeHandle ?? '',
        profile_image: null,
        remove_image: false,
        services: staff.services.length ? staff.services : [{ title: '', description: '', icon: '' }],
        projects: staff.projects.length ? staff.projects : [{ title: '', description: '', project_url: '' }],
        current_password: '',
        password: '',
        password_confirm: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('portal.card.update'), { forceFormData: true, preserveScroll: true });
    }

    function addExpertise() {
        const value = expertiseInput.trim();
        if (value && !data.expertise.includes(value)) {
            setData('expertise', [...data.expertise, value]);
        }
        setExpertiseInput('');
    }

    function removeExpertise(tag) {
        setData('expertise', data.expertise.filter((t) => t !== tag));
    }

    function updateRow(field, index, key, value) {
        const rows = [...data[field]];
        rows[index] = { ...rows[index], [key]: value };
        setData(field, rows);
    }

    function addRow(field, empty) {
        setData(field, [...data[field], empty]);
    }

    function removeRow(field, index) {
        setData(field, data[field].filter((_, i) => i !== index));
    }

    function onFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            setData('profile_image', file);
            setRemoveImage(false);
            setData('remove_image', false);
            setPreview(URL.createObjectURL(file));
        }
    }

    function onRemovePhoto() {
        setData('profile_image', null);
        setData('remove_image', true);
        setRemoveImage(true);
        setPreview(null);
    }

    const socials = [
        ['linkedin_url', 'linkedin.com/in/', 'your-profile'],
        ['github_url', 'github.com/', 'username'],
        ['instagram_url', 'instagram.com/', 'username'],
        ['tiktok_url', 'tiktok.com/@', 'username'],
        ['youtube_url', 'youtube.com/@', 'channel'],
    ];

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>}>
            <Head title="Edit Profile" />

            <nav className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                <Link href={route('portal.card.show')} className="hover:underline">My Card</Link>
                <span>/</span>
                <span>Edit Profile</span>
            </nav>

            {Object.keys(errors).length > 0 && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                    {Object.values(errors).join(' — ')}
                </div>
            )}

            <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                        <h2 className="mb-4 font-semibold text-gray-800">Identity</h2>
                        <div className="mb-4 flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-600">
                                {preview ? <img src={preview} alt="" className="h-16 w-16 rounded-full object-cover" /> : staff.initials}
                            </div>
                            <div>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                                        Upload Photo
                                    </button>
                                    {preview && (
                                        <button type="button" onClick={onRemovePhoto} className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <p className="mt-1 text-xs text-gray-400">JPG, PNG or WebP · Max 5 MB</p>
                                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onFileChange} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <TextField label="Full Name" value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} />
                            <TextField label="Position / Job Title" value={data.position} onChange={(e) => setData('position', e.target.value)} />
                            <TextField label="Short Title / Tagline" value={data.short_title} onChange={(e) => setData('short_title', e.target.value)} />
                            <TextField label="Phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                        </div>
                        <div className="mt-4">
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Card URL <span className="font-normal text-gray-400">(contact admin to change)</span></label>
                            <div className="flex items-center rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                                cukrudev.com/{staff.slug}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                        <h2 className="mb-3 font-semibold text-gray-800">About</h2>
                        <label className="mb-1 block text-xs font-semibold text-gray-600">Bio ({data.bio.length}/300)</label>
                        <textarea
                            rows={4}
                            maxLength={300}
                            value={data.bio}
                            onChange={(e) => setData('bio', e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                        <h2 className="mb-1 font-semibold text-gray-800">Expertise</h2>
                        <p className="mb-3 text-xs text-gray-400">Press Enter to add · click × to remove</p>
                        <div className="mb-2 flex flex-wrap gap-1.5">
                            {data.expertise.map((tag) => (
                                <span key={tag} className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                                    {tag}
                                    <button type="button" onClick={() => removeExpertise(tag)} className="text-gray-400 hover:text-gray-700">×</button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={expertiseInput}
                            onChange={(e) => setExpertiseInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addExpertise(); } }}
                            placeholder="Add a skill…"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                        <h2 className="mb-3 font-semibold text-gray-800">Contact &amp; Socials</h2>
                        <div className="space-y-3">
                            <TextField label="WhatsApp Number" placeholder="601XXXXXXXX" value={data.whatsapp_number} onChange={(e) => setData('whatsapp_number', e.target.value)} />
                            <TextField label="Website" placeholder="https://yoursite.com" value={data.website_url} onChange={(e) => setData('website_url', e.target.value)} />
                            {socials.map(([field, prefix, placeholder]) => (
                                <TextField
                                    key={field}
                                    label={`${field.replace('_url', '').replace(/^\w/, (c) => c.toUpperCase())} (${prefix})`}
                                    placeholder={placeholder}
                                    value={data[field]}
                                    onChange={(e) => setData(field, e.target.value)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                        <h2 className="mb-1 font-semibold text-gray-800">My Services</h2>
                        <p className="mb-3 text-xs text-gray-400">What you offer to clients</p>
                        <div className="space-y-3">
                            {data.services.map((svc, i) => (
                                <div key={i} className="flex gap-2 rounded-md border border-gray-200 p-3">
                                    <input
                                        type="text" maxLength={8} placeholder="🚀" value={svc.icon || ''}
                                        onChange={(e) => updateRow('services', i, 'icon', e.target.value)}
                                        className="w-14 rounded-md border border-gray-300 px-2 py-2 text-center text-sm"
                                    />
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text" placeholder="Service name" value={svc.title || ''}
                                            onChange={(e) => updateRow('services', i, 'title', e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                        />
                                        <textarea
                                            rows={2} placeholder="What you offer…" value={svc.description || ''}
                                            onChange={(e) => updateRow('services', i, 'description', e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <button type="button" onClick={() => removeRow('services', i)} className="self-start text-gray-400 hover:text-red-600">×</button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={() => addRow('services', { title: '', description: '', icon: '' })} className="mt-3 text-sm font-medium text-amber-600 hover:underline">
                            + Add Service
                        </button>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                        <h2 className="mb-1 font-semibold text-gray-800">Featured Projects</h2>
                        <p className="mb-3 text-xs text-gray-400">Showcase your best work</p>
                        <div className="space-y-3">
                            {data.projects.map((proj, i) => (
                                <div key={i} className="flex gap-2 rounded-md border border-gray-200 p-3">
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text" placeholder="Project name" value={proj.title || ''}
                                            onChange={(e) => updateRow('projects', i, 'title', e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                        />
                                        <input
                                            type="url" placeholder="https://…" value={proj.project_url || ''}
                                            onChange={(e) => updateRow('projects', i, 'project_url', e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                        />
                                        <textarea
                                            rows={2} placeholder="Short description…" value={proj.description || ''}
                                            onChange={(e) => updateRow('projects', i, 'description', e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <button type="button" onClick={() => removeRow('projects', i)} className="self-start text-gray-400 hover:text-red-600">×</button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={() => addRow('projects', { title: '', description: '', project_url: '' })} className="mt-3 text-sm font-medium text-amber-600 hover:underline">
                            + Add Project
                        </button>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                        <h2 className="mb-1 font-semibold text-gray-800">Change Password</h2>
                        <p className="mb-3 text-xs text-gray-400">Leave blank to keep current password</p>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <TextField label="Current Password" type="password" value={data.current_password} onChange={(e) => setData('current_password', e.target.value)} />
                            </div>
                            <TextField label="New Password (min 8 chars)" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                            <TextField label="Confirm New Password" type="password" value={data.password_confirm} onChange={(e) => setData('password_confirm', e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="sticky top-6 rounded-lg border border-gray-200 bg-white p-5 text-center">
                        <div className="mb-3 text-xs font-semibold uppercase text-gray-400">Live Preview</div>
                        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-600">
                            {preview ? <img src={preview} alt="" className="h-16 w-16 rounded-full object-cover" /> : staff.initials}
                        </div>
                        <p className="font-semibold text-gray-900">{data.full_name || 'Your Name'}</p>
                        <p className="text-xs text-gray-500">{data.position || 'Team Member'}</p>
                        <p className="mt-1 font-mono text-xs text-gray-400">cukrudev.com/{staff.slug}</p>
                        <a href={`/${staff.slug}`} target="_blank" rel="noopener noreferrer" className="mt-3 block rounded-md border border-gray-300 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
                            Open Card
                        </a>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                        <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-600">Completion</span>
                            <span className="font-bold text-amber-600">{checklist.pct}%</span>
                        </div>
                        <div className="mb-3 h-2 overflow-hidden rounded-full bg-gray-100">
                            <div className="h-full rounded-full bg-amber-500" style={{ width: `${checklist.pct}%` }} />
                        </div>
                        {Object.entries(checklist.items).map(([label, done]) => (
                            <div key={label} className={`mb-1 flex items-center gap-2 rounded px-2 py-1 text-xs ${done ? 'text-green-700' : 'text-gray-400'}`}>
                                <span>{done ? '✓' : '○'}</span> {label}
                            </div>
                        ))}
                    </div>

                    <button type="submit" disabled={processing} className="w-full rounded-md bg-amber-500 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
                        {processing ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </PortalLayout>
    );
}
