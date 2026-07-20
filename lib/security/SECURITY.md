# Template Security Implementation

## Overview

This directory contains comprehensive security validation and sanitization for contract templates. The implementation follows a **defense-in-depth** strategy with multiple layers of protection:

1. **Input Validation** - Comprehensive security checks for XSS, malformed HTML, and invalid Handlebars
2. **Sanitization** - DOMPurify-based HTML sanitization at multiple stages
3. **Output Protection** - Automatic sanitization of rendered templates before display

## Architecture

```
┌─────────────────────────────────────────┐
│   Admin Creates/Updates Template         │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Comprehensive Security Validation      │
│  - XSS Detection (script tags, events)  │
│  - HTML Validation (unclosed tags)      │
│  - Handlebars Validation (syntax)       │
└────────────┬────────────────────────────┘
             │
      Fail ──┼── Pass
             ▼       ▼
           Error   Template Input Sanitization
                   (DOMPurify)
                        │
                        ▼
                   ┌─────────────┐
                   │ Save to DB  │
                   └────────┬────┘
                            │
                            ▼
                   ┌────────────────────────┐
                   │ Handlebars Rendering   │
                   │ with User Data         │
                   └────────┬───────────────┘
                            │
                            ▼
                   ┌────────────────────────┐
                   │ Output Sanitization    │
                   │ (DOMPurify)            │
                   └────────┬───────────────┘
                            │
                            ▼
                   ┌────────────────────────┐
                   │ Display to User        │
                   └────────────────────────┘
```

## Components

### 1. `templateValidator.ts` - Comprehensive Security Validation

**Purpose**: Validates templates for security vulnerabilities and syntax errors before they are stored or published.

**Key Features**:
- **XSS Prevention**:
  - Detects and blocks `<script>` tags
  - Detects and blocks event handlers (onclick, onerror, onload, etc.)
  - Detects and blocks `<iframe>`, `<object>`, `<embed>` tags
  
- **HTML Validation**:
  - Checks for unclosed HTML tags
  - Detects malformed HTML structures
  - Warns about deprecated or risky tags
  
- **Handlebars Validation**:
  - Validates Handlebars syntax correctness
  - Detects unclosed block helpers ({{#if}}, {{#each}}, etc.)
  - Prevents malformed template syntax

**Usage**:
```typescript
import { validateTemplateSecurityComprehensive, getSecurityReport } from '@/lib/security';

const template = '<div>{{contractTitle}}</div>';
const result = validateTemplateSecurityComprehensive(template);

if (!result.valid) {
  console.error(getSecurityReport(result));
}
```

**Error Types**:
```typescript
enum SecurityErrorType {
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
```

### 2. `templateSanitizer.ts` - DOMPurify-Based Sanitization

**Purpose**: Removes potentially harmful content from HTML while preserving safe elements and functionality.

**Key Features**:
- **Template Input Sanitization**: Sanitizes templates before they are stored
- **Output Sanitization**: Sanitizes rendered templates before display
- **Strict Mode**: Maximum security with minimal attributes
- **External Resource Detection**: Identifies external images, iframes, scripts
- **Handlebars Preservation**: Maintains Handlebars syntax during sanitization

**Usage**:
```typescript
import { sanitizeTemplateInput, sanitizeRenderedOutput } from '@/lib/security';

// Sanitize template when admin creates/updates
const sanitized = sanitizeTemplateInput(templateHtml);

// Sanitize rendered output before displaying to user
const safe = sanitizeRenderedOutput(renderedHtml);
```

**Configuration**:
```typescript
// Template tags - minimal for contract templates
const DEFAULT_TEMPLATE_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 'b', 'i',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'div', 'span',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'blockquote', 'pre', 'hr',
];

// Safe attributes
const DEFAULT_SAFE_ATTRIBUTES = [
  'class', 'id', 'style', 'title', 'alt',
  'data-contract-type', 'data-contract-lang',
];
```

## Integration Points

### 1. Template Creation (`templateService.ts`)

When admin creates a template:

```typescript
export async function createTemplate(
  request: CreateTemplateRequest,
  userId: string
): Promise<{ data: ContractTemplate | null; error: Error | null }> {
  // Step 1: Comprehensive validation
  const validation = validateTemplateComprehensive(request.template_html);
  if (!validation.valid) {
    return { data: null, error: new Error(...) };
  }

  // Step 2: Sanitize before storage
  const sanitizedHtml = sanitizeTemplateInput(request.template_html);

  // Step 3: Store sanitized version
  const { data, error } = await supabase
    .from('contract_templates')
    .insert({
      ...request,
      template_html: sanitizedHtml, // Use sanitized version
    })
    .select()
    .single();

  return { data, error };
}
```

### 2. Template Publishing

When admin publishes a template:

```typescript
export async function publishTemplate(
  id: string,
  deactivatePrevious: boolean = true,
  adminUserId?: string
): Promise<{ data: ContractTemplate | null; error: Error | null }> {
  const { data: template } = await getTemplateById(id);

  // Comprehensive validation before publishing
  const validation = validateTemplateComprehensive(template.template_html);
  if (!validation.valid) {
    return { 
      data: null, 
      error: new Error(`Cannot publish invalid template: ...`) 
    };
  }

  // ... rest of publish logic
}
```

### 3. Template Rendering

When rendering contract from template:

```typescript
// In templateOrchestrator.ts
export async function renderContract(
  contractType: ContractType,
  language: TemplateLanguage,
  formData: ContractData
): Promise<RenderResult> {
  // ... get template from cache/database/fallback
  
  // Render with Handlebars
  const rendered = renderTemplate(template.template_html, mappedData);
  
  // Step: Sanitize output before returning
  const safe = sanitizeRenderedOutput(rendered);
  
  return {
    html: safe,
    metadata: { ... },
    warnings: [],
  };
}
```

## Security Properties

### Property 1: XSS Prevention
*For any* template containing XSS patterns (script tags, event handlers, iframes), validation SHALL fail before the template is stored or published.

**Examples**:
- `<script>alert("XSS")</script>` → ❌ Validation fails
- `<img onerror="alert('XSS')">` → ❌ Validation fails
- `<iframe src="javascript:alert(1)"></iframe>` → ❌ Validation fails

### Property 2: HTML Integrity
*For any* valid HTML template, rendering and sanitization SHALL preserve all safe tags and attributes.

**Example**:
- Input: `<div class="contract"><p>Content</p></div>`
- Output: `<div class="contract"><p>Content</p></div>` (unchanged)

### Property 3: Handlebars Preservation
*For any* template containing valid Handlebars syntax, sanitization SHALL preserve the Handlebars expressions.

**Example**:
- Input: `<p>{{formatMoney amount}}</p>`
- After sanitization: Handlebars syntax preserved in some form

## Testing

### Running Security Tests

```bash
# Run all security tests
npm test -- security

# Run specific test file
npm test -- lib/security/templateValidator.test.ts

# Run with verbose output
npm test -- --reporter=verbose lib/security/
```

### Test Coverage

- **Unit Tests**: Individual validation and sanitization functions
- **Integration Tests**: Full security pipeline (validation + sanitization + rendering)
- **XSS Vector Tests**: Common XSS attack patterns
- **Real-World Scenarios**: Thai and English contract templates

## Best Practices

### For Admins

1. ✅ Use the Admin Template Editor to create templates
2. ✅ The system will validate before allowing publish
3. ✅ Follow Handlebars syntax: `{{variableName}}`
4. ✅ Use provided helpers: `{{formatMoney amount}}`, `{{formatDate date}}`

### For Developers

1. **Always validate before publishing**:
   ```typescript
   const validation = validateTemplateComprehensive(template);
   if (!validation.valid) throw new Error(...);
   ```

2. **Sanitize inputs and outputs**:
   ```typescript
   const safe = sanitizeTemplateInput(adminTemplate);
   const safRendered = sanitizeRenderedOutput(rendered);
   ```

3. **Use the security module index**:
   ```typescript
   import {
     validateTemplateSecurityComprehensive,
     sanitizeTemplateInput,
     sanitizeRenderedOutput,
   } from '@/lib/security';
   ```

4. **Always log security issues**:
   ```typescript
   logStructured(
     createErrorLog('warn', 'template-validation', 'Invalid template', {
       templateId: id,
       errorCode: 'VALIDATION_ERROR',
      reason: validation.errors.join(', '),
     })
   );
   ```

## Limitations

### Current Limitations

1. **HTML Parser**: Uses regex-based HTML validation (not perfect)
   - May miss some edge cases with deeply nested tags
   - For production, consider using a full HTML parser

2. **Handlebars Preservation**: DOMPurify may escape Handlebars syntax
   - Includes restoration logic but may not cover all cases
   - Test templates thoroughly before publishing

3. **Performance**: Validation is synchronous
   - For very large templates, may cause slight delay
   - Consider async validation for future optimization

### Future Improvements

1. Integrate full HTML5 parser for perfect tag validation
2. Async/parallel validation processing
3. Custom DOMPurify hooks for better Handlebars support
4. Content Security Policy (CSP) integration
5. Rate limiting for template validation API

## Compliance

### Requirements Addressed

- **Requirement 7.6**: Template Validation for Security
  - XSS pattern detection: ✅ Script tags and event handlers
  - Unclosed HTML tags: ✅ Detection in place
  - Unclosed Handlebars blocks: ✅ Detection in place
  - Prevent publishing invalid templates: ✅ Validation gate in publishTemplate()

- **Defense in Depth**:
  - Input sanitization (admin creates template)
  - Output sanitization (user views rendered contract)
  - Multiple validation layers

## References

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [Handlebars.js Security](https://handlebarsjs.com/guide/security.html)
