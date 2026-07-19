# 🚀 Step-by-Step Migration & Testing Guide

## Phase 1: Run Migration ✅

### ขั้นตอนที่ 1: เข้า Supabase Dashboard

1. ไปที่ [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. เลือกโปรเจค `frontend-contract`
3. ไปที่ **SQL Editor** (เมนูด้านซ้าย)

### ขั้นตอนที่ 2: Run Migration

1. คลิก **New Query**
2. คัดลอก SQL ทั้งหมดจากไฟล์:
   ```
   supabase/migrations/006_create_contract_templates.sql
   ```
3. วาง (Paste) ลงใน SQL Editor
4. คลิก **Run** (หรือกด Ctrl+Enter)

### ขั้นตอนที่ 3: Verify Migration

รัน query นี้เพื่อตรวจสอบ:

```sql
-- 1. ตรวจสอบว่า tables ถูกสร้างแล้ว
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('contract_templates', 'template_revisions');

-- Expected: 2 rows (contract_templates, template_revisions)

-- 2. ตรวจสอบ indexes
SELECT indexname, tablename
FROM pg_indexes 
WHERE tablename IN ('contract_templates', 'template_revisions');

-- Expected: 4+ indexes

-- 3. ตรวจสอบ RLS enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('contract_templates', 'template_revisions');

-- Expected: rowsecurity = true for both tables

-- 4. ดูโครงสร้าง table
\d contract_templates
\d template_revisions
```

### ✅ Success Indicators

ถ้า migration สำเร็จจะเห็น:
- ✅ 2 tables created
- ✅ 4+ indexes created  
- ✅ RLS enabled
- ✅ Triggers created
- ✅ Functions created

---

## Phase 2: Test APIs ✅

### เตรียมความพร้อม

1. **Start dev server:**
   ```bash
   pnpm dev
   ```

2. **Get Auth Token:**
   - เปิด browser ไปที่ `http://localhost:3000/login`
   - Login ด้วยบัญชี admin
   - เปิด DevTools (F12) → Console
   - รัน: `localStorage.getItem('auth_token')`
   - คัดลอก token ที่ได้

3. **Set Token Variable (ใช้ใน tests):**
   ```bash
   # Windows PowerShell
   $TOKEN = "eyJhbGci..."
   
   # Mac/Linux
   export TOKEN="eyJhbGci..."
   ```

---

### Test 1: Create Template ✅

```bash
# Windows PowerShell
$body = @{
  contract_type = "lease"
  language = "th"
  name = "สัญญาเช่าทดสอบ"
  description = "Template สำหรับทดสอบระบบ"
  template_html = @"
<div style="font-family: 'Sarabun', sans-serif; padding: 24px;">
  <h1 style="text-align: center;">{{title}}</h1>
  <p>ผู้ให้เช่า: <strong>{{sellerName}}</strong></p>
  <p>ผู้เช่า: <strong>{{buyerName}}</strong></p>
  <p>วันที่: {{formatDate contractDate "th"}}</p>
  {{#if depositAmount}}
  <p>ค่ามัดจำ: {{formatMoney depositAmount}} บาท</p>
  {{/if}}
</div>
"@
  template_css = "h1 { color: #1e40af; } p { line-height: 1.8; }"
  variables = @(
    @{ name = "title"; type = "string"; description = "หัวข้อสัญญา"; required = $true }
    @{ name = "sellerName"; type = "string"; description = "ชื่อผู้ให้เช่า"; required = $true }
    @{ name = "buyerName"; type = "string"; description = "ชื่อผู้เช่า"; required = $true }
    @{ name = "contractDate"; type = "date"; description = "วันที่ทำสัญญา"; required = $true }
    @{ name = "depositAmount"; type = "number"; description = "ค่ามัดจำ (บาท)" }
  )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:3000/api/admin/templates" `
  -Method POST `
  -Headers @{ Authorization = "Bearer $TOKEN"; "Content-Type" = "application/json" } `
  -Body $body
```

**Expected Response:**
```json
{
  "template": {
    "id": "uuid...",
    "contract_type": "lease",
    "language": "th",
    "name": "สัญญาเช่าทดสอบ",
    "version": 1,
    "is_active": false,
    "is_draft": true
  }
}
```

**เก็บ ID ไว้ใช้ต่อ:**
```powershell
$TEMPLATE_ID = "uuid-from-response"
```

---

### Test 2: List Templates ✅

```bash
# List all templates
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/templates" `
  -Headers @{ Authorization = "Bearer $TOKEN" }

# Filter by contract type
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/templates?contract_type=lease" `
  -Headers @{ Authorization = "Bearer $TOKEN" }

# Get statistics
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/templates?stats=true" `
  -Headers @{ Authorization = "Bearer $TOKEN" }
```

**Expected Response:**
```json
{
  "templates": [
    {
      "id": "uuid...",
      "name": "สัญญาเช่าทดสอบ",
      "contract_type": "lease",
      "is_active": false,
      "is_draft": true
    }
  ]
}
```

---

### Test 3: Get Single Template ✅

```bash
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/templates/$TEMPLATE_ID" `
  -Headers @{ Authorization = "Bearer $TOKEN" }
```

**Expected: Full template object with HTML, CSS, variables**

---

### Test 4: Preview Template ✅

```bash
$previewBody = @{
  template_html = "<h1>สัญญาเช่า</h1><p>ผู้เช่า: {{buyerName}}</p><p>ค่าเช่า: {{formatMoney rentAmount}} บาท</p>"
  template_css = "h1 { color: blue; }"
  sample_data = @{
    buyerName = "นายสมชาย ใจดี"
    rentAmount = 15000
  }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:3000/api/admin/templates/preview" `
  -Method POST `
  -Headers @{ Authorization = "Bearer $TOKEN"; "Content-Type" = "application/json" } `
  -Body $previewBody
```

**Expected Response:**
```json
{
  "rendered": "<style>h1 { color: blue; }</style><h1>สัญญาเช่า</h1><p>ผู้เช่า: นายสมชาย ใจดี</p><p>ค่าเช่า: 15,000 บาท</p>",
  "errors": [],
  "warnings": []
}
```

---

### Test 5: Update Template ✅

```bash
$updateBody = @{
  name = "สัญญาเช่าทดสอบ (Updated)"
  description = "อัพเดทแล้ว"
  is_draft = $false
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/admin/templates/$TEMPLATE_ID" `
  -Method PUT `
  -Headers @{ Authorization = "Bearer $TOKEN"; "Content-Type" = "application/json" } `
  -Body $updateBody
```

---

### Test 6: Publish Template ✅

```bash
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/templates/$TEMPLATE_ID/publish" `
  -Method POST `
  -Headers @{ Authorization = "Bearer $TOKEN"; "Content-Type" = "application/json" } `
  -Body "{}"
```

**Expected:**
```json
{
  "template": {
    "is_active": true,
    "is_draft": false
  },
  "message": "Template published successfully"
}
```

---

### Test 7: Get Revisions ✅

```bash
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/templates/$TEMPLATE_ID/revisions" `
  -Headers @{ Authorization = "Bearer $TOKEN" }
```

**Expected: List of all changes made to template**

---

### Test 8: Render Contract (Public API) ✅

```bash
# ไม่ต้องใช้ auth token!
$renderBody = @{
  contract_type = "lease"
  language = "th"
  data = @{
    title = "สัญญาเช่าคอนโดมิเนียม"
    sellerName = "นายสมชาย ใจดี"
    buyerName = "นางสมหญิง สบายดี"
    contractDate = "2026-07-13"
    depositAmount = 20000
  }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:3000/api/templates/render" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body $renderBody
```

**Expected:**
```json
{
  "html": "<div>... rendered HTML ...</div>",
  "template_id": "uuid...",
  "template_version": 1
}
```

---

### Test 9: Unpublish Template ✅

```bash
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/templates/$TEMPLATE_ID/publish" `
  -Method DELETE `
  -Headers @{ Authorization = "Bearer $TOKEN" }
```

---

### Test 10: Delete Template ✅

```bash
# ต้อง unpublish ก่อน
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/templates/$TEMPLATE_ID" `
  -Method DELETE `
  -Headers @{ Authorization = "Bearer $TOKEN" }
```

---

## 🐛 Troubleshooting

### Error: "Missing authorization token"
```powershell
# ตรวจสอบ token
echo $TOKEN

# ถ้าหมดอายุ ให้ login ใหม่และ get token ใหม่
```

### Error: "Supabase is not configured"
```bash
# ตรวจสอบ .env
cat .env | Select-String "SUPABASE"

# ต้องมี:
# SUPABASE_URL=...
# SUPABASE_ANON_KEY=...
```

### Error: "Template validation failed"
- ตรวจสอบว่า template_html ไม่มี `<script>` tags
- ตรวจสอบ Handlebars syntax ถูกต้อง

### Error: "relation does not exist"
- Migration ยังไม่ได้รัน
- กลับไปทำ Phase 1 ใหม่

---

## ✅ Success Checklist

Phase 1 - Migration:
- [ ] Tables created
- [ ] Indexes created
- [ ] RLS enabled
- [ ] Triggers working

Phase 2 - APIs:
- [ ] Create template works
- [ ] List templates works
- [ ] Update template works
- [ ] Preview works
- [ ] Publish/unpublish works
- [ ] Get revisions works
- [ ] Render contract works (public)
- [ ] Delete template works

---

## 📊 Quick Test Summary

```bash
# Complete test suite (PowerShell)

# 1. Create
$create = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/templates" -Method POST -Headers @{Authorization="Bearer $TOKEN";"Content-Type"="application/json"} -Body '{"contract_type":"lease","language":"th","name":"Test","template_html":"<h1>{{title}}</h1>","variables":[]}'
$id = $create.template.id

# 2. List
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/templates" -Headers @{Authorization="Bearer $TOKEN"}

# 3. Get
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/templates/$id" -Headers @{Authorization="Bearer $TOKEN"}

# 4. Update
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/templates/$id" -Method PUT -Headers @{Authorization="Bearer $TOKEN";"Content-Type"="application/json"} -Body '{"name":"Updated"}'

# 5. Publish
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/templates/$id/publish" -Method POST -Headers @{Authorization="Bearer $TOKEN";"Content-Type"="application/json"} -Body '{}'

# 6. Render (public)
Invoke-RestMethod -Uri "http://localhost:3000/api/templates/render" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"contract_type":"lease","language":"th","data":{"title":"Test"}}'

# 7. Unpublish
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/templates/$id/publish" -Method DELETE -Headers @{Authorization="Bearer $TOKEN"}

# 8. Delete
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/templates/$id" -Method DELETE -Headers @{Authorization="Bearer $TOKEN"}
```

---

พร้อมไป Phase 3 แล้ว! 🎉
