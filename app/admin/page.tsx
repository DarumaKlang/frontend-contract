// app/admin/page.tsx
import React from 'react';

export default function AdminPage() {
  return (
    <main className="prose prose-slate mx-auto min-h-screen px-6 py-10 text-slate-900">
      <h1>Admin Manual</h1>
      <p>
        คู่มือสำหรับผู้ดูแลระบบและนักพัฒนาที่ต้องการขยายฟีเจอร์สัญญาในอนาคต
        เช่น เพิ่มแบบสัญญาใหม่ แก้ไขข้อมูลสัญญา หรือปรับค่า Stripe และ template
      </p>

      <h2>1. สถานะปัจจุบัน</h2>
      <ul>
        <li>ปัจจุบันระบบมีสัญญาเพียงฉบับเดียว</li>
        <li>สัญญาถูกสร้างจากข้อมูลฟอร์มใน `app/page.new.tsx`</li>
        <li>ฟอร์มสัญญาและ logic อยู่ใน `app/components/contract-generator/`</li>
        <li>การชำระเงินใช้ Stripe Checkout ผ่าน `app/api/create-checkout-session/route.ts`</li>
      </ul>

      <h2>2. หากต้องการแก้ไขข้อมูลสัญญา</h2>
      <p>การแก้ไขข้อมูลสัญญาแบ่งเป็นสองระดับ:</p>
      <ol>
        <li>
          <strong>แก้ค่าเริ่มต้น</strong> - ถ้าอยากเปลี่ยนค่า default, sample หรือข้อความในฟอร์ม
          ให้แก้ที่ `getInitialFormData()` และ `handleQuickFill()` ใน
          `app/components/contract-generator/hooks/useWizard.ts`
        </li>
        <li>
          <strong>แก้ฟิลด์สัญญา</strong> - ถ้าต้องการเพิ่ม/ลบฟิลด์สัญญา เช่น เพิ่มช่องข้อมูลผู้รับมอบอำนาจ
          ให้ปรับดังนี้:
          <ul>
            <li>อัพเดต `ContractData` ใน `app/components/contract-generator/types.ts`</li>
            <li>เพิ่ม form input ใน `app/components/contract-generator/ContractStepContent.tsx`</li>
            <li>เพิ่ม label/placeholder ใน localization object ของ `useWizard.ts`</li>
            <li>แก้ `generateContractHTML()` ใน `useWizard.ts` เพื่อใส่ข้อมูลใหม่ลงในเอกสาร</li>
          </ul>
        </li>
      </ol>

      <h2>3. หากต้องการเพิ่มสัญญาใหม่</h2>
      <p>
        ระบบตอนนี้ออกแบบให้สร้างสัญญาเดียวจากแบบฟอร์มเดียว หากต้องการรองรับหลายสัญญา
        จะต้องออกแบบโครงสร้างใหม่เล็กน้อย:
      </p>
      <ol>
        <li>
          เพิ่มตัวแปร `contractType` หรือ `templateType` ใน `ContractData` หรือ state
          เพื่อแยกประเภทสัญญา
        </li>
        <li>
          สร้างไฟล์ template ใหม่ เช่น `app/components/contract-generator/templates/` เพื่อเก็บ
          HTML generator แต่ละสัญญา
        </li>
        <li>
          ขยาย `ContractSidebar.tsx` และ `ContractStepContent.tsx` เพื่อให้เลือกสัญญา
          และแสดงฟิลด์เฉพาะตามสัญญาที่เลือก
        </li>
        <li>
          แยก logic การสร้าง HTML ใน `useWizard.ts` เช่น `generateContractHTML()` ให้รองรับ
          template หลายแบบตาม `contractType`
        </li>
        <li>
          อัพเดต `app/docs/page.tsx` หรือคู่มือ admin เพื่อเพิ่มคำอธิบาย template ใหม่
        </li>
      </ol>

      <h2>4. ไฟล์ที่ต้องแก้เมื่อต้องการเพิ่มสัญญาใหม่</h2>
      <ul>
        <li>`app/components/contract-generator/types.ts` - กำหนดข้อมูลสัญญาที่จะเก็บ</li>
        <li>`app/components/contract-generator/hooks/useWizard.ts` - เก็บ state, localization,
          และฟังก์ชันสร้าง HTML</li>
        <li>`app/components/contract-generator/ContractStepContent.tsx` - แบบฟอร์มข้อมูลสัญญา</li>
        <li>`app/components/contract-generator/ContractSidebar.tsx` - navigation ของขั้นตอน</li>
        <li>`app/page.new.tsx` - หน้า UI หลักและปุ่มจ่ายเงิน</li>
      </ul>

      <h2>5. วิธีเพิ่มฟิลด์สัญญาใหม่</h2>
      <p>ตัวอย่างขั้นตอนทั่วไป:</p>
      <ol>
        <li>เพิ่ม property ใหม่ใน `ContractData` เช่น `agentName: string`</li>
        <li>เพิ่ม input field ใน `ContractStepContent.tsx` พร้อม label และ placeholder</li>
        <li>เพิ่ม key localization สำหรับชื่อ label ใน `useWizard.ts`</li>
        <li>แก้ `generateContractHTML()` เพื่อแสดงข้อมูลใหม่ในเอกสาร</li>
        <li>ทดสอบว่า preview, copy, download และ print แสดงข้อมูลใหม่ถูกต้อง</li>
      </ol>

      <h2>6. วิธีเพิ่มสัญญาใหม่แบบหลาย template</h2>
      <p>ถ้าจะเพิ่มสัญญาใหม่ ควรทำแบบแยก template ดังนี้:</p>
      <ul>
        <li>สร้าง `contractType` ใน state เพื่อเลือกแบบสัญญา</li>
        <li>สร้างชุดฟิลด์เฉพาะสำหรับแต่ละแบบสัญญา</li>
        <li>เก็บ template HTML เป็นฟังก์ชันแยก เช่น `renderLeaseAgreement()` และ `renderSaleAgreement()`</li>
        <li>แสดงตัวเลือกสัญญาในหน้า UI ก่อนเข้าสู่ฟอร์ม</li>
      </ul>

      <h2>7. การจัดการราคาหรือ Stripe ในอนาคต</h2>
      <p>หากสัญญาแต่ละแบบมีราคาต่างกัน:</p>
      <ul>
        <li>เพิ่ม `priceId` สำหรับแต่ละ template</li>
        <li>อาจเก็บเป็น object หรือ map ใน `.env` และ `app/api/create-checkout-session/route.ts`</li>
        <li>เมื่อมีหลายสัญญา ให้ส่ง `contractType` หรือ `priceKey` มายัง API route เพื่อเลือกราคา</li>
      </ul>
      <p>
        ตัวอย่างโครงสร้างค่าใน `.env` แบบง่ายสำหรับหลายราคา:
      </p>
      <pre>
PRICE_ID_LEASE=price_xxx
PRICE_ID_RENTER=price_yyy
      </pre>

      <h2>8. คำแนะนำการดูแลหน้า admin</h2>
      <ul>
        <li>หากต้องการให้ admin แก้สัญญาได้ใน UI, คุณอาจสร้างระบบหลังบ้านที่เก็บ template และข้อมูลในฐานข้อมูล</li>
        <li>ปัจจุบันหน้านี้ยังเป็นคู่มือเชิงเทคนิค ไม่ได้เก็บข้อมูลจริง</li>
        <li>สำหรับแอดมินที่ไม่ใช่นักพัฒนา ให้ใช้คู่มือนี้เพื่อเข้าใจว่าต้องแก้ไฟล์ใด</li>
      </ul>

      <h2>9. ข้อควรระวัง</h2>
      <ul>
        <li>ก่อนเพิ่มสัญญาใหม่ ให้สำรองไฟล์และทดสอบในสาขาแยกก่อน</li>
        <li>หากแก้ template HTML ต้องตรวจสอบ preview และไฟล์ดาวน์โหลดทุกครั้ง</li>
        <li>อัพเดต localization ทั้งภาษาไทยและอังกฤษถ้าฟิลด์ใหม่มี label ใหม่</li>
      </ul>
    </main>
  );
}
