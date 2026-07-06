import { ArrowRight, FileText, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

const contractTemplates = [
  {
    title: 'สัญญาเช่า',
    description: 'สำหรับการเช่าที่พักอาศัยและสถานที่ประกอบการ พร้อมกรอกข้อมูลผู้เช่า ผู้ให้เช่า และเงื่อนไขค่าเช่า',
    badge: 'Popular',
  },
  {
    title: 'สัญญาซื้อขายรถ',
    description: 'ใช้สำหรับรายการรถยนต์พร้อมรายละเอียดยี่ห้อ รุ่น ปี และเงื่อนไขการชำระเงิน',
    badge: 'Fast',
  },
  {
    title: 'สัญญาซื้อขายอสังหาฯ',
    description: 'สำหรับการขายคอนโด ห้องชุด หรือที่ดิน พร้อมส่วนประกอบของข้อมูลทรัพย์สินและรายละเอียดการโอน',
    badge: 'Premium',
  },
  {
    title: 'สัญญาจ้างงาน',
    description: 'รูปแบบสำหรับจ้างงานและร่วมมือทางธุรกิจพร้อมเงื่อนไขค่าจ้างและวันสิ้นสุดสัญญา',
    badge: 'New',
  },
  {
    title: 'พินัยกรรม',
    description: 'เทมเพลตสำหรับการจัดเตรียมคำแสดงเจตนาตามกฎหมายเบื้องต้นและควรตรวจทานโดยทนาย',
    badge: 'Review',
  },
];

export default function ContractsPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_24%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="rounded-[32px] border border-white/80 bg-white/70 p-8 shadow-[0_20px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">คู่มือสัญญา</p>
              <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">สัญญาทั้งหมดที่เรามีให้บริการ</h1>
            </div>
            <Link href="/" className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white">
              กลับหน้าแรก
            </Link>
          </div>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            เลือกประเภทสัญญาที่ต้องการ และดูตัวอย่างแบบร่างก่อนเริ่มสร้างเอกสารจริง คุณสามารถเรียกตัวอย่างมา preview ได้ทันทีด้วยลายน้ำเพื่อป้องกันการใช้งานโดยไม่ตั้งใจ
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {contractTemplates.map((contract) => (
            <div key={contract.title} className="rounded-[28px] border border-white/80 bg-white/70 p-6 shadow-[0_15px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div className="rounded-2xl bg-sky-500/10 p-3 text-sky-700">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                  {contract.badge}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-slate-900">{contract.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{contract.description}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                  ดูตัวอย่าง <ArrowRight className="h-4 w-4" />
                </button>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                  ตัวอย่างมีลายน้ำ
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[28px] border border-sky-200 bg-sky-50/80 p-6 shadow-[0_10px_35px_rgba(14,165,233,0.10)]">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sky-700" />
            <h3 className="text-lg font-semibold text-slate-900">พร้อมสำหรับการเริ่มต้น</h3>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            หากคุณต้องการสร้างสัญญาจริงในระบบ เลือกประเภทที่ตรงกับความต้องการ แล้วกรอกข้อมูลในขั้นตอนต่อไป ระบบจะช่วยสร้างเอกสารให้คุณในรูปแบบที่อ่านง่ายและพร้อมพิมพ์
          </p>
        </div>
      </div>
    </main>
  );
}
