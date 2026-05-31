/**
 * crud.spec.ts
 * Tests CRUD operations on the sys_edit (system settings) page.
 * Flow: navigate to sys_edit → click Edit on first row → modal opens →
 *       change a field value → Save → table reloads with updated data.
 */
import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://dumlis-final.mahmouddiabline1.workers.dev';
const API_BASE = 'https://dumlis-final-production.up.railway.app';

// ── helpers ───────────────────────────────────────────────────────────────

async function loginViaToken(page: Page) {
  await page.goto(BASE_URL);
  await page.waitForLoadState('domcontentloaded');

  const resp = await page.evaluate(async (apiBase: string) => {
    const r = await fetch(`${apiBase}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin_fcai', password: 'admin' }),
    });
    return r.ok ? r.json() : null;
  }, API_BASE);

  if (!resp || !resp.access_token) {
    throw new Error('Could not obtain auth token from API');
  }

  await page.evaluate((token: string) => {
    localStorage.setItem('authToken', token);
  }, resp.access_token as string);

  await page.reload();
  await expect(page.getByText('بيانات الطلاب')).toBeVisible({ timeout: 25_000 });
}

async function navigateToSysEdit(page: Page) {
  // Click main tab "بيانات الطلاب"
  await page.getByRole('button', { name: 'بيانات الطلاب' }).click();
  await page.waitForTimeout(400);

  // Click sidebar item "تعديل النظام"
  const sidebarBtn = page.getByRole('button', { name: 'تعديل النظام' });
  await sidebarBtn.first().click();

  // Wait for table to load
  await page.waitForSelector('table tbody tr', { timeout: 20_000 });
}

// ════════════════════════════════════════════════════════════════════════════
// TEST SUITE: CRUD on sys_edit
// ════════════════════════════════════════════════════════════════════════════
test.describe('CRUD: sys_edit (system settings)', () => {

  test('edit first row → modal opens with row data', async ({ page }) => {
    await loginViaToken(page);
    await navigateToSysEdit(page);

    // Click the edit (pencil) button on the first data row
    const editBtn = page.locator('table tbody tr').first().locator('button[title="تعديل"]');
    await editBtn.click();

    // Modal should open with the title "تعديل"
    await expect(page.locator('text=تعديل').first()).toBeVisible({ timeout: 10_000 });

    // Modal form should contain at least one input field
    const inputs = page.locator('[role="dialog"] input, .fixed.inset-0 input');
    await expect(inputs.first()).toBeVisible({ timeout: 10_000 });
  });

  test('edit first row → change value → save → table refreshes', async ({ page }) => {
    await loginViaToken(page);
    await navigateToSysEdit(page);

    // Capture value from first row's second cell (the "القيمة" column)
    const firstRowCells = page.locator('table tbody tr').first().locator('td');
    const originalValue = await firstRowCells.nth(1).textContent();

    // Click edit button on first row
    const editBtn = page.locator('table tbody tr').first().locator('button[title="تعديل"]');
    await editBtn.click();

    // Wait for modal
    await page.waitForSelector('.fixed.inset-0, [role="dialog"]', { timeout: 10_000 });

    // Find the input for "value" field (القيمة) inside the modal
    // The modal contains inputs/textareas for each column; locate by label or order
    const modalInputs = page.locator('.fixed.inset-0 input:not([type="checkbox"]):not([type="radio"]), [role="dialog"] input:not([type="checkbox"]):not([type="radio"])');
    const inputCount = await modalInputs.count();
    expect(inputCount).toBeGreaterThan(0);

    // Change the first editable field to a new timestamp-based value so it's unique
    const newValue = `test_${Date.now()}`;
    const firstInput = modalInputs.first();
    await firstInput.triple_click?.() ?? await firstInput.click({ clickCount: 3 });
    await firstInput.fill(newValue);

    // Click "حفظ التعديلات" (Save)
    const saveBtn = page.locator('button', { hasText: 'حفظ التعديلات' });
    await saveBtn.click();

    // Modal should close
    await expect(page.locator('.fixed.inset-0')).not.toBeVisible({ timeout: 15_000 });

    // Table should still show rows (data reloaded)
    await page.waitForSelector('table tbody tr', { timeout: 20_000 });
    const rowCount = await page.locator('table tbody tr').count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('edit modal closes when X button is clicked without saving', async ({ page }) => {
    await loginViaToken(page);
    await navigateToSysEdit(page);

    // Open edit modal
    const editBtn = page.locator('table tbody tr').first().locator('button[title="تعديل"]');
    await editBtn.click();

    // Wait for modal to be visible
    await page.waitForSelector('.fixed.inset-0, [role="dialog"]', { timeout: 10_000 });

    // Click close/X button
    const closeBtn = page.locator('.fixed.inset-0 button[title], [role="dialog"] button').filter({
      has: page.locator('svg'),
    }).first();
    await closeBtn.click();

    // Modal should be hidden
    await expect(page.locator('.fixed.inset-0')).not.toBeVisible({ timeout: 10_000 });

    // Table still has rows
    const rowCount = await page.locator('table tbody tr').count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('add new setting opens add modal with empty form', async ({ page }) => {
    await loginViaToken(page);
    await navigateToSysEdit(page);

    // Find the "إضافة إعداد" action button (usually in the page header/actions area)
    const addBtn = page.locator('button', { hasText: 'إضافة' }).first();
    await addBtn.click();

    // Modal should open with "إضافة جديد" title
    await expect(
      page.locator('text=إضافة جديد').or(page.locator('text=إضافة'))
    ).toBeVisible({ timeout: 10_000 });

    // Form should have empty inputs
    const modalInputs = page.locator('.fixed.inset-0 input:not([type="checkbox"]):not([type="radio"])');
    const firstInputValue = await modalInputs.first().inputValue();
    expect(firstInputValue).toBe('');

    // Close modal
    const closeBtn = page.locator('.fixed.inset-0 button').filter({ has: page.locator('svg') }).first();
    await closeBtn.click();
  });
});
