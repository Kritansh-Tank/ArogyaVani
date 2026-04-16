import { NextResponse } from 'next/server';
import { getQdrantClient, COLLECTION_NAME } from '@/lib/qdrant';
import { getEmbedding } from '@/lib/embeddings';
import { getSupabaseAdmin } from '@/lib/supabase';

async function searchKnowledge(query, language = 'en') {
    try {
        console.log(`[vapi/search] query="${query}" lang=${language}`);
        const client = getQdrantClient();
        const queryEmbedding = await getEmbedding(query);
        const results = await client.search(COLLECTION_NAME, {
            vector: queryEmbedding,
            limit: 3,
            with_payload: true,
        });
        console.log(`[vapi/search] Qdrant returned ${results.length} results`);
        if (!results || results.length === 0) {
            return 'No specific information found. Advise based on general medical knowledge.';
        }
        return results.map((r) => {
            const content = language === 'hi' ? r.payload.content_hi : r.payload.content;
            console.log(`  → [${r.payload.title}] score=${r.score?.toFixed(3)}`);
            return `[${r.payload.title}]: ${content}`;
        }).join('\n\n');
    } catch (err) {
        console.error('[vapi/search] ERROR:', err.message);
        return `Knowledge base unavailable. Use built-in medical knowledge.`;
    }
}

// Parse triage level from end-of-call summary
function parseTriageLevel(summary = '') {
    const lower = summary.toLowerCase();
    if (lower.includes('emergency') || lower.includes('🔴')) return 'emergency';
    if (lower.includes('clinic') || lower.includes('visit') || lower.includes('🟡')) return 'clinic';
    return 'home';
}

// Extract symptoms from summary text
function parseSymptoms(summary = '') {
    const match = summary.match(/symptom[s]?[:\s]+([^.]+)/i) ||
        summary.match(/experience[s]? ([^.]+)/i) ||
        summary.match(/complain[s]? of ([^.]+)/i);
    return match ? match[1].trim().slice(0, 200) : summary.slice(0, 200);
}

async function saveConsultation(callData) {
    try {
        const supabase = getSupabaseAdmin();
        const summary = callData?.summary?.overview || callData?.analysis?.summary || '';
        const triage = parseTriageLevel(summary);
        const symptoms = parseSymptoms(summary);

        // Try to infer user from metadata or leave null (anonymous)
        const userId = callData?.metadata?.userId || null;
        const language = callData?.metadata?.language || 'en';
        const duration = callData?.durationSeconds || 0;
        const callId = callData?.id || null;

        const { data, error } = await supabase.from('consultations').insert([{
            user_id: userId,
            language,
            triage_level: triage,
            symptoms,
            summary,
            duration_seconds: duration,
            call_id: callId,
        }]).select().single();

        if (error) throw error;
        console.log(`[vapi/consultation] saved: id=${data.id} triage=${triage}`);
        return data;
    } catch (err) {
        console.error('[vapi/consultation] save failed:', err.message);
        return null;
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { message } = body;

        console.log(`[vapi/webhook] type=${message?.type}`);

        // ── Save consultation on call end ──
        if (message?.type === 'end-of-call-report') {
            await saveConsultation(message?.call || {});
            return NextResponse.json({ success: true });
        }

        // ── Tool calls (Gemini/newer Vapi) ──
        if (message?.type === 'tool-calls') {
            const toolCalls = message?.toolCallList || [];
            console.log(`[vapi/webhook] tool-calls count=${toolCalls.length}`);
            const results = [];

            for (const toolCall of toolCalls) {
                const fnName = toolCall?.function?.name;
                const rawArgs = toolCall?.function?.arguments;
                const args = typeof rawArgs === 'string' ? JSON.parse(rawArgs) : (rawArgs || {});
                console.log(`[vapi/webhook] fn=${fnName} args=`, args);

                if (fnName === 'search_medical_knowledge') {
                    const result = await searchKnowledge(args.query || '', args.language || 'en');
                    results.push({ toolCallId: toolCall.id, result });
                }
            }

            if (results.length > 0) return NextResponse.json({ results });
        }

        // ── Function call (OpenAI/older Vapi) ──
        if (message?.type === 'function-call') {
            const fc = message?.functionCall || message?.toolCallList?.[0];
            const fnName = fc?.name || fc?.function?.name;
            const rawArgs = fc?.parameters || fc?.function?.arguments || {};
            const args = typeof rawArgs === 'string' ? JSON.parse(rawArgs) : rawArgs;
            const toolCallId = fc?.id || message?.toolCallList?.[0]?.id;
            console.log(`[vapi/webhook] function-call fn=${fnName}`);

            if (fnName === 'search_medical_knowledge') {
                const result = await searchKnowledge(args.query || '', args.language || 'en');
                return NextResponse.json({ results: [{ toolCallId, result }] });
            }
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('[vapi/webhook] FATAL:', error.message);
        return NextResponse.json({
            results: [{ toolCallId: 'unknown', result: 'Knowledge base temporarily unavailable.' }],
        });
    }
}
