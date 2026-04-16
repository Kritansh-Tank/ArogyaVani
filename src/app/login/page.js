'use client';
import { useState } from 'react';
import { MdHealthAndSafety } from 'react-icons/md';
import { FaEnvelope, FaLock, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

export default function LoginPage() {
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/auth/${mode === 'login' ? 'login' : 'signup'}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Something went wrong');
            // Store email in localStorage for display
            localStorage.setItem('user_email', email);
            // Hard redirect so the auth_token cookie is included in the next request
            window.location.href = '/assistant';
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{
                width: '100%', maxWidth: '420px',
                background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px)',
                border: '1px solid rgba(6,182,212,0.2)', borderRadius: '20px',
                padding: '2.5rem', boxShadow: '0 8px 40px rgba(6,182,212,0.1)',
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <MdHealthAndSafety size={44} color="#06b6d4" />
                    <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '0.5rem' }}>ArogyaVani</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
                    </div>
                </div>

                {/* Tab toggle */}
                <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '4px', marginBottom: '1.5rem' }}>
                    {['login', 'signup'].map((m) => (
                        <button key={m} onClick={() => { setMode(m); setError(''); }}
                            style={{
                                flex: 1, padding: '0.6rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s',
                                background: mode === m ? '#fff' : 'transparent',
                                color: mode === m ? '#06b6d4' : 'var(--text-secondary)',
                                boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                            }}>
                            {m === 'login' ? 'Sign In' : 'Sign Up'}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <FaEnvelope style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={14} />
                        <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required
                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid rgba(6,182,212,0.25)', borderRadius: '10px', background: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', outline: 'none', color: 'var(--text-primary)' }} />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <FaLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={14} />
                        <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid rgba(6,182,212,0.25)', borderRadius: '10px', background: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', outline: 'none', color: 'var(--text-primary)' }} />
                    </div>

                    {error && (
                        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '0.6rem 0.9rem', color: '#ef4444', fontSize: '0.85rem' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading}
                        style={{
                            padding: '0.85rem', borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #06b6d4, #10b981)',
                            color: '#fff', fontWeight: '700', fontSize: '1rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        }}>
                        {mode === 'login' ? <FaSignInAlt size={16} /> : <FaUserPlus size={16} />}
                        {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    Voice triage for everyone · ArogyaVani 2026
                </div>
            </div>
        </div>
    );
}
