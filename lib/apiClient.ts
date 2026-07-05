// lib/apiClient.ts
import { getBackendBaseUrl, getDefaultApiKey } from '@/lib/config';

export const apiBase = getBackendBaseUrl();

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  if (!apiBase) {
    throw new Error('Backend API base URL not configured');
  }

  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');

  const defaultApiKey = getDefaultApiKey();
  if (defaultApiKey && !headers.has('x-api-key') && !headers.has('X-API-Key')) {
    headers.set('X-API-Key', defaultApiKey);
  }

  const resp = await fetch(`${apiBase}${path}`, {
    ...init,
    headers,
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`API error ${resp.status}: ${err}`);
  }

  return resp.json();
}
