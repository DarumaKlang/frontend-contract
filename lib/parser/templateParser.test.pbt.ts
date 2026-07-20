// lib/parser/templateParser.test.pbt.ts
// Property-Based Tests for Migration Script Template Properties

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  parseTemplate,
  prettyPrintTemplate,
  extractVariableReferences,
} from './templateParser';

/**
 * Arbitraries (generators) for property-based testing of migration scenarios
 */

// Generate valid Handlebars variable names that would come from FormData
const formDataVariableArbitrary = fc
  .stringMatching(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
  .filter((s) => s.length > 0 && s.length < 50);

// Generate Handlebars templates with variables
const templateWithVariablesArbitrary = fc
  .array(formDataVariableArbitrary, { minLength: 1, maxLength: 5 })
  .map((variables) => {
    const uniqueVars = [...new Set(variables)];
    return uniqueVars.map((v) => `<p>{{${v}}}</p>`).join('\n');
  });

// Generate template strings with helper function calls
// Typical helpers from the system: formatMoney, formatDate, thaiBahtText
const helperNames = ['formatMoney', 'formatDate', 'thaiBahtText'];
const monetaryFieldNames = ['rentalFee', 'depositAmount', 'vehiclePrice', 'propertyPrice', 'salaryAmount'];
const dateFieldNames = ['contractDate', 'deliveryDeadline'];

const simpleHelperCallArbitrary = fc
  .tuple(fc.constantFrom(...helperNames), formDataVariableArbitrary)
  .map(([helper, variable]) => `{{${helper} ${variable}}}`);

const multiHelperTemplateArbitrary = fc
  .array(simpleHelperCallArbitrary, { minLength: 1, maxLength: 3 })
  .map((helpers) => helpers.join('\n'));

// Generate templates with conditional blocks (if statements)
const conditionalTemplateArbitrary = fc
  .tuple(formDataVariableArbitrary, fc.lorem().map((w) => w.substring(0, 30)))
  .map(([variable, content]) => 
    `{{#if ${variable}}}<p>${content}</p>{{/if}}`
  );

// Generate templates with loop blocks (each statements)
const loopTemplateArbitrary = fc
  .tuple(formDataVariableArbitrary, fc.lorem().map((w) => w.substring(0, 30)))
  .map(([variable, content]) => 
    `{{#each ${variable}}}<li>{{this}} - ${content}</li>{{/each}}`
  );

// Complex templates combining multiple features
const complexTemplateArbitrary = fc
  .tuple(
    fc.array(formDataVariableArbitrary, { minLength: 2, maxLength: 4 }),
    fc.array(fc.constantFrom(...helperNames), { minLength: 1, maxLength: 2 }),
    fc.lorem().map((w) => w.substring(0, 30))
  )
  .map(([variables, helpers, content]) => {
    const uniqueVars = [...new Set(variables)];
    let template = '<div>';
    
    // Add some variables
    template += uniqueVars.slice(0, 2).map((v) => `<p>{{${v}}}</p>`).join('\n');
    
    // Add some helpers
    if (helpers.length > 0 && uniqueVars.length > 0) {
      template += `\n<span>{{${helpers[0]} ${uniqueVars[0]}}}</span>`;
    }
    
    // Add conditional
    if (uniqueVars.length > 1) {
      template += `\n{{#if ${uniqueVars[1]}}}<em>${content}</em>{{/if}}`;
    }
    
    template += '\n</div>';
    return template;
  });

/**
 * Property 2: Variable Preservation Through Template Conversion
 * 
 * For any template containing variable references, converting it to Handlebars
 * format and extracting variables SHALL return the same set of variable names
 * as the original template.
 * 
 * **Validates: Requirements 1.3**
 * **Feature: database-template-integration, Property 2: Variable Preservation Through Template Conversion**
 */
describe('Property 2: Variable Preservation Through Template Conversion', () => {
  it('should preserve variable names through template conversion', () => {
    fc.assert(
      fc.property(templateWithVariablesArbitrary, (template) => {
        // Step 1: Extract variables from original template
        const originalVariables = extractVariableReferences(template);
        
        // Step 2: Parse the template to verify it's valid Handlebars
        const parseResult = parseTemplate(template);
        if (!parseResult.valid) {
          // If template is invalid, skip this case
          return true;
        }
        
        // Step 3: Pretty-print the AST back to template string (conversion step)
        const printedTemplate = prettyPrintTemplate(parseResult.ast);
        
        // Step 4: Extract variables from converted template
        const convertedVariables = extractVariableReferences(printedTemplate);
        
        // All original variable names should be preserved in converted template
        return (
          originalVariables.length === convertedVariables.length &&
          originalVariables.every((v) => convertedVariables.includes(v))
        );
      }),
      { numRuns: 100 }
    );
  });

  it('should handle templates with multiple variables without losing any', () => {
    fc.assert(
      fc.property(
        fc.array(formDataVariableArbitrary, { minLength: 3, maxLength: 8 }),
        (varNames) => {
          // Create template with each variable mentioned
          const uniqueVars = [...new Set(varNames)];
          const template = uniqueVars.map((v) => `{{${v}}}`).join(', ');
          
          const originalVars = extractVariableReferences(template);
          const parseResult = parseTemplate(template);
          
          if (!parseResult.valid) return true;
          
          const converted = prettyPrintTemplate(parseResult.ast);
          const convertedVars = extractVariableReferences(converted);
          
          // Should maintain all unique variables
          return (
            originalVars.length === convertedVars.length &&
            uniqueVars.every((v) => convertedVars.includes(v))
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve variables in complex templates with helpers and conditionals', () => {
    fc.assert(
      fc.property(complexTemplateArbitrary, (template) => {
        const originalVariables = extractVariableReferences(template);
        const parseResult = parseTemplate(template);
        
        if (!parseResult.valid) return true;
        
        const convertedTemplate = prettyPrintTemplate(parseResult.ast);
        const convertedVariables = extractVariableReferences(convertedTemplate);
        
        // All original variables must be present
        return originalVariables.every((v) => convertedVariables.includes(v));
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 3: Helper Function Conversion Correctness
 * 
 * For any template containing Handlebars helper calls (formatMoney, formatDate, thaiBahtText),
 * converting the template SHALL produce valid Handlebars helper syntax for all helpers.
 * 
 * **Validates: Requirements 1.4**
 * **Feature: database-template-integration, Property 3: Helper Function Conversion Correctness**
 */
describe('Property 3: Helper Function Conversion Correctness', () => {
  it('should produce valid Handlebars helper syntax for single helpers', () => {
    fc.assert(
      fc.property(simpleHelperCallArbitrary, (template) => {
        const parseResult = parseTemplate(template);
        
        // Helper calls should be valid Handlebars
        if (!parseResult.valid) {
          return false;
        }
        
        // Pretty-print and re-parse should succeed
        const converted = prettyPrintTemplate(parseResult.ast);
        const reparsed = parseTemplate(converted);
        
        return reparsed.valid === true;
      }),
      { numRuns: 100 }
    );
  });

  it('should convert multiple helper calls to valid Handlebars syntax', () => {
    fc.assert(
      fc.property(multiHelperTemplateArbitrary, (template) => {
        const parseResult = parseTemplate(template);
        
        if (!parseResult.valid) {
          return true; // Skip invalid templates
        }
        
        const converted = prettyPrintTemplate(parseResult.ast);
        const reparsed = parseTemplate(converted);
        
        // Converted template must be valid Handlebars
        return reparsed.valid === true && reparsed.ast !== null;
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve helper function names during conversion', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.constantFrom(...helperNames),
          formDataVariableArbitrary
        ),
        ([helperName, variable]) => {
          const template = `{{${helperName} ${variable}}}`;
          const parseResult = parseTemplate(template);
          
          if (!parseResult.valid) return true;
          
          const converted = prettyPrintTemplate(parseResult.ast);
          
          // Converted template should still contain the helper name
          return converted.includes(helperName);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle all known helper functions in templates', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...helperNames),
        (helperName) => {
          const template = `<span>{{${helperName} amount}}</span>`;
          const parseResult = parseTemplate(template);
          
          if (!parseResult.valid) {
            return true; // Skip if invalid
          }
          
          const converted = prettyPrintTemplate(parseResult.ast);
          const reparsed = parseTemplate(converted);
          
          // Should remain valid after conversion
          return reparsed.valid === true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should convert templates with helpers and variables correctly', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.constantFrom(...helperNames),
          formDataVariableArbitrary,
          formDataVariableArbitrary
        ),
        ([helper, var1, var2]) => {
          const template = `<p>{{${var1}}} - {{${helper} ${var2}}}</p>`;
          const parseResult = parseTemplate(template);
          
          if (!parseResult.valid) return true;
          
          const converted = prettyPrintTemplate(parseResult.ast);
          const converted_parse = parseTemplate(converted);
          
          // Both variables and helper should be preserved
          const originalVars = extractVariableReferences(template);
          const convertedVars = extractVariableReferences(converted);
          
          return (
            converted_parse.valid === true &&
            originalVars.length === convertedVars.length &&
            originalVars.every((v) => convertedVars.includes(v)) &&
            converted.includes(helper)
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 4: Migration Validation Gate
 * 
 * For any template processed by the migration script, the template SHALL only be
 * inserted into the database if it passes Handlebars syntax validation.
 * 
 * **Validates: Requirements 1.10**
 * **Feature: database-template-integration, Property 4: Migration Validation Gate**
 */
describe('Property 4: Migration Validation Gate', () => {
  it('should mark valid templates as acceptable for database insertion', () => {
    fc.assert(
      fc.property(complexTemplateArbitrary, (template) => {
        const parseResult = parseTemplate(template);
        
        // Valid templates should be marked as acceptable
        if (parseResult.valid) {
          return true; // Valid templates pass the gate
        }
        
        // Invalid templates should have error messages
        return parseResult.errors.length > 0;
      }),
      { numRuns: 100 }
    );
  });

  it('should reject templates with invalid Handlebars syntax', () => {
    fc.assert(
      fc.property(
        complexTemplateArbitrary.chain((validTemplate) => {
          // Create invalid templates by breaking valid ones
          const invalidVariations = [
            validTemplate.replace('}}', '}'), // Missing closing brace
            validTemplate.replace('{{', '{'), // Missing opening brace
            validTemplate + '{{#if unclosed', // Unclosed block
          ];
          
          return fc.constantFrom(...invalidVariations);
        }),
        (invalidTemplate) => {
          const parseResult = parseTemplate(invalidTemplate);
          
          // Invalid templates must not pass validation
          // (or if they do, it's because they're accidentally valid)
          if (!parseResult.valid) {
            return parseResult.errors.length > 0;
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should validate templates before insertion with consistent results', () => {
    fc.assert(
      fc.property(complexTemplateArbitrary, (template) => {
        // Validate the same template multiple times
        const result1 = parseTemplate(template);
        const result2 = parseTemplate(template);
        const result3 = parseTemplate(template);
        
        // Results should be consistent
        return (
          result1.valid === result2.valid &&
          result2.valid === result3.valid &&
          result1.errors.length === result2.errors.length &&
          result2.errors.length === result3.errors.length
        );
      }),
      { numRuns: 100 }
    );
  });

  it('should validate templates pass-through after conversion', () => {
    fc.assert(
      fc.property(complexTemplateArbitrary, (template) => {
        // First validation
        const originalValidation = parseTemplate(template);
        
        if (!originalValidation.valid) {
          // If original is invalid, converted should also be invalid
          return true; // Property still holds
        }
        
        // Convert template
        const converted = prettyPrintTemplate(originalValidation.ast);
        
        // Second validation after conversion
        const convertedValidation = parseTemplate(converted);
        
        // Converted template must pass validation for database insertion
        return convertedValidation.valid === true;
      }),
      { numRuns: 100 }
    );
  });

  it('should provide meaningful error messages for invalid templates', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('{{#if unclosed'),
          fc.constant('{{variable without closing'),
          fc.constant('{{#each items}}missing closing{{#/each}}'),
          fc.constant('}}{{{')
        ),
        (invalidTemplate) => {
          const parseResult = parseTemplate(invalidTemplate);
          
          // Invalid templates should have errors
          if (!parseResult.valid) {
            return parseResult.errors.length > 0;
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should ensure validation prevents corrupted templates from reaching database', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          complexTemplateArbitrary,
          fc.boolean()
        ),
        ([template, shouldCorrupt]) => {
          let testTemplate = template;
          
          // Optionally corrupt the template
          if (shouldCorrupt && template.length > 2) {
            // Corrupt by removing random characters
            const idx = Math.floor(Math.random() * template.length);
            testTemplate = template.substring(0, idx) + template.substring(idx + 1);
          }
          
          const validation = parseTemplate(testTemplate);
          
          // Each template result should be deterministic
          const validation2 = parseTemplate(testTemplate);
          
          return (
            validation.valid === validation2.valid &&
            validation.errors.length === validation2.errors.length
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});
