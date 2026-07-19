// app/api/templates/render/route.ts
// Public API to render contract using active template

import { NextResponse } from 'next/server';
import { getActiveTemplate } from '@/lib/services/templateService';
import { renderTemplateWithCSS } from '@/lib/templateEngine';
import type { ContractType, TemplateLanguage } from '@/lib/types/template';

interface RenderRequest {
  contract_type: ContractType;
  language?: TemplateLanguage;
  data: Record<string, any>;
}

/**
 * POST /api/templates/render
 * Render contract using active template (public endpoint)
 */
export async function POST(req: Request) {
  try {
    const body: RenderRequest = await req.json();

    if (!body.contract_type || !body.data) {
      return NextResponse.json(
        { error: 'Missing required fields: contract_type, data' },
        { status: 400 }
      );
    }

    const language = body.language || 'th';

    // Get active template
    const { data: template, error } = await getActiveTemplate(
      body.contract_type,
      language
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!template) {
      return NextResponse.json(
        { error: `No active template found for ${body.contract_type} (${language})` },
        { status: 404 }
      );
    }

    // Render template
    try {
      const rendered = renderTemplateWithCSS(
        template.template_html,
        template.template_css,
        body.data
      );

      return NextResponse.json({
        html: rendered,
        template_id: template.id,
        template_version: template.version,
      });
    } catch (renderError: any) {
      console.error('Template rendering error:', renderError);
      return NextResponse.json(
        { error: `Rendering failed: ${renderError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Render template error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to render template' },
      { status: 500 }
    );
  }
}
