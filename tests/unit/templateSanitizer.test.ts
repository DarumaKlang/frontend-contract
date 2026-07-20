// tests/unit/templateSanitizer.test.ts
import {
  sanitizeTemplateInput,
  sanitizeRenderedOutput,
  sanitizeRenderedOutputStrict,
  configureDOMPurifyForHandlebars,
  hasExternalResources,
  getSanitizationDiff,
  createSafeTemplatePreview,
} from '../../lib/security/templateSanitizer';

describe('templateSanitizer', () => {
  describe('sanitizeTemplateInput', () => {
    it('should allow safe template tags', () => {
      const html = '<p>Hello <strong>World</strong></p>';
      const result = sanitizeTemplateInput(html);
      expect(result).toContain('Hello');
      expect(result).toContain('World');
    });

    it('should remove script tags', () => {
      const html = '<p>Safe content</p><script>alert("XSS")</script>';
      const result = sanitizeTemplateInput(html);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });

    it('should remove onclick attributes', () => {
      const html = '<p onclick="alert(1)">Click me</p>';
      const result = sanitizeTemplateInput(html);
      expect(result).not.toContain('onclick');
    });

    it('should preserve allowed data attributes', () => {
      const html = '<div data-contract-type="invoice">Content</div>';
      const result = sanitizeTemplateInput(html);
      expect(result).toContain('data-contract-type');
    });

    it('should allow common formatting tags', () => {
      const html = `
        <h1>Title</h1>
        <p>Paragraph with <em>emphasis</em> and <strong>bold</strong></p>
        <ul><li>Item 1</li><li>Item 2</li></ul>
        <table><tr><td>Cell</td></tr></table>
      `;
      const result = sanitizeTemplateInput(html);
      expect(result).toContain('Title');
      expect(result).toContain('Paragraph');
      expect(result).toContain('Item 1');
    });

    it('should remove style attributes', () => {
      const html = '<p style="background: url(javascript:alert(1))">Text</p>';
      const result = sanitizeTemplateInput(html);
      // Style attribute should be removed as it's not in ALLOWED_ATTR
      expect(result).not.toContain('javascript:');
    });
  });

  describe('sanitizeRenderedOutput', () => {
    it('should sanitize rendered template output', () => {
      const html = '<p>Safe content</p><img src="x" onerror="alert(1)">';
      const result = sanitizeRenderedOutput(html);
      expect(result).not.toContain('onerror');
    });

    it('should preserve data-contract attributes in output', () => {
      const html = '<div data-contract-lang="en">Contract Text</div>';
      const result = sanitizeRenderedOutput(html);
      expect(result).toContain('data-contract-lang');
    });

    it('should allow all template tags in output', () => {
      const html = '<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody></table>';
      const result = sanitizeRenderedOutput(html);
      expect(result).toContain('Header');
      expect(result).toContain('Data');
    });
  });

  describe('sanitizeRenderedOutputStrict', () => {
    it('should remove all attributes in strict mode', () => {
      const html = '<p class="text" id="para">Content</p>';
      const result = sanitizeRenderedOutputStrict(html);
      expect(result).not.toContain('class=');
      expect(result).not.toContain('id=');
    });

    it('should still allow safe tags in strict mode', () => {
      const html = '<p>Text</p><strong>Bold</strong>';
      const result = sanitizeRenderedOutputStrict(html);
      expect(result).toContain('Text');
      expect(result).toContain('Bold');
    });

    it('should remove scripts and dangerous tags', () => {
      const html = '<p>Safe</p><script>alert(1)</script><iframe src="evil.com"></iframe>';
      const result = sanitizeRenderedOutputStrict(html);
      expect(result).not.toContain('script');
      expect(result).not.toContain('iframe');
    });
  });

  describe('configureDOMPurifyForHandlebars', () => {
    it('should configure without errors', () => {
      expect(() => {
        configureDOMPurifyForHandlebars();
      }).not.toThrow();
    });

    it('should preserve data-template-content attributes after configuration', () => {
      configureDOMPurifyForHandlebars();
      const html = '<div data-template-content="{{name}}">Template</div>';
      const result = sanitizeTemplateInput(html);
      expect(result).toContain('data-template-content');
    });
  });

  describe('hasExternalResources', () => {
    it('should detect external images', () => {
      const html = '<img src="https://example.com/image.png">';
      const result = hasExternalResources(html);
      expect(result.hasImages).toBe(true);
      expect(result.resources.length).toBeGreaterThan(0);
    });

    it('should not flag local images', () => {
      const html = '<img src="/local/image.png">';
      const result = hasExternalResources(html);
      // Local resources should not be counted as external
      expect(result.resources.filter(r => r.startsWith('http'))).toHaveLength(0);
    });

    it('should detect iframes', () => {
      const html = '<iframe src="https://example.com"></iframe>';
      const result = hasExternalResources(html);
      expect(result.hasIframes).toBe(true);
    });

    it('should detect external scripts', () => {
      const html = '<script src="https://example.com/script.js"></script>';
      const result = hasExternalResources(html);
      expect(result.hasScripts).toBe(true);
    });

    it('should handle mixed resources', () => {
      const html = `
        <img src="https://cdn.example.com/image.png">
        <iframe src="https://embed.example.com"></iframe>
        <img src="/local/image.png">
      `;
      const result = hasExternalResources(html);
      expect(result.hasImages).toBe(true);
      expect(result.hasIframes).toBe(true);
      expect(result.resources.length).toBeGreaterThan(0);
    });

    it('should return empty resources for clean HTML', () => {
      const html = '<p>Just text</p><strong>No resources</strong>';
      const result = hasExternalResources(html);
      expect(result.hasImages).toBe(false);
      expect(result.hasIframes).toBe(false);
      expect(result.hasScripts).toBe(false);
    });
  });

  describe('getSanitizationDiff', () => {
    it('should detect removed tags', () => {
      const original = '<p>Text</p><script>alert(1)</script>';
      const sanitized = sanitizeTemplateInput(original);
      const diff = getSanitizationDiff(original, sanitized);
      expect(diff.removed.length).toBeGreaterThan(0);
      expect(diff.removed.some(tag => tag.includes('script'))).toBe(true);
    });

    it('should indicate if content is preserved', () => {
      const original = '<p>Hello World</p>';
      const sanitized = sanitizeTemplateInput(original);
      const diff = getSanitizationDiff(original, sanitized);
      expect(diff.preserved).toBe(true);
    });

    it('should detect missing tags in sanitized output', () => {
      const original = '<div><script src="evil.js"></script><p>Safe</p></div>';
      const sanitized = '<p>Safe</p>';
      const diff = getSanitizationDiff(original, sanitized);
      expect(diff.removed.length).toBeGreaterThan(0);
    });

    it('should return empty removed array for identical content', () => {
      const html = '<p>Content</p>';
      const diff = getSanitizationDiff(html, html);
      expect(diff.removed).toEqual([]);
    });
  });

  describe('createSafeTemplatePreview', () => {
    it('should sanitize template HTML', () => {
      const template = '<p>Safe</p><script>alert(1)</script>';
      const result = createSafeTemplatePreview(template);
      expect(result).not.toContain('script');
    });

    it('should preserve safe content', () => {
      const template = '<h1>Title</h1><p>Description</p>';
      const result = createSafeTemplatePreview(template);
      expect(result).toContain('Title');
      expect(result).toContain('Description');
    });

    it('should not contain dangerous script code', () => {
      const template = `
        <div>
          Safe content
          <script>console.log('XSS')</script>
        </div>
      `;
      const result = createSafeTemplatePreview(template);
      expect(result).not.toContain('console');
      expect(result).not.toContain('XSS');
    });
  });

  describe('XSS Prevention', () => {
    it('should prevent common XSS vectors', () => {
      const xssVectors = [
        '<img src=x onerror=alert(1)>',
        '<svg onload=alert(1)>',
        '<body onload=alert(1)>',
        '<iframe src=javascript:alert(1)>',
        '<a href=javascript:alert(1)>Click</a>',
        '<input onfocus=alert(1)>',
        '<marquee onstart=alert(1)>',
        '<details open ontoggle=alert(1)>',
      ];

      xssVectors.forEach(vector => {
        const result = sanitizeTemplateInput(vector);
        expect(result).not.toContain('alert');
        expect(result).not.toContain('javascript:');
        expect(result).not.toContain('onerror');
        expect(result).not.toContain('onload');
        expect(result).not.toContain('onfocus');
      });
    });

    it('should prevent data URI XSS', () => {
      const html = '<img src="data:text/html,<script>alert(1)</script>">';
      const result = sanitizeTemplateInput(html);
      expect(result).not.toContain('script');
    });

    it('should prevent CSS injection XSS', () => {
      const html = '<p style="background-image: url(javascript:alert(1))">Text</p>';
      const result = sanitizeTemplateInput(html);
      expect(result).not.toContain('javascript:');
    });
  });

  describe('Defense in Depth', () => {
    it('should remove malicious content even after rendering', () => {
      const malicious = '<p>Content</p><img src=x onerror=alert(1)>';
      const step1 = sanitizeTemplateInput(malicious);
      const step2 = sanitizeRenderedOutput(step1);
      expect(step2).not.toContain('alert');
    });

    it('should handle nested malicious content', () => {
      const html = `
        <div>
          <p>Safe</p>
          <div>
            <script>alert('nested')</script>
            <img src=x onerror=alert(2)>
          </div>
        </div>
      `;
      const result = sanitizeTemplateInput(html);
      expect(result).not.toContain('script');
      expect(result).not.toContain('alert');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      const result = sanitizeTemplateInput('');
      expect(result).toBe('');
    });

    it('should handle only whitespace', () => {
      const result = sanitizeTemplateInput('   \n\t  ');
      expect(typeof result).toBe('string');
    });

    it('should handle very long HTML', () => {
      const longHtml = '<p>' + 'A'.repeat(10000) + '</p>';
      const result = sanitizeTemplateInput(longHtml);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle HTML with special characters', () => {
      const html = '<p>Special: &lt; &gt; &amp; &quot; &apos;</p>';
      const result = sanitizeTemplateInput(html);
      expect(result).toContain('Special');
    });

    it('should handle malformed HTML', () => {
      const html = '<p>Unclosed tag<div><img src="test.png">';
      expect(() => {
        sanitizeTemplateInput(html);
      }).not.toThrow();
    });

    it('should handle unicode characters', () => {
      const html = '<p>Thai: สวัสดี Chinese: 你好 Arabic: مرحبا</p>';
      const result = sanitizeTemplateInput(html);
      expect(result).toContain('สวัสดี');
    });
  });
});
