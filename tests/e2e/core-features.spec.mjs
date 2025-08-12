import { test, expect } from '@playwright/test';

test('Core v0: rule → verdict → journal roundtrip', async ({ page }) => {
  await page.goto('/');

  // Wizard view renders
  await expect(page.locator('#wizardSection')).toBeVisible();

  // Create a rule (accept alert)
  page.once('dialog', async (dialog) => { await dialog.accept(); });
  await page.fill('#ruleName', 'Max size 2');
  await page.fill('#ruleMax', '2');
  await page.click('#btnCreateRule');

  // Evaluate a trade
  await page.fill('#tradeText', 'AAPL long 3 100 105');
  await page.click('#btnEvaluate');
  await expect(page.locator('#evalOut')).toContainText('verdict');

  // Navigate to journal
  await page.evaluate(() => { window.location.hash = '#/journal'; });
  await expect(page.locator('#journalSection')).toBeVisible();

  // Create a journal entry with snapshot
  await page.fill('#jSymbol', 'AAPL');
  await page.selectOption('#jSide', { label: 'long' });
  await page.fill('#jSize', '1');
  await page.fill('#jEntry', '100');
  await page.fill('#jExit', '101');
  await page.check('#jSnap');
  await page.click('#btnJournalCreate');

  await expect(page.locator('#jList li')).toHaveCount(1);
});


