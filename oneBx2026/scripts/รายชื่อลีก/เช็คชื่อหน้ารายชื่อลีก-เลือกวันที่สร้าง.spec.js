import { test, expect } from '@playwright/test';

// ปุ่มวันที่ในปฏิทินใช้ชื่อ "<วันในสัปดาห์>, <เดือน> <วันที่><ordinal>," แบบเต็มเสมอ ยกเว้น "วันนี้" ที่มีคำนำหน้า
// พิเศษ "Today," คำนวณ pattern แบบไดนามิกจากวันที่จริง ณ ตอนรัน แทนการ hardcode ชื่อวัน/วันที่ตายตัว

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

test.describe('หน้ารายชื่อลีก - ตัวกรองวันที่สร้าง', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('กรอกยูสเซอร์เนม').fill('adminNor1');
    await page.getByPlaceholder('กรอกรหัสผ่าน').fill('111111');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'รายชื่อลีก' }).click();
  });

  test('เลือกวันที่สร้าง วันนี้ / เมื่อวาน / พรุ่งนี้', async ({ page }) => {

    await test.step('เลือกวันนี้', async () => {
      await page.getByRole('textbox', { name: 'เลือกวันที่สร้าง' }).click();
      await page.getByRole('button', { name: getDateButtonPattern(0) }).click();
      // เช็คแบบง่ายและปลอดภัย: แค่ยืนยันว่าตัวนับผลลัพธ์ขึ้นจริงหลังเลือกวันที่ (ใช้ได้ทั้งกรณีมี/ไม่มีข้อมูล)
      await expect(page.getByText(/Showing \d+ - \d+ of \d+ items/)).toBeVisible();
    });

    await test.step('เลือกเมื่อวาน', async () => {
      await page.getByRole('textbox', { name: 'เลือกวันที่สร้าง' }).click();
      await page.getByRole('button', { name: getDateButtonPattern(-1) }).click();
      await expect(page.getByText(/Showing \d+ - \d+ of \d+ items/)).toBeVisible();
    });

    await test.step('เลือกพรุ่งนี้', async () => {
      await page.getByRole('textbox', { name: 'เลือกวันที่สร้าง' }).click();
      await page.getByRole('button', { name: getDateButtonPattern(1) }).click();
      await expect(page.getByText(/Showing \d+ - \d+ of \d+ items/)).toBeVisible();
    });

  });

});