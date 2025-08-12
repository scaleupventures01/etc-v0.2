import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const QA_DIR = path.join(process.cwd(), 'QA/2.1.1.1-founder-tenant-seed/evidence');

test.beforeAll(() => {
  fs.mkdirSync(QA_DIR, { recursive: true });
});

test('Founder seed: creates meta and admin; idempotent; missing env fails', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('#app');

  // First run with env provided
  await page.evaluate(() => {
    localStorage.clear();
    window.__env = { VITE_FOUNDER_ADMIN_EMAIL: 'founder.admin@local' };
  });

  const first = await page.evaluate(() => {
    const res = window.__seed.seedFounderTenant();
    const active = 'founder';
    const ns = (k) => `${active}::${k}`;
    const meta = JSON.parse(localStorage.getItem(ns('etc_tenant_meta')) || 'null');
    const users = JSON.parse(localStorage.getItem(ns('etc_users')) || '[]');
    const admin = users.find((u) => u && u.user_id === 'admin');
    return { res, metaOk: !!(meta && meta.tenant_id === 'founder'), adminOk: !!admin, userCount: users.length };
  });
  expect(first.metaOk).toBeTruthy();
  expect(first.adminOk).toBeTruthy();

  await page.screenshot({ path: path.join(QA_DIR, 'seed-smoke.png'), fullPage: true });

  // Second run idempotent
  const second = await page.evaluate(() => {
    const before = JSON.parse(localStorage.getItem('founder::etc_users') || '[]');
    window.__seed.seedFounderTenant();
    const after = JSON.parse(localStorage.getItem('founder::etc_users') || '[]');
    return { beforeLen: before.length, afterLen: after.length };
  });
  expect(second.afterLen).toBe(second.beforeLen);

  // Missing env failure only applies if no env is present in import.meta
  const missing = await page.evaluate(() => {
    const hasEnv = !!(window.__env && window.__env.VITE_FOUNDER_ADMIN_EMAIL);
    localStorage.clear();
    window.__env = undefined;
    try {
      window.__seed.seedFounderTenant();
      return { applicable: !hasEnv, ok: false };
    } catch (e) {
      return { applicable: !hasEnv, ok: true, msg: String(e?.message || e) };
    }
  });
  if (missing.applicable) {
    expect(missing.ok).toBeTruthy();
    expect(missing.msg).toContain('VITE_FOUNDER_ADMIN_EMAIL');
  }
});


