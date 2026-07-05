export default function DocsPage() {
  return (
    <div className="prose max-w-5xl mx-auto px-6 py-10 text-slate-900">
      <h1>Stripe Integration Guide</h1>
      <p>
        คู่มือนี้สรุปการตั้งค่า Stripe บนโปรเจกต์ และอธิบายการเชื่อมต่อทั้งฝั่ง client และ server
        พร้อมบันทึกปัญหา-วิธีแก้ เพื่อให้คุณสามารถทำเองได้ในอนาคต
      </p>

      <h2>1. สรุปการทำงานล่าสุด</h2>
      <ol>
        <li>เชื่อมต่อ Stripe ด้วยคีย์จาก <code>.env</code></li>
        <li>แก้ไข API route ที่สร้าง checkout session ใน <code>app/api/create-checkout-session/route.ts</code></li>
        <li>แก้หน้า client ใน <code>app/page.new.tsx</code> ให้เรียก API route แล้ว redirect</li>
        <li>ตรวจพบปัญหา <code>PRICE_ID</code> ไม่ถูกต้อง จึงเพิ่ม fallback สร้างรายการด้วย <code>price_data</code>
          แทน</li>
        <li>ทดสอบ API route แล้วได้รับ JSON response เป็น <code>sessionId</code></li>
      </ol>

      <h2>2. โครงสร้างการเชื่อมต่อ</h2>
      <p>ระบบ Stripe ในโปรเจกต์นี้มีสองส่วนหลัก:</p>
      <ul>
        <li>
          <strong>Client</strong> - โหลด publishable key, เรียก API, แล้ว redirect ไปยัง Stripe Checkout
        </li>
        <li>
          <strong>Server</strong> - ใช้ secret key สร้าง Checkout session แล้วคืนค่า session ID
        </li>
      </ul>

      <h3>2.1 ฝั่ง client</h3>
      <p>ไฟล์หลักคือ <code>app/page.new.tsx</code>.</p>
      <p>Flow ดังนี้:</p>
      <ol>
        <li>อ่านตัวแปร <code>process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code></li>
        <li>เรียก <code>loadStripe(stripePublishableKey)</code></li>
        <li>ผู้ใช้กดปุ่มจ่ายเงิน แล้วเรียก <code>{"fetch('/api/create-checkout-session', { method: 'POST' })"}</code></li>
        <li>รับ <code>sessionId</code> จาก API response</li>
        <li>เรียก <code>{"stripe.redirectToCheckout({ sessionId })"}</code> เพื่อไปยังหน้า Stripe Checkout</li>
      </ol>
      <p>สิ่งที่ต้องตรวจสอบใน client:</p>
      <ul>
        <li>publishable key ต้องเริ่มด้วย <code>pk_test_</code> สำหรับ sandbox</li>
        <li>ตัวแปร `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` ต้องตั้งไว้ใน `.env`</li>
        <li>ถ้า key ไม่ถูกต้องหรือไม่ถูกส่งไปยัง client จะเห็น error แจ้งว่า Stripe ไม่ถูก config</li>
      </ul>

      <h3>2.2 ฝั่ง server</h3>
      <p>ไฟล์หลักคือ <code>app/api/create-checkout-session/route.ts</code>. ทำงานดังนี้:</p>
      <ul>
        <li>อ่าน <code>process.env.STRIPE_SECRET_KEY</code> เพื่อสร้าง Stripe client</li>
        <li>อ่าน <code>process.env.PRICE_ID</code> หากมี</li>
        <li>เรียก <code>stripe.checkout.sessions.create()</code></li>
        <li>คืนค่า JSON ที่มี <code>sessionId</code></li>
      </ul>
      <p>โค้ดมี fallback สำหรับกรณี <code>PRICE_ID</code> ผิดพลาด:</p>
      <ul>
        <li>ถ้า <code>PRICE_ID</code> invalid จะลองสร้างรายการด้วย <code>price_data</code></li>
        <li>จึงทำให้การทดสอบยังใช้งานได้ แม้ว่าราคาจะยังไม่ถูกตั้งใน Stripe dashboard</li>
      </ul>

      <h2>3. ค่าที่ต้องตั้งค่าใน `.env`</h2>
      <p>ต้องมีตัวแปรหลักดังนี้:</p>
      <pre>
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
PRICE_ID=price_xxx
DOMAIN=http://localhost:3000
STRIPE_WEBHOOK_SECRET=whsec_xxx
      </pre>
      <ul>
        <li><code>STRIPE_SECRET_KEY</code> - ใช้ใน server เพื่อเรียก Stripe API</li>
        <li><code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> - ใช้ใน client เพื่อโหลด Stripe.js</li>
        <li><code>PRICE_ID</code> - ถ้ามีจะใช้สร้างรายการจากราคาใน Stripe</li>
        <li><code>DOMAIN</code> - ใช้ประกอบ <code>success_url</code> และ <code>cancel_url</code></li>
      </ul>
      <p>
        หากต้องการทดสอบแบบง่าย ๆ ให้ใช้คีย์ sandbox ของ Stripe และบัตรทดสอบ
        เช่น <code>4242 4242 4242 4242</code>
      </p>

      <h2>4. ขั้นตอนการติดตั้งและทดสอบ</h2>
      <h3>4.1 ติดตั้ง dependencies</h3>
      <pre>pnpm install</pre>
      <h3>4.2 รันโปรเจกต์</h3>
      <pre>pnpm dev</pre>
      <h3>4.3 ทดสอบจากเบราว์เซอร์</h3>
      <ol>
        <li>เปิดโปรเจกต์ในเบราว์เซอร์</li>
        <li>ไปที่หน้าที่มีปุ่มจ่ายเงิน</li>
        <li>กดปุ่มเพื่อเรียก <code>/api/create-checkout-session</code></li>
        <li>ระบบจะ redirect ไปยัง Stripe Checkout</li>
        <li>ใช้บัตรทดสอบเพื่อยืนยันการจ่ายเงิน</li>
      </ol>
      <h3>4.4 ทดสอบ API route ตรง ๆ</h3>
      <pre>curl -i -X POST http://localhost:3000/api/create-checkout-session</pre>
      <p>ถ้า response เป็น JSON ที่มี <code>sessionId</code> แสดงว่า backend สร้าง session ได้สำเร็จ</p>

      <h2>5. ปัญหาที่เจอและวิธีแก้</h2>
      <h3>5.1 ไม่มีราคาใน Stripe</h3>
      <p>
        ถ้า error บอกว่า <code>No such price</code> ให้ตรวจสอบว่า <code>PRICE_ID</code>
        เป็นของบัญชี Stripe เดียวกับคีย์ที่ใช้ หรือสร้าง price ใหม่ใน Stripe dashboard
      </p>
      <h3>5.2 คีย์ publishable ไม่ถูกส่ง</h3>
      <p>
        ตรวจสอบว่า <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> อยู่ในไฟล์ <code>.env</code>
        และไม่ลืม restart dev server หลังแก้ env
      </p>
      <h3>5.3 secret key ไม่ถูกตั้งใน server</h3>
      <p>
        ข้อความ <code>STRIPE_SECRET_KEY environment variable is not set</code>
        หมายความว่า server ยังไม่เห็นตัวแปรนี้ ให้ตั้งในไฟล์ <code>.env</code>
        แล้ว restart อีกครั้ง
      </p>

      <h2>6. แนวทางปรับปรุงต่อ</h2>
      <ul>
        <li>ทำให้ amount และคำอธิบายรายการใน Checkout dynamic ตามสัญญา</li>
        <li>เก็บสถานะการจ่ายเงินลงฐานข้อมูลหลัง checkout สำเร็จ</li>
        <li>ติดตั้ง webhook เพื่อยืนยันการชำระและอัพเดตสถานะอัตโนมัติ</li>
        <li>แสดงข้อความสำเร็จหลังกลับจาก Stripe ด้วยหน้า success ของคุณเอง</li>
      </ul>

      <h2>7. ไฟล์สำคัญที่ควรจดจำ</h2>
      <ul>
        <li><code>app/page.new.tsx</code> - client-side Stripe logic โดยตรง</li>
        <li><code>app/api/create-checkout-session/route.ts</code> - backend session creation</li>
        <li><code>.env</code> - เก็บคีย์และตัวแปร config</li>
        <li><code>app/api/webhook/route.ts</code> - ถ้าจะเพิ่ม Stripe webhook ในอนาคต</li>
      </ul>

      <h2>8. ข้อควรระวัง</h2>
      <ul>
        <li>อย่าใส่ <code>STRIPE_SECRET_KEY</code> ลงใน client-side code หรือ commit ลง repo</li>
        <li>ใช้คีย์ทดสอบในระหว่างพัฒนา และคีย์จริงเมื่อ deploy ขึ้น production</li>
        <li>หากใช้ webhook ให้ป้องกัน payload ด้วย <code>STRIPE_WEBHOOK_SECRET</code></li>
      </ul>

      <p>
        เอกสารนี้เป็นคู่มือสำหรับนักพัฒนาที่ต้องการเข้าใจ flow ของ Stripe
        และใช้งานให้สำเร็จทั้งฝั่ง client และ server ในโปรเจกต์นี้
      </p>
    </div>
  );
}
