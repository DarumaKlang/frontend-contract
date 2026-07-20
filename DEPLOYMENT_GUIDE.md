# Database Template Integration - Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the database template integration feature to production. The deployment follows a safe, phased rollout strategy with fallback support.

## Pre-Deployment Checklist

- [ ] All tests passing (`npm test -- --run`)
- [ ] Security audit completed (`lib/security/SECURITY.md`)
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Backup of current hardcoded templates created
- [ ] Staging environment testing completed
- [ ] Admin team trained on Template Editor

## Phase 1: Preparation (Pre-Production)

### 1.1 Environment Configuration

Add the following environment variables to `.env.local`:

```bash
# Template Caching
TEMPLATE_CACHE_TTL_MINUTES=10
TEMPLATE_CACHE_MAX_SIZE=100
TEMPLATE_CACHE_ENABLED=true

# Fallback Strategy
TEMPLATE_FALLBACK_ENABLED=true

# Developer Mode (optional, for debugging)
DEVELOPER_MODE=false
```

Document these in `.env.local.example`:

```bash
# Template Configuration
# Time-to-live for template cache in minutes (default: 10)
TEMPLATE_CACHE_TTL_MINUTES=10

# Maximum number of templates to cache (default: 100)
TEMPLATE_CACHE_MAX_SIZE=100

# Enable/disable template caching (default: true)
TEMPLATE_CACHE_ENABLED=true

# Enable/disable fallback to hardcoded templates (default: true)
TEMPLATE_FALLBACK_ENABLED=true

# Enable developer mode to see template metadata (default: false)
DEVELOPER_MODE=false
```

### 1.2 Database Verification

Verify that the database schema is set up:

```sql
-- Check contract_templates table
SELECT COUNT(*) FROM contract_templates;

-- Check template_revisions table
SELECT COUNT(*) FROM template_revisions;

-- Verify indexes exist
SELECT * FROM information_schema.statistics 
WHERE table_name = 'contract_templates';
```

### 1.3 Backup Current State

Before migration, create backups:

```bash
# Backup current hardcoded templates
npm run build

# Export current database state (if using Supabase)
# Use Supabase dashboard: Project Settings > Database > Backups

# Create git tag for current release
git tag -a v1.0-pre-templates -m "Pre-template-integration release"
git push origin v1.0-pre-templates
```

## Phase 2: Template Migration (Pre-Production)

### 2.1 Run Template Migration Script

Execute the migration script to convert hardcoded templates to database format:

```bash
# Development environment
npm run migrate:templates

# Production environment (with confirmation)
npm run migrate:templates:prod
```

The script will:
1. Read hardcoded templates from `lib/contractTemplates.ts`
2. Convert TypeScript logic to Handlebars syntax
3. Extract all variables and helpers
4. Insert templates into database with `is_active=false, is_draft=true`
5. Generate migration report

**Expected Output**:
```
🚀 Template Migration Report
============================
Processed: 10 templates (5 contract types × 2 languages)

✅ Successful: 10
❌ Failed: 0
⚠️  Warnings: 2

Details:
  • lease-th: v1 ✅
  • lease-en: v1 ✅
  • vehicle-sale-th: v1 ✅
  • vehicle-sale-en: v1 ✅
  • property-sale-th: v1 ✅
  • property-sale-en: v1 ✅
  • employment-th: v1 ✅
  • employment-en: v1 ✅
  • testament-th: v1 ✅
  • testament-en: v1 ✅

All templates imported successfully!
Migration timestamp: 2024-01-15T10:30:00Z
```

### 2.2 Validate Migration

Verify that all templates were migrated correctly:

```bash
# Run validation script
npm run validate:template-coverage

# Expected output:
# ✅ lease: en, th
# ✅ vehicle-sale: en, th
# ✅ property-sale: en, th
# ✅ employment: en, th
# ✅ testament: en, th
# All 10 required templates found!
```

### 2.3 Test in Staging

Deploy to staging environment and test:

```bash
# 1. Generate contracts with database templates
# Expected: All contracts render using database templates

# 2. Test cache functionality
# Expected: Cache hit rate ~90% after 10+ requests

# 3. Test fallback by disabling database
# Expected: Contracts still render using fallback templates

# 4. Monitor performance
# Expected: <100ms rendering time per contract
```

## Phase 3: Controlled Rollout (Gradual Production)

### 3.1 Publish First Template

In Admin Template Editor, publish the first template for testing:

1. Go to Admin > Template Management
2. Find `lease-th` template (version 1)
3. Click "Publish"
4. Confirm the publish

**Admin should see**:
- Previous active template automatically deactivated
- New template set to `is_active=true`
- Cache automatically invalidated

### 3.2 Monitor Production Metrics

Monitor key metrics for first 1 hour:

```
Metrics to Track:
- ✅ Contract generation success rate (target: >99%)
- ✅ Template render time (target: <100ms)
- ✅ Cache hit rate (target: >85%)
- ✅ Fallback usage rate (target: <1%)
- ✅ Error logs (target: 0 critical errors)
```

**Access Monitoring Dashboard**:
- Cache Stats: `GET /api/admin/templates/cache/stats?limit=100`
- Error Logs: `GET /api/admin/logs?category=template-rendering&limit=50`

### 3.3 Rollback Plan (If Issues Occur)

If problems are detected:

#### Option A: Disable Database Template (Immediate)
```bash
# Set to draft (reverts to fallback)
UPDATE contract_templates 
SET is_active=false 
WHERE is_active=true AND language='th' AND contract_type='lease';
```

#### Option B: Revert to Previous Version
```bash
# In Admin UI:
1. Go to Template Management
2. Click "Version History" on lease-th template
3. Select previous version
4. Click "Activate"
```

#### Option C: Full Rollback
```bash
# Disable feature flag
TEMPLATE_FALLBACK_ENABLED=true
TEMPLATE_CACHE_ENABLED=true

# Restart application
# Contracts will use fallback templates automatically
```

### 3.4 Gradual Template Publishing

Publish remaining templates over 24-48 hours:

**Hour 0-1**: `lease-th`
- Monitor closely
- Check error logs
- Verify cache performance

**Hour 1-4**: `lease-en`, `vehicle-sale-th`
- Expand to more templates
- Continue monitoring

**Hour 4-24**: Remaining templates
- Publish 1-2 templates per hour
- Stagger across different contract types
- Monitor metrics continuously

**Hour 24+**: All templates active
- All 10 templates publishing to production
- Full database template integration live

## Phase 4: Production (Go-Live)

### 4.1 All Templates Active

Once all 10 templates are active and stable:

```
Production Status:
✅ 10/10 templates active (5 types × 2 languages)
✅ Cache hit rate: >90%
✅ Rendering time: <100ms
✅ Error rate: <0.1%
✅ Fallback usage: <0.1%
```

### 4.2 Disable Hardcoded Fallback (Optional)

Only after confirming database templates are working perfectly:

```typescript
// lib/templateEngine.ts - Mark hardcoded templates as legacy
// Keep them available but log deprecation warning
console.warn('[DEPRECATED] Using hardcoded template fallback');
```

Note: Keep hardcoded templates in codebase for emergency fallback.

### 4.3 Ongoing Monitoring

Set up continuous monitoring:

#### Daily Reports
- Template cache hit rate
- Database query counts
- Fallback usage incidents
- Rendering time averages

#### Alert Thresholds
- Cache hit rate drops below 80% → investigate
- Rendering time exceeds 200ms → optimize
- Fallback usage exceeds 5% → critical alert
- Database errors increase → critical alert

#### Monitoring Endpoints
```bash
# Cache statistics
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  https://api.example.com/api/admin/templates/cache/stats

# Error logs (last hour)
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  https://api.example.com/api/admin/logs?category=template-rendering&limit=100
```

## Phase 5: Admin Training

### 5.1 Template Editor Tour

Admin users should understand:

1. **Creating Templates**
   - Navigate to Admin > Templates
   - Click "Create New Template"
   - Write Handlebars template with sample data
   - Click "Preview" to verify
   - Save as draft

2. **Testing Templates**
   - Use preview button with sample data
   - Test with multiple languages
   - Verify all variables are populated

3. **Publishing Templates**
   - Previous active template auto-deactivates
   - New version becomes active
   - Cache is automatically cleared
   - Immediate effect on contract generation

4. **Version Management**
   - View all versions in "Version History"
   - Compare versions side-by-side
   - Rollback to previous version if needed
   - Cannot delete active template

### 5.2 Troubleshooting Guide

**Problem**: "Template not rendering"
- Check Admin > Template Management
- Verify template has `is_active=true`
- Check Admin > Logs for rendering errors
- Solution: Publish template again

**Problem**: "Cache not updating"
- Clear cache: `POST /api/admin/templates/cache/clear`
- Verify `TEMPLATE_CACHE_ENABLED=true`
- Check cache stats: `GET /api/admin/templates/cache/stats`

**Problem**: "Rendering is slow"
- Check template complexity
- Monitor cache hit rate
- Verify database performance
- Consider increasing `TEMPLATE_CACHE_TTL_MINUTES`

## Performance Targets

### Success Metrics

| Metric | Target | Acceptable | Alert Threshold |
|--------|--------|-----------|-----------------|
| Cache Hit Rate | >90% | >85% | <80% |
| Render Time | <50ms | <100ms | >200ms |
| Contract Success Rate | >99.9% | >99% | <99% |
| Fallback Usage | <0.1% | <1% | >5% |
| Database Uptime | 99.99% | 99.9% | <99.9% |

### Load Capacity

Expected capacity with optimizations:

- **Daily Active Users**: Up to 10,000
- **Contracts/Hour**: Up to 50,000
- **Concurrent Users**: Up to 1,000
- **Template Cache Size**: 100 templates (~5MB)

## Rollback Procedures

### Quick Rollback (5 minutes)

If severe issues detected, rollback immediately:

```bash
# 1. Disable database templates
UPDATE contract_templates SET is_active=false;

# 2. Verify fallback is working
# Users should still see contracts (from fallback)

# 3. Investigate issue
# Check logs, database, cache status

# 4. Fix and re-publish
# Make necessary changes
# Re-publish templates
```

### Full Rollback (30 minutes)

If comprehensive rollback needed:

```bash
# 1. Revert application to pre-integration version
git revert <integration-commit>
npm run build

# 2. Disable new feature
TEMPLATE_CACHE_ENABLED=false
TEMPLATE_FALLBACK_ENABLED=false

# 3. Restart application
npm run start

# 4. Verify hardcoded templates work
# Test all contract types
```

### Data Preservation

Database templates are preserved even if feature is disabled:

```bash
# Templates remain in database for future use
SELECT * FROM contract_templates WHERE is_active=false;

# Can re-publish later without re-running migration
UPDATE contract_templates SET is_active=true WHERE id='...';
```

## Post-Deployment

### Week 1 After Deployment

- [ ] Monitor cache hit rate daily
- [ ] Check error logs for patterns
- [ ] Gather admin feedback
- [ ] Verify database backup working
- [ ] Document any issues

### Week 2-4 After Deployment

- [ ] Analyze performance metrics
- [ ] Optimize cache TTL if needed
- [ ] Update monitoring thresholds
- [ ] Plan next feature release

### Month 1+ After Deployment

- [ ] Archive pre-integration templates
- [ ] Plan for template A/B testing
- [ ] Consider multi-region deployment
- [ ] Plan template versioning strategy

## Support Contacts

For deployment issues:

- **Engineering Lead**: [contact info]
- **Database Admin**: [contact info]
- **DevOps**: [contact info]
- **Admin Support**: [contact info]

## Appendix

### A. Migration Script Details

See `scripts/migrateTemplates.ts` for full implementation.

### B. Template Validator

See `lib/security/templateValidator.ts` for security validation details.

### C. Cache Implementation

See `lib/cache/templateCache.ts` for cache implementation.

### D. Troubleshooting Commands

```bash
# View recent logs
npm test -- lib/security/ --run

# Check database connection
npm run validate:template-coverage

# Clear cache (requires admin token)
curl -X POST -H "Authorization: Bearer $TOKEN" \
  https://api.example.com/api/admin/templates/cache/clear

# Get cache stats
curl -H "Authorization: Bearer $TOKEN" \
  https://api.example.com/api/admin/templates/cache/stats
```

---

**Last Updated**: January 2024
**Version**: 1.0
**Status**: Ready for Deployment
---

## แผนอัปเกรดระบบ **frontend-contract** ด้วยเทคโนโลยีและแนวทางของปี **2026**

จากสรุปงานเดิม ระบบของคุณวางโครงสร้างได้ยอดเยี่ยมมากครับ มีทั้ง Caching, AST Validation, PBT (Property-Based Testing) และ Security Sanitization ครบถ้วน

เมื่อพิจารณา Stack และบริบทปัจจุบันของคุณ (**Next.js App Router (ไม่มี src), TypeScript, Tailwind CSS, PostgreSQL + Prisma/Drizzle, Supabase, Stripe Integration และเทรนด์ปี 2026**) เราสามารถยกระดับและปรับปรุงระบบให้ทันสมัย มีประสิทธิภาพ และปลอดภัยยิ่งขึ้นได้ดังนี้ครับ

---

## 🛠️ จุดที่สามารถอัปเกรดและปรับปรุงในปี 2026

### 1. ⚡ **Architecture & Server-Centric Rendering (RSC & Server Actions)**

**ปัญหาปัจจุบัน:**
- Cache เดิม (`lib/cache/templateCache.ts`) ที่เป็น In-Memory Native Map มีข้อจำกัดบน Serverless/Vercel
- Memory ไม่ถูกแชร์ข้าม Instances → Cache Miss เพิ่มขึ้น
- Handlebars Compilation ทำบน Client → Bundle Size ใหญ่

**แนวทางอัปเกรดปี 2026:**
- ใช้ **`unstable_cache` / `use cache` (Next.js Data Cache)** ร่วมกับ **Upstash Redis / Vercel KV**
- ทำ Distributed Cache ที่แชร์กันได้ทุก Instance
- สั่ง Revalidate ได้ทันทีผ่าน Server Actions
- ย้ายการ Compile Handlebars ไปทำฝั่ง Server (React Server Components)
- ลด Bundle Size ฝั่ง Client อย่างมีนัยสำคัญ

**ตัวอย่างการปรับปรุง:**
```typescript
// OLD: In-Memory Cache
const cache = getTemplateCache();
const template = cache.get('lease', 'th');

// NEW: Distributed Cache with Next.js Data Cache
import { unstable_cache } from 'next/cache';

const getCachedTemplate = unstable_cache(
  async (contractType, language) => {
    return await getTemplateFromDB(contractType, language);
  },
  ['template'],
  { revalidate: 600 } // 10 minutes
);
```

---

### 2. 🔐 **Security & Data Sanitization**

**ปัญหาปัจจุบัน:**
- ใช้ DOMPurify เพียงอย่างเดียว (Reactive Defense)
- ไม่มี Content Security Policy (CSP) Headers แบบเข้มงวด

**แนวทางอัปเกรดปี 2026:**
- ตั้งค่า **Content Security Policy (CSP)** แบบ Strict nonce-based
- รวม DOMPurify ร่วมกับ CSP Headers
- ป้องกันการรัน Script ที่ไม่ได้รับอนุญาต 100%
- เพิ่ม HSTS, X-Frame-Options Headers

**ตัวอย่างการปรับปรุง:**
```typescript
// next.config.js - Add Security Headers
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'nonce-{random}'; style-src 'unsafe-inline'"
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  }
];

module.exports = {
  headers: async () => [{ source: '/:path*', headers: securityHeaders }]
};
```

---

### 3. 💳 **Stripe Integration (มาตรฐาน API 2026)**

**ปัญหาปัจจุบัน:**
- Stripe API ยังไม่อัปเดตเป็นเวอร์ชัน 2026
- `payment_method_types` เป็น Hardcode ในโค้ด

**แนวทางอัปเกรดปี 2026:**
- อัปเกรดเป็น **Stripe API `2026-06-24.dahlia` ขึ้นไป**
- ใช้ Dashboard Config แทน Hardcode
- ใช้ Payment Element สำหรับรองรับช่องทางใหม่ๆ อัตโนมัติ
- Dynamic Payment Methods โดยอ่านจาก Stripe API

**ตัวอย่างการปรับปรุง:**
```typescript
// OLD: Hardcoded payment methods
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card', 'promptpay'],
  // ...
});

// NEW: Dynamic from Stripe API
const paymentMethods = await stripe.paymentMethodTypes.list({
  enabled: true
});

const session = await stripe.checkout.sessions.create({
  payment_method_types: paymentMethods.data.map(m => m.id),
  // ...
});
```

---

### 4. 🗄️ **Database Optimization (Prisma / Drizzle ORM)**

**ปัญหาปัจจุบัน:**
- ใช้ Supabase Direct Client ในหลาย ๆ ที่
- ไม่มี Type-Safe Query Builders
- Connection Pooling ไม่ดีบน Serverless

**แนวทางอัปเกรดปี 2026:**
- ย้ายมาใช้ **Drizzle ORM** หรือ **Prisma**
- Type-Safe Query แบบ Pure TypeScript
- เพิ่มประสิทธิภาพ Connection Pooling บน Serverless
- ใช้ Prisma Client Extensions สำหรับ Custom Queries

**ตัวอย่างการปรับปรุง:**
```typescript
// OLD: Direct Supabase Client
const { data, error } = await supabase
  .from('contract_templates')
  .select('*')
  .eq('contract_type', 'lease');

// NEW: Drizzle ORM (Type-Safe)
const templates = await db
  .select()
  .from(contractTemplates)
  .where(eq(contractTemplates.contractType, 'lease'));
```

---

## 🧭 ลำดับขั้นตอนการพัฒนา (Roadmap 2026)

แบ่งการอัปเกรดออกเป็น 3 ระยะหลักๆ:

```
Phase 1                          Phase 2                          Phase 3
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│ Distributed Caching │ -> │ Security & CSP      │ -> │ Stripe & ORM        │
│ + RSC               │    │ Enforcement         │    │ Modernization       │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
  3-4 Weeks                 2-3 Weeks                   4-5 Weeks
```

### **Phase 1: Distributed Caching & RSC** (3-4 สัปดาห์)
- ✅ ย้ายจาก In-Memory Cache ไปใช้ Upstash Redis / Vercel KV
- ✅ ปรับ `lib/cache/templateCache.ts` ให้ใช้ `unstable_cache`
- ✅ ย้ายการ Compile Handlebars ไปทำฝั่ง Server
- ✅ Update Tests สำหรับ Distributed Cache
- 📊 ผลลัพธ์ที่คาดหวัง: Cache Hit Rate ยังคงอยู่ที่ >90% และลด Database Queries

### **Phase 2: Security & CSP Enforcement** (2-3 สัปดาห์)
- ✅ ตั้งค่า CSP Headers แบบ Strict nonce-based ใน `next.config.js`
- ✅ เพิ่ม HSTS, X-Frame-Options Headers
- ✅ Refine DOMPurify Config สำหรับ Template Sanitization
- ✅ Add Security Tests และ Penetration Testing
- 📊 ผลลัพธ์ที่คาดหวัง: Zero XSS vulnerabilities, ผ่าน Security Audit

### **Phase 3: Stripe & ORM Modernization** (4-5 สัปดาห์)
- ✅ อัปเกรด Stripe API เป็น `2026-06-24` ขึ้นไป
- ✅ Migrate ไปใช้ **Drizzle ORM** หรือ **Prisma**
- ✅ ปรับปรุง Database Connection Pooling
- ✅ Update Tests และ Integration Tests
- 📊 ผลลัพธ์ที่คาดหวัง: Type-Safe Queries, ลดจำนวน Database Connections, รองรับ Payment Methods ใหม่ๆ

---

## 📋 Checklist สำหรับการอัปเกรด

```markdown
### Phase 1 Checklist
- [ ] สร้าง Upstash Redis instance หรือตั้ง Vercel KV
- [ ] ปรับปรุง `lib/cache/templateCache.ts` ให้ใช้ Redis client
- [ ] ย้าย Handlebars Compilation ไปทำฝั่ง Server
- [ ] Test Distributed Cache ใน Development
- [ ] Deploy ไป Staging และทดสอบ
- [ ] Monitor Cache Hit Rate และ Performance Metrics

### Phase 2 Checklist
- [ ] ตั้งค่า CSP Headers ใน `next.config.js`
- [ ] Add Nonce generation สำหรับ Inline Scripts
- [ ] Test CSP Policy ด้วย Browser Dev Tools
- [ ] Add Security Headers Tests
- [ ] Run OWASP ZAP หรือ Burp Suite Scanning

### Phase 3 Checklist
- [ ] ทำ Database Schema Mapping สำหรับ Drizzle/Prisma
- [ ] ปรับปรุง `lib/services/templateService.ts` เพื่อใช้ ORM
- [ ] Migrate Stripe Integration เป็น API 2026
- [ ] Test Dynamic Payment Methods
- [ ] Update Integration Tests และ E2E Tests
- [ ] Verify Database Performance ด้วย Query Analyzer
```

---
