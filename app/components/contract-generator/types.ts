export type Language = 'th' | 'en';
export type PreviewFormat = 'rich' | 'code';
export type ToastType = 'success' | 'error' | 'info';

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
}

export type TranslateFn = (key: string) => string;
