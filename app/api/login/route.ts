import { NextResponse } from 'next/server';
import { getBackendBaseUrl } from '@/lib/config';

const backendBaseUrl = getBackendBaseUrl();

export async function POST(req: Request) {
  if (!backendBaseUrl) {
    return NextResponse.json(
      { error: 'Backend manager URL is not configured' },
      { status: 500 }
    );
  }

  try {
    const { email, password } = await req.json();
    const response = await fetch(`${backendBaseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => null);

    return NextResponse.json(
      data ?? { error: 'Backend manager request failed' },
      { status: response.status }
    );
  } catch (error) {
    console.error('Login proxy error:', error);
    return NextResponse.json(
      { error: 'Unable to reach backend manager' },
      { status: 502 }
    );
  }
}
