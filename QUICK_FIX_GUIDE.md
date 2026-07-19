# 🚀 คู่มือแก้ไขด่วน - Contract Generator

## ✅ แก้ไขปัญหาวิกฤติใน 30 นาที

### 1️⃣ ลบ Hardcoded Credentials (5 นาที)

```bash
# ลบไฟล์ที่มีปัญหา
Remove-Item lib\auth.ts
```

สร้างไฟล์ใหม่ `lib/auth.ts`:
```typescript
// lib/auth.ts - ใช้ Supabase เท่านั้น
export { getSupabaseClient } from './supabase';

export const SESSION_COOKIE = 'sb-access-token';

export async function getSessionUser(token: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  
  const { data: { user } } = await supabase.auth.getUser(token);
  return user;
}
```

---

### 2️⃣ แก้ XSS Vulnerability (10 นาที)

```bash
# ติดตั้ง DOMPurify
pnpm add dompurify
pnpm add -D @types/dompurify
pnpm add -D @types/isomorphic-dompurify
```

สร้างไฟล์ `lib/sanitize.ts`:
```typescript
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'div', 'span'],
    ALLOWED_ATTR: ['class', 'style'],
  });
}
```

แก้ไขไฟล์ที่ใช้ `dangerouslySetInnerHTML`:
```typescript
// app/components/contract-generator/ContractPreviewPanel.tsx
import { sanitizeHtml } from '@/lib/sanitize';

<div 
  className="..." 
  dangerouslySetInnerHTML={{ __html: sanitizeHtml(generatedHtml) }} 
/>
```

---

### 3️⃣ ลบไฟล์ .env ออกจาก Git (3 นาที)

```bash
# ลบออกจาก staging
git rm --cached .env .env.local

# Commit
git add .
git commit -m "security: remove sensitive env files from git"

# Verify
git log --all --full-history -- .env
```

**ถ้าไฟล์ถูก push ไปแล้ว:**
```bash
# CRITICAL: ต้องเปลี่ยน credentials ทั้งหมดใน .env ทันที!
# - Stripe keys
# - Supabase keys  
# - Database passwords
```

---

### 4️⃣ ลบไฟล์ tmp-* (2 นาที)

```bash
# ลบไฟล์ทั้งหมด
Remove-Item tmp-*.* -Force

# เพิ่มใน .gitignore
Add-Content .gitignore "`ntmp-*.*"

# Commit
git add .gitignore
git commit -m "chore: ignore tmp files"
```

---

### 5️⃣ Environment Variables Validation (10 นาที)

สร้างไฟล์ `lib/env.ts`:
```typescript
// lib/env.ts
const requiredEnvVars = {
  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  
  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET,
  
  // App
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || process.env.DOMAIN,
};

export function validateEnv() {
  const missing: string[] = [];
  
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value || value.trim() === '') {
      missing.push(key);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map(k => `  - ${k}`).join('\n')}`
    );
  }
  
  console.log('✅ All required environment variables are set');
}

export function getEnv() {
  return {
    stripeSecretKey: requiredEnvVars.STRIPE_SECRET_KEY!,
    stripeWebhookSecret: requiredEnvVars.STRIPE_WEBHOOK_SECRET!,
    stripePublishableKey: requiredEnvVars.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    supabaseUrl: requiredEnvVars.SUPABASE_URL!,
    supabaseAnonKey: requiredEnvVars.SUPABASE_ANON_KEY!,
    supabaseJwtSecret: requiredEnvVars.SUPABASE_JWT_SECRET!,
    appUrl: requiredEnvVars.NEXT_PUBLIC_APP_URL!,
  };
}
```

เพิ่มใน `app/layout.tsx` หรือ `next.config.ts`:
```typescript
import { validateEnv } from './lib/env';

// Validate env vars at build time
if (process.env.NODE_ENV !== 'development') {
  validateEnv();
}
```

---

## 🛡️ Security Headers (5 นาที)

แก้ไข `next.config.ts`:
```typescript
import type { NextConfig } from "next";

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
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## 🧹 ลบ Dependencies ที่ไม่ใช้ (3 นาที)

```bash
pnpm remove express cookie-parser bcryptjs next-auth
```

ลบไฟล์:
```bash
Remove-Item server.js
```

---

## ✅ Checklist

- [ ] ลบ hardcoded credentials
- [ ] เพิ่ม XSS protection (DOMPurify)
- [ ] ลบ .env ออกจาก git
- [ ] ลบไฟล์ tmp-*
- [ ] เพิ่ม env validation
- [ ] เพิ่ม security headers
- [ ] ลบ dependencies ที่ไม่ใช้
- [ ] ลบ server.js

---

## 🚀 Deploy Checklist

ก่อน push ขึ้น production:

```bash
# 1. Test build locally
pnpm build

# 2. Verify env vars
node -e "require('./lib/env').validateEnv()"

# 3. Commit changes
git add .
git commit -m "security: critical security fixes"

# 4. Push
git push origin main
```

ใน Vercel:
1. ตั้งค่า Environment Variables ทั้งหมดตาม `.env.local.example`
2. Redeploy

---

## 📞 ถ้าเจอปัญหา

### Build ล้มเหลว
```bash
# Clear cache
Remove-Item -Recurse -Force .next

# Reinstall
Remove-Item -Recurse -Force node_modules
pnpm install

# Build again
pnpm build
```

### Environment Variables ไม่โหลด
```bash
# Restart dev server
# Ctrl+C
pnpm dev
```

### Type errors
```bash
# Rebuild types
pnpm exec tsc --noEmit
```

---

**เวลาทั้งหมด:** ~30-40 นาที  
**ผลลัพธ์:** แก้ไขปัญหาความปลอดภัยวิกฤติทั้งหมด ✅
