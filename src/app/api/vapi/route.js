import { NextResponse } from 'next/server';
import { getQdrantClient, COLLECTION_NAME } from '@/lib/qdrant';
import { getEmbedding } from '@/lib/embeddings';

async function searchKnowledge(query, language = 'en') {
    try {
        console.log(`[vapi/search] query="${query}" lang=${language}`);
        const client = getQdrantClient();
        const queryEmbedding = await getEmbedding(query);
        console.log(`[vapi/search] embedding ready, searching Qdrant collection="${COLLECTION_NAME}"`);

        const results = await client.search(COLLECTION_NAME, {
            vector: queryEmbedding,
            limit: 3,
            with_payload: true,
        });

        console.log(`[vapi/search] Qdrant returned ${results.length} results`);

        if (!results || results.length === 0) {
            console.warn('[vapi/search] no results found — returning fallback');
            return 'No specific information found in knowledge base. Advise the patient based on general medical knowledge.';
        }

        const context = results
            .map((r) => {
                const content = language === 'hi' ? r.payload.content_hi : r.payload.content;
                console.log(`  → [${r.payload.title}] score=${r.score?.toFixed(3)}`);
                return `[${r.payload.title}]: ${content}`;
            })
            .join('\n\n');

        return context;
    } catch (err) {
        console.error('[vapi/search] ERROR:', err.message);
        return `Knowledge base search failed (${err.message}). Please use your built-in medical knowledge to respond and provide a triage classification.`;
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { message } = body;

        console.log(`[vapi/webhook] type=${message?.type}`);

        // ── Format 1: tool-calls (Gemini / newer Vapi) ──
        if (message?.type === 'tool-calls') {
            const toolCalls = message?.toolCallList || [];
            console.log(`[vapi/webhook] tool-calls count=${toolCalls.length}`);
            const results = [];

            for (const toolCall of toolCalls) {
                const fnName = toolCall?.function?.name;
                const rawArgs = toolCall?.function?.arguments;
                const args = typeof rawArgs === 'string' ? JSON.parse(rawArgs) : (rawArgs || {});
                console.log(`[vapi/webhook] calling fn=${fnName} args=`, args);

                if (fnName === 'search_medical_knowledge') {
                    const result = await searchKnowledge(args.query || '', args.language || 'en');
                    results.push({ toolCallId: toolCall.id, result });
                }
            }

            if (results.length > 0) {
                console.log(`[vapi/webhook] returning ${results.length} tool results`);
                return NextResponse.json({ results });
            }
        }

        // ── Format 2: function-call (OpenAI / older Vapi) ──
        if (message?.type === 'function-call') {
            const fc = message?.functionCall || message?.toolCallList?.[0];
            const fnName = fc?.name || fc?.function?.name;
            const rawArgs = fc?.parameters || fc?.function?.arguments || {};
            const args = typeof rawArgs === 'string' ? JSON.parse(rawArgs) : rawArgs;
            const toolCallId = fc?.id || message?.toolCallList?.[0]?.id;
            console.log(`[vapi/webhook] function-call fn=${fnName} args=`, args);

            if (fnName === 'search_medical_knowledge') {
                const result = await searchKnowledge(args.query || '', args.language || 'en');
                return NextResponse.json({ results: [{ toolCallId, result }] });
            }
        }

        // ── Default: status-update, assistant-request, end-of-call-report, etc. ──
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('[vapi/webhook] FATAL ERROR:', error.message, error.stack);
        return NextResponse.json({
            results: [{ toolCallId: 'unknown', result: 'Knowledge base temporarily unavailable. Please use your built-in medical knowledge.' }],
        });
    }
}
