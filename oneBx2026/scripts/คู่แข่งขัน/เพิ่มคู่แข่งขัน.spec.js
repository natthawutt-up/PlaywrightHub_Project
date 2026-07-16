import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('/');
  
  await page.getByRole('button', { name: 'Login' }).click();

  await page.locator('a').filter({ hasText: 'คู่แข่งขัน' }).click();

  await page.getByRole('button', { name: 'เพิ่มคู่แข่งขัน' }).click();

  await page.getByRole('combobox').filter({ hasText: 'เลือกลีค/รายการ' }).click();
  await page.getByRole('option', { name: 'มวยทดสอบ' }).click();

  await page.getByRole('textbox', { name: 'เลือกวันแข่งขัน' }).click();
  await page.getByRole('button', { name: 'Today, Thursday, July 16th,' }).click();

  await page.getByRole('combobox').filter({ hasText: 'เลือก Preset การทำงาน' }).click();
  await page.getByRole('option', { name: 'ไม่ใช้งาน Preset' }).click();

  await page.locator('label').filter({ hasText: 'แมชท์แข่งขันการแข่งขันด้วยคนหรือทีมแบบ 1 vs' }).click();

  await page.getByRole('textbox', { name: 'ระบุเวลาแข่งขัน' }).click();
  await page.getByRole('textbox', { name: 'ระบุเวลาแข่งขัน' }).fill('14:00');

  await page.getByRole('combobox').nth(3).click();
  await page.getByRole('option', { name: 'กัลยา สายฝนมวยไทย' }).click();
  await page.getByRole('combobox').filter({ hasText: 'เลือกนักกีฬา' }).click();
  await page.getByRole('option', { name: 'ชบาทอง ศรพิชัย' }).click();

  await page.getByRole('button', { name: 'เพิ่มคู่แข่งขัน' }).nth(1).click();

  // 4) พิมพ์ URL ปัจจุบันลง log
  console.log('เพิ่มคู่แข่งขันสำเร็จ:', page.url());
});
