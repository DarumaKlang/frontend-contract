import type { ContractData, Language } from '../types';
import { formatDisplayDate } from './templateHelpers';

export function generateTestamentHtml({ appLanguage, formData }: {
  appLanguage: Language;
  formData: ContractData;
  formatMoney: (n: number) => string;
  thaiBahtText: (n: number) => string;
}): string {
  const {
    sellerName,
    sellerAddress,
    sellerTaxId,
    state,
    testamentDate,
    testamentBeneficiaryName,
    testamentExecutorName,
    testamentWitnesses,
    testamentAssets,
    testamentNotes,
  } = formData;

  const formattedTestamentDate = formatDisplayDate(testamentDate, appLanguage);
  const dateParts = testamentDate ? new Date(testamentDate) : null;
  const dayText = dateParts ? String(dateParts.getDate()).padStart(2, '0') : '..วัน..';
  const monthText = dateParts ? new Intl.DateTimeFormat('th-TH', { month: 'long' }).format(dateParts) : '..เดือน..';
  const yearText = dateParts ? String(dateParts.getFullYear() + 543) : '..ปี..';
  const personAddress = sellerAddress || '[........] หมู่ที่ [....] ตรอก/ซอย [.................] ถนน [.........................] ตำบล/แขวง [..................] อำเภอ/เขต [..................] จังหวัด [..................]';

  if (appLanguage === 'th') {
    return `
      <div style="font-family: 'Sarabun', 'sans-serif'; line-height: 1.8; color: #1e293b; max-width: 900px; margin: 0 auto; padding: 24px;">
        <h1 style="text-align: center; font-size: 28px; font-weight: bold; margin-bottom: 20px;">พินัยกรรม</h1>
        <p style="font-size: 15px; margin-bottom: 10px;"><strong>ทำที่</strong> ${state || '[ระบุสถานที่ทำสัญญา เช่น บ้านเลขที่... หรือ ที่ทำการ...]'}</p>
        <p style="font-size: 15px; margin-bottom: 18px;"><strong>วันที่</strong> ${dayText} <strong>เดือน</strong> ${monthText} <strong>พ.ศ.</strong> ${yearText}</p>
        <p style="text-align: justify; margin-bottom: 16px; text-indent: 2em;">
          โดยพินัยกรรมฉบับนี้ ข้าพเจ้า <strong>${sellerName || '[ชื่อ-นามสกุล ผู้ทำพินัยกรรม]'}</strong> อายุ [....] ปี
          ถือบัตรประจำตัวประชาชนเลขที่ <strong>[${sellerTaxId || '.............................'}]</strong>
          อยู่บ้านเลขที่ ${personAddress}
        </p>
        <p style="text-align: justify; margin-bottom: 18px; text-indent: 2em;">
          ขณะทำพินัยกรรมฉบับนี้ ข้าพเจ้ามีสติสัมปชัญญะสมบูรณ์ดีทุกประการ ไม่เป็นผู้ไร้ความสามารถหรือเสมือนไร้ความสามารถตามกฎหมาย
          และไม่ได้ถูกข่มขู่ บังคับ ชักจูง หรือหลอกลวงแต่ประการใด ข้าพเจ้าจึงขอทำพินัยกรรมแสดงเจตนาเกื้อหนุนจัดสรรทรัพย์สมบัติของข้าพเจ้าภายหลังที่ข้าพเจ้าถึงแก่กรรมแล้ว ดังมีข้อกำหนดต่อไปนี้
        </p>
        <h3 style="font-size: 16px; font-weight: bold; margin-top: 24px; margin-bottom: 12px;">ข้อ 1. การเพิกถอนพินัยกรรมฉบับก่อนหน้า</h3>
        <p style="text-align: justify; margin-bottom: 18px; text-indent: 2em;">
          ข้าพเจ้าขอเพิกถอนและยกเลิกพินัยกรรม หนังสือสั่งการ หรือเจตนาใด ๆ เกี่ยวกับมรดกของข้าพเจ้าที่ได้ทำขึ้นก่อนหน้าพินัยกรรมฉบับนี้ (หากมี) ทั้งสิ้น
          และให้ถือว่าพินัยกรรมฉบับนี้เป็นพินัยกรรมที่สมบูรณ์และมีผลบังคับใช้แต่เพียงฉบับเดียวเท่านั้น
        </p>
        <h3 style="font-size: 16px; font-weight: bold; margin-top: 20px; margin-bottom: 12px;">ข้อ 2. การจัดสรรและยกทรัพย์สินเฉพาะเจาะจง</h3>
        <p style="text-align: justify; margin-bottom: 12px; text-indent: 2em;">
          เมื่อข้าพเจ้ายถึงแก่กรรมลง ข้าพเจ้าตกลงยกทรัพย์สินและสิทธิ์เรียกร้องต่าง ๆ ของข้าพเจ้าให้แก่บุคคลดังต่อไปนี้:
        </p>
        <ul style="padding-left: 1.25rem; margin-bottom: 18px;">
          <li style="margin-bottom: 10px;"><strong>2.1 ทรัพย์สินประเภทเงินฝากในบัญชีธนาคาร:</strong> เงินฝากในบัญชีธนาคาร [ระบุชื่อธนาคาร] สาขา [ระบุสาขา] ประเภทบัญชี [ระบุประเภท เช่น ออมทรัพย์] เลขที่บัญชี <strong>[...........................]</strong> รวมทั้งดอกผลที่เกิดขึ้นทั้งหมด ขอยกให้แก่ <strong>${testamentBeneficiaryName || '[ชื่อ-นามสกุล ผู้รับมรดก]'}</strong> แต่เพียงผู้เดียว</li>
          <li style="margin-bottom: 10px;"><strong>2.2 ทรัพย์สินประเภทอสังหาริมทรัพย์ (ที่ดินและสิ่งปลูกสร้าง):</strong> ที่ดินตามโฉนดที่ดินเลขที่ [ระบุเลขโฉนด] เลขที่ดิน [ระบุเลขที่ดิน] ตั้งอยู่ที่ตำบล [ระบุ ตำบล] อำเภอ [ระบุอำเภอ] จังหวัด [ระบุจังหวัด] พร้อมสิ่งปลูกสร้างทั้งหมดที่ตั้งอยู่บนที่ดินดังกล่าว ขอยกให้แก่ <strong>${testamentBeneficiaryName || '[ชื่อ-นามสกุล ผู้รับมรดก]'}</strong> แต่เพียงผู้เดียว</li>
          <li style="margin-bottom: 10px;"><strong>2.3 ทรัพย์สินประเภทสังหาริมทรัพย์ (ยานพาหนะ):</strong> รถยนต์ยี่ห้อ [ระบุยี่ห้อ เช่น Toyota] รุ่น [ระบุรุ่น เช่น Camry] หมายเลขทะเบียน [ระบุทะเบียน] จังหวัด [ระบุจังหวัด] หมายเลขตัวรถ [ระบุเลขตัวถัง] ขอยกให้แก่ <strong>${testamentBeneficiaryName || '[ชื่อ-นามสกุล ผู้รับมรดก]'}</strong> แต่เพียงผู้เดียว</li>
        </ul>
        <h3 style="font-size: 16px; font-weight: bold; margin-top: 20px; margin-bottom: 12px;">ข้อ 3. ทรัพย์มรดกส่วนที่เหลือและที่จะเกิดขึ้นในอนาคต (Residuary Clause)</h3>
        <p style="text-align: justify; margin-bottom: 18px; text-indent: 2em;">
          หากปรากฏว่าข้าพเจ้ายังมีทรัพย์สิน เงินสด หุ้น สิทธิ์เรียกร้อง หรือสิทธิประโยชน์อื่นใดนอกเหนือจากที่ได้ระบุเฉพาะเจาะจงไว้ในข้อ 2
          รวมถึงทรัพย์สมบัติอื่นใดที่ข้าพเจ้าอาจได้มาในภายหลังจากการทำพินัยกรรมนี้ ข้าพเจ้าตกลงขอยกทรัพย์สมบัติส่วนที่เหลือทั้งหมดนั้นให้แก่
          <strong>${testamentBeneficiaryName || '[ชื่อ-นามสกุล ผู้รับมรดกส่วนที่เหลือ]'}</strong> แต่เพียงผู้เดียว
        </p>
        <h3 style="font-size: 16px; font-weight: bold; margin-top: 20px; margin-bottom: 12px;">ข้อ 4. การแต่งตั้งผู้จัดการมรดกและผู้จัดการมรดกสำรอง</h3>
        <p style="text-align: justify; margin-bottom: 18px; text-indent: 2em;">
          เพื่อให้การปฏิบัติการเป็นไปตามพินัยกรรมฉบับนี้ ข้าพเจ้าขอแต่งตั้งให้ <strong>${testamentExecutorName || '[ชื่อ-นามสกุล ผู้จัดการมรดกหลัก]'}</strong>
          ถือบัตรประจำตัวประชาชนเลขที่ <strong>[.............................]</strong> เป็นผู้จัดการมรดกตามพินัยกรรมนี้ โดยให้มีสิทธิและอำนาจหน้าที่จัดการทรัพย์มรดกของข้าพเจ้าได้ตามกฎหมายทุกประการ
        </p>
        <p style="text-align: justify; margin-bottom: 18px; text-indent: 2em;">
          ในกรณีที่ผู้จัดการมรดกที่ได้รับแต่งตั้งข้างต้นถึงแก่กรรมก่อนข้าพเจ้า หรือไม่สามารถปฏิบัติหน้าที่ได้ หรือปฏิเสธการทำหน้าที่
          ข้าพเจ้าขอแต่งตั้งให้ <strong>[ชื่อ-นามสกุล ผู้จัดการมรดกสำรอง]</strong> ถือบัตรประจำตัวประชาชนเลขที่ <strong>[.............................]</strong>
          เป็นผู้จัดการมรดกสำรองแทน โดยให้มีสิทธิและหน้าที่เฉกเช่นเดียวกับผู้จัดการมรดกหลักทุกประการ
        </p>
        <h3 style="font-size: 16px; font-weight: bold; margin-top: 20px; margin-bottom: 12px;">ข้อ 5. ข้อกำหนดทั่วไป</h3>
        <p style="text-align: justify; margin-bottom: 18px; text-indent: 2em;">
          พินัยกรรมฉบับนี้จัดทำขึ้นเป็นหนังสือ ข้าพเจ้าได้อ่านและเข้าใจข้อความในพินัยกรรมฉบับนี้โดยตลอดแล้ว เห็นว่าตรงกับเจตนาที่แท้จริงของข้าพเจ้าทุกประการ
          จึงได้ลงลายมือชื่อไว้เป็นสำคัญต่อหน้าพยานอย่างน้อยสองคนพร้อมกัน ซึ่งพยานได้ลงลายมือชื่อรับรองลายมือชื่อของข้าพเจ้าในขณะนั้นด้วย
        </p>
        <div style="margin-top: 26px;">
          <p style="margin-bottom: 20px;"><strong>ลงชื่อ</strong> ...................................................... ผู้ทำพินัยกรรม<br/>(<strong>${sellerName || '......................................................'}</strong>)</p>
          <p style="margin-bottom: 20px;"><strong>ลงชื่อ</strong> ...................................................... พยาน<br/>(......................................................)</p>
          <p style="margin-bottom: 20px;"><strong>ลงชื่อ</strong> ...................................................... พยาน<br/>(......................................................)</p>
          <p><strong>ลงชื่อ</strong> ...................................................... ผู้เขียน / ผู้พิมพ์<br/>(......................................................)</p>
        </div>
        <div style="margin-top: 28px; padding: 18px; border: 1px solid #fcd34d; border-radius: 12px; background: #fef3c7; color: #92400e;">
          <p style="font-weight: bold; margin-bottom: 10px;">⚠️ คำแนะนำทางกฎหมายที่สำคัญยิ่ง (โปรดอ่านและปฏิบัติตามอย่างเคร่งครัด):</p>
          <ol style="padding-left: 1.25rem; margin: 0;">
            <li style="margin-bottom: 10px;">พยานทั้ง 2 คนต้องเป็นผู้บรรลุนิติภาวะ (อายุ 20 ปีขึ้นไป) มีสติสัมปชัญญะสมบูรณ์ และต้องไม่เป็นผู้รับทรัพย์สิน (ผู้รับมรดก) หรือคู่สมรสของผู้รับทรัพย์สิน ตามพินัยกรรมนี้เด็ดขาด</li>
            <li style="margin-bottom: 10px;">ผู้เขียนหรือผู้พิมพ์พินัยกรรมฉบับนี้ (รวมถึงคู่สมรสของผู้เขียน/ผู้พิมพ์) ต้องไม่เป็นผู้รับทรัพย์สินตามพินัยกรรมนี้ด้วยเช่นกัน</li>
            <li style="margin-bottom: 10px;">ผู้ทำพินัยกรรม และพยานทั้ง 2 คนจะต้องลงลายมือชื่อร่วมกันในเวลาเดียวกันและต่อหน้ากัน (ลงชื่อพร้อมกัน)</li>
            <li>ไม่แนะนำให้ใช้ "การปั๊มลายนิ้วมือ" ของผู้ทำพินัยกรรม เว้นแต่จะระบุพยานเพิ่มขึ้นอีก 2 คนเฉพาะเพื่อรับรองแลงไดหรือรอยพิมพ์นิ้วมือ (รวมเป็นพยาน 4 คน) ดังนั้น การเซ็นชื่อจริงจึงเป็นวิธีที่ปลอดภัยและง่ายที่สุด</li>
          </ol>
          <p style="margin-top: 12px;">แนะนำให้เขียนชื่อพยานและผู้เขียนด้วยปากกาตัวบรรจงไว้ใต้ลายเซ็นอย่างชัดเจน</p>
        </div>
      </div>`;
  }

  return `
    <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #1e293b; max-width: 900px; margin: 0 auto; padding: 24px;">
      <h1 style="text-align: center; font-size: 28px; font-weight: bold; margin-bottom: 20px;">Last Will and Testament</h1>
      <p style="text-align: center; font-size: 15px; margin-bottom: 18px; color: #475569;">Executed at ${state || '[location]'}</p>
      <p style="text-align: justify; text-indent: 2em; margin-bottom: 18px;">I, <strong>${sellerName || '[Testator full name]'}</strong>, currently residing at ${sellerAddress || '[Testator address]'}, holding national ID number ${sellerTaxId || '[ID number]'}, make this Last Will and Testament on ${formattedTestamentDate}.</p>
      <p style="text-align: justify; margin-bottom: 18px; text-indent: 2em;">I declare that I am of sound mind and not subject to duress, coercion, or undue influence. This testament reflects my true intentions with respect to the distribution of my estate after my death.</p>
      <h3 style="font-size: 16px; font-weight: bold; margin-top: 24px; margin-bottom: 12px;">1. Revocation of Prior Wills</h3>
      <p style="text-align: justify; margin-bottom: 18px; text-indent: 2em;">I hereby revoke any and all wills, codicils, or testamentary documents made by me prior to this document, if any, and declare this document to be my sole and controlling testament.</p>
      <h3 style="font-size: 16px; font-weight: bold; margin-top: 20px; margin-bottom: 12px;">2. Specific Bequests</h3>
      <p style="text-align: justify; margin-bottom: 12px; text-indent: 2em;">Upon my death, I bequeath the following specific assets to the persons named below:</p>
      <ul style="padding-left: 1.25rem; margin-bottom: 18px;">
        <li style="margin-bottom: 10px;"><strong>2.1 Bank accounts:</strong> All funds held in bank account(s) at [bank name], branch [branch name], account type [e.g. savings], account number [..............], together with all accrued interest, are gifted to <strong>${testamentBeneficiaryName || '[Beneficiary name]'}</strong>.</li>
        <li style="margin-bottom: 10px;"><strong>2.2 Real property:</strong> The land described in title deed no. [title deed number], plot no. [plot number], located in subdistrict [subdistrict], district [district], province [province], together with all buildings and improvements thereon, is gifted to <strong>${testamentBeneficiaryName || '[Beneficiary name]'}</strong>.</li>
        <li style="margin-bottom: 10px;"><strong>2.3 Personal property:</strong> The vehicle described as [make and model], registration number [registration], province [province], chassis number [VIN], is gifted to <strong>${testamentBeneficiaryName || '[Beneficiary name]'}</strong>.</li>
      </ul>
      <h3 style="font-size: 16px; font-weight: bold; margin-top: 20px; margin-bottom: 12px;">3. Residuary Estate</h3>
      <p style="text-align: justify; margin-bottom: 18px; text-indent: 2em;">If there remains any residual estate not specifically disposed of above, including cash, securities, claims, or property acquired after the date of this Will, I give, devise, and bequeath all such residue to <strong>${testamentBeneficiaryName || '[Residuary beneficiary]'}</strong>.</p>
      <h3 style="font-size: 16px; font-weight: bold; margin-top: 20px; margin-bottom: 12px;">4. Appointment of Executor</h3>
      <p style="text-align: justify; margin-bottom: 18px; text-indent: 2em;">I appoint <strong>${testamentExecutorName || '[Executor full name]'}</strong>, national ID number [..............], to serve as Executor of this Will, with full power and authority to administer and distribute my estate in accordance with this testament.</p>
      <p style="text-align: justify; margin-bottom: 18px; text-indent: 2em;">If the named Executor is unable or unwilling to serve, I appoint [successor executor name] to serve as alternate Executor with the same authority.</p>
      <h3 style="font-size: 16px; font-weight: bold; margin-top: 20px; margin-bottom: 12px;">5. General Provisions</h3>
      <p style="text-align: justify; margin-bottom: 18px; text-indent: 2em;">This Will is made voluntarily and in writing. I certify that I have read and understood its contents and that it expresses my true wishes.</p>
      <div style="margin-top: 26px;">
        <p style="margin-bottom: 20px;"><strong>Signed</strong> ...................................................... Testator<br/>(<strong>${sellerName || '......................................................'}</strong>)</p>
        <p style="margin-bottom: 20px;"><strong>Signed</strong> ...................................................... Witness<br/>(......................................................)</p>
        <p style="margin-bottom: 20px;"><strong>Signed</strong> ...................................................... Witness<br/>(......................................................)</p>
      </div>
    </div>`;
}
