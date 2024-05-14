import type { SessionOptions } from 'iron-session';

export const sessionOptions: SessionOptions = {
  password: process.env.COOKIE_ENCRYPT_PASSWORD as string,
  cookieName: 'palate-user-id',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};