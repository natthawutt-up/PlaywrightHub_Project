import { test, expect } from '@playwright/test';

test('เพิ่มคู่แข่งขันใหม่ - กรอกฟอร์มครบแล้วยกเลิก (ไม่บันทึก)', async ({ page }) => {

  await test.step('เข้าสู่ระบบ (Login)', async () => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Login' }).click();
  });

  await test.step('เข้าหน้ารายการคู่แข่งขัน', async () => {
    await page.locator('a').filter({ hasText: 'คู่แข่งขัน' }).click();
  });

  await test.step('เปิดฟอร์มเพิ่มคู่แข่งขัน', async () => {
    await page.getByRole('button', { name: 'เพิ่มคู่แข่งขัน' }).click();
  });

  await test.step('เลือกลีค/รายการ', async () => {
    await page.getByRole('combobox').filter({ hasText: 'เลือกลีค/รายการ' }).click();
    await page.getByRole('option', { name: 'มวยทดสอบ' }).click();
  });

  await test.step('เลือกวันแข่งขัน (วันนี้)', async () => {
    await page.getByRole('textbox', { name: 'เลือกวันแข่งขัน' }).click();
    // จับเฉพาะคำว่า "Today," ด้านหน้า ไม่ hardcode วันที่ (กันพังตอนวันเปลี่ยน — จุดเดิมที่เจอในหน้าอื่นมาก่อน)
    await page.getByRole('button', { name: /^Today,/ }).click();
  });

  await test.step('เลือก Preset การทำงาน', async () => {
    await page.getByRole('combobox').filter({ hasText: 'เลือก Preset การทำงาน' }).click();
    await page.getByRole('option', { name: 'ไม่ใช้งาน Preset' }).click();
  });

  await test.step('เลือกประเภทแมชท์ (1 vs 1)', async () => {
    await page.locator('label').filter({ hasText: 'แมชท์แข่งขันการแข่งขันด้วยคนหรือทีมแบบ 1 vs' }).click();
  });

  await test.step('กรอกเวลาแข่งขัน', async () => {
    await page.getByRole('textbox', { name: 'ระบุเวลาแข่งขัน' }).click();
    await page.getByRole('textbox', { name: 'ระบุเวลาแข่งขัน' }).fill('14:00');
  });

  await test.step('เลือกคู่นักกีฬา', async () => {
    // TODO: `.nth(3)` อ้างอิงตามตำแหน่ง ถ้า layout ฟอร์มเปลี่ยน (เพิ่ม/ลบ field) ตัวเลขนี้จะผิดทันที
    // ถ้าเป็นไปได้ควรเปลี่ยนเป็น .filter({ hasText: '<label ของนักกีฬาคนที่ 1>' }) แทน เหมือน combobox อื่น ๆ ในฟอร์มนี้
    await page.getByRole('combobox').nth(3).click();
    await page.getByRole('option', { name: 'กัลยา สายฝนมวยไทย' }).click();

    await page.getByRole('combobox').filter({ hasText: 'เลือกนักกีฬา' }).click();
    await page.getByRole('option', { name: 'ชบาทอง ศรพิชัย' }).click();
  });

  await test.step('ปิดฟอร์มโดยไม่บันทึก (ยกเลิก)', async () => {
    await page.getByRole('button', { name: 'ยกเลิก' }).click();
  });

});