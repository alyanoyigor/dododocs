import { initTRPC } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { verifyToken } from '@/core/lib/auth';

const createTRPCContext = (options: CreateNextContextOptions) => {
  const { req, res } = options;

  return {
    req,
    res,
  };
}

const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create();

const isAuth = t.middleware(async ({ctx, next}) => {
  const { req } = ctx;
  const token = req.headers.authorization?.split(' ')[1];

  const userId = await verifyToken(token);

  return next({
    ctx: {
      userId,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const authProcedure = t.procedure.use(isAuth);
