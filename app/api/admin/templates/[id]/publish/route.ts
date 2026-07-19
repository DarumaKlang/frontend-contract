// app/api/admin/templates/[id]/publish/route.ts
// Publish and unpublish template

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import {
  publishTemplate,
  unpublishTemplate,
} from '@/lib/services/templateService';

/**
 * POST /api/admin/templates/:id/publish
 * Publish template (set as active)
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin(req);
  if (adminCheck) return adminCheck;

  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const deactivatePrevious = body.deactivate_previous !== false; // default true

    const { data, error } = await publishTemplate(id, deactivatePrevious);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      template: data,
      message: 'Template published successfully' 
    });
  } catch (error: any) {
    console.error('Publish template error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to publish template' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/templates/:id/publish
 * Unpublish template (deactivate)
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin(req);
  if (adminCheck) return adminCheck;

  try {
    const { id } = await params;
    const { data, error } = await unpublishTemplate(id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      template: data,
      message: 'Template unpublished successfully' 
    });
  } catch (error: any) {
    console.error('Unpublish template error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to unpublish template' },
      { status: 500 }
    );
  }
}
