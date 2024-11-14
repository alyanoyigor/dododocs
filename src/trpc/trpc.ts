import { TRPCError, initTRPC } from '@trpc/server';

const t = initTRPC.create();

const middleware = t.middleware;
const isAuth = middleware(async (options) => {
  // if (!user || !user.id) {
  //   throw new TRPCError({ code: 'UNAUTHORIZED' });
  // }
  return options.next({
    ctx: {},
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const authProcedure = t.procedure.use(isAuth);
