// app/api/admin/templates/route.ts
// List all templates and create new template

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { 
  getAllTemplates, 
  createTemplate,
  getTemplateStats,
} from '@/lib/services/templateService';
import type { CreateTemplateRequest } from '@/lib/types/template';

/**
 * GET /api/admin/templates
 * List all templates with optional filters
 */
export async function GET(req: Request) {
  const adminCheck = await requireAdmin(req);
  if (adminCheck) return adminCheck;

  try {
    const url = new URL(req.url);
    const filters: any = {};

    // Parse filters from query params
    const contractType = url.searchParams.get('contract_type');
    const language = url.searchParams.get('language');
    const isActive = url.searchParams.get('is_active');
    const isDraft = url.searchParams.get('is_draft');
    const stats = url.searchParams.get('stats');

    if (contractType) filters.contract_type = contractType;
    if (language) filters.language = language;
    if (isActive !== null) filters.is_active = isActive === 'true';
    if (isDraft !== null) filters.is_draft = isDraft === 'true';

    // Return stats if requested
    if (stats === 'true') {
      const { data, error } = await getTemplateStats();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json(data);
    }

    // Get templates
    const { data, error } = await getAllTemplates(filters);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ templates: data });
  } catch (error: any) {
    console.error('List templates error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list templates' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/templates
 * Create new template
 */
export async function POST(req: Request) {
  const adminCheck = await requireAdmin(req);
  if (adminCheck) return adminCheck;

  try {
    const body: CreateTemplateRequest = await req.json();

    // Validate required fields
    if (!body.contract_type || !body.name || !body.template_html || !body.variables) {
      return NextResponse.json(
        { error: 'Missing required fields: contract_type, name, template_html, variables' },
        { status: 400 }
      );
    }

    // Get user ID from request (set by requireAdmin middleware)
    const userId = (req as any).adminUser?.id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
    }

    // Create template
    const { data, error } = await createTemplate(body, userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ template: data }, { status: 201 });
  } catch (error: any) {
    console.error('Create template error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create template' },
      { status: 500 }
    );
  }
}
