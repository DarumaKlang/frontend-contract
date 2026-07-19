import React, { useState } from 'react';

const CarSalesAgreement: React.FC = () => {
const [data, setData] = useState({
datePlace: '', date: '',
// Seller Info
sellerName: '', sellerAge: '', sellerAddress: '', sellerSubDistrict: '', sellerDistrict: '', sellerProvince: '',
sellerId: '', sellerIdIssued: '',
// Buyer Info
buyerName: '', buyerAge: '', buyerAddress: '', buyerSubDistrict: '', buyerDistrict: '', buyerProvince: '', buyerId: '',
buyerIdIssued: '',
// Car Info
carType: '', carBrand: '', carModel: '', carYear: '', carGear: '', carColor: '', carPlate: '', carEngine: '',
carChassis: '',
// Payment Info
totalPrice: '', totalPriceText: '', paymentMethod: 'cash', chequeBank: '', chequeBranch: '', chequeNo: ''
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
    };

    return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-serif">
        <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 shadow-lg rounded-sm print:shadow-none print:p-0">

            <h1 className="text-3xl font-bold text-center mb-8">สัญญาซื้อขายรถยนต์</h1>

            <div className="space-y-2 mb-6">
                <p>สัญญาฉบับนี้จัดทำขึ้น ณ <input name="datePlace" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-48 px-1 outline-none"
                        placeholder="สถานที่ทำสัญญา" />
                    &nbsp;เมื่อวันที่ <input name="date" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-48 px-1 outline-none"
                        placeholder="วัน/เดือน/ปี" /></p>
            </div>

            {}
            <div className="mb-6 space-y-4">
                <p>ระหว่าง นาย / นาง / นางสาว <input name="sellerName" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-64 px-1 outline-none" />
                    &nbsp;อายุ <input name="sellerAge" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-12 px-1 outline-none" />
                    &nbsp;อาศัยอยู่บ้านเลขที่ <input name="sellerAddress" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-24 px-1 outline-none" />
                    &nbsp;ตำบล/แขวง <input name="sellerSubDistrict" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-32 px-1 outline-none" />
                    &nbsp;อำเภอ/เขต <input name="sellerDistrict" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-32 px-1 outline-none" />
                    &nbsp;จังหวัด <input name="sellerProvince" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-32 px-1 outline-none" />
                    &nbsp;บัตรประจำตัวประชาชนเลขที่ <input name="sellerId" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-40 px-1 outline-none" />
                    &nbsp;ออกให้โดย <input name="sellerIdIssued" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-32 px-1 outline-none" />
                    &nbsp;ซึ่งต่อไปในสัญญาจะเรียกว่า “ผู้ขาย”</p>

                <p>ฝ่ายหนึ่งกับ นาย / นาง / นางสาว <input name="buyerName" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-64 px-1 outline-none" />
                    &nbsp;อายุ <input name="buyerAge" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-12 px-1 outline-none" />
                    &nbsp;อาศัยอยู่บ้านเลขที่ <input name="buyerAddress" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-24 px-1 outline-none" />
                    &nbsp;ตำบล/แขวง <input name="buyerSubDistrict" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-32 px-1 outline-none" />
                    &nbsp;อำเภอ/เขต <input name="buyerDistrict" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-32 px-1 outline-none" />
                    &nbsp;จังหวัด <input name="buyerProvince" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-32 px-1 outline-none" />
                    &nbsp;บัตรประจำตัวประชาชนเลขที่ <input name="buyerId" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-40 px-1 outline-none" />
                    &nbsp;ออกให้โดย <input name="buyerIdIssued" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-32 px-1 outline-none" />
                    &nbsp;ซึ่งต่อไปในสัญญาจะเรียกว่า “ผู้ซื้อ” ฝ่ายหนึ่ง</p>
            </div>

            <p className="mb-6 font-semibold">คู่สัญญาทั้งสองฝ่ายตกลงเงื่อนไขสัญญากันไว้ โดยมีรายละเอียดดังนี้</p>

            {}
            <div className="space-y-6">
                <p><strong>ข้อ 1.</strong> ผู้ซื้อตกลงซื้อและผู้ขายตกลงขายรถยนต์ประเภท <input name="carType"
                        onChange={handleChange} className="border-b border-dashed border-gray-400 w-32 px-1" />
                    &nbsp;ยี่ห้อ <input name="carBrand" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-32 px-1" />
                    &nbsp;รุ่น <input name="carModel" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-24 px-1" />
                    &nbsp;ปี <input name="carYear" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-16 px-1" />
                    &nbsp;เกียร์ <input name="carGear" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-24 px-1" />
                    &nbsp;สี <input name="carColor" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-24 px-1" />
                    &nbsp;หมายเลขทะเบียน <input name="carPlate" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-24 px-1" />
                    &nbsp;หมายเลขเครื่อง <input name="carEngine" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-40 px-1" />
                    &nbsp;หมายเลขตัวถังรถยนต์ <input name="carChassis" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-40 px-1" />
                    &nbsp;ทั้งนี้
                    รายละเอียดของรถยนต์ปรากฏตามสมุดคู่มือทะเบียนรถยนต์แนบท้ายสัญญาและถือเป็นส่วนหนึ่งของสัญญานี้</p>

                <p><strong>ข้อ 2.</strong> คู่สัญญาทั้งสองฝ่ายตกลงซื้อขายรถยนต์คันดังกล่าว ในราคาทั้งสิ้น <input
                        name="totalPrice" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-32 px-1" /> บาท
                    (<input name="totalPriceText" onChange={handleChange}
                        className="border-b border-dashed border-gray-400 w-64 px-1" />)
                    ผู้ขายได้ชำระเงินทั้งหมดในวันทำสัญญาฉบับนี้แล้ว ชำระโดย
                    <label className="mx-2"><input type="radio" name="paymentMethod" value="cash"
                            checked={data.paymentMethod==='cash' } onChange={handleChange} /> เงินสด</label>
                    <label className="mx-2"><input type="radio" name="paymentMethod" value="cheque"
                            checked={data.paymentMethod==='cheque' } onChange={handleChange} /> เช็คธนาคาร</label>
                    {data.paymentMethod === 'cheque' && (
                    <span className="block mt-2">
                        ธนาคาร <input name="chequeBank" onChange={handleChange}
                            className="border-b border-dashed border-gray-400 w-32 px-1" />
                        สาขา <input name="chequeBranch" onChange={handleChange}
                            className="border-b border-dashed border-gray-400 w-32 px-1" />
                        เลขที่เช็ค <input name="chequeNo" onChange={handleChange}
                            className="border-b border-dashed border-gray-400 w-32 px-1" />
                    </span>
                    )}
                </p>

                <p><strong>ข้อ 3.</strong> ผู้ขายได้ทำการส่งมอบรถให้กับผู้ซื้อแล้ว
                    ในสภาพเรียบร้อยตรงตามวัตถุประสงค์ของผู้ซื้อทุกประการ
                    และให้ถือว่ากรรมสิทธิ์ในรถยนต์ได้โอนให้กับผู้ซื้อเรียบร้อยแล้วในวันทำสัญญานี้</p>

                <p><strong>ข้อ 4.</strong>
                    ผู้ซื้อตกลงจะดำเนินการเปลี่ยนแปลงชื่อเจ้าของรถยนต์ในสมุดคู่มือทะเบียนรถยนต์ด้วยค่าใช้จ่ายของผู้ซื้อเองทั้งสิ้น
                    โดยผู้ขายได้จัดทำหนังสือมอบอำนาจ
                    และเอกสารที่เกี่ยวข้องกับการดำเนินการดังกล่าวมอบให้ผู้ซื้อเรียบร้อยแล้วในวันทำสัญญานี้
                    ทั้งนี้ในระหว่างที่ผู้ซื้อดำเนินการตามวรรคแรก หากผู้ซื้อกระทำการใดๆ
                    หรือยินยอมให้บุคคลภายนอกกระทำการใดๆ ที่มีผลให้ผู้ขายได้รับความเดือดร้อน หรือได้รับความเสียหาย
                    ผู้ขายมีสิทธิที่จะเรียกค่าเสียหายจากผู้ซื้อได้ทันที</p>
            </div>

            {}
            <div className="mt-12 space-y-4">
                <p className="text-center">สัญญานี้ทำขึ้นเป็นสองฉบับ มีข้อความถูกต้องตรงกัน
                    ทั้งสองฝ่ายได้ทราบและเข้าใจข้อความโดยตลอดดีแล้ว เห็นว่าตรงตามเจตนาของตน
                    จึงได้ลงลายมือชื่อไว้เป็นสำคัญต่อหน้าพยาน และต่างยึดถือไว้ฝ่ายละฉบับ
                    ฉบับนี้สำหรับ.......................</p>

                <div className="grid grid-cols-2 gap-8 mt-8">
                    <div className="text-center">
                        <p className="mb-12">ลงชื่อ.......................................................(ผู้ขาย)</p>
                    </div>
                    <div className="text-center">
                        <p className="mb-12">ลงชื่อ.......................................................(ผู้ซื้อ)</p>
                    </div>
                    <div className="text-center">
                        <p className="mb-12">ลงชื่อ.......................................................(พยาน)</p>
                    </div>
                    <div className="text-center">
                        <p className="mb-12">ลงชื่อ.......................................................(พยาน)</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-center print:hidden">
                <button onClick={()=> window.print()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2
                    px-6 rounded shadow">สั่งพิมพ์สัญญา</button>
            </div>

        </div>
    </div>
    );
    };

    export default CarSalesAgreement;