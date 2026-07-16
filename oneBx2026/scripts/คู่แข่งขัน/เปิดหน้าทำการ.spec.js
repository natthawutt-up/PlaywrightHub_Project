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
  
  // เพิ่ม Delay 2 วินาที (2000 มิลลิวินาที)
  await page.waitForTimeout(2000); 

  await page.locator('tr:nth-child(4) > td:nth-child(6) > .flex').click();

  // เพิ่ม Delay อีก 1 วินาที ก่อนคลิกเมนูถัดไป
  await page.waitForTimeout(1000);

  await page.getByRole('menuitem', { name: 'หน้าทำงาน' }).click();
});