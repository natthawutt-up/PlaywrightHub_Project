import { test, expect } from '@playwright/test';

test.describe('หน้ารายชื่อลีก', () => {
  // ทุกเทสต้อง login และเข้าหน้า 'รายชื่อลีก' ก่อน ถึงจะเจอตารางนี้
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('กรอกยูสเซอร์เนม').fill('adminNor1');
    await page.getByPlaceholder('กรอกรหัสผ่าน').fill('111111');
    
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'รายชื่อลีก' }).click();
  });

  test('เข้าหน้ารายชื่อลีกสำเร็จ', async ({ page }) => {
    // สมมติฐาน: หน้านี้น่าจะมี heading ชื่อ 'รายชื่อลีก' เหมือน pattern ของหน้าอื่น ๆ ในระบบ (เช่น หน้า ประเภทกีฬา
    // ก็มี heading ชื่อ 'ประเภทกีฬา' ตัวเอง) — ถ้า heading จริงเขียนต่างจากนี้ บอกได้เลยจะแก้ให้ตรง
    await expect(page.getByRole('heading', { name: 'รายชื่อลีก' })).toBeVisible();
  });
});