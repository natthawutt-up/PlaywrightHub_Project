import { test, expect } from '@playwright/test';

// ปุ่มวันที่ในปฏิทินใช้ชื่อ "<วันในสัปดาห์>, <เดือน> <วันที่><ordinal>," แบบเต็มเสมอ
// ยกเว้น "วันนี้" ที่มีคำนำหน้าพิเศษ "Today," (ยืนยันแล้วจากของจริง)
// ฟังก์ชันด้านล่างคำนวณ pattern ที่ถูกต้องแบบไดนามิกจากวันที่จริง ณ ตอนรัน แทนการ hardcode ชื่อวัน/วันที่ตายตัว
// (เจอปัญหานี้มาแล้วครั้งหนึ่งกับ "Today, Thursday, July 16th," ที่พังพอวันเปลี่ยน — ตอนนี้ทำให้ครอบคลุมทุกวันแบบเดียวกัน)

function getOrdinalSuffix(day) {
  if (day % 10 === 1 && day % 100 !== 11) return 'st';
  if (day % 10 === 2 && day % 100 !== 12) return 'nd';
  if (day % 10 === 3 && day % 100 !== 13) return 'rd';
  return 'th';
}

function getDateButtonPattern(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);

  if (offsetDays === 0) {
    return /^Today,/;
  }

  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
  const month = d.toLocaleDateString('en-US', { month: 'long' });
  const day = d.getDate();
  const suffix = getOrdinalSuffix(day);
  return new RegExp(`^${weekday}, ${month} ${day}${suffix},`);
}

// รูปแบบวันที่ที่ระบบแสดงในหัวข้อกลุ่มรายการ เช่น "2026-07-17" — ใช้เช็คว่าฟิลเตอร์วันที่ทำงานถูกต้องจริง
function getDateSuffix(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `-${month}-${day}`;
}

test.describe('หน้าคู่แข่งขัน - ตัวกรองวันที่', () => {
  // ทุกเทสต้อง login และเข้าหน้า 'คู่แข่งขัน' ก่อน ถึงจะเจอช่อง 'เลือกวันที่'
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('a').filter({ hasText: 'คู่แข่งขัน' }).click();
  });

  test('เลือกวันที่ วันนี้ / เมื่อวาน / พรุ่งนี้ แล้วล้างค่า', async ({ page }) => {

    await test.step('เลือกวันนี้ แล้วตรวจสอบว่ารายการของวันนี้แสดงถูกต้อง', async () => {
      await page.getByRole('textbox', { name: 'เลือกวันที่' }).click();
      await page.getByRole('button', { name: getDateButtonPattern(0) }).click();
      await expect(page.getByText(getDateSuffix(0)).first()).toBeVisible();
    });

    await test.step('เลือกเมื่อวาน แล้วตรวจสอบว่ารายการของเมื่อวานแสดงถูกต้อง', async () => {
      await page.getByRole('textbox', { name: 'เลือกวันที่' }).click();
      await page.getByRole('button', { name: getDateButtonPattern(-1) }).click();
      await expect(page.getByText(getDateSuffix(-1)).first()).toBeVisible();
    });

    await test.step('เลือกพรุ่งนี้ แล้วตรวจสอบว่ารายการของพรุ่งนี้แสดงถูกต้อง', async () => {
      await page.getByRole('textbox', { name: 'เลือกวันที่' }).click();
      await page.getByRole('button', { name: getDateButtonPattern(1) }).click();
      await expect(page.getByText(getDateSuffix(1)).first()).toBeVisible();
    });

    await test.step('ล้างค่าตัวกรองวันที่', async () => {
      // TODO: ปุ่มล้างค่าไม่มี accessible name (ไอคอนล้วน ไม่มีข้อความ) จึงต้องอาศัย .filter({ hasText: /^$/ }).nth(1)
      // ตำแหน่ง .nth(1) เปราะบางถ้ามีปุ่มไม่มีข้อความอื่นเพิ่ม/ลดบนหน้า — ถ้าเป็นไปได้ควรตรวจสอบ aria-label จริงผ่าน
      // Playwright Inspector ("Pick locator" บนปุ่ม X) มาแทนตำแหน่งนี้
      await page.getByRole('button').filter({ hasText: /^$/ }).nth(1).click();

      // TODO: ยังไม่ยืนยัน state ที่ถูกต้องหลังล้างค่า (เช่น placeholder กลับมา หรือรายการของทุกวันแสดงอีกครั้ง)
      // ใส่ assertion จริงตรงนี้เมื่อทราบพฤติกรรมที่ระบบแสดงจริงหลังล้างค่า — อย่าเดาข้อความ/สถานะเอง
    });

  });

});
