import { TRPCError } from '@trpc/server';
import { sign, verify } from 'jsonwebtoken';

export async function verifyToken(token?: string) {
  if (!token) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }

  if (!process.env.JWT_SECRET) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'JWT secret not found',
    });
  }

  const payload = verify(token, process.env.JWT_SECRET) as { userId: string };

  return payload.userId;
}

export function signToken(userId: string) {
  if (!process.env.JWT_SECRET) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'JWT secret not found',
    });
  }

  const token = sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  return token;
}
