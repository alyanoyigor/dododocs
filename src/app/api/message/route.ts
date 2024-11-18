import { NextRequest } from 'next/server';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { db } from '@/core/db';
import { openai } from '@/core/lib/openai';
import { SendMessageValidator } from '@/app/shared/validation/chat';
import { pinecone } from '@/core/lib/pinecone';

export const POST = async (request: NextRequest) => {
  // try {
    // const body = await request.json();

    // const user = getKindeUser();
    // const { id: userId } = user;

    // if (!userId) {
    //   return new Response('Unauthorized', { status: 401 });
    // }

  //   const { fileId, message } = SendMessageValidator.parse(body);

  //   const file = await db.file.findFirst({
  //     where: {
  //       id: fileId,
  //       userId,
  //     },
  //   });

  //   if (!file) {
  //     return new Response('Not found', { status: 404 });
  //   }

  //   await db.message.create({
  //     data: {
  //       text: message,
  //       isUserMessage: true,
  //       userId,
  //       fileId,
  //     },
  //   });

  //   // generate vector from the text
  //   const embeddings = new OpenAIEmbeddings({
  //     openAIApiKey: process.env.OPENAI_API_KEY,
  //   });

  //   const pineconeIndex = pinecone.Index('dododocs');

  //   const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  //     pineconeIndex,
  //   });

  //   const results = await vectorStore.similaritySearch(message, 4);

  //   const prevMessages = await db.message.findMany({
  //     where: {
  //       fileId,
  //     },
  //     orderBy: {
  //       createdAt: 'asc',
  //     },
  //     take: 6,
  //   });

  //   const formattedPrevMessages = prevMessages.map((message) => ({
  //     role: message.isUserMessage ? ('user' as const) : ('assistant' as const),
  //     content: message.text,
  //   }));

  //   const response = await openai.chat.completions.create({
  //     model: 'gpt-3.5-turbo',
  //     temperature: 0,
  //     stream: true,
  //     messages: [
  //       {
  //         role: 'system',
  //         content:
  //           'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
  //       },
  //       {
  //         role: 'user',
  //         content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
  // \n----------------\n
  
  // PREVIOUS CONVERSATION:
  // ${formattedPrevMessages.map((message) => {
  //   if (message.role === 'user') return `User: ${message.content}\n`;
  //   return `Assistant: ${message.content}\n`;
  // })}
  
  // \n----------------\n
  
  // CONTEXT:
  // ${results.map((r) => r.pageContent).join('\n\n')}
  
  // USER INPUT: ${message}`,
  //       },
  //     ],
  //   });

  //   const stream = OpenAIStream(response, {
  //     async onCompletion(completion) {
  //       await db.message.create({
  //         data: {
  //           text: completion,
  //           isUserMessage: false,
  //           fileId,
  //           userId,
  //         },
  //       });
  //     },
  //   });

  //   return new StreamingTextResponse(stream);
  // } catch (error) {
  //   if (error instanceof Error) {
  //     return new Response(error.message, { status: 400 });
  //   }
  // }
};
