import type { SessionOptions } from 'iron-session';

import { User } from '@/types';

function createSessionConfig<T extends keyof User>(
  cookieName: T,
): SessionOptions {
  return {
    password: process.env.COOKIE_ENCRYPT_PASSWORD as string,
    cookieName,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  };
}

export const sessionConfig = createSessionConfig('palate-user-id');
