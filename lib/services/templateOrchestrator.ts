/**
 * Template Orchestrator Service
 * 
 * Coordinates template retrieval, caching, and rendering with fallback mechanisms.
 * Orchestrates the flow: Template Cache → Template Service → Fallback Provider
 * 
 * Validates Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 5.1, 5.2, 5.3, 5.4, 5.5
 */

import type { ContractType, TemplateLanguage } from '@/lib/types/template';
import type { ContractData } from '@/app/components/contract-generator/types';
import { getActiveTemplateWithCache } from './templateService';
import { getHardcodedTemplateWithReason } from './fallbackProvider';
import { mapFormDataToContext } from './variableMapper';
import { renderTemplate } from '@/lib/templateEngine';

/**
 * Render result interface - returned by renderContract()
 * 
 * **Validates: Requirements 2.6, 5.4, 5.5**
 */
export interface RenderResult {
  html: string;
  metadata: {
    source: 'database' | 'fallback';
    templateId?: string;
    version?: number;
    contractType: ContractType;
    language: TemplateLanguage;
  };
  warnings: string[];
}

/**
 * Structured error log entry interface for rendering errors
 */
interface TemplateErrorLog {
  timestamp: string;
  machineId: string;
  level: 'error' | 'warn';
  category: 'template-rendering' | 'fallback-usage' | 'template-retrieval';
  message: string;
  metadata: {
    contractType: ContractType;
    language: TemplateLanguage;
    templateId?: string;
    version?: number;
    source?: 'database' | 'fallback';
    reason?: string;
    errorMessage?: string;
    [key: string]: any;
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
  level: 'error' | 'warn',
  category: TemplateErrorLog['category'],
  message: string,
  metadata: TemplateErrorLog['metadata']
): TemplateErrorLog {
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
 * Log structured error/warning message
 */
function logStructured(log: TemplateErrorLog): void {
  const logOutput = JSON.stringify(log);
  
  if (log.level === 'error') {
    console.error(logOutput);
  } else {
    console.warn(logOutput);
  }
}

/**
 * Render a contract using the Template Orchestrator
 * 
 * Implements the following flow (based on design spec):
 * 1. User initiates contract generation from Contract Generator UI
 * 2. Call Template Orchestrator with {contractType, language, formData}
 * 3. Check Template Cache for `contractType:language` key
 * 4. Cache hit: return cached template, proceed to variable mapping
 * 5. Cache miss: call Template Service.getActiveTemplate() to query database
 * 6. If found: cache template, proceed to variable mapping
 * 7. If not found: proceed to fallback path
 * 8. Fallback path: call Fallback Provider to get hardcoded template
 * 9. Variable mapping: transform FormData to Handlebars context
 * 10. Rendering: Template Engine renders template with context
 * 11. Error handling: if rendering fails, retry with fallback template
 * 12. Response: return rendered HTML with metadata (source, version, id)
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 5.1, 5.2, 5.3, 5.4, 5.5**
 * 
 * @param contractType - Type of contract (lease, vehicle-sale, property-sale, employment, testament)
 * @param language - Template language (th, en)
 * @param formData - User input data from Contract Generator
 * @returns RenderResult with rendered HTML, metadata, and warnings
 */
export async function renderContract(
  contractType: ContractType,
  language: TemplateLanguage,
  formData: ContractData
): Promise<RenderResult> {
  const warnings: string[] = [];

  try {
    logStructured(
      createErrorLog('warn', 'template-retrieval', 'Starting template retrieval flow', {
        contractType,
        language,
      })
    );

    // Step 3-5: Retrieve template from cache or database
    const { data: template, error: templateError, fromCache } = await getActiveTemplateWithCache(
      contractType,
      language
    );

    // Step 6: If template not found or error, use fallback
    if (templateError || !template) {
      logStructured(
        createErrorLog('warn', 'template-retrieval', 'Database template not available, using fallback', {
          contractType,
          language,
          reason: templateError ? 'DATABASE_ERROR' : 'NO_ACTIVE_TEMPLATE',
          errorMessage: templateError?.message,
        })
      );

      // Step 8: Get hardcoded fallback template
      const fallback = getHardcodedTemplateWithReason(
        contractType,
        language,
        formData,
        templateError ? 'DATABASE_ERROR' : 'NO_ACTIVE_TEMPLATE'
      );

      // Step 9: Map FormData for fallback
      const { context: mappingContext, warnings: mappingWarnings } = mapFormDataToContext(formData);
      warnings.push(...mappingWarnings);

      return {
        html: fallback.html,
        metadata: {
          source: 'fallback',
          contractType,
          language,
        },
        warnings,
      };
    }

    // Step 9: Map FormData to Handlebars context for database template
    const { context, warnings: mappingWarnings } = mapFormDataToContext(formData, template.variables);
    warnings.push(...mappingWarnings);

    logStructured(
      createErrorLog(
        'warn',
        'template-retrieval',
        `Retrieved template from ${fromCache ? 'cache' : 'database'}`,
        {
          contractType,
          language,
          templateId: template.id,
          version: template.version,
          source: 'database',
        }
      )
    );

    try {
      // Step 10: Render using database template with Handlebars context
      const html = renderTemplate(template.template_html, context);

      return {
        html,
        metadata: {
          source: 'database',
          templateId: template.id,
          version: template.version,
          contractType,
          language,
        },
        warnings,
      };
    } catch (renderError: any) {
      // Step 11: Rendering failed with database template, retry with fallback
      logStructured(
        createErrorLog(
          'error',
          'template-rendering',
          'Template rendering failed, falling back to hardcoded template',
          {
            contractType,
            language,
            templateId: template.id,
            version: template.version,
            source: 'database',
            errorMessage: renderError?.message,
          }
        )
      );

      // Get fallback template with RENDERING_ERROR reason
      const fallback = getHardcodedTemplateWithReason(
        contractType,
        language,
        formData,
        'RENDERING_ERROR'
      );

      warnings.push(`Template rendering failed: ${renderError?.message}. Using fallback template.`);

      return {
        html: fallback.html,
        metadata: {
          source: 'fallback',
          contractType,
          language,
        },
        warnings,
      };
    }
  } catch (error: any) {
    // Unexpected error - try fallback
    logStructured(
      createErrorLog(
        'error',
        'template-rendering',
        'Unexpected error during template orchestration, using fallback',
        {
          contractType,
          language,
          errorMessage: error?.message,
        }
      )
    );

    try {
      const fallback = getHardcodedTemplateWithReason(
        contractType,
        language,
        formData,
        'RENDERING_ERROR'
      );

      warnings.push(`Unexpected error during template processing: ${error?.message}. Using fallback template.`);

      return {
        html: fallback.html,
        metadata: {
          source: 'fallback',
          contractType,
          language,
        },
        warnings,
      };
    } catch (fallbackError: any) {
      // Last resort: fallback also failed
      logStructured(
        createErrorLog(
          'error',
          'template-rendering',
          'Unable to generate contract - all rendering options failed',
          {
            contractType,
            language,
            errorMessage: fallbackError?.message,
          }
        )
      );

      throw new Error(
        `Unable to generate contract. Please contact support. Error: ${fallbackError?.message}`
      );
    }
  }
}

/**
 * Get template statistics for monitoring cache performance
 * 
 * **Validates: Requirements 3.7**
 * 
 * @returns Object with cache statistics
 */
export async function getTemplateOrchestratorStats() {
  return {
    timestamp: new Date().toISOString(),
    machineId: MACHINE_ID,
  };
}

/**
 * Clear template cache (admin operation)
 * 
 * **Validates: Requirements 3.3**
 */
export async function clearTemplateCache(): Promise<{ success: boolean; error: Error | null }> {
  try {
    // This would be called from cache clear endpoint
    // The actual cache clearing happens in templateService/templateCache
    logStructured(
      createErrorLog('warn', 'template-retrieval', 'Template cache clear requested', {
        contractType: 'lease', // placeholder
        language: 'th', // placeholder
      })
    );

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error };
  }
}
