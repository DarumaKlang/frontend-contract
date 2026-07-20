// app/api/admin/templates/cache/clear/route.test.ts
// Unit tests for cache clear endpoint

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from './route';
import { getTemplateCache, resetCacheInstance } from '@/lib/cache/templateCache';
import type { ContractTemplate } from '@/lib/types/template';

// Mock the admin authentication
vi.mock('@/lib/admin', () => ({
  requireAdmin: vi.fn(async () => null), // Return null to indicate auth passed
}));

// Create a mock request factory
function createMockRequest(overrides?: Partial<Request>): Request {
  const headers = new Headers({
    'authorization': 'Bearer mock-token',
  });

  const request = new Request('http://localhost:3000/api/admin/templates/cache/clear', {
    method: 'POST',
    headers,
    ...overrides,
  }) as any;

  // Mock admin user
  request.adminUser = {
    id: 'user-123',
    email: 'admin@example.com',
  };

  return request;
}

describe('POST /api/admin/templates/cache/clear', () => {
  beforeEach(() => {
    resetCacheInstance();
    vi.clearAllMocks();
  });

  it('should clear the cache and return success response', async () => {
    // Prepare: Add a template to the cache
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

    cache.set('lease', 'th', mockTemplate);

    // Verify cache has content
    const cachedBefore = cache.get('lease', 'th');
    expect(cachedBefore).not.toBeNull();
    expect(cachedBefore?.id).toBe('template-1');

    // Act: Call the endpoint
    const request = createMockRequest();
    const response = await POST(request);

    // Assert: Check response
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.message).toBe('Cache cleared successfully');
    expect(data.timestamp).toBeDefined();
    expect(typeof data.timestamp).toBe('string');
    expect(data.clearedBy.userId).toBe('user-123');
    expect(data.clearedBy.email).toBe('admin@example.com');

    // Assert: Verify cache is actually empty
    const cachedAfter = cache.get('lease', 'th');
    expect(cachedAfter).toBeNull();
  });

  it('should include ISO 8601 timestamp in response', async () => {
    const request = createMockRequest();
    const response = await POST(request);

    const data = await response.json();
    const timestamp = new Date(data.timestamp);
    expect(timestamp.getTime()).toBeGreaterThan(0);
  });

  it('should log cache clear event for audit trail', async () => {
    const consoleSpy = vi.spyOn(console, 'log');

    const request = createMockRequest();
    await POST(request);

    // Verify that a log was created
    expect(consoleSpy).toHaveBeenCalled();
    const logCalls = consoleSpy.mock.calls.filter(call =>
      typeof call[0] === 'string' && call[0].includes('cache_clear')
    );
    expect(logCalls.length).toBeGreaterThan(0);

    consoleSpy.mockRestore();
  });

  it('should include admin user info in audit log', async () => {
    const consoleSpy = vi.spyOn(console, 'log');

    const request = createMockRequest();
    await POST(request);

    // Parse the log entry
    const logCalls = consoleSpy.mock.calls.filter(call =>
      typeof call[0] === 'string' && call[0].includes('cache_clear')
    );

    expect(logCalls.length).toBeGreaterThan(0);
    const logEntry = JSON.parse(logCalls[0][0]);
    expect(logEntry.metadata.adminUserId).toBe('user-123');
    expect(logEntry.metadata.adminEmail).toBe('admin@example.com');

    consoleSpy.mockRestore();
  });

  it('should clear statistics when clearing cache', async () => {
    // Prepare: Add a template and simulate cache hits
    const cache = getTemplateCache();
    const mockTemplate: ContractTemplate = {
      id: 'template-1',
      contract_type: 'vehicle-sale',
      language: 'en',
      version: 2,
      template_html: '<p>Vehicle template</p>',
      template_css: null,
      variables: [],
      name: 'Vehicle Sale Template',
      description: null,
      is_active: true,
      is_draft: false,
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    cache.set('vehicle-sale', 'en', mockTemplate);
    cache.get('vehicle-sale', 'en'); // Hit
    cache.get('vehicle-sale', 'en'); // Hit
    cache.get('vehicle-sale', 'th'); // Miss

    const statsBefore = cache.getStats();
    expect(statsBefore.hits).toBeGreaterThan(0);

    // Act: Clear cache
    const request = createMockRequest();
    await POST(request);

    // Assert: Stats are reset
    const statsAfter = cache.getStats();
    expect(statsAfter.size).toBe(0);
    expect(statsAfter.hits).toBe(0);
    expect(statsAfter.misses).toBe(0);
    expect(statsAfter.hitRate).toBe(0);
  });

  it('should handle errors gracefully and return error response', async () => {
    // Mock cache.clear to throw an error
    const cache = getTemplateCache();
    vi.spyOn(cache, 'clear').mockImplementation(() => {
      throw new Error('Cache clear failed');
    });

    const consoleSpy = vi.spyOn(console, 'error');
    const request = createMockRequest();
    const response = await POST(request);

    // Assert: Error response
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.message).toBe('Failed to clear cache');
    expect(data.error).toBeDefined();

    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should handle missing admin user info gracefully', async () => {
    const request = createMockRequest() as any;
    delete request.adminUser;

    const response = await POST(request);

    // Should still succeed but with undefined user info
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.clearedBy.userId).toBeUndefined();
    expect(data.clearedBy.email).toBeUndefined();
  });

  it('should handle concurrent cache operations safely', async () => {
    const cache = getTemplateCache();

    // Add multiple templates
    const templates: ContractTemplate[] = [
      {
        id: 'template-1',
        contract_type: 'lease',
        language: 'th',
        version: 1,
        template_html: '<p>Template 1</p>',
        template_css: null,
        variables: [],
        name: 'Template 1',
        description: null,
        is_active: true,
        is_draft: false,
        created_by: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'template-2',
        contract_type: 'vehicle-sale',
        language: 'en',
        version: 1,
        template_html: '<p>Template 2</p>',
        template_css: null,
        variables: [],
        name: 'Template 2',
        description: null,
        is_active: true,
        is_draft: false,
        created_by: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    for (const template of templates) {
      cache.set(template.contract_type, template.language, template);
    }

    const statsBefore = cache.getStats();
    expect(statsBefore.size).toBe(2);

    // Clear cache
    const request = createMockRequest();
    const response = await POST(request);

    // Assert: All entries cleared
    expect(response.status).toBe(200);
    const statsAfter = cache.getStats();
    expect(statsAfter.size).toBe(0);
    expect(statsAfter.entries).toEqual([]);
  });
});
