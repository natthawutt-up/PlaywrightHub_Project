import { test, expect } from '@playwright/test';

test('ยกเลิกคู่แข่งขัน "มวยทดสอบ" คู่ 02:00 (กัลยา vs ชบาทอง) หลังตรวจสอบแถวที่ถูกต้อง', async ({ page }) => {

  await test.step('เข้าสู่ระบบ (Login)', async () => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Login' }).click();
  });

  await test.step('เข้าหน้ารายการคู่แข่งขัน', async () => {
    await page.locator('a').filter({ hasText: 'คู่แข่งขัน' }).click();
  });

  await test.step('กรองรายการ: วันนี้ / มวยไทย / เปิด-ปิดเดิมพัน', async () => {
    await page.getByRole('textbox', { name: 'เลือกวันที่' }).click();
    // จับเฉพาะคำว่า "Today," ด้านหน้า ไม่ hardcode วันที่
    await page.getByRole('button', { name: /^Today,/ }).click();

    await page.locator('#filterEventType').click();
    await page.getByRole('option', { name: 'มวยไทย มวยไทย' }).getByRole('checkbox').click();

    await page.locator('#filterStatus').click();
    await page.getByRole('option', { name: 'เปิดเดิมพัน' }).getByRole('checkbox').click();
    await page.getByRole('option', { name: 'ปิดเดิมพัน', exact: true }).getByRole('checkbox').click();
    await page.getByRole('option', { name: 'เปิดเดิมพัน' }).getByRole('checkbox').click();

    // ปิด dropdown ตัวกรองสถานะก่อนไปต่อ ไม่งั้น dropdown ที่ยังเปิดค้างจะบัง/กันคลิก element ถัดไป (เช่น เปิดเมนู action ของแถวไม่ได้)
    await page.keyboard.press('Escape');
  });

  // สโคปหาแถวที่ถูกต้องไว้ล่วงหน้าด้วยเนื้อหาจริง (เวลา 02: + ชื่อคู่แข่งขันทั้งสองฝั่ง)
  // ใส่ครบทุกตัวเพื่อกันชนกับแถว "02:" อื่นที่อาจมีอยู่ในกลุ่มอีเวนต์อื่นบนหน้าเดียวกัน
  const targetRow = page.locator('tr')
    .filter({ has: page.getByRole('cell', { name: '02:' }) })
    .filter({ hasText: 'กัลยา สายฝนมวยไทย' })
    .filter({ hasText: 'ชบาทอง ศรพิชัย' });

  await test.step('ตรวจสอบว่าเป็นคู่ที่ต้องการก่อนลบ (มวยทดสอบ / 02:00 / กัลยา vs ชบาทอง)', async () => {
    await expect(page.getByText('มวยทดสอบ')).toBeVisible();
    await expect(targetRow.getByText('กัลยา สายฝนมวยไทย')).toBeVisible();
    await expect(targetRow.getByText('ชบาทอง ศรพิชัย')).toBeVisible();
  });

  await test.step('เปิดเมนู action ของแถวที่ตรวจสอบแล้ว แล้วเลือก "ยกเลิกคู่แข่งขัน"', async () => {
    // แก้ไข: td:nth-child(6) ไม่คงที่จริง (ทดสอบแล้วพัง) — จำนวนคอลัมน์ก่อนหน้าอาจไม่เท่ากันทุกแถว
    // ใช้ td คอลัมน์สุดท้ายแทน ซึ่งยึดตามตำแหน่งจริงของปุ่ม action ในแถวนั้น ๆ โดยไม่ต้องนับเลขคอลัมน์ตายตัว
    await targetRow.locator('td').last().locator('.flex').click();
    await page.getByRole('menuitem', { name: 'ยกเลิกคู่แข่งขัน' }).click();
  });

  await test.step('ยืนยันการยกเลิก', async () => {
    // แก้ไข: ปุ่มยืนยันจริงคือ 'ตกลง' ไม่ใช่ 'ยกเลิก' ตามที่เคยสันนิษฐานไว้ผิดก่อนหน้า
    // (ไดอะล็อกนี้น่าจะมีทั้งปุ่ม 'ยกเลิก' = ปิดโดยไม่ทำอะไร และ 'ตกลง' = ยืนยันการยกเลิกคู่แข่งขันจริง)
    await page.getByRole('button', { name: 'ตกลง' }).click();
  });

});
