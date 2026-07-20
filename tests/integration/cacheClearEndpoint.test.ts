// tests/integration/cacheClearEndpoint.test.ts
// Integration tests for cache clear endpoint

import { describe, it, expect, beforeEach } from 'vitest';
import { getTemplateCache, resetCacheInstance } from '@/lib/cache/templateCache';
import type { ContractTemplate } from '@/lib/types/template';

describe('Cache Clear Endpoint Integration', () => {
  beforeEach(() => {
    resetCacheInstance();
  });

  it('should successfully clear populated cache via endpoint', async () => {
    // Setup: Populate cache
    const cache = getTemplateCache();
    const mockTemplate: ContractTemplate = {
      id: 'template-1',
      contract_type: 'lease',
      language: 'th',
      version: 1,
      template_html: '<p>Mock template</p>',
      template_css: null,
      variables: [],
      name: 'Mock Template',
      description: null,
      is_active: true,
      is_draft: false,
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add multiple templates to cache
    cache.set('lease', 'th', mockTemplate);
    cache.set('vehicle-sale', 'en', { ...mockTemplate, id: 'template-2', contract_type: 'vehicle-sale' });
    cache.set('property-sale', 'th', { ...mockTemplate, id: 'template-3', contract_type: 'property-sale' });

    // Verify cache is populated
    expect(cache.getStats().size).toBe(3);

    // Execute clear operation
    cache.clear();

    // Verify cache is empty
    expect(cache.getStats().size).toBe(0);
    expect(cache.get('lease', 'th')).toBeNull();
    expect(cache.get('vehicle-sale', 'en')).toBeNull();
    expect(cache.get('property-sale', 'th')).toBeNull();
  });

  it('should properly clear cache statistics', async () => {
    const cache = getTemplateCache();
    const mockTemplate: ContractTemplate = {
      id: 'template-1',
      contract_type: 'employment',
      language: 'en',
      version: 1,
      template_html: '<p>Template</p>',
      template_css: null,
      variables: [],
      name: 'Template',
      description: null,
      is_active: true,
      is_draft: false,
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Generate hits and misses
    cache.set('employment', 'en', mockTemplate);
    cache.get('employment', 'en'); // hit
    cache.get('employment', 'en'); // hit
    cache.get('testament', 'th'); // miss

    const statsBefore = cache.getStats();
    expect(statsBefore.hits).toBe(2);
    expect(statsBefore.misses).toBe(1);

    // Clear cache
    cache.clear();

    // Verify stats are reset
    const statsAfter = cache.getStats();
    expect(statsAfter.hits).toBe(0);
    expect(statsAfter.misses).toBe(0);
    expect(statsAfter.size).toBe(0);
    expect(statsAfter.hitRate).toBe(0);
  });

  it('should handle clearing empty cache without errors', async () => {
    const cache = getTemplateCache();

    // Verify cache is empty
    expect(cache.getStats().size).toBe(0);

    // Clear should not throw
    expect(() => cache.clear()).not.toThrow();

    // Cache should still be empty
    expect(cache.getStats().size).toBe(0);
  });

  it('should clear all contract types and languages', async () => {
    const cache = getTemplateCache();
    const contractTypes: Array<'lease' | 'vehicle-sale' | 'property-sale' | 'employment' | 'testament'> = [
      'lease',
      'vehicle-sale',
      'property-sale',
      'employment',
      'testament',
    ];
    const languages: Array<'th' | 'en'> = ['th', 'en'];

    // Add templates for all combinations
    let count = 0;
    for (const type of contractTypes) {
      for (const lang of languages) {
        const template: ContractTemplate = {
          id: `template-${count}`,
          contract_type: type,
          language: lang,
          version: 1,
          template_html: '<p>Template</p>',
          template_css: null,
          variables: [],
          name: `${type}-${lang}`,
          description: null,
          is_active: true,
          is_draft: false,
          created_by: 'user-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        cache.set(type, lang, template);
        count++;
      }
    }

    // Verify cache has 10 entries (5 types × 2 languages)
    expect(cache.getStats().size).toBe(10);

    // Clear cache
    cache.clear();

    // Verify all cleared
    expect(cache.getStats().size).toBe(0);
    for (const type of contractTypes) {
      for (const lang of languages) {
        expect(cache.get(type, lang)).toBeNull();
      }
    }
  });

  it('should be able to re-populate cache after clear', async () => {
    const cache = getTemplateCache();
    const mockTemplate: ContractTemplate = {
      id: 'template-1',
      contract_type: 'lease',
      language: 'th',
      version: 1,
      template_html: '<p>Template</p>',
      template_css: null,
      variables: [],
      name: 'Template',
      description: null,
      is_active: true,
      is_draft: false,
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Populate, clear, re-populate
    cache.set('lease', 'th', mockTemplate);
    expect(cache.getStats().size).toBe(1);

    cache.clear();
    expect(cache.getStats().size).toBe(0);

    cache.set('lease', 'th', mockTemplate);
    expect(cache.getStats().size).toBe(1);

    const retrieved = cache.get('lease', 'th');
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe('template-1');
  });
});
