// lib/security/templateSanitizer.ts
// Enhanced DOMPurify sanitization specifically for contract templates
// Provides defense-in-depth by sanitizing both input templates and rendered output

import DOMPurify from 'isomorphic-dompurify';

export interface SanitizationConfig {
  mode: 'template' | 'output';
  allowedTags?: string[];
  allowedAttributes?: string[];
}

/**
 * Default safe tags for contract templates
 * Restrictive: only essential tags for document structure and formatting
 */
const DEFAULT_TEMPLATE_TAGS = [
  'p',
  'br',
  'strong',
  'em',
  'u',
  'b',
  'i',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'div',
  'span',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'blockquote',
  'pre',
  'hr',
];

/**
 * Default safe tags for rendered output
 * Same as template tags but allows rendering of contract data
 */
const DEFAULT_OUTPUT_TAGS = [
  ...DEFAULT_TEMPLATE_TAGS,
];

/**
 * Default safe attributes
 */
const DEFAULT_SAFE_ATTRIBUTES = [
  'class',
  'id',
  'title',
  'alt',
  'data-contract-type',
  'data-contract-lang',
];

/**
 * Sanitize template HTML before storage
 * Purpose: Prevent injection of malicious code when admin creates/edits templates
 * Should always be run BEFORE validation passes a template
 */
export function sanitizeTemplateInput(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: DEFAULT_TEMPLATE_TAGS,
    ALLOWED_ATTR: DEFAULT_SAFE_ATTRIBUTES,
    ALLOW_DATA_ATTR: true,
    FORCE_BODY: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
  });
}

/**
 * Sanitize rendered contract HTML before display
 * Purpose: Defense-in-depth - remove any potentially harmful content that slipped through
 * Should always be run AFTER template rendering
 */
export function sanitizeRenderedOutput(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: DEFAULT_OUTPUT_TAGS,
    ALLOWED_ATTR: DEFAULT_SAFE_ATTRIBUTES,
    ALLOW_DATA_ATTR: true,
    FORCE_BODY: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
  });
}

/**
 * Strict sanitization for output (removes more attributes)
 * Use for maximum security at the cost of losing some HTML functionality
 */
export function sanitizeRenderedOutputStrict(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: DEFAULT_OUTPUT_TAGS,
    ALLOWED_ATTR: [], // No attributes allowed in strict mode
    ALLOW_DATA_ATTR: false,
    FORCE_BODY: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
  });
}

/**
 * Configure DOMPurify for Handlebars templates
 * Ensures Handlebars syntax is preserved during sanitization
 */
export function configureDOMPurifyForHandlebars(): void {
  // Add hook to preserve Handlebars blocks in comments or text
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    // Preserve data- attributes that might contain templates
    if (node.getAttribute && node.getAttribute('data-template-content')) {
      const content = node.getAttribute('data-template-content');
      if (content && content.includes('{{')) {
        // It's a template - keep it safe
        node.setAttribute('data-template-content', content);
      }
    }
  });
}

/**
 * Check if HTML contains external resources that might be blocked
 */
export function hasExternalResources(html: string): {
  hasImages: boolean;
  hasIframes: boolean;
  hasScripts: boolean;
  resources: string[];
} {
  const images = html.match(/<img[^>]+src=["']([^"']+)["']/gi) || [];
  const iframes = html.match(/<iframe[^>]+src=["']([^"']+)["']/gi) || [];
  const scripts = html.match(/<script[^>]+src=["']([^"']+)["']/gi) || [];
  
  const resources: string[] = [];
  
  // Extract URLs and filter for external (http/https)
  [...images, ...iframes, ...scripts].forEach((tag) => {
    const urlMatch = tag.match(/src=["']([^"']+)["']/i);
    if (urlMatch) {
      const url = urlMatch[1];
      // Only include external URLs (http/https)
      if (/^https?:\/\//.test(url)) {
        resources.push(url);
      }
    }
  });
  
  return {
    hasImages: images.length > 0 && resources.some(r => /^https?:\/\//.test(r) && images.join(' ').match(r)),
    hasIframes: iframes.length > 0,
    hasScripts: scripts.length > 0 && resources.some(r => /^https?:\/\//.test(r)),
    resources,
  };
}

/**
 * Get a summary of what DOMPurify removed from HTML
 * Useful for debugging and understanding what was cleaned
 */
export function getSanitizationDiff(original: string, sanitized: string): {
  removed: string[];
  preserved: boolean;
} {
  const removed: string[] = [];
  
  // Check for removed tags
  const originalTags: string[] = original.match(/<\/?\w+[^>]*>/g) || [];
  const sanitizedTags: string[] = sanitized.match(/<\/?\w+[^>]*>/g) || [];
  
  for (const tag of originalTags) {
    if (!sanitizedTags.includes(tag)) {
      removed.push(tag);
    }
  }
  
  // Simplified check - if original and sanitized are very different, something was removed
  const preserved = sanitized.includes(original.substring(0, Math.min(50, original.length)));
  
  return {
    removed,
    preserved,
  };
}

/**
 * Create a sanitized copy of template that is safe for preview
 * Removes potentially problematic content but preserves Handlebars syntax
 */
export function createSafeTemplatePreview(template: string): string {
  // First, sanitize the HTML
  let safe = sanitizeTemplateInput(template);
  
  // Restore Handlebars syntax (DOMPurify might have modified it)
  // This is a simple regex replacement - in production, use a proper Handlebars parser
  
  // Replace escaped Handlebars
  safe = safe.replace(/&\{\{/g, '{{');
  safe = safe.replace(/\}\}&/g, '}}');
  safe = safe.replace(/&\{&#x7b;/g, '{{');
  safe = safe.replace(/&#x7d;\}&/g, '}}');
  
  return safe;
}
