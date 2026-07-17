import { test, expect } from '@playwright/test';

test('เปิดหน้าทำการ', async ({ page }) => {

  await test.step('เข้าสู่ระบบ (Login)', async () => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Login' }).click();
  });

  await test.step('เข้าหน้ารายการคู่แข่งขัน', async () => {
    await page.locator('a').filter({ hasText: 'คู่แข่งขัน' }).click();
  });

  await test.step('เลือกวันที่วันนี้', async () => {
    await page.getByRole('textbox', { name: 'เลือกวันที่' }).click();
    await page.getByRole('button', { name: /^Today,/ }).click();
  });

  await test.step('กรองประเภทการแข่งขัน: มวยไทย', async () => {
    await page.locator('#filterEventType').click();
    await page.getByRole('option', { name: 'มวยไทย มวยไทย' }).getByRole('checkbox').click();
  });

  await test.step('กรองสถานะ: เปิดเดิมพัน / ปิดเดิมพัน', async () => {
    await page.locator('#filterStatus').click();
    await page.getByRole('option', { name: 'เปิดเดิมพัน' }).getByRole('checkbox').click();
    await page.getByRole('option', { name: 'ปิดเดิมพัน', exact: true }).getByRole('checkbox').click();
    await page.getByRole('option', { name: 'เปิดเดิมพัน' }).getByRole('checkbox').click();
  });

  await test.step('เปิดรายการคู่แข่งขัน "มวยทดสอบ"', async () => {
    await page.getByText('มวยทดสอบ').click();
    await page.waitForTimeout(2000);
  });

  await test.step('เปิดเมนู Action แล้วเข้าหน้าทำการ', async () => {
    await page.locator('tr:nth-child(4) > td:nth-child(6) > .flex').click();
    await page.waitForTimeout(1000);
    await page.getByRole('menuitem', { name: 'หน้าทำงาน' }).click();
  });

});