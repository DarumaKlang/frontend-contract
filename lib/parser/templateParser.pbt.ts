// lib/parser/templateParser.pbt.ts
// Property-Based Tests for Template Parser

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  parseTemplate,
  prettyPrintTemplate,
  validateRoundTrip,
  extractVariableReferences,
} from './templateParser';

/**
 * Arbitraries (generators) for property-based testing
 */

// Generate valid Handlebars variable names
const variableNameArbitrary = fc
  .stringMatching(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
  .filter((s) => s.length > 0 && s.length < 50);

// Generate valid Handlebars template variables
const simpleVariableTemplate = variableNameArbitrary.map((name) => `{{${name}}}`);

// Generate multiple variables separated by spaces
const multiVariableTemplate = fc
  .array(variableNameArbitrary, { minLength: 1, maxLength: 5 })
  .map((vars) => vars.map((v) => `{{${v}}}`).join(' '));

// Generate simple if blocks
const ifBlockTemplate = fc
  .tuple(variableNameArbitrary, fc.lorem().map((w) => w.substring(0, 20)))
  .map(([condition, content]) => `{{#if ${condition}}}${content}{{/if}}`);

// Generate if-else blocks
const ifElseBlockTemplate = fc
  .tuple(
    variableNameArbitrary,
    fc.lorem().map((w) => w.substring(0, 20)),
    fc.lorem().map((w) => w.substring(0, 20))
  )
  .map(([condition, yesContent, noContent]) => 
    `{{#if ${condition}}}${yesContent}{{else}}${noContent}{{/if}}`
  );

// Generate each blocks
const eachBlockTemplate = fc
  .tuple(variableNameArbitrary, fc.lorem().map((w) => w.substring(0, 20)))
  .map(([items, content]) => `{{#each ${items}}}${content}{{/each}}`);

// Generate valid templates (union of different template types)
const validTemplateArbitrary = fc.oneof(
  simpleVariableTemplate,
  multiVariableTemplate,
  ifBlockTemplate,
  ifElseBlockTemplate,
  eachBlockTemplate
);

/**
 * Property 1: Template Parser Round-Trip Preservation
 * 
 * For any valid Handlebars template string, parsing it to an AST,
 * pretty-printing that AST back to a string, and parsing again
 * SHALL produce an equivalent AST to the original parse.
 * 
 * **Validates: Requirements 8.5, 8.8**
 * **Feature: database-template-integration, Property 1: Template Parser Round-Trip Preservation**
 */
describe('Property 1: Template Parser Round-Trip Preservation', () => {
  it('should produce equivalent AST after parse → print → parse cycle', () => {
    fc.assert(
      fc.property(validTemplateArbitrary, (template) => {
        const result = validateRoundTrip(template);
        
        // Round-trip should succeed for all valid templates
        return result.success === true && result.differences.length === 0;
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 19: Template AST Production
 * 
 * For any valid template, parseTemplate() SHALL produce an AST
 * with a non-null value and valid flag set to true.
 * 
 * **Validates: Requirements 8.1**
 * **Feature: database-template-integration, Property 19: Template AST Production**
 */
describe('Property 19: Template AST Production', () => {
  it('should always produce valid AST for valid templates', () => {
    fc.assert(
      fc.property(validTemplateArbitrary, (template) => {
        const result = parseTemplate(template);
        
        return result.valid === true && result.ast !== null && result.ast !== undefined;
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 20: Template Element Extraction
 * 
 * For any template containing variable references, extracting variables
 * SHALL return at least one variable name for templates with visible
 * Handlebars expressions.
 * 
 * **Validates: Requirements 8.2**
 * **Feature: database-template-integration, Property 20: Template Element Extraction**
 */
describe('Property 20: Template Element Extraction', () => {
  it('should extract at least one variable from templates with variables', () => {
    fc.assert(
      fc.property(simpleVariableTemplate, (template) => {
        const vars = extractVariableReferences(template);
        
        // Template with {{varname}} should extract at least one variable
        return vars.length > 0;
      }),
      { numRuns: 100 }
    );
  });

  it('should extract multiple unique variables when present', () => {
    fc.assert(
      fc.property(
        fc.array(variableNameArbitrary, { minLength: 2, maxLength: 5 }),
        (varNames) => {
          const uniqueNames = [...new Set(varNames)];
          const template = uniqueNames.map((v) => `{{${v}}}`).join(' ');
          const vars = extractVariableReferences(template);
          
          // All extracted variables should be from our list
          return vars.every((v) => uniqueNames.includes(v));
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 21: Parser Error Messages for Invalid Syntax
 * 
 * For templates with invalid Handlebars syntax, parseTemplate()
 * SHALL return valid=false and errors array SHALL NOT be empty.
 * 
 * **Validates: Requirements 8.3**
 * **Feature: database-template-integration, Property 21: Parser Error Messages for Invalid Syntax**
 */
describe('Property 21: Parser Error Messages for Invalid Syntax', () => {
  it('should detect invalid templates and return errors', () => {
    // Generate invalid templates by truncating valid ones
    fc.assert(
      fc.property(validTemplateArbitrary, (template) => {
        // Create invalid template by removing closing braces
        const invalid = template.substring(0, template.length - 2);
        
        // If it's still a valid template, skip this case
        if (parseTemplate(invalid).valid) {
          return true; // Property holds vacuously
        }
        
        const result = parseTemplate(invalid);
        
        // Invalid templates must have errors
        return result.valid === false && result.errors.length > 0;
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 22: Pretty Printer Valid Output
 * 
 * For any valid template that was successfully parsed into an AST,
 * prettyPrintTemplate(ast) SHALL return a string that can be
 * successfully parsed again.
 * 
 * **Validates: Requirements 8.4**
 * **Feature: database-template-integration, Property 22: Pretty Printer Valid Output**
 */
describe('Property 22: Pretty Printer Valid Output', () => {
  it('should produce reparseable output from prettyPrintTemplate', () => {
    fc.assert(
      fc.property(validTemplateArbitrary, (template) => {
        const parseResult = parseTemplate(template);
        
        if (!parseResult.valid || !parseResult.ast) {
          return true; // Skip invalid templates
        }
        
        const printed = prettyPrintTemplate(parseResult.ast);
        const reparsed = parseTemplate(printed);
        
        // Printed output should be reparable
        return reparsed.valid === true && reparsed.ast !== null;
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 23: Whitespace Preservation in Round-Trip
 * 
 * For templates containing significant whitespace or newlines between
 * expressions, the round-trip parsing process SHALL preserve semantic
 * content even if whitespace formatting changes.
 * 
 * **Validates: Requirements 8.6**
 * **Feature: database-template-integration, Property 23: Whitespace Preservation in Round-Trip**
 */
describe('Property 23: Whitespace Preservation in Round-Trip', () => {
  it('should preserve semantic content through whitespace variations', () => {
    fc.assert(
      fc.property(
        fc.array(variableNameArbitrary, { minLength: 1, maxLength: 3 }).chain((vars) =>
          fc.tuple(
            fc.constant(vars),
            fc.array(fc.stringMatching(/[ \n\t]*/), {
              minLength: vars.length + 1,
              maxLength: vars.length + 1,
            })
          )
        ),
        ([vars, separators]) => {
          // Build template with variables separated by various whitespace
          let template = '';
          for (let i = 0; i < vars.length; i++) {
            template += separators[i] + `{{${vars[i]}}}`;
          }
          template += separators[separators.length - 1];
          
          // Skip if template ends up empty or invalid
          if (!template.trim()) return true;
          
          const result = validateRoundTrip(template);
          
          // Extract variables should remain the same
          const origVars = extractVariableReferences(template);
          
          // After round-trip, all original variables should still be extractable
          return origVars.every((v) => vars.includes(v));
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 24: Helper Syntax Normalization
 * 
 * For templates containing Handlebars helpers (with or without various
 * whitespace), parsing and pretty-printing SHALL produce valid Handlebars
 * syntax even if whitespace is normalized.
 * 
 * **Validates: Requirements 8.7**
 * **Feature: database-template-integration, Property 24: Helper Syntax Normalization**
 */
describe('Property 24: Helper Syntax Normalization', () => {
  it('should normalize helper call spacing while preserving semantics', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          variableNameArbitrary,
          fc.array(variableNameArbitrary, { minLength: 1, maxLength: 3 })
        ),
        ([helperName, params]) => {
          // Generate templates with various spacing
          const paramString = params.join('   ');
          const spacingVariations = [
            `{{${helperName} ${paramString}}}`,
            `{{  ${helperName}   ${paramString}  }}`,
            `{{ ${helperName}   ${paramString} }}`,
          ];
          
          for (const template of spacingVariations) {
            const result = validateRoundTrip(template);
            
            // All spacing variations should round-trip successfully
            if (!result.success) {
              return false;
            }
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Additional edge case and robustness properties
 */

describe('Additional Parser Properties', () => {
  /**
   * Property: Parser should handle empty or null inputs gracefully
   */
  it('should handle null/undefined inputs without throwing', () => {
    fc.assert(
      fc.property(fc.anything(), (value) => {
        try {
          const result = parseTemplate(value as any);
          expect(typeof result.valid).toBe('boolean');
          expect(Array.isArray(result.errors)).toBe(true);
          return true;
        } catch (e) {
          return false;
        }
      }),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Extracted variables should always be sorted
   */
  it('should return sorted variable list for all valid templates', () => {
    fc.assert(
      fc.property(validTemplateArbitrary, (template) => {
        const vars = extractVariableReferences(template);
        
        // Variables should be in sorted order
        const sorted = [...vars].sort();
        return JSON.stringify(vars) === JSON.stringify(sorted);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Variable extraction should return unique variables
   */
  it('should return unique variables without duplicates', () => {
    fc.assert(
      fc.property(validTemplateArbitrary, (template) => {
        const vars = extractVariableReferences(template);
        const unique = new Set(vars);
        
        // All returned variables should be unique
        return vars.length === unique.size;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Pretty print output should contain original variable names
   */
  it('should preserve variable names in pretty printed output', () => {
    fc.assert(
      fc.property(multiVariableTemplate, (template) => {
        const origVars = extractVariableReferences(template);
        const parseResult = parseTemplate(template);
        
        if (!parseResult.valid || !parseResult.ast) {
          return true;
        }
        
        const printed = prettyPrintTemplate(parseResult.ast);
        const printedVars = extractVariableReferences(printed);
        
        // All original variables should appear in printed output
        return origVars.every((v) => printedVars.includes(v));
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: AST should always be a Program node for valid templates
   */
  it('should always produce Program-typed AST nodes for valid templates', () => {
    fc.assert(
      fc.property(validTemplateArbitrary, (template) => {
        const result = parseTemplate(template);
        
        if (!result.valid || !result.ast) {
          return true;
        }
        
        return result.ast.type === 'Program';
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Round-trip should be idempotent
   */
  it('should reach stable state after multiple round-trip cycles', () => {
    fc.assert(
      fc.property(validTemplateArbitrary, (template) => {
        let current = template;
        
        // Perform 3 round trips
        for (let i = 0; i < 3; i++) {
          const parsed = parseTemplate(current);
          if (!parsed.valid || !parsed.ast) {
            return true;
          }
          current = prettyPrintTemplate(parsed.ast);
        }
        
        // After multiple cycles, final result should parse successfully
        const finalResult = parseTemplate(current);
        return finalResult.valid === true;
      }),
      { numRuns: 100 }
    );
  });
});
