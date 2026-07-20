// lib/security/templateValidator.ts
// Comprehensive template security validation
// Prevents XSS attacks, malformed HTML, and invalid Handlebars syntax

import Handlebars from 'handlebars';

export interface SecurityValidationResult {
  valid: boolean;
  errors: SecurityError[];
  warnings: SecurityWarning[];
}

export interface SecurityError {
  type: SecurityErrorType;
  message: string;
  line?: number;
  column?: number;
}

export interface SecurityWarning {
  type: SecurityWarningType;
  message: string;
}

export enum SecurityErrorType {
  // XSS Prevention
  XSS_SCRIPT_TAG = 'XSS_SCRIPT_TAG',
  XSS_EVENT_HANDLER = 'XSS_EVENT_HANDLER',
  XSS_IFRAME = 'XSS_IFRAME',
  XSS_OBJECT_EMBED = 'XSS_OBJECT_EMBED',
  
  // HTML Validation
  HTML_UNCLOSED_TAGS = 'HTML_UNCLOSED_TAGS',
  HTML_INVALID_NESTING = 'HTML_INVALID_NESTING',
  
  // Handlebars Validation
  HANDLEBARS_SYNTAX_ERROR = 'HANDLEBARS_SYNTAX_ERROR',
  HANDLEBARS_UNCLOSED_BLOCK = 'HANDLEBARS_UNCLOSED_BLOCK',
  
  // General
  TEMPLATE_EMPTY = 'TEMPLATE_EMPTY',
}

export enum SecurityWarningType {
  EXTERNAL_RESOURCE = 'EXTERNAL_RESOURCE',
  INLINE_STYLE = 'INLINE_STYLE',
  DATA_ATTRIBUTE = 'DATA_ATTRIBUTE',
}

/**
 * Check for XSS vulnerabilities - Script tags
 */
function checkXssScriptTags(template: string): SecurityError[] {
  const errors: SecurityError[] = [];
  
  // Check for script tags (case-insensitive)
  const scriptTagPattern = /<script[^>]*>[\s\S]*?<\/script>/gi;
  const matches = template.matchAll(scriptTagPattern);
  
  for (const match of matches) {
    errors.push({
      type: SecurityErrorType.XSS_SCRIPT_TAG,
      message: 'Script tags are not allowed in templates (XSS vulnerability)',
    });
  }
  
  return errors;
}

/**
 * Check for XSS vulnerabilities - Event handlers
 */
function checkXssEventHandlers(template: string): SecurityError[] {
  const errors: SecurityError[] = [];
  
  // Check for event handlers (onclick, onload, onerror, etc.)
  // Matches: on<word>=<value>
  const eventHandlerPattern = /\bon\w+\s*=\s*["'][^"']*["']/gi;
  const matches = template.matchAll(eventHandlerPattern);
  
  for (const match of matches) {
    errors.push({
      type: SecurityErrorType.XSS_EVENT_HANDLER,
      message: `Event handler detected: ${match[0]} (XSS vulnerability)`,
    });
  }
  
  return errors;
}

/**
 * Check for XSS vulnerabilities - Iframes and similar tags
 */
function checkXssIframesAndEmbeds(template: string): SecurityError[] {
  const errors: SecurityError[] = [];
  
  // Check for iframe tags
  if (/<iframe[^>]*>/gi.test(template)) {
    errors.push({
      type: SecurityErrorType.XSS_IFRAME,
      message: 'iFrame tags are not allowed in templates (potential XSS vulnerability)',
    });
  }
  
  // Check for object and embed tags
  if (/<(object|embed)[^>]*>/gi.test(template)) {
    errors.push({
      type: SecurityErrorType.XSS_OBJECT_EMBED,
      message: 'Object/Embed tags are not allowed in templates (potential XSS vulnerability)',
    });
  }
  
  return errors;
}

/**
 * Check for unclosed HTML tags
 */
function checkUnclosedHtmlTags(template: string): SecurityError[] {
  const errors: SecurityError[] = [];
  
  // Self-closing tags that don't need closing tags
  const selfClosingTags = ['br', 'hr', 'img', 'input', 'meta', 'link', 'source', 'track'];
  
  // Extract all opening tags
  const openTagPattern = /<(\w+)[^>]*>/g;
  const closeTagPattern = /<\/(\w+)>/g;
  
  const openTags: string[] = [];
  let match;
  
  while ((match = openTagPattern.exec(template)) !== null) {
    const tagName = match[1].toLowerCase();
    // Skip self-closing tags and Handlebars blocks
    if (!selfClosingTags.includes(tagName) && !tagName.startsWith('#')) {
      openTags.push(tagName);
    }
  }
  
  const closeTags: string[] = [];
  const closeTagRegex = /<\/(\w+)>/g;
  while ((match = closeTagRegex.exec(template)) !== null) {
    closeTags.push(match[1].toLowerCase());
  }
  
  // Simple check: count should match
  // (This is a basic check - perfect HTML validation requires a full HTML parser)
  const openCounts: Record<string, number> = {};
  const closeCounts: Record<string, number> = {};
  
  for (const tag of openTags) {
    openCounts[tag] = (openCounts[tag] || 0) + 1;
  }
  
  for (const tag of closeTags) {
    closeCounts[tag] = (closeCounts[tag] || 0) + 1;
  }
  
  for (const tag in openCounts) {
    if ((closeCounts[tag] || 0) !== openCounts[tag]) {
      errors.push({
        type: SecurityErrorType.HTML_UNCLOSED_TAGS,
        message: `Unclosed or mismatched tag: <${tag}> (${openCounts[tag]} open, ${closeCounts[tag] || 0} close)`,
      });
    }
  }
  
  return errors;
}

/**
 * Check for Handlebars syntax errors
 */
function checkHandlebarsSyntax(template: string): SecurityError[] {
  const errors: SecurityError[] = [];
  
  try {
    Handlebars.compile(template);
  } catch (e: any) {
    errors.push({
      type: SecurityErrorType.HANDLEBARS_SYNTAX_ERROR,
      message: `Handlebars syntax error: ${e.message}`,
    });
  }
  
  return errors;
}

/**
 * Check for unclosed Handlebars blocks
 */
function checkUnclosedHandlebarsBlocks(template: string): SecurityError[] {
  const errors: SecurityError[] = [];
  
  // Extract block statements {{#block}}...{{/block}}
  const blockPattern = /\{\{#(\w+)[^}]*\}\}/g;
  const endBlockPattern = /\{\{\/(\w+)\}\}/g;
  
  const openBlocks: string[] = [];
  let match;
  
  while ((match = blockPattern.exec(template)) !== null) {
    openBlocks.push(match[1]);
  }
  
  const closeBlocks: string[] = [];
  while ((match = endBlockPattern.exec(template)) !== null) {
    closeBlocks.push(match[1]);
  }
  
  // Check for mismatched blocks
  const blockCounts: Record<string, number> = {};
  for (const block of openBlocks) {
    blockCounts[block] = (blockCounts[block] || 0) + 1;
  }
  
  for (const block of closeBlocks) {
    blockCounts[block] = (blockCounts[block] || 0) - 1;
  }
  
  for (const block in blockCounts) {
    if (blockCounts[block] !== 0) {
      errors.push({
        type: SecurityErrorType.HANDLEBARS_UNCLOSED_BLOCK,
        message: `Unclosed Handlebars block: {{#${block}}} (${blockCounts[block] > 0 ? 'missing' : 'extra'} close block)`,
      });
    }
  }
  
  return errors;
}

/**
 * Check for warnings (not blocking, but should be aware)
 */
function checkWarnings(template: string): SecurityWarning[] {
  const warnings: SecurityWarning[] = [];
  
  // Check for external resources
  if (/<(img|link|script)[^>]*src\s*=\s*["']https?:\/\//i.test(template)) {
    warnings.push({
      type: SecurityWarningType.EXTERNAL_RESOURCE,
      message: 'External resources detected - they may not load in all environments',
    });
  }
  
  // Check for inline styles
  if (/style\s*=\s*["'][^"']*["']/i.test(template)) {
    warnings.push({
      type: SecurityWarningType.INLINE_STYLE,
      message: 'Inline styles detected - consider using CSS classes instead',
    });
  }
  
  // Check for data attributes
  if (/data-\w+\s*=\s*["'][^"']*["']/i.test(template)) {
    warnings.push({
      type: SecurityWarningType.DATA_ATTRIBUTE,
      message: 'Data attributes detected - ensure they are safe',
    });
  }
  
  return warnings;
}

/**
 * Comprehensive template security validation
 * Checks for XSS vulnerabilities, malformed HTML, and invalid Handlebars
 */
export function validateTemplateSecurityComprehensive(template: string): SecurityValidationResult {
  const errors: SecurityError[] = [];
  const warnings: SecurityWarning[] = [];
  
  // Check if template is empty
  if (!template || template.trim() === '') {
    errors.push({
      type: SecurityErrorType.TEMPLATE_EMPTY,
      message: 'Template cannot be empty',
    });
    return { valid: false, errors, warnings };
  }
  
  // Run all security checks
  errors.push(...checkXssScriptTags(template));
  errors.push(...checkXssEventHandlers(template));
  errors.push(...checkXssIframesAndEmbeds(template));
  errors.push(...checkUnclosedHtmlTags(template));
  errors.push(...checkHandlebarsSyntax(template));
  errors.push(...checkUnclosedHandlebarsBlocks(template));
  
  // Run warning checks
  warnings.push(...checkWarnings(template));
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get human-readable security report
 */
export function getSecurityReport(result: SecurityValidationResult): string {
  const lines: string[] = [];
  
  if (result.valid) {
    lines.push('✅ Template passed all security checks');
  } else {
    lines.push('❌ Template has security issues:');
    lines.push('');
    lines.push('Errors:');
    
    for (const error of result.errors) {
      lines.push(`  • [${error.type}] ${error.message}`);
    }
  }
  
  if (result.warnings.length > 0) {
    lines.push('');
    lines.push('Warnings:');
    
    for (const warning of result.warnings) {
      lines.push(`  ⚠ [${warning.type}] ${warning.message}`);
    }
  }
  
  return lines.join('\n');
}
