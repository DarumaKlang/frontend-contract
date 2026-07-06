import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { fetchJson } from '@/lib/apiClient';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const adminErr = await requireAdmin(req);
  if (adminErr) return adminErr;

  const { id } = params;
  try {
    const body = await req.json();
    // Expect body to contain partial user update, e.g. { active: false } or { role: 'admin' }
    const updated = await fetchJson(`/users/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    return NextResponse.json({ user: updated });
  } catch (err: any) {
    console.error('admin/users/[id] PATCH error:', err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const adminErr = await requireAdmin(req);
  if (adminErr) return adminErr;

  const { id } = params;
  try {
    await fetchJson(`/users/${encodeURIComponent(id)}`, { method: 'DELETE' });
    return NextResponse.json({ deleted: true });
  } catch (err: any) {
    console.error('admin/users/[id] DELETE error:', err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
