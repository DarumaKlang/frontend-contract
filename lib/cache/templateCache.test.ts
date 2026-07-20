import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fc from 'fast-check';
import { TemplateCache, getTemplateCache, resetCacheInstance } from './templateCache';
import type { ContractTemplate, ContractType, TemplateLanguage } from '@/lib/types/template';

/**
 * Property-based tests for Template Cache
 * 
 * **Validates: Requirements 3.1, 3.2, 3.6**
 * Tag: "Feature: database-template-integration"
 */

// Test data generators
const contractTypeArb = fc.oneof(
  fc.constant('lease' as ContractType),
  fc.constant('vehicle-sale' as ContractType),
  fc.constant('property-sale' as ContractType),
  fc.constant('employment' as ContractType),
  fc.constant('testament' as ContractType)
);

const languageArb = fc.oneof(
  fc.constant('th' as TemplateLanguage),
  fc.constant('en' as TemplateLanguage)
);

const createMockTemplate = (
  contractType: ContractType,
  language: TemplateLanguage,
  index: number = 0
): ContractTemplate => ({
  id: `template-${contractType}-${language}-${index}`,
  contract_type: contractType,
  language: language,
  version: 1,
  template_html: `<div>Template for ${contractType} in ${language}</div>`,
  template_css: `.template { color: black; }`,
  variables: [
    { name: 'userName', type: 'string', description: 'User name', required: true },
    { name: 'amount', type: 'number', description: 'Amount', required: false },
  ],
  name: `Template ${contractType} ${language}`,
  description: null,
  is_active: true,
  is_draft: false,
  created_by: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

describe('Template Cache - Property Tests', () => {
  let cache: TemplateCache;

  beforeEach(() => {
    resetCacheInstance();
    cache = new TemplateCache();
  });

  afterEach(() => {
    cache.clear();
  });

  /**
   * Property 6: Cache Key Generation Consistency
   * 
   * Validates that cache keys are deterministic and unique
   * Format: contractType:language
   * 
   * **Validates: Requirement 3.1**
   */
  describe('Property 6: Cache Key Generation Consistency', () => {
    it(
      'Should generate consistent cache keys for the same contract type and language',
      () => {
        fc.assert(
          fc.property(contractTypeArb, languageArb, (contractType, language) => {
            // Fresh cache for each property test iteration
            const testCache = new TemplateCache();
            const template = createMockTemplate(contractType, language);
            
            // Store the template
            testCache.set(contractType, language, template);
            
            // Retrieve it multiple times
            const retrieved1 = testCache.get(contractType, language);
            const retrieved2 = testCache.get(contractType, language);
            const retrieved3 = testCache.get(contractType, language);
            
            // All retrievals should return the same template
            expect(retrieved1).toEqual(template);
            expect(retrieved2).toEqual(template);
            expect(retrieved3).toEqual(template);
            
            // The retrievals should be identical objects (same reference)
            expect(retrieved1).toBe(template);
            expect(retrieved2).toBe(template);
            expect(retrieved3).toBe(template);
            
            testCache.clear();
          }),
          { numRuns: 100 }
        );
      }
    );

    it(
      'Should generate unique keys for different contract type and language combinations',
      () => {
        fc.assert(
          fc.property(
            fc.tuple(contractTypeArb, languageArb, contractTypeArb, languageArb).filter(
              ([type1, lang1, type2, lang2]) => type1 !== type2 || lang1 !== lang2
            ),
            ([type1, lang1, type2, lang2]) => {
              const testCache = new TemplateCache();
              const template1 = createMockTemplate(type1, lang1);
              const template2 = createMockTemplate(type2, lang2);
              
              testCache.set(type1, lang1, template1);
              testCache.set(type2, lang2, template2);
              
              // Retrievals should return different templates
              const retrieved1 = testCache.get(type1, lang1);
              const retrieved2 = testCache.get(type2, lang2);
              
              expect(retrieved1).toEqual(template1);
              expect(retrieved2).toEqual(template2);
              expect(retrieved1).not.toBe(retrieved2);
              
              testCache.clear();
            }
          ),
          { numRuns: 100 }
        );
      }
    );

    it(
      'Should generate key format as contractType:language',
      () => {
        fc.assert(
          fc.property(contractTypeArb, languageArb, (contractType, language) => {
            const testCache = new TemplateCache();
            const template = createMockTemplate(contractType, language);
            
            testCache.set(contractType, language, template);
            
            // Get stats to verify key format
            const stats = testCache.getStats();
            const entries = stats.entries;
            
            // Should have exactly one entry
            expect(entries).toHaveLength(1);
            
            // Key should match format
            const expectedKeyPattern = new RegExp(`^${contractType}:${language}$`);
            expect(entries[0].key).toMatch(expectedKeyPattern);
            
            testCache.clear();
          }),
          { numRuns: 100 }
        );
      }
    );
  });

  /**
   * Property 7: Cache Expiration Correctness
   * 
   * Validates that entries expire after 10 minutes (600 seconds)
   * 
   * **Validates: Requirement 3.2**
   */
  describe('Property 7: Cache Expiration Correctness', () => {
    it(
      'Should expire cached entries after TTL (10 minutes)',
      () => {
        fc.assert(
          fc.property(contractTypeArb, languageArb, (contractType, language) => {
            const testCache = new TemplateCache();
            const template = createMockTemplate(contractType, language);
            const TTL_MS = TemplateCache.getTTL();
            
            // Use fake timers
            vi.useFakeTimers();
            const startTime = new Date('2024-01-01');
            vi.setSystemTime(startTime);
            
            try {
              // Store template
              testCache.set(contractType, language, template);
              
              // Should be retrievable immediately
              const retrieved1 = testCache.get(contractType, language);
              expect(retrieved1).toEqual(template);
              
              // Advance time by just under TTL
              vi.advanceTimersByTime(TTL_MS - 1000);
              const retrieved2 = testCache.get(contractType, language);
              expect(retrieved2).toEqual(template);
              
              // Advance time past TTL
              vi.advanceTimersByTime(2000);
              const retrieved3 = testCache.get(contractType, language);
              expect(retrieved3).toBeNull();
              
              testCache.clear();
            } finally {
              vi.useRealTimers();
            }
          }),
          { numRuns: 50 }
        );
      }
    );

    it(
      'Should track expiration time in cache stats',
      () => {
        fc.assert(
          fc.property(contractTypeArb, languageArb, (contractType, language) => {
            const testCache = new TemplateCache();
            const template = createMockTemplate(contractType, language);
            const TTL_MS = TemplateCache.getTTL();
            
            testCache.set(contractType, language, template);
            
            const stats = testCache.getStats();
            expect(stats.entries).toHaveLength(1);
            
            const entry = stats.entries[0];
            const expirationDelta = entry.expiresAt.getTime() - entry.cachedAt.getTime();
            
            // Expiration time should be exactly TTL_MS
            expect(expirationDelta).toBeGreaterThanOrEqual(TTL_MS - 100);
            expect(expirationDelta).toBeLessThanOrEqual(TTL_MS + 100);
            
            testCache.clear();
          }),
          { numRuns: 100 }
        );
      }
    );

    it(
      'Should indicate expiration status correctly in stats',
      () => {
        fc.assert(
          fc.property(contractTypeArb, languageArb, (contractType, language) => {
            const testCache = new TemplateCache();
            const template = createMockTemplate(contractType, language);
            
            testCache.set(contractType, language, template);
            
            const stats = testCache.getStats();
            expect(stats.entries).toHaveLength(1);
            
            // Should not be expired immediately after caching
            const entry = stats.entries[0];
            expect(entry.isExpired).toBe(false);
            
            testCache.clear();
          }),
          { numRuns: 100 }
        );
      }
    );

    it(
      'Should expire entries independently of each other',
      () => {
        fc.assert(
          fc.property(
            fc.tuple(contractTypeArb, languageArb, contractTypeArb, languageArb).filter(
              ([type1, lang1, type2, lang2]) => type1 !== type2 || lang1 !== lang2
            ),
            ([type1, lang1, type2, lang2]) => {
              const testCache = new TemplateCache();
              const template1 = createMockTemplate(type1, lang1);
              const template2 = createMockTemplate(type2, lang2);
              
              // Store first template
              testCache.set(type1, lang1, template1);
              
              // Wait and then store second template (simulated by different timestamps)
              testCache.set(type2, lang2, template2);
              
              // Both should be retrievable
              const retrieved1 = testCache.get(type1, lang1);
              const retrieved2 = testCache.get(type2, lang2);
              
              expect(retrieved1).toEqual(template1);
              expect(retrieved2).toEqual(template2);
              
              testCache.clear();
            }
          ),
          { numRuns: 50 }
        );
      }
    );
  });

  /**
   * Property 8: Complete Template Storage in Cache
   * 
   * Validates that all template fields are preserved when stored and retrieved
   * 
   * **Validates: Requirement 3.6**
   */
  describe('Property 8: Complete Template Storage in Cache', () => {
    it(
      'Should preserve all template fields when storing and retrieving',
      () => {
        fc.assert(
          fc.property(contractTypeArb, languageArb, (contractType, language) => {
            const testCache = new TemplateCache();
            const template = createMockTemplate(contractType, language);
            
            testCache.set(contractType, language, template);
            const retrieved = testCache.get(contractType, language);
            
            // All fields should be preserved
            expect(retrieved).toEqual(template);
            expect(retrieved?.id).toBe(template.id);
            expect(retrieved?.contract_type).toBe(template.contract_type);
            expect(retrieved?.language).toBe(template.language);
            expect(retrieved?.version).toBe(template.version);
            expect(retrieved?.template_html).toBe(template.template_html);
            expect(retrieved?.template_css).toBe(template.template_css);
            expect(retrieved?.variables).toEqual(template.variables);
            expect(retrieved?.name).toBe(template.name);
            expect(retrieved?.is_active).toBe(template.is_active);
            expect(retrieved?.is_draft).toBe(template.is_draft);
            
            testCache.clear();
          }),
          { numRuns: 100 }
        );
      }
    );

    it(
      'Should preserve complex template objects with nested properties',
      () => {
        fc.assert(
          fc.property(contractTypeArb, languageArb, (contractType, language) => {
            const testCache = new TemplateCache();
            const template: ContractTemplate = {
              ...createMockTemplate(contractType, language),
              variables: [
                {
                  name: 'complex',
                  type: 'object',
                  description: 'Complex variable',
                  required: true,
                  defaultValue: { nested: 'value' },
                  validation: {
                    min: 1,
                    max: 100,
                    pattern: '^[a-z]+$',
                    enum: ['a', 'b', 'c'],
                  },
                },
              ],
            };
            
            testCache.set(contractType, language, template);
            const retrieved = testCache.get(contractType, language);
            
            expect(retrieved?.variables).toEqual(template.variables);
            expect(retrieved?.variables[0].validation).toEqual(template.variables[0].validation);
            expect(retrieved?.variables[0].defaultValue).toEqual(template.variables[0].defaultValue);
            
            testCache.clear();
          }),
          { numRuns: 100 }
        );
      }
    );

    it(
      'Should store complete template including HTML and CSS',
      () => {
        fc.assert(
          fc.property(
            contractTypeArb,
            languageArb,
            fc.stringMatching(/^<[^>]+>[\s\S]*<\/[^>]+>$/), // HTML-like string
            fc.stringMatching(/^\.[\w-]+\s*{\s*[\w-]+:\s*[^;]+;?\s*}$/), // CSS-like string
            (contractType, language, html, css) => {
              const testCache = new TemplateCache();
              const template: ContractTemplate = {
                ...createMockTemplate(contractType, language),
                template_html: html,
                template_css: css,
              };
              
              testCache.set(contractType, language, template);
              const retrieved = testCache.get(contractType, language);
              
              expect(retrieved?.template_html).toBe(html);
              expect(retrieved?.template_css).toBe(css);
              
              testCache.clear();
            }
          ),
          { numRuns: 100 }
        );
      }
    );

    it(
      'Should preserve template with null and optional fields',
      () => {
        fc.assert(
          fc.property(contractTypeArb, languageArb, (contractType, language) => {
            const testCache = new TemplateCache();
            const template: ContractTemplate = {
              ...createMockTemplate(contractType, language),
              template_css: null,
              description: null,
              created_by: null,
            };
            
            testCache.set(contractType, language, template);
            const retrieved = testCache.get(contractType, language);
            
            expect(retrieved?.template_css).toBeNull();
            expect(retrieved?.description).toBeNull();
            expect(retrieved?.created_by).toBeNull();
            
            testCache.clear();
          }),
          { numRuns: 100 }
        );
      }
    );
  });

  /**
   * Integration: Verify cache key format consistency across all operations
   */
  describe('Cache Key Format Validation', () => {
    it(
      'Should use consistent key format across get, set, and invalidate operations',
      () => {
        fc.assert(
          fc.property(contractTypeArb, languageArb, (contractType, language) => {
            const testCache = new TemplateCache();
            const template = createMockTemplate(contractType, language);
            
            // Set
            testCache.set(contractType, language, template);
            let stats = testCache.getStats();
            expect(stats.size).toBe(1);
            const setKey = stats.entries[0].key;
            
            // Get
            const retrieved = testCache.get(contractType, language);
            expect(retrieved).not.toBeNull();
            
            // Invalidate
            testCache.invalidate(contractType, language);
            stats = testCache.getStats();
            
            // After invalidate, should be gone
            const retrieved2 = testCache.get(contractType, language);
            expect(retrieved2).toBeNull();
            
            // Key should follow the format: contractType:language
            expect(setKey).toMatch(/^[\w-]+:[\w-]+$/);
            expect(setKey).toBe(`${contractType}:${language}`);
            
            testCache.clear();
          }),
          { numRuns: 100 }
        );
      }
    );
  });
});
