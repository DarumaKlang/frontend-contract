import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_24%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="rounded-[32px] border border-white/80 bg-white/70 p-8 shadow-[0_20px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-500/15 p-3 text-sky-600">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">ข้อกำหนดและเงื่อนไข</p>
                <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">ข้อตกลงและเงื่อนไขการใช้งานเว็บไซต์</h1>
              </div>
            </div>
            <Link href="/" className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white">
              <ArrowLeft className="h-4 w-4" />
              กลับหน้าแรก
            </Link>
          </div>

          <div className="mt-8 space-y-8 text-slate-700">
            <div className="rounded-2xl bg-yellow-50 p-4 border-l-4 border-yellow-500">
              <p className="text-yellow-800 font-medium">
                💡 จุดประสงค์หลัก: ปฏิเสธความรับผิดชอบหากผู้ใช้นำคำเตือน/ตัวอย่างสัญญาไปใช้แล้วเกิดข้อพิพาท (Disclaimer) และห้ามมิให้แอบอ้างชื่อเว็บไซต์
              </p>
            </div>

            <section>
              <p className="leading-7 mb-6">
                ต้อนรับสู่ frontend-contract.vercel.app (ซึ่งต่อไปในข้อตกลงนี้จะเรียกว่า "เว็บไซต์") 
                การเข้าใช้งานและการใช้บริการของเว็บไซต์นี้ถือว่าท่าน (ซึ่งต่อไปจะเรียกว่า "ผู้ใช้งาน") 
                ได้อ่าน เข้าใจ และตกลงที่จะผูกพันตนเองตามเงื่อนไขและข้อกำหนดทั้งหมดดังต่อไปนี้:
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">1. ข้อจำกัดความรับผิดชอบทางกฎหมาย (Disclaimer)</h2>
              <ul className="list-disc pl-6 space-y-3">
                <li className="leading-7">
                  <strong>คำแนะนำไม่ใช่คำปรึกษาทางกฎหมาย:</strong> 
                  ข้อมูล แบบฟอร์ม และตัวอย่างสัญญาต่าง ๆ ที่ปรากฏบนเว็บไซต์นี้ จัดทำขึ้นเพื่อเป็นข้อมูลตัวอย่างและแนวทางทั่วไปเท่านั้น 
                  ไม่ถือเป็นคำปรึกษาทางกฎหมาย ทนายความ หรือคำแนะนำวิชาชีพเฉพาะทาง
                </li>
                <li className="leading-7">
                  <strong>ความเสี่ยงของผู้ใช้งาน:</strong> 
                  ผู้ใช้งานต้องตรวจสอบ ความถูกต้อง ความเหมาะสม และความสมบูรณ์ของเนื้อหาในสัญญากับฝ่ายกฎหมายหรือผู้เชี่ยวชาญก่อนนำไปใช้งานจริงทุกครั้ง 
                  เว็บไซต์จะไม่รับผิดชอบต่อความเสียหาย ความสูญเสีย หรือข้อพิพาทใด ๆ ทั้งทางตรงและทางอ้อมที่เกิดขึ้นจากการนำเอกสาร สัญญา 
                  หรือข้อมูลจากเว็บไซต์นี้ไปใช้งาน
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">2. ทรัพย์สินทางปัญญาและการจำกัดสิทธิ์</h2>
              <ul className="list-disc pl-6 space-y-3">
                <li className="leading-7">
                  <strong>สิทธิ์ในตัวระบบ:</strong> 
                  ซอร์สโค้ด การออกแบบ หน้าจออินเตอร์เฟซ เครื่องหมายการค้า และเครื่องมือในเว็บไซต์ 
                  เป็นสิทธิ์ของเจ้าของเว็บไซต์แต่เพียงผู้เดียว
                </li>
                <li className="leading-7">
                  <strong>สิทธิ์ในเอกสาร:</strong> 
                  เว็บไซต์อนุญาตให้ผู้ใช้งานพิมพ์ ดาวน์โหลด หรือคัดลอกแบบฟอร์มสัญญาเพื่อนำไปใช้ประโยชน์ส่วนตัวหรือในองค์กรได้ 
                  <strong> แต่ห้ามมิให้นำไปใช้เพื่อการค้าในลักษณะของการขายต่อ แจกจ่ายแบบเก็บเงิน หรือแอบอ้างว่าตนเองเป็นเจ้าของระบบหรือผู้จัดทำระบบนี้</strong>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">3. การห้ามแอบอ้างและการใช้งานที่มิชอบ</h2>
              <ul className="list-disc pl-6 space-y-3">
                <li className="leading-7">
                  ผู้ใช้งานต้องไม่ใช้เว็บไซต์นี้ในการสร้างเอกสารที่มีเนื้อหาเป็นเท็จ ฉ้อโกง ผิดกฎหมาย หรือละเมิดสิทธิ์ของบุคคลอื่น
                </li>
                <li className="leading-7">
                  ห้ามมิให้ผู้ใช้งานนำชื่อ รูปภาพ หรือเครื่องหมายใด ๆ ของเว็บไซต์ไปแอบอ้างเพื่อสร้างความน่าเชื่อถือให้กับสัญญาหรือเอกสารส่วนบุคคล 
                  ในลักษณะที่ทำให้ผู้อื่นเข้าใจผิดว่าเว็บไซต์มีส่วนร่วมในการรับรองสัญญานั้น ๆ
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">4. การเปลี่ยนแปลงเงื่อนไข</h2>
              <p className="leading-7">
                เว็บไซต์ขอสงวนสิทธิ์ในการปรับปรุงแก้ไขเงื่อนไขการใช้งานนี้เมื่อใดก็ได้ โดยไม่ต้องแจ้งให้ทราบล่วงหน้า 
                การที่ผู้ใช้งานยังคงใช้บริการต่อไปหลังการเปลี่ยนแปลง ถือเป็นการยอมรับเงื่อนไขใหม่โดยปริยาย
              </p>
            </section>

            <footer className="pt-6 border-t border-slate-200 text-sm text-slate-500">
              <p>แก้ไขล่าสุด: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
