// lib/admin.ts – hardened admin auth using Supabase JWT verification
// Validates bearer tokens against Supabase JWT secret and requires valid session.
// For additional security, consider adding role-based checks or user ID whitelisting.

import { NextResponse } from 'next/server';
import * as jose from 'jose';

interface JWTPayload {
  aud?: string;
  sub?: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export async function requireAdmin(req: Request): Promise<null | Response> {
  try {
    // Extract bearer token from Authorization header
    const authHeader = req.headers.get('authorization') || '';
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    const token = match?.[1];

    if (!token) {
      return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
    }

    // Verify token using Supabase JWT secret
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
      console.error('SUPABASE_JWT_SECRET not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const secretKey = new TextEncoder().encode(secret);
    const verified = await jose.jwtVerify(token, secretKey);
    const payload = verified.payload as JWTPayload;

    // Require authenticated user
    if (!payload.sub) {
      return NextResponse.json({ error: 'Invalid token: missing user ID' }, { status: 403 });
    }

    // Optional: restrict to specific admin email(s) — uncomment to enable
    // const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
    // if (adminEmails.length > 0 && !adminEmails.includes(payload.email || '')) {
    //   return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    // }

    // Request is authenticated; store user info in request for downstream use (optional)
    (req as any).adminUser = { id: payload.sub, email: payload.email };
    return null;
  } catch (error: any) {
    console.error('Admin auth verification failed:', error?.message);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
}
