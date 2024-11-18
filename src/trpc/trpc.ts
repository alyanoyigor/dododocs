import { TRPCError, initTRPC } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { ZodError } from 'zod';
import superjson from 'superjson';
import { db } from '@/db';
import { verifyToken } from '@/lib/auth';
import { JwtPayload, verify } from 'jsonwebtoken';

const createTRPCContext = (options: CreateNextContextOptions) => {
  const { req, res } = options;

  return {
    req,
    res,
  };
}

const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create();

// const t = initTRPC.create();

const isAuth = t.middleware(({ctx, next}) => {
  const { req } = ctx;
  const token = req.headers.authorization?.split(' ')[1];

  const userId = verifyToken(token);

  return next({
    ctx: {
      userId,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const authProcedure = t.procedure.use(isAuth);
