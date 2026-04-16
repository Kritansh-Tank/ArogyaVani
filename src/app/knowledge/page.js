'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FaSearch, FaCircle, FaHeartbeat, FaThermometerHalf, FaBolt } from 'react-icons/fa';
import { MdHealthAndSafety, MdLocalHospital, MdShield, MdPregnantWoman, MdChildCare, MdPsychology } from 'react-icons/md';
import { medicalKnowledge } from '@/lib/medical-data';

const categories = ['All', 'condition', 'emergency', 'preventive', 'maternal_health', 'child_health', 'mental_health'];

const categoryMeta = {
    All: { label: 'All Topics', Icon: MdHealthAndSafety, color: '#06b6d4' },
    condition: { label: 'Conditions', Icon: FaHeartbeat, color: '#ef4444' },
    emergency: { label: 'Emergency', Icon: MdLocalHospital, color: '#f59e0b' },
    preventive: { label: 'Preventive', Icon: MdShield, color: '#10b981' },
    maternal_health: { label: 'Maternal', Icon: MdPregnantWoman, color: '#a855f7' },
    child_health: { label: 'Child Health', Icon: MdChildCare, color: '#06b6d4' },
    mental_health: { label: 'Mental Health', Icon: MdPsychology, color: '#8b5cf6' },
};

const triageByCategory = {
    emergency: 'emergency',
    condition: 'clinic',
    preventive: 'home',
    maternal_health: 'clinic',
    child_health: 'home',
    mental_health: 'clinic',
};

const triageConfig = {
    home: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Home Care' },
    clinic: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Visit Clinic' },
    emergency: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Emergency' },
};

export default function KnowledgePage() {
    const [activeCategory, setActiveCategory] = useState('All');

    const topics = medicalKnowledge.map((entry) => {
        const meta = categoryMeta[entry.category] || categoryMeta.condition;
        return {
            ...entry,
            Icon: meta.Icon,
            color: meta.color,
            triage: triageByCategory[entry.category] || 'clinic',
            snippet: entry.content.slice(0, 160) + (entry.content.length > 160 ? '…' : ''),
        };
    });

    const filtered = activeCategory === 'All' ? topics : topics.filter(t => t.category === activeCategory);

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
                <div className="section" style={{ paddingBottom: '3rem' }}>

                    {/* Header */}
                    <div className="section-header">
                        <span className="section-tag">Knowledge Base</span>
                        <h1 className="section-title">
                            Medical <span className="gradient-text">Knowledge Base</span>
                        </h1>
                        <p className="section-desc">
                            {topics.length}&nbsp;curated medical topics powering ArogyaVani&apos;s semantic triage engine.
                            Bilingual (EN/HI), stored as vector embeddings in Qdrant.
                        </p>
                    </div>

                    {/* Search bar (decorative) */}
                    <div style={{ maxWidth: '560px', margin: '0 auto 2rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                            <FaSearch size={16} color="var(--text-muted)" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search symptoms, conditions, first aid..."
                            readOnly
                            style={{
                                width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem',
                                background: 'var(--bg-card)', border: '1px solid var(--border)',
                                borderRadius: '999px', color: 'var(--text-primary)',
                                fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', cursor: 'pointer',
                            }}
                        />
                        <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'var(--primary-light)', fontWeight: '600' }}>
                            Powered by Qdrant
                        </div>
                    </div>

                    {/* Category chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
                        {categories.map((cat) => {
                            const meta = categoryMeta[cat];
                            const isActive = cat === activeCategory;
                            const count = cat === 'All' ? topics.length : topics.filter(t => t.category === cat).length;
                            return (
                                <span key={cat} onClick={() => setActiveCategory(cat)} style={{
                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    padding: '0.4rem 1rem',
                                    background: isActive ? 'var(--gradient-primary)' : 'var(--bg-glass)',
                                    border: `1px solid ${isActive ? 'transparent' : 'var(--border)'}`,
                                    borderRadius: '999px', fontSize: '0.82rem', fontWeight: '600',
                                    color: isActive ? '#fff' : 'var(--text-secondary)', cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}>
                                    <meta.Icon size={13} color={isActive ? '#fff' : meta.color} />
                                    {meta.label}
                                    <span style={{ fontSize: '0.72rem', opacity: 0.7 }}>({count})</span>
                                </span>
                            );
                        })}
                    </div>

                    {/* Topic cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                        {filtered.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>No topics in this category.</div>}
                        {filtered.map((topic) => {
                            const t = triageConfig[topic.triage];
                            return (
                                <div key={topic.id} className="feature-card" style={{ padding: '1.5rem', cursor: 'default' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                                                background: `${topic.color}15`, border: `1px solid ${topic.color}30`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <topic.Icon size={18} color={topic.color} />
                                            </div>
                                            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>{topic.title}</h3>
                                        </div>
                                        <span style={{
                                            display: 'flex', alignItems: 'center', gap: '0.25rem',
                                            padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem',
                                            fontWeight: '700', background: t.bg, color: t.color, flexShrink: 0, marginLeft: '0.5rem'
                                        }}>
                                            <FaCircle size={6} color={t.color} />
                                            {t.label}
                                        </span>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.55', marginBottom: '1rem' }}>
                                        {topic.snippet}
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                        {topic.tags.slice(0, 3).map((tag) => (
                                            <span key={tag} style={{
                                                padding: '0.2rem 0.6rem', background: '#f1f5f9',
                                                border: '1px solid var(--border)', borderRadius: '999px',
                                                fontSize: '0.72rem', color: 'var(--text-muted)'
                                            }}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Qdrant callout */}
                    <div style={{
                        marginTop: '3rem', padding: '2rem', borderRadius: 'var(--radius)',
                        background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(16,185,129,0.08))',
                        border: '1px solid var(--border)', textAlign: 'center'
                    }}>
                        <FaBolt size={28} color="#06b6d4" style={{ marginBottom: '0.75rem' }} />
                        <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Semantic Search via Qdrant</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '560px', margin: '0 auto' }}>
                            Each topic is embedded using <strong style={{ color: 'var(--primary-light)' }}>Jina AI</strong> (768 dims)
                            and stored in <strong style={{ color: 'var(--primary-light)' }}>Qdrant Cloud</strong> with cosine similarity.
                            When you speak, your query is embedded and matched in real-time.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
