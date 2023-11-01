import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { authProcedure, publicProcedure, router } from './trpc';
import { z } from 'zod';
import { utapi } from 'uploadthing/server';
import { getKindeUser } from '@/lib/auth';
import { INFINITE_QUERY_LIMIT } from '@/config';

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const user = getKindeUser();

    if (!user?.id || !user?.email) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const foundUser = await db.user.findFirst({
      where: { id: user.id },
    });

    if (!foundUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }

    return { success: true };
  }),
  getUserFiles: authProcedure.query(async ({ ctx }) => {
    const { userId, user } = ctx;

    return await db.file.findMany({
      where: { userId },
    });
  }),
  deleteFile: authProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const file = await db.file.findFirst({
        where: { id: input.id, userId },
      });
      if (!file) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      await db.file.delete({
        where: { id: input.id },
      });
      // delete from uploadthing
      await utapi.deleteFiles(file.key);
      return file;
    }),
  getFileUploadStatus: authProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const file = await db.file.findFirst({
        where: { id: input.fileId, userId },
      });
      if (!file) {
        return { status: 'PENDING' as const };
      }
      return { status: file.uploadStatus };
    }),
  getFile: authProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const file = await db.file.findFirst({
        where: { key: input.key, userId },
      });
      if (!file) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      return file;
    }),
  getFileMessages: authProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { fileId, cursor } = input;
      const limit = input.limit ?? INFINITE_QUERY_LIMIT;

      const file = await db.file.findFirst({
        where: {
          id: fileId,
          userId,
        },
      });
      if (!file) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const messages = await db.message.findMany({
        take: limit + 1,
        where: {
          fileId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          isUserMessage: true,
          createdAt: true,
          text: true,
        },
      });

      let nextCursor: typeof cursor | null = null;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }

      return { messages, nextCursor };
    }),
});

export type AppRouter = typeof appRouter;
