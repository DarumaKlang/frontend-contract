// lib/cache/templateCache.pbt.ts
// Property-based tests for Template Cache implementation

import { describe, it, expect, afterEach, vi } from 'vitest';
import fc from 'fast-check';
import { TemplateCache, resetCacheInstance } from './templateCache';
import type { ContractTemplate, ContractType, TemplateLanguage } from '@/lib/types/template';

// Arbitraries for generating test data
const contractTypeArb = fc.oneof(
  fc.constant('lease' as const),
  fc.constant('vehicle-sale' as const),
  fc.constant('property-sale' as const),
  fc.constant('employment' as const),
  fc.constant('testament' as const)
);

const languageArb = fc.oneof(
  fc.constant('th' as const),
  fc.constant('en' as const)
);

const templateVariableArb = fc.record({
  name: fc.stringMatching(/^[a-zA-Z_][a-zA-Z0-9_]*$/),
  type: fc.oneof(
    fc.constant('string' as const),
    fc.constant('number' as const),
    fc.constant('date' as const),
    fc.constant('boolean' as const)
  ),
  description: fc.string(),
  required: fc.boolean(),
});

const contractTemplateArb = fc.record({
  id: fc.string({ minLength: 1 }),
  contract_type: contractTypeArb,
  language: languageArb,
  version: fc.integer({ min: 1, max: 100 }),
  template_html: fc.string(),
  template_css: fc.oneof(fc.constant(null), fc.string()),
  variables: fc.array(templateVariableArb),
  name: fc.string(),
  description: fc.oneof(fc.constant(null), fc.string()),
  is_active: fc.boolean(),
  is_draft: fc.boolean(),
  created_by: fc.oneof(fc.constant(null), fc.string()),
  created_at: fc.string(),
  updated_at: fc.string(),
}) as fc.Arbitrary<ContractTemplate>;

describe('TemplateCache - Property-Based Tests', () => {
  afterEach(() => {
    resetCacheInstance();
    vi.useRealTimers();
  });

  /**
   * Property 6: Cache Key Generation Consistency
   * For any combination of contract type and language, the cache key generated
   * SHALL be deterministic and unique for that combination (format: `contractType:language`).
   * 
   * **Validates: Requirements 3.1**
   * **Feature: database-template-integration, Property 6: Cache Key Generation Consistency**
   */
  it('Property 6: Cache key generation is deterministic and unique', () => {
    fc.assert(
      fc.property(contractTypeArb, languageArb, (contractType, language) => {
        const cache = new TemplateCache();

        // Generate cache keys multiple times
        const template1 = {
          ...{
            id: 'test-1',
            version: 1,
            template_html: 'html1',
            template_css: null,
            variables: [],
            name: 'Test 1',
            description: null,
            is_active: true,
            is_draft: false,
            created_by: null,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
          contract_type: contractType,
          language: language,
        } as ContractTemplate;

        const template2 = {
          ...{
            id: 'test-2',
            version: 2,
            template_html: 'html2',
            template_css: null,
            variables: [],
            name: 'Test 2',
            description: null,
            is_active: true,
            is_draft: false,
            created_by: null,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
          contract_type: contractType,
          language: language,
        } as ContractTemplate;

        cache.set(contractType, language, template1);
        cache.set(contractType, language, template2);

        const stats = cache.getStats();
        const key = `${contractType}:${language}`;
        const entry = stats.entries[0];

        // Key format should be contractType:language
        expect(entry.key).toBe(key);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7: Cache Expiration Correctness
   * For any cached template entry, querying the cache after the TTL (10 minutes)
   * has elapsed SHALL return null, indicating the entry has expired.
   * 
   * **Validates: Requirements 3.2**
   * **Feature: database-template-integration, Property 7: Cache Expiration Correctness**
   */
  it('Property 7: Cache entries expire correctly after TTL', () => {
    fc.assert(
      fc.property(contractTypeArb, languageArb, contractTemplateArb, (contractType, language, template) => {
        vi.useFakeTimers();
        const cache = new TemplateCache();
        const now = Date.now();
        vi.setSystemTime(now);

        // Store template
        cache.set(contractType, language, template);
        expect(cache.get(contractType, language)).not.toBeNull();

        // Move time forward to just before expiration
        const TTL = TemplateCache.getTTL();
        vi.setSystemTime(now + TTL - 1);
        expect(cache.get(contractType, language)).not.toBeNull();

        // Move time forward past expiration
        vi.setSystemTime(now + TTL + 1);
        expect(cache.get(contractType, language)).toBeNull();

        vi.useRealTimers();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8: Complete Template Storage in Cache
   * For any template stored in the cache, retrieving it SHALL return the complete
   * template object with all fields intact (template_html, template_css, variables, metadata).
   * 
   * **Validates: Requirements 3.6**
   * **Feature: database-template-integration, Property 8: Complete Template Storage in Cache**
   */
  it('Property 8: Cached templates preserve all fields', () => {
    fc.assert(
      fc.property(contractTypeArb, languageArb, contractTemplateArb, (contractType, language, template) => {
        const cache = new TemplateCache();

        cache.set(contractType, language, template);
        const retrieved = cache.get(contractType, language);

        // All fields should be preserved exactly
        expect(retrieved).toEqual(template);
        expect(retrieved?.id).toBe(template.id);
        expect(retrieved?.contract_type).toBe(template.contract_type);
        expect(retrieved?.language).toBe(template.language);
        expect(retrieved?.version).toBe(template.version);
        expect(retrieved?.template_html).toBe(template.template_html);
        expect(retrieved?.template_css).toBe(template.template_css);
        expect(retrieved?.variables).toEqual(template.variables);
        expect(retrieved?.name).toBe(template.name);
        expect(retrieved?.description).toBe(template.description);
        expect(retrieved?.is_active).toBe(template.is_active);
        expect(retrieved?.is_draft).toBe(template.is_draft);
        expect(retrieved?.created_by).toBe(template.created_by);
        expect(retrieved?.created_at).toBe(template.created_at);
        expect(retrieved?.updated_at).toBe(template.updated_at);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Cache Key Uniqueness
   * For different combinations of contract type and language, cache keys SHALL be unique
   * and not collide with each other.
   * 
   * **Feature: database-template-integration, Property 26: Cache Key Uniqueness**
   */
  it('Property 26: Different contract type/language combinations produce unique keys', () => {
    const cache = new TemplateCache();
    const baseTemplate = {
      id: 'test',
      version: 1,
      template_html: 'html',
      template_css: null,
      variables: [],
      name: 'Test',
      description: null,
      is_active: true,
      is_draft: false,
      created_by: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    fc.assert(
      fc.property(
        fc.tuple(contractTypeArb, languageArb, contractTypeArb, languageArb),
        ([type1, lang1, type2, lang2]) => {
          cache.clear();
          cache.resetStats();

          const t1 = { ...baseTemplate, contract_type: type1, language: lang1 } as ContractTemplate;
          const t2 = { ...baseTemplate, contract_type: type2, language: lang2 } as ContractTemplate;

          cache.set(type1, lang1, t1);
          cache.set(type2, lang2, t2);

          const stats = cache.getStats();
          const keys = stats.entries.map((e) => e.key);

          // If contracts are the same, keys should be the same; otherwise different
          if (type1 === type2 && lang1 === lang2) {
            expect(keys).toHaveLength(1);
          } else {
            expect(new Set(keys).size).toBe(keys.length);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Invalidation Completeness
   * When invalidating a cache entry, it SHALL be completely removed and not retrievable
   * until re-added to the cache.
   * 
   * **Feature: database-template-integration, Property 27: Invalidation Completeness**
   */
  it('Property 27: Invalidation completely removes cache entries', () => {
    fc.assert(
      fc.property(contractTypeArb, languageArb, contractTemplateArb, (contractType, language, template) => {
        const cache = new TemplateCache();

        // Store template
        cache.set(contractType, language, template);
        expect(cache.get(contractType, language)).not.toBeNull();

        // Invalidate
        cache.invalidate(contractType, language);
        expect(cache.get(contractType, language)).toBeNull();

        // Stats should show size 0
        const stats = cache.getStats();
        expect(stats.size).toBe(0);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Clear Functionality
   * When clearing the cache, all entries SHALL be removed and statistics SHALL be reset.
   * 
   * **Feature: database-template-integration, Property 28: Clear Functionality**
   */
  it('Property 28: Clear removes all entries and resets statistics', () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(contractTypeArb, languageArb, contractTemplateArb)), (entries) => {
        if (entries.length === 0) return; // Skip empty array

        const cache = new TemplateCache();

        // Track unique contract type/language combinations
        const uniqueKeys = new Set<string>();

        // Add entries
        for (const [type, lang, template] of entries) {
          cache.set(type, lang, template);
          cache.get(type, lang); // Generate a hit
          uniqueKeys.add(`${type}:${lang}`);
        }

        const statsBefore = cache.getStats();
        // Size should equal number of unique contract type/language combinations
        expect(statsBefore.size).toBe(uniqueKeys.size);

        // Clear cache
        cache.clear();

        const statsAfter = cache.getStats();
        expect(statsAfter.size).toBe(0);
        expect(statsAfter.hits).toBe(0);
        expect(statsAfter.misses).toBe(0);
        expect(statsAfter.hitRate).toBe(0);
        expect(statsAfter.entries).toHaveLength(0);
      }),
      { numRuns: 50 }
    );
  });

  /**
   * Additional property: Hit Rate Calculation Correctness
   * The hit rate calculated from stats SHALL accurately reflect the ratio of cache hits
   * to total requests (hits + misses).
   * 
   * **Feature: database-template-integration, Property 29: Hit Rate Calculation**
   */
  it('Property 29: Hit rate calculation is mathematically correct', () => {
    fc.assert(
      fc.property(
        fc.tuple(fc.integer({ min: 0, max: 100 }), fc.integer({ min: 0, max: 100 })),
        ([hits, misses]) => {
          if (hits === 0 && misses === 0) {
            // Skip case with no requests
            const cache = new TemplateCache();
            expect(cache.getStats().hitRate).toBe(0);
            return;
          }

          const cache = new TemplateCache();
          const template = {
            id: 'test',
            contract_type: 'lease' as ContractType,
            language: 'th' as TemplateLanguage,
            version: 1,
            template_html: 'html',
            template_css: null,
            variables: [],
            name: 'Test',
            description: null,
            is_active: true,
            is_draft: false,
            created_by: null,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          };

          cache.set('lease', 'th', template);

          // Simulate hits
          for (let i = 0; i < hits; i++) {
            cache.get('lease', 'th');
          }

          // Simulate misses
          for (let i = 0; i < misses; i++) {
            cache.get('vehicle-sale' as ContractType, 'en' as TemplateLanguage);
          }

          const stats = cache.getStats();
          const expectedRate = (hits + misses) > 0 ? hits / (hits + misses) : 0;
          expect(stats.hitRate).toBeCloseTo(expectedRate, 10);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Cache Idempotence
   * Setting the same template multiple times with the same key SHALL result in
   * the same retrieved value, idempotently.
   * 
   * **Feature: database-template-integration, Property 30: Cache Idempotence**
   */
  it('Property 30: Setting the same template multiple times is idempotent', () => {
    fc.assert(
      fc.property(contractTypeArb, languageArb, contractTemplateArb, fc.integer({ min: 1, max: 10 }), (contractType, language, template, times) => {
        const cache = new TemplateCache();

        // Set the same template multiple times
        for (let i = 0; i < times; i++) {
          cache.set(contractType, language, template);
        }

        // Result should always be the same
        const retrieved1 = cache.get(contractType, language);
        const retrieved2 = cache.get(contractType, language);
        expect(retrieved1).toEqual(template);
        expect(retrieved2).toEqual(template);
        expect(retrieved1).toEqual(retrieved2);
      }),
      { numRuns: 50 }
    );
  });
});
