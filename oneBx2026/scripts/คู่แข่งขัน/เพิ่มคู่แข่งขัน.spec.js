import { test, expect } from '@playwright/test';

test('เพิ่มคู่แข่งขันใหม่และบันทึกสำเร็จ', async ({ page }) => {

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
    // จับเฉพาะคำว่า "Today," ด้านหน้า ไม่ hardcode วันที่ (กันพังตอนวันเปลี่ยน)
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
    // TODO: `.nth(3)` อ้างอิงตามตำแหน่ง ถ้า layout ฟอร์มเปลี่ยนตัวเลขนี้จะผิดทันที
    // ถ้าเป็นไปได้ควรเปลี่ยนเป็น .filter({ hasText: '<label ของนักกีฬาคนที่ 1>' }) แทน เหมือน combobox อื่น ๆ
    await page.getByRole('combobox').nth(3).click();
    await page.getByRole('option', { name: 'กัลยา สายฝนมวยไทย' }).click();

    await page.getByRole('combobox').filter({ hasText: 'เลือกนักกีฬา' }).click();
    await page.getByRole('option', { name: 'ชบาทอง ศรพิชัย' }).click();
  });

  await test.step('บันทึกคู่แข่งขัน (ยืนยันการเพิ่ม)', async () => {
    // ปุ่มนี้ใช้ชื่อ accessible name ซ้ำกับปุ่มเปิดฟอร์มตอนต้น (มี 2 ปุ่มชื่อ 'เพิ่มคู่แข่งขัน' อยู่บนหน้าเดียวกันพร้อมกัน)
    // .nth(1) จึงเปราะบางเหมือนกรณี .nth(3) ด้านบน — ถ้าเป็นไปได้ควร scope selector ให้แคบลง
    // เช่น หา modal/dialog ที่ห่อฟอร์มไว้ก่อน แล้วค่อยหาใน scope นั้น (ต้องดู DOM จริงว่าใช้ role อะไร เช่น
    // page.getByRole('dialog').getByRole('button', { name: 'เพิ่มคู่แข่งขัน' }))
    await page.getByRole('button', { name: 'เพิ่มคู่แข่งขัน' }).nth(1).click();

    // console.log ช่วย debug ได้ แต่ไม่ใช่ assertion จริง — ต่อให้บันทึกไม่สำเร็จ บรรทัดนี้ก็ยัง log ออกมาปกติ ไม่ทำให้ test fail
    console.log('เพิ่มคู่แข่งขันสำเร็จ:', page.url());

    // TODO: ยังไม่ทราบตัวบ่งชี้ความสำเร็จจริงของระบบ (ข้อความ toast, การเปลี่ยน URL เฉพาะ, หรือรายการใหม่ขึ้นในตาราง)
    // เช็คแบบระมัดระวังไว้ก่อน: ยืนยันว่าโมดัลปิดแล้ว โดยเหลือปุ่ม 'เพิ่มคู่แข่งขัน' แค่ปุ่มเดียว (ปุ่มเปิดฟอร์มเดิม)
    await expect(page.getByRole('button', { name: 'เพิ่มคู่แข่งขัน' })).toHaveCount(1);
  });

});