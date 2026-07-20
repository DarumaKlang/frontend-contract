// lib/services/variableMapper.ts
// Service for mapping FormData to template rendering context with type conversions

import type { ContractData } from '@/app/components/contract-generator/types';
import type { TemplateVariable } from '@/lib/types/template';
import { getAvailableHelpers } from '@/lib/templateEngine';

/**
 * Result of variable mapping operation
 */
export interface MappingResult {
  context: Record<string, any>;
  warnings: string[];
}

/**
 * Monetary field keywords to detect fields that need numeric type preservation
 * These are explicit field names known to contain monetary values
 */
const MONETARY_FIELD_NAMES = new Set([
  'unitprice',
  'vehicleprice',
  'propertyprice',
  'salaryamount',
  'depositamount',
  'rentalfee',
  'charge',
  'cost',
  'wage',
  'payment',
  'amount',
]);

/**
 * Check if a field name is a monetary field
 * Uses exact matching to avoid false positives (e.g., "paymentMethod" is not monetary)
 */
function isMonetaryField(fieldName: string): boolean {
  return MONETARY_FIELD_NAMES.has(fieldName.toLowerCase());
}

/**
 * Get Handlebars helper functions for rendering context
 */
function getHandlebarsHelpers(): Record<string, any> {
  // Import helpers from template engine
  const helpers: Record<string, any> = {
    // Math helpers
    add: (a: number, b: number) => a + b,
    subtract: (a: number, b: number) => a - b,
    multiply: (a: number, b: number) => a * b,
    divide: (a: number, b: number) => (b !== 0 ? a / b : 0),

    // String helpers
    uppercase: (str: string) => str?.toUpperCase() || '',
    lowercase: (str: string) => str?.toLowerCase() || '',
    capitalize: (str: string) => {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    // Date helpers
    formatDate: (date: any, language: string = 'th'): string => {
      if (!date) return '';
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (language === 'th') {
        return new Intl.DateTimeFormat('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(dateObj);
      }
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(dateObj);
    },

    // Money helpers
    formatMoney: (amount: any): string => {
      const num = typeof amount === 'string' ? parseFloat(amount) : amount;
      if (isNaN(num)) return '0';
      return new Intl.NumberFormat('th-TH', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(num);
    },

    // Thai Baht text helper
    thaiBahtText: (amount: any): string => {
      const num = typeof amount === 'string' ? parseFloat(amount) : amount;
      if (isNaN(num) || num < 0) return 'ศูนย์บาทถ้วน';

      const thaiNumbers = [
        'ศูนย์',
        'หนึ่ง',
        'สอง',
        'สาม',
        'สี่',
        'ห้า',
        'หก',
        'เจ็ด',
        'แปด',
        'เก้า',
      ];
      const thaiUnits = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

      const baht = Math.floor(num);
      const satang = Math.round((num - baht) * 100);

      let result = '';

      // Convert baht part
      if (baht === 0) {
        result = 'ศูนย์บาท';
      } else {
        const bahtStr = baht.toString();
        const len = bahtStr.length;

        for (let i = 0; i < len; i++) {
          const digit = parseInt(bahtStr[i]);
          const position = len - i - 1;

          if (digit === 0) continue;

          if (position === 1 && digit === 2) {
            result += 'ยี่สิบ';
          } else if (position === 1 && digit === 1) {
            result += 'สิบ';
          } else if (position === 0 && digit === 1 && len > 1) {
            result += 'เอ็ด';
          } else {
            result += thaiNumbers[digit] + thaiUnits[position];
          }
        }
        result += 'บาท';
      }

      // Convert satang part
      if (satang === 0) {
        result += 'ถ้วน';
      } else {
        result += helpers.formatMoney(satang) + 'สตางค์';
      }

      return result;
    },

    // Comparison helpers
    eq: (a: any, b: any) => a === b,
    ne: (a: any, b: any) => a !== b,
    lt: (a: any, b: any) => a < b,
    gt: (a: any, b: any) => a > b,
    lte: (a: any, b: any) => a <= b,
    gte: (a: any, b: any) => a >= b,

    // Logical helpers
    and: (a: any, b: any) => a && b,
    or: (a: any, b: any) => a || b,
    not: (a: any) => !a,
  };

  return helpers;
}

/**
 * Convert a value to numeric type if needed (for monetary fields)
 */
function convertMonetaryValue(value: any, fieldName: string): any {
  if (!isMonetaryField(fieldName)) {
    return value;
  }

  // Preserve null/undefined
  if (value === null || value === undefined) {
    return value;
  }

  // If already a number, return as-is
  if (typeof value === 'number') {
    return value;
  }

  // Try to convert string to number
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }

  // Return original value if conversion fails
  return value;
}

/**
 * Transform FormData to flat key-value pairs for Handlebars rendering
 * Applies type conversions for monetary fields
 * Includes Handlebars helper functions in the context
 *
 * @param formData - Form data from Contract Generator
 * @param templateVariables - Optional template variable definitions for validation
 * @returns MappingResult with context object and warnings array
 */
export function mapFormDataToContext(
  formData: ContractData,
  templateVariables: TemplateVariable[] = []
): MappingResult {
  const context: Record<string, any> = {};
  const warnings: string[] = [];

  // Extract all fields from FormData and apply type conversions
  for (const [key, value] of Object.entries(formData)) {
    if (value !== undefined) {
      context[key] = convertMonetaryValue(value, key);
    }
  }

  // Include Handlebars helper functions in the context
  const helpers = getHandlebarsHelpers();
  context.helpers = helpers;

  // Validate completeness if template variables provided
  if (templateVariables.length > 0) {
    const missingVariables = validateVariableMapping(context, templateVariables);
    warnings.push(...missingVariables);
  }

  return {
    context,
    warnings,
  };
}

/**
 * Validate that required template variables are present in the mapping context
 * Detects missing required variables and logs warnings for type mismatches
 *
 * @param context - The rendering context from mapFormDataToContext
 * @param templateVariables - Template variable definitions specifying requirements
 * @returns Array of warning messages for missing or mismatched variables
 */
export function validateVariableMapping(
  context: Record<string, any>,
  templateVariables: TemplateVariable[]
): string[] {
  const warnings: string[] = [];
  const contextKeys = new Set(Object.keys(context));

  for (const variable of templateVariables) {
    const { name, required, type } = variable;

    // Check if required variable is missing
    if (required && !contextKeys.has(name)) {
      warnings.push(`Missing required variable: ${name}`);
      continue;
    }

    // Check if variable exists in context
    if (contextKeys.has(name)) {
      const value = context[name];
      const actualType = typeof value;

      // Skip validation for null/undefined in optional fields
      if ((value === null || value === undefined) && !required) {
        continue;
      }

      // Validate type compatibility
      if (type === 'number' && value !== null && value !== undefined) {
        if (typeof value !== 'number') {
          warnings.push(
            `Type mismatch for variable '${name}': expected ${type}, got ${actualType}`
          );
        }
      } else if (type === 'string' && value !== null && value !== undefined) {
        if (typeof value !== 'string') {
          warnings.push(
            `Type mismatch for variable '${name}': expected ${type}, got ${actualType}`
          );
        }
      } else if (type === 'date' && value !== null && value !== undefined) {
        if (!(value instanceof Date) && typeof value !== 'string') {
          warnings.push(
            `Type mismatch for variable '${name}': expected ${type}, got ${actualType}`
          );
        }
      } else if (type === 'boolean' && value !== null && value !== undefined) {
        if (typeof value !== 'boolean') {
          warnings.push(
            `Type mismatch for variable '${name}': expected ${type}, got ${actualType}`
          );
        }
      }
    }
  }

  return warnings;
}
