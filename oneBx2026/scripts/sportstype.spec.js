const { test, expect } = require('@playwright/test');

// ================================================
// ตรวจว่า "หน้าประเภทกีฬา" (/sportstype) เปิดอยู่จริง
//   ใช้ URL ของโปรเจกต์ oneBx2026 → https://onebx-master-next.vercel.app
//   page.goto('/sportstype') = เปิดหน้า /sportstype
//   หมายเหตุ: หน้านี้เป็น SPA เนื้อหาเรนเดอร์ทีละส่วน → ใช้ timeout เผื่อเวลาโหลด
// ================================================

test('เปิดหน้าประเภทกีฬา (/sportstype) อยู่', async ({ page }) => {
  // 1) เปิดหน้าประเภทกีฬา
  await page.goto('/sportstype');

  // 2) URL ต้องเป็น /sportstype (ไม่ถูกเด้งไปหน้า login)
  await expect(page).toHaveURL(/\/sportstype/);

  // 3) มีหัวข้อ "ประเภทกีฬา" (รอ SPA เรนเดอร์ได้ถึง 15 วินาที)
  await expect(page.getByText('ประเภทกีฬา').first()).toBeVisible({ timeout: 15000 });

  // 4) มีปุ่ม "เพิ่มประเภทกีฬา" — ยืนยันว่าเป็นหน้าจัดการจริง
  await expect(page.getByRole('button', { name: /เพิ่มประเภทกีฬา/ })).toBeVisible({ timeout: 15000 });

  // 5) หัวตาราง "ชื่อภาษาไทย" โผล่ = ตารางรายการเรนเดอร์แล้ว
  await expect(page.getByText('ชื่อภาษาไทย')).toBeVisible({ timeout: 15000 });

  // หมายเหตุ: ข้อมูลในแต่ละแถว (Muay Thai / มวยไทย + สถานะ) ต้อง login ก่อนถึงจะโหลด
  // ถ้าจะเช็คข้อมูลจริง ให้ตั้ง storageState (login) แล้วเพิ่ม เช่น:
  //   await expect(page.getByText('Muay Thai').first()).toBeVisible();

  // 6) พิมพ์ URL ปัจจุบัน + เก็บ screenshot ไว้ดู
  console.log('อยู่ที่หน้า:', page.url());
  await page.screenshot({ path: 'runs/sportstype.png', fullPage: true });
});
