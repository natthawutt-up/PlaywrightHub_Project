import { test, expect } from '@playwright/test';

test.describe('หน้ารายชื่อลีก - ลบลีกทดสอบ', () => {
  // ทุกเทสต้อง login และเข้าหน้า 'รายชื่อลีก' ก่อน ถึงจะเจอตารางนี้
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('กรอกยูสเซอร์เนม').fill('adminNor1');
    await page.getByPlaceholder('กรอกรหัสผ่าน').fill('111111');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'รายชื่อลีก' }).click();
  });

  test('ตรวจสอบค่าก่อนลบลีกทดสอบ "ทดสอบชื่อลีกไทย"', async ({ page }) => {

    await test.step('ค้นหาลีกทดสอบก่อน', async () => {
      // แก้ไข: เดิมพยายามหาแถวตรง ๆ ในรายการเต็ม (ไม่ได้กรองอะไรก่อน) ถ้ามีลีกอื่นอยู่เยอะและมีการแบ่งหน้า
      // ลีกทดสอบนี้อาจไม่ได้อยู่ในหน้าแรกที่แสดง ทำให้หา cell ไม่เจอแล้ว timeout พัง ค้นหาด้วยช่องค้นหาก่อนเพื่อ
      // กรองให้เหลือเฉพาะลีกนี้ ไม่ต้องพึ่งว่ามันจะอยู่หน้าไหนของรายการเต็ม
      await page.getByRole('textbox', { name: 'ค้นหา' }).click();
      await page.getByRole('textbox', { name: 'ค้นหา' }).fill('ทดสอบชื่อลีกไทย');
      // รอให้ request ค้นหาจบจริงก่อน เหมือนบทเรียนจาก filter ประเภทกีฬา/สถานะก่อนหน้า — .fill() ทริกเกอร์
      // ค้นหาแบบ live search ที่มี debounce + เรียก API ถ้าไปเช็ค cell ทันทีอาจเช็คก่อนผลลัพธ์อัปเดตจริง
      await page.waitForLoadState('networkidle');
    });

    // สโคปแถวจากชื่อลีกภาษาไทย — แก้ไข: เปลี่ยนจาก getByRole('cell', { name: ..., exact: true }) เป็น
    // getByText(...) ธรรมดาแทน เพราะเป็นไปได้ว่าเซลล์นี้มีไอคอน/รูปประจำลีกอยู่ด้วย (เหมือนตาราง ประเภทกีฬา ที่
    // มีวงกลมไอคอนนำหน้าชื่อ) การคำนวณ accessible name ของ role 'cell' อาจรวมข้อความจากไอคอนนั้นด้วย ทำให้
    // exact: true ตรงตัวอักษรเป๊ะไม่ผ่านทั้งที่แถวมีอยู่จริง — 'ทดสอบชื่อลีกไทย' เป็นข้อความเฉพาะพอแล้วไม่จำเป็นต้อง
    // exact (ไม่ชนกับชื่อลีกอื่นในระบบเหมือนกรณี 'มวย'/'มวยไทย')
    const targetRow = page.locator('tr').filter({ hasText: 'ทดสอบชื่อลีกไทย' });

    await test.step('ตรวจสอบค่าก่อนลบ', async () => {
      await expect(targetRow).toBeVisible();
      // exact: true กันชนกับ 'มวยไทย' ที่อยู่ในแถวเดียวกัน (คอลัมน์ Tag ข้าง ๆ กัน) — ยังจำเป็นตรงนี้เพราะ 'มวย'
      // ชนกับ 'มวยไทย' จริง ต่างจากชื่อลีกด้านบนที่ไม่มีอะไรชน
      await expect(targetRow.getByText('มวย', { exact: true })).toBeVisible();
      await expect(targetRow.getByText('มวยไทย')).toBeVisible();
      await expect(targetRow.getByText('เปิด', { exact: true })).toBeVisible();
    });

    await test.step('เปิดปุ่มลบของแถวที่ตรวจสอบแล้ว', async () => {
      // แก้ไข: ของเดิมใช้ page.getByRole('button').filter({ hasText: /^$/ }).nth(2) ไล่ตำแหน่งท่ามกลางปุ่ม
      // ไม่มีชื่อทั้งหน้า เปราะบางมาก — ตารางนี้มีไอคอน "แก้ไข" (ดินสอ) กับ "ลบ" (ถังขยะ) แยกกันในคอลัมน์ Action
      // (ต่างจากตารางคู่แข่งขัน/ประเภทกีฬาที่ใช้เมนู "..." รวมตัวเลือกไว้) ใช้ปุ่มตัวสุดท้ายในแถว = ปุ่มลบ (ถังขยะ)
      await targetRow.getByRole('button').last().click();
    });

    await test.step('ตรวจสอบว่าไดอะล็อกยืนยันลบขึ้นจริง', async () => {
      await expect(page.getByRole('heading', { name: 'คุณยืนยันลบลีกนี้ใช่หรือไม่ ?' })).toBeVisible();
    });

    await test.step('ยกเลิกก่อน (ยังไม่ลบจริง)', async () => {
      await page.getByRole('button', { name: 'ยกเลิก' }).click();
    });

    await test.step('ตรวจสอบว่าแถวยังอยู่หลังยกเลิก', async () => {
      await expect(targetRow).toBeVisible();
    });

  });

});