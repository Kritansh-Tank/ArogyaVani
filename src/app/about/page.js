import Link from 'next/link';
import {
    FaMicrophone, FaFileAlt, FaBrain, FaDatabase,
    FaSearch, FaVolumeUp, FaRoute, FaBolt,
} from 'react-icons/fa';
import { SiOpenai } from 'react-icons/si';
import { MdHealthAndSafety } from 'react-icons/md';

const techStack = [
    { name: 'Vapi', role: 'Voice AI Platform', desc: 'Real-time voice conversations with configurable AI assistants, function calling, and multilingual TTS.', Icon: FaMicrophone, color: '#06b6d4', link: 'https://vapi.ai' },
    { name: 'Qdrant', role: 'Vector Database', desc: 'Cloud-hosted vector DB for semantic search. Stores 30+ medical entries as 768-dim embeddings with cosine similarity.', Icon: FaDatabase, color: '#a855f7', link: 'https://qdrant.tech' },
    { name: 'Jina AI', role: 'Hosted Embeddings', desc: 'Cloud-hosted embedding API generating 768-dim vectors for semantic medical search — compatible with the Qdrant collection with no re-seeding.', Icon: FaBrain, color: '#10b981', link: 'https://jina.ai' },
    { name: 'Next.js 16', role: 'Full-Stack Framework', desc: 'App Router with server-side API routes for Qdrant search, Vapi webhook handling, and knowledge base seeding.', Icon: FaBolt, color: '#f59e0b', link: 'https://nextjs.org' },
    { name: 'GPT-4o mini', role: 'Language Model', desc: 'Powers the conversational triage reasoning — interprets symptoms, decides triage level, and generates spoken responses via Vapi.', Icon: SiOpenai, color: '#ef4444', link: 'https://openai.com' },
    { name: 'ElevenLabs', role: 'Voice Synthesis', desc: 'High-quality multilingual TTS via Vapi integration for natural-sounding English and Hindi voice responses.', Icon: FaVolumeUp, color: '#06b6d4', link: 'https://elevenlabs.io' },
];

const problemStats = [
    { value: '250M+', label: 'Indians with limited literacy who cannot access written health info' },
    { value: '60%', label: 'Primary health centers in rural India that lack doctors' },
    { value: '70%', label: 'Health queries that can be safely resolved without clinic visits' },
    { value: '22+', label: 'Official languages in India — a major barrier to written healthcare' },
];

const flowSteps = [
    { Icon: FaMicrophone, label: 'User Speaks', sub: 'via Vapi', color: '#06b6d4' },
    { Icon: FaFileAlt, label: 'Transcribed', sub: 'Vapi STT', color: '#8b5cf6' },
    { Icon: SiOpenai, label: 'GPT-4o mini', sub: 'function calling', color: '#10b981' },
    { Icon: FaBrain, label: 'Jina AI Embeds', sub: 'jina-embeddings-v2-base-en', color: '#f59e0b' },
    { Icon: FaDatabase, label: 'Qdrant Search', sub: 'cosine similarity', color: '#a855f7' },
    { Icon: FaSearch, label: 'Context Retrieved', sub: '30 medical topics', color: '#06b6d4' },
    { Icon: FaRoute, label: 'Triage Decision', sub: '🟢 🟡 🔴', color: '#ef4444' },
    { Icon: FaVolumeUp, label: 'Spoken Response', sub: 'ElevenLabs TTS', color: '#10b981' },
];

// Arrow SVG component
function Arrow() {
    return (
        <svg width="28" height="16" viewBox="0 0 28 16" fill="none" style={{ flexShrink: 0 }}>
            <path d="M0 8H24M24 8L17 1M24 8L17 15" stroke="url(#ag)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
                <linearGradient id="ag" x1="0" y1="8" x2="28" y2="8" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#06b6d4" />
                    <stop offset="1" stopColor="#10b981" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export default function AboutPage() {
    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link href="/" className="navbar-logo">
                        <MdHealthAndSafety size={24} color="#06b6d4" style={{ marginRight: '0.4rem' }} />
                        ArogyaVani
                    </Link>
                    <ul className="navbar-links">
                        <li><Link href="/dashboard">Dashboard</Link></li>
                        <li><Link href="/knowledge">Knowledge Base</Link></li>
                        <li><Link href="/about">About</Link></li>
                        <li>
                            <Link href="/assistant" className="btn btn-primary" style={{ color: '#fff' }}>
                                Try Voice Triage →
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>

            <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>

                {/* Hero */}
                <div className="section" style={{ textAlign: 'center', paddingBottom: '2rem' }}>
                    <span className="section-tag">HackBLR 2026 · Track 3 — Accessibility &amp; Societal Impact</span>
                    <h1 className="section-title" style={{ marginTop: '1rem' }}>
                        About <span className="gradient-text">ArogyaVani</span>
                    </h1>
                    <p className="section-desc" style={{ margin: '1rem auto 0' }}>
                        A voice-first, multilingual triage assistant that collects symptoms, searches a curated
                        medical knowledge base, and routes patients — no literacy, smartphone skills, or internet knowledge required.
                    </p>
                </div>

                {/* Problem Stats */}
                <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '3rem 2rem' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <h2 style={{ textAlign: 'center', fontWeight: '800', fontSize: '1.5rem', marginBottom: '2rem' }}>
                            The Problem We&apos;re Solving
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                            {problemStats.map((s, i) => (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <div className="stat-value">{s.value}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: '1.5' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Architecture Flow — fully horizontal */}
                <div className="section" style={{ paddingBottom: '2rem' }}>
                    <div className="section-header">
                        <span className="section-tag">Architecture</span>
                        <h2 className="section-title">How It All <span className="gradient-text">Connects</span></h2>
                        <p className="section-desc">End-to-end request flow from voice input to triage decision.</p>
                    </div>

                    {/* Full-width horizontal row — no scroll */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        padding: '1.75rem 1.25rem',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        backdropFilter: 'blur(10px)',
                        width: '100%',
                        boxSizing: 'border-box',
                    }}>
                        {flowSteps.map((step, i) => {
                            const { Icon, label, sub, color } = step;
                            return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                                    {/* Step node */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '0.4rem', minWidth: 0 }}>
                                        <div style={{
                                            width: '48px', height: '48px', borderRadius: '14px',
                                            background: `${color}15`,
                                            border: `1.5px solid ${color}50`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: `0 0 14px ${color}20`,
                                            flexShrink: 0,
                                        }}>
                                            <Icon size={20} color={color} />
                                        </div>
                                        <div style={{ fontSize: '0.66rem', fontWeight: '700', color: 'var(--text-primary)', textAlign: 'center', lineHeight: '1.3', padding: '0 2px' }}>{label}</div>
                                        <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.2' }}>{sub}</div>
                                    </div>
                                    {/* Arrow */}
                                    {i < flowSteps.length - 1 && (
                                        <div style={{ color: '#06b6d4', fontSize: '1.1rem', flexShrink: 0, opacity: 0.7, marginBottom: '1.4rem', padding: '0 2px' }}>›</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Tech Stack */}
                <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', padding: '4rem 2rem' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div className="section-header">
                            <span className="section-tag">Tech Stack</span>
                            <h2 className="section-title">Built With <span className="gradient-text">Best-in-Class</span> Tools</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
                            {techStack.map((tech, i) => (
                                <a
                                    key={i}
                                    href={tech.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="feature-card"
                                    style={{ padding: '1.5rem', textDecoration: 'none', display: 'block' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                                        <div style={{
                                            width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
                                            background: `${tech.color}20`, border: `1px solid ${tech.color}40`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}><tech.Icon size={22} color={tech.color} /></div>
                                        <div>
                                            <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>{tech.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: tech.color, fontWeight: '600' }}>{tech.role}</div>
                                        </div>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.55' }}>{tech.desc}</p>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Problem Statement Match */}
                <div className="section">
                    <div className="section-header">
                        <span className="section-tag">Problem Statement Alignment</span>
                        <h2 className="section-title">How We <span className="gradient-text">Fit</span> the Challenge</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        {[
                            { req: 'Voice-driven triage', sol: 'Vapi starts a conversation by asking symptom, duration, and age — classic triage intake flow.' },
                            { req: 'Symptom checker', sol: 'Qdrant semantic search over 30 medical topics provides contextual symptom information.' },
                            { req: 'Route patients', sol: '🟢 Home / 🟡 Clinic / 🔴 Emergency routing on every response — just like a real triage nurse.' },
                            { req: 'Multilingual access', sol: 'Full English and Hindi support — spoken by 600M+ people with low digital literacy.' },
                            { req: 'Drug databases', sol: 'Knowledge base covers medications, dosages, and when to avoid certain drugs (e.g., no aspirin for dengue).' },
                            { req: 'Accessibility', sol: 'Zero literacy required. No typing, no reading. Just speak — and get a spoken triage decision.' },
                        ].map((item, i) => (
                            <div key={i} className="feature-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <div>
                                    <div style={{ fontWeight: '700', color: 'var(--primary-light)', fontSize: '0.9rem', marginBottom: '0.3rem' }}>{item.req}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.55' }}>{item.sol}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                        <Link href="/assistant" className="btn btn-primary btn-lg">
                            <FaMicrophone style={{ marginRight: '0.5rem' }} /> Try the Voice Triage Demo
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
