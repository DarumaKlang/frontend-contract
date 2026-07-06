import type { ContractData, Language } from '../types';
import { formatDisplayDate } from './templateHelpers';

export function generatePropertySaleAgreementHtml({ appLanguage, formData, formatMoney }: {
  appLanguage: Language;
  formData: ContractData;
  formatMoney: (n: number) => string;
  thaiBahtText: (n: number) => string;
}): string {
  const {
    sellerName,
    buyerName,
    buyerSigner,
    sellerSigner,
    state,
    currency,
    productName,
    propertyCategory,
    propertyAddress,
    propertyArea,
    propertyFloor,
    propertyPrice,
    paymentMethod,
    deliveryDeadline,
  } = formData;

  const title = appLanguage === 'th' ? 'สัญญาซื้อขายอสังหาริมทรัพย์' : 'Property Sale Agreement';
  const subtitle = appLanguage === 'th' ? 'ทำขึ้น ณ' : 'Executed at';
  const formattedDeadline = formatDisplayDate(deliveryDeadline, appLanguage);

  return `
    <div style="font-family: 'Sarabun', 'sans-serif'; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 20px;">
      <h1 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 8px;">${title}</h1>
      <p style="text-align: center; font-size: 13px; color: #64748b; margin-bottom: 24px;">${subtitle} ${state || '................'}</p>
      <p style="text-align: justify; text-indent: 2em;">${appLanguage === 'th' ? 'คู่สัญญาทั้งสองฝ่ายตกลงทำสัญญาซื้อขายทรัพย์สิน โดยผู้ขายคือ' : 'The parties agree to enter into a sale and purchase agreement whereby the seller is'} <strong>${sellerName || '................................'}</strong> ${appLanguage === 'th' ? 'และผู้ซื้อคือ' : 'and the buyer is'} <strong>${buyerName || '................................'}</strong> ${appLanguage === 'th' ? 'สำหรับทรัพย์สินดังต่อไปนี้' : 'for the real property described below'}.</p>
      <div style="margin-top: 16px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; background: #f8fafc;">
        <p><strong>${appLanguage === 'th' ? 'ประเภททรัพย์สิน' : 'Property type'}:</strong> ${propertyCategory || '-'}</p>
        <p><strong>${appLanguage === 'th' ? 'รายละเอียดทรัพย์สิน' : 'Description'}:</strong> ${productName || '-'}</p>
        <p><strong>${appLanguage === 'th' ? 'ที่ตั้ง' : 'Address'}:</strong> ${propertyAddress || '-'}</p>
        <p><strong>${appLanguage === 'th' ? 'พื้นที่' : 'Area'}:</strong> ${propertyArea || '-'}</p>
        <p><strong>${appLanguage === 'th' ? 'ชั้น / เลขที่' : 'Floor / unit no.'}:</strong> ${propertyFloor || '-'}</p>
        <p><strong>${appLanguage === 'th' ? 'ราคาขาย' : 'Sale price'}:</strong> ${formatMoney(propertyPrice)} ${currency}</p>
      </div>
      <p style="margin-top: 16px; text-align: justify;">${appLanguage === 'th' ? 'ผู้ขายยินยอมโอนกรรมสิทธิ์ให้แก่ผู้ซื้อเมื่อผู้ซื้อชำระเงินครบถ้วนตามเงื่อนไข' : 'The seller undertakes to transfer ownership to the buyer upon full payment under the agreed terms'} <strong>${paymentMethod}</strong> ${appLanguage === 'th' ? 'และส่งมอบทรัพย์สินตามวันที่' : 'and deliver the property on'} <strong>${formattedDeadline}</strong>.</p>
      <p style="margin-top: 16px; text-align: justify;">${appLanguage === 'th' ? 'หากผู้ซื้อไม่ชำระเงินตามกำหนด ผู้ขายมีสิทธิ์ยกเลิกสัญญาและเก็บเงินมัดจำตามจำนวน' : 'If the buyer fails to pay as agreed, the seller may terminate the agreement and retain the deposit in the amount of'} <strong>${formatMoney(formData.depositAmount)} ${currency}</strong>.</p>
      <div style="margin-top: 24px; display: flex; justify-content: space-between; gap: 12px;">
        <div style="width: 48%; text-align: center;">${appLanguage === 'th' ? 'ลงชื่อผู้ซื้อ' : 'Buyer signature'}<br/>(${buyerSigner || buyerName || '................................'})</div>
        <div style="width: 48%; text-align: center;">${appLanguage === 'th' ? 'ลงชื่อผู้ขาย' : 'Seller signature'}<br/>(${sellerSigner || sellerName || '................................'})</div>
      </div>
    </div>`;
}
