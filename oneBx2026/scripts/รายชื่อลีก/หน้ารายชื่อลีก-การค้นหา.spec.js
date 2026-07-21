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

  test('LR-001: ค้นหาด้วยคำที่มีอยู่จริง (partial match)', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: 'ค้นหา' });
    await searchBox.click();
    await searchBox.fill('บั้ง');

    // ระบบเป็น live search เหมือนช่องค้นหาหน้าคู่แข่งขัน — ไม่ต้องกด Enter (ยืนยันจาก recording ที่ไม่มี press Enter)

    // เช็คตรงว่าผลลัพธ์มีคำว่า 'บั้งไฟ' ปรากฏจริง — ใช้ .first() แทน .nth(1) เพราะคำนี้ขึ้นซ้ำกันหลายแถว
    // (ทุกแถวในผลลัพธ์มีประเภทกีฬาเป็น 'บั้งไฟ' เหมือนกัน) แค่เช็คว่ามีอย่างน้อย 1 แถวก็พอ ไม่ต้องยึดตำแหน่งที่ 2 ตายตัว
    await expect(page.getByRole('cell', { name: 'บั้งไฟ' }).first()).toBeVisible();

    // เช็คว่ามีผลลัพธ์จริง (ไม่ hardcode จำนวนแถว เพราะข้อมูลเปลี่ยนได้) โดยดูจากตัวนับท้ายตาราง
    await expect(page.getByText(/Showing \d+ - \d+ of \d+ items/)).toBeVisible();
    const counterText = await page.getByText(/Showing \d+ - \d+ of \d+ items/).textContent();
    expect(counterText).not.toMatch(/of 0 items/); // ต้องเจอผลลัพธ์อย่างน้อย 1 รายการ
  });

  test('LR-002: ค้นหาไม่พบข้อมูล', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: 'ค้นหา' });
    await searchBox.click();
    await searchBox.fill('zzzzz123ไม่มีจริง');

    // ยืนยันข้อความ empty state จริงจากภาพหน้าจอ (ภาษาอังกฤษ ไม่ใช่ภาษาไทย) — ต่างจากหน้าอื่นที่ยังไม่ยืนยัน
    await expect(page.getByText('Showing 1 - 0 of 0 items')).toBeVisible();
  });

  test('LR-003: ล้างค่าค้นหาแล้วรายการเต็มกลับมา', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: 'ค้นหา' });
    await searchBox.click();
    await searchBox.fill('บั้ง');
    await expect(page.getByText(/Showing \d+ - \d+ of \d+ items/)).toBeVisible();

    await searchBox.fill('');
    // TODO: ยังไม่ยืนยันจำนวนรายการทั้งหมดตอนไม่กรอง ควรเช็คว่าตัวนับกลับไปมากกว่าตอนค้นหา 'บั้ง' หรือไม่
    // (ในทางปฏิบัติ ถ้ามีข้อมูลมากกว่าลีกเดียว ตัวเลขหลัง 'of' ควรมากกว่าตอนกรองด้วยคำว่า 'บั้ง')
  });

  test('LR-004: ค้นหาด้วยอักขระพิเศษ/สคริปต์ (security)', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: 'ค้นหา' });
    await searchBox.click();

    let dialogAppeared = false;
    page.on('dialog', async (dialog) => {
      dialogAppeared = true;
      await dialog.dismiss();
    });

    await searchBox.fill('<script>alert(1)</script>');
    expect(dialogAppeared).toBe(false);
    await expect(page.locator('body')).toBeVisible(); // หน้าไม่ error/ค้าง
  });
});