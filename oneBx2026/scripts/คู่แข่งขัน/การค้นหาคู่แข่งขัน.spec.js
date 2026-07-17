import { test, expect } from '@playwright/test';

test.describe('หน้าคู่แข่งขัน - ช่องค้นหา (Search Box)', () => {
  // ทุกเทสต้อง login และเข้าหน้า 'คู่แข่งขัน' ก่อน ถึงจะเจอช่องค้นหา 'ค้นหา'
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('a').filter({ hasText: 'คู่แข่งขัน' }).click();
  });

  test('SR-001: ค้นหาด้วยชื่อที่มีอยู่จริง แล้วเลือกผลลัพธ์', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: 'ค้นหา' });
    await searchBox.click();
    await searchBox.fill('ก้อง');

    // ผลลัพธ์ตัวอย่างจากการบันทึกจริง — ระบบเป็น live search ไม่ต้องกด Enter
    const result = page.getByText('ก้องศึก ส.กิจรุ่งโรจน์');
    await expect(result).toBeVisible();
    await result.click();

    // รอให้หน้า/สถานะหลังคลิกโหลดเสร็จ แทนการ waitForTimeout ตายตัว
    await page.waitForLoadState('networkidle');
  });

  test('SR-002: ค้นหาด้วยคำบางส่วน (partial match)', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: 'ค้นหา' });
    await searchBox.click();
    await searchBox.fill('ก้อ');

    // TODO: ถ้ามีผลลัพธ์อื่นที่ควรเจอด้วย ให้เพิ่ม assertion ตามจริง
    await expect(page.getByText('ก้องศึก ส.กิจรุ่งโรจน์')).toBeVisible();
  });

  test('SR-003: ค้นหาไม่พบข้อมูล', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: 'ค้นหา' });
    await searchBox.click();
    await searchBox.fill('zzzzz123');

    // เช็คว่าไม่มีแถวผลลัพธ์เหลืออยู่ (ปรับ selector ตามโครงสร้างจริง)
    await expect(page.locator('table tbody tr')).toHaveCount(0);
  });

  test('SR-004: ล้างค่าค้นหาแล้วรายการเต็มกลับมา', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: 'ค้นหา' });
    await searchBox.click();
    await searchBox.fill('ก้อง');
    await expect(page.getByText('ก้องศึก ส.กิจรุ่งโรจน์')).toBeVisible();

    await searchBox.fill('');
    // TODO: ตรวจว่ารายการทั้งหมดกลับมาแสดง (ปรับ selector ให้ตรงกับรายการเริ่มต้นจริง)
  });

  test('SR-005: Case sensitivity (ตัวอักษรละติน)', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: 'ค้นหา' });

    await searchBox.click();
    await searchBox.fill('Kong');
    // TODO: เก็บผลลัพธ์ชุดแรกไว้เทียบ เช่น const first = await page.locator('...').allTextContents();

    await searchBox.fill('kong');
    // TODO: เทียบผลลัพธ์ชุดที่สองว่าตรงกับชุดแรก
  });

  test('SR-006: Security - ป้อนอักขระพิเศษ/สคริปต์', async ({ page }) => {
    let dialogAppeared = false;
    page.on('dialog', async (dialog) => {
      dialogAppeared = true;
      await dialog.dismiss();
    });

    const searchBox = page.getByRole('textbox', { name: 'ค้นหา' });
    await searchBox.click();
    await searchBox.fill('<script>alert(1)</script>');

    expect(dialogAppeared).toBe(false); // ไม่ควรมี alert เด้งจาก script injection
    await expect(page.locator('body')).toBeVisible(); // หน้าไม่ error/ค้าง
  });

  test('SR-007: พิมพ์ภาษาไทยครบสระ/วรรณยุกต์', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: 'ค้นหา' });
    await searchBox.click();
    await searchBox.fill('ก้อง');
    await expect(searchBox).toHaveValue('ก้อง'); // ตรวจว่าไม่มีตัวอักษร/วรรณยุกต์ตกหล่น
  });

  test('SR-008: พิมพ์ข้อความยาวมาก', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: 'ค้นหา' });
    const longText = 'ก'.repeat(200);
    await searchBox.click();
    await searchBox.fill(longText);

    // TODO: ถ้ามี maxlength ให้ตรวจความยาวจริง เช่น
    // const value = await searchBox.inputValue();
    // expect(value.length).toBeLessThanOrEqual(100);
    await expect(searchBox).toBeVisible();
  });

  test('SR-009: ค้นหารวมกับตัวกรองอื่น (AND)', async ({ page }) => {
    // TODO: เลือกตัวกรองอื่นก่อน ถ้าหน้านี้มี เช่น dropdown สถานะ/ช่วงวันที่
    // await page.getByRole('combobox', { name: 'สถานะ' }).selectOption('active');

    const searchBox = page.getByRole('textbox', { name: 'ค้นหา' });
    await searchBox.click();
    await searchBox.fill('ก้อง');

    await expect(page.getByText('ก้องศึก ส.กิจรุ่งโรจน์')).toBeVisible();
  });

  test('SR-010: Pagination/จำนวนรายการอัปเดตตามผลค้นหา', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: 'ค้นหา' });
    await searchBox.click();
    await searchBox.fill('ก้อง');

    // TODO: ปรับ selector ตัวนับจำนวนรายการให้ตรงกับหน้าจริง
    await expect(page.getByText('ก้องศึก ส.กิจรุ่งโรจน์')).toBeVisible();
  });

  test('SR-011: Placeholder และ focus state ของช่องค้นหา', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: 'ค้นหา' });
    await expect(searchBox).toHaveAttribute('placeholder', 'ค้นหา');
    await searchBox.click();
    await expect(searchBox).toBeFocused();
  });

  test('SR-012: Responsive บนหน้าจอขนาดเล็ก', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const searchBox = page.getByRole('textbox', { name: 'ค้นหา' });
    await expect(searchBox).toBeVisible();
    await searchBox.click();
    await searchBox.fill('ก้อง');
  });
});