const { test, expect } = require('@playwright/test');

// ================================================
// วิธีเรียก URL เว็บของโปรเจกต์ "oneBx2026-Player"
//   URL ที่ตั้งไว้: https://onebx-player-next.vercel.app/lobby
//   page.goto('/')        → เปิดหน้าแรกของเว็บ
//   page.goto('/login')   → เปิดหน้า /login
//   แก้ URL: คลิกขวาที่โปรเจกต์ → ตั้งค่า URL เว็บทดสอบ
// ================================================

test('new.spec.js', async ({ page }) => {
  // เปิดหน้าแรกของเว็บโปรเจกต์ (https://onebx-player-next.vercel.app/lobby)
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // เช็คว่าหน้าเว็บมี title (แก้ให้ตรงกับเว็บจริง)
  await expect(page).toHaveTitle(/.+/);
  console.log('เปิดสำเร็จ:', page.url());
});
