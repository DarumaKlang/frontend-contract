// app/api/admin/templates/versions/route.ts
// Get all versions of a template by contract type and language

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { getAllTemplateVersions } from '@/lib/services/templateService';
import type { ContractType, TemplateLanguage } from '@/lib/types/template';

/**
 * GET /api/admin/templates/versions?contract_type=lease&language=th
 * Get all versions of a template by contract type and language
 */
export async function GET(req: Request) {
  const adminCheck = await requireAdmin(req);
  if (adminCheck) return adminCheck;

  try {
    const url = new URL(req.url);
    const contractType = url.searchParams.get('contract_type');
    const language = url.searchParams.get('language');

    if (!contractType || !language) {
      return NextResponse.json(
        { error: 'Missing required query parameters: contract_type, language' },
        { status: 400 }
      );
    }

    const { data, error } = await getAllTemplateVersions(
      contractType as ContractType,
      language as TemplateLanguage
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ versions: data || [] });
  } catch (error: any) {
    console.error('Get template versions error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get template versions' },
      { status: 500 }
    );
  }
}
