import React, { useState } from 'react';

const productionGuideData = [
    {
        title: "ภาพรวมและนิยามของสัญญา",
        questions: [
            {
                q: "สัญญาว่าจ้างผลิตสื่อ/ผลงานคืออะไร",
                a: "สัญญาว่าจ้างผลิตสื่อ/ผลงาน (Production Agreement) คือ สัญญาที่คู่สัญญา 2 ฝ่าย คือ 'ผู้ว่าจ้าง' และ 'ผู้รับจ้าง' ตกลงกันให้ฝ่ายผู้รับจ้างผลิตสร้างสรรค์ผลงานตามขอบเขตที่กำหนด โดยผู้ว่าจ้างตกลงจะชำระค่าจ้างเพื่อตอบแทนการผลิตนั้น"
            },
            {
                q: "สื่อ/ผลงานที่ครอบคลุม",
                a: "ผลงานที่มักมีการว่าจ้างผลิต ได้แก่:\n- สื่อวิดีโอ: ภาพยนตร์, ภาพยนตร์โฆษณา, รายการโทรทัศน์/ออนไลน์, ละคร/ซีรีส์, สารคดี, แอนิเมชัน\n- สื่อภาพ: ภาพถ่าย, ภาพวาด, ภาพประดิษฐ์ (Artwork)\n- สื่อเสียง: เพลง, ดนตรี, ทำนอง\n- สื่อสิ่งพิมพ์: บทความ, บทประพันธ์, วารสาร"
            },
            {
                q: "ประเภทของสัญญาว่าจ้าง",
                a: "(1) สัญญาบริการทั่วไป: มีข้อสัญญาสำหรับการว่าจ้างทั่วไป\n(2) สัญญาเฉพาะเรื่อง: เช่น สัญญาว่าจ้างผลิตสื่อฉบับนี้, สัญญาว่าจ้างบุคคลสาธารณะเพื่อประชาสัมพันธ์, หรือสัญญาบริหารจัดการสื่อสังคมออนไลน์ (Social Media Marketing)"
            }
        ]
    },
    {
        title: "ความจำเป็นและสิ่งที่ควรระบุในสัญญา",
        questions: [
            {
                q: "จำเป็นต้องทำสัญญาเป็นลายลักษณ์อักษรหรือไม่",
                a: "กฎหมายไม่ได้บังคับ แต่การทำสัญญาเป็นลายลักษณ์อักษรมีความจำเป็นอย่างยิ่ง เพื่อกำหนดขอบเขตงาน ค่าตอบแทน ระยะเวลา และกรรมสิทธิ์ในทรัพย์สินทางปัญญา เพื่อป้องกันความเข้าใจผิดและรักษาผลประโยชน์ของทั้งสองฝ่าย"
            },
            {
                q: "สิ่งที่ควรระบุในสัญญา",
                a: "1. คู่สัญญา: ชื่อ ที่อยู่ ของทั้งสองฝ่าย\n2. ขอบเขตงาน: วัตถุประสงค์ แนวคิด (Concept) เนื้อหา (Content) และรายละเอียดงาน\n3. ค่าตอบแทน: อัตราค่าจ้าง กำหนดการจ่ายเงิน (งวดงาน)\n4. กระบวนการผลิต: กรอบเวลา, การตรวจสอบ, การแก้ไขงาน\n5. ทรัพย์สินทางปัญญา: ความเป็นเจ้าของลิขสิทธิ์\n6. ข้อตกลงอื่น: เช่น การจ้างงานช่วง (Sub-contracting)"
            },
            {
                q: "ข้อควรระวังเกี่ยวกับเนื้อหา (Content)",
                a: "ควรหลีกเลี่ยงเนื้อหาที่ขัดต่อความสงบเรียบร้อยหรือศีลธรรมอันดี หรือกระทบกระเทือนต่อความมั่นคงของรัฐ เพราะผลงานประเภทภาพยนตร์หรือสื่อสาธารณะอาจถูกเซ็นเซอร์ (Censored) หรือสั่งห้ามเผยแพร่ (Banned) ได้หากเนื้อหาไม่เหมาะสมตามกฎหมาย"
            }
        ]
    },
    {
        title: "ขั้นตอนการดำเนินการและเอกสารที่เกี่ยวข้อง",
        questions: [
            {
                q: "บุคคลที่เกี่ยวข้อง",
                a: "1. ผู้ว่าจ้าง: เจ้าของรายการ, ผู้สร้าง, หรือตัวแทนผู้มีอำนาจลงนาม\n2. ผู้รับจ้าง: บริษัทรับจ้างผลิต (Production House), สตูดิโอ, หรือตัวแทนผู้รับงาน"
            },
            {
                q: "การดำเนินการหลังลงนาม",
                a: "1. ทำสัญญาคู่ฉบับ (อย่างน้อย 2 ฉบับ)\n2. จัดเก็บสำเนาเอกสารตัวตน (บัตรประชาชน/หนังสือรับรองบริษัท) ของอีกฝ่าย\n3. แนบเอกสารประกอบ (ขอบเขตงาน/ใบเสนอราคา)\n4. นำสัญญาไปชำระอากรแสตมป์ตามกฎหมาย (ถือเป็นสัญญาจ้างทำของ) เพื่อให้สัญญาใช้เป็นพยานหลักฐานในศาลได้"
            },
            {
                q: "เรื่องพยานและทะเบียน",
                a: "ไม่มีกฎหมายบังคับให้ต้องจดทะเบียนรัฐหรือมีพยานลงนาม แต่การมีพยาน (ผู้บรรลุนิติภาวะ) จะช่วยยืนยันความสมัครใจในการทำสัญญาได้ดียิ่งขึ้น"
            }
        ]
    },
    {
        title: "ภาษี ทรัพย์สินทางปัญญา และข้อแนะนำเพิ่มเติม",
        questions: [
            {
                q: "ค่าใช้จ่ายทางภาษี",
                a: "1. อากรแสตมป์: จำเป็นต้องชำระตามกฎหมายเพื่อความสมบูรณ์ของสัญญา\n2. ภาษีมูลค่าเพิ่ม (VAT): ผู้รับจ้างมีหน้าที่ยื่นนำส่งกรมสรรพากร เว้นแต่เข้าข่ายได้รับยกเว้นตามกฎหมาย"
            },
            {
                q: "ทรัพย์สินทางปัญญาเป็นของใคร",
                a: "โดยปกติกฎหมายกำหนดให้ผู้ว่าจ้างเป็นเจ้าของลิขสิทธิ์ อย่างไรก็ดี คู่สัญญาสามารถตกลงกันเป็นอย่างอื่นได้ในสัญญา (ควรระบุให้ชัดเจนว่าสิทธิในผลงานชิ้นงานต้นฉบับ/Raw files เป็นของใคร)"
            },
            {
                q: "เหตุผลที่ต้องจ้างผลิตแทนการผลิตเอง",
                a: "เพื่อใช้ความเชี่ยวชาญเฉพาะด้าน (เช่น ผู้กำกับ, ทีมตัดต่อ) และทรัพยากร (เช่น สตูดิโอ, อุปกรณ์บันทึกภาพ/เสียง) ที่มีมาตรฐานสูงกว่าการทำเอง"
            }
        ]
    },
    {
        title: "ความช่วยเหลือและการสร้างเอกสาร",
        questions: [
            {
                q: "ความช่วยเหลือจากทนายความ",
                a: "คุณสามารถเลือกปรึกษาทนายความเพื่อตอบคำถามหรือช่วยเหลือในกระบวนการต่างๆ ได้ โดยจะมีตัวเลือกนี้ในตอนท้ายของเอกสาร"
            },
            {
                q: "การแก้ไขแบบฟอร์ม",
                a: "คุณสามารถกรอกแบบสอบถามสำหรับป้อนข้อมูล ระบบจะสร้างเอกสารขึ้นโดยอัตโนมัติตามคำตอบที่คุณกรอกเข้าไป คุณจะได้รับไฟล์รูปแบบ Word และ PDF ที่นำไปแก้ไขใช้งานต่อได้ทันที"
            }
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

export default function ProductionAgreementGuide() {
    const [openItems, setOpenItems] = useState<string[]>([]);

    const toggleItem = (q: string) => {
        setOpenItems(prev => prev.includes(q) ? prev.filter(i => i !== q) : [...prev, q]);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-6">สัญญาว่าจ้างผลิตสื่อและผลงาน</h1>
                    <p className="text-lg text-gray-600 mb-8">คู่มือทำความเข้าใจก่อนเริ่มสร้างสัญญาว่าจ้างการผลิตสื่อและงานสร้างสรรค์ด้วยตนเอง</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105">
                        กรอกแบบฟอร์มสัญญาว่าจ้างผลิตสื่อฯ
                    </button>
                </header>

                {productionGuideData.map((section, idx) => (
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
                    <h3 className="text-xl font-bold text-blue-900 mb-4">พร้อมเริ่มสร้างสัญญาแล้วหรือยัง?</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        กรอกแบบสอบถามเพื่อสร้างเอกสารโดยอัตโนมัติ
                        คุณจะได้รับไฟล์ในรูปแบบ <strong>Word และ PDF</strong> ที่พร้อมนำไปใช้งานได้ทันที
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-xl shadow-md transition-all">
                        เริ่มสร้างสัญญาว่าจ้างผลิตสื่อ/ผลงาน
                    </button>
                </div>
            </div>
        </div>
    );
}