// lib/services/templateService.test.ts
// Integration tests for Template Service enhancements
// Feature: database-template-integration

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getTemplateCache, resetCacheInstance } from '@/lib/cache/templateCache';
import {
  getActiveTemplateWithCache,
  updateTemplate,
  publishTemplate,
  getTemplateById,
  createTemplate,
  getMaxVersion,
} from './templateService';
import type {
  ContractTemplate,
  CreateTemplateRequest,
  UpdateTemplateRequest,
} from '@/lib/types/template';

// Import mocked modules
let getSupabaseClient: any;
let validateTemplate: any;

/**
 * Helper to create a mock query builder chain
 */
function createMockQueryBuilder(returnData?: any, returnError?: any) {
  return {
    select: vi.fn(function(this: any) { return this; }),
    eq: vi.fn(function(this: any) { return this; }),
    order: vi.fn(function(this: any) { return this; }),
    limit: vi.fn(function(this: any) { return this; }),
    maybeSingle: vi.fn().mockResolvedValue({ data: returnData || null, error: returnError || null }),
    update: vi.fn(function(this: any) { return this; }),
    single: vi.fn().mockResolvedValue({ data: returnData || null, error: returnError || null }),
  };
}

/**
 * Mock Supabase client for testing
 */
let mockSupabaseClient: any = {
  from: vi.fn(),
};

// Mock getSupabaseClient
vi.mock('@/lib/supabase', () => ({
  getSupabaseClient: vi.fn(() => mockSupabaseClient),
}));

// Mock template engine validation
vi.mock('@/lib/templateEngine', () => ({
  renderTemplate: vi.fn(() => '<html>rendered</html>'),
  validateTemplate: vi.fn((html: string) => ({
    valid: true,
    errors: [],
  })),
  renderTemplateWithCSS: vi.fn(() => '<html>rendered</html>'),
}));

// Get mocked functions after mocks are defined
import { getSupabaseClient as getSupabaseMocked } from '@/lib/supabase';
import { validateTemplate as validateTemplateMocked } from '@/lib/templateEngine';

getSupabaseClient = getSupabaseMocked;
validateTemplate = validateTemplateMocked;

/**
 * Helper function to create mock template
 */
function createMockTemplate(overrides?: Partial<ContractTemplate>): ContractTemplate {
  return {
    id: 'template-1',
    contract_type: 'lease',
    language: 'th',
    version: 1,
    template_html: '<h1>{{lessorName}}</h1>',
    template_css: null,
    variables: [
      { name: 'lessorName', type: 'string', description: 'Lessor name', required: true },
    ],
    name: 'Lease Contract TH',
    description: 'Test lease contract in Thai',
    is_active: false,
    is_draft: true,
    created_by: 'user-1',
    created_at: '2024-01-15T10:00:00.000Z',
    updated_at: '2024-01-15T10:00:00.000Z',
    ...overrides,
  };
}

/**
 * Integration Tests for Task 3.5: Template Service Cache Integration
 * 
 * Validates: Requirements 2.1, 2.2, 2.3, 3.3, 3.5
 */
describe('Task 3.5: Template Service Cache Integration', () => {
  beforeEach(() => {
    // Reset cache before each test
    resetCacheInstance();
    vi.clearAllMocks();
    // Reset mock to default state
    mockSupabaseClient.from = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Test 1: Cache hit scenario
   * When a template exists in cache and is not expired,
   * getActiveTemplateWithCache should return it without querying database
   */
  describe('Cache Hit Scenario', () => {
    it('should return cached template on cache hit without database query', async () => {
      // Arrange
      const mockTemplate = createMockTemplate({ is_active: true });
      const cache = getTemplateCache();
      cache.set('lease', 'th', mockTemplate);

      // Mock database query to ensure it's not called
      const mockQueryBuilder = {
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      };
      mockSupabaseClient.from.mockReturnValue(mockQueryBuilder);

      // Act
      const result = await getActiveTemplateWithCache('lease', 'th');

      // Assert
      expect(result.data).toEqual(mockTemplate);
      expect(result.error).toBeNull();
      expect(result.fromCache).toBe(true);
      expect(mockQueryBuilder.eq).not.toHaveBeenCalled();
    });

    it('should return correct template for different contract types from cache', async () => {
      // Arrange
      const leaseTemplate = createMockTemplate({
        contract_type: 'lease',
        id: 'lease-1',
        is_active: true,
      });
      const vehicleTemplate = createMockTemplate({
        contract_type: 'vehicle-sale',
        id: 'vehicle-1',
        is_active: true,
      });

      const cache = getTemplateCache();
      cache.set('lease', 'th', leaseTemplate);
      cache.set('vehicle-sale', 'th', vehicleTemplate);

      mockSupabaseClient.from.mockReturnValue({
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      // Act
      const leaseResult = await getActiveTemplateWithCache('lease', 'th');
      const vehicleResult = await getActiveTemplateWithCache('vehicle-sale', 'th');

      // Assert
      expect(leaseResult.data?.id).toBe('lease-1');
      expect(vehicleResult.data?.id).toBe('vehicle-1');
      expect(leaseResult.fromCache).toBe(true);
      expect(vehicleResult.fromCache).toBe(true);
    });

    it('should return correct template for different languages from cache', async () => {
      // Arrange
      const thTemplate = createMockTemplate({
        language: 'th',
        id: 'template-th',
        is_active: true,
      });
      const enTemplate = createMockTemplate({
        language: 'en',
        id: 'template-en',
        is_active: true,
      });

      const cache = getTemplateCache();
      cache.set('lease', 'th', thTemplate);
      cache.set('lease', 'en', enTemplate);

      mockSupabaseClient.from.mockReturnValue({
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      // Act
      const thResult = await getActiveTemplateWithCache('lease', 'th');
      const enResult = await getActiveTemplateWithCache('lease', 'en');

      // Assert
      expect(thResult.data?.id).toBe('template-th');
      expect(enResult.data?.id).toBe('template-en');
    });

    it('should log cache hit event with correct metadata', async () => {
      // Arrange
      const mockTemplate = createMockTemplate({ is_active: true });
      const cache = getTemplateCache();
      cache.set('lease', 'th', mockTemplate);

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation();

      mockSupabaseClient.from.mockReturnValue({
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      // Act
      await getActiveTemplateWithCache('lease', 'th');

      // Assert
      expect(consoleSpy).toHaveBeenCalled();
      const logCalls = consoleSpy.mock.calls.filter(
        (call) => call[0] && typeof call[0] === 'string' && call[0].includes('cache-operation')
      );
      expect(logCalls.length).toBeGreaterThan(0);

      // Verify log contains required structured metadata
      const logEntry = JSON.parse(logCalls[0][0] as string);
      expect(logEntry).toHaveProperty('timestamp');
      expect(logEntry).toHaveProperty('machineId');
      expect(logEntry.category).toBe('cache-operation');
      expect(logEntry.metadata.contractType).toBe('lease');
      expect(logEntry.metadata.language).toBe('th');

      consoleSpy.mockRestore();
    });
  });

  /**
   * Test 2: Cache miss scenario
   * When template is not in cache or is expired,
   * getActiveTemplateWithCache should query database and populate cache
   */
  describe('Cache Miss Scenario', () => {
    it('should query database on cache miss and populate cache', async () => {
      // Arrange
      const mockTemplate = createMockTemplate({ is_active: true });
      const cache = getTemplateCache();

      const mockQueryBuilder = createMockQueryBuilder(mockTemplate);
      mockSupabaseClient.from.mockReturnValue(mockQueryBuilder);

      // Act
      const result = await getActiveTemplateWithCache('lease', 'th');

      // Assert
      expect(result.data).toEqual(mockTemplate);
      expect(result.error).toBeNull();
      expect(result.fromCache).toBe(false);

      // Verify cache was populated
      const cachedTemplate = cache.get('lease', 'th');
      expect(cachedTemplate).toEqual(mockTemplate);
    });

    it('should return null when no template exists in database', async () => {
      // Arrange
      const mockQueryBuilder = createMockQueryBuilder(null);
      mockSupabaseClient.from.mockReturnValue(mockQueryBuilder);

      // Act
      const result = await getActiveTemplateWithCache('lease', 'th');

      // Assert
      expect(result.data).toBeNull();
      expect(result.error).toBeNull();
      expect(result.fromCache).toBe(false);
    });

    it('should handle database query errors gracefully', async () => {
      // Arrange
      const dbError = { message: 'Database connection failed' };
      const mockQueryBuilder = createMockQueryBuilder(null, dbError);
      mockSupabaseClient.from.mockReturnValue(mockQueryBuilder);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation();

      // Act
      const result = await getActiveTemplateWithCache('lease', 'th');

      // Assert
      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.fromCache).toBe(false);

      // Verify error was logged
      expect(consoleSpy).toHaveBeenCalled();
      const errorCall = consoleSpy.mock.calls.find(
        (call) => call[0] && typeof call[0] === 'string' && call[0].includes('template-retrieval')
      );
      expect(errorCall).toBeDefined();

      consoleSpy.mockRestore();
    });

    it('should log cache miss event with correct metadata', async () => {
      // Arrange
      const mockTemplate = createMockTemplate({ is_active: true });
      const mockQueryBuilder = createMockQueryBuilder(mockTemplate);
      mockSupabaseClient.from.mockReturnValue(mockQueryBuilder);

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation();

      // Act
      await getActiveTemplateWithCache('lease', 'th');

      // Assert
      expect(consoleSpy).toHaveBeenCalled();
      const logCalls = consoleSpy.mock.calls.filter(
        (call) => call[0] && typeof call[0] === 'string' && call[0].includes('cache-operation')
      );

      // Should have miss log and then set log
      expect(logCalls.length).toBeGreaterThanOrEqual(2);

      // Check miss log
      const missLog = JSON.parse(logCalls[0][0] as string);
      expect(missLog.message).toContain('Cache miss');
      expect(missLog.metadata.contractType).toBe('lease');

      // Check set log
      const setLog = JSON.parse(logCalls[1][0] as string);
      expect(setLog.message).toContain('Template cached');

      consoleSpy.mockRestore();
    });
  });;

  /**
   * Test 3: Cache invalidation on publishTemplate
   * When a template is published, cache should be invalidated
   * for that contract type and language
   */
  describe('Cache Invalidation on Publish', () => {
    it('should invalidate cache after publishing template', async () => {
      // Arrange
      const mockTemplate = createMockTemplate({
        id: 'template-1',
        is_active: false,
        is_draft: true,
      });
      const publishedTemplate = { ...mockTemplate, is_active: true, is_draft: false };

      // Pre-populate cache
      const cache = getTemplateCache();
      cache.set('lease', 'th', mockTemplate);

      // Set up complex mock for publish operation
      const mockQueryBuilder = {
        select: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        order: vi.fn(function(this: any) { return this; }),
        limit: vi.fn(function(this: any) { return this; }),
        maybeSingle: vi.fn().mockResolvedValueOnce({ data: mockTemplate, error: null }),
        update: vi.fn(function(this: any) { return this; }),
        single: vi.fn().mockResolvedValue({ data: publishedTemplate, error: null }),
      };
      mockSupabaseClient.from.mockReturnValue(mockQueryBuilder);

      const consoleSpy = vi.spyOn(console, 'info').mockImplementation();

      // Act
      await publishTemplate('template-1');

      // Assert - cache should be invalidated
      const cachedTemplate = cache.get('lease', 'th');
      expect(cachedTemplate).toBeNull();

      consoleSpy.mockRestore();
    });

    it('should log cache invalidation with structured metadata', async () => {
      // Arrange
      const mockTemplate = createMockTemplate({
        contract_type: 'vehicle-sale',
        language: 'en',
        id: 'vehicle-en-1',
        is_active: false,
      });
      const publishedTemplate = { ...mockTemplate, is_active: true, is_draft: false };

      const mockQueryBuilder = {
        select: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        order: vi.fn(function(this: any) { return this; }),
        limit: vi.fn(function(this: any) { return this; }),
        maybeSingle: vi.fn().mockResolvedValueOnce({ data: mockTemplate, error: null }),
        update: vi.fn(function(this: any) { return this; }),
        single: vi.fn().mockResolvedValue({ data: publishedTemplate, error: null }),
      };
      mockSupabaseClient.from.mockReturnValue(mockQueryBuilder);

      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation();
      const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation();

      // Act
      await publishTemplate('vehicle-en-1');

      // Assert - check both log and info
      const allLogCalls = [...consoleLogSpy.mock.calls, ...consoleInfoSpy.mock.calls];
      const logCalls = allLogCalls.filter(
        (call) =>
          call[0] &&
          typeof call[0] === 'string' &&
          call[0].includes('invalidated') &&
          call[0].includes('publish')
      );

      expect(logCalls.length).toBeGreaterThan(0);

      const invalidationLog = JSON.parse(logCalls[0][0] as string);
      expect(invalidationLog).toHaveProperty('timestamp');
      expect(invalidationLog).toHaveProperty('machineId');
      expect(invalidationLog.category).toBe('cache-operation');
      expect(invalidationLog.metadata.contractType).toBe('vehicle-sale');
      expect(invalidationLog.metadata.language).toBe('en');
      expect(invalidationLog.metadata.templateId).toBe('vehicle-en-1');

      consoleLogSpy.mockRestore();
      consoleInfoSpy.mockRestore();
    });

    it('should affect multiple language variants independently', async () => {
      // Arrange
      const thTemplate = createMockTemplate({
        language: 'th',
        id: 'lease-th',
        is_active: false,
      });
      const enTemplate = createMockTemplate({
        language: 'en',
        id: 'lease-en',
        is_active: false,
      });
      const publishedTemplate = { ...thTemplate, is_active: true, is_draft: false };

      const cache = getTemplateCache();
      cache.set('lease', 'th', thTemplate);
      cache.set('lease', 'en', enTemplate);

      const mockQueryBuilder = {
        select: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        order: vi.fn(function(this: any) { return this; }),
        limit: vi.fn(function(this: any) { return this; }),
        maybeSingle: vi.fn().mockResolvedValueOnce({ data: thTemplate, error: null }),
        update: vi.fn(function(this: any) { return this; }),
        single: vi.fn().mockResolvedValue({ data: publishedTemplate, error: null }),
      };
      mockSupabaseClient.from.mockReturnValue(mockQueryBuilder);

      vi.spyOn(console, 'info').mockImplementation();

      // Act - publish Thai version
      await publishTemplate('lease-th');

      // Assert
      expect(cache.get('lease', 'th')).toBeNull(); // Thai cache invalidated
      expect(cache.get('lease', 'en')).toEqual(enTemplate); // English cache not affected
    });
  });;

  /**
   * Test 4: Cache invalidation on updateTemplate
   * When a template is updated, cache should be invalidated
   * for that contract type and language
   */
  describe('Cache Invalidation on Update', () => {
    it('should invalidate cache after updating template', async () => {
      // Arrange
      const mockTemplate = createMockTemplate({ id: 'template-1' });
      const updatedTemplate = {
        ...mockTemplate,
        name: 'Updated Name',
        template_html: '<h2>Updated</h2>',
      };

      // Pre-populate cache
      const cache = getTemplateCache();
      cache.set('lease', 'th', mockTemplate);

      const mockQueryBuilder = {
        select: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        single: vi.fn().mockResolvedValueOnce({ data: mockTemplate, error: null }),
        update: vi.fn(function(this: any) { return this; }),
      };
      mockQueryBuilder.select.mockReturnValueOnce(mockQueryBuilder);
      mockSupabaseClient.from.mockReturnValueOnce(mockQueryBuilder);

      // Second call to from() for update
      const updateQueryBuilder = {
        update: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        select: vi.fn(function(this: any) { return this; }),
        single: vi.fn().mockResolvedValue({ data: updatedTemplate, error: null }),
      };
      mockSupabaseClient.from.mockReturnValueOnce(updateQueryBuilder);

      const consoleSpy = vi.spyOn(console, 'info').mockImplementation();

      // Act
      const updateRequest: UpdateTemplateRequest = {
        name: 'Updated Name',
        template_html: '<h2>Updated</h2>',
      };
      await updateTemplate('template-1', updateRequest);

      // Assert - cache should be invalidated
      const cachedTemplate = cache.get('lease', 'th');
      expect(cachedTemplate).toBeNull();

      consoleSpy.mockRestore();
    });

    it('should log update cache invalidation with structured metadata', async () => {
      // Arrange
      const mockTemplate = createMockTemplate({
        contract_type: 'property-sale',
        language: 'th',
        id: 'property-th-1',
      });

      const mockQueryBuilder = {
        select: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        single: vi.fn().mockResolvedValueOnce({ data: mockTemplate, error: null }),
        update: vi.fn(function(this: any) { return this; }),
      };
      mockSupabaseClient.from.mockReturnValueOnce(mockQueryBuilder);

      // Second call for update
      const updateQueryBuilder = {
        update: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        select: vi.fn(function(this: any) { return this; }),
        single: vi.fn().mockResolvedValue({ data: mockTemplate, error: null }),
      };
      mockSupabaseClient.from.mockReturnValueOnce(updateQueryBuilder);

      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation();
      const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation();

      // Act
      const updateRequest: UpdateTemplateRequest = {
        name: 'Updated Template',
      };
      await updateTemplate('property-th-1', updateRequest);

      // Assert - check both log and info
      const allLogCalls = [...consoleLogSpy.mock.calls, ...consoleInfoSpy.mock.calls];
      const logCalls = allLogCalls.filter(
        (call) =>
          call[0] &&
          typeof call[0] === 'string' &&
          call[0].includes('invalidated') &&
          call[0].includes('update')
      );

      expect(logCalls.length).toBeGreaterThan(0);

      const invalidationLog = JSON.parse(logCalls[0][0] as string);
      expect(invalidationLog).toHaveProperty('timestamp');
      expect(invalidationLog).toHaveProperty('machineId');
      expect(invalidationLog.category).toBe('cache-operation');
      expect(invalidationLog.metadata.contractType).toBe('property-sale');
      expect(invalidationLog.metadata.language).toBe('th');
      expect(invalidationLog.metadata.templateId).toBe('property-th-1');

      consoleLogSpy.mockRestore();
      consoleInfoSpy.mockRestore();
    });
  });;

  /**
   * Test 5: Structured error logging
   * All error logs should include timestamp, machineId, category, and metadata
   */
  describe('Structured Error Logging', () => {
    it('should log retrieval errors with complete structured metadata', async () => {
      // Arrange
      const mockQueryBuilder = createMockQueryBuilder(null, { message: 'Network error' });
      mockSupabaseClient.from.mockReturnValue(mockQueryBuilder);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation();

      // Act
      await getActiveTemplateWithCache('employment', 'en');

      // Assert
      expect(consoleSpy).toHaveBeenCalled();
      const errorCall = consoleSpy.mock.calls[0][0] as string;
      const logEntry = JSON.parse(errorCall);

      // Verify all required structured fields
      expect(logEntry).toHaveProperty('timestamp');
      expect(logEntry.timestamp).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/); // ISO 8601
      expect(logEntry).toHaveProperty('machineId');
      expect(logEntry.machineId).toBe('859ce793f7ba2ce7bb7651a979df1b1147968b804950b29cb46511dc1ca2e679');
      expect(logEntry.level).toBe('error');
      expect(logEntry.category).toBe('template-retrieval');
      expect(logEntry).toHaveProperty('message');
      expect(logEntry).toHaveProperty('metadata');
      expect(logEntry.metadata.contractType).toBe('employment');
      expect(logEntry.metadata.language).toBe('en');
      expect(logEntry.metadata).toHaveProperty('errorCode');
      expect(logEntry.metadata).toHaveProperty('reason');

      consoleSpy.mockRestore();
    });

    it('should include all metadata fields in cache operation logs', async () => {
      // Arrange
      const mockTemplate = createMockTemplate({
        id: 'test-template-id',
        version: 5,
        contract_type: 'testament',
        language: 'th',
      });
      const cache = getTemplateCache();
      cache.set('testament', 'th', mockTemplate);

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation();

      // Act
      await getActiveTemplateWithCache('testament', 'th');

      // Assert
      const logCalls = consoleSpy.mock.calls.filter(
        (call) => call[0] && typeof call[0] === 'string' && call[0].includes('cache-operation')
      );
      expect(logCalls.length).toBeGreaterThan(0);

      const logEntry = JSON.parse(logCalls[0][0] as string);
      expect(logEntry.metadata).toHaveProperty('contractType');
      expect(logEntry.metadata).toHaveProperty('language');
      expect(logEntry.metadata.contractType).toBe('testament');
      expect(logEntry.metadata.language).toBe('th');

      consoleSpy.mockRestore();
    });

    it('should use ISO 8601 timestamp format in all logs', async () => {
      // Arrange
      const mockTemplate = createMockTemplate({ is_active: true });
      const mockQueryBuilder = createMockQueryBuilder(mockTemplate);
      mockSupabaseClient.from.mockReturnValue(mockQueryBuilder);

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation();

      // Act
      await getActiveTemplateWithCache('lease', 'th');

      // Assert
      expect(consoleSpy).toHaveBeenCalled();
      const logCalls = consoleSpy.mock.calls.filter(
        (call) => call[0] && typeof call[0] === 'string' && call[0].includes('"timestamp"')
      );

      for (const call of logCalls) {
        const logEntry = JSON.parse(call[0] as string);
        // Verify ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ
        expect(logEntry.timestamp).toMatch(
          /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/
        );
      }

      consoleSpy.mockRestore();
    });

    it('should include machine ID from environment variable', async () => {
      // Arrange
      const mockTemplate = createMockTemplate({ is_active: true });
      const cache = getTemplateCache();
      cache.set('lease', 'th', mockTemplate);

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation();

      // Act
      await getActiveTemplateWithCache('lease', 'th');

      // Assert
      expect(consoleSpy).toHaveBeenCalled();
      const logCall = consoleSpy.mock.calls[0][0] as string;
      const logEntry = JSON.parse(logCall);

      expect(logEntry.machineId).toBe('859ce793f7ba2ce7bb7651a979df1b1147968b804950b29cb46511dc1ca2e679');

      consoleSpy.mockRestore();
    });
  });;

  /**
   * Test 6: Integration - cache lifecycle
   * Verify complete cache lifecycle: miss → fetch → hit → invalidate
   */
  describe('Complete Cache Lifecycle', () => {
    it('should execute full cache lifecycle: miss -> fetch -> hit -> invalidate', async () => {
      // Arrange
      const mockTemplate = createMockTemplate({
        id: 'template-1',
        is_active: true,
      });
      const updatedTemplate = { ...mockTemplate, is_active: false };

      const cache = getTemplateCache();

      // Mock for cache miss -> fetch
      const queryBuilder1 = createMockQueryBuilder(mockTemplate);
      mockSupabaseClient.from.mockReturnValueOnce(queryBuilder1);

      // Mock for update -> invalidate
      const getBuilder = {
        select: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        single: vi.fn().mockResolvedValue({ data: mockTemplate, error: null }),
      };
      mockSupabaseClient.from.mockReturnValueOnce(getBuilder);

      const updateBuilder = {
        update: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        select: vi.fn(function(this: any) { return this; }),
        single: vi.fn().mockResolvedValue({ data: updatedTemplate, error: null }),
      };
      mockSupabaseClient.from.mockReturnValueOnce(updateBuilder);

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation();
      vi.spyOn(console, 'info').mockImplementation();

      // Act - Step 1: Cache miss (not in cache)
      expect(cache.get('lease', 'th')).toBeNull();

      // Act - Step 2: Fetch from database
      const firstResult = await getActiveTemplateWithCache('lease', 'th');
      expect(firstResult.fromCache).toBe(false);

      // Act - Step 3: Verify cache was populated
      const cachedTemplate = cache.get('lease', 'th');
      expect(cachedTemplate).toEqual(mockTemplate);

      // Act - Step 4: Second call should hit cache
      const secondResult = await getActiveTemplateWithCache('lease', 'th');
      expect(secondResult.fromCache).toBe(true);

      // Act - Step 5: Update template (triggers invalidation)
      const updateRequest: UpdateTemplateRequest = {
        name: 'Updated',
      };
      await updateTemplate('template-1', updateRequest);

      // Act - Step 6: Cache should be empty after invalidation
      expect(cache.get('lease', 'th')).toBeNull();

      consoleSpy.mockRestore();
    });
  });
});

/**
 * Integration Tests for Task 10.1: Enhanced Template Version Management
 * 
 * Validates: Requirements 9.1
 */
describe('Task 10.1: Enhanced Template Version Management', () => {
  beforeEach(() => {
    resetCacheInstance();
    vi.clearAllMocks();
    mockSupabaseClient.from = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Test: getMaxVersion returns correct maximum version
   * When templates exist for a contract type and language,
   * getMaxVersion should query the database and return the highest version number
   */
  describe('getMaxVersion Method', () => {
    it('should return the maximum version number for existing templates', async () => {
      // Arrange
      const mockQueryBuilder = {
        select: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        order: vi.fn(function(this: any) { return this; }),
        limit: vi.fn(function(this: any) { return this; }),
        maybeSingle: vi.fn().mockResolvedValue({ data: { version: 3 }, error: null }),
      };
      mockSupabaseClient.from.mockReturnValue(mockQueryBuilder);

      // Act
      const maxVersion = await getMaxVersion('lease', 'th');

      // Assert
      expect(maxVersion).toBe(3);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('contract_templates');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith('version');
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('contract_type', 'lease');
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('language', 'th');
      expect(mockQueryBuilder.order).toHaveBeenCalledWith('version', { ascending: false });
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(1);
    });

    it('should return 0 when no templates exist for contract type and language', async () => {
      // Arrange
      const mockQueryBuilder = {
        select: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        order: vi.fn(function(this: any) { return this; }),
        limit: vi.fn(function(this: any) { return this; }),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      };
      mockSupabaseClient.from.mockReturnValue(mockQueryBuilder);

      // Act
      const maxVersion = await getMaxVersion('vehicle-sale', 'en');

      // Assert
      expect(maxVersion).toBe(0);
    });

    it('should return 0 when Supabase is not configured', async () => {
      // Arrange
      vi.mocked(getSupabaseClient).mockReturnValueOnce(null);

      // Act
      const maxVersion = await getMaxVersion('lease', 'th');

      // Assert
      expect(maxVersion).toBe(0);
    });

    it('should correctly handle different contract types independently', async () => {
      // Arrange - First call for lease
      const leaseQueryBuilder = {
        select: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        order: vi.fn(function(this: any) { return this; }),
        limit: vi.fn(function(this: any) { return this; }),
        maybeSingle: vi.fn().mockResolvedValue({ data: { version: 2 }, error: null }),
      };

      // Second call for vehicle-sale
      const vehicleQueryBuilder = {
        select: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        order: vi.fn(function(this: any) { return this; }),
        limit: vi.fn(function(this: any) { return this; }),
        maybeSingle: vi.fn().mockResolvedValue({ data: { version: 5 }, error: null }),
      };

      mockSupabaseClient.from.mockReturnValueOnce(leaseQueryBuilder);
      mockSupabaseClient.from.mockReturnValueOnce(vehicleQueryBuilder);

      // Act
      const leaseMax = await getMaxVersion('lease', 'th');
      const vehicleMax = await getMaxVersion('vehicle-sale', 'th');

      // Assert
      expect(leaseMax).toBe(2);
      expect(vehicleMax).toBe(5);
      expect(leaseQueryBuilder.eq).toHaveBeenCalledWith('contract_type', 'lease');
      expect(vehicleQueryBuilder.eq).toHaveBeenCalledWith('contract_type', 'vehicle-sale');
    });

    it('should correctly handle different languages independently', async () => {
      // Arrange - First call for Thai
      const thQueryBuilder = {
        select: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        order: vi.fn(function(this: any) { return this; }),
        limit: vi.fn(function(this: any) { return this; }),
        maybeSingle: vi.fn().mockResolvedValue({ data: { version: 1 }, error: null }),
      };

      // Second call for English
      const enQueryBuilder = {
        select: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        order: vi.fn(function(this: any) { return this; }),
        limit: vi.fn(function(this: any) { return this; }),
        maybeSingle: vi.fn().mockResolvedValue({ data: { version: 3 }, error: null }),
      };

      mockSupabaseClient.from.mockReturnValueOnce(thQueryBuilder);
      mockSupabaseClient.from.mockReturnValueOnce(enQueryBuilder);

      // Act
      const thMax = await getMaxVersion('lease', 'th');
      const enMax = await getMaxVersion('lease', 'en');

      // Assert
      expect(thMax).toBe(1);
      expect(enMax).toBe(3);
      expect(thQueryBuilder.eq).toHaveBeenCalledWith('language', 'th');
      expect(enQueryBuilder.eq).toHaveBeenCalledWith('language', 'en');
    });

    it('should handle database errors gracefully by returning 0', async () => {
      // Arrange
      const mockQueryBuilder = {
        select: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        order: vi.fn(function(this: any) { return this; }),
        limit: vi.fn(function(this: any) { return this; }),
        maybeSingle: vi.fn().mockResolvedValue({ 
          data: null, 
          error: { message: 'Database error' } 
        }),
      };
      mockSupabaseClient.from.mockReturnValue(mockQueryBuilder);

      // Act
      const maxVersion = await getMaxVersion('lease', 'th');

      // Assert
      expect(maxVersion).toBe(0);
    });

    it('should work for all 5 contract types', async () => {
      // Arrange
      const contractTypes = ['lease', 'vehicle-sale', 'property-sale', 'employment', 'testament'];
      const versions = [1, 2, 3, 4, 5];

      for (let i = 0; i < contractTypes.length; i++) {
        const mockQueryBuilder = {
          select: vi.fn(function(this: any) { return this; }),
          eq: vi.fn(function(this: any) { return this; }),
          order: vi.fn(function(this: any) { return this; }),
          limit: vi.fn(function(this: any) { return this; }),
          maybeSingle: vi.fn().mockResolvedValue({ data: { version: versions[i] }, error: null }),
        };
        mockSupabaseClient.from.mockReturnValueOnce(mockQueryBuilder);
      }

      // Act & Assert
      for (let i = 0; i < contractTypes.length; i++) {
        const maxVersion = await getMaxVersion(
          contractTypes[i] as any,
          'th'
        );
        expect(maxVersion).toBe(versions[i]);
      }
    });

    it('should work for both languages', async () => {
      // Arrange
      const languages = ['th', 'en'];
      const versions = [1, 2];

      for (let i = 0; i < languages.length; i++) {
        const mockQueryBuilder = {
          select: vi.fn(function(this: any) { return this; }),
          eq: vi.fn(function(this: any) { return this; }),
          order: vi.fn(function(this: any) { return this; }),
          limit: vi.fn(function(this: any) { return this; }),
          maybeSingle: vi.fn().mockResolvedValue({ data: { version: versions[i] }, error: null }),
        };
        mockSupabaseClient.from.mockReturnValueOnce(mockQueryBuilder);
      }

      // Act & Assert
      for (let i = 0; i < languages.length; i++) {
        const maxVersion = await getMaxVersion(
          'lease',
          languages[i] as any
        );
        expect(maxVersion).toBe(versions[i]);
      }
    });

    it('should query with correct ordering to get maximum version', async () => {
      // Arrange
      const mockQueryBuilder = {
        select: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        order: vi.fn(function(this: any) { return this; }),
        limit: vi.fn(function(this: any) { return this; }),
        maybeSingle: vi.fn().mockResolvedValue({ data: { version: 10 }, error: null }),
      };
      mockSupabaseClient.from.mockReturnValue(mockQueryBuilder);

      // Act
      await getMaxVersion('lease', 'th');

      // Assert - Verify order is descending (to get max first)
      expect(mockQueryBuilder.order).toHaveBeenCalledWith('version', { ascending: false });
      // Verify limit is 1 (only get the top result)
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(1);
    });
  });

  /**
   * Test: createTemplate uses getMaxVersion to increment versions
   * When creating a template, the version should be set to maxVersion + 1
   */
  describe('createTemplate Integration with getMaxVersion', () => {
    it('should create template with version = maxVersion + 1', async () => {
      // Arrange
      const maxVersionQueryBuilder = {
        select: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        order: vi.fn(function(this: any) { return this; }),
        limit: vi.fn(function(this: any) { return this; }),
        maybeSingle: vi.fn().mockResolvedValue({ data: { version: 2 }, error: null }),
      };

      const newTemplate = createMockTemplate({
        version: 3,
        contract_type: 'lease',
        language: 'th',
      });

      const createQueryBuilder = {
        insert: vi.fn(function(this: any) { return this; }),
        select: vi.fn(function(this: any) { return this; }),
        single: vi.fn().mockResolvedValue({ data: newTemplate, error: null }),
      };

      mockSupabaseClient.from.mockReturnValueOnce(maxVersionQueryBuilder);
      mockSupabaseClient.from.mockReturnValueOnce(createQueryBuilder);

      const mockValidate = vi.fn(() => ({ valid: true, errors: [] }));
      vi.mocked(validateTemplate).mockImplementation(mockValidate);

      const createRequest: CreateTemplateRequest = {
        contract_type: 'lease',
        language: 'th',
        name: 'Lease Contract V3',
        template_html: '<h1>Lease</h1>',
        variables: [],
      };

      // Act
      const result = await createTemplate(createRequest, 'user-1');

      // Assert
      expect(result.data?.version).toBe(3);
      expect(createQueryBuilder.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          version: 3,
          contract_type: 'lease',
          language: 'th',
          name: 'Lease Contract V3',
        })
      );
    });

    it('should create template with version = 1 when no existing templates', async () => {
      // Arrange
      const maxVersionQueryBuilder = {
        select: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        order: vi.fn(function(this: any) { return this; }),
        limit: vi.fn(function(this: any) { return this; }),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      const newTemplate = createMockTemplate({
        version: 1,
        contract_type: 'vehicle-sale',
        language: 'en',
      });

      const createQueryBuilder = {
        insert: vi.fn(function(this: any) { return this; }),
        select: vi.fn(function(this: any) { return this; }),
        single: vi.fn().mockResolvedValue({ data: newTemplate, error: null }),
      };

      mockSupabaseClient.from.mockReturnValueOnce(maxVersionQueryBuilder);
      mockSupabaseClient.from.mockReturnValueOnce(createQueryBuilder);

      vi.mocked(validateTemplate).mockImplementation(() => ({ valid: true, errors: [] }));

      const createRequest: CreateTemplateRequest = {
        contract_type: 'vehicle-sale',
        language: 'en',
        name: 'Vehicle Sale Contract V1',
        template_html: '<h1>Vehicle Sale</h1>',
        variables: [],
      };

      // Act
      const result = await createTemplate(createRequest, 'user-1');

      // Assert
      expect(result.data?.version).toBe(1);
      expect(createQueryBuilder.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          version: 1,
          contract_type: 'vehicle-sale',
          language: 'en',
        })
      );
    });

    it('should handle different contract type/language combinations independently', async () => {
      // Arrange - First template creation
      const maxVersion1QueryBuilder = {
        select: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        order: vi.fn(function(this: any) { return this; }),
        limit: vi.fn(function(this: any) { return this; }),
        maybeSingle: vi.fn().mockResolvedValue({ data: { version: 1 }, error: null }),
      };

      const template1 = createMockTemplate({ version: 2, contract_type: 'lease', language: 'th' });

      const createQueryBuilder1 = {
        insert: vi.fn(function(this: any) { return this; }),
        select: vi.fn(function(this: any) { return this; }),
        single: vi.fn().mockResolvedValue({ data: template1, error: null }),
      };

      // Second template creation
      const maxVersion2QueryBuilder = {
        select: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        order: vi.fn(function(this: any) { return this; }),
        limit: vi.fn(function(this: any) { return this; }),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      const template2 = createMockTemplate({ version: 1, contract_type: 'employment', language: 'en' });

      const createQueryBuilder2 = {
        insert: vi.fn(function(this: any) { return this; }),
        select: vi.fn(function(this: any) { return this; }),
        single: vi.fn().mockResolvedValue({ data: template2, error: null }),
      };

      mockSupabaseClient.from.mockReturnValueOnce(maxVersion1QueryBuilder);
      mockSupabaseClient.from.mockReturnValueOnce(createQueryBuilder1);
      mockSupabaseClient.from.mockReturnValueOnce(maxVersion2QueryBuilder);
      mockSupabaseClient.from.mockReturnValueOnce(createQueryBuilder2);

      vi.mocked(validateTemplate).mockImplementation(() => ({ valid: true, errors: [] }));

      const request1: CreateTemplateRequest = {
        contract_type: 'lease',
        language: 'th',
        name: 'Lease TH V2',
        template_html: '<h1>Lease</h1>',
        variables: [],
      };

      const request2: CreateTemplateRequest = {
        contract_type: 'employment',
        language: 'en',
        name: 'Employment EN V1',
        template_html: '<h1>Employment</h1>',
        variables: [],
      };

      // Act
      const result1 = await createTemplate(request1, 'user-1');
      const result2 = await createTemplate(request2, 'user-1');

      // Assert
      expect(result1.data?.version).toBe(2);
      expect(result2.data?.version).toBe(1);
    });
  });
});
