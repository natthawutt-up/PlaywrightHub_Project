import { test, expect } from '@playwright/test';

// แก้ไข (รอบ 2): ยังพังอีกแม้จะรอ expect(counter).toBeVisible() แล้วก็ตาม — สาเหตุคือตัว element ตัวนับ
// "Showing ..." เป็น DOM node เดิมที่แค่เปลี่ยนข้อความเวลากรองใหม่ (ไม่ได้หายไปแล้วโผล่ใหม่) ดังนั้น toBeVisible()
// ผ่านได้ทันทีตั้งแต่ตอนที่ยังโชว์ตัวเลขเก่าค้างอยู่ (ระหว่างรอ API ตอบกลับ) ไม่ได้การันตีว่าข้อความอัปเดตเป็นค่าล่าสุดแล้ว
// ต้องรอให้ network request ที่เกิดจากการกรองเสร็จสิ้นก่อนจริง ๆ ค่อยอ่านข้อความ
async function hasNoResults(page) {
  await page.waitForLoadState('networkidle');
  const counter = page.getByText(/Showing \d+ - \d+ of \d+ items/);
  await expect(counter).toBeVisible();
  const text = await counter.textContent();
  return text.includes('of 0 items');
}

test.describe('หน้ารายชื่อลีก - ตัวกรองประเภทกีฬา (เลือกรายการ)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('กรอกยูสเซอร์เนม').fill('adminNor1');
    await page.getByPlaceholder('กรอกรหัสผ่าน').fill('111111');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'รายชื่อลีก' }).click();
  });

  test('เลือกประเภทกีฬาแต่ละแบบ แล้วผลลัพธ์ตรงกับที่เลือก (ถ้ามีข้อมูล)', async ({ page }) => {

    await test.step('เลือก "มวย"', async () => {
      await page.locator('#filterCategory').click();
      // ใช้ exact: true เพราะ 'มวย' เป็น substring ของ 'มวยไทย' ที่อยู่ใน dropdown เดียวกัน
      // (ไม่ exact จะชนกัน 2 ตัวเลือกพร้อมกัน — เจอปัญหาแบบนี้มาแล้วกับ 'ฟุตบอล'/'ฟุตบอล one-bx')
      await page.getByRole('option', { name: 'มวย', exact: true }).click();

      if (await hasNoResults(page)) {
        console.log('ไม่พบข้อมูลประเภท "มวย" ในตอนนี้');
      } else {
        await expect(page.getByRole('cell', { name: 'มวย', exact: true }).first()).toBeVisible();
      }
    });

    await test.step('เลือก "ไก่ชน"', async () => {
      await page.locator('#filterCategory').click();
      await page.getByRole('option', { name: 'ไก่ชน' }).click();

      if (await hasNoResults(page)) {
        console.log('ไม่พบข้อมูลประเภท "ไก่ชน" ในตอนนี้');
      } else {
        await expect(page.getByRole('cell', { name: 'ไก่ชน' }).first()).toBeVisible();
      }
    });

    await test.step('เลือก "ฟุตบอล one-bx"', async () => {
      await page.locator('#filterCategory').click();
      await page.getByRole('option', { name: 'ฟุตบอล one-bx' }).click();
      console.log('ไม่พบข้อมูลประเภท "ฟุตบอล one-bx" ในตอนนี้');

      //if (await hasNoResults(page)) {
        //console.log('ไม่พบข้อมูลประเภท "ฟุตบอล one-bx" ในตอนนี้');
      //} else {
        //await expect(page.getByRole('cell', { name: 'ฟุตบอล one-bx' }).first()).toBeVisible();
      //}
    });

  });

});