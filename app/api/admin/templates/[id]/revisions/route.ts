// app/api/admin/templates/[id]/revisions/route.ts
// Get template revision history

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { getTemplateRevisions } from '@/lib/services/templateService';

/**
 * GET /api/admin/templates/:id/revisions
 * Get template revision history
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin(req);
  if (adminCheck) return adminCheck;

  try {
    const { id } = await params;
    const { data, error } = await getTemplateRevisions(id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ revisions: data });
  } catch (error: any) {
    console.error('Get revisions error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get revisions' },
      { status: 500 }
    );
  }
}
