const JINA_API_KEY = process.env.JINA_API_KEY;
const JINA_MODEL = 'jina-embeddings-v2-base-en'; // 768 dimensions — matches existing Qdrant collection

export async function getEmbedding(text) {
    // Fallback to Ollama if no Jina key (local dev without key)
    if (!JINA_API_KEY) {
        console.log('[embeddings] JINA_API_KEY not set — falling back to Ollama');
        const base = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
        const model = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text';
        console.log(`[embeddings] Ollama: POST ${base}/api/embeddings model=${model} text="${text.slice(0, 60)}..."`);
        const res = await fetch(`${base}/api/embeddings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, prompt: text }),
        });
        if (!res.ok) {
            const err = await res.text();
            console.error('[embeddings] Ollama failed:', err);
            throw new Error(`Ollama embedding failed: ${err}`);
        }
        const data = await res.json();
        console.log(`[embeddings] Ollama OK — vector dims: ${data.embedding?.length}`);
        return data.embedding;
    }

    // Jina AI hosted embeddings
    console.log(`[embeddings] Jina AI: model=${JINA_MODEL} text="${text.slice(0, 60)}..."`);
    const response = await fetch('https://api.jina.ai/v1/embeddings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JINA_API_KEY}`,
        },
        body: JSON.stringify({ model: JINA_MODEL, input: [text] }),
    });

    if (!response.ok) {
        const err = await response.text();
        console.error('[embeddings] Jina failed:', err);
        throw new Error(`Jina embedding failed: ${err}`);
    }

    const data = await response.json();
    const dims = data.data[0].embedding?.length;
    console.log(`[embeddings] Jina OK — vector dims: ${dims}`);
    return data.data[0].embedding;
}

export async function getEmbeddings(texts) {
    if (!JINA_API_KEY) {
        console.log(`[embeddings] Batch via Ollama — ${texts.length} texts`);
        const results = [];
        for (const text of texts) {
            results.push(await getEmbedding(text));
        }
        return results;
    }

    // Jina supports batching — much faster for seeding
    console.log(`[embeddings] Batch via Jina AI — ${texts.length} texts`);
    const response = await fetch('https://api.jina.ai/v1/embeddings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JINA_API_KEY}`,
        },
        body: JSON.stringify({ model: JINA_MODEL, input: texts }),
    });

    if (!response.ok) {
        const err = await response.text();
        console.error('[embeddings] Jina batch failed:', err);
        throw new Error(`Jina batch embedding failed: ${err}`);
    }

    const data = await response.json();
    console.log(`[embeddings] Jina batch OK — ${data.data.length} vectors, dims: ${data.data[0].embedding?.length}`);
    return data.data.map((d) => d.embedding);
}
