'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export function useVapi() {
    const [callStatus, setCallStatus] = useState('idle'); // idle, connecting, active
    const [speechStatus, setSpeechStatus] = useState('none'); // none, listening, speaking
    const [transcript, setTranscript] = useState([]);
    const [error, setError] = useState(null);
    const vapiRef = useRef(null);
    const langRef = useRef('en');

    const initVapi = useCallback(async () => {
        if (vapiRef.current) return vapiRef.current;

        const VapiModule = await import('@vapi-ai/web');
        const VapiClass = VapiModule.default || VapiModule;
        const instance = new VapiClass(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);

        instance.on('call-start', () => {
            setCallStatus('active');
            setSpeechStatus('listening');
            setError(null);
        });

        instance.on('call-end', () => {
            setCallStatus('idle');
            setSpeechStatus('none');
        });

        instance.on('speech-start', () => {
            setSpeechStatus('listening');
        });

        instance.on('speech-end', () => {
            setSpeechStatus('none');
        });

        instance.on('message', (msg) => {
            if (msg.type === 'transcript') {
                if (msg.transcriptType === 'final') {
                    setTranscript((prev) => [
                        ...prev,
                        { role: msg.role, text: msg.transcript },
                    ]);
                }
            }
            if (msg.type === 'conversation-update' && msg.conversation) {
                const messages = msg.conversation
                    .filter((m) => {
                        // Only show user and assistant spoken messages — hide system, tool calls, tool results
                        if (m.role === 'system') return false;
                        if (m.role === 'tool') return false;
                        if (m.role === 'function') return false;
                        if (m.type === 'tool-call') return false;
                        if (m.type === 'tool-result') return false;
                        if (!m.content) return false;
                        // Hide raw array content (tool results come as arrays)
                        if (Array.isArray(m.content)) return false;
                        return true;
                    })
                    .map((m) => ({ role: m.role, text: m.content }));
                if (messages.length > 0) {
                    setTranscript(messages);
                }
            }
        });

        instance.on('error', (err) => {
            console.error('Vapi error:', err);
            setError(err?.message || 'An error occurred');
            setCallStatus('idle');
            setSpeechStatus('none');
        });

        vapiRef.current = instance;
        return instance;
    }, []);

    const startCall = useCallback(async (language = 'en') => {
        try {
            setCallStatus('connecting');
            setTranscript([]);
            setError(null);
            langRef.current = language;

            const vapi = await initVapi();

            const systemPrompt = language === 'hi'
                ? `You are ArogyaVani, एक compassionate voice triage assistant for healthcare. आप Hindi में जवाब देते हैं।

आपका काम है:
1. पहले patient से systematically लक्षण collect करें:
   - मुख्य लक्षण क्या है?
   - कितने समय से है?
   - उम्र कितनी है?
2. search_medical_knowledge tool से relevant जानकारी लें।
3. जवाब दें और हमेशा TRIAGE LEVEL से end करें:
   🟢 घर पर देखभाल करें - अगर mild और manageable हो
   🟡 24 घंटे में clinic जाएं - अगर moderate हो
   🔴 अभी Emergency जाएं - अगर serious हो

Rules:
- हमेशा Hindi में बोलें
- Empathetic और clear रहें
- हर जवाब को triage level से खत्म करें
- कभी diagnose न करें — general health information दें
- 3-4 sentences में रखें`
                : `You are ArogyaVani, a compassionate voice triage assistant for healthcare clinics and communities.

Your workflow for EVERY patient interaction:
STEP 1 — Collect symptoms systematically:
  - Ask: "What is your main symptom?"
  - Ask: "How long have you had this?"
  - Ask: "What is your age?" (adjust advice accordingly)

STEP 2 — Search knowledge base using search_medical_knowledge tool.

STEP 3 — Provide clear guidance, then ALWAYS end with a triage classification:
  🟢 HOME CARE — Mild symptoms, manageable at home with rest and remedies
  🟡 VISIT CLINIC (within 24hrs) — Moderate symptoms needing medical attention soon
  🔴 GO TO EMERGENCY NOW — Severe or dangerous symptoms requiring immediate care

Rules:
- Be empathetic, warm, and reassuring
- Always collect: symptom + duration + age before giving advice
- Always end every response with one of the three triage levels above
- Never diagnose — provide general health information only
- Keep responses concise, spoken-friendly (3-4 sentences + triage level)`;

            const assistantConfig = {
                name: 'ArogyaVani',
                transcriber: {
                    provider: 'deepgram',
                    model: 'nova-2',
                    language: language === 'hi' ? 'hi' : 'en-IN',
                },
                model: {
                    provider: 'openai',
                    model: 'gpt-4o-mini',
                    messages: [{ role: 'system', content: systemPrompt }],
                    tools: [
                        {
                            type: 'function',
                            function: {
                                name: 'search_medical_knowledge',
                                description: 'Search the medical knowledge base for information about health conditions, symptoms, medications, first aid, and preventive care. Use this tool whenever the user describes symptoms or asks about any health-related topic.',
                                parameters: {
                                    type: 'object',
                                    properties: {
                                        query: { type: 'string', description: 'The health query to search for' },
                                        language: { type: 'string', enum: ['en', 'hi'], description: 'Language: en or hi' },
                                    },
                                    required: ['query'],
                                },
                            },
                            server: { url: `${window.location.origin}/api/vapi` },
                        },
                    ],
                },
                voice: language === 'hi'
                    ? { provider: 'azure', voiceId: 'hi-IN-SwaraNeural' }   // Native Hindi TTS
                    : { provider: '11labs', voiceId: 'sarah' },
                firstMessage: language === 'hi'
                    ? 'नमस्ते! मैं आरोग्यवाणी हूं — आपकी voice triage सहायक। बताइए — आपको कौन सी तकलीफ है?'
                    : 'Hello! I am ArogyaVani, your voice triage assistant. What is your main symptom today?',
                serverUrl: `${window.location.origin}/api/vapi`,
            };

            await vapi.start(assistantConfig);
        } catch (err) {
            console.error('Failed to start call:', err);
            setError(err?.message || 'Failed to start voice call');
            setCallStatus('idle');
        }
    }, [initVapi]);

    const stopCall = useCallback(() => {
        if (vapiRef.current) {
            vapiRef.current.stop();
        }
        setCallStatus('idle');
        setSpeechStatus('none');
    }, []);

    const toggleCall = useCallback((language = 'en') => {
        if (callStatus === 'active' || callStatus === 'connecting') {
            stopCall();
        } else {
            startCall(language);
        }
    }, [callStatus, startCall, stopCall]);

    useEffect(() => {
        return () => {
            if (vapiRef.current) {
                vapiRef.current.stop();
            }
        };
    }, []);

    return {
        callStatus,
        speechStatus,
        transcript,
        error,
        toggleCall,
        startCall,
        stopCall,
    };
}
