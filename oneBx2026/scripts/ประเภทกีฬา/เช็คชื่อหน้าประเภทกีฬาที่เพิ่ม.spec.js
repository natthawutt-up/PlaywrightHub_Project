import { test, expect } from '@playwright/test';

test.describe('หน้าประเภทกีฬา', () => {
  // ทุกเทสต้อง login และเข้าหน้า 'ประเภทกีฬา' ก่อน ถึงจะเจอตารางนี้
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('กรอกยูสเซอร์เนม').fill('adminNor1');
    await page.getByPlaceholder('กรอกรหัสผ่าน').fill('111111');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'ประเภทกีฬา' }).click();
  });

  test('ตรวจสอบข้อมูลแถว "ทดสอบระบุชื่อภาษาไทย ครบทุกคอลัมน์', async ({ page }) => {

    await test.step('เข้าหน้าประเภทกีฬาสำเร็จ', async () => {
      await expect(page.getByRole('heading', { name: 'ประเภทกีฬา' })).toBeVisible();
    });

    // สโคปแถวจากชื่อภาษาไทยที่รู้แน่ชัด (ตาม convention เดียวกับตารางคู่แข่งขัน) แทนการหาทีละ element ทั่วทั้งหน้า
    // สำคัญเพราะคำอย่าง 'ใช้งาน' และ 'apollo' ซ้ำกันหลายแถวในตาราง — .first() แบบเดิมจะพังทันทีถ้าลำดับแถวเปลี่ยน (เช่น กดเรียงคอลัมน์)
    // ใช้ has + exact:true บนเซลล์ชื่อภาษาไทย ไม่ใช่ filter({ hasText }) ตรง ๆ เพราะชื่อบางอันเป็น substring ของอีกอัน
    // (เช่น 'ฟุตบอล' อยู่ใน 'ฟุตบอล one-bx' ด้วย — hasText เฉย ๆ จะ match ผิดแถว/หลายแถวได้)
    const row = page.locator('tr').filter({ has: page.getByRole('cell', { name: 'ทดสอบระบุชื่อภาษาไทย', exact: true }) });

    await test.step('ตรวจสอบชื่อภาษาอังกฤษ', async () => {
      await expect(row.getByRole('cell', { name: 'Test specify ENG name' })).toBeVisible();
    });

    await test.step('ตรวจสอบสถานะ', async () => {
      await expect(row.getByText('ใช้งาน')).toBeVisible();
    });

    await test.step('ตรวจสอบผู้สร้าง/อัพเดท', async () => {
      await expect(row.getByText('adminNor1')).toBeVisible();

      // TODO: วันที่/เวลานี้ (07/07/2026 15:38:55) เป็นข้อมูล seed ที่ดูนิ่ง ไม่ได้เกิดจาก action ของเทสเอง
      // ถ้าข้อมูลนี้อาจถูกแก้ไข/reseed ในอนาคต ให้พิจารณาว่าจำเป็นต้องเช็คค่าตายตัวนี้จริงไหม
      // หรือเช็คแค่ว่ามีรูปแบบวันที่/เวลาแสดงอยู่ก็พอ (เช่น regex /\d{2}\/\d{2}\/\d{4}/)
      //await expect(row.getByText('07/07/2026')).toBeVisible();
    });

    await test.step('เปิดเมนู Actions ของแถวนี้', async () => {
      // แก้ไข: ของเดิมใช้ page.locator('#radix-_r_4_') ซึ่งเป็น ID ที่ Radix UI สุ่ม/นับให้เองตอน render
      // (เปลี่ยนได้ทุกครั้งที่โหลดหน้าใหม่ หรือถ้ามี component Radix อื่นถูกเพิ่ม/ลดบนหน้า ตัวเลขจะขยับ) — ห้ามใช้ ID นี้ตรง ๆ
      // ใช้ปุ่มตัวสุดท้ายในแถวที่สโคปไว้แทน (ตาม convention เดียวกับตาราง action อื่น ๆ ในสกิลนี้)
      // TODO: ยืนยัน role จริงของปุ่มนี้ผ่าน Playwright Inspector ถ้า .getByRole('button') ไม่ match
      await row.getByRole('button').last().click();
    });

  });

  // ตรวจสอบคู่ชื่อไทย/อังกฤษแบบเจาะจงค่าจริง (data-driven) — ตรวจจับกรณีแปลผิด/สลับคู่กัน
  // TODO: รายการนี้อ้างอิงจากภาพหน้าจอ ณ วันที่ทำ — ถ้ามีการเพิ่ม/แก้ไขประเภทกีฬาใหม่ ต้องอัปเดตลิสต์นี้ให้ตรงด้วย
  const expectedCategories = [
    { thai: 'ทดสอบระบุชื่อภาษาไทย', english: 'Test specify ENG name' }
  ];

  for (const { thai, english } of expectedCategories) {
    test(`ตรวจสอบคู่ชื่อถูกต้อง: ${thai} = ${english}`, async ({ page }) => {
      // สำคัญ: ใช้ has + exact:true บนเซลล์ชื่อภาษาไทยแทน filter({ hasText }) ตรง ๆ
      // เพราะ 'ฟุตบอล' เป็น substring ของ 'ฟุตบอล one-bx' — ถ้าใช้ hasText เฉย ๆ จะ match ทั้ง 2 แถวพร้อมกัน (strict-mode fail)
      // pattern นี้ปลอดภัยกว่าในระยะยาวด้วย เผื่อมีประเภทกีฬาใหม่ที่ชื่อซ้อนกันแบบนี้เพิ่มมาอีก
      const row = page.locator('tr').filter({ has: page.getByRole('cell', { name: thai, exact: true }) });
      await expect(row).toBeVisible();
      await expect(row.getByRole('cell', { name: english, exact: true })).toBeVisible();
    });
  }

});

