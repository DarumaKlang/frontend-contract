import { NextResponse } from 'next/server';
import { getBackendBaseUrl } from '@/lib/config';

const backendBaseUrl = getBackendBaseUrl();

export async function GET() {
  return NextResponse.json(
    { error: 'Authentication is handled by backend-manager' },
    { status: 404 }
  );
}

export async function POST(request: Request) {
  if (!backendBaseUrl) {
    return NextResponse.json(
      { error: 'Backend manager URL is not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.text();
    const response = await fetch(`${backendBaseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Auth proxy error:', error);
    return NextResponse.json(
      { error: 'Unable to reach backend manager' },
      { status: 502 }
    );
  }
}
