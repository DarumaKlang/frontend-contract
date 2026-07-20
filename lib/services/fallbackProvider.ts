/**
 * Fallback Provider Service
 * 
 * Provides hardcoded templates when database templates are unavailable.
 * Wraps existing contractTemplates.ts functions and logs fallback usage.
 * 
 * Validates Requirements: 5.3, 5.7, 10.1, 10.2, 10.3
 */

import type { ContractType, TemplateLanguage } from '@/lib/types/template';
import { generateContractHtml } from '@/app/components/contract-generator/templates/contractTemplates';
import type { ContractData } from '@/app/components/contract-generator/types';
import { formatDisplayDate } from '@/app/components/contract-generator/templates/templateHelpers';

/**
 * Fallback template interface - represents a hardcoded template
 * 
 * Requirements 5.3:
 * - html: string (rendered HTML)
 * - source: 'hardcoded' (literal)
 * - contractType: ContractType
 * - language: TemplateLanguage
 */
export interface FallbackTemplate {
  html: string;
  source: 'hardcoded';
  contractType: ContractType;
  language: TemplateLanguage;
}

/**
 * Fallback reason codes for logging
 */
export type FallbackReasonCode = 
  | 'NO_ACTIVE_TEMPLATE'
  | 'DATABASE_ERROR'
  | 'RENDERING_ERROR'
  | 'TEMPLATE_VALIDATION_FAILED'
  | 'CACHE_MISS';

/**
 * Log entry for fallback usage
 */
interface FallbackLogEntry {
  timestamp: string;
  machineId: string;
  level: 'warn';
  category: 'fallback-usage';
  message: string;
  metadata: {
    contractType: ContractType;
    language: TemplateLanguage;
    reason: FallbackReasonCode;
  };
}

/**
 * Helper function to format money values
 * Converts numeric values to formatted currency strings
 * 
 * @param value - Numeric value to format
 * @returns Formatted currency string
 */
function formatMoney(value: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Helper function to convert Thai Baht amount to Thai text
 * Converts numeric values to Thai Baht text representation
 * 
 * @param value - Numeric value to convert
 * @returns Thai Baht text representation
 */
function thaiBahtText(value: number): string {
  const bahtUnits = ['', 'พัน', 'แสน', 'ล้าน', 'สิบล้าน', 'ร้อยล้าน', 'พันล้าน'];
  const ones = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const tens = ['', 'สิบ', 'ยี่สิบ', 'สามสิบ', 'สี่สิบ', 'ห้าสิบ', 'หกสิบ', 'เจ็ดสิบ', 'แปดสิบ', 'เก้าสิบ'];

  if (value === 0) return 'ศูนย์บาท';

  let result = '';
  let digitIndex = 0;

  while (value > 0) {
    const chunk = value % 1000;
    if (chunk !== 0) {
      let chunkText = '';
      const hundreds = Math.floor(chunk / 100);
      const remainder = chunk % 100;

      if (hundreds > 0) {
        chunkText += ones[hundreds] + 'ร้อย';
      }

      const ten = Math.floor(remainder / 10);
      const one = remainder % 10;

      if (ten > 0) {
        if (ten === 1) {
          chunkText += 'สิบ';
        } else if (ten === 2) {
          chunkText += 'ยี่สิบ';
        } else {
          chunkText += ones[ten] + 'สิบ';
        }
      }

      if (one > 0) {
        if (one === 1 && ten === 0 && hundreds === 0 && digitIndex === 0) {
          chunkText += 'หนึ่ง';
        } else {
          chunkText += ones[one];
        }
      }

      result = chunkText + (bahtUnits[digitIndex] || '') + result;
    }

    value = Math.floor(value / 1000);
    digitIndex++;
  }

  return result + 'บาท';
}

/**
 * Logs fallback usage with structured JSON format
 * 
 * @param contractType - Type of contract
 * @param language - Language of template
 * @param reason - Reason code for fallback usage
 */
function logFallbackUsage(
  contractType: ContractType,
  language: TemplateLanguage,
  reason: FallbackReasonCode
): void {
  const machineId = process.env.MACHINE_ID || '859ce793f7ba2ce7bb7651a979df1b1147968b804950b29cb46511dc1ca2e679';
  
  const logEntry: FallbackLogEntry = {
    timestamp: new Date().toISOString(),
    machineId,
    level: 'warn',
    category: 'fallback-usage',
    message: `Using hardcoded template fallback: ${reason}`,
    metadata: {
      contractType,
      language,
      reason,
    },
  };

  // Log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.warn(JSON.stringify(logEntry, null, 2));
  } else {
    // In production, you would send to your logging service
    console.warn(JSON.stringify(logEntry));
  }
}

/**
 * Converts FormData to ContractData type for compatibility with generateContractHtml
 * 
 * @param formData - Input form data
 * @returns ContractData object
 */
function normalizeFormData(formData: Record<string, any>): ContractData {
  return {
    sellerName: formData.sellerName || '',
    sellerAddress: formData.sellerAddress || '',
    sellerTaxId: formData.sellerTaxId || '',
    sellerSigner: formData.sellerSigner || '',
    buyerName: formData.buyerName || '',
    buyerAddress: formData.buyerAddress || '',
    buyerTaxId: formData.buyerTaxId || '',
    buyerSigner: formData.buyerSigner || '',
    productName: formData.productName || '',
    quantity: formData.quantity || 0,
    unit: formData.unit || '',
    unitPrice: formData.unitPrice || 0,
    currency: formData.currency || 'THB',
    deliveryDeadline: formData.deliveryDeadline || '',
    deliveryMethod: formData.deliveryMethod || '',
    paymentMethod: formData.paymentMethod || '',
    depositAmount: formData.depositAmount || 0,
    penaltyRate: formData.penaltyRate || 0,
    contractDate: formData.contractDate || '',
    state: formData.state || '',
    country: formData.country || '',
    vehicleBrand: formData.vehicleBrand || '',
    vehicleModel: formData.vehicleModel || '',
    vehicleYear: formData.vehicleYear || '',
    vehiclePlate: formData.vehiclePlate || '',
    vehicleColor: formData.vehicleColor || '',
    vehicleMileage: formData.vehicleMileage || '',
    vehiclePrice: formData.vehiclePrice || 0,
    propertyCategory: formData.propertyCategory || '',
    propertyAddress: formData.propertyAddress || '',
    propertyArea: formData.propertyArea || '',
    propertyFloor: formData.propertyFloor || '',
    propertyPrice: formData.propertyPrice || 0,
    employmentPosition: formData.employmentPosition || '',
    employmentStartDate: formData.employmentStartDate || '',
    salaryAmount: formData.salaryAmount || 0,
    workLocation: formData.workLocation || '',
    employmentBenefits: formData.employmentBenefits || '',
    employmentTerm: formData.employmentTerm || '',
    testamentDate: formData.testamentDate || '',
    testamentBeneficiaryName: formData.testamentBeneficiaryName || '',
    testamentExecutorName: formData.testamentExecutorName || '',
    testamentWitnesses: formData.testamentWitnesses || '',
    testamentAssets: formData.testamentAssets || '',
    testamentNotes: formData.testamentNotes || '',
  };
}

/**
 * Gets hardcoded template for a given contract type and language
 * 
 * Wraps existing contractTemplates.ts functions to provide fallback templates.
 * Supports all 5 contract types (lease, vehicle-sale, property-sale, employment, testament)
 * Supports both languages (th, en) - 10 total combinations
 * Logs fallback usage with reason codes
 * 
 * Requirements 5.3, 5.7, 10.1, 10.2, 10.3:
 * - Supports all 5 contract types
 * - Supports both languages (th, en)
 * - Returns FallbackTemplate interface
 * - Logs fallback usage with reason codes
 * - Maintains FormData immutability
 * 
 * @param contractType - Type of contract (lease, vehicle-sale, property-sale, employment, testament)
 * @param language - Template language (th, en)
 * @param formData - Form data for rendering
 * @param reason - Reason code for fallback usage (default: NO_ACTIVE_TEMPLATE)
 * @returns FallbackTemplate with rendered HTML
 */
export function getHardcodedTemplate(
  contractType: ContractType,
  language: TemplateLanguage,
  formData: Record<string, any>,
  reason: FallbackReasonCode = 'NO_ACTIVE_TEMPLATE'
): FallbackTemplate {
  // Log fallback usage
  logFallbackUsage(contractType, language, reason);

  // Normalize FormData to ensure type compatibility
  const normalizedFormData = normalizeFormData(formData);

  // Render HTML using existing contractTemplates.ts function
  const html = generateContractHtml({
    contractType,
    appLanguage: language,
    formData: normalizedFormData,
    formatMoney,
    thaiBahtText,
  });

  return {
    html,
    source: 'hardcoded',
    contractType,
    language,
  };
}

/**
 * Gets hardcoded template by reason code
 * Helper function to get fallback template with specific reason
 * 
 * @param contractType - Type of contract
 * @param language - Template language
 * @param formData - Form data for rendering
 * @param reason - Specific reason for fallback
 * @returns FallbackTemplate
 */
export function getHardcodedTemplateWithReason(
  contractType: ContractType,
  language: TemplateLanguage,
  formData: Record<string, any>,
  reason: FallbackReasonCode
): FallbackTemplate {
  return getHardcodedTemplate(contractType, language, formData, reason);
}

/**
 * Verifies that hardcoded templates are available for all contract types and languages
 * Used for validation and coverage checking
 * 
 * @returns boolean indicating if all templates are available
 */
export function verifyAllTemplatesAvailable(): boolean {
  const contractTypes: ContractType[] = ['lease', 'vehicle-sale', 'property-sale', 'employment', 'testament'];
  const languages: TemplateLanguage[] = ['th', 'en'];

  try {
    for (const contractType of contractTypes) {
      for (const language of languages) {
        const mockFormData = {
          sellerName: 'Test Seller',
          buyerName: 'Test Buyer',
          contractDate: new Date().toISOString().split('T')[0],
          country: 'Thailand',
          state: 'Bangkok',
        };

        // Attempt to get template - will throw if unavailable
        getHardcodedTemplate(contractType, language, mockFormData);
      }
    }
    return true;
  } catch (error) {
    console.error('Template verification failed:', error);
    return false;
  }
}
