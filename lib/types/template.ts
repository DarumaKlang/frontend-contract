// lib/types/template.ts
// TypeScript types for contract template system

export type ContractType = 'lease' | 'vehicle-sale' | 'property-sale' | 'employment' | 'testament';
export type TemplateLanguage = 'th' | 'en';

/**
 * Variable definition in template
 */
export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array' | 'object';
  description: string;
  required?: boolean;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: string[];
  };
}

/**
 * Contract template stored in database
 */
export interface ContractTemplate {
  id: string;
  contract_type: ContractType;
  language: TemplateLanguage;
  version: number;
  
  // Content
  template_html: string;
  template_css: string | null;
  variables: TemplateVariable[];
  
  // Metadata
  name: string;
  description: string | null;
  
  // Status
  is_active: boolean;
  is_draft: boolean;
  
  // Audit
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Template revision/history entry
 */
export interface TemplateRevision {
  id: string;
  template_id: string;
  content: {
    template_html: string;
    template_css: string | null;
    variables: TemplateVariable[];
    name: string;
    description: string | null;
    is_active: boolean;
    is_draft: boolean;
  };
  change_note: string | null;
  changed_fields: string[];
  created_by: string | null;
  created_at: string;
}

/**
 * Request body for creating new template
 */
export interface CreateTemplateRequest {
  contract_type: ContractType;
  language: TemplateLanguage;
  name: string;
  description?: string;
  template_html: string;
  template_css?: string;
  variables: TemplateVariable[];
}

/**
 * Request body for updating template
 */
export interface UpdateTemplateRequest {
  name?: string;
  description?: string;
  template_html?: string;
  template_css?: string;
  variables?: TemplateVariable[];
  is_draft?: boolean;
  change_note?: string;
}

/**
 * Request body for publishing template
 */
export interface PublishTemplateRequest {
  deactivate_previous?: boolean;
}

/**
 * Template validation result
 */
export interface TemplateValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Template list item (for admin UI)
 */
export interface TemplateListItem {
  id: string;
  contract_type: ContractType;
  language: TemplateLanguage;
  version: number;
  name: string;
  is_active: boolean;
  is_draft: boolean;
  updated_at: string;
  created_by_email?: string;
}

/**
 * Template preview request
 */
export interface TemplatePreviewRequest {
  template_html: string;
  template_css?: string;
  sample_data: Record<string, any>;
}

/**
 * Template preview response
 */
export interface TemplatePreviewResponse {
  rendered_html: string;
  errors: string[];
  warnings: string[];
}

/**
 * Template statistics (for dashboard)
 */
export interface TemplateStats {
  total_templates: number;
  active_templates: number;
  draft_templates: number;
  total_revisions: number;
  by_contract_type: Record<ContractType, number>;
  by_language: Record<TemplateLanguage, number>;
  recently_updated: TemplateListItem[];
}
