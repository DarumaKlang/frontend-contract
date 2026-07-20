// lib/services/templateService.ts
// Service layer for template operations

import { getSupabaseClient } from '@/lib/supabase';
import { renderTemplate, validateTemplate, renderTemplateWithCSS } from '@/lib/templateEngine';
import { getTemplateCache } from '@/lib/cache/templateCache';
import { addErrorLog } from '@/lib/errorLogStore';
import {
  validateTemplateSecurityComprehensive,
  sanitizeTemplateInput,
  sanitizeRenderedOutput,
} from '@/lib/security';
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
 * Structured error log entry interface
 */
export interface StructuredErrorLog {
  timestamp: string; // ISO 8601 format
  machineId: string;
  level: 'info' | 'warn' | 'error';
  category:
    | 'template-retrieval'
    | 'template-rendering'
    | 'template-validation'
    | 'template-publish'
    | 'template-update'
    | 'cache-operation'
    | 'fallback-usage'
    | 'migration';
  message: string;
  metadata: {
    contractType?: ContractType;
    language?: TemplateLanguage;
    templateId?: string;
    version?: number;
    userId?: string;
    errorCode?: string;
    reason?: string;
    [key: string]: any;
  };
}

/**
 * Comprehensive template validation combining security and syntax checks
 */
export function validateTemplateComprehensive(templateHtml: string): TemplateValidationResult {
  // Step 1: Security validation (comprehensive)
  const securityResult = validateTemplateSecurityComprehensive(templateHtml);
  
  // Step 2: Basic template engine validation
  const engineValidation = validateTemplate(templateHtml);
  
  // Combine results: if either fails, the template is invalid
  const errors = [
    ...securityResult.errors.map(e => e.message),
    ...engineValidation.errors,
  ];
  
  const warnings = [
    ...securityResult.warnings.map(w => w.message),
    ...(engineValidation.warnings || []),
  ];
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Machine ID for logging and traceability
 */
const MACHINE_ID = process.env.MACHINE_ID || '859ce793f7ba2ce7bb7651a979df1b1147968b804950b29cb46511dc1ca2e679';

/**
 * Create a structured error log entry
 */
function createErrorLog(
  level: 'info' | 'warn' | 'error',
  category: StructuredErrorLog['category'],
  message: string,
  metadata: StructuredErrorLog['metadata'] = {}
): StructuredErrorLog {
  return {
    timestamp: new Date().toISOString(),
    machineId: MACHINE_ID,
    level,
    category,
    message,
    metadata,
  };
}

/**
 * Log structured error/info/warning message
 */
function logStructured(log: StructuredErrorLog): void {
  const logOutput = JSON.stringify(log);
  
  // Add to in-memory error log store for aggregation endpoint
  addErrorLog(log);
  
  if (log.level === 'error') {
    console.error(logOutput);
  } else if (log.level === 'warn') {
    console.warn(logOutput);
  } else {
    console.log(logOutput);
  }
}

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
 * Get active template with cache integration
 * 
 * This method checks the Template Cache first before querying the database.
 * On cache hit, returns the cached template immediately.
 * On cache miss, queries the database and updates the cache.
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3, 3.3, 3.5**
 * 
 * @param contractType - The contract type
 * @param language - The template language (default: 'th')
 * @returns Object with data (template or null), error, and fromCache flag
 */
export async function getActiveTemplateWithCache(
  contractType: ContractType,
  language: TemplateLanguage = 'th'
): Promise<{ data: ContractTemplate | null; error: Error | null; fromCache: boolean }> {
  const cache = getTemplateCache();

  // Check cache first
  const cachedTemplate = cache.get(contractType, language);
  if (cachedTemplate) {
    logStructured(
      createErrorLog('info', 'cache-operation', 'Cache hit for template', {
        contractType,
        language,
      })
    );
    return { data: cachedTemplate, error: null, fromCache: true };
  }

  // Cache miss - query database
  logStructured(
    createErrorLog('info', 'cache-operation', 'Cache miss for template', {
      contractType,
      language,
    })
  );

  const { data: template, error } = await getActiveTemplate(contractType, language);

  if (error) {
    logStructured(
      createErrorLog('error', 'template-retrieval', 'Failed to retrieve template from database', {
        contractType,
        language,
        errorCode: 'DB_QUERY_ERROR',
        reason: error.message,
      })
    );
    return { data: null, error, fromCache: false };
  }

  // Store in cache if template exists
  if (template) {
    cache.set(contractType, language, template);
    logStructured(
      createErrorLog('info', 'cache-operation', 'Template cached successfully', {
        contractType,
        language,
        templateId: template.id,
        version: template.version,
      })
    );
  }

  return { data: template, error: null, fromCache: false };
}

/**
 * Get the maximum version number for a given contract type and language
 * 
 * This helper method queries the database to find the highest version
 * number among all templates of the specified type and language.
 * If no templates exist for this combination, returns 0.
 * 
 * **Validates: Requirements 9.1**
 * 
 * @param contractType - The contract type
 * @param language - The template language
 * @returns The maximum version number, or 0 if no templates exist
 */
export async function getMaxVersion(
  contractType: ContractType,
  language: TemplateLanguage
): Promise<number> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return 0;
  }

  const { data: existing } = await supabase
    .from('contract_templates')
    .select('version')
    .eq('contract_type', contractType)
    .eq('language', language)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();

  return existing ? existing.version : 0;
}

/**
 * Create new template
 * 
 * Creates a new template version by querying the maximum existing version
 * for the contract type and language, then incrementing it by 1.
 * If no templates exist for that combination, version number starts at 1.
 * 
 * **Validates: Requirements 9.1**
 */
export async function createTemplate(
  request: CreateTemplateRequest,
  userId: string
): Promise<{ data: ContractTemplate | null; error: Error | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  // Comprehensive security + syntax validation
  const validation = validateTemplateComprehensive(request.template_html);
  if (!validation.valid) {
    logStructured(
      createErrorLog('warn', 'template-validation', 'Template validation failed during creation', {
        errorCode: 'VALIDATION_ERROR',
        reason: validation.errors.join(', '),
        userId,
      })
    );
    return { 
      data: null, 
      error: new Error(`Template validation failed: ${validation.errors.join(', ')}`) 
    };
  }

  // Sanitize template HTML before storage (defense in depth)
  const sanitizedHtml = sanitizeTemplateInput(request.template_html);

  // Get next version number using helper method
  const maxVersion = await getMaxVersion(request.contract_type, request.language);
  const nextVersion = maxVersion + 1;

  // Insert new template
  const { data, error } = await supabase
    .from('contract_templates')
    .insert({
      contract_type: request.contract_type,
      language: request.language,
      version: nextVersion,
      name: request.name,
      description: request.description || null,
      template_html: sanitizedHtml, // Use sanitized version
      template_css: request.template_css || null,
      variables: request.variables,
      is_active: false,
      is_draft: true,
      created_by: userId,
    })
    .select()
    .single();

  if (error) {
    logStructured(
      createErrorLog('error', 'template-update', 'Failed to create template', {
        contractType: request.contract_type,
        language: request.language,
        errorCode: 'DB_INSERT_ERROR',
        reason: error.message,
        userId,
      })
    );
    return { data: null, error: new Error(error.message) };
  }

  logStructured(
    createErrorLog('info', 'template-validation', 'Template created successfully', {
      templateId: (data as ContractTemplate).id,
      contractType: request.contract_type,
      language: request.language,
      version: nextVersion,
      userId,
    })
  );

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

  // Get template first to retrieve its contract type and language for cache invalidation
  const { data: existingTemplate, error: fetchError } = await getTemplateById(id);
  if (fetchError || !existingTemplate) {
    logStructured(
      createErrorLog('error', 'template-update', 'Failed to retrieve template for update', {
        templateId: id,
        errorCode: 'TEMPLATE_NOT_FOUND',
        reason: fetchError?.message || 'Template not found',
      })
    );
    return { data: null, error: fetchError || new Error('Template not found') };
  }

  // Validate template HTML if provided
  if (request.template_html) {
    const validation = validateTemplateComprehensive(request.template_html);
    if (!validation.valid) {
      logStructured(
        createErrorLog('warn', 'template-update', 'Template validation failed during update', {
          templateId: id,
          contractType: existingTemplate.contract_type,
          language: existingTemplate.language,
          errorCode: 'VALIDATION_ERROR',
          reason: validation.errors.join(', '),
        })
      );
      return { 
        data: null, 
        error: new Error(`Template validation failed: ${validation.errors.join(', ')}`) 
      };
    }
  }

  const updateData: any = {};
  if (request.name !== undefined) updateData.name = request.name;
  if (request.description !== undefined) updateData.description = request.description;
  if (request.template_html !== undefined) {
    // Sanitize HTML before storing
    updateData.template_html = sanitizeTemplateInput(request.template_html);
  }
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
    logStructured(
      createErrorLog('error', 'template-update', 'Database update failed', {
        templateId: id,
        contractType: existingTemplate.contract_type,
        language: existingTemplate.language,
        errorCode: 'DB_UPDATE_ERROR',
        reason: error.message,
      })
    );
    return { data: null, error: new Error(error.message) };
  }

  // Invalidate cache after successful update
  const cache = getTemplateCache();
  cache.invalidate(existingTemplate.contract_type, existingTemplate.language);
  logStructured(
    createErrorLog('info', 'cache-operation', 'Cache invalidated after template update', {
      templateId: id,
      contractType: existingTemplate.contract_type,
      language: existingTemplate.language,
      version: (data as ContractTemplate).version,
    })
  );

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
  deactivatePrevious: boolean = true,
  adminUserId?: string
): Promise<{ data: ContractTemplate | null; error: Error | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  // Get template
  const { data: template, error: fetchError } = await getTemplateById(id);
  if (fetchError || !template) {
    logStructured(
      createErrorLog('error', 'template-publish', 'Failed to retrieve template for publishing', {
        templateId: id,
        errorCode: 'TEMPLATE_NOT_FOUND',
        reason: fetchError?.message || 'Template not found',
      })
    );
    return { data: null, error: fetchError || new Error('Template not found') };
  }

  // Validate before publishing (comprehensive security + syntax check)
  const validation = validateTemplateComprehensive(template.template_html);
  if (!validation.valid) {
    logStructured(
      createErrorLog('warn', 'template-publish', 'Cannot publish invalid template', {
        templateId: id,
        contractType: template.contract_type,
        language: template.language,
        version: template.version,
        errorCode: 'VALIDATION_ERROR',
        reason: validation.errors.join(', '),
        adminUserId,
      })
    );
    return { 
      data: null, 
      error: new Error(`Cannot publish invalid template: ${validation.errors.join(', ')}`) 
    };
  }

  let previousTemplateId: string | null = null;
  let previousTemplateVersion: number | null = null;

  // Query for existing active template BEFORE deactivating
  if (deactivatePrevious) {
    const { data: existingActive } = await supabase
      .from('contract_templates')
      .select('id, version')
      .eq('contract_type', template.contract_type)
      .eq('language', template.language)
      .eq('is_active', true)
      .order('version', { ascending: false })
      .limit(1)
      .single();

    if (existingActive) {
      previousTemplateId = existingActive.id;
      previousTemplateVersion = existingActive.version;
    }

    // Deactivate previous active template
    const deactivateError = await supabase
      .from('contract_templates')
      .update({ is_active: false })
      .eq('contract_type', template.contract_type)
      .eq('language', template.language)
      .eq('is_active', true);
    
    if (deactivateError.error) {
      logStructured(
        createErrorLog('warn', 'template-publish', 'Failed to deactivate previous template', {
          templateId: id,
          previousTemplateId,
          contractType: template.contract_type,
          language: template.language,
          errorCode: 'DEACTIVATE_ERROR',
          reason: deactivateError.error.message,
        })
      );
      // Continue anyway - this is not critical
    } else if (previousTemplateId) {
      // Log the deactivation event
      logStructured(
        createErrorLog('info', 'template-publish', 'Previous active template deactivated', {
          templateId: previousTemplateId,
          previousVersion: previousTemplateVersion,
          newTemplateId: id,
          newTemplateVersion: template.version,
          contractType: template.contract_type,
          language: template.language,
          userId: adminUserId,
          eventType: 'TEMPLATE_DEACTIVATED',
        })
      );
    }
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
    logStructured(
      createErrorLog('error', 'template-publish', 'Failed to publish template', {
        templateId: id,
        contractType: template.contract_type,
        language: template.language,
        version: template.version,
        errorCode: 'DB_UPDATE_ERROR',
        reason: error.message,
      })
    );
    return { data: null, error: new Error(error.message) };
  }

  // Invalidate cache after successful publish
  const cache = getTemplateCache();
  cache.invalidate(template.contract_type, template.language);
  logStructured(
    createErrorLog('info', 'cache-operation', 'Cache invalidated after template publish', {
      templateId: id,
      contractType: template.contract_type,
      language: template.language,
      version: (data as ContractTemplate).version,
    })
  );

  logStructured(
    createErrorLog('info', 'template-publish', 'Template published successfully', {
      templateId: id,
      previousTemplateId,
      contractType: template.contract_type,
      language: template.language,
      version: (data as ContractTemplate).version,
      userId: adminUserId,
      eventType: 'TEMPLATE_ACTIVATED',
    })
  );

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
 * Get all versions of a template by contract type and language
 */
export async function getAllTemplateVersions(
  contractType: ContractType,
  language: TemplateLanguage
): Promise<{ data: ContractTemplate[] | null; error: Error | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  const { data, error } = await supabase
    .from('contract_templates')
    .select('*')
    .eq('contract_type', contractType)
    .eq('language', language)
    .order('version', { ascending: false });

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: data as ContractTemplate[], error: null };
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
