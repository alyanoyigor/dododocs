import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { authProcedure, publicProcedure, router } from './trpc';
import { z } from 'zod';
import { utapi } from 'uploadthing/server';
import { getKindeUser } from '@/lib/auth';

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
});

export type AppRouter = typeof appRouter;
