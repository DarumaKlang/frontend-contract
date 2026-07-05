// app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { fetchJson } from '@/lib/apiClient';

export async function GET(req: Request) {
  // Verify admin role
  const adminErr = await requireAdmin(req);
  if (adminErr) return adminErr; // 403 if not admin

  // Call backend API to fetch all users
  const users = await fetchJson<any[]>('/users'); // adjust type as needed
  return NextResponse.json({ users });
}
