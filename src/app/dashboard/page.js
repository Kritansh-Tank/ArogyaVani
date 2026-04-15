import Link from 'next/link';
import {
    FaStethoscope, FaCheckCircle, FaHospitalAlt, FaAmbulance,
    FaChartBar, FaClock, FaCircle,
} from 'react-icons/fa';
import { MdHealthAndSafety } from 'react-icons/md';

const stats = [
    { label: 'Total Consultations', value: '1,247', Icon: FaStethoscope, color: '#06b6d4', trend: '+12% today' },
    { label: 'Home Care Advised', value: '68%', Icon: FaCheckCircle, color: '#10b981', trend: '847 cases' },
    { label: 'Clinic Referrals', value: '24%', Icon: FaHospitalAlt, color: '#f59e0b', trend: '299 cases' },
    { label: 'Emergency Routed', value: '8%', Icon: FaAmbulance, color: '#ef4444', trend: '101 cases' },
];

const topSymptoms = [
    { symptom: 'Fever', count: 312, pct: 85 },
    { symptom: 'Cough', count: 198, pct: 65 },
    { symptom: 'Headache', count: 167, pct: 55 },
    { symptom: 'Stomach Pain', count: 143, pct: 46 },
    { symptom: 'Body Ache', count: 98, pct: 32 },
    { symptom: 'Diarrhea', count: 87, pct: 28 },
];

const recentConsultations = [
    { id: 'C1247', symptom: 'High fever 3 days, age 45', triage: 'emergency', lang: 'EN', time: '2 min ago' },
    { id: 'C1246', symptom: '2 दिन से खांसी, उम्र 28', triage: 'clinic', lang: 'HI', time: '7 min ago' },
    { id: 'C1245', symptom: 'Mild cold and runny nose, age 22', triage: 'home', lang: 'EN', time: '15 min ago' },
    { id: 'C1244', symptom: 'सिरदर्द, उम्र 35', triage: 'home', lang: 'HI', time: '23 min ago' },
    { id: 'C1243', symptom: 'Chest pain and breathlessness, age 60', triage: 'emergency', lang: 'EN', time: '31 min ago' },
    { id: 'C1242', symptom: 'बुखार और ठंड लगना, उम्र 8', triage: 'clinic', lang: 'HI', time: '45 min ago' },
];

const triageConfig = {
    home: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Home Care' },
    clinic: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Visit Clinic' },
    emergency: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Emergency' },
};

export default function DashboardPage() {
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

            <div style={{ paddingTop: '5rem', minHeight: '100vh', background: 'var(--bg-primary)' }}>
                <div className="section" style={{ paddingBottom: '1rem' }}>

                    {/* Header */}
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
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                            padding: '0.5rem 1rem', borderRadius: '999px',
                            color: '#10b981', fontSize: '0.85rem', fontWeight: '600'
                        }}>
                            <FaCircle size={8} color="#10b981" style={{ animation: 'pulse-dot 1.5s infinite' }} />
                            Live
                        </div>
                    </div>

                    {/* Stat Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
                        {stats.map(({ label, value, Icon, color, trend }, i) => (
                            <div key={i} className="feature-card" style={{ padding: '1.5rem' }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '12px',
                                    background: `${color}15`, border: `1px solid ${color}30`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '0.75rem',
                                }}>
                                    <Icon size={20} color={color} />
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)' }}>{value}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{label}</div>
                                <div style={{ color: 'var(--primary-light)', fontSize: '0.78rem', marginTop: '0.5rem', fontWeight: '600' }}>{trend}</div>
                            </div>
                        ))}
                    </div>

                    {/* Two column */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '1.5rem', alignItems: 'start' }}>

                        {/* Top Symptoms */}
                        <div className="feature-card" style={{ padding: '1.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                                <FaChartBar size={16} color="#06b6d4" />
                                <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Top Reported Symptoms</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {topSymptoms.map((s, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                                            <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{s.symptom}</span>
                                            <span style={{ color: 'var(--text-secondary)' }}>{s.count}</span>
                                        </div>
                                        <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${s.pct}%`, height: '100%',
                                                background: 'linear-gradient(90deg, #06b6d4, #10b981)',
                                                borderRadius: '999px',
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Consultations */}
                        <div className="feature-card" style={{ padding: '1.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                                <FaClock size={16} color="#06b6d4" />
                                <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Recent Consultations</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {recentConsultations.map((c) => {
                                    const t = triageConfig[c.triage];
                                    return (
                                        <div key={c.id} style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '0.75rem 1rem', background: '#f8fafc',
                                            border: '1px solid var(--border)', borderRadius: '10px',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'monospace', flexShrink: 0 }}>{c.id}</span>
                                                <span style={{
                                                    padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.7rem',
                                                    fontWeight: '700', background: 'var(--bg-glass)',
                                                    border: '1px solid var(--border)', color: 'var(--primary-light)', flexShrink: 0
                                                }}>{c.lang}</span>
                                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {c.symptom}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                                                <span style={{
                                                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                                                    padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem',
                                                    fontWeight: '700', background: t.bg, color: t.color
                                                }}>
                                                    <FaCircle size={6} color={t.color} />
                                                    {t.label}
                                                </span>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{c.time}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Triage Distribution Bar */}
                    <div className="feature-card" style={{ padding: '1.75rem', marginTop: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                            <FaChartBar size={16} color="#06b6d4" />
                            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Triage Distribution</h3>
                        </div>
                        <div style={{ display: 'flex', borderRadius: '12px', overflow: 'hidden', height: '32px' }}>
                            <div style={{ width: '68%', background: 'linear-gradient(90deg, #059669, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700', color: '#fff', gap: '0.4rem' }}>
                                <FaCheckCircle size={12} /> 68% Home Care
                            </div>
                            <div style={{ width: '24%', background: 'linear-gradient(90deg, #d97706, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700', color: '#fff', gap: '0.4rem' }}>
                                <FaHospitalAlt size={12} /> 24%
                            </div>
                            <div style={{ width: '8%', background: 'linear-gradient(90deg, #dc2626, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700', color: '#fff' }}>
                                <FaAmbulance size={12} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            <span>847 patients safely managed at home</span>
                            <span>299 directed to clinics</span>
                            <span>101 sent to emergency</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
