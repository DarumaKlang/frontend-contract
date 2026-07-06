import type { ContractData, ContractType, Language } from '../types';

const formatDisplayDate = (value: string | undefined, appLanguage: Language) =>
  value
    ? new Date(value).toLocaleDateString(appLanguage === 'th' ? 'th-TH' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '...........................';

export function generateContractHtml({
  contractType,
  appLanguage,
  formData,
  formatMoney,
  thaiBahtText,
}: { contractType: ContractType, appLanguage: Language, formData: ContractData, formatMoney: (n: number) => string, thaiBahtText: (n: number) => string }): string {
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
    employmentPosition,
    employmentStartDate,
    salaryAmount,
    workLocation,
    employmentBenefits,
    employmentTerm,
    testamentDate,
    testamentBeneficiaryName,
    testamentExecutorName,
    testamentWitnesses,
    testamentAssets,
    testamentNotes,
  } = formData;

  const totalValue = quantity * unitPrice;
  const formattedTotal = formatMoney(totalValue);
  const formattedUnit = formatMoney(unitPrice);
  const formattedDeposit = formatMoney(depositAmount);
  const formattedDate = formatDisplayDate(contractDate, appLanguage);
  const formattedDeadline = formatDisplayDate(deliveryDeadline, appLanguage);

  let htmlOutput: string;

  if (contractType === 'vehicle-sale') {
    htmlOutput = `
      <div style="font-family: 'Sarabun', 'sans-serif'; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 8px;">สัญญาซื้อขายรถยนต์</h1>
        <p style="text-align: center; font-size: 13px; color: #64748b; margin-bottom: 24px;">ทำขึ้น ณ ${state || '................'}</p>
        <p style="text-align: justify; text-indent: 2em;">คู่สัญญาทั้งสองฝ่ายได้ตกลงทำสัญญาซื้อขายรถยนต์ โดยผู้ขายคือ <strong>${sellerName || '................................'}</strong> และผู้ซื้อคือ <strong>${buyerName || '................................'}</strong> ตามรายละเอียดดังนี้</p>
        <div style="margin-top: 16px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; background: #f8fafc;">
          <p><strong>ยี่ห้อ / รุ่น:</strong> ${formData.vehicleBrand || '-'} ${formData.vehicleModel || '-'}</p>
          <p><strong>ปี:</strong> ${formData.vehicleYear || '-'}</p>
          <p><strong>ป้ายทะเบียน:</strong> ${formData.vehiclePlate || '-'}</p>
          <p><strong>สี:</strong> ${formData.vehicleColor || '-'}</p>
          <p><strong>เลขไมล์:</strong> ${formData.vehicleMileage || '-'}</p>
          <p><strong>ราคาขาย:</strong> ${formatMoney(formData.vehiclePrice)} ${currency}</p>
        </div>
        <p style="margin-top: 16px; text-align: justify;">ผู้ขายยินยอมโอนทรัพย์สินและเอกสารการครอบครองรถให้แก่ผู้ซื้อ เมื่อผู้ซื้อชำระเงินครบถ้วนตามเงื่อนไข <strong>${paymentMethod}</strong> และส่งมอบรถตามวันที่ <strong>${formattedDeadline}</strong></p>
        <p style="margin-top: 16px; text-align: justify;">หากผู้ซื้อไม่ชำระเงินตามกำหนด ผู้ขายมีสิทธิ์ยกเลิกสัญญาและเก็บเงินมัดจำตามจำนวน <strong>${formattedDeposit} ${currency}</strong></p>
        <div style="margin-top: 24px; display: flex; justify-content: space-between; gap: 12px;">
          <div style="width: 48%; text-align: center;">ลงชื่อผู้ซื้อ<br/>(${buyerSigner || buyerName || '................................'})</div>
          <div style="width: 48%; text-align: center;">ลงชื่อผู้ขาย<br/>(${sellerSigner || sellerName || '................................'})</div>
        </div>
      </div>`;
  } else if (contractType === 'property-sale') {
    const title = appLanguage === 'th' ? 'สัญญาซื้อขายอสังหาริมทรัพย์' : 'Property Sale Agreement';
    const subtitle = appLanguage === 'th' ? 'ทำขึ้น ณ' : 'Executed at';
    htmlOutput = `
      <div style="font-family: 'Sarabun', 'sans-serif'; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 8px;">${title}</h1>
        <p style="text-align: center; font-size: 13px; color: #64748b; margin-bottom: 24px;">${subtitle} ${state || '................'}</p>
        <p style="text-align: justify; text-indent: 2em;">${appLanguage === 'th' ? 'คู่สัญญาทั้งสองฝ่ายตกลงทำสัญญาซื้อขายทรัพย์สิน โดยผู้ขายคือ' : 'The parties agree to enter into a sale and purchase agreement whereby the seller is'} <strong>${sellerName || '................................'}</strong> ${appLanguage === 'th' ? 'และผู้ซื้อคือ' : 'and the buyer is'} <strong>${buyerName || '................................'}</strong> ${appLanguage === 'th' ? 'สำหรับทรัพย์สินดังต่อไปนี้' : 'for the real property described below'}.</p>
        <div style="margin-top: 16px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; background: #f8fafc;">
          <p><strong>${appLanguage === 'th' ? 'ประเภททรัพย์สิน' : 'Property type'}:</strong> ${formData.propertyCategory || '-'}</p>
          <p><strong>${appLanguage === 'th' ? 'รายละเอียดทรัพย์สิน' : 'Description'}:</strong> ${productName || '-'}</p>
          <p><strong>${appLanguage === 'th' ? 'ที่ตั้ง' : 'Address'}:</strong> ${formData.propertyAddress || '-'}</p>
          <p><strong>${appLanguage === 'th' ? 'พื้นที่' : 'Area'}:</strong> ${formData.propertyArea || '-'}</p>
          <p><strong>${appLanguage === 'th' ? 'ชั้น / เลขที่' : 'Floor / unit no.'}:</strong> ${formData.propertyFloor || '-'}</p>
          <p><strong>${appLanguage === 'th' ? 'ราคาขาย' : 'Sale price'}:</strong> ${formatMoney(formData.propertyPrice)} ${currency}</p>
        </div>
        <p style="margin-top: 16px; text-align: justify;">${appLanguage === 'th' ? 'ผู้ขายยินยอมโอนกรรมสิทธิ์ให้แก่ผู้ซื้อเมื่อผู้ซื้อชำระเงินครบถ้วนตามเงื่อนไข' : 'The seller undertakes to transfer ownership to the buyer upon full payment under the agreed terms'} <strong>${paymentMethod}</strong> ${appLanguage === 'th' ? 'และส่งมอบทรัพย์สินตามวันที่' : 'and deliver the property on'} <strong>${formattedDeadline}</strong>.</p>
        <p style="margin-top: 16px; text-align: justify;">${appLanguage === 'th' ? 'หากผู้ซื้อไม่ชำระเงินตามกำหนด ผู้ขายมีสิทธิ์ยกเลิกสัญญาและเก็บเงินมัดจำตามจำนวน' : 'If the buyer fails to pay as agreed, the seller may terminate the agreement and retain the deposit in the amount of'} <strong>${formattedDeposit} ${currency}</strong>.</p>
        <div style="margin-top: 24px; display: flex; justify-content: space-between; gap: 12px;">
          <div style="width: 48%; text-align: center;">${appLanguage === 'th' ? 'ลงชื่อผู้ซื้อ' : 'Buyer signature'}<br/>(${buyerSigner || buyerName || '................................'})</div>
          <div style="width: 48%; text-align: center;">${appLanguage === 'th' ? 'ลงชื่อผู้ขาย' : 'Seller signature'}<br/>(${sellerSigner || sellerName || '................................'})</div>
        </div>
      </div>`;
  } else if (contractType === 'employment' && appLanguage === 'th') {
    const formattedStartDate = formatDisplayDate(employmentStartDate, appLanguage);
    htmlOutput = `
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
  } else if (contractType === 'employment' && appLanguage === 'en') {
    const formattedStartDate = formatDisplayDate(employmentStartDate, appLanguage);
    htmlOutput = `
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
  } else if (contractType === 'testament' && appLanguage === 'th') {
    const formattedTestamentDate = formatDisplayDate(testamentDate, appLanguage);
    htmlOutput = `
      <div style="font-family: 'Sarabun', 'sans-serif'; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 8px;">พินัยกรรม</h1>
        <p style="text-align: center; font-size: 13px; color: #64748b; margin-bottom: 24px;">ทำขึ้น ณ ${state || '................'}</p>
        <p style="text-align: justify; text-indent: 2em;">เรา <strong>${sellerName || '................................'}</strong> ซึ่งมีสภาพจิตและสติปัญญาสมบูรณ์ ขอยืนยันว่า เอกสารฉบับนี้เป็นพินัยกรรมของเรา ลงวันที่ ${formattedTestamentDate}</p>
        <p style="margin-top: 16px; text-align: justify;">โดยเรายินยอมให้ผลไม้จากทรัพย์สินและทรัพย์สินทั้งปวงของเรา ให้แก่บุคคลต่อไปนี้ตามจำนวนและสัดส่วนที่กำหนด:</p>
        <div style="margin-top: 16px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; background: #f8fafc;">
          <p><strong>ชื่อผู้รับมรดก:</strong> ${testamentBeneficiaryName || '-'}</p>
          <p><strong>ชื่อผู้บริหารจัดการมรดก (Executor):</strong> ${testamentExecutorName || '-'}</p>
          <p><strong>พยาน:</strong> ${testamentWitnesses || '-'}</p>
          <p><strong>ทรัพย์สินที่ประกาศให้มรดก:</strong> ${testamentAssets || '-'}</p>
          <p><strong>หมายเหตุเพิ่มเติม:</strong> ${testamentNotes || '-'}</p>
        </div>
        <p style="margin-top: 16px; text-align: justify;">ข้าพเจ้ายืนยันว่าได้ทำพินัยกรรมฉบับนี้ด้วยความเต็มใจและสติปัญญาสมบูรณ์ ไม่มีบังคับ ข่มขู่ หรือผลกระทบจากบุคคลอื่น</p>
        <div style="margin-top: 24px; display: flex; justify-content: space-between; gap: 12px;">
          <div style="width: 48%; text-align: center;">ลงชื่อผู้ทำพินัยกรรม<br/>(${sellerName || '................................'})<br/>วันที่ ${formattedTestamentDate}</div>
          <div style="width: 48%; text-align: center;">ลงชื่อพยาน (ที่ 1)<br/>(...........................)<br/>(...........................)</div>
        </div>
      </div>`;
  } else if (contractType === 'testament' && appLanguage === 'en') {
    const formattedTestamentDate = formatDisplayDate(testamentDate, appLanguage);
    htmlOutput = `
      <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 8px;">Last Will and Testament</h1>
        <p style="text-align: center; font-size: 13px; color: #64748b; margin-bottom: 24px;">Executed at ${state || '................'}</p>
        <p style="text-align: justify; text-indent: 2em;">I, <strong>${sellerName || '................................'}</strong>, being of sound mind and memory, do hereby declare this to be my Last Will and Testament, made this ${formattedTestamentDate}.</p>
        <p style="margin-top: 16px; text-align: justify;">I hereby give, devise, and bequeath my entire estate, real and personal property, to the following beneficiary as stated:</p>
        <div style="margin-top: 16px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; background: #f8fafc;">
          <p><strong>Beneficiary Name:</strong> ${testamentBeneficiaryName || '-'}</p>
          <p><strong>Executor Name:</strong> ${testamentExecutorName || '-'}</p>
          <p><strong>Witnesses:</strong> ${testamentWitnesses || '-'}</p>
          <p><strong>Estate and Assets:</strong> ${testamentAssets || '-'}</p>
          <p><strong>Additional Notes:</strong> ${testamentNotes || '-'}</p>
        </div>
        <p style="margin-top: 16px; text-align: justify;">I declare that I have executed this Will of my own free will and with sound mind. This Will is made without duress, undue influence, or any coercion from any other person.</p>
        <div style="margin-top: 24px; display: flex; justify-content: space-between; gap: 12px;">
          <div style="width: 48%; text-align: center;">Testator Signature<br/>(${sellerName || '................................'})<br/>Dated: ${formattedTestamentDate}</div>
          <div style="width: 48%; text-align: center;">Witness Signature (1)<br/>(...........................)<br/>(...........................)</div>
        </div>
      </div>`;
  } else if (appLanguage === 'th') {
    htmlOutput = `
      <div style="font-family: 'Sarabun', 'sans-serif'; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 20px;">
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
          สัญญานี้ถูกควบคุมและตีความตามกฎหมายของประเทศ <strong>${country}</strong> และข้อพิพาทที่ไม่สามารถไกล่เกลี่ยกันได้ ให้ยื่นคำฟ้องต่อศาลที่มีอำนาจในเขต <strong>${state || 'ถิ่นฐานคู่สัญญา'}</strong>
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
  } else {
    // Default English lease agreement
    htmlOutput = `
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

  return htmlOutput;
}