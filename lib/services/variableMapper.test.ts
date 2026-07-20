// lib/services/variableMapper.test.ts
// Property-based tests for Variable Mapper service
// Feature: database-template-integration

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { ContractData } from '@/app/components/contract-generator/types';
import type { TemplateVariable } from '@/lib/types/template';
import { mapFormDataToContext, validateVariableMapping } from './variableMapper';

/**
 * Arbitrary generators for property-based testing
 */

// Generator for monetary field names
const monetaryFieldNameArb = fc.oneof(
  fc.constant('unitPrice'),
  fc.constant('vehiclePrice'),
  fc.constant('propertyPrice'),
  fc.constant('salaryAmount'),
  fc.constant('depositAmount'),
  fc.constant('rentalFee'),
  fc.constant('charge'),
  fc.constant('cost'),
  fc.constant('wage'),
  fc.tuple(
    fc.stringMatching(/^[a-zA-Z]+/),
    fc.oneof(
      fc.constant('Price'),
      fc.constant('Amount'),
      fc.constant('Cost'),
      fc.constant('Fee'),
      fc.constant('Salary'),
      fc.constant('Charge')
    )
  ).map(([prefix, suffix]) => prefix + suffix)
);

// Generator for non-monetary field names
const nonMonetaryFieldNameArb = fc.oneof(
  fc.constant('sellerName'),
  fc.constant('buyerName'),
  fc.constant('productName'),
  fc.constant('contractDate'),
  fc.constant('deliveryDeadline'),
  fc.constant('deliveryMethod'),
  fc.constant('paymentMethod'),
  fc.constant('vehicleBrand'),
  fc.constant('vehicleModel'),
  fc.constant('propertyAddress'),
  fc.constant('employmentPosition'),
  fc.constant('workLocation'),
  fc.stringMatching(/^[a-zA-Z]+[a-zA-Z0-9]*/)
);

// Generator for ISO 8601 date strings
const isoDateArb = fc.tuple(
  fc.integer({ min: 2020, max: 2030 }),
  fc.integer({ min: 1, max: 12 }),
  fc.integer({ min: 1, max: 28 })
).map(([year, month, day]) => 
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
);

// Generator for FormData-like objects
const formDataArb: fc.Arbitrary<Record<string, any>> = fc.object({
  sellerName: fc.string(),
  buyerName: fc.string(),
  productName: fc.string(),
  contractDate: isoDateArb,
  deliveryDeadline: isoDateArb,
  unitPrice: fc.integer({ min: 0, max: 1000000 }),
  vehiclePrice: fc.integer({ min: 0, max: 5000000 }),
  propertyPrice: fc.integer({ min: 0, max: 50000000 }),
  salaryAmount: fc.integer({ min: 0, max: 500000 }),
  depositAmount: fc.integer({ min: 0, max: 100000 }),
  vehicleBrand: fc.string(),
  vehicleModel: fc.string(),
  propertyAddress: fc.string(),
  employmentPosition: fc.string(),
  workLocation: fc.string(),
});

// Generator for template variables
const templateVariableArb: fc.Arbitrary<TemplateVariable> = fc
  .tuple(
    fc.stringMatching(/^[a-zA-Z]+[a-zA-Z0-9]*/),
    fc.oneof(
      fc.constant('string' as const),
      fc.constant('number' as const),
      fc.constant('date' as const),
      fc.constant('boolean' as const)
    ),
    fc.string(),
    fc.boolean()
  )
  .map(([name, type, description, required]) => ({
    name,
    type,
    description,
    required,
  }));

/**
 * Property 9: FormData Variable Extraction Completeness
 * For any FormData, all fields should be extracted
 * Validates: Requirements 4.1
 */
describe('Property 9: FormData Variable Extraction Completeness', () => {
  it(
    'should extract all fields from any FormData object',
    () => {
      fc.assert(
        fc.property(formDataArb, (formData) => {
          // Arrange
          const formDataKeys = Object.keys(formData).filter(
            (key) => formData[key] !== undefined && key !== '__proto__'
          );

          // Act
          const result = mapFormDataToContext(formData);

          // Assert
          // All FormData fields should be present in context (except helpers and validation fields)
          for (const key of formDataKeys) {
            expect(result.context).toHaveProperty(key);
          }
        }),
        { numRuns: 100 }
      );
    }
  );

  it(
    'should extract all defined fields from partial FormData',
    () => {
      fc.assert(
        fc.property(
          fc.tuple(
            nonMonetaryFieldNameArb,
            fc.string()
          ),
          ([fieldName, fieldValue]) => {
            // Arrange
            const formData: Record<string, any> = {
              [fieldName]: fieldValue,
            };

            // Act
            const result = mapFormDataToContext(formData);

            // Assert
            expect(result.context).toHaveProperty(fieldName);
            expect(result.context[fieldName]).toEqual(fieldValue);
          }
        ),
        { numRuns: 100 }
      );
    }
  );
});

/**
 * Property 10: Field Name Mapping Correctness
 * FormData field names should map to template variables (e.g., sellerName → sellerName)
 * Validates: Requirements 4.2
 */
describe('Property 10: Field Name Mapping Correctness', () => {
  it(
    'should preserve field names from FormData to context',
    () => {
      fc.assert(
        fc.property(nonMonetaryFieldNameArb, fc.string(), (fieldName, fieldValue) => {
          // Arrange
          const formData: Record<string, any> = {
            [fieldName]: fieldValue,
          };

          // Act
          const result = mapFormDataToContext(formData);

          // Assert
          expect(result.context).toHaveProperty(fieldName);
          expect(result.context[fieldName]).toBe(fieldValue);
        }),
        { numRuns: 100 }
      );
    }
  );

  it(
    'should map monetary fields with exact same names',
    () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('unitPrice'),
            fc.constant('vehiclePrice'),
            fc.constant('propertyPrice'),
            fc.constant('salaryAmount'),
            fc.constant('depositAmount'),
            fc.constant('rentalFee'),
            fc.constant('charge'),
            fc.constant('cost'),
            fc.constant('wage'),
            fc.constant('payment'),
            fc.constant('amount')
          ),
          fc.integer({ min: 0 }),
          (fieldName, value) => {
            // Arrange
            const formData: Record<string, any> = {
              [fieldName]: value,
            };

            // Act
            const result = mapFormDataToContext(formData);

            // Assert
            expect(result.context).toHaveProperty(fieldName);
            expect(typeof result.context[fieldName]).toBe('number');
            expect(result.context[fieldName]).toBe(value);
          }
        ),
        { numRuns: 100 }
      );
    }
  );

  it(
    'should maintain 1:1 mapping between FormData keys and context keys (excluding helpers)',
    () => {
      fc.assert(
        fc.property(formDataArb, (formData) => {
          // Arrange
          // Filter out dangerous keys like __proto__, constructor, prototype to avoid prototype pollution
          const formDataKeys = Object.keys(formData).filter(
            (key) => formData[key] !== undefined && 
                     key !== '__proto__' && 
                     key !== 'constructor' && 
                     key !== 'prototype'
          );

          // Act
          const result = mapFormDataToContext(formData);

          // Assert
          // Every key in FormData should exist in context
          for (const key of formDataKeys) {
            expect(result.context).toHaveProperty(key);
          }

          // Context should not have extra keys (except helpers)
          const contextNonHelperKeys = Object.keys(result.context).filter(
            (key) => key !== 'helpers' && 
                     key !== '__proto__' && 
                     key !== 'constructor' && 
                     key !== 'prototype'
          );
          expect(contextNonHelperKeys.length).toBe(formDataKeys.length);
        }),
        { numRuns: 100 }
      );
    }
  );
});

/**
 * Property 11: Helper Context Inclusion
 * All Handlebars helpers (formatDate, formatMoney, thaiBahtText, etc.) should be included
 * Validates: Requirements 4.4
 */
describe('Property 11: Helper Context Inclusion', () => {
  it(
    'should include all required Handlebars helpers in context',
    () => {
      fc.assert(
        fc.property(formDataArb, (formData) => {
          // Arrange
          const requiredHelpers = [
            'formatDate',
            'formatMoney',
            'thaiBahtText',
            'add',
            'subtract',
            'multiply',
            'divide',
            'uppercase',
            'lowercase',
            'capitalize',
            'eq',
            'ne',
            'lt',
            'gt',
            'lte',
            'gte',
            'and',
            'or',
            'not',
          ];

          // Act
          const result = mapFormDataToContext(formData);

          // Assert
          expect(result.context).toHaveProperty('helpers');
          expect(typeof result.context.helpers).toBe('object');

          for (const helperName of requiredHelpers) {
            expect(result.context.helpers).toHaveProperty(helperName);
            expect(typeof result.context.helpers[helperName]).toBe('function');
          }
        }),
        { numRuns: 100 }
      );
    }
  );

  it(
    'should include formatDate helper that is callable',
    () => {
      fc.assert(
        fc.property(formDataArb, (formData) => {
          // Arrange
          const testDate = '2024-01-15';

          // Act
          const result = mapFormDataToContext(formData);

          // Assert
          expect(typeof result.context.helpers.formatDate).toBe('function');

          // Should not throw when called
          const formattedDate = result.context.helpers.formatDate(testDate, 'th');
          expect(typeof formattedDate).toBe('string');
          expect(formattedDate.length).toBeGreaterThan(0);
        }),
        { numRuns: 50 }
      );
    }
  );

  it(
    'should include formatMoney helper that is callable',
    () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 1000000 }), (amount) => {
          // Arrange
          const formData = { testAmount: amount };

          // Act
          const result = mapFormDataToContext(formData);

          // Assert
          expect(typeof result.context.helpers.formatMoney).toBe('function');

          // Should not throw when called
          const formattedMoney = result.context.helpers.formatMoney(amount);
          expect(typeof formattedMoney).toBe('string');
          expect(formattedMoney.length).toBeGreaterThan(0);
        }),
        { numRuns: 50 }
      );
    }
  );

  it(
    'should include thaiBahtText helper that is callable',
    () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 10000 }), (amount) => {
          // Arrange
          const formData = { testAmount: amount };

          // Act
          const result = mapFormDataToContext(formData);

          // Assert
          expect(typeof result.context.helpers.thaiBahtText).toBe('function');

          // Should not throw when called
          const bahtText = result.context.helpers.thaiBahtText(amount);
          expect(typeof bahtText).toBe('string');
          expect(bahtText.length).toBeGreaterThan(0);
          expect(bahtText).toMatch(/บาท/);
        }),
        { numRuns: 50 }
      );
    }
  );

  it(
    'should include math helpers (add, subtract, multiply, divide)',
    () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer({ min: 1 }), (a, b) => {
          // Arrange
          const formData = { value: a };

          // Act
          const result = mapFormDataToContext(formData);

          // Assert
          expect(result.context.helpers.add(a, b)).toBe(a + b);
          expect(result.context.helpers.subtract(a, b)).toBe(a - b);
          expect(result.context.helpers.multiply(a, b)).toBe(a * b);
          expect(result.context.helpers.divide(a, b)).toBe(a / b);
        }),
        { numRuns: 100 }
      );
    }
  );

  it(
    'should include comparison helpers (eq, ne, lt, gt, lte, gte)',
    () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), (a, b) => {
          // Arrange
          const formData = { valueA: a, valueB: b };

          // Act
          const result = mapFormDataToContext(formData);

          // Assert
          expect(result.context.helpers.eq(a, b)).toBe(a === b);
          expect(result.context.helpers.ne(a, b)).toBe(a !== b);
          expect(result.context.helpers.lt(a, b)).toBe(a < b);
          expect(result.context.helpers.gt(a, b)).toBe(a > b);
          expect(result.context.helpers.lte(a, b)).toBe(a <= b);
          expect(result.context.helpers.gte(a, b)).toBe(a >= b);
        }),
        { numRuns: 100 }
      );
    }
  );

  it(
    'should include logical helpers (and, or, not)',
    () => {
      fc.assert(
        fc.property(fc.boolean(), fc.boolean(), (a, b) => {
          // Arrange
          const formData = { flag1: a, flag2: b };

          // Act
          const result = mapFormDataToContext(formData);

          // Assert
          expect(result.context.helpers.and(a, b)).toBe(a && b);
          expect(result.context.helpers.or(a, b)).toBe(a || b);
          expect(result.context.helpers.not(a)).toBe(!a);
        }),
        { numRuns: 100 }
      );
    }
  );

  it(
    'should include string helpers (uppercase, lowercase, capitalize)',
    () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (str) => {
          // Arrange
          const formData = { text: str };

          // Act
          const result = mapFormDataToContext(formData);

          // Assert
          expect(result.context.helpers.uppercase(str)).toBe(str.toUpperCase());
          expect(result.context.helpers.lowercase(str)).toBe(str.toLowerCase());
          const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
          expect(result.context.helpers.capitalize(str)).toBe(capitalized);
        }),
        { numRuns: 100 }
      );
    }
  );
});

/**
 * Property 12: Variable Mismatch Detection
 * Template variables missing from FormData should be identified
 * Validates: Requirements 4.6
 */
describe('Property 12: Variable Mismatch Detection', () => {
  it(
    'should detect missing required variables',
    () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.array(templateVariableArb, { minLength: 1 }),
            formDataArb
          ),
          ([templateVariables, formData]) => {
            // Arrange
            const context = mapFormDataToContext(formData).context;

            // Only test required variables
            const requiredVars = templateVariables.filter((v) => v.required);
            if (requiredVars.length === 0) {
              return; // Skip if no required variables
            }

            // Act
            const warnings = validateVariableMapping(context, requiredVars);

            // Assert
            // For each required variable not in context, there should be a warning
            for (const variable of requiredVars) {
              if (!Object.keys(context).includes(variable.name)) {
                expect(warnings.join(' ')).toContain(variable.name);
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    }
  );

  it(
    'should report all missing required variables together',
    () => {
      fc.assert(
        fc.property(
          fc.array(
            templateVariableArb.filter((v) => v.required),
            { minLength: 1, maxLength: 5 }
          ),
          (requiredVariables) => {
            // Arrange
            const context: Record<string, any> = { helpers: {} };

            // Act
            const warnings = validateVariableMapping(context, requiredVariables);

            // Assert
            for (const variable of requiredVariables) {
              const hasWarning = warnings.some((w) =>
                w.includes(variable.name)
              );
              expect(hasWarning).toBe(true);
            }
            expect(warnings.length).toBeGreaterThanOrEqual(requiredVariables.length);
          }
        ),
        { numRuns: 100 }
      );
    }
  );

  it(
    'should not report warnings for missing optional variables',
    () => {
      fc.assert(
        fc.property(
          fc.array(
            templateVariableArb.filter((v) => !v.required),
            { minLength: 1 }
          ),
          (optionalVariables) => {
            // Arrange
            const context: Record<string, any> = { helpers: {} };

            // Act
            const warnings = validateVariableMapping(context, optionalVariables);

            // Assert
            for (const variable of optionalVariables) {
              const hasWarning = warnings.some((w) =>
                w.includes(`Missing ${variable.name}`)
              );
              expect(hasWarning).toBe(false);
            }
          }
        ),
        { numRuns: 100 }
      );
    }
  );

  it(
    'should detect type mismatches between template variable definition and context',
    () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.stringMatching(/^[a-zA-Z]+/),
            fc.oneof(
              fc.constant('string' as const),
              fc.constant('number' as const),
              fc.constant('date' as const)
            ),
            fc.anything()
          ),
          ([varName, expectedType, value]) => {
            // Arrange
            const variable: TemplateVariable = {
              name: varName,
              type: expectedType,
              description: 'Test variable',
              required: true,
            };

            const context: Record<string, any> = {
              [varName]: value,
              helpers: {},
            };

            // Only test if value type doesn't match expected type
            const valueType = typeof value;
            let shouldHaveWarning = false;

            if (expectedType === 'number' && value !== null && value !== undefined && valueType !== 'number') {
              shouldHaveWarning = true;
            } else if (expectedType === 'string' && value !== null && value !== undefined && valueType !== 'string') {
              shouldHaveWarning = true;
            }

            // Act
            const warnings = validateVariableMapping(context, [variable]);

            // Assert
            if (shouldHaveWarning) {
              expect(warnings.some((w) => w.includes('Type mismatch'))).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    }
  );
});

/**
 * Property 13: Numeric Type Preservation for Monetary Fields
 * Monetary fields should preserve numeric types
 * Validates: Requirements 4.8
 */
describe('Property 13: Numeric Type Preservation for Monetary Fields', () => {
  it(
    'should preserve numeric types for monetary field values',
    () => {
      fc.assert(
        fc.property(monetaryFieldNameArb, fc.integer({ min: 0 }), (fieldName, value) => {
          // Arrange
          const formData: Record<string, any> = {
            [fieldName]: value,
          };

          // Act
          const result = mapFormDataToContext(formData);

          // Assert
          expect(typeof result.context[fieldName]).toBe('number');
          expect(result.context[fieldName]).toBe(value);
        }),
        { numRuns: 100 }
      );
    }
  );

  it(
    'should convert string numbers to numeric type for monetary fields',
    () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('unitPrice'),
            fc.constant('vehiclePrice'),
            fc.constant('propertyPrice'),
            fc.constant('salaryAmount'),
            fc.constant('depositAmount'),
            fc.constant('rentalFee'),
            fc.constant('charge'),
            fc.constant('cost'),
            fc.constant('wage'),
            fc.constant('payment'),
            fc.constant('amount')
          ),
          fc.integer({ min: 0, max: 1000000 }),
          (fieldName, value) => {
            // Arrange
            const formData: Record<string, any> = {
              [fieldName]: value.toString(),
            };

            // Act
            const result = mapFormDataToContext(formData);

            // Assert
            expect(typeof result.context[fieldName]).toBe('number');
            expect(result.context[fieldName]).toBe(value);
          }
        ),
        { numRuns: 100 }
      );
    }
  );

  it(
    'should keep non-monetary fields as their original type',
    () => {
      fc.assert(
        fc.property(
          nonMonetaryFieldNameArb,
          fc.string(),
          (fieldName, value) => {
            // Arrange
            const formData: Record<string, any> = {
              [fieldName]: value,
            };

            // Act
            const result = mapFormDataToContext(formData);

            // Assert
            expect(typeof result.context[fieldName]).toBe('string');
            expect(result.context[fieldName]).toBe(value);
          }
        ),
        { numRuns: 100 }
      );
    }
  );

  it(
    'should preserve null/undefined for monetary fields',
    () => {
      fc.assert(
        fc.property(monetaryFieldNameArb, (fieldName) => {
          // Arrange & Act - test null
          const result1 = mapFormDataToContext({ [fieldName]: null });
          expect(result1.context[fieldName]).toBe(null);

          // Arrange & Act - test undefined (should not appear in context)
          const result2 = mapFormDataToContext({ [fieldName]: undefined });
          expect(result2.context[fieldName]).toBeUndefined();
        }),
        { numRuns: 50 }
      );
    }
  );

  it(
    'should handle all common monetary fields correctly',
    () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.oneof(
              fc.constant('unitPrice'),
              fc.constant('vehiclePrice'),
              fc.constant('propertyPrice'),
              fc.constant('salaryAmount'),
              fc.constant('depositAmount'),
              fc.constant('rentalFee')
            ),
            fc.integer({ min: 0, max: 50000000 })
          ),
          ([fieldName, value]) => {
            // Arrange
            const formData: Record<string, any> = {
              [fieldName]: value,
            };

            // Act
            const result = mapFormDataToContext(formData);

            // Assert
            expect(typeof result.context[fieldName]).toBe('number');
            expect(result.context[fieldName]).toBe(value);
          }
        ),
        { numRuns: 100 }
      );
    }
  );

  it(
    'should preserve numeric type through mapping roundtrip',
    () => {
      fc.assert(
        fc.property(
          fc.tuple(
            monetaryFieldNameArb,
            fc.integer({ min: 0, max: 1000000 })
          ),
          ([fieldName, value]) => {
            // Arrange
            const originalFormData: Record<string, any> = { [fieldName]: value };

            // Act
            const result1 = mapFormDataToContext(originalFormData);
            const firstPassValue = result1.context[fieldName];

            // Act again with the value from first pass
            const secondFormData: Record<string, any> = { [fieldName]: firstPassValue };
            const result2 = mapFormDataToContext(secondFormData);

            // Assert
            expect(typeof result2.context[fieldName]).toBe('number');
            expect(result2.context[fieldName]).toBe(value);
          }
        ),
        { numRuns: 100 }
      );
    }
  );
});
