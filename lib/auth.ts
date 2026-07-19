// lib/auth.ts - Supabase-based authentication only
// All hardcoded credentials removed for security

import type { NextRequest } from 'next/server';
import { getSupabaseClient } from './supabase';

export const SESSION_COOKIE = 'sb-access-token';

/**
 * Get authenticated user from Supabase token
 */
export async function getSessionUser(token: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * Extract auth token from request
 */
export function getAuthToken(req: NextRequest): string | null {
  // Try Authorization header first
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Fallback to cookie
  const cookie = req.cookies.get(SESSION_COOKIE);
  return cookie?.value ?? null;
}

/**
 * Build secure cookie header
 */
const buildSetCookieHeader = (name: string, value: string, maxAge: number) => {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${name}=${encodeURIComponent(value)}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
};

export const setSessionCookie = (res: Response, token: string) => {
  res.headers.set('Set-Cookie', buildSetCookieHeader(SESSION_COOKIE, token, 60 * 60 * 24 * 7));
};

export const clearSessionCookie = (res: Response) => {
  res.headers.set('Set-Cookie', buildSetCookieHeader(SESSION_COOKIE, '', 0));
};
