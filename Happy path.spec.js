import { test, expect } from '@playwright/test';

test.setTimeout(120000);

test('test', async ({ page }) => {
  await page.goto('https://rubikon-cbn-develop.web.app/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('israelstagingQA@certicraft.com');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('Testing420!');
  // Press Enter to submit the login form and wait for navigation to complete
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.getByRole('textbox', { name: 'Password' }).press('Enter')
  ]);
  await page.getByRole('tab', { name: 'Lots' }).click();
  // Wait for the "Create Bulk Lot" button to be visible before clicking
  await page.getByRole('button', { name: 'Create Bulk Lot' }).waitFor({ state: 'visible', timeout: 10000 });
  await page.getByRole('button', { name: 'Create Bulk Lot' }).click();
  // Select "Create Formulated Product Bulk Lot" from the dropdown menu
  await page.getByRole('menuitem', { name: 'Create Formulated Product Bulk Lot' }).click();
  // Wait for the select input to appear before interacting with it
  await page.waitForSelector('#react-select-2-input', { state: 'visible', timeout: 10000 });
  // Click the placeholder to open the dropdown so the input is not covered
  await page.getByText('Please select an option', { exact: true }).click();
  await page.locator('#react-select-2-input').fill('playwright #1');
  await page.locator('#react-select-2-input').press('ControlOrMeta+a');
  await page.locator('#react-select-2-input').press('ControlOrMeta+x');
  await page.locator('#react-select-2-input').fill('');
  await page.getByText('Infused Kief Flower', { exact: true }).click();
  await page.getByRole('textbox', { name: 'If you would like to give' }).click();
  await page.getByRole('textbox', { name: 'If you would like to give' }).fill('playwright #1');
  await page.getByRole('button', { name: 'Create Formulated Product' }).click();
  await page.getByRole('button', { name: 'Open Formulated Product Bulk Lot playwright #' }).click();
  await page.getByRole('button', { name: 'Create down' }).click();
  await page.getByText('Create Bulk Product Blend').click();
  await page.getByRole('textbox', { name: '* How many containers would' }).click();
  await page.getByRole('textbox', { name: '* How many containers would' }).fill('1');
  await page.locator('#productBlendTypeIdAndRevNumber div').filter({ hasText: 'Please select an option' }).nth(1).click();
  await page.getByText('Kief Flower Infusion', { exact: true }).click();
  await page.locator('div').filter({ hasText: /^Please select an option$/ }).nth(2).click();
  await page.getByText('Drying - 250m', { exact: true }).click();
  await page.getByRole('button', { name: 'Create Bulk Product Blend' }).click();
});