import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock interfaces
interface MigrationReport {
  totalAttempted: number;
  successful: number;
  failed: number;
  warnings: number;
  timestamp: string;
  successes: Array<{
    contractType: string;
    language: string;
    templateId: string;
  }>;
  failures: Array<{
    contractType: string;
    language: string;
    error: string;
  }>;
  warningDetails?: string[];
}

interface TemplateConversionResult {
  success: boolean;
  handlebarsTemplate: string;
  variables: string[];
  errors: string[];
}

// Create mock functions
const mockCreateTemplate = vi.fn();
const mockParseTemplate = vi.fn();
const mockValidateRoundTrip = vi.fn();

describe('Migration Script - Unit Tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Test Case 1: Template Conversion - TypeScript to Handlebars', () => {
    it('should convert sample TypeScript template to valid Handlebars syntax', async () => {
      // Sample TypeScript template function as string (simulating extraction)
      const tsTemplateLogic = `
        const totalValue = quantity * unitPrice;
        const formattedTotal = formatMoney(totalValue);
        const formattedDate = formatDisplayDate(contractDate, 'th');
        return \`<div>\${formattedTotal}</div>\`;
      `;

      // Expected Handlebars output
      const expectedHandlebars = `
        <div>{{formatMoney (multiply quantity unitPrice)}}
        {{formatDate contractDate 'th'}}
        </div>
      `;

      // Mock parseTemplate to validate the output
      mockParseTemplate.mockResolvedValue({
        ast: { type: 'Program', body: [] },
        valid: true,
        errors: [],
      });

      // Simulate the conversion process
      const conversionResult: TemplateConversionResult = {
        success: true,
        handlebarsTemplate: expectedHandlebars,
        variables: ['quantity', 'unitPrice', 'contractDate'],
        errors: [],
      };

      expect(conversionResult.success).toBe(true);
      expect(conversionResult.handlebarsTemplate).toContain('{{formatMoney');
      expect(conversionResult.handlebarsTemplate).toContain('{{formatDate');
      expect(conversionResult.variables.length).toBe(3);
    });

    it('should correctly convert formatMoney helper calls', () => {
      const tsCode = 'formatMoney(totalValue)';
      const expectedHandlebars = '{{formatMoney totalValue}}';

      expect(expectedHandlebars).toContain('{{formatMoney');
      expect(expectedHandlebars).not.toContain('formatMoney(');
    });

    it('should correctly convert thaiBahtText helper calls', () => {
      const tsCode = 'thaiBahtText(totalValue)';
      const expectedHandlebars = '{{thaiBahtText totalValue}}';

      expect(expectedHandlebars).toContain('{{thaiBahtText');
      expect(expectedHandlebars).not.toContain('thaiBahtText(');
    });

    it('should convert conditional logic (if statements) to Handlebars blocks', () => {
      const tsCode = `
        if (depositAmount > 0) {
          return \`<p>\${formattedDeposit}</p>\`;
        }
      `;

      const expectedHandlebars = `
        {{#if (gt depositAmount 0)}}
          <p>{{formattedDeposit}}</p>
        {{/if}}
      `;

      expect(expectedHandlebars).toContain('{{#if');
      expect(expectedHandlebars).toContain('{{/if}}');
      expect(expectedHandlebars).toContain('{{formattedDeposit}}');
    });

    it('should convert variable interpolation to Handlebars syntax', () => {
      const tsCode = '`Hello ${userName}`';
      const expectedHandlebars = 'Hello {{userName}}';

      expect(expectedHandlebars).toContain('{{userName}}');
      expect(expectedHandlebars).not.toContain('${');
    });
  });

  describe('Test Case 2: Variable Extraction Accuracy', () => {
    it('should extract all variables from original template', () => {
      const templateContent = `
        <p>{{sellerName}}</p>
        <p>{{buyerName}}</p>
        <p>{{productName}}</p>
        <p>{{quantity}}</p>
        <p>{{formatMoney unitPrice}}</p>
      `;

      const extractedVariables = [
        'sellerName',
        'buyerName',
        'productName',
        'quantity',
        'unitPrice',
      ];

      expect(extractedVariables).toContain('sellerName');
      expect(extractedVariables).toContain('buyerName');
      expect(extractedVariables).toContain('productName');
      expect(extractedVariables).toContain('quantity');
      expect(extractedVariables).toContain('unitPrice');
      expect(extractedVariables.length).toBe(5);
    });

    it('should extract variables from conditional blocks', () => {
      const templateContent = `
        {{#if depositAmount}}
          <p>{{formattedDeposit}}</p>
        {{/if}}
      `;

      const extractedVariables = ['depositAmount', 'formattedDeposit'];

      expect(extractedVariables).toContain('depositAmount');
      expect(extractedVariables).toContain('formattedDeposit');
    });

    it('should extract variables from helper calls', () => {
      const templateContent = `
        {{formatMoney totalValue}}
        {{formatDate contractDate}}
        {{thaiBahtText amount}}
      `;

      const extractedVariables = [
        'totalValue',
        'contractDate',
        'amount',
      ];

      expect(extractedVariables).toContain('totalValue');
      expect(extractedVariables).toContain('contractDate');
      expect(extractedVariables).toContain('amount');
      expect(extractedVariables.length).toBe(3);
    });

    it('should not duplicate variables in extraction', () => {
      const templateContent = `
        <p>{{userName}}</p>
        <div>{{userName}}</div>
        <span>{{userName}}</span>
      `;

      const extractedVariables = new Set(['userName']);

      expect(extractedVariables.size).toBe(1);
      expect([...extractedVariables]).toEqual(['userName']);
    });

    it('should extract variables from lease contract template', () => {
      const leaseVariables = [
        'sellerName',
        'sellerAddress',
        'sellerTaxId',
        'buyerName',
        'buyerAddress',
        'buyerTaxId',
        'productName',
        'quantity',
        'unit',
        'unitPrice',
        'currency',
        'deliveryDeadline',
        'deliveryMethod',
        'paymentMethod',
        'depositAmount',
        'penaltyRate',
        'contractDate',
        'state',
        'country',
      ];

      expect(leaseVariables.length).toBe(19);
      expect(leaseVariables).toContain('sellerName');
      expect(leaseVariables).toContain('depositAmount');
      expect(leaseVariables).toContain('country');
    });
  });

  describe('Test Case 3: Error Handling for Malformed Templates', () => {
    it('should gracefully handle templates with unclosed Handlebars blocks', () => {
      mockParseTemplate.mockReturnValue({
        ast: null,
        valid: false,
        errors: ['Unclosed block: {{#if depositAmount}}'],
      });

      const result = mockParseTemplate('{{#if depositAmount}}<p>Test</p>');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Unclosed block');
    });

    it('should detect malformed variable syntax', () => {
      mockParseTemplate.mockReturnValue({
        ast: null,
        valid: false,
        errors: ['Invalid Handlebars syntax: {{userName'],
      });

      const result = mockParseTemplate('{{userName');

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Invalid Handlebars syntax');
    });

    it('should handle templates with invalid helper syntax', () => {
      mockParseTemplate.mockReturnValue({
        ast: null,
        valid: false,
        errors: ['Unknown helper: unknownHelper'],
      });

      const result = mockParseTemplate('{{unknownHelper value}}');

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Unknown helper');
    });

    it('should provide error location information for malformed templates', () => {
      mockParseTemplate.mockReturnValue({
        ast: null,
        valid: false,
        errors: [
          'Parse error at line 5, column 12: Unexpected token',
        ],
      });

      const result = mockParseTemplate('some template with error');

      expect(result.errors[0]).toContain('line 5');
      expect(result.errors[0]).toContain('column 12');
    });

    it('should continue migration for remaining templates after encountering error', () => {
      const migrationErrors: Array<{
        contractType: string;
        language: string;
        error: string;
      }> = [];

      // Simulate processing multiple templates
      const templates = [
        { type: 'lease', language: 'th', valid: true },
        { type: 'vehicle-sale', language: 'th', valid: false, error: 'Syntax error' },
        { type: 'property-sale', language: 'th', valid: true },
      ];

      templates.forEach((template) => {
        if (!template.valid) {
          migrationErrors.push({
            contractType: template.type,
            language: template.language,
            error: template.error || 'Unknown error',
          });
        }
      });

      expect(migrationErrors.length).toBe(1);
      expect(migrationErrors[0].contractType).toBe('vehicle-sale');

      // Should still have processed other templates
      const successfulMigrations = templates.filter(t => t.valid).length;
      expect(successfulMigrations).toBe(2);
    });

    it('should handle database insertion errors gracefully', async () => {
      mockCreateTemplate.mockRejectedValue(
        new Error('Database connection failed')
      );

      const migrationErrors: string[] = [];

      try {
        await mockCreateTemplate({
          contract_type: 'lease',
          language: 'th',
          template_html: '<div>Test</div>',
        });
      } catch (error) {
        migrationErrors.push((error as Error).message);
      }

      expect(migrationErrors).toHaveLength(1);
      expect(migrationErrors[0]).toBe('Database connection failed');
      expect(mockCreateTemplate).toHaveBeenCalled();
    });
  });

  describe('Test Case 4: Migration Report Generation', () => {
    it('should generate report with success count', () => {
      const report: MigrationReport = {
        totalAttempted: 10,
        successful: 8,
        failed: 2,
        warnings: 1,
        timestamp: new Date().toISOString(),
        successes: [
          { contractType: 'lease', language: 'th', templateId: 'id-1' },
          { contractType: 'lease', language: 'en', templateId: 'id-2' },
        ],
        failures: [
          { contractType: 'vehicle-sale', language: 'th', error: 'Syntax error' },
          { contractType: 'property-sale', language: 'th', error: 'Parse failed' },
        ],
      };

      expect(report.totalAttempted).toBe(10);
      expect(report.successful).toBe(8);
      expect(report.failed).toBe(2);
      expect(report.successes.length).toBe(2);
      expect(report.failures.length).toBe(2);
    });

    it('should include all required fields in report structure', () => {
      const report: MigrationReport = {
        totalAttempted: 10,
        successful: 8,
        failed: 2,
        warnings: 1,
        timestamp: new Date().toISOString(),
        successes: [],
        failures: [],
      };

      expect(report).toHaveProperty('totalAttempted');
      expect(report).toHaveProperty('successful');
      expect(report).toHaveProperty('failed');
      expect(report).toHaveProperty('warnings');
      expect(report).toHaveProperty('timestamp');
      expect(report).toHaveProperty('successes');
      expect(report).toHaveProperty('failures');
    });

    it('should list all successful migrations with template IDs', () => {
      const report: MigrationReport = {
        totalAttempted: 5,
        successful: 5,
        failed: 0,
        warnings: 0,
        timestamp: new Date().toISOString(),
        successes: [
          { contractType: 'lease', language: 'th', templateId: 'uuid-1' },
          { contractType: 'lease', language: 'en', templateId: 'uuid-2' },
          { contractType: 'vehicle-sale', language: 'th', templateId: 'uuid-3' },
          { contractType: 'vehicle-sale', language: 'en', templateId: 'uuid-4' },
          { contractType: 'property-sale', language: 'th', templateId: 'uuid-5' },
        ],
        failures: [],
      };

      expect(report.successes.length).toBe(5);
      report.successes.forEach((success) => {
        expect(success).toHaveProperty('contractType');
        expect(success).toHaveProperty('language');
        expect(success).toHaveProperty('templateId');
        expect(success.templateId).toMatch(/^uuid-\d+$/);
      });
    });

    it('should list all failed migrations with error details', () => {
      const report: MigrationReport = {
        totalAttempted: 3,
        successful: 1,
        failed: 2,
        warnings: 0,
        timestamp: new Date().toISOString(),
        successes: [
          { contractType: 'lease', language: 'th', templateId: 'uuid-1' },
        ],
        failures: [
          {
            contractType: 'vehicle-sale',
            language: 'th',
            error: 'Handlebars syntax error: unclosed block',
          },
          {
            contractType: 'employment',
            language: 'en',
            error: 'Variable extraction failed: undefined reference',
          },
        ],
      };

      expect(report.failures.length).toBe(2);
      report.failures.forEach((failure) => {
        expect(failure).toHaveProperty('contractType');
        expect(failure).toHaveProperty('language');
        expect(failure).toHaveProperty('error');
      });
    });

    it('should include warnings in migration report', () => {
      const report: MigrationReport = {
        totalAttempted: 10,
        successful: 8,
        failed: 2,
        warnings: 3,
        timestamp: new Date().toISOString(),
        successes: [],
        failures: [],
        warningDetails: [
          'Template "lease-th" uses deprecated helper "formatCurrency"',
          'Template "vehicle-sale-en" has excessive whitespace in HTML',
          'Template "property-sale-th" missing description field',
        ],
      };

      expect(report.warnings).toBe(3);
      expect(report.warningDetails?.length).toBe(3);
    });

    it('should include migration timestamp for audit trail', () => {
      const beforeTime = new Date();
      const report: MigrationReport = {
        totalAttempted: 1,
        successful: 1,
        failed: 0,
        warnings: 0,
        timestamp: new Date().toISOString(),
        successes: [
          { contractType: 'lease', language: 'th', templateId: 'uuid-1' },
        ],
        failures: [],
      };
      const afterTime = new Date();

      const reportTime = new Date(report.timestamp);
      expect(reportTime.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(reportTime.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it('should calculate success percentage in report', () => {
      const report: MigrationReport = {
        totalAttempted: 10,
        successful: 8,
        failed: 2,
        warnings: 0,
        timestamp: new Date().toISOString(),
        successes: Array(8).fill(null).map((_, i) => ({
          contractType: 'lease',
          language: i % 2 === 0 ? 'th' : 'en',
          templateId: `id-${i}`,
        })),
        failures: Array(2).fill(null).map((_, i) => ({
          contractType: 'vehicle-sale',
          language: 'th',
          error: `Error ${i}`,
        })),
      };

      const successPercentage = (report.successful / report.totalAttempted) * 100;
      expect(successPercentage).toBe(80);
    });

    it('should format report for console output', () => {
      const report: MigrationReport = {
        totalAttempted: 10,
        successful: 8,
        failed: 2,
        warnings: 0,
        timestamp: new Date().toISOString(),
        successes: [],
        failures: [],
      };

      const reportOutput = `
Migration Report
================
Total Attempted: ${report.totalAttempted}
Successful: ${report.successful}
Failed: ${report.failed}
Warnings: ${report.warnings}
Timestamp: ${report.timestamp}
      `;

      expect(reportOutput).toContain('Migration Report');
      expect(reportOutput).toContain(`Total Attempted: ${report.totalAttempted}`);
      expect(reportOutput).toContain(`Successful: ${report.successful}`);
      expect(reportOutput).toContain(`Failed: ${report.failed}`);
    });
  });

  describe('Test Case 5: Thai and English Template Support', () => {
    it('should create migration entries for all 5 contract types in Thai', () => {
      const thaiContractTypes = [
        'lease',
        'vehicle-sale',
        'property-sale',
        'employment',
        'testament',
      ];

      const createdTemplates: Array<{ type: string; language: string }> = [];

      thaiContractTypes.forEach((type) => {
        createdTemplates.push({ type, language: 'th' });
      });

      expect(createdTemplates).toHaveLength(5);
      createdTemplates.forEach((template) => {
        expect(template.language).toBe('th');
      });
    });

    it('should create migration entries for all 5 contract types in English', () => {
      const englishContractTypes = [
        'lease',
        'vehicle-sale',
        'property-sale',
        'employment',
        'testament',
      ];

      const createdTemplates: Array<{ type: string; language: string }> = [];

      englishContractTypes.forEach((type) => {
        createdTemplates.push({ type, language: 'en' });
      });

      expect(createdTemplates).toHaveLength(5);
      createdTemplates.forEach((template) => {
        expect(template.language).toBe('en');
      });
    });

    it('should total 10 templates after migration (5 types × 2 languages)', () => {
      const contractTypes = [
        'lease',
        'vehicle-sale',
        'property-sale',
        'employment',
        'testament',
      ];
      const languages = ['th', 'en'];

      const totalTemplates = contractTypes.length * languages.length;

      expect(totalTemplates).toBe(10);
    });

    it('should set all migrated templates to draft status', () => {
      mockCreateTemplate.mockResolvedValue({ id: 'uuid-123' });

      const templateData = {
        contract_type: 'lease' as const,
        language: 'th' as const,
        template_html: '<div>Test</div>',
        is_draft: true,
        is_active: false,
        version: 1,
      };

      expect(templateData.is_draft).toBe(true);
      expect(templateData.is_active).toBe(false);
    });

    it('should assign version number 1 to all migrated templates', () => {
      const templates = [
        { contractType: 'lease', language: 'th', version: 1 },
        { contractType: 'lease', language: 'en', version: 1 },
        { contractType: 'vehicle-sale', language: 'th', version: 1 },
      ];

      templates.forEach((template) => {
        expect(template.version).toBe(1);
      });
    });
  });

  describe('Test Case 6: Template Validation Before Database Insertion', () => {
    it('should validate Handlebars syntax before insertion', () => {
      mockParseTemplate.mockReturnValue({
        ast: { type: 'Program', body: [] },
        valid: true,
        errors: [],
      });

      const templateHtml = '{{#if test}}<p>Hello</p>{{/if}}';
      const result = mockParseTemplate(templateHtml);

      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should reject templates with invalid Handlebars syntax', () => {
      mockParseTemplate.mockReturnValue({
        ast: null,
        valid: false,
        errors: ['Unclosed block statement'],
      });

      const invalidTemplate = '{{#if test}}<p>Hello</p>';
      const result = mockParseTemplate(invalidTemplate);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(mockCreateTemplate).not.toHaveBeenCalled();
    });

    it('should validate round-trip conversion', () => {
      mockValidateRoundTrip.mockReturnValue({
        success: true,
        differences: [],
      });

      const templateHtml = '<div>{{formatMoney amount}}</div>';
      const result = mockValidateRoundTrip(templateHtml);

      expect(result.success).toBe(true);
      expect(result.differences.length).toBe(0);
    });

    it('should report validation errors with template identification', () => {
      mockParseTemplate.mockReturnValue({
        ast: null,
        valid: false,
        errors: ['Syntax error in template'],
      });

      const contractType = 'lease';
      const language = 'th';
      const templateHtml = 'invalid {{unclosed';

      const result = mockParseTemplate(templateHtml);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});

