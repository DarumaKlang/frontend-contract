import * as cookie from 'cookie';
import type { NextRequest } from 'next/server';

export interface User {
  id: string;
  email: string;
  password: string; // plain text only for demo – never store plaintext in production
  role: 'user' | 'admin';
}

const users: User[] = [
  {
    id: 'admin-1',
    email: 'Admin@Nuc7.com',
    password: 'Admin@5577',
    role: 'admin',
  },
];

export const findUserByEmail = (email: string) => users.find(u => u.email === email);
export const findUserById = (id: string) => users.find(u => u.id === id);

export const createUser = (email: string, password: string, role: 'user' | 'admin' = 'user') => {
  const id = crypto.randomUUID();
  const user: User = { id, email, password, role };
  users.push(user);
  return user;
};

export const verifyPassword = (user: User, password: string) => user.password === password;

export const SESSION_COOKIE = 'session_id';

export const setSessionCookie = (res: Response, userId: string) => {
  const cookieHeader = cookie.stringifySetCookie({
    name: SESSION_COOKIE,
    value: userId,
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.headers.set('Set-Cookie', cookieHeader);
};

export const clearSessionCookie = (res: Response) => {
  const cookieHeader = cookie.stringifySetCookie({
    name: SESSION_COOKIE,
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.headers.set('Set-Cookie', cookieHeader);
};

export const getSessionUserId = (req: NextRequest): string | null => {
  const cookie = req.cookies.get(SESSION_COOKIE);
  return cookie?.value ?? null;
};
