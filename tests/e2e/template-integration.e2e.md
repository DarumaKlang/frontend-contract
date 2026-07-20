# E2E Tests - Database Template Integration

## Overview

End-to-end tests for the database template integration feature. Tests cover the complete workflow from contract generation through template management.

## Test Scenarios

### Scenario 1: Contract Generation with Database Template

**Prerequisites**:
- Database template exists and is published (is_active=true)
- Contract Generator is loaded

**Steps**:
1. Navigate to Contract Generator
2. Select contract type: "Lease"
3. Select language: "Thai (ไทย)"
4. Fill in form with sample data
5. Click "Generate Contract"
6. Verify contract renders successfully

**Expected Results**:
- ✅ Contract HTML displays with populated data
- ✅ Template came from database (verify with dev tools)
- ✅ Render time < 100ms
- ✅ Cache hit recorded
- ✅ No errors in console

---

### Scenario 2: Contract Generation Fallback (No Active Template)

**Prerequisites**:
- No active database template for selected contract type
- Hardcoded fallback templates available

**Steps**:
1. Disable active template for "Vehicle Sale" contract
2. Navigate to Contract Generator
3. Select "Vehicle Sale" contract
4. Fill in form data
5. Click "Generate Contract"

**Expected Results**:
- ✅ Contract still renders successfully
- ✅ Source = "fallback" (visible in dev mode)
- ✅ Warning logged: "Using fallback template"
- ✅ Fallback render time < 150ms
- ✅ User sees no error message

---

### Scenario 3: Template Editing and Publishing

**Prerequisites**:
- Admin user logged in
- Admin Template Editor accessible

**Steps**:
1. Navigate to Admin > Template Management
2. Click "Edit" on "lease-th" template
3. Modify template HTML:
   - Change a label text
   - Add a new variable placeholder
4. Click "Save as Draft"
5. Click "Preview" to verify changes
6. Click "Publish"
7. Generate a contract to verify changes applied

**Expected Results**:
- ✅ Draft template saved successfully
- ✅ Preview shows updated content
- ✅ Previous active template auto-deactivated
- ✅ New template now active
- ✅ Cache invalidated automatically
- ✅ New contracts use updated template
- ✅ Version incremented (v1 → v2)

---

### Scenario 4: Template Validation Prevents Publishing Invalid Template

**Prerequisites**:
- Admin user in Template Editor
- Template with XSS vulnerability

**Steps**:
1. Create new template
2. Add malicious content: `<script>alert('XSS')</script>`
3. Try to publish

**Expected Results**:
- ✅ Validation error displayed: "Script tags are not allowed"
- ✅ Publish button disabled
- ✅ Error message is user-friendly
- ✅ Template remains in draft state
- ✅ Security event logged

---

### Scenario 5: Cache Functionality

**Prerequisites**:
- Database template is active
- Cache is enabled

**Steps**:
1. Generate 5 contracts of same type/language rapidly
2. Monitor cache stats endpoint
3. Check render times

**Expected Results**:
- ✅ First render: cache miss, ~80ms
- ✅ Renders 2-5: cache hit, ~20ms each
- ✅ Cache hit rate shows ~80%
- ✅ Database queries reduced by 80%
- ✅ Total time saved: ~240ms

---

### Scenario 6: Fallback on Rendering Error

**Prerequisites**:
- Database template has malformed Handlebars syntax
- Fallback template is valid

**Steps**:
1. Corrupt template in database (invalid {{#if}})
2. Generate contract

**Expected Results**:
- ✅ Rendering fails for database template
- ✅ Automatically retries with fallback template
- ✅ Contract still generates successfully
- ✅ Error logged but user sees no error
- ✅ Fallback template used for this request
- ✅ Admin notified of corrupted template

---

### Scenario 7: Version Management

**Prerequisites**:
- Multiple template versions exist

**Steps**:
1. Go to Admin > Template Management
2. Select template with multiple versions
3. Click "Version History"
4. Select previous version
5. Click "Activate"
6. Generate contract

**Expected Results**:
- ✅ Version history shows all versions
- ✅ Can compare versions side-by-side
- ✅ Previous version activated successfully
- ✅ Old version deactivated
- ✅ Contract uses rolled-back template
- ✅ Version counter shows correct number

---

### Scenario 8: Performance Under Load

**Prerequisites**:
- Database template active
- Load testing tool available (e.g., Apache JMeter)

**Steps**:
1. Simulate 100 concurrent users
2. Each user generates 10 contracts
3. Monitor metrics endpoint

**Expected Results**:
- ✅ Cache hit rate maintains >85%
- ✅ Average render time < 100ms
- ✅ Success rate > 99%
- ✅ No database connection errors
- ✅ Memory usage stable
- ✅ Cache size < 10MB

---

### Scenario 9: Security Compliance

**Prerequisites**:
- Security validator and sanitizer active

**Steps**:
1. Attempt to publish template with:
   - `<iframe>` tag
   - Event handlers
   - External scripts
   - Unclosed HTML tags
2. Verify rejection for each attempt

**Expected Results**:
- ✅ Each attempt rejected with specific error
- ✅ Template never becomes active
- ✅ Security event logged
- ✅ Admin audit trail records rejection
- ✅ No XSS vulnerabilities in any generated contracts

---

### Scenario 10: Multi-Language Support

**Prerequisites**:
- Templates for both Thai (th) and English (en)

**Steps**:
1. Generate contract in Thai
2. Switch language to English
3. Generate same contract type in English
4. Verify both use correct language template

**Expected Results**:
- ✅ Thai contract displays Thai template
- ✅ English contract displays English template
- ✅ Both cached independently
- ✅ Both render successfully
- ✅ Cache stats show separate entries per language

---

## Rollback Test Scenarios

### Rollback Scenario 1: Revert to Fallback

**Test**: Disable database template and verify fallback works

**Steps**:
1. Set active template to inactive
2. Generate contract
3. Verify fallback template used

**Expected**: Contract still works, using fallback

---

### Rollback Scenario 2: Restore Previous Version

**Test**: Activate previous template version

**Steps**:
1. Activate previous version
2. Generate contract
3. Verify old template version used

**Expected**: Contract uses restored version successfully

---

### Rollback Scenario 3: Feature Disable

**Test**: Disable entire feature and verify system falls back to hardcoded

**Steps**:
1. Set `TEMPLATE_CACHE_ENABLED=false`
2. Set `TEMPLATE_FALLBACK_ENABLED=false`
3. Generate contract

**Expected**: Contract still works using hardcoded templates

---

## Automated Test Implementation

### Test Framework
- Tool: Playwright / Cypress
- Language: TypeScript
- Browser: Chrome, Firefox, Safari

### Example Test Code

```typescript
// tests/e2e/contract-generation.spec.ts
import { test, expect } from '@playwright/test';

test('generate contract with database template', async ({ page }) => {
  // Navigate to contract generator
  await page.goto('/contract-generator');
  
  // Select contract type
  await page.selectOption('[data-testid="contract-type"]', 'lease');
  
  // Select language
  await page.selectOption('[data-testid="language"]', 'th');
  
  // Fill form
  await page.fill('[data-testid="lessor-name"]', 'นายสมชาย ใจดี');
  await page.fill('[data-testid="lessee-name"]', 'นางสาวสมหญิง รักเรียน');
  
  // Generate
  await page.click('[data-testid="generate-btn"]');
  
  // Verify contract rendered
  const contractFrame = page.frameLocator('[data-testid="contract-preview"]');
  await expect(contractFrame.locator('text=นายสมชาย')).toBeVisible();
  
  // Check dev panel (if enabled)
  await page.click('[data-testid="dev-mode-toggle"]');
  const metadata = page.locator('[data-testid="template-metadata"]');
  await expect(metadata).toContainText('database');
});
```

---

## Test Coverage Matrix

| Feature | Unit Tests | Integration Tests | E2E Tests |
|---------|-----------|------------------|-----------|
| Cache | ✅ 3 tests | ✅ 5 tests | ✅ Scenario 5 |
| Security | ✅ 90 tests | ✅ 10 tests | ✅ Scenario 9 |
| Version Mgmt | ✅ 5 tests | ✅ 3 tests | ✅ Scenario 7 |
| Fallback | ✅ 4 tests | ✅ 6 tests | ✅ Scenario 2 |
| Performance | ✅ 2 tests | ✅ 4 tests | ✅ Scenario 8 |
| Rendering | ✅ 10 tests | ✅ 8 tests | ✅ Scenario 1 |

---

## Success Criteria

All E2E tests passing:
- ✅ All 10 scenarios pass
- ✅ All 3 rollback scenarios pass
- ✅ Performance benchmarks met
- ✅ No console errors
- ✅ No critical logs
- ✅ Security validations pass
- ✅ Load test sustains >99% success rate

---

## Continuous Integration

These tests should run:
- ✅ On every commit (quick smoke tests)
- ✅ Before production deployment (full suite)
- ✅ Nightly (comprehensive load testing)
- ✅ After database migrations

---

**Status**: Test scenarios defined, implementation pending

See `tests/e2e/` for implementation files once created.
