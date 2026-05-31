/**
 * pages.spec.ts
 * Verifies that key data-table pages load correctly and contain the expected columns.
 */
import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://dumlis-final.mahmouddiabline1.workers.dev';
const API_BASE = 'https://dumlis-final-production.up.railway.app';

// ── helpers ──────────────────────────────────────────────────────────────────

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
  // Wait for main app UI
  await expect(page.getByText('بيانات الطلاب')).toBeVisible({ timeout: 25_000 });
}

/** Click a top-level navigation tab by its visible label */
async function clickMainTab(page: Page, label: string) {
  await page.getByRole('button', { name: label }).click();
  await page.waitForTimeout(500);
}

/** Click a sidebar sub-item by its visible label */
async function clickSidebarItem(page: Page, label: string) {
  const btn = page.getByRole('button', { name: label });
  await btn.first().click();
  // Wait for table to begin loading
  await page.waitForTimeout(800);
}

/** Return all visible column header texts in the active table */
async function getColumnHeaders(page: Page): Promise<string[]> {
  // Wait for the table to appear (or an error / empty state)
  await page.waitForSelector('table thead th, .p-6.text-red-600, [class*="جاري تحميل"]', {
    timeout: 20_000,
  });
  const headers = await page.locator('table thead th').allTextContents();
  return headers.map((h) => h.trim()).filter(Boolean);
}

// ════════════════════════════════════════════════════════════════════════════
// TEST SUITE: Dashboard
// ════════════════════════════════════════════════════════════════════════════
test.describe('Dashboard', () => {

  test('dashboard shows total students stat > 0', async ({ page }) => {
    await loginViaToken(page);

    // The default view after login (no sub-item selected) is the dashboard
    await expect(page.getByText('لوحة المعلومات')).toBeVisible({ timeout: 15_000 });

    // Wait for stats to load (spinner disappears)
    await page.waitForSelector('h3.text-2xl', { timeout: 20_000 });

    // "إجمالي الطلاب" stat card should show a number > 0
    const totalStudentsCard = page.locator('p', { hasText: 'إجمالي الطلاب' }).locator('..').locator('h3');
    const text = await totalStudentsCard.textContent({ timeout: 15_000 });
    const num = parseInt((text || '0').replace(/[^0-9]/g, ''), 10);
    expect(num).toBeGreaterThan(0);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// TEST SUITE: student_list page
// ════════════════════════════════════════════════════════════════════════════
test.describe('student_list page', () => {

  test('table has rows and required columns', async ({ page }) => {
    await loginViaToken(page);

    // Navigate: بيانات الطلاب → قوائم الطلاب
    await clickMainTab(page, 'بيانات الطلاب');
    await clickSidebarItem(page, 'قوائم الطلاب');

    const headers = await getColumnHeaders(page);

    // Required columns
    expect(headers.some((h) => h.includes('كود الطالب'))).toBeTruthy();
    expect(headers.some((h) => h.includes('اسم') || h.includes('الاسم'))).toBeTruthy();
    expect(headers.some((h) => h.includes('المستوى'))).toBeTruthy();
    expect(headers.some((h) => h.includes('GPA') || h.includes('gpa'))).toBeTruthy();
    expect(headers.some((h) => h.includes('الحالة') || h.includes('حالة القيد'))).toBeTruthy();

    // Table should have at least one data row
    const rowCount = await page.locator('table tbody tr').count();
    expect(rowCount).toBeGreaterThan(0);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// TEST SUITE: program_data page
// ════════════════════════════════════════════════════════════════════════════
test.describe('program_data page', () => {

  test('required columns present and forbidden columns absent', async ({ page }) => {
    await loginViaToken(page);

    await clickMainTab(page, 'البرامج الدراسية');
    await clickSidebarItem(page, 'بيانات البرامج');

    const headers = await getColumnHeaders(page);

    // Required columns
    expect(headers.some((h) => h.includes('كود البرنامج'))).toBeTruthy();
    expect(headers.some((h) => h.includes('اسم البرنامج') || h.includes('اسم'))).toBeTruthy();
    expect(headers.some((h) => h.includes('الدرجة العلمية') || h.includes('الدرجة'))).toBeTruthy();
    expect(headers.some((h) => h.includes('القسم') || h.includes('قسم'))).toBeTruthy();
    expect(headers.some((h) => h.includes('إجمالي الساعات') || h.includes('الساعات'))).toBeTruthy();

    // Forbidden columns
    expect(headers.some((h) => h.includes('المدة'))).toBeFalsy();
    expect(headers.some((h) => h.includes('الحالة'))).toBeFalsy();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// TEST SUITE: study_courses page
// ════════════════════════════════════════════════════════════════════════════
test.describe('study_courses page', () => {

  test('has الفصل الدراسي column and no الحالة column', async ({ page }) => {
    await loginViaToken(page);

    await clickMainTab(page, 'البرامج الدراسية');
    await clickSidebarItem(page, 'المقررات الدراسية');

    const headers = await getColumnHeaders(page);

    // Must have semester column
    expect(headers.some((h) => h.includes('الفصل الدراسي') || h.includes('الفصل'))).toBeTruthy();

    // Must NOT have الحالة column
    expect(headers.some((h) => h === 'الحالة')).toBeFalsy();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// TEST SUITE: fees_setup page
// ════════════════════════════════════════════════════════════════════════════
test.describe('fees_setup page', () => {

  test('has الحالة column and no تاريخ التجهيز column', async ({ page }) => {
    await loginViaToken(page);

    await clickMainTab(page, 'بيانات الطلاب');
    await clickSidebarItem(page, 'تجهيز رسوم الطلاب');

    const headers = await getColumnHeaders(page);

    // Must have الحالة
    expect(headers.some((h) => h.includes('الحالة'))).toBeTruthy();

    // Must NOT have تاريخ التجهيز
    expect(headers.some((h) => h.includes('تاريخ التجهيز'))).toBeFalsy();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// TEST SUITE: view_departments page
// ════════════════════════════════════════════════════════════════════════════
test.describe('view_departments page', () => {

  test('no الحالة column', async ({ page }) => {
    await loginViaToken(page);

    await clickMainTab(page, 'التخصصات');
    await clickSidebarItem(page, 'عرض التخصصات');

    const headers = await getColumnHeaders(page);

    // Must NOT have الحالة
    expect(headers.some((h) => h === 'الحالة')).toBeFalsy();

    // Should have basic columns
    expect(headers.some((h) => h.includes('رمز') || h.includes('كود') || h.includes('التخصص'))).toBeTruthy();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// TEST SUITE: sys_edit page (shows real DB data)
// ════════════════════════════════════════════════════════════════════════════
test.describe('sys_edit page', () => {

  test('shows at least 5 rows from database (not hardcoded)', async ({ page }) => {
    await loginViaToken(page);

    await clickMainTab(page, 'بيانات الطلاب');
    await clickSidebarItem(page, 'تعديل النظام');

    // Wait for the table
    await page.waitForSelector('table tbody tr', { timeout: 20_000 });

    const rowCount = await page.locator('table tbody tr').count();
    expect(rowCount).toBeGreaterThanOrEqual(5);
  });
});
