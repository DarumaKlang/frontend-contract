import React, { useState } from 'react';

const licensingGuideData = [
    {
        title: "ภาพรวมและประเภทของสัญญา",
        questions: [
            {
                q: "สัญญาอนุญาตให้ใช้สิทธิคืออะไร",
                a: "สัญญาอนุญาตให้ใช้สิทธิ (Licensing Agreement) คือสัญญาที่ 'ผู้อนุญาต' (เจ้าของสิทธิ) ตกลงให้ 'ผู้ได้รับอนุญาต' นำสิทธิไปใช้ตามวัตถุประสงค์ เช่น สิทธิในเครื่องหมายการค้า, ลิขสิทธิ์ (เพลง, หนัง, งานเขียน), สิทธิบัตร, หรือความลับทางการค้า"
            },
            {
                q: "สัญญาอนุญาตให้ใช้สิทธิมีลักษณะใดบ้าง",
                a: "แบ่งตามลักษณะการอนุญาตได้ 3 รูปแบบ:\n1. อนุญาตให้ใช้สิทธิแต่เพียงผู้เดียว (Exclusive): ผู้อนุญาตใช้เองไม่ได้ และไม่สามารถให้ผู้อื่นใช้ได้\n2. อนุญาตให้ใช้สิทธิโดยไม่จำกัดจำนวนผู้รับอนุญาต (Non-Exclusive): ผู้อนุญาตสามารถให้ผู้อื่นใช้สิทธิได้ และตนเองก็ยังใช้ได้\n3. อนุญาตให้ใช้สิทธิแต่เพียงผู้เดียวแต่ไม่จำกัดเจ้าของสิทธิ (Sole): ผู้อนุญาตยังใช้สิทธิได้ แต่ไม่สามารถให้คนอื่นใช้ได้"
            },
            {
                q: "สัญญาอนุญาตให้ใช้สิทธิและสัญญาโอนสิทธิแตกต่างกันอย่างไร",
                a: "- สัญญาอนุญาต: เป็นการให้ใช้สิทธิตามระยะเวลาและเงื่อนไขที่กำหนด กรรมสิทธิ์ยังเป็นของผู้อนุญาต\n- สัญญาโอนสิทธิ: เป็นการโอนสิทธิเด็ดขาด/ความเป็นเจ้าของให้แก่ผู้รับโอนเสมือนการขายขาด"
            }
        ]
    },
    {
        title: "ความจำเป็น ขอบเขต และสิ่งที่ต้องระบุ",
        questions: [
            {
                q: "จำเป็นต้องทำสัญญาอนุญาตให้ใช้สิทธิหรือไม่",
                a: "จำเป็น ในกรณีที่กฎหมายกำหนด (เช่น เครื่องหมายการค้าหรือสิทธิบัตรที่จดทะเบียนไว้) ต้องทำเป็นหนังสือและจดทะเบียนกับกรมทรัพย์สินทางปัญญา นอกจากนี้ การทำสัญญาเป็นลายลักษณ์อักษรยังช่วยรักษาผลประโยชน์และป้องกันความเข้าใจผิดของทั้งสองฝ่าย"
            },
            {
                q: "ต้องระบุข้อมูลสำคัญใดบ้างลงในสัญญา",
                a: "ควรระบุรายละเอียดคู่สัญญา, ขอบเขตการอนุญาต (ประเภท/จำนวน), ลักษณะการอนุญาต, เงื่อนไข/ข้อจำกัด (ระยะเวลา/อาณาเขต), ค่าตอบแทน (ค่าธรรมเนียม/ค่าสิทธิ Royalty), และข้อตกลงอื่นๆ เช่น การควบคุมคุณภาพ"
            },
            {
                q: "ไม่ควรระบุ/กำหนดข้อมูลลักษณะใดลงในสัญญา",
                a: "หลีกเลี่ยงข้อตกลงที่จำกัดการแข่งขันโดยไม่เป็นธรรม เช่น การบังคับซื้อวัสดุจากผู้จำหน่ายที่กำหนดโดยไม่มีเหตุผล, การกำหนดราคาที่ไม่เป็นธรรม, หรือการกำหนดให้จ่ายค่าสิทธิแม้สิทธิบัตรจะหมดอายุไปแล้ว"
            }
        ]
    },
    {
        title: "ขั้นตอนการดำเนินการและเอกสารประกอบ",
        questions: [
            {
                q: "สัญญาอนุญาตให้ใช้สิทธิเกี่ยวข้องกับใครบ้าง",
                a: "เกี่ยวข้องกับ 1. ผู้อนุญาต (เจ้าของสิทธิ หรือตัวแทนผู้มีอำนาจ) และ 2. ผู้ได้รับอนุญาต (ผู้ที่นำสิทธิไปใช้ประโยชน์ หรือตัวแทนผู้มีอำนาจ)"
            },
            {
                q: "จะต้องทำอย่างไรต่อหลังจากที่ลงนามในสัญญาแล้ว",
                a: "ควรจัดทำเป็นคู่ฉบับเก็บไว้ฝ่ายละฉบับ ขอเอกสารยืนยันตัวตนของอีกฝ่าย (เช่น บัตรประชาชน, หนังสือรับรองนิติบุคคล) แนบเอกสารประกอบที่เกี่ยวข้อง และหากเป็นสิทธิที่ต้องจดทะเบียนกับกรมทรัพย์สินทางปัญญา ต้องนำสัญญาไปจดทะเบียนให้ถูกต้อง"
            },
            {
                q: "จำเป็นต้องแนบหลักฐานหรือพยานหรือไม่",
                a: "- หลักฐาน: ควรแนบเอกสารรายละเอียดสิทธิ (เช่น ภาพเครื่องหมายการค้า, ข้อถือสิทธิ) เพื่อความชัดเจน\n- พยาน: กฎหมายไม่ได้บังคับ แต่การมีพยานลงนามช่วยเพิ่มความน่าเชื่อถือและความสมบูรณ์ของเอกสาร"
            }
        ]
    },
    {
        title: "กฎหมาย ค่าใช้จ่าย และความช่วยเหลือ",
        questions: [
            {
                q: "กฎหมายที่เกี่ยวข้อง",
                a: "พ.ร.บ.เครื่องหมายการค้า, พ.ร.บ.ลิขสิทธิ์, พ.ร.บ.สิทธิบัตร, พ.ร.บ.คุ้มครองแบบผังภูมิวงจรรวม และประมวลกฎหมายแพ่งและพาณิชย์"
            },
            {
                q: "มีค่าใช้จ่ายใดบ้าง",
                a: "หลักๆ คือค่าธรรมเนียมในการจดทะเบียนการอนุญาตให้ใช้สิทธิกับหน่วยงานรัฐ (เช่น กรมทรัพย์สินทางปัญญา) สำหรับกรณีสิทธิที่จดทะเบียนไว้"
            },
            { q: "ความช่วยเหลือจากทนายความ", a: "คุณสามารถเลือกปรึกษาทนายความผ่านระบบของเราในตอนท้าย เพื่อช่วยตอบคำถามหรือช่วยเหลือในกระบวนการทางกฎหมาย" },
            { q: "การแก้ไขแบบฟอร์ม", a: "เพียงตอบแบบสอบถาม ระบบจะสร้างร่างเอกสารให้คุณโดยอัตโนมัติ ซึ่งคุณจะได้รับไฟล์ Word และ PDF ที่นำไปแก้ไขและใช้งานได้ทันที" }
        ]
    }
];

const AccordionItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => (
    <div className="border-b border-gray-100 last:border-0">
        <button
            onClick={onClick}
            className="w-full flex justify-between items-center py-5 text-left font-medium text-gray-800 hover:text-blue-700 transition-colors"
        >
            <span className="text-lg font-semibold">{question}</span>
            <span className="text-blue-500 text-2xl font-light">{isOpen ? '−' : '+'}</span>
        </button>
        {isOpen && (
            <div className="pb-5 text-gray-600 leading-relaxed whitespace-pre-wrap animate-in fade-in duration-300">
                {answer}
            </div>
        )}
    </div>
);

export default function LicensingAgreementGuide() {
    const [openItems, setOpenItems] = useState<string[]>([]);

    const toggleItem = (q: string) => {
        setOpenItems(prev => prev.includes(q) ? prev.filter(i => i !== q) : [...prev, q]);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-6">คู่มือข้อมูลสัญญาอนุญาตให้ใช้สิทธิ</h1>
                    <p className="text-lg text-gray-600 mb-8">ทำความเข้าใจข้อกฎหมายและแนวทางปฏิบัติในการจัดทำสัญญา Licensing Agreement เพื่อธุรกิจของคุณ</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105">
                        เริ่มสร้างสัญญาอนุญาตให้ใช้สิทธิ
                    </button>
                </header>

                {licensingGuideData.map((section, idx) => (
                    <section key={idx} className="mb-8 bg-white shadow-md rounded-2xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">{section.title}</h2>
                        <div className="h-1 w-16 bg-blue-500 mb-6 rounded-full"></div>
                        {section.questions.map((item, qIdx) => (
                            <AccordionItem
                                key={qIdx}
                                question={item.q}
                                answer={item.a}
                                isOpen={openItems.includes(item.q)}
                                onClick={() => toggleItem(item.q)}
                            />
                        ))}
                    </section>
                ))}

                <div className="mt-12 bg-blue-50 p-8 rounded-2xl border border-blue-100 text-center">
                    <h3 className="text-xl font-bold text-blue-900 mb-4">พร้อมเริ่มสร้างสัญญาอนุญาตให้ใช้สิทธิแล้วหรือยัง?</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        กรอกแบบสอบถามเพื่อสร้างเอกสารโดยอัตโนมัติ
                        คุณจะได้รับไฟล์ในรูปแบบ <strong>Word และ PDF</strong> ที่พร้อมนำไปใช้งานได้ทันที
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-xl shadow-md transition-all">
                        กรอกแบบฟอร์มสัญญาฯ
                    </button>
                </div>
            </div>
        </div>
    );
}