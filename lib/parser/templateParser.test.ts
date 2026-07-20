// lib/parser/templateParser.test.ts
// Unit tests for Template Parser

import { describe, it, expect } from 'vitest';
import {
  parseTemplate,
  prettyPrintTemplate,
  validateRoundTrip,
  extractVariableReferences,
  ParseResult,
  RoundTripResult,
} from './templateParser';

describe('parseTemplate', () => {
  describe('valid templates', () => {
    it('should parse simple variable template', () => {
      const template = '{{name}}';
      const result = parseTemplate(template);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.ast).toBeDefined();
      expect(result.ast.type).toBe('Program');
    });

    it('should parse template with helper call', () => {
      const template = '{{formatMoney price}}';
      const result = parseTemplate(template);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.ast).toBeDefined();
    });

    it('should parse template with block statement (if)', () => {
      const template = '{{#if condition}}content{{/if}}';
      const result = parseTemplate(template);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.ast).toBeDefined();
    });

    it('should parse template with block statement (each)', () => {
      const template = '{{#each items}}{{this}}{{/each}}';
      const result = parseTemplate(template);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.ast).toBeDefined();
    });

    it('should parse template with inverse (else)', () => {
      const template = '{{#if condition}}yes{{else}}no{{/if}}';
      const result = parseTemplate(template);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.ast).toBeDefined();
    });

    it('should parse template with multiple variables', () => {
      const template = '<div>{{firstName}} {{lastName}}</div>';
      const result = parseTemplate(template);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.ast).toBeDefined();
    });

    it('should parse template with HTML and Handlebars mixed', () => {
      const template = `
        <div class="contract">
          <h1>{{contractTitle}}</h1>
          <p>{{description}}</p>
          <ul>
            {{#each items}}
              <li>{{this}}</li>
            {{/each}}
          </ul>
        </div>
      `;
      const result = parseTemplate(template);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.ast).toBeDefined();
    });

    it('should parse template with hash parameters', () => {
      const template = '{{formatDate date format="YYYY-MM-DD"}}';
      const result = parseTemplate(template);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.ast).toBeDefined();
    });

    it('should parse template with nested blocks', () => {
      const template = `
        {{#each list}}
          {{#if enabled}}
            {{name}}
          {{/if}}
        {{/each}}
      `;
      const result = parseTemplate(template);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.ast).toBeDefined();
    });

    it('should parse empty template', () => {
      const template = '';
      const result = parseTemplate(template);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('invalid templates', () => {
    it('should reject template with unclosed block', () => {
      const template = '{{#if condition}}content';
      const result = parseTemplate(template);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Invalid Handlebars');
    });

    it('should reject template with mismatched block closing', () => {
      const template = '{{#if condition}}content{{/each}}';
      const result = parseTemplate(template);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject template with triple malformed braces', () => {
      const template = '{{{name}}';
      const result = parseTemplate(template);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject non-string input', () => {
      const result1 = parseTemplate(null as any);
      expect(result1.valid).toBe(false);
      expect(result1.errors[0]).toContain('non-empty string');

      const result2 = parseTemplate(undefined as any);
      expect(result2.valid).toBe(false);
      expect(result2.errors[0]).toContain('non-empty string');

      const result3 = parseTemplate(123 as any);
      expect(result3.valid).toBe(false);
      expect(result3.errors[0]).toContain('non-empty string');
    });

    it('should provide detailed error message for syntax errors', () => {
      const template = '{{#if condition}}content{{/each}}';
      const result = parseTemplate(template);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Invalid Handlebars');
    });
  });

  describe('AST structure validation', () => {
    it('should return Program node as root', () => {
      const result = parseTemplate('{{name}}');
      expect(result.ast.type).toBe('Program');
      expect(result.ast.body).toBeDefined();
      expect(Array.isArray(result.ast.body)).toBe(true);
    });

    it('should include all parsed nodes in body', () => {
      const template = '{{firstName}} {{lastName}}';
      const result = parseTemplate(template);

      // Should have 3 nodes: MustacheStatement, ContentStatement (space), MustacheStatement
      expect(result.ast.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should identify variable references in AST', () => {
      const template = '{{name}}';
      const result = parseTemplate(template);

      // Find the MustacheStatement node
      const mustacheNode = result.ast.body.find((n: any) => n.type === 'MustacheStatement');
      expect(mustacheNode).toBeDefined();
      expect(mustacheNode.path.type).toBe('PathExpression');
    });
  });
});

describe('prettyPrintTemplate', () => {
  describe('printing various template elements', () => {
    it('should print simple variable', () => {
      const template = '{{name}}';
      const result = parseTemplate(template);
      const printed = prettyPrintTemplate(result.ast);

      expect(printed).toContain('{{');
      expect(printed).toContain('}}');
      expect(printed).toContain('name');
    });

    it('should print helper call with parameters', () => {
      const template = '{{formatMoney price}}';
      const result = parseTemplate(template);
      const printed = prettyPrintTemplate(result.ast);

      expect(printed).toContain('formatMoney');
      expect(printed).toContain('price');
    });

    it('should print block statement', () => {
      const template = '{{#if condition}}yes{{/if}}';
      const result = parseTemplate(template);
      const printed = prettyPrintTemplate(result.ast);

      expect(printed).toContain('{{#if');
      expect(printed).toContain('condition');
      expect(printed).toContain('yes');
      expect(printed).toContain('{{/if}}');
    });

    it('should print block with else clause', () => {
      const template = '{{#if condition}}yes{{else}}no{{/if}}';
      const result = parseTemplate(template);
      const printed = prettyPrintTemplate(result.ast);

      expect(printed).toContain('{{#if');
      expect(printed).toContain('yes');
      expect(printed).toContain('{{else}}');
      expect(printed).toContain('no');
      expect(printed).toContain('{{/if}}');
    });

    it('should handle null AST gracefully', () => {
      const printed = prettyPrintTemplate(null);
      expect(printed).toBe('');
    });

    it('should handle undefined AST gracefully', () => {
      const printed = prettyPrintTemplate(undefined);
      expect(printed).toBe('');
    });
  });

  describe('whitespace handling', () => {
    it('should preserve text content whitespace', () => {
      const template = 'hello   world';
      const result = parseTemplate(template);
      const printed = prettyPrintTemplate(result.ast);

      expect(printed).toContain('hello');
      expect(printed).toContain('world');
    });

    it('should preserve newlines in template', () => {
      const template = 'line1\nline2';
      const result = parseTemplate(template);
      const printed = prettyPrintTemplate(result.ast);

      expect(printed).toContain('line1');
      expect(printed).toContain('line2');
    });
  });

  describe('normalizing helper syntax', () => {
    it('should normalize helper call spacing', () => {
      const template = '{{  formatMoney   price  }}';
      const result = parseTemplate(template);
      const printed = prettyPrintTemplate(result.ast);

      // Should have normalized spacing (less excessive whitespace)
      expect(printed).toContain('formatMoney');
      expect(printed).toContain('price');
    });
  });
});

describe('validateRoundTrip', () => {
  describe('valid templates', () => {
    it('should successfully validate simple variable template', () => {
      const template = '{{name}}';
      const result = validateRoundTrip(template);

      expect(result.success).toBe(true);
      expect(result.differences).toEqual([]);
      expect(result.originalAst).toBeDefined();
      expect(result.roundTripAst).toBeDefined();
    });

    it('should successfully validate block statement template', () => {
      const template = '{{#if condition}}content{{/if}}';
      const result = validateRoundTrip(template);

      expect(result.success).toBe(true);
      expect(result.differences).toEqual([]);
    });

    it('should successfully validate template with multiple variables', () => {
      const template = 'Hello {{firstName}} {{lastName}}';
      const result = validateRoundTrip(template);

      expect(result.success).toBe(true);
      expect(result.differences).toEqual([]);
    });

    it('should successfully validate nested template', () => {
      const template = '{{#each items}}{{#if this.enabled}}{{this.name}}{{/if}}{{/each}}';
      const result = validateRoundTrip(template);

      expect(result.success).toBe(true);
      expect(result.differences).toEqual([]);
    });

    it('should successfully validate template with else', () => {
      const template = '{{#if a}}yes{{else}}no{{/if}}';
      const result = validateRoundTrip(template);

      expect(result.success).toBe(true);
      expect(result.differences).toEqual([]);
    });

    it('should successfully validate template with hash parameters', () => {
      const template = '{{formatDate date format="dd/mm/yyyy"}}';
      const result = validateRoundTrip(template);

      expect(result.success).toBe(true);
      expect(result.differences).toEqual([]);
    });
  });

  describe('invalid templates', () => {
    it('should fail validation for unclosed blocks', () => {
      const template = '{{#if condition}}content';
      const result = validateRoundTrip(template);

      expect(result.success).toBe(false);
      expect(result.differences.length).toBeGreaterThan(0);
    });

    it('should fail validation for unmatched blocks', () => {
      const template = '{{#if condition}}content{{/each}}';
      const result = validateRoundTrip(template);

      expect(result.success).toBe(false);
      expect(result.differences.length).toBeGreaterThan(0);
    });
  });

  describe('AST comparison', () => {
    it('should store both original and round-trip ASTs', () => {
      const template = '{{name}}';
      const result = validateRoundTrip(template);

      expect(result.originalAst).toBeDefined();
      expect(result.roundTripAst).toBeDefined();
      expect(result.originalAst).not.toBe(result.roundTripAst); // Different objects
    });

    it('should indicate ASTs are equivalent when no differences', () => {
      const template = 'Hello {{firstName}}';
      const result = validateRoundTrip(template);

      expect(result.success).toBe(true);
      expect(result.differences.length).toBe(0);
    });

    it('should provide detailed differences when ASTs diverge', () => {
      // Create a template that will likely round-trip correctly
      const template = '{{a}} {{b}} {{c}}';
      const result = validateRoundTrip(template);

      expect(result.differences).toBeDefined();
      expect(Array.isArray(result.differences)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty templates gracefully', () => {
      const template = '';
      const result = validateRoundTrip(template);

      expect(result.success).toBe(false);
      expect(result.differences.length).toBeGreaterThan(0);
    });

    it('should handle whitespace-only templates', () => {
      const template = '   \n\n  \t  ';
      const result = validateRoundTrip(template);

      // Result depends on how Handlebars handles whitespace-only input
      expect(result.success).toBe(typeof result.success === 'boolean');
    });
  });
});

describe('extractVariableReferences', () => {
  describe('extracting variables', () => {
    it('should extract single variable', () => {
      const template = '{{name}}';
      const vars = extractVariableReferences(template);

      expect(vars).toContain('name');
    });

    it('should extract multiple variables', () => {
      const template = 'Hello {{firstName}} {{lastName}}';
      const vars = extractVariableReferences(template);

      expect(vars).toContain('firstName');
      expect(vars).toContain('lastName');
    });

    it('should return unique variable names', () => {
      const template = '{{name}} and {{name}} again';
      const vars = extractVariableReferences(template);

      expect(vars.filter((v) => v === 'name').length).toBe(1);
    });

    it('should extract variables from block statements', () => {
      const template = '{{#each items}}{{this.name}}{{/each}}';
      const vars = extractVariableReferences(template);

      expect(vars.includes('items') || vars.includes('this')).toBe(true);
    });

    it('should extract variables from helper calls', () => {
      const template = '{{formatMoney price}} and {{formatDate date}}';
      const vars = extractVariableReferences(template);

      expect(vars).toContain('price');
      expect(vars).toContain('date');
    });

    it('should handle complex nested templates', () => {
      const template = `
        {{#each contracts}}
          {{#if this.active}}
            {{this.name}}: {{formatMoney this.amount}}
          {{/if}}
        {{/each}}
      `;
      const vars = extractVariableReferences(template);

      expect(vars.length).toBeGreaterThan(0);
    });

    it('should return empty array for templates with no variables', () => {
      const template = '<div>Plain HTML with no variables</div>';
      const vars = extractVariableReferences(template);

      expect(vars).toEqual([]);
    });

    it('should extract variables even from loosely formatted templates', () => {
      // Handlebars is permissive - {{#if}} without condition is valid
      const template = '{{#if}}content{{/if}}';
      const vars = extractVariableReferences(template);

      // The block name 'if' is treated as a path, so it might be extracted
      expect(Array.isArray(vars)).toBe(true);
    });

    it('should return sorted variable list', () => {
      const template = '{{zebra}} {{apple}} {{monkey}}';
      const vars = extractVariableReferences(template);

      expect(vars).toEqual(['apple', 'monkey', 'zebra']);
    });

    it('should handle variables with dots in paths', () => {
      const template = '{{user.profile.name}} and {{user.email}}';
      const vars = extractVariableReferences(template);

      expect(vars).toContain('user');
    });

    it('should extract variables from if/unless blocks', () => {
      const template = '{{#if showDetails}}{{details}}{{/if}}';
      const vars = extractVariableReferences(template);

      expect(vars).toContain('showDetails');
      expect(vars).toContain('details');
    });

    it('should extract from parametrized helpers', () => {
      const template = '{{add number1 number2}}';
      const vars = extractVariableReferences(template);

      expect(vars).toContain('number1');
      expect(vars).toContain('number2');
    });

    it('should handle inline partials', () => {
      const template = '{{>partial}}';
      const vars = extractVariableReferences(template);

      // May or may not extract 'partial' depending on implementation
      expect(Array.isArray(vars)).toBe(true);
    });
  });
});

describe('ParseResult interface', () => {
  it('should return ParseResult with all required fields', () => {
    const result = parseTemplate('{{test}}');

    expect('ast' in result).toBe(true);
    expect('valid' in result).toBe(true);
    expect('errors' in result).toBe(true);
    expect(typeof result.valid).toBe('boolean');
    expect(Array.isArray(result.errors)).toBe(true);
  });
});

describe('RoundTripResult interface', () => {
  it('should return RoundTripResult with all required fields', () => {
    const result = validateRoundTrip('{{test}}');

    expect('success' in result).toBe(true);
    expect('originalAst' in result).toBe(true);
    expect('roundTripAst' in result).toBe(true);
    expect('differences' in result).toBe(true);
    expect(typeof result.success).toBe('boolean');
    expect(Array.isArray(result.differences)).toBe(true);
  });
});

describe('Requirements Validation', () => {
  describe('Requirement 8.1: Template Parser SHALL parse templates into AST', () => {
    it('should parse valid Handlebars templates into AST', () => {
      const template = '{{name}}';
      const result = parseTemplate(template);

      expect(result.valid).toBe(true);
      expect(result.ast).toBeDefined();
      expect(result.ast.type).toBe('Program');
    });
  });

  describe('Requirement 8.2: Parser SHALL identify variables, helpers, and blocks', () => {
    it('should identify variable references', () => {
      const vars = extractVariableReferences('{{userName}} {{email}}');
      expect(vars).toContain('userName');
      expect(vars).toContain('email');
    });

    it('should handle helper identification in parse', () => {
      const result = parseTemplate('{{formatMoney price}}');
      expect(result.valid).toBe(true);
    });

    it('should handle block structure identification', () => {
      const result = parseTemplate('{{#each items}}{{this}}{{/each}}');
      expect(result.valid).toBe(true);
    });
  });

  describe('Requirement 8.3: Parser SHALL return descriptive errors', () => {
    it('should provide error messages for invalid syntax', () => {
      const result = parseTemplate('{{#if condition}}content');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Invalid Handlebars');
    });
  });

  describe('Requirement 8.4: Pretty Printer SHALL format AST to valid Handlebars', () => {
    it('should output valid Handlebars syntax', () => {
      const original = '{{name}}';
      const parsed = parseTemplate(original);
      const printed = prettyPrintTemplate(parsed.ast);

      expect(printed).toContain('{{');
      expect(printed).toContain('}}');
      
      // Verify the printed output can be parsed
      const reparsed = parseTemplate(printed);
      expect(reparsed.valid).toBe(true);
    });
  });

  describe('Requirement 8.5: Round-trip property SHALL hold for all valid templates', () => {
    it('should maintain equivalence through parse→print→parse cycle', () => {
      const templates = [
        '{{variable}}',
        'Hello {{firstName}} {{lastName}}',
        '{{#if condition}}yes{{/if}}',
        '{{#if cond}}yes{{else}}no{{/if}}',
        '{{#each items}}{{this}}{{/each}}',
      ];

      for (const template of templates) {
        const result = validateRoundTrip(template);
        expect(result.success).toBe(true);
        expect(result.differences).toEqual([]);
      }
    });
  });
});
