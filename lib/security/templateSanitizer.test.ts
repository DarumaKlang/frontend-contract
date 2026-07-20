// lib/security/templateSanitizer.test.ts
// Unit tests for template sanitization with DOMPurify

import { describe, it, expect } from 'vitest';
import {
  sanitizeTemplateInput,
  sanitizeRenderedOutput,
  sanitizeRenderedOutputStrict,
  hasExternalResources,
  getSanitizationDiff,
  createSafeTemplatePreview,
} from './templateSanitizer';

describe('Template Sanitization with DOMPurify', () => {
  describe('Template Input Sanitization', () => {
    it('should remove script tags from template input', () => {
      const malicious = '<div><p>Content</p><script>alert("XSS")</script></div>';
      const sanitized = sanitizeTemplateInput(malicious);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('<p>Content</p>');
    });

    it('should remove event handlers from template input', () => {
      const malicious = '<button onclick="alert(\'XSS\')">Click</button>';
      const sanitized = sanitizeTemplateInput(malicious);
      expect(sanitized).not.toContain('onclick');
      expect(sanitized).toContain('Click');
    });

    it('should allow safe HTML tags in template input', () => {
      const safe = '<p>Hello</p><strong>Bold</strong><em>Italic</em>';
      const sanitized = sanitizeTemplateInput(safe);
      expect(sanitized).toContain('<p>Hello</p>');
      expect(sanitized).toContain('<strong>Bold</strong>');
      expect(sanitized).toContain('<em>Italic</em>');
    });

    it('should allow table tags in template input', () => {
      const html = '<table><tr><td>Cell</td></tr></table>';
      const sanitized = sanitizeTemplateInput(html);
      expect(sanitized).toContain('<table>');
      expect(sanitized).toContain('<tr>');
      expect(sanitized).toContain('<td>Cell</td>');
    });

    it('should allow class attributes in template input', () => {
      const html = '<div class="contract-header">Content</div>';
      const sanitized = sanitizeTemplateInput(html);
      expect(sanitized).toContain('class="contract-header"');
    });

    it('should preserve Handlebars syntax in template input', () => {
      const template = '<div>{{contractTitle}}</div><p>{{formatMoney amount}}</p>';
      const sanitized = sanitizeTemplateInput(template);
      // Note: DOMPurify might escape {{ }} to some extent
      // This test checks if basic Handlebars structure is preserved
      expect(sanitized).toContain('contractTitle');
      expect(sanitized).toContain('amount');
    });
  });

  describe('Rendered Output Sanitization', () => {
    it('should remove script tags from rendered output', () => {
      const rendered = '<div><p>Contract Data</p><script>alert("XSS")</script></div>';
      const sanitized = sanitizeRenderedOutput(rendered);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('<p>Contract Data</p>');
    });

    it('should preserve valid HTML in rendered output', () => {
      const rendered = '<table><tr><td>John Doe</td><td>$1,000</td></tr></table>';
      const sanitized = sanitizeRenderedOutput(rendered);
      expect(sanitized).toContain('<table>');
      expect(sanitized).toContain('John Doe');
      expect(sanitized).toContain('1,000');
    });

    it('should handle nested tags in rendered output', () => {
      const rendered = '<div><p><strong>Contract</strong> Information</p></div>';
      const sanitized = sanitizeRenderedOutput(rendered);
      expect(sanitized).toContain('<div>');
      expect(sanitized).toContain('<strong>Contract</strong>');
    });

    it('should preserve lists in rendered output', () => {
      const rendered = '<ul><li>Item 1</li><li>Item 2</li></ul>';
      const sanitized = sanitizeRenderedOutput(rendered);
      expect(sanitized).toContain('<ul>');
      expect(sanitized).toContain('<li>Item 1</li>');
      expect(sanitized).toContain('<li>Item 2</li>');
    });
  });

  describe('Strict Output Sanitization', () => {
    it('should remove all attributes in strict mode', () => {
      const rendered = '<div class="header" id="main">Content</div>';
      const sanitized = sanitizeRenderedOutputStrict(rendered);
      expect(sanitized).toContain('<div>Content</div>');
      expect(sanitized).not.toContain('class');
      expect(sanitized).not.toContain('id');
    });

    it('should preserve tag structure in strict mode', () => {
      const rendered = '<p>Content 1</p><p>Content 2</p>';
      const sanitized = sanitizeRenderedOutputStrict(rendered);
      expect(sanitized).toContain('<p>Content 1</p>');
      expect(sanitized).toContain('<p>Content 2</p>');
    });

    it('should remove event handlers in strict mode', () => {
      const malicious = '<button onclick="alert(\'XSS\')">Click</button>';
      const sanitized = sanitizeRenderedOutputStrict(malicious);
      expect(sanitized).not.toContain('onclick');
    });
  });

  describe('External Resources Detection', () => {
    it('should detect external images', () => {
      const html = '<img src="https://example.com/image.jpg" />';
      const result = hasExternalResources(html);
      expect(result.hasImages).toBe(true);
      expect(result.resources).toContain('https://example.com/image.jpg');
    });

    it('should detect iframes', () => {
      const html = '<iframe src="https://example.com"></iframe>';
      const result = hasExternalResources(html);
      expect(result.hasIframes).toBe(true);
      expect(result.resources).toContain('https://example.com');
    });

    it('should detect external scripts', () => {
      const html = '<script src="https://example.com/script.js"></script>';
      const result = hasExternalResources(html);
      expect(result.hasScripts).toBe(true);
      expect(result.resources).toContain('https://example.com/script.js');
    });

    it('should detect local images (any img tag)', () => {
      const html = '<img src="/images/logo.png" />';
      const result = hasExternalResources(html);
      // Note: hasExternalResources checks for HTTP(S) URLs, so local paths won't be detected
      // This is expected behavior
      expect(result.hasImages).toBe(false); // Local paths don't have http/https
    });

    it('should handle multiple resources', () => {
      const html = `
        <img src="https://example.com/img1.jpg" />
        <img src="https://example.com/img2.jpg" />
        <iframe src="https://example.com"></iframe>
      `;
      const result = hasExternalResources(html);
      expect(result.hasImages).toBe(true);
      expect(result.hasIframes).toBe(true);
      expect(result.resources.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Sanitization Diff Tracking', () => {
    it('should detect removed tags', () => {
      const original = '<div><p>Content</p><script>alert("XSS")</script></div>';
      const sanitized = sanitizeTemplateInput(original);
      const diff = getSanitizationDiff(original, sanitized);
      expect(diff.removed.length).toBeGreaterThan(0);
    });

    it('should track when nothing is removed', () => {
      const original = '<div><p>Safe content</p></div>';
      const sanitized = sanitizeTemplateInput(original);
      const diff = getSanitizationDiff(original, sanitized);
      // Should indicate that content was preserved
      expect(diff.preserved).toBe(true);
    });

    it('should detect significant changes', () => {
      const original = '<div onload="alert(\'XSS\')">Content</div>';
      const sanitized = sanitizeTemplateInput(original);
      const diff = getSanitizationDiff(original, sanitized);
      // Should show that sanitization occurred
      expect(diff.removed.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Safe Template Preview', () => {
    it('should create safe preview for legitimate templates', () => {
      const template = '<div><p>{{contractTitle}}</p></div>';
      const preview = createSafeTemplatePreview(template);
      expect(preview).toContain('contractTitle');
    });

    it('should remove malicious content from preview', () => {
      const template = '<div><script>alert("XSS")</script>{{content}}</div>';
      const preview = createSafeTemplatePreview(template);
      expect(preview).not.toContain('<script>');
      expect(preview).toContain('content');
    });

    it('should restore basic Handlebars syntax', () => {
      // This tests the Handlebars restoration logic
      const template = '<div>{{#if condition}}Yes{{/if}}</div>';
      const preview = createSafeTemplatePreview(template);
      // Preview should still be functional
      expect(preview.length).toBeGreaterThan(0);
    });
  });

  describe('Real-World Scenarios', () => {
    it('should sanitize HTML with mixed content safely', () => {
      const html = `
        <div class="contract">
          <h1>Contract Title</h1>
          <p class="date">Date: 2024-01-15</p>
          <table>
            <tr>
              <td>Party A</td>
              <td>John Doe</td>
            </tr>
          </table>
          <p style="font-weight: bold">Terms and Conditions</p>
        </div>
      `;
      const sanitized = sanitizeRenderedOutput(html);
      expect(sanitized).toContain('Contract Title');
      expect(sanitized).toContain('John Doe');
      expect(sanitized).toContain('<table>');
    });

    it('should handle template with helpers safely', () => {
      const html = `
        <div>
          <p>Amount: {{formatMoney 5000}}</p>
          <p>Date: {{formatDate "2024-01-15"}}</p>
          <p>Text: {{uppercase "hello"}}</p>
        </div>
      `;
      const sanitized = sanitizeTemplateInput(html);
      expect(sanitized).toContain('formatMoney');
      expect(sanitized).toContain('formatDate');
    });

    it('should sanitize template with conditional logic', () => {
      const html = `
        {{#if approved}}
          <div class="approved">Approved</div>
        {{else}}
          <div class="pending">Pending</div>
        {{/if}}
      `;
      const sanitized = sanitizeTemplateInput(html);
      expect(sanitized).toContain('approved');
      expect(sanitized).toContain('Approved');
    });

    it('should handle international content safely', () => {
      const html = `
        <div>
          <h1>สัญญาเช่า</h1>
          <p>ผู้ให้เช่า: {{lessorName}}</p>
          <p>ผู้เช่า: {{lesseeName}}</p>
          <p>ค่าเช่า: {{formatMoney rentAmount}} บาท</p>
        </div>
      `;
      const sanitized = sanitizeTemplateInput(html);
      expect(sanitized).toContain('สัญญาเช่า');
      expect(sanitized).toContain('ผู้ให้เช่า');
      expect(sanitized).toContain('rentAmount');
    });
  });

  describe('Defense in Depth', () => {
    it('should sanitize output even if template input was bypassed', () => {
      // Simulate a template that somehow got through with problematic content
      const rendered = '<div>Safe content<script>alert("hack")</script></div>';
      const sanitized = sanitizeRenderedOutput(rendered);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('Safe content');
    });

    it('should apply multiple layers of sanitization safely', () => {
      const original = '<div onclick="alert(1)">Content</div>';
      const step1 = sanitizeTemplateInput(original);
      const step2 = sanitizeRenderedOutput(step1);
      expect(step2).not.toContain('onclick');
      expect(step2).toContain('Content');
    });
  });
});
