// app/api/admin/templates/[id]/route.ts
// Get, update, and delete specific template

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import {
  getTemplateById,
  updateTemplate,
  deleteTemplate,
} from '@/lib/services/templateService';
import type { UpdateTemplateRequest } from '@/lib/types/template';

/**
 * GET /api/admin/templates/:id
 * Get single template by ID
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin(req);
  if (adminCheck) return adminCheck;

  try {
    const { id } = await params;
    const { data, error } = await getTemplateById(id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ template: data });
  } catch (error: any) {
    console.error('Get template error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get template' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/templates/:id
 * Update template
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin(req);
  if (adminCheck) return adminCheck;

  try {
    const { id } = await params;
    const body: UpdateTemplateRequest = await req.json();

    const { data, error } = await updateTemplate(id, body);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ template: data });
  } catch (error: any) {
    console.error('Update template error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update template' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/templates/:id
 * Delete template
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin(req);
  if (adminCheck) return adminCheck;

  try {
    const { id } = await params;
    const { success, error } = await deleteTemplate(id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success }, { status: 200 });
  } catch (error: any) {
    console.error('Delete template error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete template' },
      { status: 500 }
    );
  }
}
