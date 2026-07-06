import { Briefcase, Clock3, Mail, Phone, ShieldCheck, Scale } from 'lucide-react';
import Link from 'next/link';

const legalCards = [
  {
    title: 'คำแนะนำเบื้องต้น',
    description: 'สัญญาควรระบุข้อมูลคู่สัญญา ข้อกำหนดการชำระ และเงื่อนไขการยกเลิกอย่างชัดเจน เพื่อป้องกันข้อพิพาทในอนาคต',
    icon: Scale,
  },
  {
    title: 'ความปลอดภัยของเอกสาร',
    description: 'ควรเก็บสำเนาไว้ในรูปแบบที่ตรวจสอบได้และตรวจทานก่อนลงนาม เพื่อให้เอกสารมีผลบังคับใช้จริง',
    icon: ShieldCheck,
  },
  {
    title: 'ช่วงเวลาให้ปรึกษา',
    description: 'หากมีข้อพิพาทหรือความเสี่ยงด้านการเงิน ควรขอคำปรึกษาทนายก่อนทำสัญญาโดยไม่จำเป็นต้องเร่งด่วน',
    icon: Clock3,
  },
];

export default function LegalHelpPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_24%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="rounded-[32px] border border-white/80 bg-white/70 p-8 shadow-[0_20px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">ช่วยเหลือข้อกฎหมาย</p>
              <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">คำแนะนำเบื้องต้นสำหรับการทำสัญญา</h1>
            </div>
            <Link href="/" className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white">
              กลับหน้าแรก
            </Link>
          </div>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            เว็บไซต์นี้ช่วยให้คุณสร้างสัญญาจากเทมเพลตที่มีโครงสร้างพร้อมใช้งาน แต่สำหรับกรณีที่มีผลกระทบด้านกฎหมายหรือความเสี่ยงสูง ควรขอคำปรึกษาจากทนายความก่อนลงนาม
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[32px] border border-white/80 bg-slate-950 p-8 text-white shadow-[0_20px_70px_rgba(15,23,42,0.12)]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-500/15 p-3 text-sky-300">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">พบกับทีมทนายความที่พร้อมช่วยคุณ</h2>
                <p className="mt-2 text-sm text-slate-300">ให้คำปรึกษาเรื่องสัญญาเช่า สัญญาซื้อขาย และเอกสารสำคัญอื่น ๆ</p>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/10 p-5">
              <div className="flex gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500" />
                <div>
                  <h3 className="text-lg font-semibold">คุณนภัสร์ ชูวงศ์</h3>
                  <p className="mt-1 text-sm text-slate-300">ทนายความด้านสัญญาและธุรกรรม</p>
                  <div className="mt-3 space-y-2 text-sm text-slate-200">
                    <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-sky-300" /> 02-123-4567</div>
                    <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-sky-300" /> legal@legaldraft.co</div>
                  </div>
                </div>
              </div>
              <div className="mt-5 rounded-2xl bg-slate-900/70 p-4 text-sm leading-7 text-slate-300">
                ค่าปรึกษาทนายความเริ่มต้นที่ 1,500 บาท/ชั่วโมง สำหรับคำแนะนำด้านสัญญาและการตรวจทานเอกสารเบื้องต้น
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {legalCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="rounded-[28px] border border-white/80 bg-white/70 p-6 shadow-[0_15px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                  <div className="rounded-2xl bg-sky-500/10 p-2.5 text-sky-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-slate-800">{card.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{card.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
