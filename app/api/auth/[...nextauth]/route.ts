import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET() {
  return NextResponse.json({ error: 'Supabase auth is handled directly by this app' }, { status: 404 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const email = body?.email;
    const password = body?.password;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({
      user: data.user,
      token: data.session?.access_token ?? null,
    });
  } catch (error) {
    console.error('Supabase auth proxy error:', error);
    return NextResponse.json({ error: 'Unable to sign in with Supabase' }, { status: 502 });
  }
}
