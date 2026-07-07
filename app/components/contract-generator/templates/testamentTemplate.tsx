import React, { useState } from 'react';

export default function WillForm() {
    const [formData, setFormData] = useState({
        askmutitest: 'ไม่เคยทำพินัยกรรม',
        palcemade: '',
        madedate: '',
        testator: '',
        tid: '',
        tbd: '',
        tage: '',
        taddr: '',
        assetlists: '',
        hmanager1: '',
        testamentary: '',
        testamentaryid: '',
        ntest: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const renderVal = (key: keyof typeof formData) => (
        <span className="font-bold underline italic text-blue-900 px-1">
            {formData[key] || "________"}
        </span>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* FORM SIDE */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 h-fit lg:sticky lg:top-8">
                    <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">แบบฟอร์มกรอกพินัยกรรม</h2>
                    <form className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-blue-800">ข้อมูลพื้นฐาน</h3>
                            <div>
                                <label className="block text-sm font-medium mb-1">พินัยกรรมฉบับก่อนหน้า</label>
                                <select name="askmutitest" className="w-full p-3 border rounded-lg bg-gray-50" onChange={handleChange}>
                                    <option value="ไม่เคยทำพินัยกรรม">ไม่เคยทำพินัยกรรม</option>
                                    <option value="ยกเลิกทั้งหมดและบังคับใช้ตามพินัยกรรมฉบับนี้">ยกเลิกทั้งหมดและบังคับใช้ตามพินัยกรรมฉบับนี้</option>
                                    <option value="ยังคงบังคับใช้พินัยกรรมฉบับก่อนหน้าเท่าที่ไม่ขัดกับพินัยกรรมฉบับนี้">ยังคงบังคับใช้พินัยกรรมฉบับก่อนหน้าเท่าที่ไม่ขัดกับพินัยกรรมฉบับนี้</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input name="palcemade" placeholder="สถานที่ทำสัญญา" className="w-full p-3 border rounded-lg" onChange={handleChange} />
                                <input name="madedate" placeholder="วันที่ทำสัญญา" className="w-full p-3 border rounded-lg" onChange={handleChange} />
                            </div>
                            <input name="testator" placeholder="ชื่อผู้ทำพินัยกรรม" className="w-full p-3 border rounded-lg" onChange={handleChange} />
                            <div className="grid grid-cols-2 gap-4">
                                <input name="tid" placeholder="เลขบัตรประชาชน" className="w-full p-3 border rounded-lg" onChange={handleChange} />
                                <input name="tbd" placeholder="วันเกิด" className="w-full p-3 border rounded-lg" onChange={handleChange} />
                            </div>
                            <input name="tage" placeholder="อายุ" className="w-full p-3 border rounded-lg" onChange={handleChange} />
                            <input name="taddr" placeholder="ที่อยู่" className="w-full p-3 border rounded-lg" onChange={handleChange} />
                        </div>

                        <div className="space-y-4 border-t pt-6">
                            <h3 className="font-semibold text-lg text-blue-800">รายละเอียดพินัยกรรม</h3>
                            <textarea name="assetlists" placeholder="รายการทรัพย์สิน (มรดก)" className="w-full p-3 border rounded-lg h-24" onChange={handleChange} />
                            <input name="hmanager1" placeholder="ผู้จัดการมรดก" className="w-full p-3 border rounded-lg" onChange={handleChange} />
                            <input name="testamentary" placeholder="ผู้รับพินัยกรรม" className="w-full p-3 border rounded-lg" onChange={handleChange} />
                            <input name="testamentaryid" placeholder="เลขบัตรฯ ผู้รับพินัยกรรม" className="w-full p-3 border rounded-lg" onChange={handleChange} />
                            <input name="ntest" placeholder="จำนวนคู่ฉบับ" className="w-full p-3 border rounded-lg" onChange={handleChange} />
                        </div>

                        <button type="button" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition">ตรวจสอบข้อมูล</button>
                    </form>
                </div>

                { }
                <div className="bg-white p-10 md:p-16 rounded-2xl shadow-xl border border-gray-200">
                    <div className="prose prose-sm md:prose-base max-w-none text-gray-800 leading-relaxed font-serif">
                        <p className="text-center font-bold text-2xl mb-8">พินัยกรรม</p>
                        <p>พินัยกรรมฉบับนี้ทำขึ้นที่ {renderVal('palcemade')} เมื่อวันที่ {renderVal('madedate')} โดย</p>
                        <p className="indent-8">
                            ข้าพเจ้า<strong>{renderVal('testator')}</strong> ถือบัตรประจำตัวประชาชนเลขที่ {renderVal('tid')} เกิดเมื่อวันที่ {renderVal('tbd')}
                            ณ วันที่ทำพินัยกรรมฉบับนี้ อายุ {renderVal('tage')} ปี อยู่ที่ {renderVal('taddr')}
                        </p>

                        <p>ขอทำคำสั่งและแสดงเจตจำนงครั้งสุดท้ายไว้ในพินัยกรรมฉบับนี้ โดยมีรายละเอียดดังต่อไปนี้</p>

                        <p className="font-bold mt-4">ข้อ 1 มรดก</p>
                        <p>มรดกของข้าพเจ้า หมายความว่า</p>
                        <ul className="list-none pl-6 space-y-1">
                            <li>(ก) ทรัพย์สินใดๆ ของข้าพเจ้าไม่ว่าจะเป็นสังหาริมทรัพย์หรืออสังหาริมทรัพย์</li>
                            <li>(ข) สิทธิใดๆ ของข้าพเจ้า อันรวมถึงแต่ไม่จำกัดเพียง สิทธิในทรัพย์สินทางปัญญา...</li>
                            <li>(ค) หนี้ซึ่งไม่ใช่หนี้ที่โดยสภาพเป็นการเฉพาะตัว...</li>
                            <li>(ง) ทรัพย์สิน สิทธิ และหนี้ใดๆ ... ดังต่อไปนี้: {renderVal('assetlists')}</li>
                        </ul>

                        <p className="font-bold mt-4">ข้อ 2 ผู้จัดการมรดก</p>
                        <p>เมื่อข้าพเจ้าถึงแก่ความตาย ให้แต่งตั้ง <strong>{renderVal('hmanager1')}</strong> เป็นผู้จัดการมรดกตามข้อกำหนดในพินัยกรรมฉบับนี้</p>

                        <p className="font-bold mt-4">ข้อ 3 อำนาจจัดการของผู้จัดการมรดก</p>
                        <p>ให้ผู้จัดการมรดกมีอำนาจและหน้าที่ ดำเนินการจัดการมรดกให้เป็นไปตามเจตจำนงของข้าพเจ้าและผลประโยชน์ของกองมรดกเป็นสำคัญ</p>

                        <p className="font-bold mt-4">ข้อ 4 การจัดการมรดกโดยตัวแทน</p>
                        <p>ผู้จัดการมรดกจะต้องจัดการมรดกนั้นด้วยตัวผู้จัดการมรดกเอง เว้นแต่มีเหตุอันจำเป็นและสมควร</p>

                        <p className="font-bold mt-4">ข้อ 5 การจัดการศพ</p>
                        <p>ให้ผู้จัดการมรดกจัดการทำศพและ/หรืองานศพของข้าพเจ้า ตามประเพณีและพิธีกรรมทางศาสนาอันสมควรแก่ฐานานุรูป</p>

                        <p className="font-bold mt-4">ข้อ 6 การให้ทรัพย์สินมรดก</p>
                        <p>ข้าพเจ้าขอยกทรัพย์สินให้แก่: <strong>{renderVal('testamentary')}</strong> ถือบัตรฯ เลขที่ {renderVal('testamentaryid')} จำนวนทั้งสิ้นของทรัพย์มรดก</p>

                        <p className="font-bold mt-4">ข้อ 7 ระยะเวลาการจัดการและการแบ่งปันมรดก</p>
                        <p>ดำเนินการให้แล้วเสร็จภายใน 12 เดือนนับจากวันที่พินัยกรรมฉบับนี้มีผลบังคับใช้</p>

                        <p className="font-bold mt-4">ข้อ 8 กรณีผู้รับพินัยกรรมถึงแก่ความตายก่อน</p>
                        <p>ข้าพเจ้าขอยกมรดกในส่วนดังกล่าวให้ตกเป็นของทายาทโดยธรรมตามลำดับกฎหมาย</p>

                        <p className="font-bold mt-4">ข้อ 9 คู่ฉบับและการเก็บรักษา</p>
                        <p>พินัยกรรมฉบับนี้ทำขึ้นเป็น <strong>{renderVal('ntest')} ({renderVal('ntest')}) ฉบับ</strong></p>

                        <p className="font-bold mt-4">ข้อ 10 และ ข้อ 11</p>
                        <p className="text-gray-400 italic text-sm">(รายละเอียดข้อกำหนดเพิ่มเติมตามเงื่อนไขทางกฎหมายมาตรฐาน)</p>

                        <div className="mt-12 space-y-4">
                            <p className="text-center">ลงชื่อ_______________________ผู้ทำพินัยกรรม<br /><strong>{renderVal('testator')}</strong></p>
                            <div className="border-t pt-6 mt-6">
                                <p>ข้าพเจ้าทั้งสอง (พยาน) ขอรับรองว่าผู้ทำพินัยกรรมมีสติสัมปชัญญะสมบูรณ์ และกระทำโดยสมัครใจ</p>
                                <p className="mt-8">ลงชื่อ_______________________พยาน คนที่ 1</p>
                                <p className="mt-4">ลงชื่อ_______________________พยาน คนที่ 2</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}