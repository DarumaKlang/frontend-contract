import { Truck, CreditCard, Percent } from 'lucide-react';
import { type ReactNode } from 'react';
import type { ContractData, ContractType, Language, TranslateFn } from './types';

interface ContractStepContentProps {
  currentStep: number;
  appLanguage: Language;
  formData: ContractData;
  onFormChange: (key: keyof ContractData, value: unknown) => void;
  t: TranslateFn;
  contractType: ContractType;
  formatMoney: (amount: number) => string;
}

function FormField({
  label,
  required = false,
  children,
  className = ''
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      {children}
    </div>
  );
}

export function ContractStepContent({ currentStep, appLanguage, formData, onFormChange, t, contractType, formatMoney }: ContractStepContentProps) {
  const sectionTitle = contractType === 'employment'
    ? (appLanguage === 'th' ? 'ข้อมูลฝ่ายจ้างงาน' : 'Employment Details')
    : contractType === 'testament'
    ? (appLanguage === 'th' ? 'ข้อมูลผู้ทำพินัยกรรม' : 'Testament Details')
    : t('section-seller');

  const counterpartyTitle = contractType === 'employment'
    ? (appLanguage === 'th' ? 'ข้อมูลพนักงาน' : 'Employee Details')
    : contractType === 'testament'
    ? (appLanguage === 'th' ? 'ข้อมูลผู้รับผลประโยชน์' : 'Beneficiary Details')
    : t('section-buyer');

  return (
    <div className="p-6 sm:p-8">
      {currentStep === 1 && (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <div className="h-4 w-1.5 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800">{sectionTitle}</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label={t('lbl-name')} required>
                <input
                  value={formData.sellerName}
                  onChange={(e) => onFormChange('sellerName', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  placeholder={contractType === 'employment'
                    ? (appLanguage === 'th' ? 'ชื่อบริษัทหรือชื่อผู้ว่าจ้าง' : 'Employer or Company Name')
                    : contractType === 'testament'
                    ? (appLanguage === 'th' ? 'ชื่อผู้ทำพินัยกรรม' : 'Testator Full Name')
                    : (appLanguage === 'th' ? 'ชื่อผู้ให้เช่า หรือบริษัทผู้ให้เช่า' : 'Landlord or Company Name')}
                />
              </FormField>
              <FormField label={t('lbl-tax-id')} required>
                <input
                  value={formData.sellerTaxId}
                  onChange={(e) => onFormChange('sellerTaxId', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  placeholder="เช่น 01055xxxxxxxx"
                />
              </FormField>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label={t('lbl-address')} required>
                <input
                  value={formData.sellerAddress}
                  onChange={(e) => onFormChange('sellerAddress', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  placeholder="99/9 ถ.สุขุมวิท..."
                />
              </FormField>
              <FormField label={t('lbl-signer')}>
                <input
                  value={formData.sellerSigner}
                  onChange={(e) => onFormChange('sellerSigner', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  placeholder="เช่น นายสมชาย ดีเลิศ (ผู้มีอำนาจลงนาม)"
                />
              </FormField>
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <div className="h-4 w-1.5 rounded-full bg-sky-500" />
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800">{counterpartyTitle}</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label={t('lbl-name')} required>
                <input
                  value={formData.buyerName}
                  onChange={(e) => onFormChange('buyerName', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  placeholder={contractType === 'employment'
                    ? (appLanguage === 'th' ? 'ชื่อพนักงานหรือผู้รับจ้าง' : 'Employee or Contractor Name')
                    : contractType === 'testament'
                    ? (appLanguage === 'th' ? 'ชื่อผู้รับผลประโยชน์' : 'Beneficiary Name')
                    : (appLanguage === 'th' ? 'ชื่อผู้เช่า หรือบริษัทผู้เช่า' : 'Tenant or Company Name')}
                />
              </FormField>
              <FormField label={t('lbl-tax-id')} required>
                <input
                  value={formData.buyerTaxId}
                  onChange={(e) => onFormChange('buyerTaxId', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  placeholder="เลขบัตรประชาชน หรือผู้เสียภาษี"
                />
              </FormField>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label={t('lbl-address')} required>
                <input
                  value={formData.buyerAddress}
                  onChange={(e) => onFormChange('buyerAddress', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  placeholder="ที่อยู่จัดส่ง / สำนักงานใหญ่"
                />
              </FormField>
              <FormField label={t('lbl-signer')}>
                <input
                  value={formData.buyerSigner}
                  onChange={(e) => onFormChange('buyerSigner', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  placeholder="เช่น นางสาวสุดา แสนดี (ผู้ประสานงานจัดซื้อ)"
                />
              </FormField>
            </div>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <div className="h-4 w-1.5 rounded-full bg-purple-500" />
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800">{contractType === 'vehicle-sale' ? (appLanguage === 'th' ? 'รายละเอียดรถยนต์' : 'Vehicle Details') : contractType === 'property-sale' ? (appLanguage === 'th' ? 'รายละเอียดอสังหาริมทรัพย์' : 'Property Details') : contractType === 'employment' ? (appLanguage === 'th' ? 'รายละเอียดงานและค่าตอบแทน' : 'Job & Compensation Details') : contractType === 'testament' ? (appLanguage === 'th' ? 'รายละเอียดพินัยกรรม' : 'Will Details') : t('section-product')}</h3>
          </div>
          {contractType === 'vehicle-sale' ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label={appLanguage === 'th' ? 'ชื่อรถ / คำอธิบาย' : 'Vehicle description'} required>
                <input
                  value={formData.productName}
                  onChange={(e) => onFormChange('productName', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  placeholder={appLanguage === 'th' ? 'เช่น Hyundai Elantra 2022' : 'e.g. Hyundai Elantra 2022'}
                />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'ยี่ห้อ' : 'Brand'}>
                <input value={formData.vehicleBrand} onChange={(e) => onFormChange('vehicleBrand', e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'รุ่น' : 'Model'}>
                <input value={formData.vehicleModel} onChange={(e) => onFormChange('vehicleModel', e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'ปี' : 'Year'}>
                <input value={formData.vehicleYear} onChange={(e) => onFormChange('vehicleYear', e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'ป้ายทะเบียน' : 'Plate'}>
                <input value={formData.vehiclePlate} onChange={(e) => onFormChange('vehiclePlate', e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'สี' : 'Color'}>
                <input value={formData.vehicleColor} onChange={(e) => onFormChange('vehicleColor', e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'เลขไมล์' : 'Mileage'}>
                <input value={formData.vehicleMileage} onChange={(e) => onFormChange('vehicleMileage', e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'ราคาขาย' : 'Selling price'} required>
                <input type="number" value={formData.vehiclePrice} onChange={(e) => onFormChange('vehiclePrice', Math.max(0, parseFloat(e.target.value) || 0))} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
            </div>
          ) : contractType === 'property-sale' ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label={appLanguage === 'th' ? 'ชื่ออสังหาริมทรัพย์' : 'Property name'} required>
                <input
                  value={formData.productName}
                  onChange={(e) => onFormChange('productName', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  placeholder={appLanguage === 'th' ? 'เช่น บ้านเดี่ยว หลักที่ 123' : 'e.g. Single House No. 123'}
                />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'ประเภทอสังหาริมทรัพย์' : 'Property category'}>
                <input value={formData.propertyCategory} onChange={(e) => onFormChange('propertyCategory', e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'ที่ตั้ง' : 'Address'} className="md:col-span-2">
                <input value={formData.propertyAddress} onChange={(e) => onFormChange('propertyAddress', e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'พื้นที่' : 'Area'}>
                <input value={formData.propertyArea} onChange={(e) => onFormChange('propertyArea', e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'ชั้น / เลขที่' : 'Floor / Unit no.'}>
                <input value={formData.propertyFloor} onChange={(e) => onFormChange('propertyFloor', e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'ราคาขาย' : 'Selling price'} required className="md:col-span-2">
                <input type="number" value={formData.propertyPrice} onChange={(e) => onFormChange('propertyPrice', Math.max(0, parseFloat(e.target.value) || 0))} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
            </div>
          ) : contractType === 'employment' ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label={appLanguage === 'th' ? 'ตำแหน่งงาน' : 'Position'} required>
                <input
                  value={formData.productName}
                  onChange={(e) => onFormChange('productName', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  placeholder={appLanguage === 'th' ? 'เช่น นักพัฒนา Frontend' : 'e.g. Frontend Developer'}
                />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'วันที่เริ่มงาน' : 'Start date'}>
                <input type="date" value={formData.employmentStartDate} onChange={(e) => onFormChange('employmentStartDate', e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'ค่าจ้าง / เงินเดือน' : 'Salary'} required>
                <input type="number" value={formData.salaryAmount} onChange={(e) => onFormChange('salaryAmount', Math.max(0, parseFloat(e.target.value) || 0))} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'สถานที่ทำงาน' : 'Work location'}>
                <input value={formData.workLocation} onChange={(e) => onFormChange('workLocation', e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'สวัสดิการ' : 'Benefits'} className="md:col-span-2">
                <input value={formData.employmentBenefits} onChange={(e) => onFormChange('employmentBenefits', e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'ระยะเวลาจ้าง' : 'Employment term'} className="md:col-span-2">
                <input value={formData.employmentTerm} onChange={(e) => onFormChange('employmentTerm', e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
            </div>
          ) : contractType === 'testament' ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label={appLanguage === 'th' ? 'หัวข้อพินัยกรรม' : 'Will title'} required>
                <input value={formData.productName} onChange={(e) => onFormChange('productName', e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" placeholder={appLanguage === 'th' ? 'เช่น พินัยกรรมฉบับยกทรัพย์ให้บุตร' : 'e.g. Will for estate distribution'} />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'วันที่ทำพินัยกรรม' : 'Will date'}>
                <input type="date" value={formData.testamentDate} onChange={(e) => onFormChange('testamentDate', e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'ผู้รับผลประโยชน์' : 'Beneficiary'}>
                <input value={formData.testamentBeneficiaryName} onChange={(e) => onFormChange('testamentBeneficiaryName', e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'ผู้รับมอบอำนาจ/ผู้จัดการทรัพย์' : 'Executor'}>
                <input value={formData.testamentExecutorName} onChange={(e) => onFormChange('testamentExecutorName', e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'ทรัพย์สินที่ระบุ' : 'Assets'} className="md:col-span-2">
                <textarea value={formData.testamentAssets} onChange={(e) => onFormChange('testamentAssets', e.target.value)} className="min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'พยาน' : 'Witnesses'} className="md:col-span-2">
                <input value={formData.testamentWitnesses} onChange={(e) => onFormChange('testamentWitnesses', e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
              <FormField label={appLanguage === 'th' ? 'หมายเหตุเพิ่มเติม' : 'Notes'} className="md:col-span-2">
                <textarea value={formData.testamentNotes} onChange={(e) => onFormChange('testamentNotes', e.target.value)} className="min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500" />
              </FormField>
            </div>
          ) : (
            <>
              <FormField label={t('lbl-product-name')} required>
                <input
                  value={formData.productName}
                  onChange={(e) => onFormChange('productName', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  placeholder={appLanguage === 'th' ? 'เช่น คอนโด ยูนิต 1202 อาคารเอ็ม กรีน พาร์ค ริเวอร์ไซด์' : 'e.g., Condominium Unit 1202, M-Green Park Riverside'}
                />
              </FormField>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField label={t('lbl-quantity')} required>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => onFormChange('quantity', Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  />
                </FormField>
                <FormField label={t('lbl-unit')}>
                  <input
                    value={formData.unit}
                    onChange={(e) => onFormChange('unit', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                    placeholder={appLanguage === 'th' ? 'ยูนิต / ห้อง' : 'unit / room'}
                  />
                </FormField>
                <FormField label={t('lbl-unit-price')} required>
                  <input
                    type="number"
                    value={formData.unitPrice}
                    onChange={(e) => onFormChange('unitPrice', Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label={t('lbl-currency')}>
                  <select
                    value={formData.currency}
                    onChange={(e) => onFormChange('currency', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="THB">THB (฿) - บาทไทย</option>
                    <option value="USD">USD ($) - ดอลลาร์สหรัฐ</option>
                    <option value="EUR">EUR (€) - ยูโร</option>
                    <option value="SGD">SGD (S$) - ดอลลาร์สิงคโปร์</option>
                  </select>
                </FormField>
                <FormField label={t('lbl-total-price')}>
                  <div className="flex h-[46px] items-center justify-between rounded-xl border border-sky-100 bg-sky-50 p-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Total</span>
                    <span className="text-sm font-extrabold text-sky-950">{formatMoney(formData.quantity * formData.unitPrice)} {formData.currency}</span>
                  </div>
                </FormField>
              </div>
            </>
          )}
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-6">
          {(contractType === 'lease' || contractType === 'vehicle-sale' || contractType === 'property-sale') && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Truck className="h-4 w-4 text-sky-600" />
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800">
                  {contractType === 'vehicle-sale' 
                    ? (appLanguage === 'th' ? 'การส่งมอบรถ' : 'Vehicle Delivery') 
                    : contractType === 'property-sale' 
                    ? (appLanguage === 'th' ? 'การโอนกรรมสิทธิ์' : 'Transfer of Ownership') 
                    : t('section-delivery')}
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label={contractType === 'vehicle-sale' 
                    ? (appLanguage === 'th' ? 'วันที่ส่งมอบรถ' : 'Vehicle Delivery Date')
                    : contractType === 'property-sale'
                    ? (appLanguage === 'th' ? 'วันที่โอนกรรมสิทธิ์' : 'Transfer of Ownership Date')
                    : t('lbl-delivery-deadline')} required>
                  <input
                    type="date"
                    value={formData.deliveryDeadline}
                    onChange={(e) => onFormChange('deliveryDeadline', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  />
                </FormField>
                {contractType === 'lease' && (
                  <FormField label={t('lbl-delivery-method')}>
                    <select
                      value={formData.deliveryMethod}
                      onChange={(e) => onFormChange('deliveryMethod', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                    >
                      <option value={t('opt-del-1')}>{t('opt-del-1')}</option>
                      <option value={t('opt-del-2')}>{t('opt-del-2')}</option>
                      <option value={t('opt-del-3')}>{t('opt-del-3')}</option>
                    </select>
                  </FormField>
                )}
                {contractType === 'vehicle-sale' && (
                  <FormField label={appLanguage === 'th' ? 'วิธีการส่งมอบ' : 'Delivery method'}>
                    <select
                      value={formData.deliveryMethod}
                      onChange={(e) => onFormChange('deliveryMethod', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                    >
                      <option value={appLanguage === 'th' ? 'ส่งมอบที่สถานที่ของผู้ขาย' : 'Deliver at seller location'}>{appLanguage === 'th' ? 'ส่งมอบที่สถานที่ของผู้ขาย' : 'Deliver at seller location'}</option>
                      <option value={appLanguage === 'th' ? 'จัดส่งถึงที่อยู่ของผู้ซื้อ' : 'Deliver to buyer address'}>{appLanguage === 'th' ? 'จัดส่งถึงที่อยู่ของผู้ซื้อ' : 'Deliver to buyer address'}</option>
                    </select>
                  </FormField>
                )}
                {contractType === 'property-sale' && (
                  <FormField label={appLanguage === 'th' ? 'เงื่อนไขการโอน' : 'Transfer terms'}>
                    <select
                      value={formData.deliveryMethod}
                      onChange={(e) => onFormChange('deliveryMethod', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                    >
                      <option value={appLanguage === 'th' ? 'โอนกรรมสิทธิ์ที่สำนักงานที่ดิน' : 'Transfer ownership at Land Department'}>{appLanguage === 'th' ? 'โอนกรรมสิทธิ์ที่สำนักงานที่ดิน' : 'Transfer ownership at Land Department'}</option>
                    </select>
                  </FormField>
                )}
              </div>
            </div>
          )}
          {contractType === 'employment' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Truck className="h-4 w-4 text-sky-600" />
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800">{appLanguage === 'th' ? 'เงื่อนไขการจ้างงาน' : 'Employment Terms'}</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Employment specific fields can go here */}
              </div>
            </div>
          )}
          {contractType === 'testament' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Truck className="h-4 w-4 text-sky-600" />
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800">{appLanguage === 'th' ? 'เงื่อนไขพินัยกรรม' : 'Will Execution Terms'}</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Testament specific fields can go here */}
              </div>
            </div>
          )}

          {(contractType === 'lease' || contractType === 'vehicle-sale' || contractType === 'property-sale') && (
            <div className="space-y-4 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <CreditCard className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800">{t('section-payment')}</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label={contractType === 'vehicle-sale' || contractType === 'property-sale' 
                    ? (appLanguage === 'th' ? 'เงื่อนไขการชำระเงิน' : 'Payment terms')
                    : t('lbl-payment-method')}>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => onFormChange('paymentMethod', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  >
                    {contractType === 'lease' ? (
                      <>
                        <option value={t('opt-pay-1')}>{t('opt-pay-1')}</option>
                        <option value={t('opt-pay-2')}>{t('opt-pay-2')}</option>
                      </>
                    ) : (
                      <>
                        <option value={appLanguage === 'th' ? 'ชำระเงินเต็มจำนวน' : 'Full payment'}>{appLanguage === 'th' ? 'ชำระเงินเต็มจำนวน' : 'Full payment'}</option>
                        <option value={appLanguage === 'th' ? 'ชำระเงินมัดจำ แล้วชำระเงินที่เหลือต่อ' : 'Deposit then balance'}>{appLanguage === 'th' ? 'ชำระเงินมัดจำ แล้วชำระเงินที่เหลือต่อ' : 'Deposit then balance'}</option>
                        <option value={appLanguage === 'th' ? 'ผ่อนชำระ' : 'Installment payment'}>{appLanguage === 'th' ? 'ผ่อนชำระ' : 'Installment payment'}</option>
                      </>
                    )}
                  </select>
                </FormField>
                <FormField label={contractType === 'lease' ? t('lbl-deposit') : (appLanguage === 'th' ? 'ราคามัดจำ' : 'Deposit amount')}>
                  <input
                    type="number"
                    value={formData.depositAmount}
                    onChange={(e) => onFormChange('depositAmount', Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                    placeholder={appLanguage === 'th' ? 'ระบุราคาค่ามัดจำ' : 'Enter deposit amount'}
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {contractType === 'lease' && (
                  <FormField label={t('lbl-penalty')}>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={formData.penaltyRate}
                        onChange={(e) => onFormChange('penaltyRate', Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full rounded-xl border border-slate-200 p-3 pr-8 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400"><Percent className="h-4 w-4" /></div>
                    </div>
                  </FormField>
                )}
                <FormField label={t('lbl-contract-date')} className={contractType === 'lease' ? 'md:col-span-2' : 'md:col-span-3'}>
                  <input
                    type="date"
                    value={formData.contractDate}
                    onChange={(e) => onFormChange('contractDate', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label={t('lbl-state')} required>
                  <input
                    value={formData.state}
                    onChange={(e) => onFormChange('state', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                    placeholder={appLanguage === 'th' ? 'กรุงเทพมหานคร' : 'Bangkok'}
                  />
                </FormField>
                <FormField label={t('lbl-country')}>
                  <input
                    value={formData.country}
                    onChange={(e) => onFormChange('country', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                    placeholder={appLanguage === 'th' ? 'ประเทศไทย' : 'Thailand'}
                  />
                </FormField>
              </div>
            </div>
          )}
          {(contractType === 'employment' || contractType === 'testament') && (
            <div className="space-y-4 border-t border-slate-100 pt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label={t('lbl-contract-date')} required>
                  <input
                    type="date"
                    value={formData.contractDate}
                    onChange={(e) => onFormChange('contractDate', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  />
                </FormField>
                <FormField label={t('lbl-state')} required>
                  <input
                    value={formData.state}
                    onChange={(e) => onFormChange('state', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                    placeholder={appLanguage === 'th' ? 'กรุงเทพมหานคร' : 'Bangkok'}
                  />
                </FormField>
                <FormField label={t('lbl-country')} className="md:col-span-2">
                  <input
                    value={formData.country}
                    onChange={(e) => onFormChange('country', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                    placeholder={appLanguage === 'th' ? 'ประเทศไทย' : 'Thailand'}
                  />
                </FormField>
              </div>
            </div>
          )}
        </div>
      )}

      {currentStep === 4 && null}
    </div>
  );
}
