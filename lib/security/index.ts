// lib/security/index.ts
// Security module exports
// Provides comprehensive template security validation and sanitization

export {
  validateTemplateSecurityComprehensive,
  getSecurityReport,
  SecurityErrorType,
  SecurityWarningType,
  type SecurityValidationResult,
  type SecurityError,
  type SecurityWarning,
} from './templateValidator';

export {
  sanitizeTemplateInput,
  sanitizeRenderedOutput,
  sanitizeRenderedOutputStrict,
  hasExternalResources,
  getSanitizationDiff,
  createSafeTemplatePreview,
  configureDOMPurifyForHandlebars,
  type SanitizationConfig,
} from './templateSanitizer';
