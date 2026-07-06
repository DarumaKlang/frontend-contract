export type Language = 'th' | 'en';
export type PreviewFormat = 'rich' | 'code';
export type ToastType = 'success' | 'error' | 'info';
export type ContractType = 'lease' | 'vehicle-sale' | 'property-sale' | 'employment' | 'testament';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface ContractData {
  sellerName: string;
  sellerAddress: string;
  sellerTaxId: string;
  sellerSigner: string;
  buyerName: string;
  buyerAddress: string;
  buyerTaxId: string;
  buyerSigner: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  currency: string;
  deliveryDeadline: string;
  deliveryMethod: string;
  paymentMethod: string;
  depositAmount: number;
  penaltyRate: number;
  contractDate: string;
  state: string;
  country: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  vehiclePlate: string;
  vehicleColor: string;
  vehicleMileage: string;
  vehiclePrice: number;
  propertyCategory: string;
  propertyAddress: string;
  propertyArea: string;
  propertyFloor: string;
  propertyPrice: number;
  employmentPosition: string;
  employmentStartDate: string;
  salaryAmount: number;
  workLocation: string;
  employmentBenefits: string;
  employmentTerm: string;
  testamentDate: string;
  testamentBeneficiaryName: string;
  testamentExecutorName: string;
  testamentWitnesses: string;
  testamentAssets: string;
  testamentNotes: string;
}

export type TranslateFn = (key: string) => string;
