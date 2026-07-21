import { test, expect } from '@playwright/test';

test.describe('หน้าประเภทกีฬา - ลบประเภทกีฬาทดสอบ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('กรอกยูสเซอร์เนม').fill('adminNor1');
    await page.getByPlaceholder('กรอกรหัสผ่าน').fill('111111');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'ประเภทกีฬา' }).click();
  });

  test('ตรวจสอบค่าก่อนลบ แล้วลบประเภทกีฬาทดสอบ (ระบุชื่อภาษาไทย / test)', async ({ page }) => {

    // สโคปแถวจากชื่อภาษาไทยแบบ exact match (ตาม convention เดียวกับตารางนี้ที่ใช้มาตลอด)
    const targetRow = page.locator('tr').filter({
      has: page.getByRole('cell', { name: 'ระบุชื่อภาษาไทย', exact: true }),
    });

    await test.step('ตรวจสอบค่าก่อนลบ', async () => {
      await expect(targetRow.getByRole('cell', { name: 'ระบุชื่อภาษาไทย', exact: true })).toBeVisible();
      await expect(targetRow.getByRole('cell', { name: 'test', exact: true })).toBeVisible();
      await expect(targetRow.getByText('admin@onebx.com')).toBeVisible();
    });

    await test.step('เปิดเมนู Actions กด "ลบข้อมูล" แล้วยกเลิก (ทดสอบ flow ยกเลิก)', async () => {
      // แก้ไข: ของเดิมใช้ page.locator('#radix-_r_6_') ซึ่งเป็น ID ที่ Radix UI สุ่มให้เองตอน render
      // (เปลี่ยนได้ทุกครั้งที่โหลดหน้าใหม่) ใช้ปุ่มตัวสุดท้ายในแถวที่สโคปไว้แทน — pattern เดิมที่ใช้กับตารางนี้มาตลอด
      await targetRow.getByRole('button').last().click();
      await page.getByRole('menuitem', { name: 'ลบข้อมูล' }).click();
      await page.getByRole('button', { name: 'ยกเลิก' }).click();
    });

    await test.step('ตรวจสอบว่าแถวยังอยู่หลังกดยกเลิก', async () => {
      await expect(targetRow).toBeVisible();
    });

    await test.step('เปิดเมนู Actions อีกครั้ง แล้วยืนยันลบจริง', async () => {
      await targetRow.getByRole('button').last().click();
      await page.getByRole('menuitem', { name: 'ลบข้อมูล' }).click();

      // TODO: ปุ่มยืนยันลบจริงไม่มี accessible name (ข้อความว่าง) filter({ hasText: /^$/ }) แบบนี้กวาดทั้งหน้า
      // เสี่ยงชนกับปุ่มไม่มีชื่ออื่นถ้ามีมากกว่า 1 ตัวตอนนั้น — ถ้าเป็นไปได้ควรหา dialog ยืนยันลบก่อน แล้วค่อยหา
      // ปุ่มใน scope นั้นแทน เช่น page.getByRole('dialog').getByRole('button').filter({ hasText: /^$/ })
      await page.getByRole('button').filter({ hasText: /^$/ }).click();
    });

    await test.step('ตรวจสอบว่าแถวหายไปจริงหลังลบ', async () => {
      await expect(targetRow).toHaveCount(0);
    });

  });

});

  //await page.locator('#radix-_r_6_').click();
  //await page.getByRole('menuitem', { name: 'ลบข้อมูล' }).click();
  //await page.getByRole('button', { name: 'ตกลง' }).click();
  //await page.getByRole('button').click();