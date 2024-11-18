import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/core/lib/pinecone';
import { db } from '@/core/db';

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: '4MB' } })
    // .middleware(async () => {
    //   // const user = getKindeUser();

    //   // if (!user || !user.id) {
    //   //   throw new Error('Unathorized');
    //   // }
    //   // return { userId: user.id };
    // })
    .onUploadComplete(async ({ metadata, file }) => {
      // const url = `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`;
      // const createdFile = await db.file.create({
      //   data: {
      //     key: file.key,
      //     name: file.name,
      //     url,
      //     uploadStatus: 'PROCESSING',
      //     userId: metadata.userId,
      //   },
      // });

      // try {
      //   // fetch pdf
      //   const pdfResponse = await fetch(url);
      //   const blob = await pdfResponse.blob();

      //   // create text base on blob
      //   const pdf = new PDFLoader(blob);
      //   const pageLevelDocs = await pdf.load();

      //   // generate vector from the text
      //   const embeddings = new OpenAIEmbeddings({
      //     openAIApiKey: process.env.OPENAI_API_KEY,
      //   });

      //   // save vectorized text into pinecone
      //   const pineconeIndex = pinecone.Index('dododocs');
      //   await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      //     pineconeIndex,
      //   });

      //   // update file status to success
      //   await db.file.update({
      //     data: {
      //       uploadStatus: 'SUCCESS',
      //     },
      //     where: {
      //       id: createdFile.id,
      //     },
      //   });
      // } catch (error) {
      //   console.log(error);
      //   await db.file.update({
      //     data: {
      //       uploadStatus: 'FAILED',
      //     },
      //     where: {
      //       id: createdFile.id,
      //     },
      //   });
      // }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
