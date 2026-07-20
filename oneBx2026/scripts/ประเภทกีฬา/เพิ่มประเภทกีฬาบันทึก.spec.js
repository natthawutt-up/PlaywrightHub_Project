// หมายเหตุโปรเจกต์: ไฟล์ .spec.js ในโปรเจกต์นี้รันแบบ CommonJS (ไม่มี "type": "module" ใน package.json)
// Playwright แปลง import/export ให้ใช้ได้อยู่แล้ว แต่ "import.meta.url" เป็นฟีเจอร์เฉพาะ ESM ที่ไม่มีจุดแปลงไป CJS ได้
// เคยลองใช้ fileURLToPath(import.meta.url) เพื่อหา __dirname มาก่อน แล้วพังด้วย error "Cannot use 'import.meta'
// outside a module" — ในโปรเจกต์นี้ใช้ __dirname ตรง ๆ ได้เลยแทน เพราะเป็นตัวแปร global ที่ Node ใส่ให้อัตโนมัติ
// ในบริบท CommonJS อยู่แล้ว ไม่ต้องประกาศเอง
import { test, expect } from '@playwright/test';
import path from 'node:path';

test.describe('หน้าประเภทกีฬา - เพิ่มประเภทกีฬา', () => {
  // ทุกเทสต้อง login และเข้าหน้า 'ประเภทกีฬา' ก่อน ถึงจะเจอปุ่ม 'เพิ่มประเภทกีฬา'
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'ประเภทกีฬา' }).click();
  });

  test('เพิ่มประเภทกีฬาใหม่ (กรอกฟอร์ม + อัปโหลดรูป)', async ({ page }) => {

    await test.step('เปิดฟอร์มเพิ่มประเภทกีฬา', async () => {
      await page.getByRole('button', { name: 'เพิ่มประเภทกีฬา' }).click();
    });

    await test.step('เลือกไอคอน/ตัวเลือกเริ่มต้นของฟอร์ม', async () => {
      // TODO: ยังไม่รู้ว่า 4 คลิกนี้คือการทำอะไรจริง ๆ (เดา: อาจเป็นการเลือกไอคอนกีฬาจาก picker หรือ toggle
      // บางอย่างในฟอร์ม) selector เดิมอ้างอิงตำแหน่ง (nth/first) ท่ามกลางปุ่มทั้งหมดบนหน้า ซึ่งเปราะบางมาก —
      // ถ้าฟอร์มมีปุ่มเพิ่ม/ลด หรือลำดับ DOM เปลี่ยน จุดนี้จะพังหรือคลิกผิดปุ่มแบบไม่รู้ตัว
      // ช่วยบอกหน่อยว่าจริง ๆ แล้ว 4 คลิกนี้คือขั้นตอนอะไรในฟอร์ม จะได้เปลี่ยนเป็น selector ที่มีชื่อ/role
      // ชัดเจนแทน (เช่น page.getByRole('button', { name: '<ชื่อไอคอน>' }))
      await page.getByRole('button').nth(1).click();
      await page.getByRole('button').nth(1).click();
      await page.getByRole('button').nth(1).click();
      await page.getByRole('button').first().dblclick();
    });

    await test.step('กรอกชื่อภาษาไทย/อังกฤษ', async () => {
      await page.getByRole('textbox', { name: 'ระบุชื่อภาษาไทย' }).click();
      await page.getByRole('textbox', { name: 'ระบุชื่อภาษาไทย' }).fill('ทดสอบระบุชื่อภาษาไทย Test specify Thai name');

      await page.getByRole('textbox', { name: 'ระบุชื่อภาษาอังกฤษ' }).click();
      await page.getByRole('textbox', { name: 'ระบุชื่อภาษาอังกฤษ' }).fill('ทดสอบระบุชื่อภาษาอังกฤษ Test specify ENG name');
    });

    await test.step('กรอกกติกาภาษาไทย/อังกฤษ', async () => {
      await page.getByRole('textbox', { name: 'ระบุกติกาภาษาไทย' }).click();
      await page.getByRole('textbox', { name: 'ระบุกติกาภาษาไทย' }).fill('ทดสอบระบุกติกาภาษาไทย Test Specify the rules Thai');

      await page.getByRole('textbox', { name: 'ระบุกติกาภาษาอังกฤษ' }).click();
      await page.getByRole('textbox', { name: 'ระบุกติกาภาษาอังกฤษ' }).fill('ทดสอบระบุกติกาภาษาอังกฤษ Test Specify the rules ENG');
    });

    await test.step('อัปโหลดรูปภาพ', async () => {
      //await page.getByRole('button', { name: 'อัพโหลดรูปภาพ' }).click();

      // แก้ไข: ของเดิมเรียก setInputFiles() บน role 'dialog' ตรง ๆ ซึ่งใช้ไม่ได้ — Playwright ต้องเรียกบน
      // <input type="file"> จริงเท่านั้น (เรียกได้แม้ input จะถูกซ่อนด้วย CSS ก็ตาม) จึงต้องสโคปหา input ก่อน
      // หมายเหตุ: __dirname ใช้ได้ตรง ๆ โดยไม่ต้องประกาศเอง เพราะโปรเจกต์นี้รัน .spec.js แบบ CommonJS (ดูหมายเหตุบนสุดของไฟล์)
      const dialog = page.getByRole('dialog', { name: 'เพิ่มประเภทกีฬา' });
      await dialog.locator('input[type="file"]').setInputFiles('C:\\Users\\user\\Cover-7.jpg');
    });

    await test.step('บันทึกประเภทกีฬาใหม่', async () => {
      // TODO: ยังไม่มีขั้นตอนกดบันทึก/ยืนยันฟอร์มในของเดิมเลย — ฟอร์มนี้จบแค่ตรงอัปโหลดรูปแล้ว screenshot เฉย ๆ
      // ต้องรู้ชื่อปุ่มบันทึกจริง (เช่น 'บันทึก', 'เพิ่ม', 'ยืนยัน') ถึงจะใส่ locator ที่ถูกต้องตรงนี้ได้
      // await page.getByRole('button', { name: '<ชื่อปุ่มบันทึกจริง>' }).click();
      await page.getByRole('button', { name: 'บันทึก' }).click();
      //await page.getByRole('button', { name: 'ยกเลิก' }).click();

      console.log('อยู่ที่หน้า:', page.url());
      await page.screenshot({ path: 'runs/sportstype.png', fullPage: true });

      // TODO: console.log/screenshot ช่วย debug ได้ แต่ไม่ใช่ assertion — ยังไม่ยืนยันว่าเพิ่มสำเร็จจริง
      // เพิ่ม expect(...) จริงตรงนี้เมื่อรู้ตัวบ่งชี้ความสำเร็จ (เช่น toast, แถวใหม่ขึ้นในตาราง, หรือฟอร์มปิด)
    });

  });

});


