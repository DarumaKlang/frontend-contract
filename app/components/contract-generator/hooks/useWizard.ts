import { useEffect, useState } from 'react';
import type { TranslateFn } from '../types';
import type { ContractData, ContractType, Language, PreviewFormat, Toast, ToastType } from '../types';
import { generateContractHtml } from '../templates/contractTemplates';

const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

const LOCALIZATION = {
  th: {
    'badge-main': 'ถูกต้องตามประมวลกฎหมายแพ่งและพาณิชย์',
    'heading-main': 'เครื่องมือสร้างสัญญาออนไลน์ฟรี',
    'subheading-main': 'สร้างสัญญาเช่าคอนโดมิเนียม พร้อมเงื่อนไขค่าเช่า เงินมัดจำ และการเข้าพักอย่างครบถ้วนภายในไม่กี่นาที',
    'btn-quick-fill': 'กรอกสัญญาตัวอย่าง',
    'nav-steps-title': 'ขั้นตอนการทำสัญญา',
    'step1-nav-title': 'ข้อมูลคู่สัญญา',
    'step1-nav-desc': 'รายละเอียดผู้ให้เช่าและผู้เช่า',
    'step2-nav-title': 'ข้อมูลทรัพย์สิน & ค่าเช่า',
    'step2-nav-desc': 'ระบุยูนิตค่าเช่า ค่าเช่ารายเดือน และเงินมัดจำ',
    'step3-nav-title': 'เริ่มสัญญา & การชำระเงิน',
    'step3-nav-desc': 'กำหนดวันเริ่มสัญญา เงื่อนไขการชำระ และเบี้ยปรับล่าช้า',
    'step4-nav-title': 'ตรวจสอบ & ส่งออก',
    'step4-nav-desc': 'แสดงตัวอย่างสัญญา คัดลอก และดาวน์โหลด',
    'disclaimer-title': 'ข้อแนะนำทางกฎหมาย:',
    'disclaimer-text': 'สัญญานี้เป็นร่างสัญญามาตรฐานเบื้องต้น ควรปรึกษาทนายความหรือผู้เชี่ยวชาญหากเป็นการเช่าที่มีเงื่อนไขพิเศษหรือมูลค่าสูง',
    'step1-header-title': 'ข้อมูลคู่สัญญาและที่อยู่ผู้มีส่วนได้เสีย',
    'step1-header-desc': 'ระบุชื่อ ที่อยู่ และข้อมูลผู้ให้เช่าและผู้เช่า เพื่อให้สัญญาเช่าคอนโดฯ มีความชัดเจนและใช้งานได้',
    'section-seller': 'ข้อมูลฝ่ายผู้ให้เช่า (Landlord)',
    'section-buyer': 'ข้อมูลฝ่ายผู้เช่า (Tenant)',
    'lbl-name': 'ชื่อบริษัท หรือ ชื่อ-นามสกุล',
    'lbl-address': 'ที่อยู่ตามทะเบียนบ้าน/ที่ตั้งสำนักงาน',
    'lbl-tax-id': 'เลขประจำตัวผู้เสียภาษี / เลขบัตรประชาชน',
    'lbl-signer': 'ชื่อผู้มีอำนาจลงนาม (ถ้ามี)',
    'step2-header-title': 'ข้อมูลทรัพย์สินและเงื่อนไขค่าเช่า',
    'step2-header-desc': 'ระบุรายละเอียดยูนิตที่เช่า ค่าเช่ารายเดือน และเงินประกัน',
    'section-product': 'รายละเอียดคอนโดมิเนียมที่เช่า',
    'lbl-product-name': 'รายละเอียดยูนิตเช่า',
    'lbl-quantity': 'จำนวนยูนิต',
    'lbl-unit': 'หน่วยนับ (เช่น ยูนิต)',
    'lbl-unit-price': 'ค่าเช่าต่อเดือน',
    'lbl-currency': 'สกุลเงิน',
    'lbl-total-price': 'ค่าเช่าต่อเดือนทั้งหมด (คำนวณอัตโนมัติ)',
    'step3-header-title': 'เงื่อนไขการเริ่มเช่าและการชำระเงิน',
    'step3-header-desc': 'กำหนดวันเริ่มสัญญา การชำระค่าเช่า เงินประกัน และเบี้ยปรับเมื่อชำระล่าช้า',
    'section-delivery': 'เงื่อนไขการเข้าพัก',
    'section-payment': 'เงื่อนไขการชำระค่าเช่า',
    'lbl-delivery-deadline': 'กำหนดวันเริ่มสัญญา',
    'lbl-delivery-method': 'เงื่อนไขการเข้าพัก',
    'opt-del-1': 'ผู้เช่าสามารถเข้าพักได้เมื่อได้รับกุญแจและเอกสารครบถ้วน',
    'opt-del-2': 'เข้าพักตามวันที่นัดหมายหลังจากตรวจสภาพห้อง',
    'opt-del-3': 'เจ้าของมอบกุญแจผ่านตัวแทนหรือผู้ดูแลอาคาร',
    'lbl-payment-method': 'รูปแบบการชำระค่าเช่า',
    'opt-pay-1': 'ชำระค่าเช่ารายเดือนล่วงหน้าทุกวันที่ 1',
    'opt-pay-2': 'ชำระเงินมัดจำก่อนเข้าพัก และค่าเช่ารายเดือนล่วงหน้าต่อเดือน',
    'lbl-deposit': 'เงินประกัน/มัดจำ',
    'lbl-penalty': 'อัตราเบี้ยปรับกรณีชำระล่าช้า (ต่อเดือน)',
    'lbl-penalty-hint': 'คำนวณเป็นร้อยละของค่าเช่ารายเดือนสำหรับการชำระล่าช้า (แนะนำ 2% - 5% ต่อเดือน)',
    'lbl-contract-date': 'วันที่ทำสัญญา',
    'lbl-state': 'ทำขึ้น ณ (จังหวัด / อำเภอ)',
    'lbl-country': 'ประเทศที่ใช้บังคับกฎหมาย',
    'step4-header-title': 'สัญญาเช่าสำเร็จสมบูรณ์!',
    'step4-header-desc': 'คุณสามารถพรีวิวสัญญา คัดลอกโค้ด HTML หรือดาวน์โหลดเป็นไฟล์ไปพิมพ์และลงนาม',
    'fmt-btn-preview': 'ดูตัวอย่างสัญญา',
    'fmt-btn-code': 'โค้ด HTML',
    'btn-copy': 'คัดลอกสัญญา',
    'btn-download': 'ดาวน์โหลดไฟล์สัญญา',
    'btn-prev': 'ย้อนกลับ',
    'btn-next': 'ขั้นตอนถัดไป',
    'footer-copy': 'สร้างสรรค์ขึ้นเพื่ออำนวยความสะดวกแก่ผู้ประกอบการไทย',
    'footer-home': 'หน้าแรก',
    'footer-tc': 'คู่มือสัญญา',
    'footer-privacy': 'ช่วยเหลือข้อกฎหมาย',
    'fill-alert-success': 'กรอกข้อมูลสัญญาตัวอย่างเรียบร้อยแล้ว!',
    'validation-alert': 'กรุณากรอกข้อมูลสำคัญที่มีเครื่องหมายดอกจัน (*) ให้ครบถ้วนก่อนเข้าสู่ขั้นถัดไป'
  },
  en: {
    'badge-main': 'Civil & Commercial Standard Contract',
    'heading-main': 'Free Online Contract Generator',
    'subheading-main': 'Generate condominium lease agreements with clear rent, deposit, and move-in terms in minutes.',
    'btn-quick-fill': 'Quick Demo Fill',
    'nav-steps-title': 'AGREEMENT WORKFLOW',
    'step1-nav-title': 'Parties Details',
    'step1-nav-desc': 'Landlord and Tenant identities',
    'step2-nav-title': 'Property & Rent',
    'step2-nav-desc': 'Specify the rented unit, monthly rent, and security deposit',
    'step3-nav-title': 'Lease Start & Payments',
    'step3-nav-desc': 'Start date, rent schedule and late payment penalties',
    'step4-nav-title': 'Review & Export',
    'step4-nav-desc': 'Preview document and download',
    'disclaimer-title': 'Legal Notice:',
    'disclaimer-text': 'This generated contract is a standard template. For special leasing terms or high-value agreements, please consult a legal professional.',
    'step1-header-title': 'Contracting Parties Details',
    'step1-header-desc': 'Input names and addresses of both the landlord and tenant to make the lease binding.',
    'section-seller': 'Landlord Credentials',
    'section-buyer': 'Tenant Credentials',
    'lbl-name': 'Company Name / Individual Full Name',
    'lbl-address': 'Registered Office Address / Primary Residence',
    'lbl-tax-id': 'Tax ID / ID Card Number',
    'lbl-signer': 'Authorized Representative (If applicable)',
    'step2-header-title': 'Unit Details & Rental Terms',
    'step2-header-desc': 'List the condominium unit, monthly rent, and deposit amount.',
    'section-product': 'Condominium Unit for Lease',
    'lbl-product-name': 'Rental Unit Description / Condo Details',
    'lbl-quantity': 'Number of Units',
    'lbl-unit': 'Unit (e.g., unit)',
    'lbl-unit-price': 'Monthly Rent',
    'lbl-currency': 'Currency',
    'lbl-total-price': 'Total Monthly Rent (Auto-calculates)',
    'step3-header-title': 'Lease Commencement & Payment Terms',
    'step3-header-desc': 'Define the lease start date, rent payment schedule, deposit, and late fees.',
    'section-delivery': 'Occupancy Terms',
    'section-payment': 'Rent Payment Terms',
    'lbl-delivery-deadline': 'Lease Start Date',
    'lbl-delivery-method': 'Move-in / Occupancy Condition',
    'opt-del-1': 'Tenant may occupy after receipt of keys and move-in documents',
    'opt-del-2': 'Tenant moves in on the agreed inspection date',
    'opt-del-3': 'Landlord delivers keys through building management or agent',
    'lbl-payment-method': 'Monthly Payment Structure',
    'opt-pay-1': 'Monthly rent payable in advance on the 1st of each month',
    'opt-pay-2': 'Security deposit paid prior to move-in and monthly rent thereafter',
    'lbl-deposit': 'Security Deposit Amount',
    'lbl-penalty': 'Late Rent Penalty Rate (Per month)',
    'lbl-penalty-hint': 'Percentage of monthly rent charged for each overdue payment period (e.g. 2% - 5%).',
    'lbl-contract-date': 'Date of Signing',
    'lbl-state': 'Executed At (City / Province)',
    'lbl-country': 'Governing Law Country',
    'step4-header-title': 'Lease Agreement Ready!',
    'step4-header-desc': 'Preview the lease agreement, copy the HTML, or export a printable file.',
    'fmt-btn-preview': 'Rich Contract Preview',
    'fmt-btn-code': 'Raw HTML',
    'btn-copy': 'Copy Contract',
    'btn-download': 'Download Contract File',
    'btn-prev': 'Go Back',
    'btn-next': 'Next Step',
    'footer-copy': 'Designed to simplify corporate operations globally.',
    'footer-home': 'Home',
    'footer-tc': 'User Manuals',
    'footer-privacy': 'Legal Helpdesk',
    'fill-alert-success': 'Sample contract data compiled successfully!',
    'validation-alert': 'Please fill out all marked required fields (*) before continuing.'
  }
};

const getInitialFormData = (): ContractData => ({
  sellerName: '',
  sellerAddress: '',
  sellerTaxId: '',
  sellerSigner: '',
  buyerName: '',
  buyerAddress: '',
  buyerTaxId: '',
  buyerSigner: '',
  productName: '',
  quantity: 1,
  unit: 'ยูนิต',
  unitPrice: 0,
  currency: 'THB',
  deliveryDeadline: '',
  deliveryMethod: 'ผู้เช่าสามารถเข้าพักได้เมื่อได้รับกุญแจและเอกสารครบถ้วน',
  paymentMethod: 'ชำระเงินมัดจำก่อนเข้าพัก และค่าเช่ารายเดือนล่วงหน้าต่อเดือน',
  depositAmount: 0,
  penaltyRate: 2,
  contractDate: '',
  state: '',
  country: 'ประเทศไทย',
  vehicleBrand: '',
  vehicleModel: '',
  vehicleYear: '',
  vehiclePlate: '',
  vehicleColor: '',
  vehicleMileage: '',
  vehiclePrice: 0,
  propertyCategory: '',
  propertyAddress: '',
  propertyArea: '',
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
  testamentNotes: ''
});

export function useWizard() {
  // ---------- New state for contract handling ----------
  const [contractId, setContractId] = useState<string | undefined>(undefined);
  const [contractType, setContractType] = useState<ContractType>('lease');

  const syncProfile = async (options?: { title?: string; documentLink?: string; points?: number }) => {
    const token = getAuthToken();
    if (!token) return;

    const profilePayload = {
      contract_history: options?.title
        ? [{ title: options.title, created_at: new Date().toISOString() }]
        : [],
      document_links: options?.documentLink
        ? [{ label: options?.title ?? 'Contract document', url: options.documentLink }]
        : [],
      frequent_profile_data: {
        sellerName: formData.sellerName,
        buyerName: formData.buyerName,
        productName: formData.productName,
        state: formData.state,
        country: formData.country,
        unitPrice: formData.unitPrice,
        currency: formData.currency,
      },
      points: options?.points ?? 0,
      last_used_at: new Date().toISOString(),
    };

    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profilePayload),
      });
    } catch (error) {
      console.error('Profile sync failed', error);
    }
  };
  
  // Save contract to backend (create or update)
  const saveContract = async () => {
    const payload = {
      title: contractType === 'vehicle-sale' ? 'Vehicle Sale Agreement' : contractType === 'property-sale' ? 'Property Sale Agreement' : 'Lease Agreement',
      data: formData,
      html: getGeneratedHtml(),
    };
    const method = contractId ? 'PUT' : 'POST';
    const url = contractId ? `/api/contracts/${contractId}` : '/api/contracts';
    const token = getAuthToken();
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      showToast(t('save-error') ?? 'Failed to save contract', 'error');
      return;
    }
    const { id } = await res.json();
    setContractId(id);
    const documentLink = typeof window !== 'undefined' && id ? `${window.location.origin}/profile#contract-${id}` : undefined;
    await syncProfile({ title: payload.title, documentLink, points: 10 });
    showToast(t('save-success') ?? 'Contract saved', 'success');
  };

  // Upload generated PDF to user's Google Drive
  const uploadToDrive = async () => {
    if (!contractId) {
      showToast('Please save the contract first', 'error');
      return;
    }
    const res = await fetch(`/api/drive/upload?contractId=${contractId}`, {
      method: 'POST',
    });
    if (!res.ok) {
      showToast(t('drive-upload-error') ?? 'Upload failed', 'error');
      return;
    }
    const { pdfUrl } = await res.json();
    showToast(t('drive-upload-success') ?? 'Uploaded to Google Drive', 'success');
    // optional: store the pdfUrl in contract record (handled server‑side)
  };
  const [appLanguage, setAppLanguage] = useState<Language>('th');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [previewFormat, setPreviewFormat] = useState<PreviewFormat>('rich');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [formData, setFormData] = useState<ContractData>(getInitialFormData);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setFormData((prev) => ({
      ...prev,
      contractDate: `${year}-${month}-${day}`,
      deliveryDeadline: `${year}-${month}-${String(today.getDate() + 7).padStart(2, '0')}`
    }));
  }, []);

  useEffect(() => {
    if (appLanguage === 'th') {
      setFormData((prev) => ({
        ...prev,
        unit: prev.unit === 'unit' ? 'ยูนิต' : prev.unit,
        country: prev.country === 'Thailand' ? 'ประเทศไทย' : prev.country,
        deliveryMethod:
          prev.deliveryMethod === 'Tenant may occupy after receipt of keys and move-in documents'
            ? 'ผู้เช่าสามารถเข้าพักได้เมื่อได้รับกุญแจและเอกสารครบถ้วน'
            : prev.deliveryMethod === 'Tenant moves in on the agreed inspection date'
            ? 'เข้าพักตามวันที่นัดหมายหลังจากตรวจสภาพห้อง'
            : prev.deliveryMethod === 'Landlord delivers keys through building management or agent'
            ? 'เจ้าของมอบกุญแจผ่านตัวแทนหรือผู้ดูแลอาคาร'
            : prev.deliveryMethod,
        paymentMethod:
          prev.paymentMethod === 'Monthly rent payable in advance on the 1st of each month'
            ? 'ชำระค่าเช่ารายเดือนล่วงหน้าทุกวันที่ 1'
            : prev.paymentMethod === 'Security deposit paid prior to move-in and monthly rent thereafter'
            ? 'ชำระเงินมัดจำก่อนเข้าพัก และค่าเช่ารายเดือนล่วงหน้าต่อเดือน'
            : prev.paymentMethod
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        unit: prev.unit === 'ยูนิต' ? 'unit' : prev.unit,
        country: prev.country === 'ประเทศไทย' ? 'Thailand' : prev.country,
        deliveryMethod:
          prev.deliveryMethod === 'ผู้เช่าสามารถเข้าพักได้เมื่อได้รับกุญแจและเอกสารครบถ้วน'
            ? 'Tenant may occupy after receipt of keys and move-in documents'
            : prev.deliveryMethod === 'เข้าพักตามวันที่นัดหมายหลังจากตรวจสภาพห้อง'
            ? 'Tenant moves in on the agreed inspection date'
            : prev.deliveryMethod === 'เจ้าของมอบกุญแจผ่านตัวแทนหรือผู้ดูแลอาคาร'
            ? 'Landlord delivers keys through building management or agent'
            : prev.deliveryMethod,
        paymentMethod:
          prev.paymentMethod === 'ชำระค่าเช่ารายเดือนล่วงหน้าทุกวันที่ 1'
            ? 'Monthly rent payable in advance on the 1st of each month'
            : prev.paymentMethod === 'ชำระเงินมัดจำก่อนเข้าพัก และค่าเช่ารายเดือนล่วงหน้าต่อเดือน'
            ? 'Security deposit paid prior to move-in and monthly rent thereafter'
            : prev.paymentMethod
      }));
    }
  }, [appLanguage]);

  const t: TranslateFn = (key) => (LOCALIZATION[appLanguage] as any)[key] || (LOCALIZATION.th as any)[key] || '';

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      const { sellerName, sellerAddress, sellerTaxId, buyerName, buyerAddress, buyerTaxId } = formData;
      return sellerName.trim() !== '' && sellerAddress.trim() !== '' && sellerTaxId.trim() !== '' && buyerName.trim() !== '' && buyerAddress.trim() !== '' && buyerTaxId.trim() !== '';
    }
    if (step === 2) {
      if (contractType === 'vehicle-sale') {
        const { vehicleBrand, vehicleModel, vehiclePrice, productName } = formData;
        return productName.trim() !== '' && vehicleBrand.trim() !== '' && vehicleModel.trim() !== '' && vehiclePrice >= 0;
      }
      if (contractType === 'property-sale') {
        const { productName, propertyAddress, propertyPrice } = formData;
        return productName.trim() !== '' && propertyAddress.trim() !== '' && propertyPrice >= 0;
      }
      const { productName, quantity, unitPrice } = formData;
      return productName.trim() !== '' && quantity > 0 && unitPrice >= 0;
    }
    if (step === 3) {
      const { state, deliveryDeadline } = formData;
      return state.trim() !== '' && deliveryDeadline !== '';
    }
    return true;
  };

  const handleNext = () => {
    // Save progress before moving to next step (optional)
    // saveContract(); // uncomment if you want autosave on each step
    if (!validateStep(currentStep)) {
      showToast(t('validation-alert'), 'error');
      return;
    }
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      showToast(appLanguage === 'th' ? 'ร่างสัญญาของคุณเสร็จสมบูรณ์แล้ว!' : 'Your contract drafting is complete!');
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleGoToStep = (stepNum: number) => {
    if (stepNum > currentStep && !validateStep(currentStep)) {
      showToast(t('validation-alert'), 'error');
      return;
    }
    setCurrentStep(stepNum);
  };

  const handleQuickFill = () => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (appLanguage === 'th') {
      if (contractType === 'vehicle-sale') {
        setFormData({
          sellerName: 'บริษัท รถยนต์คอนเน็ค จำกัด',
          sellerAddress: 'เลขที่ 88/10 ถนนรัชดาภิเษก กรุงเทพฯ 10310',
          sellerTaxId: '0105567001234',
          sellerSigner: 'นายพงศ์พัฒน์ แก้ววิชัย',
          buyerName: 'นางสาวพรพิมล วัฒนา',
          buyerAddress: 'เลขที่ 12/3 ซอยสุขุมวิท 39 กรุงเทพฯ 10110',
          buyerTaxId: '3101101234567',
          buyerSigner: 'นางสาวพรพิมล วัฒนา',
          productName: 'รถเก๋ง Hyundai Elantra 2022',
          quantity: 1,
          unit: 'คัน',
          unitPrice: 389000,
          currency: 'THB',
          deliveryDeadline: nextWeek,
          deliveryMethod: 'ส่งมอบรถพร้อมเอกสารกรรมสิทธิ์และประกันภัย',
          paymentMethod: 'ชำระเงินดาวน์และชำระส่วนที่เหลือภายใน 7 วัน',
          depositAmount: 100000,
          penaltyRate: 2,
          contractDate: dateStr,
          state: 'กรุงเทพมหานคร',
          country: 'ประเทศไทย',
          vehicleBrand: 'Hyundai',
          vehicleModel: 'Elantra',
          vehicleYear: '2022',
          vehiclePlate: '1กก 1234',
          vehicleColor: 'เทา',
          vehicleMileage: '42,000 กม.',
          vehiclePrice: 389000,
          propertyCategory: '',
          propertyAddress: '',
          propertyArea: '',
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
          testamentNotes: ''
        });
      } else if (contractType === 'property-sale') {
        setFormData({
          sellerName: 'บริษัท พลัส พร็อพเพอร์ตี้ จำกัด',
          sellerAddress: 'เลขที่ 22 ซอยสุขุมวิท 63 เขตวัฒนา กรุงเทพฯ 10110',
          sellerTaxId: '0105567001234',
          sellerSigner: 'นายปกรณ์ นฤพุฒิ (กรรมการผู้จัดการ)',
          buyerName: 'นางสาวชลธิชา ไกรสร',
          buyerAddress: 'เลขที่ 77/7 ถนนสุขุมวิท 36 แขวงคลองตัน เขตคลองเตย กรุงเทพมหานคร 10110',
          buyerTaxId: '3101101234567',
          buyerSigner: 'นางสาวชลธิชา ไกรสร',
          productName: 'คอนโดมิเนียมห้องชุด 1202 อาคารเลอคองคอร์ด',
          quantity: 1,
          unit: 'ยูนิต',
          unitPrice: 0,
          currency: 'THB',
          deliveryDeadline: nextWeek,
          deliveryMethod: 'โอนกรรมสิทธิ์เมื่อชำระเงินครบถ้วนและรับเอกสารครบถ้วน',
          paymentMethod: 'ชำระเงินมัดจำก่อนโอนและชำระส่วนที่เหลือภายใน 7 วัน',
          depositAmount: 500000,
          penaltyRate: 2,
          contractDate: dateStr,
          state: 'กรุงเทพมหานคร',
          country: 'ประเทศไทย',
          vehicleBrand: '',
          vehicleModel: '',
          vehicleYear: '',
          vehiclePlate: '',
          vehicleColor: '',
          vehicleMileage: '',
          vehiclePrice: 0,
          propertyCategory: 'คอนโดมิเนียม',
          propertyAddress: 'เลขที่ 1202 อาคารเลอคองคอร์ด ถนนวิทยุ กรุงเทพฯ',
          propertyArea: '76.5 ตารางเมตร',
          propertyFloor: 'ชั้น 12',
          propertyPrice: 5200000,
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
          testamentNotes: ''
        });
      } else {
        setFormData({
          sellerName: 'บริษัท พลัส พร็อพเพอร์ตี้ จำกัด',
          sellerAddress: 'เลขที่ 22 ซอยสุขุมวิท 63 เขตวัฒนา กรุงเทพฯ 10110',
          sellerTaxId: '0105567001234',
          sellerSigner: 'นายปกรณ์ นฤพุฒิ (กรรมการผู้จัดการ)',
          buyerName: 'นางสาวชลธิชา ไกรสร',
          buyerAddress: 'เลขที่ 77/7 ถนนสุขุมวิท 36 แขวงคลองตัน เขตคลองเตย กรุงเทพมหานคร 10110',
          buyerTaxId: '3101101234567',
          buyerSigner: 'นางสาวชลธิชา ไกรสร',
          productName: 'คอนโดมิเนียม ยูนิต 1202 อาคารเอ็ม กรีน พาร์ค ริเวอร์ไซด์',
          quantity: 1,
          unit: 'ยูนิต',
          unitPrice: 35000,
          currency: 'THB',
          deliveryDeadline: nextWeek,
          deliveryMethod: 'ผู้เช่าสามารถเข้าพักได้เมื่อได้รับกุญแจและเอกสารครบถ้วน',
          paymentMethod: 'ชำระเงินมัดจำก่อนเข้าพัก และค่าเช่ารายเดือนล่วงหน้าต่อเดือน',
          depositAmount: 70000,
          penaltyRate: 2,
          contractDate: dateStr,
          state: 'กรุงเทพมหานคร',
          country: 'ประเทศไทย',
          vehicleBrand: '',
          vehicleModel: '',
          vehicleYear: '',
          vehiclePlate: '',
          vehicleColor: '',
          vehicleMileage: '',
          vehiclePrice: 0,
          propertyCategory: '',
          propertyAddress: '',
          propertyArea: '',
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
          testamentNotes: ''
        });
      }
    } else {
      if (contractType === 'vehicle-sale') {
        setFormData({
          sellerName: 'City Auto Trading Co., Ltd.',
          sellerAddress: '88/10 Ratchada Road, Bangkok 10310, Thailand',
          sellerTaxId: '0105567001234',
          sellerSigner: 'Mr. Pongpatt Kaewwichai',
          buyerName: 'Ms. Pornpimol Wattana',
          buyerAddress: '12/3 Sukhumvit 39, Bangkok 10110, Thailand',
          buyerTaxId: '3101101234567',
          buyerSigner: 'Ms. Pornpimol Wattana',
          productName: 'Hyundai Elantra 2022',
          quantity: 1,
          unit: 'car',
          unitPrice: 389000,
          currency: 'THB',
          deliveryDeadline: nextWeek,
          deliveryMethod: 'Vehicle delivered with transfer documents and insurance',
          paymentMethod: 'Down payment first and balance within 7 days',
          depositAmount: 100000,
          penaltyRate: 2,
          contractDate: dateStr,
          state: 'Bangkok',
          country: 'Thailand',
          vehicleBrand: 'Hyundai',
          vehicleModel: 'Elantra',
          vehicleYear: '2022',
          vehiclePlate: '1กก 1234',
          vehicleColor: 'Grey',
          vehicleMileage: '42,000 km',
          vehiclePrice: 389000,
          propertyCategory: '',
          propertyAddress: '',
          propertyArea: '',
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
          testamentNotes: ''
        });
      } else if (contractType === 'property-sale') {
        setFormData({
          sellerName: 'Plus Property Co., Ltd.',
          sellerAddress: '22 Sukhumvit 63 Alley, Watthana, Bangkok 10110, Thailand',
          sellerTaxId: '0105567001234',
          sellerSigner: 'Mr. Pakorn Naruphoot (Managing Director)',
          buyerName: 'Ms. Chonthicha Kraisorn',
          buyerAddress: '77/7 Sukhumvit 36, Khlong Tan, Khlong Toei, Bangkok 10110, Thailand',
          buyerTaxId: '3101101234567',
          buyerSigner: 'Ms. Chonthicha Kraisorn',
          productName: 'Condominium Unit 1202, Le Concorde Residence',
          quantity: 1,
          unit: 'unit',
          unitPrice: 0,
          currency: 'USD',
          deliveryDeadline: nextWeek,
          deliveryMethod: 'Transfer ownership upon full payment and receipt of documents',
          paymentMethod: 'Deposit first and balance within 7 days',
          depositAmount: 5000,
          penaltyRate: 3,
          contractDate: dateStr,
          state: 'Bangkok',
          country: 'Thailand',
          vehicleBrand: '',
          vehicleModel: '',
          vehicleYear: '',
          vehiclePlate: '',
          vehicleColor: '',
          vehicleMileage: '',
          vehiclePrice: 0,
          propertyCategory: 'Condominium',
          propertyAddress: '1202 Le Concorde Residence, Wireless Road, Bangkok',
          propertyArea: '76.5 sqm',
          propertyFloor: '12th floor',
          propertyPrice: 520000,
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
          testamentNotes: ''
        });
      } else {
        setFormData({
          sellerName: 'Plus Property Co., Ltd.',
          sellerAddress: '22 Sukhumvit 63 Alley, Watthana, Bangkok 10110, Thailand',
          sellerTaxId: '0105567001234',
          sellerSigner: 'Mr. Pakorn Naruphoot (Managing Director)',
          buyerName: 'Ms. Chonthicha Kraisorn',
          buyerAddress: '77/7 Sukhumvit 36, Khlong Tan, Khlong Toei, Bangkok 10110, Thailand',
          buyerTaxId: '3101101234567',
          buyerSigner: 'Ms. Chonthicha Kraisorn',
          productName: 'Condominium Unit No. 1202, M-Green Park Riverside Tower',
          quantity: 1,
          unit: 'unit',
          unitPrice: 950,
          currency: 'USD',
          deliveryDeadline: nextWeek,
          deliveryMethod: 'Tenant may occupy after receipt of keys and move-in documents',
          paymentMethod: 'Security deposit paid prior to move-in and monthly rent thereafter',
          depositAmount: 1900,
          penaltyRate: 3,
          contractDate: dateStr,
          state: 'Bangkok',
          country: 'Thailand',
          vehicleBrand: '',
          vehicleModel: '',
          vehicleYear: '',
          vehiclePlate: '',
          vehicleColor: '',
          vehicleMileage: '',
          vehiclePrice: 0,
          propertyCategory: '',
          propertyAddress: '',
          propertyArea: '',
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
          testamentNotes: ''
        });
      }
    }
    showToast(t('fill-alert-success'), 'success');
  };

  const handleFormChange = (key: keyof ContractData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const formatMoney = (amount: number) => new Intl.NumberFormat(appLanguage === 'th' ? 'th-TH' : 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);

  const thaiBahtText = (num: number): string => {
    try {
      if (num === 0) return 'ศูนย์บาทถ้วน';
      const thaiNums = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
      const thaiUnits = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
      const parts = num.toFixed(2).split('.');
      const integerPart = parseInt(parts[0], 10);
      const decimalPart = parseInt(parts[1], 10);

      const formatInt = (n: number): string => {
        let result = '';
        const s = n.toString();
        const len = s.length;
        for (let i = 0; i < len; i += 1) {
          const digit = parseInt(s[i], 10);
          if (digit !== 0) {
            const unitIndex = len - 1 - i;
            if (unitIndex === 1 && digit === 2) {
              result += 'ยี่สิบ';
            } else if (unitIndex === 1 && digit === 1) {
              result += 'สิบ';
            } else if (unitIndex === 0 && digit === 1 && len > 1) {
              result += 'เอ็ด';
            } else {
              result += thaiNums[digit] + thaiUnits[unitIndex % 6];
            }
            if (unitIndex >= 6 && unitIndex % 6 === 0) {
              result += 'ล้าน';
            }
          }
        }
        return result;
      };

      let str = '';
      if (integerPart > 0) {
        str += `${formatInt(integerPart)}บาท`;
      }
      if (decimalPart > 0) {
        str += `${formatInt(decimalPart)}สตางค์`;
      } else {
        str += 'ถ้วน';
      }
      return str;
    } catch {
      return '';
    }
  };

  const getGeneratedHtml = () => generateContractHtml({
    contractType,
    appLanguage,
    formData,
    formatMoney,
    thaiBahtText,
  });

  // expose new functions for UI components
  const exportApi = {
    saveContract,
    uploadToDrive,
  };


  const handleCopy = () => {
    const rawContent = getGeneratedHtml();
    const textElement = document.createElement('textarea');
    textElement.value = rawContent;
    document.body.appendChild(textElement);
    textElement.select();

    try {
      document.execCommand('copy');
      showToast(appLanguage === 'th' ? 'คัดลอกร่างสัญญาเช่าลงคลิปบอร์ดแล้ว!' : 'Lease agreement copied to clipboard!');
    } catch {
      showToast(appLanguage === 'th' ? 'คัดลอกไม่สำเร็จ กรุณาลองคัดลอกด้วยตนเอง' : 'Copy failed, please copy manually.', 'error');
    }
    document.body.removeChild(textElement);
  };

  const handleDownload = () => {
    const rawContent = `<!DOCTYPE html><html lang="${appLanguage}"><head><meta charset="UTF-8"><title>Condominium Lease Agreement</title><link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;700&display=swap" rel="stylesheet"><style>@media print{body{background:white;color:black}.no-print{display:none}}</style></head><body style="background-color:#f8fafc;padding:40px 10px;"><div style="background-color:#ffffff;padding:40px;max-width:800px;margin:0 auto;box-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1);border-radius:8px;border:1px solid #e2e8f0;">${getGeneratedHtml()}</div></body></html>`;
    const fileName = `condo-contract-${formData.contractDate || 'draft'}.html`;
    const fileBlob = new Blob([rawContent], { type: 'text/html' });
    const tempLink = document.createElement('a');
    tempLink.download = fileName;
    tempLink.href = window.URL.createObjectURL(fileBlob);
    tempLink.style.display = 'none';
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    void syncProfile({ title: 'Lease Agreement', documentLink: typeof window !== 'undefined' ? `${window.location.origin}/${fileName}` : undefined, points: 5 });
    showToast(appLanguage === 'th' ? 'ดาวน์โหลดไฟล์สัญญาสำเร็จแล้ว!' : 'Contract file downloaded successfully!');
  };

  return {
    appLanguage,
    setAppLanguage,
    currentStep,
    handleNext,
    contractId,
    saveContract,
    uploadToDrive,
    exportApi,
    setCurrentStep,
    handlePrev,
    handleGoToStep,
    handleQuickFill,
    handleCopy,
    handleDownload,
    previewFormat,
    setPreviewFormat,
    toasts,
    formData,
    handleFormChange,
    t,
    getGeneratedHtml,
    contractType,
    setContractType
  };
}
