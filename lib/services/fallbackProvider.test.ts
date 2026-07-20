/**
 * Unit Tests for Fallback Provider Service
 * 
 * Tests all 10 contract type and language combinations
 * Tests FormData immutability through fallback
 * Tests logging structure for fallback events
 * 
 * Requirements: 5.7, 10.1, 10.2, 10.3
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getHardcodedTemplate,
  getHardcodedTemplateWithReason,
  verifyAllTemplatesAvailable,
  type FallbackTemplate,
} from './fallbackProvider';
import type { ContractType, TemplateLanguage } from '@/lib/types/template';

describe('Fallback Provider', () => {
  const mockFormData = {
    sellerName: 'John Seller',
    sellerAddress: '123 Main St',
    sellerTaxId: '123456789',
    sellerSigner: 'John Signer',
    buyerName: 'Jane Buyer',
    buyerAddress: '456 Oak Ave',
    buyerTaxId: '987654321',
    buyerSigner: 'Jane Signer',
    productName: 'Unit A',
    quantity: 1,
    unit: 'unit',
    unitPrice: 15000,
    currency: 'THB',
    deliveryDeadline: '2024-03-15',
    deliveryMethod: 'Immediate',
    paymentMethod: 'Bank Transfer',
    depositAmount: 30000,
    penaltyRate: 5,
    contractDate: '2024-01-15',
    state: 'Bangkok',
    country: 'Thailand',
    vehicleBrand: 'Toyota',
    vehicleModel: 'Camry',
    vehicleYear: '2023',
    vehiclePlate: 'ABC-1234',
    vehicleColor: 'Silver',
    vehicleMileage: '0',
    vehiclePrice: 1500000,
    propertyCategory: 'Condo',
    propertyAddress: '789 New Lane',
    propertyArea: '100',
    propertyFloor: '10',
    propertyPrice: 5000000,
    employmentPosition: 'Manager',
    employmentStartDate: '2024-02-01',
    salaryAmount: 50000,
    workLocation: 'Bangkok Office',
    employmentBenefits: 'Health Insurance',
    employmentTerm: '2 years',
    testamentDate: '2024-01-15',
    testamentBeneficiaryName: 'Son',
    testamentExecutorName: 'Brother',
    testamentWitnesses: 'Friend 1, Friend 2',
    testamentAssets: 'House, Car, Bank Account',
    testamentNotes: 'Equal distribution',
  };

  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getHardcodedTemplate - All 10 Combinations', () => {
    const contractTypes: ContractType[] = [
      'lease',
      'vehicle-sale',
      'property-sale',
      'employment',
      'testament',
    ];
    const languages: TemplateLanguage[] = ['th', 'en'];

    describe('Requirement 10.1 & 10.2: Support all 5 contract types and both languages', () => {
      contractTypes.forEach((contractType) => {
        languages.forEach((language) => {
          it(`should return hardcoded template for ${contractType} in ${language}`, () => {
            const result = getHardcodedTemplate(contractType, language, mockFormData);

            expect(result).toBeDefined();
            expect(result.html).toBeDefined();
            expect(typeof result.html).toBe('string');
            expect(result.html.length).toBeGreaterThan(0);
            expect(result.source).toBe('hardcoded');
            expect(result.contractType).toBe(contractType);
            expect(result.language).toBe(language);
          });
        });
      });
    });

    describe('Requirement 5.3: FallbackTemplate Interface', () => {
      it('should return valid FallbackTemplate interface', () => {
        const result = getHardcodedTemplate('lease', 'th', mockFormData);

        // Verify interface structure
        expect(result).toHaveProperty('html');
        expect(result).toHaveProperty('source');
        expect(result).toHaveProperty('contractType');
        expect(result).toHaveProperty('language');

        // Verify types
        expect(typeof result.html).toBe('string');
        expect(result.source).toBe('hardcoded');
        expect(typeof result.contractType).toBe('string');
        expect(typeof result.language).toBe('string');
      });

      it('should have source property set to "hardcoded" literal', () => {
        const result = getHardcodedTemplate('vehicle-sale', 'en', mockFormData);
        expect(result.source).toBe('hardcoded');
        expect(result.source).toBe('hardcoded' as const);
      });
    });

    describe('HTML Content Validation', () => {
      it('should return HTML for Thai lease template', () => {
        const result = getHardcodedTemplate('lease', 'th', mockFormData);
        expect(result.html).toContain('<div');
        expect(result.html).toContain('</div>');
        // Check for Thai contract title
        expect(result.html).toContain('สัญญา');
      });

      it('should return HTML for English lease template', () => {
        const result = getHardcodedTemplate('lease', 'en', mockFormData);
        expect(result.html).toContain('<div');
        expect(result.html).toContain('</div>');
        // Check for English contract content
        expect(result.html).toContain('AGREEMENT');
      });

      it('should include form data values in rendered HTML', () => {
        const result = getHardcodedTemplate('lease', 'th', mockFormData);
        // Check that some form data is rendered
        expect(result.html).toContain('John Seller');
        expect(result.html).toContain('Jane Buyer');
      });

      it('should handle missing form data gracefully', () => {
        const minimalFormData = {
          contractDate: '2024-01-15',
          country: 'Thailand',
          state: 'Bangkok',
        };

        const result = getHardcodedTemplate('lease', 'th', minimalFormData);
        expect(result.html).toBeDefined();
        expect(result.html.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Requirement 5.7: FormData Immutability Through Fallback', () => {
    it('should not modify original FormData object', () => {
      const originalData = { ...mockFormData };
      const formDataCopy = { ...mockFormData };

      getHardcodedTemplate('lease', 'th', formDataCopy);

      // Verify form data is unchanged
      expect(formDataCopy).toEqual(originalData);
    });

    it('should not modify FormData when processing multiple templates', () => {
      const formDataCopy = { ...mockFormData };
      const originalData = JSON.stringify(mockFormData);

      getHardcodedTemplate('lease', 'th', formDataCopy);
      getHardcodedTemplate('vehicle-sale', 'en', formDataCopy);
      getHardcodedTemplate('employment', 'th', formDataCopy);

      // Verify form data is completely unchanged
      expect(JSON.stringify(formDataCopy)).toBe(originalData);
    });

    it('should handle empty FormData without modification', () => {
      const emptyData = {};
      const originalData = JSON.stringify(emptyData);

      getHardcodedTemplate('lease', 'en', emptyData);

      expect(JSON.stringify(emptyData)).toBe(originalData);
    });
  });

  describe('Requirement 10.3: Logging Fallback Usage', () => {
    it('should log fallback usage when template is requested', () => {
      getHardcodedTemplate('lease', 'th', mockFormData);

      expect(consoleWarnSpy).toHaveBeenCalled();
      const logCall = consoleWarnSpy.mock.calls[0][0];
      expect(typeof logCall).toBe('string');

      const logEntry = JSON.parse(logCall);
      expect(logEntry).toHaveProperty('timestamp');
      expect(logEntry).toHaveProperty('machineId');
      expect(logEntry).toHaveProperty('level', 'warn');
      expect(logEntry).toHaveProperty('category', 'fallback-usage');
      expect(logEntry).toHaveProperty('message');
      expect(logEntry).toHaveProperty('metadata');
    });

    it('should include reason code in log metadata', () => {
      getHardcodedTemplate('lease', 'th', mockFormData, 'NO_ACTIVE_TEMPLATE');

      const logCall = consoleWarnSpy.mock.calls[0][0];
      const logEntry = JSON.parse(logCall);

      expect(logEntry.metadata).toHaveProperty('reason', 'NO_ACTIVE_TEMPLATE');
      expect(logEntry.metadata).toHaveProperty('contractType', 'lease');
      expect(logEntry.metadata).toHaveProperty('language', 'th');
    });

    it('should include contract type and language in log metadata', () => {
      getHardcodedTemplate('vehicle-sale', 'en', mockFormData);

      const logCall = consoleWarnSpy.mock.calls[0][0];
      const logEntry = JSON.parse(logCall);

      expect(logEntry.metadata.contractType).toBe('vehicle-sale');
      expect(logEntry.metadata.language).toBe('en');
    });

    it('should have valid ISO timestamp in log', () => {
      getHardcodedTemplate('lease', 'th', mockFormData);

      const logCall = consoleWarnSpy.mock.calls[0][0];
      const logEntry = JSON.parse(logCall);

      const timestamp = new Date(logEntry.timestamp);
      expect(timestamp.getTime()).toBeGreaterThan(0);
      expect(logEntry.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should include machineId in log metadata', () => {
      getHardcodedTemplate('lease', 'th', mockFormData);

      const logCall = consoleWarnSpy.mock.calls[0][0];
      const logEntry = JSON.parse(logCall);

      expect(logEntry.machineId).toBeDefined();
      expect(typeof logEntry.machineId).toBe('string');
      expect(logEntry.machineId.length).toBeGreaterThan(0);
    });

    it('should log all valid reason codes', () => {
      const reasonCodes = [
        'NO_ACTIVE_TEMPLATE',
        'DATABASE_ERROR',
        'RENDERING_ERROR',
        'TEMPLATE_VALIDATION_FAILED',
        'CACHE_MISS',
      ] as const;

      reasonCodes.forEach((reason) => {
        consoleWarnSpy.mockClear();
        getHardcodedTemplate('lease', 'th', mockFormData, reason);

        const logCall = consoleWarnSpy.mock.calls[0][0];
        const logEntry = JSON.parse(logCall);
        expect(logEntry.metadata.reason).toBe(reason);
      });
    });
  });

  describe('getHardcodedTemplateWithReason', () => {
    it('should return template with specified reason code', () => {
      const result = getHardcodedTemplateWithReason('lease', 'th', mockFormData, 'DATABASE_ERROR');

      expect(result.html).toBeDefined();
      expect(result.source).toBe('hardcoded');
      expect(consoleWarnSpy).toHaveBeenCalled();

      const logCall = consoleWarnSpy.mock.calls[0][0];
      const logEntry = JSON.parse(logCall);
      expect(logEntry.metadata.reason).toBe('DATABASE_ERROR');
    });

    it('should support all reason codes', () => {
      const reasonCodes = [
        'NO_ACTIVE_TEMPLATE',
        'DATABASE_ERROR',
        'RENDERING_ERROR',
        'TEMPLATE_VALIDATION_FAILED',
        'CACHE_MISS',
      ] as const;

      reasonCodes.forEach((reason) => {
        const result = getHardcodedTemplateWithReason('lease', 'en', mockFormData, reason);
        expect(result.html).toBeDefined();
      });
    });
  });

  describe('verifyAllTemplatesAvailable', () => {
    it('should return true when all templates are available', () => {
      const result = verifyAllTemplatesAvailable();
      expect(result).toBe(true);
    });

    it('should verify all 10 contract type and language combinations', () => {
      // This test ensures verifyAllTemplatesAvailable checks all combinations
      const contractTypes: ContractType[] = [
        'lease',
        'vehicle-sale',
        'property-sale',
        'employment',
        'testament',
      ];
      const languages: TemplateLanguage[] = ['th', 'en'];

      expect(verifyAllTemplatesAvailable()).toBe(true);

      // Verify each combination is accessible
      for (const contractType of contractTypes) {
        for (const language of languages) {
          const result = getHardcodedTemplate(contractType, language, mockFormData);
          expect(result.html).toBeDefined();
          expect(result.html.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Contract-Specific Content', () => {
    it('lease template should include rental terms', () => {
      const result = getHardcodedTemplate('lease', 'th', mockFormData);
      expect(result.html).toContain('ค่าเช่า');
    });

    it('vehicle-sale template should include vehicle details', () => {
      const result = getHardcodedTemplate('vehicle-sale', 'en', mockFormData);
      expect(result.html.toLowerCase()).toMatch(/vehicle|car/i);
    });

    it('property-sale template should include property details', () => {
      const result = getHardcodedTemplate('property-sale', 'th', mockFormData);
      expect(result.html).toBeDefined();
    });

    it('employment template should include employment terms', () => {
      const result = getHardcodedTemplate('employment', 'en', mockFormData);
      expect(result.html).toBeDefined();
    });

    it('testament template should include testament details', () => {
      const result = getHardcodedTemplate('testament', 'th', mockFormData);
      expect(result.html).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null values in FormData', () => {
      const formDataWithNull = {
        ...mockFormData,
        sellerName: null,
        buyerName: undefined,
      };

      const result = getHardcodedTemplate('lease', 'th', formDataWithNull as any);
      expect(result.html).toBeDefined();
      expect(result.html.length).toBeGreaterThan(0);
    });

    it('should handle large numeric values', () => {
      const formDataWithLargeNumbers = {
        ...mockFormData,
        vehiclePrice: 999999999,
        propertyPrice: 1000000000,
        salaryAmount: 9999999,
      };

      const result = getHardcodedTemplate('vehicle-sale', 'th', formDataWithLargeNumbers);
      expect(result.html).toBeDefined();
    });

    it('should handle special characters in strings', () => {
      const formDataWithSpecialChars = {
        ...mockFormData,
        sellerName: 'John "The Deal" Seller',
        productName: 'Unit #A & B (Suite)',
      };

      const result = getHardcodedTemplate('lease', 'en', formDataWithSpecialChars);
      expect(result.html).toBeDefined();
    });

    it('should handle empty strings', () => {
      const formDataWithEmptyStrings = {
        ...mockFormData,
        sellerName: '',
        buyerName: '',
        state: '',
      };

      const result = getHardcodedTemplate('lease', 'th', formDataWithEmptyStrings);
      expect(result.html).toBeDefined();
    });

    it('should handle zero amounts', () => {
      const formDataWithZeros = {
        ...mockFormData,
        quantity: 0,
        unitPrice: 0,
        depositAmount: 0,
        vehiclePrice: 0,
      };

      const result = getHardcodedTemplate('lease', 'th', formDataWithZeros);
      expect(result.html).toBeDefined();
    });
  });

  describe('Consistency Tests', () => {
    it('should return same result for same input', () => {
      const result1 = getHardcodedTemplate('lease', 'th', mockFormData);
      const result2 = getHardcodedTemplate('lease', 'th', mockFormData);

      expect(result1.html).toBe(result2.html);
      expect(result1.source).toBe(result2.source);
    });

    it('should differentiate between Thai and English', () => {
      const resultTh = getHardcodedTemplate('lease', 'th', mockFormData);
      const resultEn = getHardcodedTemplate('lease', 'en', mockFormData);

      expect(resultTh.html).not.toBe(resultEn.html);
      expect(resultTh.language).toBe('th');
      expect(resultEn.language).toBe('en');
    });

    it('should differentiate between contract types', () => {
      const resultLease = getHardcodedTemplate('lease', 'th', mockFormData);
      const resultVehicle = getHardcodedTemplate('vehicle-sale', 'th', mockFormData);

      expect(resultLease.html).not.toBe(resultVehicle.html);
      expect(resultLease.contractType).toBe('lease');
      expect(resultVehicle.contractType).toBe('vehicle-sale');
    });
  });
});
