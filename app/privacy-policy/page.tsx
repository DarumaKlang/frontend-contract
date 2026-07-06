import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_24%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="rounded-[32px] border border-white/80 bg-white/70 p-8 shadow-[0_20px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-600">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">นโยบายความเป็นส่วนตัว</p>
                <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">นโยบายความเป็นส่วนตัว (Privacy Policy)</h1>
              </div>
            </div>
            <Link href="/" className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white">
              <ArrowLeft className="h-4 w-4" />
              กลับหน้าแรก
            </Link>
          </div>

          <div className="mt-8 space-y-8 text-slate-700">
            <div className="rounded-2xl bg-blue-50 p-4 border-l-4 border-blue-500">
              <p className="text-blue-800 font-medium">
                💡 จุดประสงค์หลัก: ชี้แจงให้ชัดเจนว่าเราเก็บข้อมูลอะไรบ้าง (เช่น ข้อมูลที่กรอกในสัญญา) 
                และเราไม่ได้เก็บหรือส่งต่อให้คนอื่น เพื่อความโปร่งใสตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)
              </p>
            </div>

            <section>
              <p className="leading-7 mb-6">
                เว็บไซต์ frontend-contract.vercel.app ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของท่าน 
                นโยบายนี้จัดทำขึ้นเพื่อชี้แจงรายละเอียดเกี่ยวกับการเก็บรวบรวม การใช้ และการคุ้มครองข้อมูลส่วนบุคคลของผู้ใช้งาน 
                ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">1. ข้อมูลที่เราเก็บรวบรวม</h2>
              <p className="leading-7 mb-3">
                เมื่อท่านใช้งานเว็บไซต์เพื่อสร้างหรือจัดการเอกสาร เราอาจประมวลผลข้อมูลดังต่อไปนี้:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li className="leading-7">
                  <strong>ข้อมูลที่ท่านกรอกในแบบฟอร์ม:</strong> 
                  เช่น ชื่อ-นามสกุล, ที่อยู่, เลขประจำตัวประชาชน, ข้อมูลติดต่อ หรือรายละเอียดทรัพย์สิน 
                  (ข้อมูลเหล่านี้ถูกนำมาใช้เพื่อวัตถุประสงค์ในการประมวลผลและแสดงผลบนตัวเอกสารตามคำสั่งของท่านเท่านั้น)
                </li>
                <li className="leading-7">
                  <strong>ข้อมูลทางเทคนิคอัตโนมัติ:</strong> 
                  เช่น หมายเลข IP Address, คุกกี้ (Cookies), ประเภทของเบราว์เซอร์ เพื่อใช้ในการวิเคราะห์และปรับปรุงประสิทธิภาพการทำงานของเว็บไซต์
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">2. วิธีการเก็บรักษาข้อมูล</h2>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
                <p className="text-sm text-slate-600 mb-2">ข้อนี้สำคัญมากสำหรับเว็บสัญญา</p>
              </div>
              <ul className="list-disc pl-6 space-y-3">
                <li className="leading-7">
                  <strong>แนวทาง Client-side:</strong> 
                  เว็บไซต์นี้ประมวลผลข้อมูลสัญญาบนเบราว์เซอร์ของท่าน (Client-side) เท่านั้น 
                  <strong>เราไม่มีนโยบายการจัดเก็บข้อมูลที่คุณกรอกลงในฟอร์มสัญญาไว้บนเซิร์ฟเวอร์ของเรา</strong> 
                  เมื่อท่านปิดหน้าเว็บ ข้อมูลดังกล่าวจะถูกลบออกทันที
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">3. การเปิดเผยข้อมูลแก่บุคคลที่สาม</h2>
              <p className="leading-7">
                เราไม่มีนโยบายการขาย แลกเปลี่ยน หรือเปิดเผยข้อมูลส่วนบุคคลที่ท่านกรอกในสัญญาส่งต่อไปยังบุคคลที่สาม 
                เว้นแต่จะได้รับความยินยอมจากท่าน หรือเป็นไปตามคำสั่งของเจ้าหน้าที่ตามกฎหมาย
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">4. สิทธิ์ของเจ้าของข้อมูลส่วนบุคคล</h2>
              <p className="leading-7">
                ตามกฎหมาย PDPA ท่านมีสิทธิ์ในการเข้าถึง ขอสำระ ขอแก้ไข หรือขอให้ลบข้อมูลส่วนบุคคลของท่านออกจากระบบของเรา 
                (หากมีการจัดเก็บ) โดยสามารถติดต่อเราได้ตามช่องทางที่ระบุไว้
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">5. ช่องทางการติดต่อ</h2>
              <p className="leading-7 mb-3">
                หากท่านมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ สามารถติดต่อเราได้ที่:
              </p>
              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-700">
                  <strong>อีเมล:</strong> privacy@legaldraft.co
                </p>
              </div>
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
