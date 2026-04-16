'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
    FaStethoscope, FaCheckCircle, FaHospitalAlt, FaAmbulance,
    FaChartBar, FaClock, FaCircle, FaSignOutAlt,
} from 'react-icons/fa';
import { MdHealthAndSafety } from 'react-icons/md';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const [stats, setStats] = useState({ total: 0, home: 0, clinic: 0, emergency: 0 });
    const [recent, setRecent] = useState([]);
    const [topSymptoms, setTopSymptoms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState('');
    const router = useRouter();

    useEffect(() => {
        const load = async () => {
            setUserEmail(localStorage.getItem('user_email') || '');

            const { data: consultations } = await supabase
                .from('consultations')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (!consultations) return;

            const total = consultations.length;
            const home = consultations.filter(c => c.triage_level === 'home').length;
            const clinic = consultations.filter(c => c.triage_level === 'clinic').length;
            const emergency = consultations.filter(c => c.triage_level === 'emergency').length;
            setStats({
                total,
                home: total ? Math.round(home / total * 100) : 0,
                clinic: total ? Math.round(clinic / total * 100) : 0,
                emergency: total ? Math.round(emergency / total * 100) : 0,
            });

            setRecent(consultations.slice(0, 6).map(c => ({
                id: c.id.slice(0, 5).toUpperCase(),
                symptom: c.symptoms?.slice(0, 50) || 'Unknown',
                triage: c.triage_level,
                lang: c.language === 'hi' ? 'HI' : 'EN',
                time: new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            })));

            // Word frequency for top symptoms
            const wordFreq = {};
            const stopWords = new Set(['the', 'and', 'for', 'with', 'has', 'had', 'have', 'that', 'this', 'from', 'been', 'are', 'was', 'days', 'day', 'old', 'age']);
            consultations.forEach(c => {
                (c.symptoms || '').toLowerCase().split(/\W+/).filter(w => w.length > 3 && !stopWords.has(w)).forEach(w => {
                    wordFreq[w] = (wordFreq[w] || 0) + 1;
                });
            });
            const sorted = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 6);
            const maxCount = sorted[0]?.[1] || 1;
            setTopSymptoms(sorted.map(([word, count]) => ({
                symptom: word.charAt(0).toUpperCase() + word.slice(1),
                count,
                pct: Math.round(count / maxCount * 100),
            })));

            setLoading(false);
        };
        load();
    }, []);

    const signOut = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        localStorage.removeItem('user_email');
        router.push('/login');
    };

    const triageConfig = {
        home: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Home Care' },
        clinic: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Visit Clinic' },
        emergency: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Emergency' },
    };

    const statCards = [
        { label: 'Total Consultations', value: stats.total, Icon: FaStethoscope, color: '#06b6d4', trend: 'All time' },
        { label: 'Home Care Advised', value: `${stats.home}%`, Icon: FaCheckCircle, color: '#10b981', trend: `${Math.round(stats.total * stats.home / 100)} cases` },
        { label: 'Clinic Referrals', value: `${stats.clinic}%`, Icon: FaHospitalAlt, color: '#f59e0b', trend: `${Math.round(stats.total * stats.clinic / 100)} cases` },
        { label: 'Emergency Routed', value: `${stats.emergency}%`, Icon: FaAmbulance, color: '#ef4444', trend: `${Math.round(stats.total * stats.emergency / 100)} cases` },
    ];

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
                        {userEmail && (
                            <li>
                                <button onClick={signOut} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                                    <FaSignOutAlt size={13} /> Sign Out
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>

            <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
                <div className="section" style={{ paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <div>
                            <span className="section-tag">Live Analytics</span>
                            <h1 className="section-title" style={{ marginTop: '0.5rem' }}>
                                Triage <span className="gradient-text">Dashboard</span>
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                Real-time overview of voice triage consultations
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '0.5rem 1rem', borderRadius: '999px', color: '#10b981', fontSize: '0.85rem', fontWeight: '600' }}>
                            <FaCircle size={8} color="#10b981" style={{ animation: 'pulse-dot 1.5s infinite' }} /> Live
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading real-time data...</div>
                    ) : stats.total === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                            <FaStethoscope size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                            <div>No consultations yet. <Link href="/assistant" style={{ color: '#06b6d4' }}>Start a voice triage</Link> to see data here.</div>
                        </div>
                    ) : (
                        <>
                            {/* Stat Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
                                {statCards.map(({ label, value, Icon, color, trend }, i) => (
                                    <div key={i} className="feature-card" style={{ padding: '1.5rem' }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                                            <Icon size={20} color={color} />
                                        </div>
                                        <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)' }}>{value}</div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{label}</div>
                                        <div style={{ color: 'var(--primary-light)', fontSize: '0.78rem', marginTop: '0.5rem', fontWeight: '600' }}>{trend}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Two columns */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '1.5rem', alignItems: 'start' }}>
                                {/* Top Symptoms */}
                                <div className="feature-card" style={{ padding: '1.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                                        <FaChartBar size={16} color="#06b6d4" />
                                        <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Top Keywords</h3>
                                    </div>
                                    {topSymptoms.length === 0 ? (
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No data yet</div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {topSymptoms.map((s, i) => (
                                                <div key={i}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                                                        <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{s.symptom}</span>
                                                        <span style={{ color: 'var(--text-secondary)' }}>{s.count}</span>
                                                    </div>
                                                    <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                                                        <div style={{ width: `${s.pct}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #10b981)', borderRadius: '999px' }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Recent Consultations */}
                                <div className="feature-card" style={{ padding: '1.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                                        <FaClock size={16} color="#06b6d4" />
                                        <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Recent Consultations</h3>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {recent.map((c) => {
                                            const t = triageConfig[c.triage] || triageConfig.home;
                                            return (
                                                <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(248,250,252,0.8)', border: '1px solid var(--border)', borderRadius: '10px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'monospace', flexShrink: 0 }}>{c.id}</span>
                                                        <span style={{ padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '700', background: 'var(--bg-glass)', border: '1px solid var(--border)', color: 'var(--primary-light)', flexShrink: 0 }}>{c.lang}</span>
                                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.symptom}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '700', background: t.bg, color: t.color }}>
                                                            <FaCircle size={6} color={t.color} /> {t.label}
                                                        </span>
                                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{c.time}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Distribution Bar */}
                            <div className="feature-card" style={{ padding: '1.75rem', marginTop: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                                    <FaChartBar size={16} color="#06b6d4" />
                                    <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Triage Distribution</h3>
                                </div>
                                <div style={{ display: 'flex', borderRadius: '12px', overflow: 'hidden', height: '32px' }}>
                                    {stats.home > 0 && <div style={{ width: `${stats.home}%`, background: 'linear-gradient(90deg, #059669, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700', color: '#fff', gap: '0.4rem' }}><FaCheckCircle size={12} /> {stats.home}% Home</div>}
                                    {stats.clinic > 0 && <div style={{ width: `${stats.clinic}%`, background: 'linear-gradient(90deg, #d97706, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700', color: '#fff', gap: '0.4rem' }}><FaHospitalAlt size={12} /> {stats.clinic}%</div>}
                                    {stats.emergency > 0 && <div style={{ width: `${stats.emergency}%`, background: 'linear-gradient(90deg, #dc2626, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700', color: '#fff' }}><FaAmbulance size={12} /></div>}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
