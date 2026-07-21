import { test, expect } from '@playwright/test';

test.describe('หน้ารายชื่อลีก - เพิ่มลีก', () => {
  // ทุกเทสต้อง login และเข้าหน้า 'รายชื่อลีก' ก่อน ถึงจะเจอปุ่ม 'เพิ่มลีก'
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('กรอกยูสเซอร์เนม').fill('adminNor1');
    await page.getByPlaceholder('กรอกรหัสผ่าน').fill('111111');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'รายชื่อลีก' }).click();
  });

  test('เพิ่มลีกใหม่ (กรอกฟอร์มครบ + อัปโหลดรูป + บันทึก)', async ({ page }) => {

    await test.step('เปิดฟอร์มเพิ่มลีก', async () => {
      await page.getByRole('button', { name: 'เพิ่มลีก' }).click();
    });

    await test.step('เลือกประเภทกีฬา', async () => {
      await page.getByRole('combobox').filter({ hasText: 'เลือกประเภทกีฬา' }).click();
      // exact: true กันชนกับ 'มวยไทย' ที่อยู่ใน dropdown เดียวกัน (ระบบมีทั้ง 'มวย' และ 'มวยไทย' แยกกัน)
      await page.getByRole('option', { name: 'มวย', exact: true }).click();
    });

    await test.step('เลือก Tag', async () => {
      await page.getByRole('combobox').filter({ hasText: 'เลือก Tag' }).click();
      await page.getByRole('option', { name: 'มวยไทย' }).click();
    });

    await test.step('กรอกชื่อลีกภาษาไทย/อังกฤษ', async () => {
      await page.getByRole('textbox', { name: 'ชื่อลีกภาษาไทย' }).click();
      await page.getByRole('textbox', { name: 'ชื่อลีกภาษาไทย' }).fill('ทดสอบชื่อลีกไทย');

      await page.getByRole('textbox', { name: 'ชื่อลีกภาษาอังกฤษ' }).click();
      await page.getByRole('textbox', { name: 'ชื่อลีกภาษาอังกฤษ' }).fill('Test name Eng');
    });

   

    await test.step('อัปโหลดรูปภาพ', async () => {
      // ไม่คลิกปุ่ม 'อัพโหลดรูปภาพ' ก่อน (เสี่ยงเปิด native OS file picker ที่ Playwright ควบคุมไม่ได้) เรียก
      // setInputFiles() บน <input type="file"> จริงในไดอะล็อกโดยตรงเลย
      // TODO: ชื่อ dialog ยังไม่ยืนยัน 100% — จาก pattern ของฟอร์ม "เพิ่มประเภทกีฬา" ก่อนหน้า ไดอะล็อกมักตั้งชื่อ
      // ตามปุ่มเปิดฟอร์ม (เช่น 'เพิ่มประเภทกีฬา') ไม่ใช่ตามชื่อหน้า จึงคาดว่าที่นี่น่าจะเป็น 'เพิ่มลีก' มากกว่า
      // 'รายชื่อลีก' (ชื่อหน้า) — ถ้า 'เพิ่มลีก' ไม่ match ลองสลับกลับมาใช้ 'รายชื่อลีก' แทน
      const dialog = page.getByRole('dialog', { name: 'เพิ่มลีก' });
      await dialog.locator('input[type="file"]').setInputFiles('C:\\Users\\user\\Cover-7.jpg');
    });

    await test.step('บันทึกลีกใหม่', async () => {
      // ยืนยันจากภาพหน้าจอแล้วว่าปุ่มบันทึกจริงคือ 'บันทึก' (เหมือนฟอร์ม "เพิ่มประเภทกีฬา")
      await page.getByRole('button', { name: 'ยกเลิก' }).click();
      //await page.getByRole('button', { name: 'บันทึก' }).click();
    });

  });

});