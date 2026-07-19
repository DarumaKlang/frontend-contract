// lib/templateEngine.ts
// Handlebars-based template rendering engine with custom helpers

import Handlebars from 'handlebars';
import { sanitizeHtml } from './sanitize';
import type { TemplateValidationResult } from './types/template';

/**
 * Format date for display
 */
function formatDateHelper(date: any, language: string = 'th'): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (language === 'th') {
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObj);
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Format money with thousand separators
 */
function formatMoneyHelper(amount: any): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0';
  
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Convert number to Thai Baht text
 */
function thaiBahtTextHelper(amount: any): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num) || num < 0) return 'ศูนย์บาทถ้วน';
  
  const thaiNumbers = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const thaiUnits = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
  
  const baht = Math.floor(num);
  const satang = Math.round((num - baht) * 100);
  
  let result = '';
  
  // Convert baht part
  if (baht === 0) {
    result = 'ศูนย์บาท';
  } else {
    const bahtStr = baht.toString();
    const len = bahtStr.length;
    
    for (let i = 0; i < len; i++) {
      const digit = parseInt(bahtStr[i]);
      const position = len - i - 1;
      
      if (digit === 0) continue;
      
      if (position === 1 && digit === 2) {
        result += 'ยี่สิบ';
      } else if (position === 1 && digit === 1) {
        result += 'สิบ';
      } else if (position === 0 && digit === 1 && len > 1) {
        result += 'เอ็ด';
      } else {
        result += thaiNumbers[digit] + thaiUnits[position];
      }
    }
    result += 'บาท';
  }
  
  // Convert satang part
  if (satang === 0) {
    result += 'ถ้วน';
  } else {
    result += formatMoneyHelper(satang) + 'สตางค์';
  }
  
  return result;
}

/**
 * Register all custom Handlebars helpers
 */
function registerHelpers() {
  // Date formatting
  Handlebars.registerHelper('formatDate', formatDateHelper);
  
  // Money formatting
  Handlebars.registerHelper('formatMoney', formatMoneyHelper);
  
  // Thai Baht text
  Handlebars.registerHelper('thaiBahtText', thaiBahtTextHelper);
  
  // Math helpers
  Handlebars.registerHelper('add', (a: number, b: number) => a + b);
  Handlebars.registerHelper('subtract', (a: number, b: number) => a - b);
  Handlebars.registerHelper('multiply', (a: number, b: number) => a * b);
  Handlebars.registerHelper('divide', (a: number, b: number) => b !== 0 ? a / b : 0);
  
  // String helpers
  Handlebars.registerHelper('uppercase', (str: string) => str?.toUpperCase() || '');
  Handlebars.registerHelper('lowercase', (str: string) => str?.toLowerCase() || '');
  Handlebars.registerHelper('capitalize', (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
  
  // Comparison helpers
  Handlebars.registerHelper('eq', (a: any, b: any) => a === b);
  Handlebars.registerHelper('ne', (a: any, b: any) => a !== b);
  Handlebars.registerHelper('lt', (a: any, b: any) => a < b);
  Handlebars.registerHelper('gt', (a: any, b: any) => a > b);
  Handlebars.registerHelper('lte', (a: any, b: any) => a <= b);
  Handlebars.registerHelper('gte', (a: any, b: any) => a >= b);
  
  // Logical helpers
  Handlebars.registerHelper('and', (a: any, b: any) => a && b);
  Handlebars.registerHelper('or', (a: any, b: any) => a || b);
  Handlebars.registerHelper('not', (a: any) => !a);
}

// Register helpers on module load
registerHelpers();

/**
 * Validate template syntax and structure
 */
export function validateTemplate(templateHtml: string): TemplateValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for empty template
  if (!templateHtml || templateHtml.trim() === '') {
    errors.push('Template cannot be empty');
    return { valid: false, errors, warnings };
  }
  
  // Check for script tags (XSS prevention)
  if (/<script[^>]*>/i.test(templateHtml)) {
    errors.push('Script tags are not allowed in templates');
  }
  
  // Check for event handlers (XSS prevention)
  if (/on\w+\s*=/i.test(templateHtml)) {
    errors.push('Event handlers (onclick, onload, etc.) are not allowed');
  }
  
  // Check for external resources
  if (/<(img|iframe|link|embed|object)[^>]*src\s*=\s*["']https?:/i.test(templateHtml)) {
    warnings.push('External resources detected - they may not load in all environments');
  }
  
  // Validate Handlebars syntax
  try {
    Handlebars.compile(templateHtml);
  } catch (e: any) {
    errors.push(`Invalid Handlebars syntax: ${e.message}`);
    return { valid: false, errors, warnings };
  }
  
  // Check for unclosed tags (basic HTML validation)
  const openTags = templateHtml.match(/<(\w+)[^>]*>/g) || [];
  const closeTags = templateHtml.match(/<\/(\w+)>/g) || [];
  const selfClosingTags = ['br', 'hr', 'img', 'input', 'meta', 'link'];
  
  const openTagNames = openTags
    .map(tag => tag.match(/<(\w+)/)?.[1])
    .filter(tag => tag && !selfClosingTags.includes(tag));
  const closeTagNames = closeTags.map(tag => tag.match(/<\/(\w+)>/)?.[1]);
  
  // Simple check (not perfect, but catches obvious issues)
  if (openTagNames.length !== closeTagNames.length) {
    warnings.push('Possible unclosed HTML tags detected');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Render template with data
 */
export function renderTemplate(templateHtml: string, data: Record<string, any>): string {
  try {
    // Compile template
    const template = Handlebars.compile(templateHtml, {
      noEscape: false, // Auto-escape HTML by default
      strict: false,   // Allow missing variables
    });
    
    // Render
    const rendered = template(data);
    
    // Sanitize output (defense in depth)
    return sanitizeHtml(rendered);
  } catch (e: any) {
    console.error('Template rendering error:', e);
    throw new Error(`Failed to render template: ${e.message}`);
  }
}

/**
 * Render template with CSS
 */
export function renderTemplateWithCSS(
  templateHtml: string,
  templateCss: string | null,
  data: Record<string, any>
): string {
  const html = renderTemplate(templateHtml, data);
  
  if (!templateCss) {
    return html;
  }
  
  // Wrap with style tag
  return `<style>${templateCss}</style>${html}`;
}

/**
 * Get list of all available Handlebars helpers
 */
export function getAvailableHelpers(): Record<string, string> {
  return {
    formatDate: 'Format date: {{formatDate date "th"}}',
    formatMoney: 'Format number: {{formatMoney 1000}}',
    thaiBahtText: 'Thai Baht text: {{thaiBahtText 1250}}',
    add: 'Add numbers: {{add 10 20}}',
    subtract: 'Subtract: {{subtract 20 10}}',
    multiply: 'Multiply: {{multiply 10 5}}',
    divide: 'Divide: {{divide 100 5}}',
    uppercase: 'Uppercase: {{uppercase "hello"}}',
    lowercase: 'Lowercase: {{lowercase "HELLO"}}',
    capitalize: 'Capitalize: {{capitalize "hello"}}',
    eq: 'Equal: {{#if (eq a b)}}...{{/if}}',
    ne: 'Not equal: {{#if (ne a b)}}...{{/if}}',
    lt: 'Less than: {{#if (lt a b)}}...{{/if}}',
    gt: 'Greater than: {{#if (gt a b)}}...{{/if}}',
    and: 'Logical AND: {{#if (and a b)}}...{{/if}}',
    or: 'Logical OR: {{#if (or a b)}}...{{/if}}',
    not: 'Logical NOT: {{#if (not a)}}...{{/if}}',
  };
}

/**
 * Extract variables used in template
 */
export function extractVariables(templateHtml: string): string[] {
  const variables = new Set<string>();
  const regex = /\{\{([^}]+)\}\}/g;
  let match;
  
  while ((match = regex.exec(templateHtml)) !== null) {
    const content = match[1].trim();
    
    // Skip helpers and block helpers
    if (content.startsWith('#') || content.startsWith('/') || content.includes(' ')) {
      continue;
    }
    
    variables.add(content);
  }
  
  return Array.from(variables).sort();
}
