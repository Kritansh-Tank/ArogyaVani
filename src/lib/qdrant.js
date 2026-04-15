import { QdrantClient } from '@qdrant/js-client-rest';

let client = null;

export function getQdrantClient() {
    if (!client) {
        client = new QdrantClient({
            url: process.env.QDRANT_URL,
            apiKey: process.env.QDRANT_API_KEY,
        });
    }
    return client;
}

export const COLLECTION_NAME = 'medical_knowledge';
export const VECTOR_SIZE = 768; // nomic-embed-text dimensions
