import type { ContractData, Language } from '../types';
import { formatDisplayDate } from './templateHelpers';

export function generateVehicleSaleAgreementHtml({ appLanguage, formData, formatMoney, thaiBahtText }: {
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
    state,
    contractDate,
    deliveryDeadline,
    paymentMethod,
    depositAmount,
    vehicleBrand,
    vehicleModel,
    vehicleYear,
    vehiclePlate,
    vehicleColor,
    vehicleMileage,
    vehiclePrice,
    currency,
  } = formData;

  const formattedContractDate = contractDate ? formatDisplayDate(contractDate, appLanguage) : '';
  const formattedDeliveryDate = deliveryDeadline ? formatDisplayDate(deliveryDeadline, appLanguage) : '';
  const salePriceText = formatMoney(vehiclePrice);
  const depositText = formatMoney(depositAmount);
  const amountInWords = currency === 'THB' ? thaiBahtText(vehiclePrice) : `${salePriceText} ${currency}`;

  if (appLanguage === 'th') {
    return `
      <div style="font-family: 'Sarabun', 'sans-serif'; line-height: 1.7; color: #1e293b; max-width: 860px; margin: 0 auto; padding: 24px;">
        <h1 style="text-align: center; font-size: 28px; font-weight: 700; margin-bottom: 14px;">หนังสือสัญญาซื้อขายรถยนต์</h1>
        <p style="text-align: center; font-size: 15px; color: #64748b; margin-bottom: 8px;">ทำขึ้น ณ ${state || '[ระบุสถานที่ทำสัญญา เช่น บ้านเลขที่ หรือสถานที่ซื้อขาย]'}</p>
        <p style="text-align: center; font-size: 15px; color: #64748b; margin-bottom: 24px;">วันที่ ${formattedContractDate || '[วัน]'} ${formattedContractDate ? '' : 'เดือน [เดือน]'} ${formattedContractDate ? '' : 'พ.ศ. [ปี]'}</p>
        <p style="font-size: 15px; text-align: justify; margin-bottom: 22px; text-indent: 2em;">
          สัญญาฉบับนี้ทำขึ้นระหว่าง <strong>${sellerName || '[ชื่อ-นามสกุล ผู้ขาย]'}</strong> ${sellerAddress ? `อยู่บ้านเลขที่ ${sellerAddress}` : 'อยู่บ้านเลขที่ [เลขที่บ้าน]'} ${sellerTaxId ? `เลขประจำตัวประชาชนเลขที่ ${sellerTaxId}` : 'เลขประจำตัวประชาชนเลขที่ [เลขประจำตัวประชาชน]'} ${sellerSigner ? `ซึ่งต่อไปในสัญญานี้จะเรียกว่า <strong>“ผู้ขาย”</strong> และผู้ขายได้มอบอำนาจให้ ${sellerSigner}` : 'ซึ่งต่อไปในสัญญานี้จะเรียกว่า <strong>“ผู้ขาย”</strong>'}
        </p>
        <p style="font-size: 15px; text-align: justify; margin-bottom: 24px; text-indent: 2em;">
          กับ <strong>${buyerName || '[ชื่อ-นามสกุล ผู้ซื้อ]'}</strong> ${buyerAddress ? `อยู่บ้านเลขที่ ${buyerAddress}` : 'อยู่บ้านเลขที่ [เลขที่บ้าน]'} ${buyerTaxId ? `เลขประจำตัวประชาชนเลขที่ ${buyerTaxId}` : 'เลขประจำตัวประชาชนเลขที่ [เลขประจำตัวประชาชน]'} ${buyerSigner ? `ซึ่งต่อไปในสัญญานี้จะเรียกว่า <strong>“ผู้ซื้อ”</strong> และผู้ซื้อได้มอบอำนาจให้ ${buyerSigner}` : 'ซึ่งต่อไปในสัญญานี้จะเรียกว่า <strong>“ผู้ซื้อ”</strong>'}
        </p>
        <p style="font-size: 15px; text-align: justify; margin-bottom: 18px;">คู่สัญญาทั้งสองฝ่ายตกลงทำสัญญาซื้อขายรถยนต์กันโดยมีข้อความและเงื่อนไขดังต่อไปนี้:</p>
        <h2 style="font-size: 17px; font-weight: 700; margin-bottom: 12px;">ข้อ 1. ข้อตกลงซื้อขายและทรัพย์สินที่ซื้อขาย</h2>
        <div style="margin-bottom: 18px; padding: 18px; border: 1px solid #e2e8f0; border-radius: 14px; background: #f8fafc; font-size: 15px;">
          <p><strong>ยี่ห้อรถ:</strong> ${vehicleBrand || '[ระบุยี่ห้อ เช่น Toyota]'}</p>
          <p><strong>รุ่น / แบบ:</strong> ${vehicleModel || '[ระบุรุ่น เช่น Camry / Sedan]'}</p>
          <p><strong>สีรถ:</strong> ${vehicleColor || '[ระบุสีตามเล่มทะเบียน]'}</p>
          <p><strong>หมายเลขทะเบียน:</strong> ${vehiclePlate || '[ระบุหมายเลขทะเบียน]'} จังหวัด [ระบุจังหวัด]</p>
          <p><strong>หมายเลขตัวรถ (Chassis No.):</strong> [ระบุหมายเลขตัวรถ]</p>
          <p><strong>หมายเลขเครื่องยนต์ (Engine No.):</strong> [ระบุหมายเลขเครื่องยนต์]</p>
          <p><strong>ปีจดทะเบียน:</strong> พ.ศ. ${vehicleYear || '[ระบุปี พ.ศ.]'}</p>
        </div>
        <h2 style="font-size: 17px; font-weight: 700; margin-bottom: 12px;">ข้อ 2. ราคาและการชำระเงิน</h2>
        <p style="font-size: 15px; text-align: justify; margin-bottom: 18px; text-indent: 2em;">คู่สัญญาได้ตกลงราคาซื้อขายรถยนต์คันดังกล่าวข้างต้น เป็นจำนวนเงินทั้งสิ้น <strong>${salePriceText} บาท</strong> (${amountInWords}) โดยผู้ซื้อตกลงชำระเงินให้แก่ผู้ขายตามเงื่อนไขดังต่อไปนี้:</p>
        <ul style="padding-left: 1.25rem; margin-bottom: 18px; font-size: 15px;">
          <li><strong>กรณีชำระเงินเต็มจำนวนในวันทำสัญญา:</strong> ผู้ซื้อได้ชำระเงินค่ารถยนต์เต็มจำนวนเป็นเงิน <strong>${salePriceText} บาท</strong> ให้แก่ผู้ขายเรียบร้อยแล้วในขณะทำสัญญานี้ และผู้ขายได้รับเงินจำนวนดังกล่าวไว้ถูกต้องครบถ้วนแล้ว</li>
          <li><strong>กรณีมีการวางมัดจำและชำระส่วนที่เหลือ:</strong><br/><strong>งวดที่ 1 (เงินมัดจำ):</strong> ผู้ซื้อได้ชำระเงินมัดจำจำนวน <strong>${depositText} บาท</strong> ให้แก่ผู้ขายไว้ในวันทำสัญญานี้ และผู้ขายได้รับเงินจำนวนดังกล่าวไว้ถูกต้องแล้ว<br/><strong>งวดที่ 2 (ส่วนที่เหลือ):</strong> ผู้ซื้อตกลงจะชำระเงินส่วนที่เหลือจำนวน [........................] บาท ให้แก่ผู้ขายภายในวันที่ ${formattedDeliveryDate || '[วัน]'} ${formattedDeliveryDate ? '' : 'เดือน [เดือน]'} ${formattedDeliveryDate ? '' : 'พ.ศ. [ปี]'} ณ [ระบุวิธีการ/สถานที่ชำระเงิน เช่น โอนเข้าบัญชีธนาคารของผู้ขาย]</li>
        </ul>
        <h2 style="font-size: 17px; font-weight: 700; margin-bottom: 12px;">ข้อ 3. การส่งมอบรถยนต์และความรับผิดชอบ</h2>
        <ol style="padding-left: 1.25rem; margin-bottom: 18px; font-size: 15px; list-style-type: decimal;">
          <li style="margin-bottom: 10px;">ผู้ขายตกลงจะส่งมอบรถยนต์พร้อมกุญแจรถ คู่มือจดทะเบียนรถยนต์ (เล่มทะเบียนจริง) และเอกสารประกอบการโอนกรรมสิทธิ์ทั้งหมดให้แก่ผู้ซื้อในวันที่ ${formattedDeliveryDate || '[วัน]'} ${formattedDeliveryDate ? '' : 'เดือน [เดือน]'} ${formattedDeliveryDate ? '' : 'พ.ศ. [ปี]'} เวลา [เวลา] น.</li>
          <li style="margin-bottom: 10px;"><strong>ความรับผิดก่อนการส่งมอบ:</strong> ค่าภาษีรถยนต์ประจำปี ค่าปรับจราจร ค่าผ่านทาง หรือความรับผิดใด ๆ อันเกิดจากการใช้รถยนต์ก่อนวันและเวลาส่งมอบ ให้เป็นความรับผิดชอบของผู้ขาย</li>
          <li><strong>ความรับผิดหลังการส่งมอบ:</strong> ความเสียหาย ค่าใช้จ่าย หรือความรับผิดใด ๆ อันเกิดจากการใช้รถยนต์ตั้งแต่วันและเวลาส่งมอบเป็นต้นไป ให้เป็นความรับผิดชอบของผู้ซื้อ</li>
        </ol>
        <h2 style="font-size: 17px; font-weight: 700; margin-bottom: 12px;">ข้อ 4. คำรับรองของผู้ขายเกี่ยวกับการโอนกรรมสิทธิ์</h2>
        <ol style="padding-left: 1.25rem; margin-bottom: 18px; font-size: 15px; list-style-type: decimal;">
          <li style="margin-bottom: 10px;">ผู้ขายรับรองว่ารถยนต์คันที่ซื้อขายนี้เป็นกรรมสิทธิ์โดยชอบด้วยกฎหมายของผู้ขาย ปลอดจากการจำนำ จำนอง หรือภาระผูกพันใด ๆ และไม่ใช่รถยนต์ที่ได้มาโดยมิชอบด้วยกฎหมาย</li>
          <li style="margin-bottom: 10px;">ผู้ขายตกลงจะลงนามในเอกสารใบมอบอำนาจ แบบคำขอโอนและรับโอน และเอกสารอื่นใดที่จำเป็น เพื่อให้ผู้ซื้อสามารถดำเนินการโอนกรรมสิทธิ์ทางทะเบียน ณ กรมการขนส่งทางบกได้โดยชอบ</li>
          <li>หากปรากฏในภายหลังว่าไม่สามารถโอนกรรมสิทธิ์รถยนต์คันนี้ให้เป็นชื่อของผู้ซื้อได้เนื่องจากเหตุขัดข้องทางกฎหมาย หรือเอกสารจากผู้ขายไม่ถูกต้อง/ไม่ครบถ้วน หรือเป็นรถสวมทะเบียน ผู้ขายตกลงยินยอมคืนเงินค่ารถยนต์ที่ได้รับไปแล้วทั้งหมดให้แก่ผู้ซื้อทันที และผู้ซื้อจะส่งมอบรถยนต์คืนให้แก่ผู้ขายในสภาพเดิม</li>
        </ol>
        <h2 style="font-size: 17px; font-weight: 700; margin-bottom: 12px;">ข้อ 5. ค่าธรรมเนียมและค่าภาษีอากร</h2>
        <p style="font-size: 15px; text-align: justify; margin-bottom: 22px; text-indent: 2em;">ค่าธรรมเนียมในการโอนกรรมสิทธิ์ ค่าอากรแสตมป์ และค่าใช้จ่ายอื่น ๆ ที่เกิดขึ้นจากการโอนทะเบียนรถยนต์ ณ กรมการขนส่งทางบก คู่สัญญาตกลงให้: <strong>[ผู้ซื้อเป็นผู้รับภาระทั้งหมด / ผู้ขายเป็นผู้รับภาระทั้งหมด / ผู้ซื้อและผู้ขายร่วมกันรับภาระฝ่ายละครึ่งหนึ่ง]</strong></p>
        <h2 style="font-size: 17px; font-weight: 700; margin-bottom: 12px;">ข้อ 6. การผิดสัญญา</h2>
        <p style="font-size: 15px; text-align: justify; margin-bottom: 18px; text-indent: 2em;">หากฝ่ายใดฝ่ายหนึ่งผิดสัญญาข้อหนึ่งข้อใดข้างต้น คู่สัญญาอีกฝ่ายมีสิทธิบอกเลิกสัญญาและเรียกร้องค่าเสียหายที่เกิดขึ้นจริงได้ทันที โดยมีเงื่อนไขเพิ่มเติมดังนี้:</p>
        <ul style="padding-left: 1.25rem; margin-bottom: 24px; font-size: 15px;">
          <li style="margin-bottom: 10px;">หากผู้ซื้อผิดสัญญา ไม่ชำระเงินส่วนที่เหลือ หรือไม่ปฏิบัติตามสัญญา ผู้ขายมีสิทธิริบเงินมัดจำทั้งหมดและบอกเลิกสัญญาได้ทันที</li>
          <li>หากผู้ขายผิดสัญญา ไม่ส่งมอบรถยนต์ หรือส่งมอบเอกสารการโอนไม่ได้ ผู้ขายยินยอมคืนเงินมัดจำทั้งหมดพร้อมจ่ายค่าปรับจำนวนเท่ากับเงินมัดจำให้แก่ผู้ซื้อ และผู้ซื้อมีสิทธิบอกเลิกสัญญา</li>
        </ul>
        <p style="font-size: 15px; text-align: justify; margin-bottom: 24px; text-indent: 2em;">สัญญาฉบับนี้ทำขึ้นเป็นสองฉบับมีข้อความถูกต้องตรงกัน คู่สัญญาต่างได้อ่านและเข้าใจข้อความในสัญญานี้โดยละเอียดตลอดแล้ว จึงได้ลงลายมือชื่อไว้เป็นสำคัญต่อหน้าพยาน และต่างยึดถือไว้ฝ่ายละหนึ่งฉบับ</p>
        <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; font-size: 15px;">
          <div>ลงชื่อ ...................................................... ผู้ขาย<br/>( ${sellerSigner || sellerName || '[ชื่อ-นามสกุล ผู้ขาย]'} )</div>
          <div>ลงชื่อ ...................................................... ผู้ซื้อ<br/>( ${buyerSigner || buyerName || '[ชื่อ-นามสกุล ผู้ซื้อ]'} )</div>
          <div>ลงชื่อ ...................................................... พยาน<br/>( ...................................................... )</div>
          <div>ลงชื่อ ...................................................... พยาน<br/>( ...................................................... )</div>
        </div>
      </div>`;
  }

  return `
    <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #1e293b; max-width: 860px; margin: 0 auto; padding: 24px;">
      <div style="float: right; border: 1px dashed #94a3b8; padding: 15px; font-size: 10px; text-align: center; color: #64748b; margin-bottom: 20px;">STAMP DUTY<br>AFFIXED HERE</div>
      <div style="clear: both;"></div>
      <h1 style="text-align: center; font-size: 28px; font-weight: 700; margin-bottom: 12px; color: #0f172a;">Vehicle Sale Agreement</h1>
      <p style="text-align: center; font-size: 14px; color: #475569; margin-bottom: 24px;">Executed at ${state || '[location]'}</p>
      <p style="font-size: 15px; text-align: justify; margin-bottom: 20px; text-indent: 2em;">This Vehicle Sale Agreement is made between <strong>${sellerName || '[Seller name]'}</strong> ${sellerAddress ? `located at ${sellerAddress}` : ''} and <strong>${buyerName || '[Buyer name]'}</strong> ${buyerAddress ? `located at ${buyerAddress}` : ''}. The seller agrees to sell and the buyer agrees to buy the vehicle described below.</p>
      <div style="margin-bottom: 18px; padding: 18px; border: 1px solid #e2e8f0; border-radius: 14px; background: #f8fafc; font-size: 15px;">
        <p><strong>Brand / Model:</strong> ${vehicleBrand || '[Brand]'} ${vehicleModel || ''}</p>
        <p><strong>Year:</strong> ${vehicleYear || '[Year]'}</p>
        <p><strong>Plate:</strong> ${vehiclePlate || '[Plate]'}</p>
        <p><strong>Color:</strong> ${vehicleColor || '[Color]'}</p>
        <p><strong>Mileage:</strong> ${vehicleMileage || '[Mileage]'}</p>
        <p><strong>Sale Price:</strong> ${salePriceText} ${currency}</p>
      </div>
      <p style="font-size: 15px; text-align: justify; margin-bottom: 18px; text-indent: 2em;">The buyer agrees to pay the total sale price of <strong>${salePriceText} ${currency}</strong> according to the payment terms: <strong>${paymentMethod || '[payment terms]'}</strong>.</p>
      <p style="font-size: 15px; text-align: justify; margin-bottom: 24px; text-indent: 2em;">The vehicle will be delivered on <strong>${formattedDeliveryDate || '[delivery date]'}</strong> and all transfer documents will be provided to complete the ownership transfer.</p>
      <p style="font-size: 15px; text-align: justify; margin-bottom: 24px; text-indent: 2em;">If the buyer fails to pay as agreed, the seller may terminate the contract and retain the deposit amount of <strong>${depositText} ${currency}</strong>.</p>
      <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; font-size: 15px;">
        <div>Seller Signature<br/>(${sellerSigner || sellerName || '[Seller name]'})</div>
        <div>Buyer Signature<br/>(${buyerSigner || buyerName || '[Buyer name]'})</div>
      </div>
    </div>`;
}
