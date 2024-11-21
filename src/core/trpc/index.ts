import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { utapi } from 'uploadthing/server';
import { compare, hash } from 'bcrypt';
import { INFINITE_QUERY_LIMIT } from '@/app/shared/config';
import {
  SignInFormValidator,
  SignUpFormValidator,
} from '@/app/shared/validation/auth';
import { signToken } from '@/core/lib/auth';
import { setCookie } from '@/app/shared/actions';
import { CookieKeys } from '@/app/shared/interfaces/auth.interface';

import { authProcedure, publicProcedure, router } from './trpc';
import { db } from '../lib/db';

export const appRouter = router({
  signUp: publicProcedure
    .input(SignUpFormValidator)
    .mutation(async ({ input }) => {
      const { name, email, password } = input;
      const hashedPassword = await hash(password, 10);

      const user = await db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      const token = await signToken(user.id);

      await setCookie(CookieKeys.TOKEN, token);
    }),
  signIn: publicProcedure
    .input(SignInFormValidator)
    .mutation(async ({ input }) => {
      const { email, password } = input;
      const dbUser = await db.user.findUnique({ where: { email } });

      if (!dbUser) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      }

      const dbUserPassword = dbUser.password;
      const dbUserId = dbUser.id;

      const passwordMatch = await compare(password, dbUserPassword);

      if (!passwordMatch) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Incorrect password',
        });
      }

      const token = await signToken(dbUserId);

      await setCookie(CookieKeys.TOKEN, token);
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
