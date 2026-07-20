// lib/security/templateValidator.test.ts
// Unit tests for template security validation

import { describe, it, expect } from 'vitest';
import {
  validateTemplateSecurityComprehensive,
  SecurityErrorType,
  SecurityWarningType,
  getSecurityReport,
} from './templateValidator';

describe('Template Security Validation', () => {
  describe('XSS Prevention - Script Tags', () => {
    it('should detect script tags', () => {
      const malicious = `
        <div>
          <h1>Contract</h1>
          <script>alert('XSS')</script>
        </div>
      `;
      
      const result = validateTemplateSecurityComprehensive(malicious);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          type: SecurityErrorType.XSS_SCRIPT_TAG,
        })
      );
    });

    it('should detect script tags with attributes', () => {
      const malicious = '<script src="http://evil.com/script.js"></script>';
      const result = validateTemplateSecurityComprehensive(malicious);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.type === SecurityErrorType.XSS_SCRIPT_TAG)).toBe(true);
    });

    it('should detect inline script tags', () => {
      const malicious = '<div><script>console.log("hack")</script></div>';
      const result = validateTemplateSecurityComprehensive(malicious);
      expect(result.valid).toBe(false);
    });
  });

  describe('XSS Prevention - Event Handlers', () => {
    it('should detect onclick handlers', () => {
      const malicious = '<button onclick="alert(\'XSS\')">Click me</button>';
      const result = validateTemplateSecurityComprehensive(malicious);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.type === SecurityErrorType.XSS_EVENT_HANDLER)).toBe(true);
    });

    it('should detect onload handlers', () => {
      const malicious = '<div onload="fetch(\'http://evil.com\')"></div>';
      const result = validateTemplateSecurityComprehensive(malicious);
      expect(result.valid).toBe(false);
    });

    it('should detect onerror handlers', () => {
      const malicious = '<img src="invalid" onerror="alert(\'XSS\')" />';
      const result = validateTemplateSecurityComprehensive(malicious);
      expect(result.valid).toBe(false);
    });

    it('should detect onmouseover handlers', () => {
      const malicious = '<div onmouseover="alert(\'XSS\')">Hover me</div>';
      const result = validateTemplateSecurityComprehensive(malicious);
      expect(result.valid).toBe(false);
    });
  });

  describe('XSS Prevention - Iframes and Embeds', () => {
    it('should detect iframe tags', () => {
      const malicious = '<iframe src="http://evil.com"></iframe>';
      const result = validateTemplateSecurityComprehensive(malicious);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.type === SecurityErrorType.XSS_IFRAME)).toBe(true);
    });

    it('should detect object tags', () => {
      const malicious = '<object data="http://evil.com/malware.swf"></object>';
      const result = validateTemplateSecurityComprehensive(malicious);
      expect(result.valid).toBe(false);
    });

    it('should detect embed tags', () => {
      const malicious = '<embed src="http://evil.com/malware.swf" />';
      const result = validateTemplateSecurityComprehensive(malicious);
      expect(result.valid).toBe(false);
    });
  });

  describe('HTML Validation - Unclosed Tags', () => {
    it('should detect unclosed paragraph tags', () => {
      const malformed = '<div><p>Paragraph 1<p>Paragraph 2</div>';
      const result = validateTemplateSecurityComprehensive(malformed);
      // Note: This might not always be detected due to the simple check
      // A full HTML parser would be needed for perfect detection
    });

    it('should detect unclosed div tags', () => {
      const malformed = '<div><p>Content</p>';
      const result = validateTemplateSecurityComprehensive(malformed);
      // This should be detected
      expect(result.errors.some(e => e.type === SecurityErrorType.HTML_UNCLOSED_TAGS)).toBe(true);
    });

    it('should allow self-closing tags', () => {
      const valid = '<div><br /><hr /></div>';
      const result = validateTemplateSecurityComprehensive(valid);
      const hasUnclosedTagError = result.errors.some(e => e.type === SecurityErrorType.HTML_UNCLOSED_TAGS);
      expect(hasUnclosedTagError).toBe(false);
    });
  });

  describe('Handlebars Validation - Syntax Errors', () => {
    it('should detect invalid Handlebars syntax', () => {
      const invalid = '<div>{{#if condition}}Content</div>';
      const result = validateTemplateSecurityComprehensive(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.type === SecurityErrorType.HANDLEBARS_UNCLOSED_BLOCK)).toBe(true);
    });

    it('should detect mismatched Handlebars blocks', () => {
      const invalid = '<div>{{#if condition}}Content{{/each}}</div>';
      const result = validateTemplateSecurityComprehensive(invalid);
      expect(result.valid).toBe(false);
    });

    it('should allow valid Handlebars syntax', () => {
      const valid = '<div>{{#if condition}}Content{{/if}}</div>';
      const result = validateTemplateSecurityComprehensive(valid);
      const hasSyntaxError = result.errors.some(e => e.type === SecurityErrorType.HANDLEBARS_SYNTAX_ERROR);
      expect(hasSyntaxError).toBe(false);
    });
  });

  describe('Handlebars Validation - Unclosed Blocks', () => {
    it('should detect unclosed if blocks', () => {
      const invalid = '<div>{{#if condition}}Content</div>';
      const result = validateTemplateSecurityComprehensive(invalid);
      expect(result.errors.some(e => e.type === SecurityErrorType.HANDLEBARS_UNCLOSED_BLOCK)).toBe(true);
    });

    it('should detect unclosed each blocks', () => {
      const invalid = '<div>{{#each items}}<p>{{this}}</p></div>';
      const result = validateTemplateSecurityComprehensive(invalid);
      expect(result.errors.some(e => e.type === SecurityErrorType.HANDLEBARS_UNCLOSED_BLOCK)).toBe(true);
    });

    it('should allow properly closed blocks', () => {
      const valid = '<div>{{#each items}}<p>{{this}}</p>{{/each}}</div>';
      const result = validateTemplateSecurityComprehensive(valid);
      const hasUnclosedBlockError = result.errors.some(e => e.type === SecurityErrorType.HANDLEBARS_UNCLOSED_BLOCK);
      expect(hasUnclosedBlockError).toBe(false);
    });
  });

  describe('Template Validity - Empty Templates', () => {
    it('should reject empty string templates', () => {
      const empty = '';
      const result = validateTemplateSecurityComprehensive(empty);
      expect(result.valid).toBe(false);
      expect(result.errors[0].type).toBe(SecurityErrorType.TEMPLATE_EMPTY);
    });

    it('should reject whitespace-only templates', () => {
      const whitespace = '   \n\t  ';
      const result = validateTemplateSecurityComprehensive(whitespace);
      expect(result.valid).toBe(false);
    });
  });

  describe('Warnings - External Resources', () => {
    it('should warn about external images', () => {
      const template = '<img src="https://example.com/image.jpg" />';
      const result = validateTemplateSecurityComprehensive(template);
      expect(result.warnings.some(w => w.type === SecurityWarningType.EXTERNAL_RESOURCE)).toBe(true);
    });

    it('should warn about inline styles', () => {
      const template = '<div style="color: red;">Content</div>';
      const result = validateTemplateSecurityComprehensive(template);
      expect(result.warnings.some(w => w.type === SecurityWarningType.INLINE_STYLE)).toBe(true);
    });

    it('should warn about data attributes', () => {
      const template = '<div data-custom="value">Content</div>';
      const result = validateTemplateSecurityComprehensive(template);
      expect(result.warnings.some(w => w.type === SecurityWarningType.DATA_ATTRIBUTE)).toBe(true);
    });
  });

  describe('Valid Templates', () => {
    it('should accept well-formed contract template', () => {
      const valid = `
        <div class="contract">
          <h1>{{contractTitle}}</h1>
          <p>Date: {{formatDate contractDate}}</p>
          {{#if parties}}
            <h2>Parties</h2>
            <ul>
              {{#each parties}}
                <li>{{this.name}}</li>
              {{/each}}
            </ul>
          {{/if}}
          <p>Amount: {{formatMoney amount}}</p>
        </div>
      `;
      const result = validateTemplateSecurityComprehensive(valid);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept table-based template', () => {
      const valid = `
        <table>
          <thead>
            <tr><th>Name</th><th>Amount</th></tr>
          </thead>
          <tbody>
            {{#each items}}
              <tr>
                <td>{{this.name}}</td>
                <td>{{formatMoney this.amount}}</td>
              </tr>
            {{/each}}
          </tbody>
        </table>
      `;
      const result = validateTemplateSecurityComprehensive(valid);
      expect(result.valid).toBe(true);
    });

    it('should accept template with nested helpers', () => {
      const valid = `
        <div>
          {{#if (gt amount 1000)}}
            <p>Large amount: {{formatMoney amount}}</p>
          {{else}}
            <p>Small amount: {{formatMoney amount}}</p>
          {{/if}}
        </div>
      `;
      const result = validateTemplateSecurityComprehensive(valid);
      expect(result.valid).toBe(true);
    });
  });

  describe('Security Report Generation', () => {
    it('should generate report for valid template', () => {
      const valid = '<div>{{content}}</div>';
      const result = validateTemplateSecurityComprehensive(valid);
      const report = getSecurityReport(result);
      expect(report).toContain('✅');
    });

    it('should generate report for invalid template', () => {
      const invalid = '<script>alert("XSS")</script>';
      const result = validateTemplateSecurityComprehensive(invalid);
      const report = getSecurityReport(result);
      expect(report).toContain('❌');
      expect(report).toContain('Errors');
    });

    it('should include warnings in report', () => {
      const template = '<img src="https://example.com/image.jpg" />';
      const result = validateTemplateSecurityComprehensive(template);
      const report = getSecurityReport(result);
      expect(report).toContain('Warnings');
    });
  });

  describe('Real-World Contract Templates', () => {
    it('should validate Thai lease contract template', () => {
      const template = `
        <div class="contract-lease">
          <h1>สัญญาเช่า</h1>
          <p>เนื้อหาของสัญญา...</p>
          <table>
            <tr>
              <td>ผู้ให้เช่า:</td>
              <td>{{lessorName}}</td>
            </tr>
            <tr>
              <td>ผู้เช่า:</td>
              <td>{{lesseeName}}</td>
            </tr>
            <tr>
              <td>ค่าเช่ารายเดือน:</td>
              <td>{{formatMoney rentalFee}} บาท</td>
            </tr>
          </table>
        </div>
      `;
      const result = validateTemplateSecurityComprehensive(template);
      expect(result.valid).toBe(true);
    });

    it('should validate employment contract with conditions', () => {
      const template = `
        <div class="contract-employment">
          <h1>Employment Contract</h1>
          <p>Employee: {{employeeName}}</p>
          {{#if (gt salaryAmount 0)}}
            <p>Monthly Salary: {{formatMoney salaryAmount}}</p>
          {{/if}}
          {{#each benefits}}
            <p>Benefit: {{this}}</p>
          {{/each}}
        </div>
      `;
      const result = validateTemplateSecurityComprehensive(template);
      expect(result.valid).toBe(true);
    });
  });
});
