import React, { useState } from 'react';

const tosGuideData = [
    {
        title: "ภาพรวมและนิยาม",
        questions: [
            {
                q: "ข้อตกลงการใช้งานเว็บไซต์/แอปพลิเคชันคืออะไร",
                a: "ข้อกำหนดและเงื่อนไขการใช้เว็บไซต์/แอปพลิเคชัน (Terms and Conditions) หรือข้อตกลงการใช้งาน (User Agreement) คือ สัญญาที่ผู้ให้บริการกำหนดขึ้นเพื่อควบคุมและกำหนดเงื่อนไข กฎเกณฑ์ และข้อจำกัดในการใช้งานสำหรับผู้ใช้งาน เพื่อความเป็นระเบียบ ป้องกันความเสียหาย และจัดการความรับผิดทางกฎหมาย"
            },
            {
                q: "ข้อตกลงการใช้งานฯ และนโยบายความเป็นส่วนตัวแตกต่างกันอย่างไร",
                a: "- ข้อตกลงการใช้งานฯ: ครอบคลุมการใช้งานในทุกด้าน เช่น กฎระเบียบ ข้อห้าม เงื่อนไขการขาย การจำกัดความรับผิด และทรัพย์สินทางปัญญา\n- นโยบายความเป็นส่วนตัว: มุ่งเน้นเฉพาะเรื่องการเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลเท่านั้น"
            }
        ]
    },
    {
        title: "ความจำเป็นและบุคคลที่เกี่ยวข้อง",
        questions: [
            {
                q: "จำเป็นต้องทำข้อตกลงการใช้งานฯ หรือไม่",
                a: "กฎหมายไม่ได้บังคับโดยตรง แต่หากมีการเก็บข้อมูลส่วนบุคคลอาจจำเป็นต้องมีเพื่อให้เป็นไปตามกฎหมาย และเพื่อป้องกันความเสียหายจากการใช้งานผิดวัตถุประสงค์ จึงแนะนำให้ควรจัดทำในทุกกรณีเพื่อรักษาผลประโยชน์ของทั้งสองฝ่าย"
            },
            {
                q: "ข้อตกลงการใช้งานฯ เกี่ยวข้องกับใครบ้าง",
                a: "1. ผู้ให้บริการ: เจ้าของเว็บไซต์/แอปพลิเคชัน (ผู้กำหนดข้อตกลง)\n2. ผู้ใช้งาน: ผู้เยี่ยมชม/สมาชิก (ผู้ยอมรับและมีหน้าที่ปฏิบัติตาม)"
            }
        ]
    },
    {
        title: "ขั้นตอนการดำเนินการและการจดทะเบียน",
        questions: [
            {
                q: "ต้องทำอย่างไรหลังจากจัดทำข้อตกลงแล้ว",
                a: "1. เผยแพร่ให้เข้าถึงง่ายบนหน้าเว็บ/แอปฯ\n2. ให้ผู้ใช้งานศึกษาและกด 'ยอมรับ' (Agree and Accepted) ก่อนใช้งานครั้งแรก\n3. จัดเก็บหลักฐานการให้ความยินยอมไว้เพื่อการอ้างอิง"
            },
            {
                q: "จำเป็นต้องจดทะเบียนกับหน่วยงานรัฐหรือไม่",
                a: "โดยทั่วไปไม่ต้องจดทะเบียนข้อตกลงฯ แต่หากมีการประกอบธุรกิจเฉพาะ เช่น E-Commerce (ต้องจดทะเบียนพาณิชย์อิเล็กทรอนิกส์), บริการชำระเงิน (ต้องขึ้นทะเบียนกับธปท.), หรือธุรกิจตลาดแบบตรง (ต้องขออนุญาต สคบ.) อาจต้องดำเนินการตามประเภทธุรกิจนั้นๆ"
            }
        ]
    },
    {
        title: "ประโยชน์และการจัดการเนื้อหาละเมิด",
        questions: [
            {
                q: "ข้อตกลงการใช้งานฯ มีประโยชน์อย่างไร",
                a: "- สร้างความเป็นระเบียบและประสิทธิภาพในการใช้งาน\n- ป้องกันความเสียหายต่อระบบ (เช่น การโพสต์ข้อมูลขนาดใหญ่เกินกำหนด)\n- ป้องกันความรับผิดทางกฎหมายของผู้ให้บริการ (เช่น กรณีผู้ใช้งานทำผิดกฎหมาย)\n- กำหนดเงื่อนไขเฉพาะ (เช่น การขายสินค้าหรือบริการ)"
            },
            {
                q: "ต้องทำอย่างไรหากผู้ใช้งานโพสต์เนื้อหาละเมิดลิขสิทธิ์",
                a: "1. จัดให้มีระบบกลั่นกรองเนื้อหา (Content Screening) โดยแอดมินหรือ AI\n2. บังคับใช้มาตรการลงโทษตามข้อตกลงฯ (เตือน, บล็อก, ลบสมาชิก)\n3. แจ้งเบาะแสหรือประสานงานหน่วยงานที่เกี่ยวข้องเพื่อแสดงความบริสุทธิ์ใจ"
            }
        ]
    },
    {
        title: "ข้อมูลสำคัญและกฎหมายที่เกี่ยวข้อง",
        questions: [
            {
                q: "ต้องระบุข้อมูลสำคัญใดบ้าง",
                a: "ข้อมูลผู้ให้บริการ, การบังคับใช้, ข้อจำกัดการใช้งาน, เงื่อนไขสมาชิก, การจัดการข้อมูลส่วนบุคคล, บทลงโทษ, เงื่อนไขการขาย/คืนสินค้า, การสงวนสิทธิ์ในทรัพย์สินทางปัญญา และช่องทางการติดต่อ"
            },
            {
                q: "กฎหมายใดบ้างที่เกี่ยวข้อง",
                a: "พ.ร.บ.ธุรกรรมทางอิเล็กทรอนิกส์, พ.ร.บ.ลิขสิทธิ์, พ.ร.บ.คอมพิวเตอร์, พ.ร.ก.ปราบปรามอาชญากรรมทางเทคโนโลยี, พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA), รวมถึงกฎหมายเฉพาะด้าน E-Commerce, ตลาดแบบตรง หรือระบบชำระเงิน"
            }
        ]
    },
    {
        title: "ความช่วยเหลือและการเริ่มต้น",
        questions: [
            { q: "ความช่วยเหลือจากทนายความ", a: "เรามีตัวเลือกให้คุณปรึกษาทนายความในตอนท้ายของกระบวนการสร้างเอกสาร เพื่อตอบคำถามหรือช่วยเหลือในขั้นตอนทางกฎหมาย" },
            { q: "การแก้ไขแบบฟอร์ม", a: "เพียงตอบแบบสอบถาม ระบบจะสร้างร่างเอกสารให้คุณโดยอัตโนมัติ ซึ่งคุณจะได้รับไฟล์ Word และ PDF ที่สามารถนำไปปรับแก้และใช้งานได้ทันที" }
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

export default function TermsOfServiceGuide() {
    const [openItems, setOpenItems] = useState<string[]>([]);

    const toggleItem = (q: string) => {
        setOpenItems(prev => prev.includes(q) ? prev.filter(i => i !== q) : [...prev, q]);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-6">คู่มือข้อตกลงการใช้งานเว็บไซต์/แอปพลิเคชัน</h1>
                    <p className="text-lg text-gray-600 mb-8">ทำความเข้าใจกฎเกณฑ์สำคัญเพื่อสร้างข้อตกลงที่ปกป้องธุรกิจและผู้ใช้งานของคุณ</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105">
                        กรอกแบบฟอร์มสร้างข้อตกลงฯ
                    </button>
                </header>

                {tosGuideData.map((section, idx) => (
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
                    <h3 className="text-xl font-bold text-blue-900 mb-4">พร้อมเริ่มสร้างเอกสารข้อตกลงการใช้งานแล้วหรือยัง?</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        กรอกแบบสอบถามเพียงไม่กี่นาที ระบบจะช่วยคุณสร้างเอกสารฉบับร่างที่สมบูรณ์
                        คุณจะได้รับไฟล์ในรูปแบบ <strong>Word และ PDF</strong> ที่พร้อมนำไปแก้ไขและใช้งานต่อได้ทันที
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-xl shadow-md transition-all">
                        เริ่มสร้างข้อตกลงการใช้งาน
                    </button>
                </div>
            </div>
        </div>
    );
}