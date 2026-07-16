const { test, expect } = require('@playwright/test');

// ========================================
// สคริปต์ทดสอบ: เปิดเว็บ
// ========================================

test('เปิดเว็บและเช็คว่าโหลดสำเร็จ', async ({ page }) => {
  // 1) เปิดเว็บ (เปลี่ยน URL ตรงนี้เป็นเว็บที่ต้องการ)
  await page.goto('/');

  // ถ้าตั้ง URL ของโปรเจกต์ไว้แล้ว ใช้แบบนี้แทนได้เลย:
  // await page.goto('/');

  // 2) รอให้หน้าเว็บโหลดเสร็จ
  await page.waitForLoadState('domcontentloaded');

  // 3) เช็คว่า title ถูกต้อง (แก้คำใน // ให้ตรงกับเว็บ)
  await expect(page).toHaveTitle(/OneBx Backoffice/);

  // 4) พิมพ์ URL ปัจจุบันลง log
  console.log('เปิดสำเร็จ:', page.url());

  // 5) เก็บ screenshot ไว้ดูย้อนหลัง (อยู่ในโฟลเดอร์ runs/)
  await page.screenshot({ path: 'runs/เปิดเว็บ.png', fullPage: false });
});