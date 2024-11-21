import * as jose from 'jose';

import { TRPCError } from '@trpc/server';
import { getCookie } from '@/app/shared/actions';
import { CookieKeys } from '@/app/shared/interfaces/auth.interface';

export async function verifyToken(token?: string) {
  try {
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

    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET),
    );

    return payload.aud;
  } catch (error) {
    return false;
  }
}

export async function signToken(userId: string) {
  if (!process.env.JWT_SECRET) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'JWT secret not found',
    });
  }

  const token = await new jose.SignJWT()
    .setProtectedHeader({ alg: 'HS256' })
    .setAudience(userId)
    .setExpirationTime('1h')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  return token;
}

export const isAuthenticated = async () => {
  const token = await getCookie(CookieKeys.TOKEN);
  const verified = await verifyToken(token);

  return verified;
};
