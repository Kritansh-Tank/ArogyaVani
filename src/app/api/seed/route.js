import { NextResponse } from 'next/server';
import { getQdrantClient, COLLECTION_NAME, VECTOR_SIZE } from '@/lib/qdrant';
import { getEmbedding } from '@/lib/embeddings';
import { medicalKnowledge } from '@/lib/medical-data';

export async function POST() {
    try {
        const client = getQdrantClient();

        // Delete existing collection if it exists
        try {
            await client.deleteCollection(COLLECTION_NAME);
        } catch (e) {
            // Collection might not exist yet
        }

        // Create collection
        await client.createCollection(COLLECTION_NAME, {
            vectors: {
                size: VECTOR_SIZE,
                distance: 'Cosine',
            },
        });

        // Generate embeddings and upsert
        const points = [];
        for (const item of medicalKnowledge) {
            const textToEmbed = `${item.title}. ${item.content}. Tags: ${item.tags.join(', ')}`;
            const embedding = await getEmbedding(textToEmbed);

            points.push({
                id: item.id,
                vector: embedding,
                payload: {
                    title: item.title,
                    category: item.category,
                    tags: item.tags,
                    content: item.content,
                    content_hi: item.content_hi,
                },
            });
        }

        await client.upsert(COLLECTION_NAME, { points });

        return NextResponse.json({
            success: true,
            message: `Seeded ${points.length} medical knowledge entries`,
            count: points.length,
        });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
