import { Pinecone } from '@pinecone-database/pinecone';

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;

if (!PINECONE_API_KEY) {
  throw new Error('Pinecone api key is not provided!');
}

export const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
  environment: 'gcp-starter',
});
