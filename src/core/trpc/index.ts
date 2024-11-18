import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { utapi } from 'uploadthing/server';
import { compare, hash } from 'bcrypt';
// import { db } from '@/db';
import { INFINITE_QUERY_LIMIT } from '@/app/shared/config';
import { authProcedure, publicProcedure, router } from './trpc';
import { SignInFormValidator, SignUpFormValidatorBE } from '@/app/shared/validation/auth';
import { signToken } from '@/core/lib/auth';

export const appRouter = router({
  signUp: publicProcedure
    .input(SignUpFormValidatorBE)
    .mutation(async ({ input }) => {
      const { name, email, password } = input;
      const hashedPassword = await hash(password, 10);
      const userId = 'userId';

      const token = signToken(userId);

      return token;
    }),
  signIn: publicProcedure
    .input(SignInFormValidator)
    .mutation(async ({ input }) => {
      const { email, password } = input;
      const dbUser = 'dbUser';

      if (!dbUser) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      }

      const dbUserPassword = 'dbUserPassword';
      const dbUserId = 'dbUserId';

      const passwordMatch = await compare(password, dbUserPassword);

      if (!passwordMatch) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      }

      const token = signToken(dbUserId);

      return token;
    }),
  getUserFiles: authProcedure.query(async ({ ctx }) => {
    // const { userId, user } = ctx;
    // return await db.file.findMany({
    //   where: { userId },
    // });
  }),
  deleteFile: authProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // const { userId } = ctx;
      // const file = await db.file.findFirst({
      //   where: { id: input.id, userId },
      // });
      // if (!file) {
      //   throw new TRPCError({ code: 'NOT_FOUND' });
      // }
      // await db.file.delete({
      //   where: { id: input.id },
      // });
      // // delete from uploadthing
      // await utapi.deleteFiles(file.key);
      // return file;
    }),
  getFileUploadStatus: authProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ ctx, input }) => {
      // const { userId } = ctx;
      // const file = await db.file.findFirst({
      //   where: { id: input.fileId, userId },
      // });
      // if (!file) {
      //   return { status: 'PENDING' as const };
      // }
      // return { status: file.uploadStatus };
    }),
  getFile: authProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // const { userId } = ctx;
      // const file = await db.file.findFirst({
      //   where: { key: input.key, userId },
      // });
      // if (!file) {
      //   throw new TRPCError({ code: 'NOT_FOUND' });
      // }
      // return file;
    }),
  getFileMessages: authProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // const { userId } = ctx;
      // const { fileId, cursor } = input;
      // const limit = input.limit ?? INFINITE_QUERY_LIMIT;
      // const file = await db.file.findFirst({
      //   where: {
      //     id: fileId,
      //     userId,
      //   },
      // });
      // if (!file) {
      //   throw new TRPCError({ code: 'NOT_FOUND' });
      // }
      // const messages = await db.message.findMany({
      //   take: limit + 1,
      //   where: {
      //     fileId,
      //   },
      //   orderBy: {
      //     createdAt: 'desc',
      //   },
      //   cursor: cursor ? { id: cursor } : undefined,
      //   select: {
      //     id: true,
      //     isUserMessage: true,
      //     createdAt: true,
      //     text: true,
      //   },
      // });
      // let nextCursor: typeof cursor | undefined = undefined;
      // if (messages.length > limit) {
      //   const nextItem = messages.pop();
      //   nextCursor = nextItem?.id;
      // }
      // return { messages, nextCursor };
    }),
});

export type AppRouter = typeof appRouter;
