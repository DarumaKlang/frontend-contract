// lib/sampleData/contractSampleData.test.pbt.ts
// Property-based and example-based tests for sample data

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  SAMPLE_DATA,
  getSampleData,
  getAvailableContractTypes,
  getAvailableLanguages,
  validateSampleData,
} from './contractSampleData';
import type { ContractType, TemplateLanguage } from '@/lib/types/template';
import type { ContractData } from '@/app/components/contract-generator/types';

// ============================================================================
// Property-Based Tests (PBT)
// ============================================================================

describe('Property 17: Sample Data Schema Conformance', () => {
  describe('Property Test: All contract types have both languages', () => {
    it('should have both Thai (th) and English (en) versions for each contract type', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('lease' as const),
            fc.constant('vehicle-sale' as const),
            fc.constant('property-sale' as const),
            fc.constant('employment' as const),
            fc.constant('testament' as const)
          ),
          (contractType: ContractType) => {
            const sample = SAMPLE_DATA[contractType];
            expect(sample).toBeDefined();
            expect(sample).toHaveProperty('th');
            expect(sample).toHaveProperty('en');
            expect(sample['th']).toBeDefined();
            expect(sample['en']).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property Test: All required fields present with correct types', () => {
    it('should have all required fields with correct types for any contract type and language', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('lease' as const),
            fc.constant('vehicle-sale' as const),
            fc.constant('property-sale' as const),
            fc.constant('employment' as const),
            fc.constant('testament' as const)
          ),
          fc.oneof(
            fc.constant('th' as const),
            fc.constant('en' as const)
          ),
          (contractType: ContractType, language: TemplateLanguage) => {
            const sample = SAMPLE_DATA[contractType][language];
            
            // Check sample data exists
            expect(sample).toBeDefined();
            
            // Check string fields
            const stringFields = [
              'sellerName', 'buyerName', 'productName',
              'sellerAddress', 'buyerAddress',
              'sellerTaxId', 'buyerTaxId',
              'sellerSigner', 'buyerSigner',
              'contractDate', 'deliveryDeadline',
              'unit', 'currency', 'deliveryMethod', 'paymentMethod',
              'state', 'country',
            ];
            
            stringFields.forEach((field) => {
              expect(sample).toHaveProperty(field);
              const value = sample[field as keyof ContractData];
              expect(value).toBeDefined();
              expect(typeof value).toBe('string');
            });

            // Check numeric fields (should be numbers, not strings or undefined)
            const numericFields = [
              'quantity', 'unitPrice', 'depositAmount', 'penaltyRate',
              'vehiclePrice', 'propertyPrice', 'salaryAmount'
            ];
            
            numericFields.forEach((field) => {
              expect(sample).toHaveProperty(field);
              const value = sample[field as keyof ContractData];
              expect(typeof value).toBe('number');
            });

            // Check that monetary fields are actual numbers, not strings
            const monetaryFields = ['unitPrice', 'depositAmount', 'penaltyRate', 'vehiclePrice', 'propertyPrice', 'salaryAmount'];
            monetaryFields.forEach((field) => {
              const value = sample[field as keyof ContractData];
              if (value !== 0 && value !== undefined) {
                expect(typeof value).toBe('number');
                expect(value >= 0).toBe(true);
              }
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property Test: Monetary fields are numbers, not strings', () => {
    it('should have monetary fields as numeric types across all samples', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('lease' as const),
            fc.constant('vehicle-sale' as const),
            fc.constant('property-sale' as const),
            fc.constant('employment' as const),
            fc.constant('testament' as const)
          ),
          fc.oneof(
            fc.constant('th' as const),
            fc.constant('en' as const)
          ),
          (contractType: ContractType, language: TemplateLanguage) => {
            const sample = SAMPLE_DATA[contractType][language];
            const monetaryFields = [
              'unitPrice',
              'depositAmount',
              'penaltyRate',
              'vehiclePrice',
              'propertyPrice',
              'salaryAmount',
            ];

            monetaryFields.forEach((field) => {
              const value = sample[field as keyof ContractData];
              expect(typeof value).toBe('number');
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property Test: Date fields are ISO 8601 format strings', () => {
    it('should have date fields in ISO 8601 format or empty string', () => {
      const iso8601Regex = /^\d{4}-\d{2}-\d{2}$/;
      
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('lease' as const),
            fc.constant('vehicle-sale' as const),
            fc.constant('property-sale' as const),
            fc.constant('employment' as const),
            fc.constant('testament' as const)
          ),
          fc.oneof(
            fc.constant('th' as const),
            fc.constant('en' as const)
          ),
          (contractType: ContractType, language: TemplateLanguage) => {
            const sample = SAMPLE_DATA[contractType][language];
            const dateFields = [
              'contractDate',
              'deliveryDeadline',
              'employmentStartDate',
              'testamentDate',
            ];

            dateFields.forEach((field) => {
              const value = sample[field as keyof ContractData];
              if (value && value !== '') {
                // Should be ISO 8601 format or valid date string
                expect(typeof value).toBe('string');
                expect(iso8601Regex.test(value) || value === '').toBe(true);
              }
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property Test: ContractData interface compliance', () => {
    it('should conform to ContractData interface for all samples', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('lease' as const),
            fc.constant('vehicle-sale' as const),
            fc.constant('property-sale' as const),
            fc.constant('employment' as const),
            fc.constant('testament' as const)
          ),
          fc.oneof(
            fc.constant('th' as const),
            fc.constant('en' as const)
          ),
          (contractType: ContractType, language: TemplateLanguage) => {
            const sample = SAMPLE_DATA[contractType][language];

            // All properties of ContractData should exist in sample
            const requiredProperties: (keyof ContractData)[] = [
              'sellerName', 'sellerAddress', 'sellerTaxId', 'sellerSigner',
              'buyerName', 'buyerAddress', 'buyerTaxId', 'buyerSigner',
              'productName', 'quantity', 'unit', 'unitPrice', 'currency',
              'deliveryDeadline', 'deliveryMethod', 'paymentMethod',
              'depositAmount', 'penaltyRate', 'contractDate',
              'state', 'country',
              'vehicleBrand', 'vehicleModel', 'vehicleYear', 'vehiclePlate',
              'vehicleColor', 'vehicleMileage', 'vehiclePrice',
              'propertyCategory', 'propertyAddress', 'propertyArea', 'propertyFloor',
              'propertyPrice',
              'employmentPosition', 'employmentStartDate', 'salaryAmount',
              'workLocation', 'employmentBenefits', 'employmentTerm',
              'testamentDate', 'testamentBeneficiaryName', 'testamentExecutorName',
              'testamentWitnesses', 'testamentAssets', 'testamentNotes',
            ];

            requiredProperties.forEach((prop) => {
              expect(sample).toHaveProperty(prop);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});

// ============================================================================
// Example-Based Tests
// ============================================================================

describe('Sample Data - Example-Based Tests', () => {
  describe('Test all 10 sample data combinations individually', () => {
    it('should have valid lease sample data in Thai', () => {
      const sample = SAMPLE_DATA['lease']['th'];
      expect(sample).toBeDefined();
      expect(sample.sellerName).toBe('นายสมชาย ใจดี');
      expect(sample.buyerName).toBe('นางสาวสมหญิง รักเรียน');
      expect(sample.unitPrice).toBe(15000);
      expect(typeof sample.unitPrice).toBe('number');
      expect(sample.depositAmount).toBe(30000);
      expect(typeof sample.depositAmount).toBe('number');
    });

    it('should have valid lease sample data in English', () => {
      const sample = SAMPLE_DATA['lease']['en'];
      expect(sample).toBeDefined();
      expect(sample.sellerName).toBe('Somchai Jaidee');
      expect(sample.buyerName).toBe('Somying Rakearen');
      expect(sample.unitPrice).toBe(15000);
      expect(typeof sample.unitPrice).toBe('number');
    });

    it('should have valid vehicle-sale sample data in Thai', () => {
      const sample = SAMPLE_DATA['vehicle-sale']['th'];
      expect(sample).toBeDefined();
      expect(sample.vehicleBrand).toBe('Toyota');
      expect(sample.vehicleModel).toBe('Camry 2.5 G');
      expect(sample.vehiclePrice).toBe(1250000);
      expect(typeof sample.vehiclePrice).toBe('number');
    });

    it('should have valid vehicle-sale sample data in English', () => {
      const sample = SAMPLE_DATA['vehicle-sale']['en'];
      expect(sample).toBeDefined();
      expect(sample.vehicleBrand).toBe('Toyota');
      expect(sample.vehiclePrice).toBe(1250000);
      expect(typeof sample.vehiclePrice).toBe('number');
    });

    it('should have valid property-sale sample data in Thai', () => {
      const sample = SAMPLE_DATA['property-sale']['th'];
      expect(sample).toBeDefined();
      expect(sample.propertyCategory).toBe('บ้านแฝด');
      expect(sample.propertyPrice).toBe(4500000);
      expect(typeof sample.propertyPrice).toBe('number');
    });

    it('should have valid property-sale sample data in English', () => {
      const sample = SAMPLE_DATA['property-sale']['en'];
      expect(sample).toBeDefined();
      expect(sample.propertyCategory).toBe('Twin House');
      expect(sample.propertyPrice).toBe(4500000);
      expect(typeof sample.propertyPrice).toBe('number');
    });

    it('should have valid employment sample data in Thai', () => {
      const sample = SAMPLE_DATA['employment']['th'];
      expect(sample).toBeDefined();
      expect(sample.employmentPosition).toBe('ผู้จัดการฝ่ายปฏิบัติการ');
      expect(sample.salaryAmount).toBe(60000);
      expect(typeof sample.salaryAmount).toBe('number');
    });

    it('should have valid employment sample data in English', () => {
      const sample = SAMPLE_DATA['employment']['en'];
      expect(sample).toBeDefined();
      expect(sample.employmentPosition).toBe('Operations Manager');
      expect(sample.salaryAmount).toBe(60000);
      expect(typeof sample.salaryAmount).toBe('number');
    });

    it('should have valid testament sample data in Thai', () => {
      const sample = SAMPLE_DATA['testament']['th'];
      expect(sample).toBeDefined();
      expect(sample.testamentAssets).toContain('บ้าน');
      expect(typeof sample.testamentAssets).toBe('string');
    });

    it('should have valid testament sample data in English', () => {
      const sample = SAMPLE_DATA['testament']['en'];
      expect(sample).toBeDefined();
      expect(sample.testamentAssets).toContain('House');
      expect(typeof sample.testamentAssets).toBe('string');
    });
  });

  describe('getSampleData() helper function', () => {
    it('should return correct data for lease contract in Thai', () => {
      const data = getSampleData('lease', 'th');
      expect(data).toBeDefined();
      expect(data.sellerName).toBe('นายสมชาย ใจดี');
    });

    it('should return correct data for vehicle-sale in English', () => {
      const data = getSampleData('vehicle-sale', 'en');
      expect(data).toBeDefined();
      expect(data.vehicleBrand).toBe('Toyota');
    });

    it('should throw error for invalid contract type', () => {
      expect(() => {
        getSampleData('invalid-type' as ContractType, 'th');
      }).toThrow();
    });

    it('should throw error for invalid language', () => {
      expect(() => {
        getSampleData('lease', 'fr' as TemplateLanguage);
      }).toThrow();
    });

    it('should return all 5 contract types', () => {
      const types: ContractType[] = ['lease', 'vehicle-sale', 'property-sale', 'employment', 'testament'];
      types.forEach((type) => {
        const data = getSampleData(type, 'th');
        expect(data).toBeDefined();
      });
    });
  });

  describe('getAvailableContractTypes() helper function', () => {
    it('should return all 5 contract types', () => {
      const types = getAvailableContractTypes();
      expect(types).toHaveLength(5);
      expect(types).toContain('lease');
      expect(types).toContain('vehicle-sale');
      expect(types).toContain('property-sale');
      expect(types).toContain('employment');
      expect(types).toContain('testament');
    });

    it('should return array of ContractType', () => {
      const types = getAvailableContractTypes();
      expect(Array.isArray(types)).toBe(true);
      types.forEach((type) => {
        expect(['lease', 'vehicle-sale', 'property-sale', 'employment', 'testament']).toContain(type);
      });
    });
  });

  describe('getAvailableLanguages() helper function', () => {
    it('should return both th and en for all contract types', () => {
      const contractTypes: ContractType[] = ['lease', 'vehicle-sale', 'property-sale', 'employment', 'testament'];
      
      contractTypes.forEach((type) => {
        const languages = getAvailableLanguages(type);
        expect(languages).toHaveLength(2);
        expect(languages).toContain('th');
        expect(languages).toContain('en');
      });
    });

    it('should return th and en for lease contract', () => {
      const languages = getAvailableLanguages('lease');
      expect(languages).toEqual(['th', 'en']);
    });

    it('should return th and en for vehicle-sale contract', () => {
      const languages = getAvailableLanguages('vehicle-sale');
      expect(languages).toContain('th');
      expect(languages).toContain('en');
    });
  });

  describe('validateSampleData() helper function', () => {
    it('should identify missing required fields', () => {
      const missing = validateSampleData('lease', 'th');
      // With the current sample data, all required fields should be present
      expect(Array.isArray(missing)).toBe(true);
      expect(missing).toEqual([]);
    });

    it('should return empty array if all required fields are present in lease', () => {
      const missing = validateSampleData('lease', 'th');
      expect(missing).toHaveLength(0);
    });

    it('should return empty array if all required fields are present in vehicle-sale', () => {
      const missing = validateSampleData('vehicle-sale', 'en');
      expect(missing).toHaveLength(0);
    });

    it('should check for required fields across all contract types and languages', () => {
      const contractTypes: ContractType[] = ['lease', 'vehicle-sale', 'property-sale', 'employment', 'testament'];
      const languages: TemplateLanguage[] = ['th', 'en'];

      contractTypes.forEach((type) => {
        languages.forEach((lang) => {
          const missing = validateSampleData(type, lang);
          expect(Array.isArray(missing)).toBe(true);
          // All sample data should be valid
          expect(missing).toHaveLength(0);
        });
      });
    });
  });

  describe('Sample data completeness and correctness', () => {
    it('should have non-empty sellerName and buyerName for all samples', () => {
      const contractTypes: ContractType[] = ['lease', 'vehicle-sale', 'property-sale', 'employment', 'testament'];
      const languages: TemplateLanguage[] = ['th', 'en'];

      contractTypes.forEach((type) => {
        languages.forEach((lang) => {
          const sample = SAMPLE_DATA[type][lang];
          expect(sample.sellerName).toBeTruthy();
          expect(sample.buyerName).toBeTruthy();
          expect(sample.sellerName.length > 0).toBe(true);
          expect(sample.buyerName.length > 0).toBe(true);
        });
      });
    });

    it('should have valid dates in ISO format or empty', () => {
      const iso8601Regex = /^\d{4}-\d{2}-\d{2}$/;
      const contractTypes: ContractType[] = ['lease', 'vehicle-sale', 'property-sale', 'employment', 'testament'];
      const languages: TemplateLanguage[] = ['th', 'en'];

      contractTypes.forEach((type) => {
        languages.forEach((lang) => {
          const sample = SAMPLE_DATA[type][lang];
          if (sample.contractDate) {
            expect(iso8601Regex.test(sample.contractDate)).toBe(true);
          }
        });
      });
    });

    it('should have positive monetary amounts', () => {
      const contractTypes: ContractType[] = ['lease', 'vehicle-sale', 'property-sale', 'employment', 'testament'];
      const languages: TemplateLanguage[] = ['th', 'en'];
      const monetaryFields = ['unitPrice', 'depositAmount', 'penaltyRate', 'vehiclePrice', 'propertyPrice', 'salaryAmount'];

      contractTypes.forEach((type) => {
        languages.forEach((lang) => {
          const sample = SAMPLE_DATA[type][lang];
          monetaryFields.forEach((field) => {
            const value = sample[field as keyof ContractData];
            expect(typeof value).toBe('number');
            expect(value >= 0).toBe(true);
          });
        });
      });
    });

    it('should have contract-type-specific fields populated correctly', () => {
      // Lease should have rental info
      const leaseTh = SAMPLE_DATA['lease']['th'];
      expect(leaseTh.propertyAddress).toBeTruthy();
      expect(leaseTh.depositAmount).toBeGreaterThan(0);

      // Vehicle sale should have vehicle info
      const vehicleTh = SAMPLE_DATA['vehicle-sale']['th'];
      expect(vehicleTh.vehicleBrand).toBeTruthy();
      expect(vehicleTh.vehiclePrice).toBeGreaterThan(0);

      // Property sale should have property info
      const propertyTh = SAMPLE_DATA['property-sale']['th'];
      expect(propertyTh.propertyCategory).toBeTruthy();
      expect(propertyTh.propertyPrice).toBeGreaterThan(0);

      // Employment should have employment info
      const employmentTh = SAMPLE_DATA['employment']['th'];
      expect(employmentTh.employmentPosition).toBeTruthy();
      expect(employmentTh.salaryAmount).toBeGreaterThan(0);

      // Testament should have testament info
      const testamentTh = SAMPLE_DATA['testament']['th'];
      expect(testamentTh.testamentAssets).toBeTruthy();
    });
  });
});

/**
 * Validates: Requirements 7.2
 * Feature: database-template-integration
 * Property 17: Sample Data Schema Conformance
 */
