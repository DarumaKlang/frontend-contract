import { NextResponse } from 'next/server';
import { getBackendBaseUrl } from '@/lib/config';

const backendBaseUrl = getBackendBaseUrl();

export async function POST(request: Request) {
  if (!backendBaseUrl) {
    return NextResponse.json(
      { error: 'Backend manager URL is not configured' },
      { status: 500 }
    );
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const response = await fetch(`${backendBaseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: email.split('@')[0],
        email,
        password,
      }),
    });

    const data = await response.json().catch(() => null);

    return NextResponse.json(
      data ?? { error: 'Backend manager request failed' },
      { status: response.status }
    );
  } catch (error) {
    console.error('Register proxy error:', error);
    return NextResponse.json(
      { error: 'Unable to reach backend manager' },
      { status: 502 }
    );
  }
}
