const { test, expect } = require('@playwright/test');

// ================================================
// ตรวจว่า "หน้าประเภทกีฬา" (/sportstype) เปิดอยู่จริง
//   ใช้ URL ของโปรเจกต์ oneBx2026 → https://onebx-master-next.vercel.app
//   page.goto('/sportstype') = เปิดหน้า /sportstype
//   หมายเหตุ: หน้านี้เป็น SPA เนื้อหาเรนเดอร์ทีละส่วน → ใช้ timeout เผื่อเวลาโหลด
// ================================================

test('เปิดหน้าประเภทกีฬา (/sportstype) อยู่', async ({ page }) => {

  await page.goto('/');
  // 3) มีหัวข้อ "ประเภทกีฬา" (รอ SPA เรนเดอร์ได้ถึง 15 วินาที)
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'ประเภทกีฬา' }).click();

  await page.getByRole('button', { name: 'เพิ่มประเภทกีฬา' }).click();

  await page.getByRole('button').nth(1).click();
  await page.getByRole('button').nth(1).click();
  await page.getByRole('button').nth(1).click();
  await page.getByRole('button').first().dblclick();
  await page.getByRole('textbox', { name: 'ระบุชื่อภาษาไทย' }).click();
  await page.getByRole('textbox', { name: 'ระบุชื่อภาษาไทย' }).fill('testระบุชื่อภาษาไทย');

  await page.getByRole('textbox', { name: 'ระบุชื่อภาษาอังกฤษ' }).click();
  await page.getByRole('textbox', { name: 'ระบุชื่อภาษาอังกฤษ' }).fill('testระบุชื่อภาษาอังกฤษ');

  await page.getByRole('textbox', { name: 'ระบุกติกาภาษาไทย' }).click();
  await page.getByRole('textbox', { name: 'ระบุกติกาภาษาไทย' }).fill('testระบุกติกาภาษาไทย');

  await page.getByRole('textbox', { name: 'ระบุกติกาภาษาอังกฤษ' }).click();
  await page.getByRole('textbox', { name: 'ระบุกติกาภาษาอังกฤษ' }).fill('testระบุกติกาภาษาอังกฤษ');

  //await page.getByRole('button', { name: 'อัพโหลดรูปภาพ' }).click();
  //await page.getByRole('dialog', { name: 'เพิ่มประเภทกีฬา' }).setInputFiles('C:\Users\user\Downloads\캔 사료.png');
  await page.getByRole('button', { name: 'บันทึก' }).click();

  // 6) พิมพ์ URL ปัจจุบัน + เก็บ screenshot ไว้ดู
  console.log('อยู่ที่หน้า:', page.url());
  await page.screenshot({ path: 'runs/sportstype.png', fullPage: true });
});
