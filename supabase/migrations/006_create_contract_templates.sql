-- 006_create_contract_templates.sql
-- Template management system for admin to edit contracts via UI

-- =====================================================
-- 1. Create contract_templates table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.contract_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Template identification
  contract_type TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'th',
  version INTEGER NOT NULL DEFAULT 1,
  
  -- Template content
  template_html TEXT NOT NULL,
  template_css TEXT,
  variables JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Metadata
  name TEXT NOT NULL,
  description TEXT,
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT false,
  is_draft BOOLEAN NOT NULL DEFAULT true,
  
  -- Audit
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Ensure unique combination of type, language, and version
  CONSTRAINT unique_template_version UNIQUE(contract_type, language, version)
);

-- =====================================================
-- 2. Create template_revisions table (History)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.template_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  template_id UUID NOT NULL REFERENCES public.contract_templates(id) ON DELETE CASCADE,
  
  -- Snapshot of template at this revision
  content JSONB NOT NULL,
  
  -- Change tracking
  change_note TEXT,
  changed_fields TEXT[],
  
  -- Audit
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- 3. Create indexes
-- =====================================================

-- Fast lookup of active templates by type and language
CREATE INDEX IF NOT EXISTS idx_templates_active 
  ON public.contract_templates(contract_type, language, is_active) 
  WHERE is_active = true;

-- Fast lookup for admin list view
CREATE INDEX IF NOT EXISTS idx_templates_list 
  ON public.contract_templates(contract_type, language, version, updated_at DESC);

-- Fast lookup of template history
CREATE INDEX IF NOT EXISTS idx_revisions_template 
  ON public.template_revisions(template_id, created_at DESC);

-- Full-text search on template names and descriptions
CREATE INDEX IF NOT EXISTS idx_templates_search 
  ON public.contract_templates 
  USING gin(to_tsvector('simple', name || ' ' || COALESCE(description, '')));

-- =====================================================
-- 4. Create updated_at trigger
-- =====================================================

-- Reuse existing function or create if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS templates_updated_at ON public.contract_templates;
CREATE TRIGGER templates_updated_at
  BEFORE UPDATE ON public.contract_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 5. Create function to auto-save revision history
-- =====================================================

CREATE OR REPLACE FUNCTION public.save_template_revision()
RETURNS TRIGGER AS $$
DECLARE
  changed_fields TEXT[];
BEGIN
  -- Only save revision on UPDATE, not INSERT
  IF TG_OP = 'UPDATE' THEN
    -- Track which fields changed
    changed_fields := ARRAY[]::TEXT[];
    
    IF OLD.template_html IS DISTINCT FROM NEW.template_html THEN
      changed_fields := array_append(changed_fields, 'template_html');
    END IF;
    
    IF OLD.template_css IS DISTINCT FROM NEW.template_css THEN
      changed_fields := array_append(changed_fields, 'template_css');
    END IF;
    
    IF OLD.variables IS DISTINCT FROM NEW.variables THEN
      changed_fields := array_append(changed_fields, 'variables');
    END IF;
    
    IF OLD.name IS DISTINCT FROM NEW.name THEN
      changed_fields := array_append(changed_fields, 'name');
    END IF;
    
    IF OLD.description IS DISTINCT FROM NEW.description THEN
      changed_fields := array_append(changed_fields, 'description');
    END IF;
    
    -- Only save if something actually changed
    IF array_length(changed_fields, 1) > 0 THEN
      INSERT INTO public.template_revisions (
        template_id,
        content,
        changed_fields,
        created_by
      ) VALUES (
        NEW.id,
        jsonb_build_object(
          'template_html', OLD.template_html,
          'template_css', OLD.template_css,
          'variables', OLD.variables,
          'name', OLD.name,
          'description', OLD.description,
          'is_active', OLD.is_active,
          'is_draft', OLD.is_draft
        ),
        changed_fields,
        NEW.created_by
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS save_template_revision_trigger ON public.contract_templates;
CREATE TRIGGER save_template_revision_trigger
  AFTER UPDATE ON public.contract_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.save_template_revision();

-- =====================================================
-- 6. Row Level Security (RLS)
-- =====================================================

ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_revisions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can read active templates" ON public.contract_templates;
DROP POLICY IF EXISTS "Admins can manage templates" ON public.contract_templates;
DROP POLICY IF EXISTS "Admins can read revisions" ON public.template_revisions;

-- Public can only read ACTIVE templates (for rendering contracts)
CREATE POLICY "Anyone can read active templates"
  ON public.contract_templates
  FOR SELECT
  USING (is_active = true);

-- Admins can do everything with templates
-- Note: You need to identify admins somehow (e.g., by email or role in auth.users metadata)
-- For now, we'll allow authenticated users - adjust based on your admin check
CREATE POLICY "Admins can manage templates"
  ON public.contract_templates
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Admins can read all revisions
CREATE POLICY "Admins can read revisions"
  ON public.template_revisions
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- =====================================================
-- 7. Helper function to get active template
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_active_template(
  p_contract_type TEXT,
  p_language TEXT DEFAULT 'th'
)
RETURNS TABLE (
  id UUID,
  template_html TEXT,
  template_css TEXT,
  variables JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.template_html,
    t.template_css,
    t.variables
  FROM public.contract_templates t
  WHERE 
    t.contract_type = p_contract_type
    AND t.language = p_language
    AND t.is_active = true
  ORDER BY t.version DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 8. Comments for documentation
-- =====================================================

COMMENT ON TABLE public.contract_templates IS 'Stores editable contract templates managed by admins via UI';
COMMENT ON TABLE public.template_revisions IS 'Tracks history of template changes for audit and rollback';

COMMENT ON COLUMN public.contract_templates.contract_type IS 'Type of contract: lease, vehicle-sale, property-sale, employment, testament';
COMMENT ON COLUMN public.contract_templates.language IS 'Template language: th, en';
COMMENT ON COLUMN public.contract_templates.version IS 'Version number, increments when creating new version';
COMMENT ON COLUMN public.contract_templates.template_html IS 'Handlebars template HTML with {{variables}}';
COMMENT ON COLUMN public.contract_templates.template_css IS 'Optional CSS styles for this template';
COMMENT ON COLUMN public.contract_templates.variables IS 'JSON array of variable definitions with name, type, description';
COMMENT ON COLUMN public.contract_templates.is_active IS 'Only one template per type+language can be active';
COMMENT ON COLUMN public.contract_templates.is_draft IS 'Draft templates are not published yet';

-- =====================================================
-- 9. Sample data (optional - for testing)
-- =====================================================

-- Insert a sample template (commented out - uncomment to use)
/*
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
  '<div style="font-family: ''Sarabun'', sans-serif; padding: 24px;">
    <h1 style="text-align: center;">สัญญาเช่าคอนโดมิเนียม</h1>
    <p>ทำขึ้น ณ {{state}}</p>
    <p>วันที่ {{formatDate contractDate}}</p>
    <h2>ข้อมูลผู้ให้เช่า</h2>
    <p>ชื่อ: {{sellerName}}</p>
    <p>ที่อยู่: {{sellerAddress}}</p>
    <h2>ข้อมูลผู้เช่า</h2>
    <p>ชื่อ: {{buyerName}}</p>
    <p>ที่อยู่: {{buyerAddress}}</p>
    {{#if depositAmount}}
    <p>ค่ามัดจำ: {{formatMoney depositAmount}} บาท</p>
    {{/if}}
  </div>',
  'h1 { font-size: 24px; margin-bottom: 16px; }
   h2 { font-size: 18px; margin-top: 24px; }
   p { line-height: 1.6; }',
  '[
    {"name": "sellerName", "type": "string", "description": "ชื่อผู้ให้เช่า"},
    {"name": "sellerAddress", "type": "string", "description": "ที่อยู่ผู้ให้เช่า"},
    {"name": "buyerName", "type": "string", "description": "ชื่อผู้เช่า"},
    {"name": "buyerAddress", "type": "string", "description": "ที่อยู่ผู้เช่า"},
    {"name": "contractDate", "type": "date", "description": "วันที่ทำสัญญา"},
    {"name": "state", "type": "string", "description": "สถานที่ทำสัญญา"},
    {"name": "depositAmount", "type": "number", "description": "ค่ามัดจำ"}
  ]'::jsonb,
  false,
  true
) ON CONFLICT (contract_type, language, version) DO NOTHING;
*/

-- =====================================================
-- Done! ✅
-- =====================================================
