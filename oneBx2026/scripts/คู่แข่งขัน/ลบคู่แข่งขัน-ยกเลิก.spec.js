import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('/');
  
  await page.getByRole('button', { name: 'Login' }).click();

  await page.locator('a').filter({ hasText: 'คู่แข่งขัน' }).click();

  await page.getByRole('textbox', { name: 'เลือกวันที่' }).click();
  await page.getByRole('button', { name: 'Today, Thursday, July 16th,' }).click();
  await page.locator('#filterEventType').click();
  await page.getByRole('option', { name: 'มวยไทย มวยไทย' }).getByRole('checkbox').click();
  await page.locator('#filterStatus').click();
  await page.getByRole('option', { name: 'เปิดเดิมพัน' }).getByRole('checkbox').click();
  await page.getByRole('option', { name: 'ปิดเดิมพัน', exact: true }).getByRole('checkbox').click();
  await page.getByRole('option', { name: 'เปิดเดิมพัน' }).getByRole('checkbox').click();
  await page.getByText('มวยทดสอบ').click();
  await page.locator('tr:nth-child(5) > td:nth-child(6) > .flex').click();
  await page.getByRole('menuitem', { name: 'ยกเลิกคู่แข่งขัน' }).click();
  await page.getByRole('button', { name: 'ยกเลิก' }).click();
});