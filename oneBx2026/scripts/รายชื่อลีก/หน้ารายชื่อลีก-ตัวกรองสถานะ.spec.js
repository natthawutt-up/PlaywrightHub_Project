import { test, expect } from '@playwright/test';

// เหมือน pattern ที่ใช้กับตัวกรองประเภทกีฬาก่อนหน้า — รอ network idle ก่อนอ่านตัวนับผลลัพธ์ เพราะตัวนับ
// "Showing ..." เป็น DOM node เดิมที่แค่เปลี่ยนข้อความ ไม่ได้ mount ใหม่ (แค่ toBeVisible() เฉย ๆ ไม่พอ)
async function hasNoResults(page) {
  await page.waitForLoadState('networkidle');
  const counter = page.getByText(/Showing \d+ - \d+ of \d+ items/);
  await expect(counter).toBeVisible();
  const text = await counter.textContent();
  return text.includes('of 0 items');
}

test.describe('หน้ารายชื่อลีก - ตัวกรองสถานะ (เลือกสถานะ)', () => {
  // ทุกเทสต้อง login และเข้าหน้า 'รายชื่อลีก' ก่อน ถึงจะเจอตัวกรองนี้
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('กรอกยูสเซอร์เนม').fill('adminNor1');
    await page.getByPlaceholder('กรอกรหัสผ่าน').fill('111111');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'รายชื่อลีก' }).click();
  });

  test('เลือกสถานะแต่ละแบบ แล้วผลลัพธ์ตรงกับที่เลือก (ถ้ามีข้อมูล)', async ({ page }) => {

    await test.step('เลือก "ทั้งหมด"', async () => {
      // หมายเหตุ: #filterStatus ของหน้านี้เป็น dropdown single-select (คลิก option ตรง ๆ ไม่มี checkbox)
      // ต่างจาก #filterStatus ของหน้าคู่แข่งขันที่เป็น multi-select แบบมี checkbox — ชื่อ id เดียวกันแต่คนละ
      // พฤติกรรมเลย อย่าใช้ pattern getByRole('checkbox') ข้ามหน้ามาโดยไม่เช็คก่อน
      await page.locator('#filterStatus').click();
      await page.getByRole('option', { name: 'ทั้งหมด' }).click();
      // "ทั้งหมด" ควรรวมทุกสถานะ ไม่มีค่าเฉพาะให้เช็ค แค่ยืนยันว่าตัวนับอัปเดตแล้วก็พอ
      await page.waitForLoadState('networkidle');
      await expect(page.getByText(/Showing \d+ - \d+ of \d+ items/)).toBeVisible();
    });

    await test.step('เลือก "เปิด"', async () => {
      await page.locator('#filterStatus').click();
      await page.getByRole('option', { name: 'เปิด' }).click();

      if (await hasNoResults(page)) {
        console.log('ไม่พบข้อมูลสถานะ "เปิด" ในตอนนี้');
      } else {
        await expect(page.getByText('เปิด', { exact: true }).first()).toBeVisible();
      }
    });

    await test.step('เลือก "ปิด"', async () => {
      await page.locator('#filterStatus').click();
      // ใช้ exact: true เพราะ 'ปิด' เป็น substring ของ 'เปิด' ที่อยู่ใน dropdown เดียวกัน (ปัญหาซ้ำแบบเดียวกับ
      // 'ฟุตบอล'/'ฟุตบอล one-bx' และ 'มวย'/'มวยไทย' ที่เจอมาก่อน)
      await page.getByRole('option', { name: 'ปิด', exact: true }).click();

      if (await hasNoResults(page)) {
        console.log('ไม่พบข้อมูลสถานะ "ปิด" ในตอนนี้');
      } else {
        // exact: true เช่นกัน ไม่งั้น getByText('ปิด') จะไปแมตช์บางส่วนของคำว่า 'เปิด' ที่อาจเหลืออยู่บนหน้าได้
        await expect(page.getByText('ปิด', { exact: true }).first()).toBeVisible();
      }
    });

  });

});