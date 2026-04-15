import { NextResponse } from 'next/server';
import { getQdrantClient, COLLECTION_NAME } from '@/lib/qdrant';
import { getEmbedding } from '@/lib/embeddings';

export async function POST(request) {
    try {
        const { query, language = 'en', limit = 5 } = await request.json();

        if (!query) {
            return NextResponse.json(
                { error: 'Query is required' },
                { status: 400 }
            );
        }

        const client = getQdrantClient();
        const queryEmbedding = await getEmbedding(query);

        const results = await client.search(COLLECTION_NAME, {
            vector: queryEmbedding,
            limit,
            with_payload: true,
        });

        const documents = results.map((result) => ({
            title: result.payload.title,
            content: language === 'hi' ? result.payload.content_hi : result.payload.content,
            category: result.payload.category,
            tags: result.payload.tags,
            score: result.score,
        }));

        return NextResponse.json({ success: true, documents });
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
