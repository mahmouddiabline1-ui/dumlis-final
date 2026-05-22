import { test, expect } from '@playwright/test';

test.describe('الصفحات الداخلية لإدارة شؤون الطلاب', () => {
  // ---------- اختبار قائمة الطلاب ----------
  test('قائمة الطلاب تُظهر بيانات صحيحة وإمكانية التصفية', async ({ page }) => {
    await page.goto('http://localhost:3001/');
    // Mock login token
    await page.evaluate(() => {
      localStorage.setItem(
        'authToken',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
          'eyJzdWIiOiJ0ZXN0X3VzZXIiLCJyb2xlIjoic3R1ZGVudF9hZmZhaXJzIiwic2Nob3Jlc19pZCI6IkZDQUsifQ.' +
          'dummy-signature'
      );
    });
    await page.reload();

    await page.getByRole('button', { name: /إدارة المستخدمين/i }).click();
    const table = page.locator('table');
    await expect(table).toBeVisible();
    await page.fill('input[placeholder="بحث بالاسم/اليوزر/الدور..."]', 'مسؤول');
    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('مسؤول شؤون الطلاب');
  });

  // ---------- اختبار صفحة تسجيل طالب ----------
  test('نموذج تسجيل طالب يعمل ويُظهر رسالة نجاح', async ({ page }) => {
    await page.goto('http://localhost:3001/');
    await page.evaluate(() => {
      localStorage.setItem(
        'authToken',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
          'eyJzdWIiOiJ0ZXN0X3VzZXIiLCJyb2xlIjoic3R1ZGVudF9hZmZhaXJzIiwic2Nob3Jlc19pZCI6IkZDQUsifQ.' +
          'dummy-signature'
      );
    });
    await page.reload();
    await page.getByRole('link', { name: /تسجيل طالب/i }).click();
    await page.fill('input[name="student_id"]', '20250001');
    await page.fill('input[name="name"]', 'طالب اختبار');
    await page.fill('input[name="national_id"]', '29806021201234');
    await page.selectOption('select[name="faculty_id"]', 'FCAI');
    await page.selectOption('select[name="department_id"]', 'CS');
    await page.selectOption('select[name="level"]', '1');
    await page.click('button:has-text("إنشاء")');
    const toast = page.locator('.toast-success, .notification-success');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('تم إنشاء الطالب');
  });

  // ---------- اختبار عرض تفاصيل طالب ----------
  test('تفاصيل طالب تُظهر جميع الحقول المطلوبة', async ({ page }) => {
    await page.goto('http://localhost:3001/');
    await page.evaluate(() => {
      localStorage.setItem(
        'authToken',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
          'eyJzdWIiOiJ0ZXN0X3VzZXIiLCJyb2xlIjoic3R1ZGVudF9hZmZhaXJzIiwic2Nob3Jlc19pZCI6IkZDQUsifQ.' +
          'dummy-signature'
      );
    });
    await page.reload();
    await page.getByRole('link', { name: /الطلاب/i }).click();
    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();
    await firstRow.click();
    await expect(page).toHaveURL(/\/students\/.+/);
    await expect(page.locator('h1')).toContainText('تفاصيل الطالب');
    await expect(page.locator('dl')).toContainText('الرقم الجامعي');
    await expect(page.locator('dl')).toContainText('الاسم');
  });
});
