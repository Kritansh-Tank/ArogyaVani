'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useVapi } from '@/hooks/useVapi';
import { FaMicrophone, FaStop, FaHourglass, FaCalendarAlt } from 'react-icons/fa';
import { MdHealthAndSafety } from 'react-icons/md';
import AppointmentModal from '@/components/AppointmentModal';

export default function AssistantPage() {
    const [language, setLanguage] = useState('en');
    const { callStatus, speechStatus, transcript, error, toggleCall } = useVapi();
    const transcriptEndRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [lastConsultationId, setLastConsultationId] = useState(null);
    const [lastTriageLevel, setLastTriageLevel] = useState('clinic');
    const [lastSymptoms, setLastSymptoms] = useState('');
    const [triageResult, setTriageResult] = useState(null); // shown in transcript after call
    const prevStatusRef = useRef('idle');

    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);

    // Show appointment modal when call ends
    useEffect(() => {
        if (prevStatusRef.current === 'active' && callStatus === 'idle') {
            // Parse triage level from transcript
            const allText = transcript.map(m => m.text).join(' ').toLowerCase();
            let triage = 'clinic';
            if (allText.includes('emergency') || allText.includes('🔴')) triage = 'emergency';
            else if (allText.includes('home care') || allText.includes('🟢') || allText.includes('home')) triage = 'home';

            const symptoms = transcript.find(m => m.role === 'user')?.text || '';
            setLastTriageLevel(triage);
            setLastSymptoms(symptoms);
            setTriageResult(triage); // show banner in transcript
            // Fetch latest consultation ID from Supabase
            fetch('/api/consultations/latest')
                .then(r => r.json())
                .then(d => { if (d.id) setLastConsultationId(d.id); })
                .catch(() => { });

            if (triage !== 'home') {
                setTimeout(() => setShowModal(true), 1200);
            }
        }
        prevStatusRef.current = callStatus;
    }, [callStatus]);

    const isActive = callStatus === 'active';
    const isConnecting = callStatus === 'connecting';

    const getStatusText = () => {
        if (isConnecting) return language === 'hi' ? 'कनेक्ट हो रहा है...' : 'Connecting...';
        if (!isActive) return language === 'hi' ? 'बात करने के लिए दबाएं' : 'Tap to speak';
        if (speechStatus === 'listening') return language === 'hi' ? 'सुन रहा हूं...' : 'Listening...';
        if (speechStatus === 'speaking') return language === 'hi' ? 'बोल रहा हूं...' : 'Speaking...';
        return language === 'hi' ? 'जुड़ा हुआ है' : 'Connected';
    };

    const getStatusDotClass = () => {
        if (isConnecting) return '';
        if (!isActive) return 'ready';
        if (speechStatus === 'listening') return 'listening';
        if (speechStatus === 'speaking') return 'speaking';
        return 'ready';
    };

    const waveformBars = Array.from({ length: 12 }, (_, i) => i);
    const VoiceIcon = isConnecting ? FaHourglass : isActive ? FaStop : FaMicrophone;

    return (
        <div className="assistant-page" style={{ minHeight: '100vh', background: 'transparent' }}>
            {/* Header */}
            <header className="assistant-header">
                <Link href="/" className="assistant-back">
                    ← {language === 'hi' ? 'वापस' : 'Back'}
                </Link>
                <h1 className="assistant-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MdHealthAndSafety size={26} color="#06b6d4" />
                    {language === 'hi' ? 'आरोग्यवाणी' : 'ArogyaVani'}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="lang-toggle">
                        <button className={`lang-btn ${language === 'en' ? 'active' : ''}`} onClick={() => setLanguage('en')} disabled={isActive || isConnecting}>EN</button>
                        <button className={`lang-btn ${language === 'hi' ? 'active' : ''}`} onClick={() => setLanguage('hi')} disabled={isActive || isConnecting}>हिं</button>
                    </div>
                    <button onClick={() => setShowModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(6,182,212,0.3)', background: 'rgba(6,182,212,0.08)', color: '#06b6d4', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600' }}>
                        <FaCalendarAlt size={12} /> Book
                    </button>
                </div>
            </header>

            {/* Main */}
            <main className="assistant-main">
                <div className="voice-section">
                    <div className="voice-button-wrapper">
                        <div className={`voice-rings ${isActive ? 'active' : ''}`}>
                            <div className="voice-ring" />
                            <div className="voice-ring" />
                            <div className="voice-ring" />
                        </div>
                        <button className={`voice-button ${isActive ? 'active' : ''}`} onClick={() => toggleCall(language)} disabled={isConnecting} id="voice-button">
                            <VoiceIcon size={32} color={isActive ? '#ff0000' : '#fff'} />
                        </button>
                    </div>

                    <div className={`waveform ${isActive ? 'active' : ''}`}>
                        {waveformBars.map((i) => <div key={i} className="waveform-bar" />)}
                    </div>

                    <div className="voice-status">
                        <span className={`status-dot ${getStatusDotClass()}`} />
                        {getStatusText()}
                    </div>

                    <p className="voice-hint">
                        {language === 'hi'
                            ? '💡 बताएं: लक्षण, कितने समय से है, और उम्र — जैसे \"मुझे 2 दिन से बुखार है, मैं 35 साल का हूं\"'
                            : '💡 Describe your symptom, duration & age — e.g. "I have had a fever for 2 days, I am 35 years old"'}
                    </p>

                    {error && (
                        <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '0.75rem 1.25rem', fontSize: '0.9rem', maxWidth: '500px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}
                </div>

                {/* Transcript */}
                <div className="transcript-section">
                    <div className="transcript-header">
                        <span className="transcript-title">
                            {language === 'hi' ? '📝 बातचीत' : '📝 Conversation'}
                        </span>
                    </div>
                    <div className="transcript-box">
                        {transcript.length === 0 ? (
                            <div className="transcript-empty">
                                {language === 'hi' ? 'बातचीत शुरू करने के लिए माइक्रोफोन बटन दबाएं...' : 'Press the microphone button to start a conversation...'}
                            </div>
                        ) : (
                            transcript.map((msg, i) => (
                                <div key={i} className="transcript-message">
                                    <div className={`transcript-role ${msg.role}`}>
                                        {msg.role === 'user'
                                            ? (language === 'hi' ? '👤 आप' : '👤 You')
                                            : (language === 'hi' ? '🩺 आरोग्यवाणी' : '🩺 ArogyaVani')}
                                    </div>
                                    <div className="transcript-text">{msg.text}</div>
                                </div>
                            ))
                        )}

                        {/* Triage Result Banner */}
                        {triageResult && !isActive && (() => {
                            const config = {
                                home: { emoji: '🟢', label: language === 'hi' ? 'घर पर देखभाल उचित है' : 'Home Care Recommended', color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', advice: language === 'hi' ? 'आराम करें, पानी पिएं, ओटीसी दवा लें।' : 'Rest, stay hydrated, take OTC medication.' },
                                clinic: { emoji: '🟡', label: language === 'hi' ? 'क्लिनिक में जाएं' : 'Visit a Clinic', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', advice: language === 'hi' ? 'अगले 24 घंटे में डॉक्टर से मिलें।' : 'See a doctor within 24 hours.' },
                                emergency: { emoji: '🔴', label: language === 'hi' ? 'आपातकाल — तुरंत जाएं' : 'Emergency — Seek Immediate Care', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', advice: language === 'hi' ? '108 पर कॉल करें या तुरंत अस्पताल जाएं।' : 'Call 108 or go to the hospital now.' },
                            };
                            const t = config[triageResult];
                            return (
                                <div style={{
                                    margin: '1rem 0 0.5rem', padding: '1rem 1.25rem',
                                    background: t.bg, border: `1px solid ${t.border}`,
                                    borderRadius: '12px', textAlign: 'center',
                                    animation: 'fadeInUp 0.4s ease',
                                }}>
                                    <div style={{ fontSize: '1.6rem', marginBottom: '0.3rem' }}>{t.emoji}</div>
                                    <div style={{ fontWeight: '800', fontSize: '1rem', color: t.color }}>{t.label}</div>
                                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{t.advice}</div>
                                </div>
                            );
                        })()}

                        <div ref={transcriptEndRef} />
                    </div>
                </div>

            </main>

            {/* Appointment Modal */}
            {showModal && (
                <AppointmentModal
                    consultationId={lastConsultationId}
                    triageLevel={lastTriageLevel}
                    symptoms={lastSymptoms}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
