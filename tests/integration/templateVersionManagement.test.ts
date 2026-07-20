// tests/integration/templateVersionManagement.test.ts
// Integration tests for template version management
// Feature: database-template-integration
// Task: 10.5 Write integration tests for version management

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getTemplateCache, resetCacheInstance } from '@/lib/cache/templateCache';
import {
  publishTemplate,
  deleteTemplate,
  getTemplateById,
  createTemplate,
  unpublishTemplate,
  getActiveTemplate,
} from '@/lib/services/templateService';
import type {
  ContractTemplate,
  CreateTemplateRequest,
} from '@/lib/types/template';

let mockSupabaseClient: any = {
  from: vi.fn(),
};

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  getSupabaseClient: vi.fn(() => mockSupabaseClient),
}));

// Mock template engine validation
vi.mock('@/lib/templateEngine', () => ({
  renderTemplate: vi.fn(() => '<html>rendered</html>'),
  validateTemplate: vi.fn((html: string) => ({
    valid: true,
    errors: [],
    warnings: [],
  })),
  renderTemplateWithCSS: vi.fn(() => '<html>rendered</html>'),
}));

// Mock security validation
vi.mock('@/lib/security', () => ({
  validateTemplateSecurityComprehensive: vi.fn((html: string) => ({
    valid: true,
    errors: [],
    warnings: [],
  })),
  sanitizeTemplateInput: vi.fn((html: string) => html),
  sanitizeRenderedOutput: vi.fn((html: string) => html),
}));

// Mock error log store
vi.mock('@/lib/errorLogStore', () => ({
  addErrorLog: vi.fn(),
}));

// Get mocked functions
import { getSupabaseClient as getSupabaseMocked } from '@/lib/supabase';
import { validateTemplate as validateTemplateMocked } from '@/lib/templateEngine';
import { validateTemplateSecurityComprehensive } from '@/lib/security';

/**
 * Helper to create a mock query builder chain
 */
function createMockQueryBuilder(returnData?: any, returnError?: any) {
  const builder = {
    select: vi.fn(function(this: any) { return this; }),
    eq: vi.fn(function(this: any) { return this; }),
    order: vi.fn(function(this: any) { return this; }),
    limit: vi.fn(function(this: any) { return this; }),
    maybeSingle: vi.fn().mockResolvedValue({ data: returnData || null, error: returnError || null }),
    update: vi.fn(function(this: any) { return builder; }),
    single: vi.fn().mockResolvedValue({ data: returnData || null, error: returnError || null }),
    delete: vi.fn(function(this: any) { return builder; }),
    insert: vi.fn(function(this: any) { return builder; }),
  };
  return builder;
}

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
 * Integration Tests for Task 10.5: Version Management
 * 
 * Validates: Requirements 9.3, 9.6, 9.7
 */
describe('Task 10.5: Integration Tests for Version Management', () => {
  beforeEach(() => {
    resetCacheInstance();
    vi.clearAllMocks();
    mockSupabaseClient.from = vi.fn();
    
    // Setup template engine validation mock
    vi.mocked(validateTemplateMocked).mockImplementation(() => ({ 
      valid: true, 
      errors: [],
      warnings: [],
    }));
    
    // Setup security validation mock
    vi.mocked(validateTemplateSecurityComprehensive).mockImplementation(() => ({ 
      valid: true, 
      errors: [],
      warnings: [],
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Test 1: Test version increment on template creation
   * When creating a new template version, the version number should increment
   */
  describe('Test 1: Version Increment on Template Creation', () => {
    it('should increment version when creating new template for existing contract type/language', async () => {
      // Arrange - Mock getMaxVersion query
      const getMaxVersionBuilder = {
        select: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        order: vi.fn(function(this: any) { return this; }),
        limit: vi.fn(function(this: any) { return this; }),
        maybeSingle: vi.fn().mockResolvedValue({ data: { version: 2 }, error: null }),
      };

      // Mock create template query
      const createTemplate1 = createMockTemplate({
        id: 'lease-v3',
        version: 3,
        is_draft: true,
        is_active: false,
      });

      const createBuilder = {
        insert: vi.fn(function(this: any) { return this; }),
        select: vi.fn(function(this: any) { return this; }),
        single: vi.fn().mockResolvedValue({ data: createTemplate1, error: null }),
      };

      mockSupabaseClient.from.mockReturnValueOnce(getMaxVersionBuilder);
      mockSupabaseClient.from.mockReturnValueOnce(createBuilder);

      vi.mocked(validateTemplateMocked).mockImplementation(() => ({ valid: true, errors: [] }));

      const createRequest: CreateTemplateRequest = {
        contract_type: 'lease',
        language: 'th',
        name: 'Lease Contract TH V3',
        template_html: '<h1>Lease Agreement</h1>',
        variables: [{ name: 'lessorName', type: 'string', description: 'Lessor', required: true }],
      };

      // Act
      const result = await createTemplate(createRequest, 'admin-user-1');

      // Assert
      expect(result.data?.version).toBe(3);
      expect(createBuilder.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          version: 3,
          contract_type: 'lease',
          language: 'th',
          is_draft: true,
          is_active: false,
        })
      );
    });

    it('should start with version 1 when no previous templates exist', async () => {
      // Arrange
      const getMaxVersionBuilder = {
        select: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        order: vi.fn(function(this: any) { return this; }),
        limit: vi.fn(function(this: any) { return this; }),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      const template1 = createMockTemplate({
        id: 'vehicle-v1',
        version: 1,
        contract_type: 'vehicle-sale',
        language: 'en',
      });

      const createBuilder = {
        insert: vi.fn(function(this: any) { return this; }),
        select: vi.fn(function(this: any) { return this; }),
        single: vi.fn().mockResolvedValue({ data: template1, error: null }),
      };

      mockSupabaseClient.from.mockReturnValueOnce(getMaxVersionBuilder);
      mockSupabaseClient.from.mockReturnValueOnce(createBuilder);

      vi.mocked(validateTemplateMocked).mockImplementation(() => ({ valid: true, errors: [] }));

      const createRequest: CreateTemplateRequest = {
        contract_type: 'vehicle-sale',
        language: 'en',
        name: 'Vehicle Sale Contract EN V1',
        template_html: '<h1>Vehicle Sale</h1>',
        variables: [],
      };

      // Act
      const result = await createTemplate(createRequest, 'admin-user-1');

      // Assert
      expect(result.data?.version).toBe(1);
    });
  });

  /**
   * Test 2: Test deactivation of previous active template on publish
   * When publishing a new template, the previously active template should be deactivated
   */
  describe('Test 2: Deactivation of Previous Active Template on Publish', () => {
    it('should deactivate previous active template when publishing new version', async () => {
      // Arrange
      const v1Template = createMockTemplate({
        id: 'lease-v1',
        version: 1,
        is_active: true,
        is_draft: false,
        contract_type: 'lease',
        language: 'th',
      });

      const v2Template = createMockTemplate({
        id: 'lease-v2',
        version: 2,
        is_active: false,
        is_draft: true,
        contract_type: 'lease',
        language: 'th',
      });

      // Mock getTemplateById to return v2 template
      const getTemplateBuilder = createMockQueryBuilder(v2Template);

      // Mock query for finding existing active template
      const findActiveBuilder = createMockQueryBuilder(v1Template);

      // Mock deactivate update
      const deactivateBuilder = {
        update: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        error: null,
      };

      // Mock activate update
      const activateBuilder = createMockQueryBuilder({ ...v2Template, is_active: true, is_draft: false });

      mockSupabaseClient.from.mockReturnValueOnce(getTemplateBuilder); // getTemplateById
      mockSupabaseClient.from.mockReturnValueOnce(findActiveBuilder); // find existing active
      mockSupabaseClient.from.mockReturnValueOnce(deactivateBuilder); // deactivate
      mockSupabaseClient.from.mockReturnValueOnce(activateBuilder);   // activate

      vi.mocked(validateTemplateMocked).mockImplementation(() => ({ valid: true, errors: [] }));
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation();
      vi.spyOn(console, 'log').mockImplementation();

      // Act
      const result = await publishTemplate('lease-v2', true, 'admin-user-1');

      // Assert
      expect(result.data?.is_active).toBe(true);
      expect(result.data?.is_draft).toBe(false);

      // Verify deactivate was called for v1
      expect(deactivateBuilder.eq).toHaveBeenCalledWith('contract_type', 'lease');
      expect(deactivateBuilder.eq).toHaveBeenCalledWith('language', 'th');
      expect(deactivateBuilder.eq).toHaveBeenCalledWith('is_active', true);

      // Verify activate was called for v2
      expect(activateBuilder.eq).toHaveBeenCalledWith('id', 'lease-v2');

      consoleSpy.mockRestore();
    });

    it('should handle case where no previous active template exists', async () => {
      // Arrange - First template being published (no previous active template)
      const v1Template = createMockTemplate({
        id: 'property-v1',
        version: 1,
        is_active: false,
        is_draft: true,
        contract_type: 'property-sale',
        language: 'en',
      });

      const getTemplateBuilder = createMockQueryBuilder(v1Template);

      // No existing active template
      const findActiveBuilder = createMockQueryBuilder(null);

      // No deactivate needed
      const deactivateBuilder = {
        update: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        error: null,
      };

      // Activate v1
      const activateBuilder = createMockQueryBuilder({ ...v1Template, is_active: true, is_draft: false });

      mockSupabaseClient.from.mockReturnValueOnce(getTemplateBuilder);
      mockSupabaseClient.from.mockReturnValueOnce(findActiveBuilder);
      mockSupabaseClient.from.mockReturnValueOnce(deactivateBuilder);
      mockSupabaseClient.from.mockReturnValueOnce(activateBuilder);

      vi.mocked(validateTemplateMocked).mockImplementation(() => ({ valid: true, errors: [] }));
      vi.spyOn(console, 'info').mockImplementation();
      vi.spyOn(console, 'log').mockImplementation();

      // Act
      const result = await publishTemplate('property-v1', true, 'admin-user-1');

      // Assert
      expect(result.data?.is_active).toBe(true);
      expect(result.data?.version).toBe(1);
    });

    it('should invalidate cache after publishing', async () => {
      // Arrange
      const v2Template = createMockTemplate({
        id: 'employment-v2',
        version: 2,
        is_active: false,
        is_draft: true,
        contract_type: 'employment',
        language: 'th',
      });

      const cache = getTemplateCache();
      cache.set('employment', 'th', v2Template);

      const getTemplateBuilder = createMockQueryBuilder(v2Template);
      const findActiveBuilder = createMockQueryBuilder(null);

      const deactivateBuilder = {
        update: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        error: null,
      };

      const activateBuilder = createMockQueryBuilder({ ...v2Template, is_active: true, is_draft: false });

      mockSupabaseClient.from.mockReturnValueOnce(getTemplateBuilder);
      mockSupabaseClient.from.mockReturnValueOnce(findActiveBuilder);
      mockSupabaseClient.from.mockReturnValueOnce(deactivateBuilder);
      mockSupabaseClient.from.mockReturnValueOnce(activateBuilder);

      vi.mocked(validateTemplateMocked).mockImplementation(() => ({ valid: true, errors: [] }));
      vi.spyOn(console, 'info').mockImplementation();
      vi.spyOn(console, 'log').mockImplementation();

      // Act
      await publishTemplate('employment-v2', true);

      // Assert - cache should be invalidated
      expect(cache.get('employment', 'th')).toBeNull();
    });
  });

  /**
   * Test 3: Test rollback activates previous version
   * When rolling back, the previous active version should be reactivated
   */
  describe('Test 3: Rollback Activates Previous Version', () => {
    it('should reactivate previous version when unpublishing current and then publishing previous', async () => {
      // Arrange
      const v1Template = createMockTemplate({
        id: 'lease-v1',
        version: 1,
        is_active: false,
        is_draft: false,
        contract_type: 'lease',
        language: 'th',
      });

      const v2Template = createMockTemplate({
        id: 'lease-v2',
        version: 2,
        is_active: true,
        is_draft: false,
        contract_type: 'lease',
        language: 'th',
      });

      // Step 1: Unpublish v2 (deactivate)
      const unpublishBuilder = createMockQueryBuilder({ ...v2Template, is_active: false });

      // Step 2: Get v1 template
      const getV1Builder = createMockQueryBuilder(v1Template);

      // Step 3: Find existing active (should be none now)
      const findActiveBuilder = createMockQueryBuilder(null);

      // Step 4: Deactivate any (none to deactivate)
      const deactivateBuilder = {
        update: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        error: null,
      };

      // Step 5: Activate v1
      const activateV1Builder = createMockQueryBuilder({ ...v1Template, is_active: true });

      mockSupabaseClient.from.mockReturnValueOnce(unpublishBuilder);   // unpublish v2
      mockSupabaseClient.from.mockReturnValueOnce(getV1Builder);       // get v1
      mockSupabaseClient.from.mockReturnValueOnce(findActiveBuilder);  // find active
      mockSupabaseClient.from.mockReturnValueOnce(deactivateBuilder);  // deactivate
      mockSupabaseClient.from.mockReturnValueOnce(activateV1Builder);  // activate v1

      vi.mocked(validateTemplateMocked).mockImplementation(() => ({ valid: true, errors: [] }));
      vi.spyOn(console, 'info').mockImplementation();
      vi.spyOn(console, 'log').mockImplementation();

      // Act - Step 1: Unpublish v2
      const unpublishResult = await unpublishTemplate('lease-v2');
      expect(unpublishResult.data?.is_active).toBe(false);

      // Act - Step 2: Publish v1 (rollback)
      const publishResult = await publishTemplate('lease-v1', true);

      // Assert
      expect(publishResult.data?.is_active).toBe(true);
      expect(publishResult.data?.version).toBe(1);
      expect(publishResult.data?.id).toBe('lease-v1');
    });

    it('should support rollback through version history', async () => {
      // Arrange - Simulate 3 versions with v3 active
      const v1Template = createMockTemplate({
        id: 'testament-v1',
        version: 1,
        is_active: false,
        contract_type: 'testament',
        language: 'en',
      });

      const v2Template = createMockTemplate({
        id: 'testament-v2',
        version: 2,
        is_active: false,
        contract_type: 'testament',
        language: 'en',
      });

      const v3Template = createMockTemplate({
        id: 'testament-v3',
        version: 3,
        is_active: true,
        contract_type: 'testament',
        language: 'en',
      });

      // To rollback: unpublish v3, then publish v2
      const unpublishBuilder = createMockQueryBuilder({ ...v3Template, is_active: false });

      const getV2Builder = createMockQueryBuilder(v2Template);

      const findActiveBuilder = createMockQueryBuilder(null);

      const deactivateBuilder = {
        update: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        error: null,
      };

      const activateBuilder = createMockQueryBuilder({ ...v2Template, is_active: true });

      mockSupabaseClient.from.mockReturnValueOnce(unpublishBuilder);
      mockSupabaseClient.from.mockReturnValueOnce(getV2Builder);
      mockSupabaseClient.from.mockReturnValueOnce(findActiveBuilder);
      mockSupabaseClient.from.mockReturnValueOnce(deactivateBuilder);
      mockSupabaseClient.from.mockReturnValueOnce(activateBuilder);

      vi.mocked(validateTemplateMocked).mockImplementation(() => ({ valid: true, errors: [] }));
      vi.spyOn(console, 'info').mockImplementation();
      vi.spyOn(console, 'log').mockImplementation();

      // Act
      await unpublishTemplate('testament-v3');
      const rollbackResult = await publishTemplate('testament-v2', true);

      // Assert
      expect(rollbackResult.data?.version).toBe(2);
      expect(rollbackResult.data?.is_active).toBe(true);
    });
  });

  /**
   * Test 4: Test prevention of active template deletion
   * Active templates should not be allowed to be deleted
   */
  describe('Test 4: Prevention of Active Template Deletion', () => {
    it('should prevent deletion of active template', async () => {
      // Arrange
      const activeTemplate = createMockTemplate({
        id: 'lease-active',
        version: 1,
        is_active: true,
        is_draft: false,
        contract_type: 'lease',
        language: 'th',
      });

      const getTemplateBuilder = createMockQueryBuilder(activeTemplate);

      mockSupabaseClient.from.mockReturnValue(getTemplateBuilder);

      // Act
      const result = await deleteTemplate('lease-active');

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('Cannot delete active template');
    });

    it('should allow deletion of inactive template', async () => {
      // Arrange
      const inactiveTemplate = createMockTemplate({
        id: 'lease-inactive',
        version: 1,
        is_active: false,
        is_draft: true,
        contract_type: 'lease',
        language: 'th',
      });

      const getTemplateBuilder = createMockQueryBuilder(inactiveTemplate);

      const deleteBuilder = {
        delete: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        error: null,
      };

      mockSupabaseClient.from.mockReturnValueOnce(getTemplateBuilder);
      mockSupabaseClient.from.mockReturnValueOnce(deleteBuilder);

      // Act
      const result = await deleteTemplate('lease-inactive');

      // Assert
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(deleteBuilder.eq).toHaveBeenCalledWith('id', 'lease-inactive');
    });

    it('should return error message when trying to delete active template before deactivation', async () => {
      // Arrange
      const activeTemplate = createMockTemplate({
        id: 'vehicle-active',
        version: 2,
        is_active: true,
        is_draft: false,
        contract_type: 'vehicle-sale',
        language: 'en',
      });

      const getTemplateBuilder = createMockQueryBuilder(activeTemplate);

      mockSupabaseClient.from.mockReturnValue(getTemplateBuilder);

      // Act
      const result = await deleteTemplate('vehicle-active');

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Cannot delete active template. Deactivate it first.');
    });

    it('should allow deletion after template is deactivated', async () => {
      // Arrange
      const previouslyActiveTemplate = createMockTemplate({
        id: 'property-v1',
        version: 1,
        is_active: false, // Now inactive after deactivation
        is_draft: false,
        contract_type: 'property-sale',
        language: 'en',
      });

      const getTemplateBuilder = createMockQueryBuilder(previouslyActiveTemplate);

      const deleteBuilder = {
        delete: vi.fn(function(this: any) { return this; }),
        eq: vi.fn(function(this: any) { return this; }),
        error: null,
      };

      mockSupabaseClient.from.mockReturnValueOnce(getTemplateBuilder);
      mockSupabaseClient.from.mockReturnValueOnce(deleteBuilder);

      // Act
      const result = await deleteTemplate('property-v1');

      // Assert
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should work for all contract types', async () => {
      // Arrange
      const contractTypes = ['lease', 'vehicle-sale', 'property-sale', 'employment', 'testament'];

      for (const contractType of contractTypes) {
        const activeTemplate = createMockTemplate({
          id: `${contractType}-active`,
          contract_type: contractType as any,
          is_active: true,
        });

        const getTemplateBuilder = createMockQueryBuilder(activeTemplate);

        mockSupabaseClient.from.mockReturnValue(getTemplateBuilder);

        // Act
        const result = await deleteTemplate(`${contractType}-active`);

        // Assert
        expect(result.success).toBe(false);
        expect(result.error?.message).toContain('Cannot delete active template');
      }
    });
  });
});
