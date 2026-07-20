/**
 * Property-Based Tests for Template Orchestrator
 * 
 * This test suite validates correctness properties for the Template Orchestrator service.
 * Uses fast-check library to generate random test cases and verify universal properties.
 * 
 * Tag: Feature: database-template-integration
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import fc from 'fast-check';
import type { ContractType, TemplateLanguage, ContractTemplate, TemplateVariable } from '@/lib/types/template';
import type { ContractData } from '@/app/components/contract-generator/types';
import { renderContract, RenderResult } from './templateOrchestrator';

// Mock dependencies
vi.mock('./templateService', () => ({
  getActiveTemplateWithCache: vi.fn(),
}));

vi.mock('./fallbackProvider', () => ({
  getHardcodedTemplateWithReason: vi.fn(),
}));

vi.mock('./variableMapper', () => ({
  mapFormDataToContext: vi.fn(),
}));

vi.mock('@/lib/templateEngine', () => ({
  renderTemplate: vi.fn(),
}));

import { getActiveTemplateWithCache } from './templateService';
import { getHardcodedTemplateWithReason } from './fallbackProvider';
import { mapFormDataToContext } from './variableMapper';
import { renderTemplate } from '@/lib/templateEngine';

// ============================================================================
// Arbitraries for generating test data
// ============================================================================

const contractTypeArbitrary = fc.oneof(
  fc.constant('lease' as ContractType),
  fc.constant('vehicle-sale' as ContractType),
  fc.constant('property-sale' as ContractType),
  fc.constant('employment' as ContractType),
  fc.constant('testament' as ContractType)
);

const languageArbitrary = fc.oneof(
  fc.constant('th' as TemplateLanguage),
  fc.constant('en' as TemplateLanguage)
);

/**
 * Generate form data with various field types including strings, numbers, dates, 
 * special characters, and null values
 */
const formDataArbitrary = fc.record({
  sellerName: fc.oneof(fc.string(), fc.constant(null)),
  sellerAddress: fc.oneof(fc.string(), fc.constant(null)),
  sellerTaxId: fc.oneof(fc.string(), fc.constant(null)),
  sellerSigner: fc.oneof(fc.string(), fc.constant(null)),
  buyerName: fc.oneof(fc.string(), fc.constant(null)),
  buyerAddress: fc.oneof(fc.string(), fc.constant(null)),
  buyerTaxId: fc.oneof(fc.string(), fc.constant(null)),
  buyerSigner: fc.oneof(fc.string(), fc.constant(null)),
  productName: fc.oneof(fc.string(), fc.constant(null)),
  quantity: fc.oneof(fc.integer(), fc.constant(null)),
  unit: fc.oneof(fc.string(), fc.constant(null)),
  unitPrice: fc.oneof(fc.integer({ min: 0 }), fc.constant(null)),
  currency: fc.oneof(fc.string(), fc.constant(null)),
  deliveryDeadline: fc.oneof(fc.date().map(d => d.toISOString()), fc.constant(null)),
  deliveryMethod: fc.oneof(fc.string(), fc.constant(null)),
  paymentMethod: fc.oneof(fc.string(), fc.constant(null)),
  depositAmount: fc.oneof(fc.integer({ min: 0 }), fc.constant(null)),
  penaltyRate: fc.oneof(fc.double({ minValue: 0, maxValue: 100 }), fc.constant(null)),
  contractDate: fc.oneof(fc.date().map(d => d.toISOString()), fc.constant(null)),
  state: fc.oneof(fc.string(), fc.constant(null)),
  country: fc.oneof(fc.string(), fc.constant(null)),
  vehicleBrand: fc.oneof(fc.string(), fc.constant(null)),
  vehicleModel: fc.oneof(fc.string(), fc.constant(null)),
  vehicleYear: fc.oneof(fc.string(), fc.constant(null)),
  vehiclePlate: fc.oneof(fc.string(), fc.constant(null)),
  vehicleColor: fc.oneof(fc.string(), fc.constant(null)),
  vehicleMileage: fc.oneof(fc.string(), fc.constant(null)),
  vehiclePrice: fc.oneof(fc.integer({ min: 0 }), fc.constant(null)),
  propertyCategory: fc.oneof(fc.string(), fc.constant(null)),
  propertyAddress: fc.oneof(fc.string(), fc.constant(null)),
  propertyArea: fc.oneof(fc.string(), fc.constant(null)),
  propertyFloor: fc.oneof(fc.string(), fc.constant(null)),
  propertyPrice: fc.oneof(fc.integer({ min: 0 }), fc.constant(null)),
  employmentPosition: fc.oneof(fc.string(), fc.constant(null)),
  employmentStartDate: fc.oneof(fc.date().map(d => d.toISOString()), fc.constant(null)),
  salaryAmount: fc.oneof(fc.integer({ min: 0 }), fc.constant(null)),
  workLocation: fc.oneof(fc.string(), fc.constant(null)),
  employmentBenefits: fc.oneof(fc.string(), fc.constant(null)),
  employmentTerm: fc.oneof(fc.string(), fc.constant(null)),
  testamentDate: fc.oneof(fc.date().map(d => d.toISOString()), fc.constant(null)),
  testamentBeneficiaryName: fc.oneof(fc.string(), fc.constant(null)),
  testamentExecutorName: fc.oneof(fc.string(), fc.constant(null)),
  testamentWitnesses: fc.oneof(fc.string(), fc.constant(null)),
  testamentAssets: fc.oneof(fc.string(), fc.constant(null)),
  testamentNotes: fc.oneof(fc.string(), fc.constant(null)),
}) as fc.Arbitrary<ContractData>;

/**
 * Generate template variable definitions
 */
const templateVariableArbitrary: fc.Arbitrary<TemplateVariable> = fc.record({
  name: fc.string({ minLength: 1 }),
  type: fc.oneof(
    fc.constant('string'),
    fc.constant('number'),
    fc.constant('date'),
    fc.constant('boolean'),
    fc.constant('array'),
    fc.constant('object')
  ) as fc.Arbitrary<TemplateVariable['type']>,
  description: fc.string(),
  required: fc.boolean(),
  defaultValue: fc.oneof(fc.string(), fc.integer(), fc.constant(null)),
});

/**
 * Generate database template with all required fields
 */
const databaseTemplateArbitrary = fc.record({
  id: fc.uuidV(4),
  contract_type: contractTypeArbitrary,
  language: languageArbitrary,
  version: fc.integer({ min: 1, max: 100 }),
  template_html: fc.string().map(s => `<html><body>${s}</body></html>`),
  template_css: fc.oneof(fc.string(), fc.constant(null)),
  variables: fc.array(templateVariableArbitrary, { minLength: 1, maxLength: 10 }),
  name: fc.string({ minLength: 1 }),
  description: fc.oneof(fc.string(), fc.constant(null)),
  is_active: fc.constant(true),
  is_draft: fc.constant(false),
  created_by: fc.oneof(fc.string(), fc.constant(null)),
  created_at: fc.date().map(d => d.toISOString()),
  updated_at: fc.date().map(d => d.toISOString()),
}) as fc.Arbitrary<ContractTemplate>;

// ============================================================================
// Helper functions for test setup
// ============================================================================

/**
 * Deep clone an object to test immutability
 */
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Verify two objects are deeply equal
 */
function deepEqual<T>(a: T, b: T): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

// ============================================================================
// Property-Based Tests
// ============================================================================

describe('Template Orchestrator - Property-Based Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Property 5: Template Metadata Completeness
   * 
   * For any template returned by renderContract() (database or fallback),
   * metadata SHALL include: source, contractType, language.
   * Database templates also include: templateId, version.
   * 
   * **Validates: Requirements 2.6, 5.5**
   * **Tag: Feature: database-template-integration, Property 5: Template Metadata Completeness**
   */
  describe('Property 5: Template Metadata Completeness', () => {
    it(
      'should always return metadata with source, contractType, language',
      async () => {
        await fc.assert(
          fc.asyncProperty(
            contractTypeArbitrary,
            languageArbitrary,
            formDataArbitrary,
            async (contractType, language, formData) => {
              // Setup: mock fallback provider
              (getHardcodedTemplateWithReason as any).mockReturnValue({
                html: '<html><body>Test</body></html>',
                source: 'hardcoded',
                contractType,
                language,
              });

              (mapFormDataToContext as any).mockReturnValue({
                context: {},
                warnings: [],
              });

              // No database template found (cache miss)
              (getActiveTemplateWithCache as any).mockResolvedValue({
                data: null,
                error: null,
                fromCache: false,
              });

              const result: RenderResult = await renderContract(contractType, language, formData);

              // Verify metadata has required fields
              expect(result.metadata).toBeDefined();
              expect(result.metadata.source).toBeDefined();
              expect(['database', 'fallback']).toContain(result.metadata.source);
              expect(result.metadata.contractType).toBe(contractType);
              expect(result.metadata.language).toBe(language);

              // If database source, templateId and version should exist
              if (result.metadata.source === 'database') {
                expect(result.metadata.templateId).toBeDefined();
                expect(result.metadata.version).toBeDefined();
                expect(typeof result.metadata.version).toBe('number');
              }
            }
          ),
          { numRuns: 100 }
        );
      }
    );

    it(
      'database template metadata should include templateId and version',
      async () => {
        await fc.assert(
          fc.asyncProperty(
            databaseTemplateArbitrary,
            contractTypeArbitrary,
            languageArbitrary,
            formDataArbitrary,
            async (template, contractType, language, formData) => {
              // Override contract type and language from template
              const dbTemplate = { ...template, contract_type: contractType, language };

              (getActiveTemplateWithCache as any).mockResolvedValue({
                data: dbTemplate,
                error: null,
                fromCache: false,
              });

              (mapFormDataToContext as any).mockReturnValue({
                context: {},
                warnings: [],
              });

              (renderTemplate as any).mockReturnValue('<html>rendered</html>');

              const result: RenderResult = await renderContract(contractType, language, formData);

              // Verify database template metadata is complete
              if (result.metadata.source === 'database') {
                expect(result.metadata.templateId).toBe(dbTemplate.id);
                expect(result.metadata.version).toBe(dbTemplate.version);
              }
            }
          ),
          { numRuns: 100 }
        );
      }
    );
  });

  /**
   * Property 14: Rendered HTML Always Returned
   * 
   * For any contract rendering request (successful database or fallback),
   * system SHALL return non-empty HTML string. Never return null or undefined for html field.
   * 
   * **Validates: Requirements 5.4**
   * **Tag: Feature: database-template-integration, Property 14: Rendered HTML Always Returned**
   */
  describe('Property 14: Rendered HTML Always Returned', () => {
    it(
      'should always return non-empty HTML for fallback path',
      async () => {
        await fc.assert(
          fc.asyncProperty(
            contractTypeArbitrary,
            languageArbitrary,
            formDataArbitrary,
            async (contractType, language, formData) => {
              // No database template
              (getActiveTemplateWithCache as any).mockResolvedValue({
                data: null,
                error: null,
                fromCache: false,
              });

              (getHardcodedTemplateWithReason as any).mockReturnValue({
                html: '<html><body>Fallback Content</body></html>',
                source: 'hardcoded',
                contractType,
                language,
              });

              (mapFormDataToContext as any).mockReturnValue({
                context: {},
                warnings: [],
              });

              const result: RenderResult = await renderContract(contractType, language, formData);

              // HTML must never be null or undefined
              expect(result.html).toBeDefined();
              expect(result.html).not.toBeNull();
              expect(typeof result.html).toBe('string');
              expect(result.html.length).toBeGreaterThan(0);
            }
          ),
          { numRuns: 100 }
        );
      }
    );

    it(
      'should always return non-empty HTML for database path',
      async () => {
        await fc.assert(
          fc.asyncProperty(
            databaseTemplateArbitrary,
            contractTypeArbitrary,
            languageArbitrary,
            formDataArbitrary,
            async (template, contractType, language, formData) => {
              const dbTemplate = { ...template, contract_type: contractType, language };

              (getActiveTemplateWithCache as any).mockResolvedValue({
                data: dbTemplate,
                error: null,
                fromCache: false,
              });

              (mapFormDataToContext as any).mockReturnValue({
                context: {},
                warnings: [],
              });

              const renderedHtml = '<html><body>Database Template Content</body></html>';
              (renderTemplate as any).mockReturnValue(renderedHtml);

              const result: RenderResult = await renderContract(contractType, language, formData);

              // HTML must never be null or undefined
              expect(result.html).toBeDefined();
              expect(result.html).not.toBeNull();
              expect(typeof result.html).toBe('string');
              expect(result.html.length).toBeGreaterThan(0);
              expect(result.html).toBe(renderedHtml);
            }
          ),
          { numRuns: 100 }
        );
      }
    );

    it(
      'should return HTML even when database rendering fails',
      async () => {
        await fc.assert(
          fc.asyncProperty(
            databaseTemplateArbitrary,
            contractTypeArbitrary,
            languageArbitrary,
            formDataArbitrary,
            async (template, contractType, language, formData) => {
              const dbTemplate = { ...template, contract_type: contractType, language };

              (getActiveTemplateWithCache as any).mockResolvedValue({
                data: dbTemplate,
                error: null,
                fromCache: false,
              });

              (mapFormDataToContext as any).mockReturnValue({
                context: {},
                warnings: [],
              });

              // Database rendering fails
              (renderTemplate as any).mockImplementationOnce(() => {
                throw new Error('Template rendering failed');
              });

              // Fallback succeeds
              (getHardcodedTemplateWithReason as any).mockReturnValue({
                html: '<html><body>Fallback after error</body></html>',
                source: 'hardcoded',
                contractType,
                language,
              });

              const result: RenderResult = await renderContract(contractType, language, formData);

              // Even with rendering error, HTML must be returned
              expect(result.html).toBeDefined();
              expect(result.html).not.toBeNull();
              expect(typeof result.html).toBe('string');
              expect(result.html.length).toBeGreaterThan(0);
            }
          ),
          { numRuns: 100 }
        );
      }
    );
  });

  /**
   * Property 15: FormData Immutability Through Fallback
   * 
   * For any FormData object passed to renderContract(),
   * the original FormData SHALL remain unmodified after rendering.
   * Deep equality check before and after.
   * 
   * **Validates: Requirements 5.7**
   * **Tag: Feature: database-template-integration, Property 15: FormData Immutability Through Fallback**
   */
  describe('Property 15: FormData Immutability Through Fallback', () => {
    it(
      'should not modify original FormData during fallback rendering',
      async () => {
        await fc.assert(
          fc.asyncProperty(
            contractTypeArbitrary,
            languageArbitrary,
            formDataArbitrary,
            async (contractType, language, formData) => {
              // Deep clone for comparison
              const formDataBefore = deepClone(formData);

              // No database template - fallback path
              (getActiveTemplateWithCache as any).mockResolvedValue({
                data: null,
                error: null,
                fromCache: false,
              });

              (getHardcodedTemplateWithReason as any).mockReturnValue({
                html: '<html><body>Fallback</body></html>',
                source: 'hardcoded',
                contractType,
                language,
              });

              (mapFormDataToContext as any).mockReturnValue({
                context: {},
                warnings: [],
              });

              await renderContract(contractType, language, formData);

              // Verify FormData is unchanged
              expect(deepEqual(formData, formDataBefore)).toBe(true);
            }
          ),
          { numRuns: 100 }
        );
      }
    );

    it(
      'should not modify original FormData during database rendering',
      async () => {
        await fc.assert(
          fc.asyncProperty(
            databaseTemplateArbitrary,
            contractTypeArbitrary,
            languageArbitrary,
            formDataArbitrary,
            async (template, contractType, language, formData) => {
              const formDataBefore = deepClone(formData);
              const dbTemplate = { ...template, contract_type: contractType, language };

              (getActiveTemplateWithCache as any).mockResolvedValue({
                data: dbTemplate,
                error: null,
                fromCache: false,
              });

              (mapFormDataToContext as any).mockReturnValue({
                context: {},
                warnings: [],
              });

              (renderTemplate as any).mockReturnValue('<html>rendered</html>');

              await renderContract(contractType, language, formData);

              // Verify FormData is unchanged
              expect(deepEqual(formData, formDataBefore)).toBe(true);
            }
          ),
          { numRuns: 100 }
        );
      }
    );

    it(
      'should not modify original FormData even when rendering fails',
      async () => {
        await fc.assert(
          fc.asyncProperty(
            databaseTemplateArbitrary,
            contractTypeArbitrary,
            languageArbitrary,
            formDataArbitrary,
            async (template, contractType, language, formData) => {
              const formDataBefore = deepClone(formData);
              const dbTemplate = { ...template, contract_type: contractType, language };

              (getActiveTemplateWithCache as any).mockResolvedValue({
                data: dbTemplate,
                error: null,
                fromCache: false,
              });

              (mapFormDataToContext as any).mockReturnValue({
                context: {},
                warnings: [],
              });

              // Rendering fails
              (renderTemplate as any).mockImplementationOnce(() => {
                throw new Error('Rendering failed');
              });

              (getHardcodedTemplateWithReason as any).mockReturnValue({
                html: '<html>Fallback</html>',
                source: 'hardcoded',
                contractType,
                language,
              });

              await renderContract(contractType, language, formData);

              // FormData must still be unchanged
              expect(deepEqual(formData, formDataBefore)).toBe(true);
            }
          ),
          { numRuns: 100 }
        );
      }
    );
  });

  /**
   * Property 16: Structured Error Log Completeness
   * 
   * For any error scenario (database error, rendering error, etc),
   * error logs SHALL include: timestamp, machineId, category, message, metadata.
   * Metadata SHALL include: contractType, language, and error-specific fields.
   * ISO 8601 timestamp format.
   * 
   * **Validates: Requirements 6.1, 6.3, 6.4, 6.6, 6.7**
   * **Tag: Feature: database-template-integration, Property 16: Structured Error Log Completeness**
   */
  describe('Property 16: Structured Error Log Completeness', () => {
    let consoleErrorLogs: any[];
    let consoleWarnLogs: any[];

    beforeEach(() => {
      consoleErrorLogs = [];
      consoleWarnLogs = [];

      // Spy on console.error and console.warn to capture logs
      vi.spyOn(console, 'error').mockImplementation((msg: string) => {
        try {
          consoleErrorLogs.push(JSON.parse(msg));
        } catch {
          consoleErrorLogs.push(msg);
        }
      });

      vi.spyOn(console, 'warn').mockImplementation((msg: string) => {
        try {
          consoleWarnLogs.push(JSON.parse(msg));
        } catch {
          consoleWarnLogs.push(msg);
        }
      });
    });

    it(
      'should log structured error when database connection fails',
      async () => {
        await fc.assert(
          fc.asyncProperty(
            contractTypeArbitrary,
            languageArbitrary,
            formDataArbitrary,
            async (contractType, language, formData) => {
              const dbError = new Error('Database connection failed');

              (getActiveTemplateWithCache as any).mockResolvedValue({
                data: null,
                error: dbError,
                fromCache: false,
              });

              (getHardcodedTemplateWithReason as any).mockReturnValue({
                html: '<html>Fallback</html>',
                source: 'hardcoded',
                contractType,
                language,
              });

              (mapFormDataToContext as any).mockReturnValue({
                context: {},
                warnings: [],
              });

              await renderContract(contractType, language, formData);

              // Find structured error logs
              const logs = [...consoleErrorLogs, ...consoleWarnLogs];
              const structuredLogs = logs.filter(log => typeof log === 'object' && log.timestamp);

              // At least one structured log should exist
              expect(structuredLogs.length).toBeGreaterThan(0);

              // Verify log structure - check any log has the required fields
              const hasValidLog = structuredLogs.some(log => 
                log.timestamp &&
                log.machineId &&
                log.category &&
                log.message &&
                log.metadata &&
                log.metadata.contractType === contractType &&
                log.metadata.language === language
              );
              expect(hasValidLog).toBe(true);

              // Verify ISO 8601 timestamp format in all logs
              structuredLogs.forEach(log => {
                expect(log.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
              });
            }
          ),
          { numRuns: 100 }
        );
      }
    );

    it(
      'should log structured error when template rendering fails',
      async () => {
        await fc.assert(
          fc.asyncProperty(
            databaseTemplateArbitrary,
            contractTypeArbitrary,
            languageArbitrary,
            formDataArbitrary,
            async (template, contractType, language, formData) => {
              const dbTemplate = { ...template, contract_type: contractType, language };

              (getActiveTemplateWithCache as any).mockResolvedValue({
                data: dbTemplate,
                error: null,
                fromCache: false,
              });

              (mapFormDataToContext as any).mockReturnValue({
                context: {},
                warnings: [],
              });

              // Rendering fails
              (renderTemplate as any).mockImplementationOnce(() => {
                throw new Error('Invalid template syntax');
              });

              (getHardcodedTemplateWithReason as any).mockReturnValue({
                html: '<html>Fallback</html>',
                source: 'hardcoded',
                contractType,
                language,
              });

              await renderContract(contractType, language, formData);

              // Find structured error logs
              const logs = [...consoleErrorLogs, ...consoleWarnLogs];
              const structuredLogs = logs.filter(log => typeof log === 'object' && log.timestamp);

              // Should have error logs
              expect(structuredLogs.length).toBeGreaterThan(0);

              // Verify template-specific metadata exists in error logs
              const renderingErrorLogs = structuredLogs.filter(log => log.category === 'template-rendering');
              expect(renderingErrorLogs.length).toBeGreaterThan(0);
              
              // At least one rendering error log should have error message
              const hasErrorMessage = renderingErrorLogs.some(log => log.metadata.errorMessage !== undefined);
              expect(hasErrorMessage).toBe(true);
            }
          ),
          { numRuns: 100 }
        );
      }
    );

    it(
      'should include fallback-usage logs with proper metadata',
      async () => {
        await fc.assert(
          fc.asyncProperty(
            contractTypeArbitrary,
            languageArbitrary,
            formDataArbitrary,
            async (contractType, language, formData) => {
              // No database template
              (getActiveTemplateWithCache as any).mockResolvedValue({
                data: null,
                error: null,
                fromCache: false,
              });

              (getHardcodedTemplateWithReason as any).mockReturnValue({
                html: '<html>Fallback</html>',
                source: 'hardcoded',
                contractType,
                language,
              });

              (mapFormDataToContext as any).mockReturnValue({
                context: {},
                warnings: [],
              });

              await renderContract(contractType, language, formData);

              // Find structured logs
              const logs = [...consoleErrorLogs, ...consoleWarnLogs];
              const structuredLogs = logs.filter(log => typeof log === 'object' && log.timestamp);

              // Should have logs from template retrieval
              const hasRelevantLogs = structuredLogs.some(log =>
                (log.category === 'template-retrieval' || log.category === 'fallback-usage') &&
                log.metadata &&
                log.metadata.contractType === contractType &&
                log.metadata.language === language
              );
              expect(hasRelevantLogs).toBe(true);

              // Check that logs have either reason or no-template indicator
              const logsWithMetadata = structuredLogs.filter(log =>
                log.metadata && log.metadata.contractType === contractType
              );
              expect(logsWithMetadata.length).toBeGreaterThan(0);
            }
          ),
          { numRuns: 100 }
        );
      }
    );

    it(
      'should use ISO 8601 timestamp format in all logs',
      async () => {
        await fc.assert(
          fc.asyncProperty(
            contractTypeArbitrary,
            languageArbitrary,
            formDataArbitrary,
            async (contractType, language, formData) => {
              (getActiveTemplateWithCache as any).mockResolvedValue({
                data: null,
                error: null,
                fromCache: false,
              });

              (getHardcodedTemplateWithReason as any).mockReturnValue({
                html: '<html>Fallback</html>',
                source: 'hardcoded',
                contractType,
                language,
              });

              (mapFormDataToContext as any).mockReturnValue({
                context: {},
                warnings: [],
              });

              await renderContract(contractType, language, formData);

              // Verify all timestamps are ISO 8601
              const logs = [...consoleErrorLogs, ...consoleWarnLogs];
              const structuredLogs = logs.filter(log => typeof log === 'object' && log.timestamp);

              structuredLogs.forEach(log => {
                // ISO 8601 pattern: YYYY-MM-DDTHH:mm:ss.sssZ or similar
                expect(log.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
              });
            }
          ),
          { numRuns: 100 }
        );
      }
    );
  });
});
