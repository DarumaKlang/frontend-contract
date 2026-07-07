import React, { useState } from 'react';

const influencerGuideData = [
  {
    title: "ภาพรวมและนิยามของสัญญา",
    questions: [
      { 
        q: "สัญญาว่าจ้างบุคคลสาธารณะเพื่อการประชาสัมพันธ์ (Influencer Agreement) คืออะไร", 
        a: "คือสัญญาซึ่งมีคู่สัญญา 2 ฝ่าย ได้แก่ ผู้ว่าจ้าง (เช่น เจ้าของสินค้า บริการ หรือองค์กร) และผู้รับจ้าง (เช่น บุคคลสาธารณะ/อินฟลูเอนเซอร์) โดยที่ผู้ว่าจ้างตกลงว่าจ้างให้ผู้รับจ้างโฆษณา/ประชาสัมพันธ์ (เช่น โฆษณา โพสต์ แชร์ รีวิว) สินค้า ผลิตภัณฑ์ บริการ หรือองค์กร ของผู้ว่าจ้างผ่านช่องทางสื่อสังคมออนไลน์ของบุคคลสาธารณะ/อินฟลูเอนเซอร์" 
      },
      { 
        q: "การตลาดผ่านสื่อสังคมออนไลน์ (Social Media Marketing) คืออะไร", 
        a: "คือการโฆษณา ประชาสัมพันธ์ หรือการทำการตลาดเกี่ยวกับสินค้า ผลิตภัณฑ์ บริการ หรือองค์กรผ่านสื่อสังคมออนไลน์ (Social Media) เช่น การจัดทำสื่อและดำเนินการโฆษณา, การวางแผนกลยุทธ์, การบริหารจัดการสื่อสังคมออนไลน์ (Community Management), การบริหารจัดการขายสินค้า/บริการ และการจัดหาอินฟลูเอนเซอร์มาร่วมสนับสนุนการประชาสัมพันธ์" 
      }
    ]
  },
  {
    title: "ความแตกต่างและการจัดประเภทสัญญา",
    questions: [
      { 
        q: "สัญญาว่าจ้างอินฟลูเอนเซอร์และสัญญาจ้างบริหารจัดการตลาด (Agency) แตกต่างกันอย่างไร", 
        a: "สัญญาว่าจ้างอินฟลูเอนเซอร์: เน้นการว่าจ้างตัวบุคคล (Influencer) โดยตรง เพื่อทำหน้าที่รีวิวหรือนำเสนอสินค้า/แบรนด์ผ่านช่องทางส่วนตัวโดยไม่ผ่านตัวแทนโฆษณา\n\nสัญญาจ้างบริหารจัดการตลาด: เน้นการว่าจ้างบริษัทเอเจนซี (Agency) เพื่อวางแผนกลยุทธ์ภาพรวม บริหารจัดการสื่อสังคมออนไลน์ครบวงจร รวมถึงการดูแลลูกค้าหรือยิงโฆษณา" 
      },
      { 
        q: "ประเภทของสัญญาบริการ/จ้างทำของ", 
        a: "แบ่งเป็น 2 รูปแบบหลัก:\n1. สัญญาบริการทั่วไป: มีข้อสัญญาสำหรับการว่าจ้างทั่วไป\n2. สัญญาเฉพาะเรื่อง: เช่น สัญญาว่าจ้างอินฟลูเอนเซอร์โดยตรง, สัญญาว่าจ้างเอเจนซี, สัญญาจ้างผลิตสื่อ, สัญญาจ้างผลิตสินค้า หรือสัญญารับเหมาก่อสร้าง" 
      }
    ]
  },
  {
    title: "ความจำเป็นและขั้นตอนการดำเนินงาน",
    questions: [
      { 
        q: "จำเป็นต้องทำสัญญาว่าจ้างอินฟลูเอนเซอร์เป็นลายลักษณ์อักษรหรือไม่", 
        a: "กฎหมายไม่ได้บังคับ แต่แนะนำอย่างยิ่งให้จัดทำเพื่อรักษาผลประโยชน์ของทั้งสองฝ่าย โดยเฉพาะเรื่องขอบเขตงาน, แผนงาน, ค่าตอบแทน, และระยะเวลา เพื่อป้องกันความเข้าใจผิดและข้อพิพาทในภายหลัง" 
      },
      { 
        q: "จะต้องทำอย่างไรหลังจากลงนามในสัญญาแล้ว", 
        a: "1. จัดทำสัญญาคู่ฉบับเก็บไว้ฝ่ายละฉบับ\n2. แลกเปลี่ยนเอกสารยืนยันตัวตน (สำเนาบัตรประชาชน/หนังสือรับรองบริษัท)\n3. จัดทำเอกสารแนบท้าย (รายละเอียดงาน, อัตราค่าตอบแทน)\n4. นำสัญญาไปชำระอากรแสตมป์ตามกฎหมายเพื่อให้สัญญาเป็นพยานหลักฐานในศาลได้" 
      }
    ]
  },
  {
    title: "บุคคลที่เกี่ยวข้องและเอกสารประกอบ",
    questions: [
      { 
        q: "สัญญาว่าจ้างอินฟลูเอนเซอร์เกี่ยวข้องกับใครบ้าง", 
        a: "1. ผู้ว่าจ้าง: เจ้าของสินค้า/บริการ/องค์กร หรือตัวแทนผู้มีอำนาจ\n2. ผู้รับจ้าง: อินฟลูเอนเซอร์โดยตรง หรือผู้จัดการ/ตัวแทนผู้รับงาน" 
      },
      { 
        q: "จำเป็นต้องจดทะเบียนรัฐหรือมีพยานหรือไม่", 
        a: "- การจดทะเบียน: ไม่ต้องจดทะเบียนสัญญาดังกล่าวกับรัฐ\n- พยาน: กฎหมายไม่บังคับ แต่การมีพยานลงนามช่วยยืนยันความสมัครใจในการทำสัญญาได้ดียิ่งขึ้น" 
      }
    ]
  },
  {
    title: "ค่าใช้จ่ายและความช่วยเหลือ",
    questions: [
      { 
        q: "มีค่าใช้จ่ายใดบ้างที่เกี่ยวข้อง", 
        a: "- อากรแสตมป์: ต้องนำสัญญาไปติดอากรแสตมป์ตามกฎหมาย\n- ภาษีมูลค่าเพิ่ม (VAT): ผู้รับจ้างมีหน้าที่นำส่งภาษีตามกฎหมาย (เว้นแต่จะได้รับยกเว้นตามเกณฑ์ของกรมสรรพากร)" 
      },
      { 
        q: "ความช่วยเหลือจากทนายความ", 
        a: "เรามีตัวเลือกให้คุณปรึกษาทนายความในตอนท้ายของกระบวนการสร้างเอกสาร เพื่อตอบคำถามหรือช่วยเหลือในขั้นตอนทางกฎหมาย" 
      },
      { 
        q: "การแก้ไขแบบฟอร์ม", 
        a: "เพียงตอบแบบสอบถาม ระบบจะสร้างร่างเอกสารให้คุณโดยอัตโนมัติ ซึ่งคุณจะได้รับไฟล์ Word และ PDF ที่พร้อมนำไปแก้ไขและใช้งานต่อได้ทันที" 
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

export default function InfluencerAgreementGuide() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (q: string) => {
    setOpenItems(prev => prev.includes(q) ? prev.filter(i => i !== q) : [...prev, q]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">คู่มือสัญญาจ้างอินฟลูเอนเซอร์</h1>
          <p className="text-lg text-gray-600 mb-8">ทำความเข้าใจแนวปฏิบัติทางกฎหมายในการว่าจ้างบุคคลสาธารณะเพื่อการประชาสัมพันธ์</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105">
            เริ่มสร้างสัญญาจ้างอินฟลูเอนเซอร์
          </button>
        </header>

        {influencerGuideData.map((section, idx) => (
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
            <h3 className="text-xl font-bold text-blue-900 mb-4">พร้อมเริ่มสร้างสัญญาจ้างอินฟลูเอนเซอร์แล้วหรือยัง?</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
                กรอกแบบสอบถามเพียงไม่กี่นาที ระบบจะช่วยคุณสร้างเอกสารฉบับร่างที่สมบูรณ์ 
                คุณจะได้รับไฟล์ในรูปแบบ <strong>Word และ PDF</strong> ที่พร้อมนำไปแก้ไขและใช้งานต่อได้ทันที
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-xl shadow-md transition-all">
                เริ่มสร้างสัญญาจ้างอินฟลูเอนเซอร์
            </button>
        </div>
      </div>
    </div>
  );
}