// lib/sampleData/contractSampleData.ts
// Comprehensive sample data for all contract types and languages
// Used for admin template preview in the Admin Template Editor

import type { ContractType, TemplateLanguage } from '@/lib/types/template';
import type { ContractData } from '@/app/components/contract-generator/types';

/**
 * Complete sample data for all 5 contract types × 2 languages (10 combinations)
 * Each sample includes all required fields for the contract type in both Thai and English
 */
export const SAMPLE_DATA: Record<ContractType, Record<TemplateLanguage, ContractData>> = {
  // ====== LEASE CONTRACTS ======
  'lease': {
    // Thai Lease Contract
    'th': {
      // Lease-specific fields
      sellerName: 'นายสมชาย ใจดี',
      buyerName: 'นางสาวสมหญิง รักเรียน',
      productName: 'ห้องเช่า 2 ห้องนอน',
      
      // Property/Rental details
      propertyAddress: '123/45 ถนนสุขุมวิท แขวงคลองเตย เขตวัฒนา กรุงเทพมหานคร 10110',
      propertyCategory: 'อพาร์ทเมนต์',
      propertyArea: '80',
      propertyFloor: '5',
      
      // Rental amounts
      depositAmount: 30000,
      unitPrice: 15000,
      penaltyRate: 1500,
      
      // Common fields
      sellerAddress: 'เลขที่ 10 ซอยสุขุมวิท 55 กรุงเทพมหานคร',
      sellerTaxId: '1234567890123',
      sellerSigner: 'นายสมชาย ใจดี',
      buyerAddress: '456 ซอยลัดสวัสดิ์ กรุงเทพมหานคร',
      buyerTaxId: '9876543210987',
      buyerSigner: 'นางสาวสมหญิง รักเรียน',
      
      // Other rental-related fields
      quantity: 1,
      unit: 'เดือน',
      currency: 'บาท',
      deliveryDeadline: '2024-02-15',
      deliveryMethod: 'ส่งมอบทันที',
      paymentMethod: 'โอนเงินผ่านธนาคาร',
      contractDate: '2024-01-15',
      state: 'กรุงเทพมหานคร',
      country: 'ไทย',
      
      // Unused fields (set to defaults)
      vehicleBrand: '',
      vehicleModel: '',
      vehicleYear: '0',
      vehiclePlate: '',
      vehicleColor: '',
      vehicleMileage: '0',
      vehiclePrice: 0,
      propertyPrice: 0,
      employmentPosition: '',
      employmentStartDate: '',
      salaryAmount: 0,
      workLocation: '',
      employmentBenefits: '',
      employmentTerm: '',
      testamentDate: '',
      testamentBeneficiaryName: '',
      testamentExecutorName: '',
      testamentWitnesses: '',
      testamentAssets: '',
      testamentNotes: '',
    },
    
    // English Lease Contract
    'en': {
      // Lease-specific fields
      sellerName: 'Somchai Jaidee',
      buyerName: 'Somying Rakearen',
      productName: '2-Bedroom Apartment',
      
      // Property/Rental details
      propertyAddress: '123/45 Sukhumvit Road, Khlong Toei, Wattana, Bangkok 10110',
      propertyCategory: 'Apartment',
      propertyArea: '80',
      propertyFloor: '5',
      
      // Rental amounts
      depositAmount: 30000,
      unitPrice: 15000,
      penaltyRate: 1500,
      
      // Common fields
      sellerAddress: '10 Soi Sukhumvit 55, Bangkok',
      sellerTaxId: '1234567890123',
      sellerSigner: 'Somchai Jaidee',
      buyerAddress: '456 Soi Lad Sawat, Bangkok',
      buyerTaxId: '9876543210987',
      buyerSigner: 'Somying Rakearen',
      
      // Other rental-related fields
      quantity: 1,
      unit: 'month',
      currency: 'THB',
      deliveryDeadline: '2024-02-15',
      deliveryMethod: 'Immediate possession',
      paymentMethod: 'Bank transfer',
      contractDate: '2024-01-15',
      state: 'Bangkok',
      country: 'Thailand',
      
      // Unused fields (set to defaults)
      vehicleBrand: '',
      vehicleModel: '',
      vehicleYear: '0',
      vehiclePlate: '',
      vehicleColor: '',
      vehicleMileage: '0',
      vehiclePrice: 0,
      propertyPrice: 0,
      employmentPosition: '',
      employmentStartDate: '',
      salaryAmount: 0,
      workLocation: '',
      employmentBenefits: '',
      employmentTerm: '',
      testamentDate: '',
      testamentBeneficiaryName: '',
      testamentExecutorName: '',
      testamentWitnesses: '',
      testamentAssets: '',
      testamentNotes: '',
    },
  },

  // ====== VEHICLE SALE CONTRACTS ======
  'vehicle-sale': {
    // Thai Vehicle Sale Contract
    'th': {
      // Vehicle-specific fields
      sellerName: 'นายวิรุฬ สามารถ',
      buyerName: 'นาย ปรัชญา บำรุงสุข',
      productName: 'รถยนต์ครอบครัว',
      vehicleBrand: 'Toyota',
      vehicleModel: 'Camry 2.5 G',
      vehicleYear: '2023',
      vehiclePlate: 'กต 1234 กรุงเทพ',
      vehicleColor: 'สีดำ',
      vehicleMileage: '15000',
      vehiclePrice: 1250000,
      
      // Common fields
      sellerAddress: '789 ถนนพหลโยธิน เขตจตุจักร กรุงเทพมหานคร',
      sellerTaxId: '1122334455667',
      sellerSigner: 'นายวิรุฬ สามารถ',
      buyerAddress: '321 ถนนรัชดาภิเษก เขตสายไหม กรุงเทพมหานคร',
      buyerTaxId: '7788991122334',
      buyerSigner: 'นาย ปรัชญา บำรุงสุข',
      
      // Transaction details
      quantity: 1,
      unit: 'คัน',
      currency: 'บาท',
      unitPrice: 1250000,
      depositAmount: 50000,
      penaltyRate: 12500,
      deliveryDeadline: '2024-02-01',
      deliveryMethod: 'ส่งมอบพร้อมเอกสาร',
      paymentMethod: 'โอนเงิน 3 งวด',
      contractDate: '2024-01-15',
      state: 'กรุงเทพมหานคร',
      country: 'ไทย',
      
      // Unused fields
      propertyCategory: '',
      propertyAddress: '',
      propertyArea: '0',
      propertyFloor: '',
      propertyPrice: 0,
      employmentPosition: '',
      employmentStartDate: '',
      salaryAmount: 0,
      workLocation: '',
      employmentBenefits: '',
      employmentTerm: '',
      testamentDate: '',
      testamentBeneficiaryName: '',
      testamentExecutorName: '',
      testamentWitnesses: '',
      testamentAssets: '',
      testamentNotes: '',
    },
    
    // English Vehicle Sale Contract
    'en': {
      // Vehicle-specific fields
      sellerName: 'Wirut Samartakrob',
      buyerName: 'Prachya Barmungsuk',
      productName: 'Family Sedan',
      vehicleBrand: 'Toyota',
      vehicleModel: 'Camry 2.5 G',
      vehicleYear: '2023',
      vehiclePlate: 'GT-1234 Bangkok',
      vehicleColor: 'Black',
      vehicleMileage: '15000',
      vehiclePrice: 1250000,
      
      // Common fields
      sellerAddress: '789 Phahon Yothin Road, Chatuchak, Bangkok',
      sellerTaxId: '1122334455667',
      sellerSigner: 'Wirut Samartakrob',
      buyerAddress: '321 Ratchadamri Road, Sai Mai, Bangkok',
      buyerTaxId: '7788991122334',
      buyerSigner: 'Prachya Barmungsuk',
      
      // Transaction details
      quantity: 1,
      unit: 'vehicle',
      currency: 'THB',
      unitPrice: 1250000,
      depositAmount: 50000,
      penaltyRate: 12500,
      deliveryDeadline: '2024-02-01',
      deliveryMethod: 'Delivery with documents',
      paymentMethod: '3 installments via bank transfer',
      contractDate: '2024-01-15',
      state: 'Bangkok',
      country: 'Thailand',
      
      // Unused fields
      propertyCategory: '',
      propertyAddress: '',
      propertyArea: '0',
      propertyFloor: '',
      propertyPrice: 0,
      employmentPosition: '',
      employmentStartDate: '',
      salaryAmount: 0,
      workLocation: '',
      employmentBenefits: '',
      employmentTerm: '',
      testamentDate: '',
      testamentBeneficiaryName: '',
      testamentExecutorName: '',
      testamentWitnesses: '',
      testamentAssets: '',
      testamentNotes: '',
    },
  },

  // ====== PROPERTY SALE CONTRACTS ======
  'property-sale': {
    // Thai Property Sale Contract
    'th': {
      // Property-specific fields
      sellerName: 'นางสาวณัฐฐา ทิศทอง',
      buyerName: 'นายสิทธิพร สมบูรณ์',
      productName: 'บ้านแฝด ม.ปัญญานิเวศน์',
      propertyCategory: 'บ้านแฝด',
      propertyAddress: '88/99 ซอยเพชรบุรี 77 แขวงมักกะสัน เขตร้อยเอ็ด กรุงเทพมหานคร 10120',
      propertyArea: '120',
      propertyFloor: '2',
      propertyPrice: 4500000,
      
      // Common fields
      sellerAddress: '88/99 ซอยเพชรบุรี 77 กรุงเทพมหานคร',
      sellerTaxId: '5566778899001',
      sellerSigner: 'นางสาวณัฐฐา ทิศทอง',
      buyerAddress: '500 ถนนสาทร เขตสาทร กรุงเทพมหานคร',
      buyerTaxId: '2233445566778',
      buyerSigner: 'นายสิทธิพร สมบูรณ์',
      
      // Transaction details
      quantity: 1,
      unit: 'แปลง',
      currency: 'บาท',
      unitPrice: 4500000,
      depositAmount: 150000,
      penaltyRate: 45000,
      deliveryDeadline: '2024-04-15',
      deliveryMethod: 'ส่งมอบเอกสารและทำการโอน',
      paymentMethod: 'ชำระในงานโอน',
      contractDate: '2024-01-15',
      state: 'กรุงเทพมหานคร',
      country: 'ไทย',
      
      // Unused fields
      vehicleBrand: '',
      vehicleModel: '',
      vehicleYear: '0',
      vehiclePlate: '',
      vehicleColor: '',
      vehicleMileage: '0',
      vehiclePrice: 0,
      employmentPosition: '',
      employmentStartDate: '',
      salaryAmount: 0,
      workLocation: '',
      employmentBenefits: '',
      employmentTerm: '',
      testamentDate: '',
      testamentBeneficiaryName: '',
      testamentExecutorName: '',
      testamentWitnesses: '',
      testamentAssets: '',
      testamentNotes: '',
    },
    
    // English Property Sale Contract
    'en': {
      // Property-specific fields
      sellerName: 'Nattha Tibtong',
      buyerName: 'Sitthiporn Somboon',
      productName: 'Twin House at Panyaniwet Village',
      propertyCategory: 'Twin House',
      propertyAddress: '88/99 Soi Petchburi 77, Makkasan, Ratchathewi, Bangkok 10120',
      propertyArea: '120',
      propertyFloor: '2',
      propertyPrice: 4500000,
      
      // Common fields
      sellerAddress: '88/99 Soi Petchburi 77, Bangkok',
      sellerTaxId: '5566778899001',
      sellerSigner: 'Nattha Tibtong',
      buyerAddress: '500 Sathorn Road, Sathorn, Bangkok',
      buyerTaxId: '2233445566778',
      buyerSigner: 'Sitthiporn Somboon',
      
      // Transaction details
      quantity: 1,
      unit: 'lot',
      currency: 'THB',
      unitPrice: 4500000,
      depositAmount: 150000,
      penaltyRate: 45000,
      deliveryDeadline: '2024-04-15',
      deliveryMethod: 'Transfer documents and registration',
      paymentMethod: 'Payment upon transfer',
      contractDate: '2024-01-15',
      state: 'Bangkok',
      country: 'Thailand',
      
      // Unused fields
      vehicleBrand: '',
      vehicleModel: '',
      vehicleYear: '0',
      vehiclePlate: '',
      vehicleColor: '',
      vehicleMileage: '0',
      vehiclePrice: 0,
      employmentPosition: '',
      employmentStartDate: '',
      salaryAmount: 0,
      workLocation: '',
      employmentBenefits: '',
      employmentTerm: '',
      testamentDate: '',
      testamentBeneficiaryName: '',
      testamentExecutorName: '',
      testamentWitnesses: '',
      testamentAssets: '',
      testamentNotes: '',
    },
  },

  // ====== EMPLOYMENT CONTRACTS ======
  'employment': {
    // Thai Employment Contract
    'th': {
      // Employment-specific fields
      sellerName: 'บริษัท เทคโนโลยี ไทย จำกัด',
      buyerName: 'นายประกิต ประสิทธิมงคล',
      productName: 'ตำแหน่งผู้จัดการฝ่ายปฏิบัติการ',
      employmentPosition: 'ผู้จัดการฝ่ายปฏิบัติการ',
      employmentStartDate: '2024-03-01',
      salaryAmount: 60000,
      workLocation: 'กรุงเทพมหานคร',
      employmentBenefits: 'ประกันสุขภาพ, โบนัสประจำปี, วันลาพักผ่อน 15 วัน/ปี',
      employmentTerm: '3 ปี',
      
      // Common fields
      sellerAddress: '150 ถนนพระราม 9 เขตห้วยขวาง กรุงเทพมหานคร 10310',
      sellerTaxId: '1234567890123',
      sellerSigner: 'นายสมศักดิ์ ผู้บริหาร',
      buyerAddress: '250 ซอยเพชรบุรี 71 แขวงมักกะสัน กรุงเทพมหานคร',
      buyerTaxId: '9876543210987',
      buyerSigner: 'นายประกิต ประสิทธิมงคล',
      
      // Transaction details
      quantity: 1,
      unit: 'สัญญา',
      currency: 'บาท',
      unitPrice: 60000,
      depositAmount: 0,
      penaltyRate: 0,
      deliveryDeadline: '2024-02-28',
      deliveryMethod: 'ลงนามและมีผลบังคับ',
      paymentMethod: 'เงินเดือนรายเดือน',
      contractDate: '2024-01-15',
      state: 'กรุงเทพมหานคร',
      country: 'ไทย',
      
      // Unused fields
      propertyCategory: '',
      propertyAddress: '',
      propertyArea: '0',
      propertyFloor: '',
      propertyPrice: 0,
      vehicleBrand: '',
      vehicleModel: '',
      vehicleYear: '0',
      vehiclePlate: '',
      vehicleColor: '',
      vehicleMileage: '0',
      vehiclePrice: 0,
      testamentDate: '',
      testamentBeneficiaryName: '',
      testamentExecutorName: '',
      testamentWitnesses: '',
      testamentAssets: '',
      testamentNotes: '',
    },
    
    // English Employment Contract
    'en': {
      // Employment-specific fields
      sellerName: 'Technology Thailand Co., Ltd.',
      buyerName: 'Prakit Prasittimongkol',
      productName: 'Operations Manager Position',
      employmentPosition: 'Operations Manager',
      employmentStartDate: '2024-03-01',
      salaryAmount: 60000,
      workLocation: 'Bangkok',
      employmentBenefits: 'Health insurance, annual bonus, 15 days leave per year',
      employmentTerm: '3 years',
      
      // Common fields
      sellerAddress: '150 Rama 9 Road, Huay Kwang, Bangkok 10310',
      sellerTaxId: '1234567890123',
      sellerSigner: 'Somsak Manager',
      buyerAddress: '250 Soi Petchburi 71, Makkasan, Bangkok',
      buyerTaxId: '9876543210987',
      buyerSigner: 'Prakit Prasittimongkol',
      
      // Transaction details
      quantity: 1,
      unit: 'contract',
      currency: 'THB',
      unitPrice: 60000,
      depositAmount: 0,
      penaltyRate: 0,
      deliveryDeadline: '2024-02-28',
      deliveryMethod: 'Signed and effective',
      paymentMethod: 'Monthly salary',
      contractDate: '2024-01-15',
      state: 'Bangkok',
      country: 'Thailand',
      
      // Unused fields
      propertyCategory: '',
      propertyAddress: '',
      propertyArea: '0',
      propertyFloor: '',
      propertyPrice: 0,
      vehicleBrand: '',
      vehicleModel: '',
      vehicleYear: '0',
      vehiclePlate: '',
      vehicleColor: '',
      vehicleMileage: '0',
      vehiclePrice: 0,
      testamentDate: '',
      testamentBeneficiaryName: '',
      testamentExecutorName: '',
      testamentWitnesses: '',
      testamentAssets: '',
      testamentNotes: '',
    },
  },

  // ====== TESTAMENT CONTRACTS ======
  'testament': {
    // Thai Testament Contract
    'th': {
      // Testament-specific fields
      sellerName: 'นายพัฒน์ ศรีสว่าง (ผู้ทำให้การ)',
      testamentBeneficiaryName: 'นายยุทธ ศรีสว่าง',
      buyerName: 'นายยุทธ ศรีสว่าง',
      productName: 'ทรัพย์สินส่วนตัวของผู้ทำให้การ',
      testamentAssets: 'บ้าน คสช. 123/45 ถนนวิทยุ กรุงเทพมหานคร, รถยนต์ Toyota Camry, บัญชีธนาคารและเงินสด 500,000 บาท',
      testamentDate: '2024-01-15',
      testamentExecutorName: 'นายยุทธ ศรีสว่าง',
      testamentWitnesses: 'นายสมพงษ์ โครตัน, นางมณฑา บำรุงสุข',
      testamentNotes: 'ทรัพย์สินใด ๆ ที่ได้รับควรนำไปใช้เพื่อประโยชน์ของครอบครัวต่อ',
      
      // Common fields
      sellerAddress: '123/45 ถนนวิทยุ เขตลุมพินี กรุงเทพมหานคร',
      sellerTaxId: '9988776655441',
      sellerSigner: 'นายพัฒน์ ศรีสว่าง',
      buyerAddress: '123/45 ถนนวิทยุ เขตลุมพินี กรุงเทพมหานคร',
      buyerTaxId: '1122334455667',
      buyerSigner: 'นายยุทธ ศรีสว่าง',
      
      // Transaction/Document details
      quantity: 1,
      unit: 'ฉบับ',
      currency: 'บาท',
      unitPrice: 0,
      depositAmount: 0,
      penaltyRate: 0,
      deliveryDeadline: '2024-01-15',
      deliveryMethod: 'ลงนามและจดทะเบียนต่อ สำนักงานที่ดิน',
      paymentMethod: 'ไม่มี',
      contractDate: '2024-01-15',
      state: 'กรุงเทพมหานคร',
      country: 'ไทย',
      
      // Unused fields
      propertyCategory: '',
      propertyAddress: '',
      propertyArea: '0',
      propertyFloor: '',
      propertyPrice: 0,
      vehicleBrand: '',
      vehicleModel: '',
      vehicleYear: '0',
      vehiclePlate: '',
      vehicleColor: '',
      vehicleMileage: '0',
      vehiclePrice: 0,
      employmentPosition: '',
      employmentStartDate: '',
      salaryAmount: 0,
      workLocation: '',
      employmentBenefits: '',
      employmentTerm: '',
    },
    
    // English Testament Contract
    'en': {
      // Testament-specific fields
      sellerName: 'Pattana Srisawang (Testator)',
      testamentBeneficiaryName: 'Yuttha Srisawang',
      buyerName: 'Yuttha Srisawang',
      productName: 'Personal Assets of the Testator',
      testamentAssets: 'House No. 123/45 Wireless Road, Bangkok, Toyota Camry vehicle, Bank account and cash of THB 500,000',
      testamentDate: '2024-01-15',
      testamentExecutorName: 'Yuttha Srisawang',
      testamentWitnesses: 'Sompong Kroton, Monttha Barmungsuk',
      testamentNotes: 'All assets received shall be used for the benefit of the family.',
      
      // Common fields
      sellerAddress: '123/45 Wireless Road, Lumpini, Bangkok',
      sellerTaxId: '9988776655441',
      sellerSigner: 'Pattana Srisawang',
      buyerAddress: '123/45 Wireless Road, Lumpini, Bangkok',
      buyerTaxId: '1122334455667',
      buyerSigner: 'Yuttha Srisawang',
      
      // Transaction/Document details
      quantity: 1,
      unit: 'copy',
      currency: 'THB',
      unitPrice: 0,
      depositAmount: 0,
      penaltyRate: 0,
      deliveryDeadline: '2024-01-15',
      deliveryMethod: 'Signed and registered with Land Office',
      paymentMethod: 'None',
      contractDate: '2024-01-15',
      state: 'Bangkok',
      country: 'Thailand',
      
      // Unused fields
      propertyCategory: '',
      propertyAddress: '',
      propertyArea: '0',
      propertyFloor: '',
      propertyPrice: 0,
      vehicleBrand: '',
      vehicleModel: '',
      vehicleYear: '0',
      vehiclePlate: '',
      vehicleColor: '',
      vehicleMileage: '0',
      vehiclePrice: 0,
      employmentPosition: '',
      employmentStartDate: '',
      salaryAmount: 0,
      workLocation: '',
      employmentBenefits: '',
      employmentTerm: '',
    },
  },
};

/**
 * Helper function to get sample data for a specific contract type and language
 * Returns a strongly-typed ContractData object
 */
export function getSampleData(contractType: ContractType, language: TemplateLanguage): ContractData {
  const sampleData = SAMPLE_DATA[contractType][language];
  if (!sampleData) {
    throw new Error(
      `Sample data not found for contract type: ${contractType}, language: ${language}`
    );
  }
  return sampleData;
}

/**
 * Helper function to get all available contract types
 */
export function getAvailableContractTypes(): ContractType[] {
  return Object.keys(SAMPLE_DATA) as ContractType[];
}

/**
 * Helper function to get all available languages for a contract type
 */
export function getAvailableLanguages(contractType: ContractType): TemplateLanguage[] {
  const languages = Object.keys(SAMPLE_DATA[contractType]) as TemplateLanguage[];
  return languages;
}

/**
 * Helper function to verify all required fields are present for a contract type
 * Returns an array of missing field names, or empty array if all fields are present
 */
export function validateSampleData(
  contractType: ContractType,
  language: TemplateLanguage
): string[] {
  const sampleData = getSampleData(contractType, language);
  const missingFields: string[] = [];
  const requiredFields = [
    'sellerName',
    'buyerName',
    'contractDate',
    'sellerAddress',
    'buyerAddress',
  ];

  requiredFields.forEach((field) => {
    const value = sampleData[field as keyof ContractData];
    if (value === undefined || value === null || value === '') {
      missingFields.push(field);
    }
  });

  return missingFields;
}
