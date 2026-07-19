## # Template Management API Documentation

## 🔐 Authentication

All admin template endpoints require authentication via Bearer token in the `Authorization` header:

```
Authorization: Bearer <supabase-jwt-token>
```

---

## 📋 Endpoints

### Admin Endpoints (require admin auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/templates` | List all templates |
| POST | `/api/admin/templates` | Create new template |
| GET | `/api/admin/templates/:id` | Get template by ID |
| PUT | `/api/admin/templates/:id` | Update template |
| DELETE | `/api/admin/templates/:id` | Delete template |
| POST | `/api/admin/templates/:id/publish` | Publish template |
| DELETE | `/api/admin/templates/:id/publish` | Unpublish template |
| GET | `/api/admin/templates/:id/revisions` | Get revision history |
| POST | `/api/admin/templates/preview` | Preview template |

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/templates/render` | Render contract with active template |

---

## 📚 API Reference

### GET /api/admin/templates

List all templates with optional filters.

**Query Parameters:**
- `contract_type` (optional): Filter by contract type
- `language` (optional): Filter by language
- `is_active` (optional): Filter by active status (true/false)
- `is_draft` (optional): Filter by draft status (true/false)
- `stats` (optional): Return statistics instead of list (true)

**Response:**
```json
{
  "templates": [
    {
      "id": "uuid",
      "contract_type": "lease",
      "language": "th",
      "version": 1,
      "name": "สัญญาเช่าคอนโด",
      "is_active": true,
      "is_draft": false,
      "updated_at": "2026-07-13T..."
    }
  ]
}
```

**Example:**
```bash
curl -H "Authorization: Bearer <token>" \
  "https://contract-generator.com/api/admin/templates?contract_type=lease&is_active=true"
```

---

### POST /api/admin/templates

Create a new template.

**Request Body:**
```json
{
  "contract_type": "lease",
  "language": "th",
  "name": "สัญญาเช่าคอนโดมิเนียม",
  "description": "เทมเพลตมาตรฐานสำหรับสัญญาเช่า",
  "template_html": "<div>{{sellerName}}</div>",
  "template_css": "div { padding: 20px; }",
  "variables": [
    {
      "name": "sellerName",
      "type": "string",
      "description": "ชื่อผู้ให้เช่า",
      "required": true
    }
  ]
}
```

**Response:**
```json
{
  "template": {
    "id": "uuid",
    "contract_type": "lease",
    "language": "th",
    "version": 1,
    "name": "สัญญาเช่าคอนโดมิเนียม",
    "is_active": false,
    "is_draft": true,
    "created_at": "2026-07-13T..."
  }
}
```

---

### GET /api/admin/templates/:id

Get single template by ID.

**Response:**
```json
{
  "template": {
    "id": "uuid",
    "contract_type": "lease",
    "language": "th",
    "version": 1,
    "name": "สัญญาเช่า",
    "description": "...",
    "template_html": "<div>...</div>",
    "template_css": "...",
    "variables": [...],
    "is_active": true,
    "is_draft": false,
    "created_at": "...",
    "updated_at": "..."
  }
}
```

---

### PUT /api/admin/templates/:id

Update template.

**Request Body (all fields optional):**
```json
{
  "name": "Updated name",
  "description": "Updated description",
  "template_html": "<div>Updated {{content}}</div>",
  "template_css": "div { color: blue; }",
  "variables": [...],
  "is_draft": false,
  "change_note": "Updated styling"
}
```

**Response:**
```json
{
  "template": { ... }
}
```

---

### DELETE /api/admin/templates/:id

Delete template. Cannot delete active templates.

**Response:**
```json
{
  "success": true
}
```

---

### POST /api/admin/templates/:id/publish

Publish template (set as active). Automatically deactivates previous active template.

**Request Body (optional):**
```json
{
  "deactivate_previous": true
}
```

**Response:**
```json
{
  "template": { ... },
  "message": "Template published successfully"
}
```

---

### DELETE /api/admin/templates/:id/publish

Unpublish template (deactivate).

**Response:**
```json
{
  "template": { ... },
  "message": "Template unpublished successfully"
}
```

---

### GET /api/admin/templates/:id/revisions

Get template revision history.

**Response:**
```json
{
  "revisions": [
    {
      "id": "uuid",
      "template_id": "uuid",
      "content": {
        "template_html": "...",
        "name": "...",
        ...
      },
      "change_note": "Updated layout",
      "changed_fields": ["template_html", "template_css"],
      "created_at": "2026-07-13T..."
    }
  ]
}
```

---

### POST /api/admin/templates/preview

Preview template rendering with sample data.

**Request Body:**
```json
{
  "template_html": "<div>Hello {{name}}</div>",
  "template_css": "div { color: red; }",
  "sample_data": {
    "name": "John"
  }
}
```

**Response:**
```json
{
  "rendered": "<style>div { color: red; }</style><div>Hello John</div>",
  "errors": [],
  "warnings": []
}
```

---

### POST /api/templates/render

Render contract using active template (public endpoint).

**Request Body:**
```json
{
  "contract_type": "lease",
  "language": "th",
  "data": {
    "sellerName": "นายสมชาย",
    "buyerName": "นางสมหญิง",
    "contractDate": "2026-07-13",
    ...
  }
}
```

**Response:**
```json
{
  "html": "<div>...</div>",
  "template_id": "uuid",
  "template_version": 1
}
```

---

## 🔧 Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (not an admin)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🧪 Testing with cURL

### Create Template
```bash
curl -X POST https://contract-generator.com/api/admin/templates \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "contract_type": "lease",
    "language": "th",
    "name": "Test Template",
    "template_html": "<h1>{{title}}</h1>",
    "variables": []
  }'
```

### List Templates
```bash
curl -H "Authorization: Bearer <token>" \
  https://contract-generator.com/api/admin/templates
```

### Update Template
```bash
curl -X PUT https://contract-generator.com/api/admin/templates/<id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name"
  }'
```

### Publish Template
```bash
curl -X POST https://contract-generator.com/api/admin/templates/<id>/publish \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Preview Template
```bash
curl -X POST https://contract-generator.com/api/admin/templates/preview \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "template_html": "<p>Hello {{name}}</p>",
    "sample_data": {"name": "World"}
  }'
```

### Render Contract (Public)
```bash
curl -X POST https://contract-generator.com/api/templates/render \
  -H "Content-Type: application/json" \
  -d '{
    "contract_type": "lease",
    "language": "th",
    "data": {
      "sellerName": "นายสมชาย",
      "buyerName": "นางสมหญิง"
    }
  }'
```

---

## 📝 Template Variable Types

When defining variables, use these types:

- `string` - Text field
- `number` - Numeric value
- `date` - Date picker
- `boolean` - Checkbox
- `array` - List of items
- `object` - Nested object

**Example:**
```json
{
  "name": "depositAmount",
  "type": "number",
  "description": "ค่ามัดจำ (บาท)",
  "required": true,
  "validation": {
    "min": 0,
    "max": 1000000
  }
}
```

---

## 🎨 Handlebars Helpers

Available helpers in templates:

| Helper | Usage | Description |
|--------|-------|-------------|
| `formatDate` | `{{formatDate date "th"}}` | Format date |
| `formatMoney` | `{{formatMoney 1000}}` | Format number |
| `thaiBahtText` | `{{thaiBahtText 1250}}` | Thai Baht text |
| `add` | `{{add 10 20}}` | Add numbers |
| `subtract` | `{{subtract 20 10}}` | Subtract |
| `multiply` | `{{multiply 10 5}}` | Multiply |
| `divide` | `{{divide 100 5}}` | Divide |
| `uppercase` | `{{uppercase "hello"}}` | Uppercase |
| `lowercase` | `{{lowercase "HELLO"}}` | Lowercase |
| `capitalize` | `{{capitalize "hello"}}` | Capitalize |
| `eq` | `{{#if (eq a b)}}...{{/if}}` | Equal |
| `ne` | `{{#if (ne a b)}}...{{/if}}` | Not equal |
| `lt` | `{{#if (lt a b)}}...{{/if}}` | Less than |
| `gt` | `{{#if (gt a b)}}...{{/if}}` | Greater than |
| `and` | `{{#if (and a b)}}...{{/if}}` | Logical AND |
| `or` | `{{#if (or a b)}}...{{/if}}` | Logical OR |
| `not` | `{{#if (not a)}}...{{/if}}` | Logical NOT |

---

## 🔒 Security Notes

1. **Template Validation**: All templates are validated before save
2. **XSS Protection**: Output is sanitized using DOMPurify
3. **No Script Tags**: `<script>` tags are blocked
4. **No Event Handlers**: `onclick`, `onload`, etc. are blocked
5. **Admin Only**: Only authenticated admins can manage templates
6. **Version Control**: All changes are automatically tracked

---

## 📞 Support

For issues or questions, refer to:
- Full implementation plan: `ADMIN_TEMPLATE_EDITOR_PLAN.md`
- Database schema: `supabase/migrations/006_create_contract_templates.sql`
- Template engine: `lib/templateEngine.ts`
