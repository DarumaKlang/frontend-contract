# Contract Templates Migration Guide

## 📋 Overview

This migration creates a database-driven template system that allows admins to edit contract templates through a UI without deploying code.

---

## 🗄️ Database Schema

### Tables Created

1. **`contract_templates`** - Stores editable contract templates
2. **`template_revisions`** - Tracks history of all changes

### Key Features

- ✅ Version control (automatic revision history)
- ✅ Draft/Publish workflow
- ✅ Row Level Security (RLS) enabled
- ✅ Full-text search on template names
- ✅ Automatic timestamp updates
- ✅ Helper function to get active templates

---

## 🚀 Running the Migration

### Method 1: Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy contents of `006_create_contract_templates.sql`
4. Click **Run**

### Method 2: Supabase CLI

```bash
# Make sure you're in the project root
cd frontend-contract

# Run migration
supabase db push

# Or run specific migration
supabase migration up --db-url "postgresql://..."
```

### Method 3: Direct psql

```bash
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres" < supabase/migrations/006_create_contract_templates.sql
```

---

## ✅ Verify Migration

Run this query in SQL Editor to verify:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('contract_templates', 'template_revisions');

-- Check indexes
SELECT indexname 
FROM pg_indexes 
WHERE tablename IN ('contract_templates', 'template_revisions');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('contract_templates', 'template_revisions');
```

Expected output:
- 2 tables created
- 4+ indexes created
- RLS enabled on both tables

---

## 📊 Table Structure

### contract_templates

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| contract_type | TEXT | lease, vehicle-sale, property-sale, employment, testament |
| language | TEXT | th, en |
| version | INTEGER | Version number (auto-increment) |
| template_html | TEXT | Handlebars template HTML |
| template_css | TEXT | Optional CSS styles |
| variables | JSONB | Array of variable definitions |
| name | TEXT | Template display name |
| description | TEXT | Template description |
| is_active | BOOLEAN | Only one template per type+language can be active |
| is_draft | BOOLEAN | Draft templates not published yet |
| created_by | UUID | FK to auth.users |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

### template_revisions

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| template_id | UUID | FK to contract_templates |
| content | JSONB | Snapshot of template at this revision |
| change_note | TEXT | Optional note about changes |
| changed_fields | TEXT[] | Array of fields that changed |
| created_by | UUID | FK to auth.users |
| created_at | TIMESTAMPTZ | Revision timestamp |

---

## 🔐 Security (RLS Policies)

### contract_templates

1. **"Anyone can read active templates"**
   - Anyone can SELECT templates where `is_active = true`
   - Needed for rendering contracts

2. **"Admins can manage templates"**
   - Authenticated users can do everything
   - ⚠️ **TODO:** Restrict to actual admins only

### template_revisions

1. **"Admins can read revisions"**
   - Authenticated users can read all revisions
   - ⚠️ **TODO:** Restrict to actual admins only

---

## 🔄 Using Templates in Code

### Get Active Template

```typescript
// Using helper function
const { data } = await supabase.rpc('get_active_template', {
  p_contract_type: 'lease',
  p_language: 'th'
});

// Manual query
const { data } = await supabase
  .from('contract_templates')
  .select('*')
  .eq('contract_type', 'lease')
  .eq('language', 'th')
  .eq('is_active', true)
  .order('version', { ascending: false })
  .limit(1)
  .single();
```

### Render Template

```typescript
import { renderTemplate } from '@/lib/templateEngine';

const html = renderTemplate(template.template_html, {
  sellerName: 'นายสมชาย',
  buyerName: 'นางสมหญิง',
  contractDate: new Date(),
  depositAmount: 10000,
});
```

---

## 📝 Sample Template Insert

```sql
INSERT INTO public.contract_templates (
  contract_type,
  language,
  version,
  name,
  description,
  template_html,
  template_css,
  variables,
  is_active,
  is_draft
) VALUES (
  'lease',
  'th',
  1,
  'สัญญาเช่าคอนโดมิเนียม',
  'เทมเพลตมาตรฐานสำหรับสัญญาเช่าคอนโด',
  '<div style="font-family: ''Sarabun'', sans-serif;">
    <h1>สัญญาเช่าคอนโดมิเนียม</h1>
    <p>ทำขึ้น ณ {{state}}</p>
    <p>วันที่ {{formatDate contractDate "th"}}</p>
    <p>ผู้ให้เช่า: {{sellerName}}</p>
    <p>ผู้เช่า: {{buyerName}}</p>
    {{#if depositAmount}}
    <p>ค่ามัดจำ: {{formatMoney depositAmount}} บาท</p>
    {{/if}}
  </div>',
  'h1 { text-align: center; }',
  '[
    {"name": "sellerName", "type": "string", "description": "ชื่อผู้ให้เช่า"},
    {"name": "buyerName", "type": "string", "description": "ชื่อผู้เช่า"},
    {"name": "contractDate", "type": "date", "description": "วันที่ทำสัญญา"},
    {"name": "state", "type": "string", "description": "สถานที่ทำสัญญา"},
    {"name": "depositAmount", "type": "number", "description": "ค่ามัดจำ"}
  ]'::jsonb,
  true,
  false
);
```

---

## 🧪 Testing

### Test 1: Create Template

```sql
INSERT INTO contract_templates (contract_type, language, name, template_html, variables)
VALUES ('lease', 'th', 'Test Template', '<h1>{{title}}</h1>', '[]'::jsonb);
```

### Test 2: Check Revision Created

```sql
-- Update template
UPDATE contract_templates 
SET template_html = '<h1>Updated {{title}}</h1>' 
WHERE contract_type = 'lease';

-- Check revision was created
SELECT * FROM template_revisions ORDER BY created_at DESC LIMIT 1;
```

### Test 3: Get Active Template

```sql
SELECT * FROM get_active_template('lease', 'th');
```

---

## 🔄 Rollback

If you need to rollback this migration:

```sql
-- Drop tables (cascades to related objects)
DROP TABLE IF EXISTS public.template_revisions CASCADE;
DROP TABLE IF EXISTS public.contract_templates CASCADE;

-- Drop function
DROP FUNCTION IF EXISTS public.get_active_template(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.save_template_revision();
DROP FUNCTION IF EXISTS public.update_updated_at_column();
```

---

## 📚 Next Steps

After running this migration:

1. ✅ Create API routes (`/api/admin/templates/*`)
2. ✅ Build admin UI (`/admin/templates`)
3. ✅ Migrate existing templates from code to database
4. ✅ Update contract rendering logic to use database templates

See `ADMIN_TEMPLATE_EDITOR_PLAN.md` for full implementation plan.

---

## ❓ Troubleshooting

### Error: "relation already exists"

Run the rollback SQL above, then try again.

### Error: "permission denied"

Make sure you're running as the postgres user or have sufficient privileges.

### RLS blocking admin access

Temporarily disable RLS for testing:

```sql
ALTER TABLE contract_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE template_revisions DISABLE ROW LEVEL SECURITY;
```

Then re-enable after configuring proper admin policies.

---

## 📞 Support

For issues or questions, check:
- `ADMIN_TEMPLATE_EDITOR_PLAN.md` - Full implementation plan
- `lib/templateEngine.ts` - Template rendering engine
- `lib/types/template.ts` - TypeScript types
