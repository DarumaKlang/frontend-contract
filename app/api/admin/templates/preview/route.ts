// app/api/admin/templates/preview/route.ts
// Preview template with sample data

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { previewTemplate } from '@/lib/services/templateService';
import type { TemplatePreviewRequest } from '@/lib/types/template';

/**
 * POST /api/admin/templates/preview
 * Preview template rendering with sample data
 */
export async function POST(req: Request) {
  const adminCheck = await requireAdmin(req);
  if (adminCheck) return adminCheck;

  try {
    const body: TemplatePreviewRequest = await req.json();

    if (!body.template_html || !body.sample_data) {
      return NextResponse.json(
        { error: 'Missing required fields: template_html, sample_data' },
        { status: 400 }
      );
    }

    const { rendered, validation } = previewTemplate(
      body.template_html,
      body.template_css || null,
      body.sample_data
    );

    if (!validation.valid) {
      return NextResponse.json({
        rendered: null,
        errors: validation.errors,
        warnings: validation.warnings,
      }, { status: 400 });
    }

    return NextResponse.json({
      rendered,
      errors: validation.errors,
      warnings: validation.warnings,
    });
  } catch (error: any) {
    console.error('Preview template error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to preview template' },
      { status: 500 }
    );
  }
}
