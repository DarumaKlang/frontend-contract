"use client";

import {
  ArrowRight,
  BadgeCheck,
  Download,
  FileSignature,
  Languages,
  Lock,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const features = [
  {
    title: 'สัญญามาตรฐานที่ดูน่าเชื่อถือ',
    description: 'สร้างเอกสารที่เรียบง่าย แต่มีโครงสร้างชัดเจนและพร้อมพิมพ์',
    icon: FileSignature,
  },
  {
    title: 'ปลอดภัยและเป็นส่วนตัว',
    description: 'ข้อมูลถูกเก็บในระบบที่ควบคุมได้และรองรับการเข้าสู่ระบบแบบปลอดภัย',
    icon: Lock,
  },
  {
    title: 'ลาก่อนเอกสารแบบค่อยๆเขียน',
    description: 'เลือกประเภทสัญญาและกรอกข้อมูลในขั้นตอนสั้น ๆ เพื่อผลลัพธ์ที่รวดเร็ว',
    icon: Sparkles,
  },
  {
    title: 'รองรับหลายภาษา',
    description: 'เอื้อมถึงลูกค้าและทีมงานในหลายโอกาสด้วยตัวเลือกภาษาไทย/อังกฤษ',
    icon: Languages,
  },
];

const trustPoints = ['แบบอัปเดตและใช้งานง่าย', 'เหมาะสำหรับเช่า ขายรถ และอสังหาฯ', 'ดาวน์โหลดหรือคัดลอกได้ทันที'];

export default function Landding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.24),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.25),_transparent_36%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#fdf2f8_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
        <header className="mb-8 rounded-[30px] border border-white/80 bg-white/45 px-4 py-3 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 p-2.5 text-white shadow-[0_12px_35px_rgba(14,165,233,0.35)]">
                <FileSignature className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-slate-500">LEGALDRAFT</p>
                <p className="text-base font-bold text-slate-800">Professional Contract Studio</p>
              </div>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <Link href="/contract-generator" className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-sky-700">
                ร่างสัญญา
              </Link>
              <Link href="/contracts" className="rounded-full border border-white/70 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-white/90">
                คู่มือสัญญา
              </Link>
              <Link href="/legal-help" className="rounded-full border border-white/70 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-white/90">
                ช่วยเหลือข้อกฎหมาย
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-white/90"
              >
                เข้าสู่ระบบ
              </Link>
            </div>

            <button
              type="button"
              aria-label="Toggle navigation"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/70 text-slate-700 transition hover:bg-white/90 md:hidden"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {mobileMenuOpen ? (
            <div className="mt-3 flex flex-col gap-2 rounded-[22px] border border-white/80 bg-white/70 p-3 shadow-[0_12px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:hidden">
              <Link href="/contract-generator" className="rounded-2xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-700" onClick={() => setMobileMenuOpen(false)}>
                ร่างสัญญา
              </Link>
              <Link href="/contracts" className="rounded-2xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" onClick={() => setMobileMenuOpen(false)}>
                คู่มือสัญญา
              </Link>
              <Link href="/legal-help" className="rounded-2xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" onClick={() => setMobileMenuOpen(false)}>
                ช่วยเหลือข้อกฎหมาย
              </Link>
              <Link href="/login" className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800" onClick={() => setMobileMenuOpen(false)}>
                เข้าสู่ระบบ
              </Link>
            </div>
          ) : null}
        </header>

        <section className="grid flex-1 items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[36px] border border-white/80 bg-white/55 p-8 shadow-[0_25px_80px_rgba(15,23,42,0.14)] backdrop-blur-2xl sm:p-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-sky-50/80 px-3 py-1.5 text-sm font-semibold text-sky-700 shadow-[0_8px_25px_rgba(14,165,233,0.12)]">
              <BadgeCheck className="h-4 w-4" />
              Trusted by modern contract workflows
            </div>
            <h1 className="max-w-2xl text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
              สร้างสัญญาที่ดูน่าเชื่อถือและพร้อมใช้งานได้ทันที
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
              จากสัญญาเช่า สัญญาซื้อขายรถ ไปจนถึงสัญญาอสังหาฯ ทุกอย่างถูกจัดให้อยู่ในหน้าเดียวด้วยภาพลักษณ์ที่โปร่งใสและมืออาชีพ
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contract-generator"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 shadow-[0_12px_35px_rgba(15,23,42,0.2)]"
              >
                ร่างสัญญาเลย
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contracts"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-white"
              >
                ดูคู่มือสัญญา
              </Link>
              <Link
                href="/legal-help"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-white"
              >
                ช่วยเหลือข้อกฎหมาย
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {trustPoints.map((item) => (
                <span key={item} className="rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-sm text-slate-600 shadow-[0_6px_18px_rgba(15,23,42,0.06)]">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[30px] border border-white/10 bg-slate-950/80 p-6 text-white shadow-[0_25px_80px_rgba(15,23,42,0.24)] backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Preview</p>
                  <h2 className="mt-2 text-2xl font-semibold">สัญญาแบบอัตโนมัติ</h2>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <ShieldCheck className="h-6 w-6 text-emerald-300" />
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <FileSignature className="h-4 w-4 text-sky-300" />
                  <span>สัญญาจ้างงาน • พินัยกรรม • สัญญาเช่า</span>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2">
                    <span className="text-sm text-slate-200">กรอกข้อมูลเสร็จแล้ว</span>
                    <span className="text-sm font-semibold text-emerald-300">พร้อมพิมพ์</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2">
                    <span className="text-sm text-slate-200">ดาวน์โหลดไฟล์ HTML</span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-sky-300">
                      <Download className="h-4 w-4" />
                      Export
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="rounded-[24px] border border-white/80 bg-white/75 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                    <div className="rounded-2xl bg-sky-500/10 p-2.5 text-sky-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-slate-800">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <footer className="mt-8 rounded-[30px] border border-white/80 bg-white/50 px-6 py-5 shadow-[0_12px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">LEGALDRAFT © 2026 · สร้างสัญญาที่ดูน่าเชื่อถือและปลอดภัย</p>
            <div className="flex flex-wrap gap-3 text-sm font-semibold text-slate-700">
              <Link href="/contracts" className="transition hover:text-sky-700">
                คู่มือสัญญา
              </Link>
              <Link href="/legal-help" className="transition hover:text-sky-700">
                ช่วยเหลือข้อกฎหมาย
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
