import type { ContractData, Language } from '../types';
import { formatDisplayDate } from './templateHelpers';

export function generateLeaseAgreementHtml({ appLanguage, formData, formatMoney, thaiBahtText }: {
  appLanguage: Language;
  formData: ContractData;
  formatMoney: (n: number) => string;
  thaiBahtText: (n: number) => string;
}): string {
  const {
    sellerName,
    sellerAddress,
    sellerTaxId,
    sellerSigner,
    buyerName,
    buyerAddress,
    buyerTaxId,
    buyerSigner,
    productName,
    quantity,
    unit,
    unitPrice,
    currency,
    deliveryDeadline,
    deliveryMethod,
    paymentMethod,
    depositAmount,
    penaltyRate,
    contractDate,
    state,
    country,
  } = formData;

  const totalValue = quantity * unitPrice;
  const formattedTotal = formatMoney(totalValue);
  const formattedUnit = formatMoney(unitPrice);
  const formattedDeposit = formatMoney(depositAmount);
  const formattedDate = formatDisplayDate(contractDate, appLanguage);
  const formattedDeadline = formatDisplayDate(deliveryDeadline, appLanguage);

  if (appLanguage === 'th') {
    return `
      <div style="font-family: 'Sarabun', 'sans-serif'; line-height: 1.7; color: #1e293b; max-width: 860px; margin: 0 auto; padding: 24px;">
        <div style="float: right; border: 1px dashed #94a3b8; padding: 15px; font-size: 10px; text-align: center; color: #64748b; margin-bottom: 20px;">
          ติดอากรแสตมป์<br>ตามอัตราที่กฎหมายกำหนด
        </div>
        <div style="clear: both;"></div>
        <h1 style="text-align: center; font-size: 22px; font-weight: bold; margin-bottom: 5px; color: #0f172a;">สัญญาเช่าคอนโดมิเนียม</h1>
        <p style="text-align: center; font-size: 12px; color: #475569; margin-bottom: 30px;">ทำขึ้น ณ ${state || '...........................'}</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 14px;">
          <tr>
            <td style="width: 40%; vertical-align: top;"><strong>วันที่ทำสัญญา:</strong> ${formattedDate}</td>
            <td style="width: 60%; vertical-align: top; text-align: right;"><strong>สถานที่ทำสัญญา:</strong> ${state || '...........................'}, ประเทศ ${country}</td>
          </tr>
        </table>
        <div style="font-size: 14px; text-align: justify; margin-bottom: 20px; text-indent: 2.5em;">
          สัญญาฉบับนี้ทำขึ้นระหว่าง <strong>${sellerName || '......................................................'}</strong>
          ตั้งอยู่ที่ ${sellerAddress || '......................................................'}
          ถือบัตรประชาชน/เลขทะเบียนนิติบุคคลเลขที่ ${sellerTaxId || '..................................'}
          ${sellerSigner ? `โดยมี <strong>${sellerSigner}</strong> เป็นผู้รับมอบอำนาจหรือผู้มีอำนาจลงนามทำการแทน` : ''}
          ซึ่งต่อไปในสัญญานี้จะเรียกว่า <strong>"ผู้ให้เช่า"</strong> ฝ่ายหนึ่ง
        </div>
        <div style="font-size: 14px; text-align: justify; margin-bottom: 25px; text-indent: 2.5em;">
          กับ <strong>${buyerName || '......................................................'}</strong>
          ตั้งอยู่ที่ ${buyerAddress || '......................................................'}
          ถือบัตรประชาชน/เลขทะเบียนนิติบุคคลเลขที่ ${buyerTaxId || '..................................'}
          ${buyerSigner ? `โดยมี <strong>${buyerSigner}</strong> เป็นผู้รับมอบอำนาจหรือผู้มีอำนาจลงนามทำการแทน` : ''}
          ซึ่งต่อไปในสัญญานี้จะเรียกว่า <strong>"ผู้เช่า"</strong> อีกฝ่ายหนึ่ง
        </div>
        <p style="font-size: 14px; margin-bottom: 15px;">คู่สัญญาได้ตกลงทำสัญญาเช่าคอนโดมิเนียมตามรายละเอียดและเงื่อนไขดังต่อไปนี้:</p>
        <h3 style="font-size: 15px; font-weight: bold; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; color: #0f172a;">ข้อ 1. รายละเอียดทรัพย์สินและค่าเช่ารายเดือน</h3>
        <p style="font-size: 14px; margin-bottom: 10px;">ผู้ให้เช่าตกลงให้ผู้เช่าเช่ายูนิตคอนโดมิเนียมตามรายละเอียดด้านล่าง โดยค่าเช่ารายเดือนแสดงไว้ดังนี้:</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 15px; text-align: left;">
          <thead>
            <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
              <th style="padding: 10px; border: 1px solid #e2e8f0;">รายละเอียดยูนิตเช่า</th>
              <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: center; width: 12%;">จำนวน</th>
              <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: center; width: 12%;">หน่วย</th>
              <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: right; width: 20%;">ค่าเช่าต่อเดือน (${currency})</th>
              <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: right; width: 22%;">รวมค่าเช่าต่อเดือน (${currency})</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">${productName || 'กรุณากรอกรายละเอียดยูนิตเช่า'}</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: center;">${quantity}</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: center;">${unit}</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right;">${formattedUnit}</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold; background-color: #f8fafc;">${formattedTotal}</td>
            </tr>
            <tr style="font-weight: bold; background-color: #f1f5f9;">
              <td colspan="4" style="padding: 10px; border: 1px solid #e2e8f0; text-align: right;">รวมค่าเช่ารายเดือนทั้งหมด (${currency})</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right; font-size: 14px; color: #0284c7;">${formattedTotal}</td>
            </tr>
          </tbody>
        </table>
        <p style="font-size: 12px; font-style: italic; color: #475569; margin-bottom: 20px;">(ตัวอักษร: ${currency === 'THB' ? thaiBahtText(totalValue) : `${formattedTotal} ${currency}`})</p>
        <h3 style="font-size: 15px; font-weight: bold; margin-top: 25px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; color: #0f172a;">ข้อ 2. วันเริ่มสัญญาและการเข้าพัก</h3>
        <p style="font-size: 14px; text-align: justify; margin-bottom: 10px;">
          ผู้เช่าสามารถเริ่มเข้าพักได้ตามเงื่อนไขที่กำหนดไว้ในสัญญานี้ <strong>ตั้งแต่วันที่ ${formattedDeadline}</strong>
          โดยมีรายละเอียดว่า <strong>"${deliveryMethod}"</strong>
        </p>
        <p style="font-size: 14px; text-align: justify; margin-bottom: 15px;">ผู้เช่าต้องรับผิดชอบรักษาสภาพอาคารและทรัพย์สินภายในยูนิตตามเงื่อนไขที่กำหนดในสัญญานี้</p>
        <h3 style="font-size: 15px; font-weight: bold; margin-top: 25px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; color: #0f172a;">ข้อ 3. เงื่อนไขการชำระค่าเช่า</h3>
        <p style="font-size: 14px; text-align: justify; margin-bottom: 10px;">คู่สัญญาตกลงชำระค่าเช่าและเงินประกันตามเงื่อนไขดังนี้: <strong>"${paymentMethod}"</strong></p>
        ${depositAmount > 0 ? `<p style="font-size: 14px; text-align: justify; margin-bottom: 10px; text-indent: 2em;">ผู้เช่าได้ชำระเงินประกันจำนวน <strong>${formattedDeposit} ${currency}</strong> ให้แก่ผู้ให้เช่าเป็นที่เรียบร้อยก่อนเข้าพัก และผู้ให้เช่ายินยอมรับเงินประกันดังกล่าว</p>` : ''}
        <h3 style="font-size: 15px; font-weight: bold; margin-top: 25px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; color: #0f172a;">ข้อ 4. เบี้ยปรับการชำระล่าช้า</h3>
        <p style="font-size: 14px; text-align: justify; margin-bottom: 25px;">
          หากผู้เช่าชำระค่าเช่าล่าช้ากว่ากำหนด ผู้เช่ายินยอมชำระเบี้ยปรับในอัตราร้อยละ <strong>${penaltyRate}% ต่อเดือน</strong> ของค่าเช่ารายเดือนที่ค้างชำระ นับตั้งแต่วันที่ล่าช้าจนกว่าจะชำระครบถ้วน
        </p>
        <h3 style="font-size: 15px; font-weight: bold; margin-top: 25px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; color: #0f172a;">ข้อ 5. กฎหมายบังคับใช้และการระงับข้อพิพาท</h3>
        <p style="font-size: 14px; text-align: justify; margin-bottom: 30px;">
          สัญญาฉบับนี้ถูกควบคุมและตีความตามกฎหมายของประเทศ <strong>${country}</strong> และข้อพิพาทที่ไม่สามารถไกล่เกลี่ยกันได้ ให้ยื่นคำฟ้องต่อศาลที่มีอำนาจในเขต <strong>${state || 'ถิ่นฐานคู่สัญญา'}</strong>
        </p>
        <p style="font-size: 14px; margin-bottom: 40px; text-indent: 2.5em;">สัญญาฉบับนี้ทำขึ้นสองฉบับมีข้อความถูกต้องตรงกัน คู่สัญญาได้อ่านและเข้าใจข้อความแล้วเห็นควรลงนามเพื่อให้มีผลผูกพันตามกฎหมาย</p>
        <table style="width: 100%; text-align: center; margin-top: 40px; font-size: 13px; border-collapse: collapse;">
          <tr>
            <td style="width: 50%; padding-bottom: 50px;">ลงชื่อ............................................................ ผู้เช่า<br/>(${buyerSigner || buyerName || '......................................................'})</td>
            <td style="width: 50%; padding-bottom: 50px;">ลงชื่อ............................................................ ผู้ให้เช่า<br/>(${sellerSigner || sellerName || '......................................................'})</td>
          </tr>
          <tr>
            <td>ลงชื่อ............................................................ พยาน<br/>(............................................................)</td>
            <td>ลงชื่อ............................................................ พยาน<br/>(............................................................)</td>
          </tr>
        </table>
      </div>`;
  }

  return `
    <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="float: right; border: 1px dashed #94a3b8; padding: 15px; font-size: 10px; text-align: center; color: #64748b; margin-bottom: 20px;">STAMP DUTY<br>AFFIXED HERE</div>
      <div style="clear: both;"></div>
      <h1 style="text-align: center; font-size: 22px; font-weight: bold; margin-bottom: 5px; color: #0f172a;">CONDOMINIUM LEASE AGREEMENT</h1>
      <p style="text-align: center; font-size: 12px; color: #475569; margin-bottom: 30px;">Executed at ${state || '...........................'}</p>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 14px;">
        <tr>
          <td style="width: 40%; vertical-align: top;"><strong>Date of Agreement:</strong> ${formattedDate}</td>
          <td style="width: 60%; vertical-align: top; text-align: right;"><strong>Jurisdiction:</strong> ${state || '...........................'}, ${country}</td>
        </tr>
      </table>
      <div style="font-size: 14px; text-align: justify; margin-bottom: 20px;">This Lease Agreement is made and entered into by and between <strong>${sellerName || '......................................................'}</strong>, located at ${sellerAddress || '......................................................'}, bearing Tax Identification / National ID Number ${sellerTaxId || '..................................'} ${sellerSigner ? `represented by authorized signer <strong>${sellerSigner}</strong>` : ''} (hereinafter referred to as the <strong>"Landlord"</strong>), and <strong>${buyerName || '......................................................'}</strong>, located at ${buyerAddress || '......................................................'}, bearing Tax Identification / National ID Card Number ${buyerTaxId || '..................................'} ${buyerSigner ? `represented by authorized signer <strong>${buyerSigner}</strong>` : ''} (hereinafter referred to as the <strong>"Tenant"</strong>).</div>
      <p style="font-size: 14px; margin-bottom: 15px;">The Parties agree to lease the condominium unit under the following terms and conditions:</p>
      <h3 style="font-size: 15px; font-weight: bold; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; color: #0f172a;">Section 1. Leased Unit and Monthly Rent</h3>
      <p style="font-size: 14px; margin-bottom: 10px;">The Landlord leases to the Tenant the condominium unit described below for the monthly rent indicated:</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px; text-align: left;">
        <thead>
          <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
            <th style="padding: 10px; border: 1px solid #e2e8f0;">Rental Unit Description</th>
            <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: center; width: 12%;">Qty</th>
            <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: center; width: 12%;">Unit</th>
            <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: right; width: 20%;">Monthly Rent (${currency})</th>
            <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: right; width: 22%;">Total Monthly Rent (${currency})</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">${productName || 'Please specify rental unit details'}</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: center;">${quantity}</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: center;">${unit}</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right;">${formattedUnit}</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold; background-color: #f8fafc;">${formattedTotal}</td>
          </tr>
          <tr style="font-weight: bold; background-color: #f1f5f9;">
            <td colspan="4" style="padding: 10px; border: 1px solid #e2e8f0; text-align: right;">Total Monthly Rent (${currency})</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right; font-size: 14px; color: #0284c7;">${formattedTotal}</td>
          </tr>
        </tbody>
      </table>
      <h3 style="font-size: 15px; font-weight: bold; margin-top: 25px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; color: #0f172a;">Section 2. Lease Commencement & Occupancy</h3>
      <p style="font-size: 14px; text-align: justify; margin-bottom: 10px;">The Tenant may occupy the unit starting on <strong>${formattedDeadline}</strong> under the following move-in condition: <strong>"${deliveryMethod}"</strong>.</p>
      <p style="font-size: 14px; text-align: justify; margin-bottom: 15px;">The Tenant agrees to maintain the condition of the unit and follow the building's rules during the lease term.</p>
      <h3 style="font-size: 15px; font-weight: bold; margin-top: 25px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; color: #0f172a;">Section 3. Rent Payment & Security Deposit</h3>
      <p style="font-size: 14px; text-align: justify; margin-bottom: 10px;">Rent and deposit obligations are agreed as follows: <strong>"${paymentMethod}"</strong>.</p>
      ${depositAmount > 0 ? `<p style="font-size: 14px; text-align: justify; margin-bottom: 10px; text-indent: 2em;">The Tenant has paid a security deposit of <strong>${formattedDeposit} ${currency}</strong> to the Landlord prior to move-in. The Landlord acknowledges receipt of this deposit.</p>` : ''}
      <h3 style="font-size: 15px; font-weight: bold; margin-top: 25px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; color: #0f172a;">Section 4. Late Payment Penalties</h3>
      <p style="font-size: 14px; text-align: justify; margin-bottom: 25px;">If the Tenant fails to pay rent on time, the Tenant will pay a late penalty of <strong>${penaltyRate}% per month</strong> on the overdue monthly rent until payment is made in full.</p>
      <h3 style="font-size: 15px; font-weight: bold; margin-top: 25px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; color: #0f172a;">Section 5. Governing Law & Dispute Resolution</h3>
      <p style="font-size: 14px; text-align: justify; margin-bottom: 30px;">This Agreement shall be governed by the laws of <strong>${country}</strong>. Any dispute arising from this Agreement that cannot be amicably resolved shall be submitted to the courts having jurisdiction over <strong>${state || 'Registered District'}</strong>.</p>
      <p style="font-size: 14px; margin-bottom: 40px;">This Agreement is executed in two counterparts, each of which is equally authentic, and the Parties have read, understood, and agreed to its terms.</p>
      <table style="width: 100%; text-align: center; margin-top: 40px; font-size: 13px; border-collapse: collapse;">
        <tr>
          <td style="width: 50%; padding-bottom: 50px;">Signature:............................................................<br/><strong>Tenant Authorized Signatory</strong><br/>(${buyerSigner || buyerName || '......................................................'})</td>
          <td style="width: 50%; padding-bottom: 50px;">Signature:............................................................<br/><strong>Landlord Authorized Signatory</strong><br/>(${sellerSigner || sellerName || '......................................................'})</td>
        </tr>
        <tr>
          <td>Signature:............................................................<br/>Witness 1<br/>(............................................................)</td>
          <td>Signature:............................................................<br/>Witness 2<br/>(............................................................)</td>
        </tr>
      </table>
    </div>`;
}
