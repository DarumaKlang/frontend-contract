import type { ContractData, Language } from '../types';
import { formatDisplayDate } from './templateHelpers';

export function generateEmploymentAgreementHtml({ appLanguage, formData, formatMoney }: {
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
    employmentPosition,
    employmentStartDate,
    salaryAmount,
    workLocation,
    employmentBenefits,
    employmentTerm,
  } = formData;

  const formattedStartDate = formatDisplayDate(employmentStartDate, appLanguage);

  if (appLanguage === 'th') {
    return `
      <div style="font-family: 'Sarabun', 'sans-serif'; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 8px;">สัญญาจ้างงาน</h1>
        <p style="text-align: center; font-size: 13px; color: #64748b; margin-bottom: 24px;">ทำขึ้น ณ ${state || '................'}</p>
        <p style="text-align: justify; text-indent: 2em;">คู่สัญญาทั้งสองฝ่ายได้ตกลงทำสัญญาจ้างงาน โดยนายจ้างคือ <strong>${sellerName || '................................'}</strong> และลูกจ้างคือ <strong>${buyerName || '................................'}</strong> ตามรายละเอียดดังนี้</p>
        <div style="margin-top: 16px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; background: #f8fafc;">
          <p><strong>ตำแหน่งงาน:</strong> ${employmentPosition || '-'}</p>
          <p><strong>วันเริ่มงาน:</strong> ${formattedStartDate}</p>
          <p><strong>สถานที่ทำงาน:</strong> ${workLocation || '-'}</p>
          <p><strong>เงินเดือน:</strong> ${formatMoney(salaryAmount)} ${currency}</p>
          <p><strong>สวัสดิการ:</strong> ${employmentBenefits || '-'}</p>
          <p><strong>ระยะเวลาจ้าง:</strong> ${employmentTerm || '-'}</p>
        </div>
        <p style="margin-top: 16px; text-align: justify;">นายจ้างตกลงจ่ายเงินเดือนและสวัสดิการตามที่กำหนดข้างต้นให้แก่ลูกจ้างทุกเดือนตามปกติ</p>
        <p style="margin-top: 16px; text-align: justify;">ลูกจ้างตกลงปฏิบัติหน้าที่ของตำแหน่งดังกล่าวด้วยความเต็มใจและรับผิดชอบตามที่นายจ้างมอบหมาย</p>
        <p style="margin-top: 16px; text-align: justify;">สัญญาฉบับนี้มีผลบังคับใช้เริ่มตั้งแต่วันที่ ${formattedStartDate} เป็นต้นไป หรือจนกว่าจะมีการบอกเลิกตามกฎหมาย</p>
        <div style="margin-top: 24px; display: flex; justify-content: space-between; gap: 12px;">
          <div style="width: 48%; text-align: center;">ลงชื่อลูกจ้าง<br/>(${buyerSigner || buyerName || '................................'})</div>
          <div style="width: 48%; text-align: center;">ลงชื่อนายจ้าง<br/>(${sellerSigner || sellerName || '................................'})</div>
        </div>
      </div>`;
  }

  return `
    <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 20px;">
      <h1 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 8px;">Employment Agreement</h1>
      <p style="text-align: center; font-size: 13px; color: #64748b; margin-bottom: 24px;">Executed at ${state || '................'}</p>
      <p style="text-align: justify; text-indent: 2em;">This Agreement is entered into between <strong>${sellerName || '................................'}</strong> (Employer) and <strong>${buyerName || '................................'}</strong> (Employee) effective as of ${formattedStartDate}.</p>
      <div style="margin-top: 16px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; background: #f8fafc;">
        <p><strong>Position:</strong> ${employmentPosition || '-'}</p>
        <p><strong>Start Date:</strong> ${formattedStartDate}</p>
        <p><strong>Work Location:</strong> ${workLocation || '-'}</p>
        <p><strong>Salary:</strong> ${formatMoney(salaryAmount)} ${currency}</p>
        <p><strong>Benefits:</strong> ${employmentBenefits || '-'}</p>
        <p><strong>Term:</strong> ${employmentTerm || '-'}</p>
      </div>
      <p style="margin-top: 16px; text-align: justify;">The Employer agrees to pay the salary and provide benefits as stated above on a regular monthly basis.</p>
      <p style="margin-top: 16px; text-align: justify;">The Employee agrees to perform the duties of the position with diligence and responsibility as assigned by the Employer.</p>
      <p style="margin-top: 16px; text-align: justify;">This Agreement shall be effective from ${formattedStartDate} and shall continue until terminated in accordance with applicable law.</p>
      <div style="margin-top: 24px; display: flex; justify-content: space-between; gap: 12px;">
        <div style="width: 48%; text-align: center;">Employee Signature<br/>(${buyerSigner || buyerName || '................................'})</div>
        <div style="width: 48%; text-align: center;">Employer Signature<br/>(${sellerSigner || sellerName || '................................'})</div>
      </div>
    </div>`;
}
