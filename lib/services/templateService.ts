// lib/services/templateService.ts
// Service layer for template operations

import { getSupabaseClient } from '@/lib/supabase';
import { renderTemplate, validateTemplate, renderTemplateWithCSS } from '@/lib/templateEngine';
import type {
  ContractTemplate,
  ContractType,
  CreateTemplateRequest,
  TemplateLanguage,
  TemplateListItem,
  TemplateRevision,
  TemplateStats,
  TemplateValidationResult,
  UpdateTemplateRequest,
} from '@/lib/types/template';

/**
 * Get all templates (admin only)
 */
export async function getAllTemplates(filters?: {
  contract_type?: ContractType;
  language?: TemplateLanguage;
  is_active?: boolean;
  is_draft?: boolean;
}): Promise<{ data: TemplateListItem[] | null; error: Error | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  let query = supabase
    .from('contract_templates')
    .select(`
      id,
      contract_type,
      language,
      version,
      name,
      is_active,
      is_draft,
      updated_at,
      created_by
    `)
    .order('updated_at', { ascending: false });

  // Apply filters
  if (filters?.contract_type) {
    query = query.eq('contract_type', filters.contract_type);
  }
  if (filters?.language) {
    query = query.eq('language', filters.language);
  }
  if (filters?.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active);
  }
  if (filters?.is_draft !== undefined) {
    query = query.eq('is_draft', filters.is_draft);
  }

  const { data, error } = await query;

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: data as TemplateListItem[], error: null };
}

/**
 * Get single template by ID
 */
export async function getTemplateById(
  id: string
): Promise<{ data: ContractTemplate | null; error: Error | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  const { data, error } = await supabase
    .from('contract_templates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: data as ContractTemplate, error: null };
}

/**
 * Get active template for rendering contracts
 */
export async function getActiveTemplate(
  contractType: ContractType,
  language: TemplateLanguage = 'th'
): Promise<{ data: ContractTemplate | null; error: Error | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  const { data, error } = await supabase
    .from('contract_templates')
    .select('*')
    .eq('contract_type', contractType)
    .eq('language', language)
    .eq('is_active', true)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: data as ContractTemplate | null, error: null };
}

/**
 * Create new template
 */
export async function createTemplate(
  request: CreateTemplateRequest,
  userId: string
): Promise<{ data: ContractTemplate | null; error: Error | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  // Validate template
  const validation = validateTemplate(request.template_html);
  if (!validation.valid) {
    return { 
      data: null, 
      error: new Error(`Template validation failed: ${validation.errors.join(', ')}`) 
    };
  }

  // Get next version number
  const { data: existing } = await supabase
    .from('contract_templates')
    .select('version')
    .eq('contract_type', request.contract_type)
    .eq('language', request.language)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextVersion = existing ? existing.version + 1 : 1;

  // Insert new template
  const { data, error } = await supabase
    .from('contract_templates')
    .insert({
      contract_type: request.contract_type,
      language: request.language,
      version: nextVersion,
      name: request.name,
      description: request.description || null,
      template_html: request.template_html,
      template_css: request.template_css || null,
      variables: request.variables,
      is_active: false,
      is_draft: true,
      created_by: userId,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: data as ContractTemplate, error: null };
}

/**
 * Update existing template
 */
export async function updateTemplate(
  id: string,
  request: UpdateTemplateRequest
): Promise<{ data: ContractTemplate | null; error: Error | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  // Validate template HTML if provided
  if (request.template_html) {
    const validation = validateTemplate(request.template_html);
    if (!validation.valid) {
      return { 
        data: null, 
        error: new Error(`Template validation failed: ${validation.errors.join(', ')}`) 
      };
    }
  }

  const updateData: any = {};
  if (request.name !== undefined) updateData.name = request.name;
  if (request.description !== undefined) updateData.description = request.description;
  if (request.template_html !== undefined) updateData.template_html = request.template_html;
  if (request.template_css !== undefined) updateData.template_css = request.template_css;
  if (request.variables !== undefined) updateData.variables = request.variables;
  if (request.is_draft !== undefined) updateData.is_draft = request.is_draft;

  const { data, error } = await supabase
    .from('contract_templates')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: data as ContractTemplate, error: null };
}

/**
 * Delete template
 */
export async function deleteTemplate(
  id: string
): Promise<{ success: boolean; error: Error | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: new Error('Supabase not configured') };
  }

  // Check if template is active
  const { data: template } = await getTemplateById(id);
  if (template?.is_active) {
    return { 
      success: false, 
      error: new Error('Cannot delete active template. Deactivate it first.') 
    };
  }

  const { error } = await supabase
    .from('contract_templates')
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false, error: new Error(error.message) };
  }

  return { success: true, error: null };
}

/**
 * Publish template (set as active)
 */
export async function publishTemplate(
  id: string,
  deactivatePrevious: boolean = true
): Promise<{ data: ContractTemplate | null; error: Error | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  // Get template
  const { data: template, error: fetchError } = await getTemplateById(id);
  if (fetchError || !template) {
    return { data: null, error: fetchError || new Error('Template not found') };
  }

  // Validate before publishing
  const validation = validateTemplate(template.template_html);
  if (!validation.valid) {
    return { 
      data: null, 
      error: new Error(`Cannot publish invalid template: ${validation.errors.join(', ')}`) 
    };
  }

  // Deactivate previous active template if requested
  if (deactivatePrevious) {
    await supabase
      .from('contract_templates')
      .update({ is_active: false })
      .eq('contract_type', template.contract_type)
      .eq('language', template.language)
      .eq('is_active', true);
  }

  // Activate this template
  const { data, error } = await supabase
    .from('contract_templates')
    .update({ 
      is_active: true,
      is_draft: false,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: data as ContractTemplate, error: null };
}

/**
 * Unpublish template (deactivate)
 */
export async function unpublishTemplate(
  id: string
): Promise<{ data: ContractTemplate | null; error: Error | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  const { data, error } = await supabase
    .from('contract_templates')
    .update({ is_active: false })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: data as ContractTemplate, error: null };
}

/**
 * Get template revision history
 */
export async function getTemplateRevisions(
  templateId: string
): Promise<{ data: TemplateRevision[] | null; error: Error | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  const { data, error } = await supabase
    .from('template_revisions')
    .select('*')
    .eq('template_id', templateId)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: data as TemplateRevision[], error: null };
}

/**
 * Preview template with sample data
 */
export function previewTemplate(
  templateHtml: string,
  templateCss: string | null,
  sampleData: Record<string, any>
): { rendered: string | null; validation: TemplateValidationResult } {
  const validation = validateTemplate(templateHtml);
  
  if (!validation.valid) {
    return { rendered: null, validation };
  }

  try {
    const rendered = renderTemplateWithCSS(templateHtml, templateCss, sampleData);
    return { rendered, validation };
  } catch (error: any) {
    validation.valid = false;
    validation.errors.push(`Rendering error: ${error.message}`);
    return { rendered: null, validation };
  }
}

/**
 * Get template statistics
 */
export async function getTemplateStats(): Promise<{ 
  data: TemplateStats | null; 
  error: Error | null 
}> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  const { data: templates, error } = await supabase
    .from('contract_templates')
    .select('contract_type, language, is_active, is_draft');

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  const { data: revisions } = await supabase
    .from('template_revisions')
    .select('id', { count: 'exact', head: true });

  const stats: TemplateStats = {
    total_templates: templates.length,
    active_templates: templates.filter(t => t.is_active).length,
    draft_templates: templates.filter(t => t.is_draft).length,
    total_revisions: revisions?.length || 0,
    by_contract_type: {} as Record<ContractType, number>,
    by_language: {} as Record<TemplateLanguage, number>,
    recently_updated: [],
  };

  // Count by contract type
  templates.forEach(t => {
    const type = t.contract_type as ContractType;
    stats.by_contract_type[type] = (stats.by_contract_type[type] || 0) + 1;
  });

  // Count by language
  templates.forEach(t => {
    const lang = t.language as TemplateLanguage;
    stats.by_language[lang] = (stats.by_language[lang] || 0) + 1;
  });

  return { data: stats, error: null };
}
