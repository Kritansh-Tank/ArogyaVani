import Link from 'next/link';
import { FaSearch, FaCircle, FaHeartbeat, FaThermometerHalf, FaBolt } from 'react-icons/fa';
import { MdHealthAndSafety, MdLocalHospital, MdShield, MdPregnantWoman, MdChildCare, MdPsychology } from 'react-icons/md';

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

const triageConfig = {
    home: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Home Care', Icon: FaCircle },
    clinic: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Visit Clinic', Icon: FaCircle },
    emergency: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Emergency', Icon: FaCircle },
};

const topics = [
    { title: 'Common Cold', category: 'condition', tags: ['runny nose', 'sneezing'], triage: 'home', snippet: 'Rest, drink warm fluids, steam inhalation for congestion. See doctor if symptoms last more than 10 days.', Icon: FaThermometerHalf, color: '#06b6d4' },
    { title: 'Fever Management', category: 'condition', tags: ['temperature', 'body heat'], triage: 'clinic', snippet: 'Paracetamol 500mg every 6 hours. Seek help immediately if fever exceeds 103°F or lasts 3+ days.', Icon: FaThermometerHalf, color: '#ef4444' },
    { title: 'Heart Attack Signs', category: 'emergency', tags: ['chest pain', 'breathlessness'], triage: 'emergency', snippet: 'Call 108 immediately. Chest pressure, arm/jaw pain, cold sweat — every minute counts.', Icon: FaHeartbeat, color: '#ef4444' },
    { title: 'Diabetes Management', category: 'condition', tags: ['blood sugar', 'insulin'], triage: 'clinic', snippet: 'Control with diet, exercise and medication. Whole grains, veggies, lean protein. No sugary drinks.', Icon: MdHealthAndSafety, color: '#a855f7' },
    { title: 'High Blood Pressure', category: 'condition', tags: ['BP', 'hypertension'], triage: 'clinic', snippet: 'Reduce salt to <5g/day. Exercise daily. Take medications without skipping.', Icon: FaHeartbeat, color: '#f59e0b' },
    { title: 'Snake Bite First Aid', category: 'emergency', tags: ['venom', 'first aid'], triage: 'emergency', snippet: 'Keep calm, immobilize limb below heart. Rush to hospital immediately. Anti-venom available.', Icon: MdLocalHospital, color: '#ef4444' },
    { title: 'Pregnancy Care', category: 'maternal_health', tags: ['prenatal', 'iron'], triage: 'clinic', snippet: 'Iron + folic acid daily. 4 antenatal visits minimum. Watch for danger signs like severe headache.', Icon: MdPregnantWoman, color: '#a855f7' },
    { title: 'Child Vaccination', category: 'child_health', tags: ['BCG', 'DPT', 'OPV'], triage: 'home', snippet: 'BCG at birth, DPT at 6/10/14 weeks, Measles at 9 months. Free at government health centers.', Icon: MdChildCare, color: '#06b6d4' },
    { title: 'Mental Health', category: 'mental_health', tags: ['anxiety', 'depression'], triage: 'clinic', snippet: 'Exercise, deep breathing, talk to trusted people. Helpline: iCALL 9152987821.', Icon: MdPsychology, color: '#8b5cf6' },
    { title: 'Diarrhea', category: 'emergency', tags: ['ORS', 'loose motion'], triage: 'clinic', snippet: 'Drink ORS frequently. Continue light food. Seek help for blood in stool or severe vomiting.', Icon: MdLocalHospital, color: '#f59e0b' },
    { title: 'Burns First Aid', category: 'emergency', tags: ['fire', 'burn'], triage: 'clinic', snippet: 'Cool under running water 10 min. No ice/toothpaste. Large burns — go to hospital immediately.', Icon: FaBolt, color: '#ef4444' },
    { title: 'Malaria Prevention', category: 'preventive', tags: ['mosquito', 'fever chills'], triage: 'clinic', snippet: 'Mosquito nets + repellent. Blood test if fever with chills. Early treatment is crucial.', Icon: MdShield, color: '#10b981' },
    { title: 'Asthma', category: 'condition', tags: ['inhaler', 'wheeze'], triage: 'clinic', snippet: 'Always carry inhaler. Avoid triggers. Use controller medication daily even when feeling well.', Icon: FaHeartbeat, color: '#06b6d4' },
    { title: 'Hygiene & Sanitation', category: 'preventive', tags: ['handwash', 'clean water'], triage: 'home', snippet: 'Boil or filter water. Wash hands with soap before eating and after toilet.', Icon: MdShield, color: '#10b981' },
    { title: 'Tuberculosis (TB)', category: 'condition', tags: ['cough', 'night sweats'], triage: 'clinic', snippet: 'Curable with 6-month DOTS treatment — free at government hospitals. Complete the full course.', Icon: MdHealthAndSafety, color: '#a855f7' },
    { title: 'Dengue Care', category: 'condition', tags: ['platelet', 'mosquito'], triage: 'clinic', snippet: 'Paracetamol only (NOT aspirin). Monitor platelet count. Hospital if bleeding or severe pain.', Icon: FaThermometerHalf, color: '#f59e0b' },
    { title: 'Heatstroke', category: 'emergency', tags: ['sun', 'loo'], triage: 'emergency', snippet: 'Move to shade, cool with water, call 108 immediately. Stay hydrated in hot weather.', Icon: FaBolt, color: '#ef4444' },
    { title: 'Nutrition Basics', category: 'preventive', tags: ['diet', 'balanced food'], triage: 'home', snippet: 'Eat a rainbow of fruits & vegetables. 8 glasses water daily. Avoid junk food.', Icon: MdShield, color: '#10b981' },
];

export default function KnowledgePage() {
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

                    {/* Search bar */}
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
                            const isActive = cat === 'All';
                            return (
                                <span key={cat} style={{
                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    padding: '0.4rem 1rem',
                                    background: isActive ? 'var(--gradient-primary)' : 'var(--bg-glass)',
                                    border: `1px solid ${isActive ? 'transparent' : 'var(--border)'}`,
                                    borderRadius: '999px', fontSize: '0.82rem', fontWeight: '600',
                                    color: isActive ? '#fff' : 'var(--text-secondary)', cursor: 'pointer',
                                }}>
                                    <meta.Icon size={13} color={isActive ? '#fff' : meta.color} />
                                    {meta.label}
                                </span>
                            );
                        })}
                    </div>

                    {/* Topic cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                        {topics.map((topic, i) => {
                            const t = triageConfig[topic.triage];
                            return (
                                <div key={i} className="feature-card" style={{ padding: '1.5rem', cursor: 'default' }}>
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
                                        {topic.tags.slice(0, 2).map((tag) => (
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
                            Each topic is embedded using <strong style={{ color: 'var(--primary-light)' }}>Ollama nomic-embed-text</strong> (768 dims)
                            and stored in <strong style={{ color: 'var(--primary-light)' }}>Qdrant Cloud</strong> with cosine similarity.
                            When you speak, your query is embedded and matched in real-time.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
