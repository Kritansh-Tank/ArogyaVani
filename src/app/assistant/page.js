'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useVapi } from '@/hooks/useVapi';
import { FaMicrophone, FaStop, FaHourglass } from 'react-icons/fa';
import { MdHealthAndSafety } from 'react-icons/md';

export default function AssistantPage() {
    const [language, setLanguage] = useState('en');
    const { callStatus, speechStatus, transcript, error, toggleCall } = useVapi();
    const transcriptEndRef = useRef(null);

    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);

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
        <div className="assistant-page">
            {/* Header */}
            <header className="assistant-header">
                <Link href="/" className="assistant-back">
                    ← {language === 'hi' ? 'वापस' : 'Back'}
                </Link>
                <h1 className="assistant-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MdHealthAndSafety size={26} color="#06b6d4" />
                    {language === 'hi' ? 'आरोग्यवाणी' : 'ArogyaVani'}
                </h1>
                <div className="lang-toggle">
                    <button
                        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                        onClick={() => setLanguage('en')}
                        disabled={isActive || isConnecting}
                    >EN</button>
                    <button
                        className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
                        onClick={() => setLanguage('hi')}
                        disabled={isActive || isConnecting}
                    >हिं</button>
                </div>
            </header>

            {/* Main */}
            <main className="assistant-main">
                <div className="voice-section">
                    {/* Voice Button */}
                    <div className="voice-button-wrapper">
                        <div className={`voice-rings ${isActive ? 'active' : ''}`}>
                            <div className="voice-ring" />
                            <div className="voice-ring" />
                            <div className="voice-ring" />
                        </div>
                        <button
                            className={`voice-button ${isActive ? 'active' : ''}`}
                            onClick={() => toggleCall(language)}
                            disabled={isConnecting}
                            id="voice-button"
                        >
                            <VoiceIcon size={32} color={isActive ? '#ff0000' : '#fff'} />
                        </button>
                    </div>

                    {/* Waveform */}
                    <div className={`waveform ${isActive ? 'active' : ''}`}>
                        {waveformBars.map((i) => (
                            <div key={i} className="waveform-bar" />
                        ))}
                    </div>

                    {/* Status */}
                    <div className="voice-status">
                        <span className={`status-dot ${getStatusDotClass()}`} />
                        {getStatusText()}
                    </div>

                    {/* Hint */}
                    <p className="voice-hint">
                        {language === 'hi'
                            ? '💡 बताएं: लक्षण, कितने समय से है, और उम्र — जैसे "मुझे 2 दिन से बुखार है, मैं 35 साल का हूं"'
                            : '💡 Describe your symptom, duration & age — e.g. "I have had a fever for 2 days, I am 35 years old"'}
                    </p>

                    {/* Error */}
                    {error && (
                        <div style={{
                            color: '#ef4444', background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px',
                            padding: '0.75rem 1.25rem', fontSize: '0.9rem',
                            maxWidth: '500px', textAlign: 'center',
                        }}>
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
                                {language === 'hi'
                                    ? 'बातचीत शुरू करने के लिए माइक्रोफोन बटन दबाएं...'
                                    : 'Press the microphone button to start a conversation...'}
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
                        <div ref={transcriptEndRef} />
                    </div>
                </div>
            </main>
        </div>
    );
}
