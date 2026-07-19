# 🔍 รายงานการตรวจสอบโครงสร้างและความปลอดภัย
**Contract Generator Application**  
**วันที่:** 13 กรกฎาคม 2026  
**เวอร์ชัน:** Next.js 16.2.9, React 19.2.7

---

## 📋 สรุปผลการตรวจสอบ

### ✅ จุดแข็ง (Strengths)
1. ใช้ Supabase RLS (Row Level Security) ป้องกันข้อมูลระหว่าง users
2. ใช้ JWT verification สำหรับ admin routes
3. มี input validation พื้นฐานใน register API
4. ไม่พบ SQL injection vulnerabilities (ใช้ ORM และ parameterized queries)
5. Environment variables ถูก gitignore อย่างถูกต้อง
6. ใช้ HTTPS cookies ใน production

---

## 🚨 ปัญหาวิกฤติ (Critical Issues)

### 1. **HARDCODED CREDENTIALS ใน lib/auth.ts** ⚠️⚠️⚠️
```typescript
const users: User[] = [
  {
    id: 'admin-1',
    email: 'Admin@Nuc7.com',
    password: 'Admin@5577',  // ❌ PLAINTEXT PASSWORD
    role: 'admin',
  },
];
```
**ความเสี่ยง:** 
- รหัสผ่าน admin ถูกฝังตายในโค้ด
- เก็บรหัสผ่านแบบ plaintext (ไม่ hash)
- ทุกคนที่เข้าถึง repo เห็นรหัสผ่าน admin ได้

**แนะนำ:**
```typescript
// ลบ hardcoded users array ออกทั้งหมด
// ใช้ Supabase authentication แทน
```

---

### 2. **ระบบ Authentication ซ้ำซ้อน** ⚠️⚠️
มีระบบ auth หลายแบบทำงานคู่กัน:
- **lib/auth.ts** - In-memory users array (legacy, ไม่ปลอดภัย)
- **Supabase Auth** - ระบบหลักที่ใช้งานจริง
- **NextAuth** - ติดตั้งไว้แต่ไม่ได้ใช้งาน

**ปัญหา:**
- สับสน ไม่รู้ว่าใช้ระบบไหน
- เสี่ยงต่อช่องโหว่จากโค้ดที่ไม่ได้ใช้
- ยากต่อการ maintain

**แนะนำ:**
```bash
# ลบระบบที่ไม่ใช้ออก
- ลบ lib/auth.ts (ระบบ in-memory)
- ลบ next-auth dependency (ถ้าไม่ใช้)
- ใช้ Supabase Auth เป็นระบบเดียว
```

---

### 3. **Missing Environment Variables Validation** ⚠️⚠️
```typescript
// lib/config.ts - จะ throw error ถ้าไม่มี env var
// แต่หลาย API routes ใช้ || '' แทน
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
```

**ปัญหา:**
- บาง API ทำงานได้แม้ไม่มี required env vars
- ไม่มีการ validate env ตอน startup
- Error เกิดตอน runtime แทนที่จะเป็นตอน build

**แนะนำ:**
```typescript
// สร้าง validation file
// lib/env.ts
const requiredEnvVars = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_JWT_SECRET'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required env var: ${varName}`);
  }
});
```

---

### 4. **XSS Vulnerability via dangerouslySetInnerHTML** ⚠️
พบการใช้ `dangerouslySetInnerHTML` ใน 3 ที่:
```typescript
// app/contracts/page.tsx
<div dangerouslySetInnerHTML={{ __html: buildContractBody(...) }} />

// app/components/contract-generator/ContractPreviewPanel.tsx
<div dangerouslySetInnerHTML={{ __html: generatedHtml }} />

// app/components/contract-generator/company/Blog.tsx
<div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
```

**ความเสี่ยง:**
- ถ้า user input ไม่ถูก sanitize จะเกิด XSS attack
- Attacker inject malicious script ได้

**แนะนำ:**
```bash
pnpm add dompurify
pnpm add -D @types/dompurify
```

```typescript
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(generatedHtml) 
}} />
```

---

## ⚠️ ปัญหาสำคัญ (High Priority Issues)

### 5. **ไฟล์ .env ถูก commit ขึ้น Git** ⚠️
```bash
# ไฟล์เหล่านี้มีอยู่ใน repo
.env
.env.local
```

**ความเสี่ยง:**
- ถ้า push ขึ้น public repo = เปิดเผย secrets ทั้งหมด
- ใครก็ได้เห็น Stripe keys, database passwords

**แนะนำ:**
```bash
# ลบออกจาก Git history
git rm --cached .env .env.local
git commit -m "Remove sensitive env files"

# ตรวจสอบว่า .gitignore มีแล้ว (มีอยู่แล้ว ✅)
```

---

### 6. **ไฟล์ tmp-* ควรถูกลบออก** ⚠️
พบไฟล์ testing หลายไฟล์:
```
tmp-api-call.sh
tmp-api-profile-test.mjs
tmp-auth-test.mjs
tmp-supabase-signin.mjs
... (18 files total)
```

**ปัญหา:**
- อาจมี credentials หรือ tokens
- ไฟล์ขยะที่ไม่จำเป็น
- ทำให้ repo สกปรก

**แนะนำ:**
```bash
# ลบไฟล์ tmp ทั้งหมด
Remove-Item tmp-*.* -Force

# เพิ่มใน .gitignore
echo "tmp-*" >> .gitignore
```

---

### 7. **Missing Rate Limiting** ⚠️
API routes ไม่มี rate limiting:
- `/api/login`
- `/api/register`
- `/api/create-checkout-session`

**ความเสี่ยง:**
- Brute force attacks
- DDoS attacks
- Credit card testing attacks

**แนะนำ:**
```bash
pnpm add @upstash/ratelimit @upstash/redis
```

```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function middleware(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }
}
```

---

### 8. **Stripe Webhook ไม่มี Replay Protection** ⚠️
```typescript
// app/api/stripe/webhook/route.ts
// ใช้ event_id เพื่อป้องกัน duplicate แต่ไม่ check timestamp
```

**ความเสี่ยง:**
- Replay attacks
- Duplicate payment processing

**แนะนำ:**
```typescript
// ตรวจสอบ timestamp ของ event
const eventAge = Date.now() - (event.created * 1000);
const MAX_EVENT_AGE = 5 * 60 * 1000; // 5 minutes

if (eventAge > MAX_EVENT_AGE) {
  return NextResponse.json({ error: 'Event too old' }, { status: 400 });
}
```

---

## ⚡ ปัญหารอง (Medium Priority Issues)

### 9. **Inconsistent Error Handling**
```typescript
// บาง API return status 500, บาง return 502
return NextResponse.json({ error: '...' }, { status: 500 });
return NextResponse.json({ error: '...' }, { status: 502 });
```

**แนะนำ:** ใช้ error handling แบบสม่ำเสมอ
```typescript
// lib/errors.ts
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// middleware error handler
```

---

### 10. **Missing CORS Headers**
ไม่มี CORS configuration

**ความเสี่ยง:**
- ถ้ามี frontend อื่นเรียก API จะถูกบล็อก
- หรือถ้าไม่ตั้งค่าให้ดี = เปิดกว้างเกินไป

**แนะนำ:**
```typescript
// middleware.ts
export function middleware(request: Request) {
  const response = NextResponse.next();
  
  response.headers.set('Access-Control-Allow-Origin', 'https://yourdomain.com');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}
```

---

### 11. **Missing Security Headers**
ไม่มี security headers ใน Next.js config

**แนะนำ:**
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};
```

---

### 12. **Database Connection Pool ไม่มี Max Connections**
```typescript
// lib/db.ts
export const pool = new Pool({
  connectionString,
  ssl: ...,
  // ❌ ไม่มี max, min, idleTimeoutMillis
});
```

**แนะนำ:**
```typescript
export const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  max: 20,
  min: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

---

### 13. **No Logging/Monitoring**
ไม่มี structured logging

**แนะนำ:**
```bash
pnpm add pino pino-pretty
```

```typescript
// lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty'
  } : undefined,
});
```

---

## 📦 ปัญหาด้านโครงสร้าง (Structural Issues)

### 14. **server.js ซ้ำซ้อนกับ Next.js API Routes**
```javascript
// server.js - Express server ที่ไม่ได้ใช้งาน
app.post('/create-checkout-session', async (req, res) => {
  // ซ้ำกับ app/api/create-checkout-session/route.ts
});
```

**แนะนำ:** ลบ `server.js` ออก (ใช้ Next.js API Routes อย่างเดียว)

---

### 15. **Unused Dependencies**
```json
{
  "express": "^4.22.2",        // ไม่ได้ใช้
  "cookie-parser": "^1.4.6",   // ไม่ได้ใช้
  "next-auth": "^4.24.7",      // ไม่ได้ใช้
  "bcryptjs": "^3.0.3"         // ไม่ได้ใช้
}
```

**แนะนำ:**
```bash
pnpm remove express cookie-parser next-auth bcryptjs
```

---

### 16. **Multiple Agent Config Folders**
พบโฟลเดอร์ของ AI assistants หลายตัว:
```
.agents/
.claude/
.junie/
.kiro/
.qoder/
.trae/
.windsurf/
```

**แนะนำ:** เก็บแค่ตัวที่ใช้งานจริง ส่วนอื่นเพิ่มใน `.gitignore` (มีอยู่แล้ว ✅)

---

## 🔧 ข้อเสนอแนะเพิ่มเติม

### 17. **Environment Variables Organization**
ตอนนี้มีชื่อ env var หลายแบบสำหรับสิ่งเดียวกัน:
```env
DOMAIN
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_BACKEND_URL
BACKEND_MANAGER_URL
NEXT_PUBLIC_API_BASE_URL
```

**แนะนำ:** ใช้ชื่อเดียวสม่ำเสมอ
```env
# ใช้แค่ 2 ตัว
NEXT_PUBLIC_APP_URL=https://contract-generator.com
NEXT_PUBLIC_API_URL=https://contract-generator.com/api
```

---

### 18. **Missing Input Sanitization**
Contract data ไม่มี sanitization ก่อนบันทึก

**แนะนำ:**
```bash
pnpm add validator
```

```typescript
import validator from 'validator';

const sanitizedData = {
  title: validator.escape(data.title),
  // ... sanitize ข้อมูลอื่นๆ
};
```

---

### 19. **No Backup Strategy**
ไม่มีระบบ backup สำหรับ Supabase data

**แนะนำ:**
- ตั้งค่า Supabase automatic backups
- Export data เป็นประจำ
- Test restore procedure

---

### 20. **Missing Health Check Endpoint**
ไม่มี `/health` หรือ `/api/health` endpoint

**แนะนำ:**
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || 'unknown',
  });
}
```

---

## 📊 สรุปลำดับความสำคัญ

| Priority | Issue | Impact | Effort |
|----------|-------|--------|--------|
| 🔴 Critical | Hardcoded credentials | ⚠️⚠️⚠️ | Low |
| 🔴 Critical | XSS via dangerouslySetInnerHTML | ⚠️⚠️⚠️ | Low |
| 🔴 Critical | Duplicate auth systems | ⚠️⚠️ | Medium |
| 🟡 High | Missing rate limiting | ⚠️⚠️ | Medium |
| 🟡 High | .env files in git | ⚠️⚠️ | Low |
| 🟡 High | Stripe webhook replay protection | ⚠️⚠️ | Low |
| 🟢 Medium | Security headers | ⚠️ | Low |
| 🟢 Medium | CORS configuration | ⚠️ | Low |
| 🟢 Medium | Unused dependencies | ⚠️ | Low |

---

## ✅ แผนการแก้ไขแนะนำ

### Phase 1: ความปลอดภัยเร่งด่วน (1-2 วัน)
1. ลบ hardcoded credentials ใน `lib/auth.ts`
2. เพิ่ม DOMPurify สำหรับ XSS protection
3. ลบ `.env` ออกจาก git history
4. ลบไฟล์ `tmp-*` ทั้งหมด

### Phase 2: ปรับปรุงระบบ (3-5 วัน)
5. ทำความสะอาด authentication system (เหลือ Supabase อย่างเดียว)
6. เพิ่ม rate limiting
7. เพิ่ม security headers
8. ปรับปรุง error handling

### Phase 3: Optimization (1 สัปดาห์)
9. ลบ dependencies ที่ไม่ใช้
10. เพิ่ม logging/monitoring
11. ตั้งค่า database connection pool
12. เพิ่ม health check endpoint

---

## 📝 Checklist สำหรับ Production

- [ ] Environment variables validated
- [ ] No hardcoded secrets
- [ ] XSS protection enabled
- [ ] Rate limiting configured
- [ ] Security headers set
- [ ] CORS properly configured
- [ ] Database backups scheduled
- [ ] Monitoring/logging enabled
- [ ] Health checks working
- [ ] Error handling standardized
- [ ] Unused code removed
- [ ] Dependencies up-to-date
- [ ] SSL/TLS certificates valid
- [ ] Stripe webhook signature verified
- [ ] Row Level Security enabled

---

**หมายเหตุ:** รายงานนี้จัดทำขึ้นเพื่อช่วยปรับปรุงความปลอดภัยและคุณภาพของโค้ด ควรแก้ไขปัญหาตามลำดับความสำคัญก่อน deploy ขึ้น production
