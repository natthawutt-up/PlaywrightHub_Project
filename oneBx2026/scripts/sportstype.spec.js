const { test, expect } = require('@playwright/test');

// ================================================
// ตรวจว่า "หน้าประเภทกีฬา" (/sportstype) เปิดอยู่ + ข้อมูลโหลดจริง
//   เว็บนี้ต้องล็อกอิน (Backoffice Login) ก่อนถึงจะเห็นข้อมูล — เลือกได้ 2 ทาง:
//   ทาง 1 (แนะนำ): กดปุ่มกุญแจ 🔑 ที่การ์ดโปรเจกต์ → ล็อกอินเอง → บันทึก session
//                   แล้วสคริปต์นี้จะข้ามหน้า login ไปเลย
//   ทาง 2: กรอกยูสเซอร์/รหัสผ่านของ staging ในตัวแปร 2 บรรทัดข้างล่างนี้
// ================================================

const USERNAME = '';   // ← ใส่ยูสเซอร์เนม (เว้นว่างถ้าใช้ทาง 1)
const PASSWORD = '';   // ← ใส่รหัสผ่าน   (เว้นว่างถ้าใช้ทาง 1)

test('เปิดหน้าประเภทกีฬา (/sportstype) อยู่', async ({ page }) => {
  // 1) เปิดหน้าประเภทกีฬา
  await page.goto('/sportstype');
  await page.waitForLoadState('domcontentloaded');

  // 2) เว็บนี้จะเด้งไปหน้า login แบบหน่วงเวลา (โชว์หน้าเปล่าก่อน แล้วค่อย redirect)
  //    → รอจนกว่าจะเจอ "ฟอร์ม login" หรือ "ข้อมูลในตาราง" อย่างใดอย่างหนึ่ง
  const userBox = page.getByRole('textbox', { name: 'ยูสเซอร์เนม' });
  const dataCell = page.getByText('Muay Thai').first();
  await Promise.race([
    userBox.waitFor({ state: 'visible', timeout: 20000 }).catch(() => {}),
    dataCell.waitFor({ state: 'visible', timeout: 20000 }).catch(() => {}),
  ]);

  // 3) ถ้าเจอฟอร์ม login = ยังไม่ได้ล็อกอิน
  if (await userBox.isVisible().catch(() => false)) {
    if (!USERNAME || !PASSWORD) {
      throw new Error(
        'ต้องล็อกอินก่อนถึงจะเห็นข้อมูล! เลือกทางใดทางหนึ่ง:\n' +
        '  1) กดปุ่มกุญแจ 🔑 ที่การ์ดโปรเจกต์ใน Dashboard → ล็อกอิน → บันทึก session\n' +
        '  2) ใส่ USERNAME / PASSWORD ที่หัวไฟล์สคริปต์นี้'
      );
    }
    await userBox.fill(USERNAME);
    await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill(PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();

    // รอออกจากหน้า login แล้วกลับไปหน้าประเภทกีฬา
    await page.waitForURL((u) => !u.pathname.includes('/login'), { timeout: 20000 });
    await page.goto('/sportstype');
  }

  // 3) ต้องอยู่ที่ /sportstype (ไม่ถูกเด้งไปหน้า login แล้ว)
  await expect(page).toHaveURL(/\/sportstype/, { timeout: 15000 });

  // 4) มีหัวข้อ "ประเภทกีฬา" (รอ SPA เรนเดอร์ได้ถึง 15 วินาที)
  await expect(page.getByRole('heading', { name: 'ประเภทกีฬา' })).toBeVisible({ timeout: 15000 });

  // 5) ข้อมูลในตารางโหลดจริง — มีกีฬา Muay Thai
  await expect(page.getByText('Muay Thai').first()).toBeVisible({ timeout: 15000 });

  // 6) พิมพ์ URL ปัจจุบัน + เก็บ screenshot ไว้ดู
  console.log('อยู่ที่หน้า:', page.url());
  await page.screenshot({ path: 'runs/sportstype.png', fullPage: true });
});
