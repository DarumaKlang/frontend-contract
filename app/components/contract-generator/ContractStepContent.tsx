import { Truck, CreditCard, Percent } from 'lucide-react';
import { type ReactNode } from 'react';
import type { ContractData, Language, TranslateFn } from './types';

interface ContractStepContentProps {
  currentStep: number;
  appLanguage: Language;
  formData: ContractData;
  onFormChange: (key: keyof ContractData, value: unknown) => void;
  t: TranslateFn;
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

export function ContractStepContent({ currentStep, appLanguage, formData, onFormChange, t, formatMoney }: ContractStepContentProps) {
  return (
    <div className="p-6 sm:p-8">
      {currentStep === 1 && (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <div className="h-4 w-1.5 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800">{t('section-seller')}</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label={t('lbl-name')} required>
                <input
                  value={formData.sellerName}
                  onChange={(e) => onFormChange('sellerName', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  placeholder={appLanguage === 'th' ? 'ชื่อผู้ให้เช่า หรือบริษัทผู้ให้เช่า' : 'Landlord or Company Name'}
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
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800">{t('section-buyer')}</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label={t('lbl-name')} required>
                <input
                  value={formData.buyerName}
                  onChange={(e) => onFormChange('buyerName', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  placeholder={appLanguage === 'th' ? 'ชื่อผู้เช่า หรือบริษัทผู้เช่า' : 'Tenant or Company Name'}
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
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800">{t('section-product')}</h3>
          </div>
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
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Truck className="h-4 w-4 text-sky-600" />
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800">{t('section-delivery')}</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label={t('lbl-delivery-deadline')} required>
                <input
                  type="date"
                  value={formData.deliveryDeadline}
                  onChange={(e) => onFormChange('deliveryDeadline', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                />
              </FormField>
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
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <CreditCard className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800">{t('section-payment')}</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label={t('lbl-payment-method')}>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => onFormChange('paymentMethod', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                >
                  <option value={t('opt-pay-1')}>{t('opt-pay-1')}</option>
                  <option value={t('opt-pay-2')}>{t('opt-pay-2')}</option>
                </select>
              </FormField>
              <FormField label={t('lbl-deposit')}>
                <input
                  type="number"
                  value={formData.depositAmount}
                  onChange={(e) => onFormChange('depositAmount', Math.max(0, parseFloat(e.target.value) || 0))}
                  disabled={formData.paymentMethod === t('opt-pay-1')}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500 disabled:bg-slate-100 disabled:text-slate-400"
                  placeholder="ระบุราคาค่ามัดจำ"
                />
              </FormField>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
              <FormField label={t('lbl-contract-date')} className="md:col-span-2">
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
        </div>
      )}

      {currentStep === 4 && null}
    </div>
  );
}
