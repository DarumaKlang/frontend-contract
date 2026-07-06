import type { ContractData, ContractType, Language } from '../types';
import { generateLeaseAgreementHtml } from './leaseTemplate';
import { generateVehicleSaleAgreementHtml } from './vehicleSaleTemplate';
import { generatePropertySaleAgreementHtml } from './propertySaleTemplate';
import { generateEmploymentAgreementHtml } from './employmentTemplate';
import { generateTestamentHtml } from './testamentTemplate';

export function generateContractHtml({
  contractType,
  appLanguage,
  formData,
  formatMoney,
  thaiBahtText,
}: { contractType: ContractType, appLanguage: Language, formData: ContractData, formatMoney: (n: number) => string, thaiBahtText: (n: number) => string }): string {
  switch (contractType) {
    case 'lease':
      return generateLeaseAgreementHtml({
        appLanguage,
        formData,
        formatMoney,
        thaiBahtText,
      });

    case 'vehicle-sale':
      return generateVehicleSaleAgreementHtml({
        appLanguage,
        formData,
        formatMoney,
        thaiBahtText,
      });

    case 'property-sale':
      return generatePropertySaleAgreementHtml({
        appLanguage,
        formData,
        formatMoney,
        thaiBahtText,
      });

    case 'employment':
      return generateEmploymentAgreementHtml({
        appLanguage,
        formData,
        formatMoney,
        thaiBahtText,
      });

    case 'testament':
      return generateTestamentHtml({
        appLanguage,
        formData,
        formatMoney,
        thaiBahtText,
      });

    default:
      return generateLeaseAgreementHtml({
        appLanguage,
        formData,
        formatMoney,
        thaiBahtText,
      });
  }
}
