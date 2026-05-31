import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://dumlis-final.mahmouddiabline1.workers.dev';
const USERNAME = 'admin_fcai';
const PASSWORD = 'admin';

// ── helper: login via the UI form ───────────────────────────────────────────
async function loginViaUI(page: Page) {
  await page.goto(BASE_URL);
  // Wait for the login form to be ready
  await page.waitForSelector('input[placeholder="أدخل الرقم التعريفي"]', { timeout: 20_000 });

  await page.fill('input[placeholder="أدخل الرقم التعريفي"]', USERNAME);
  await page.fill('input[placeholder="••••••••"]', PASSWORD);
  await page.click('button[type="submit"]');
}

// ── helper: login via localStorage injection (fast path) ──────────────────
async function loginViaToken(page: Page) {
  // First load the page so localStorage is available in the right origin
  await page.goto(BASE_URL);
  await page.waitForLoadState('domcontentloaded');

  // Hit the real API to get a valid token
  const resp = await page.evaluate(async () => {
    const r = await fetch('https://dumlis-final-production.up.railway.app/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin_fcai', password: 'admin' }),
    });
    return r.ok ? r.json() : null;
  });

  if (!resp || !resp.access_token) {
    throw new Error('Could not obtain auth token from API');
  }

  await page.evaluate((token: string) => {
    localStorage.setItem('authToken', token);
  }, resp.access_token as string);

  await page.reload();
}

// ════════════════════════════════════════════════════════════════════════════
// TEST SUITE: Authentication
// ════════════════════════════════════════════════════════════════════════════
test.describe('Authentication', () => {

  test('login page renders correctly', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/DUMLIS|دمياط|نظام/i);

    // Branding should be visible
    await expect(page.getByText('DUMLIS')).toBeVisible();

    // Form fields should be present
    await expect(page.locator('input[placeholder="أدخل الرقم التعريفي"]')).toBeVisible();
    await expect(page.locator('input[placeholder="••••••••"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForSelector('input[placeholder="أدخل الرقم التعريفي"]', { timeout: 20_000 });

    await page.fill('input[placeholder="أدخل الرقم التعريفي"]', 'wrong_user');
    await page.fill('input[placeholder="••••••••"]', 'wrong_pass');
    await page.click('button[type="submit"]');

    // Error message should appear
    await expect(page.locator('text=حدث خطأ').or(page.locator('.bg-red-50')).or(page.locator('[class*="border-red"]'))).toBeVisible({ timeout: 15_000 });
  });

  test('login with admin_fcai/admin succeeds and redirects to dashboard', async ({ page }) => {
    await loginViaUI(page);

    // After successful login the app should show the main layout (not the login form)
    await expect(page.locator('input[placeholder="أدخل الرقم التعريفي"]')).not.toBeVisible({ timeout: 20_000 });

    // Dashboard heading or nav tabs should appear
    await expect(
      page.getByText('لوحة المعلومات').or(page.getByText('بيانات الطلاب'))
    ).toBeVisible({ timeout: 20_000 });
  });

  test('authenticated user sees main navigation tabs', async ({ page }) => {
    await loginViaToken(page);

    // Wait for the app to fully load
    await expect(page.getByText('بيانات الطلاب')).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText('البرامج الدراسية')).toBeVisible();
    await expect(page.getByText('التخصصات')).toBeVisible();
  });

  test('logout clears session and returns to login page', async ({ page }) => {
    await loginViaToken(page);

    // Wait for main app
    await expect(page.getByText('بيانات الطلاب')).toBeVisible({ timeout: 20_000 });

    // Click logout button (title="تسجيل خروج")
    const logoutBtn = page.locator('button[title="تسجيل خروج"]').first();
    await logoutBtn.click();

    // Should be back at login
    await expect(page.locator('input[placeholder="أدخل الرقم التعريفي"]')).toBeVisible({ timeout: 15_000 });
  });
});
