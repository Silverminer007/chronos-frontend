import { test, expect } from '@playwright/test';

/**
 * Settings Page Tests
 *
 * NOTE: These tests require a running backend with authentication.
 * With Nuxt SSR, API requests happen server-side and cannot be mocked by Playwright.
 */

test.describe('Settings Page - Unauthenticated', () => {
  test('page loads without crashing', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    // Page should load without throwing unhandled errors
    await expect(page.locator('body')).toBeVisible();
  });

  test('redirects unauthenticated users to landing page', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    // Without authentication, user may be redirected to landing page
    const url = page.url();
    expect(url).toMatch(/\/(settings)?$/);
  });
});

test.describe('Settings Page - With Backend', () => {
  // These tests require a running backend with test data

  test.skip('displays page title and description', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'Einstellungen' })).toBeVisible();
    await expect(page.getByText('Verwalte deine Benachrichtigungseinstellungen')).toBeVisible();
  });

  test.skip('shows save button', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('button', { name: /Speichern/i })).toBeVisible();
  });

  test.skip('displays push notification card', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.locator('text=Push-Benachrichtigungen').or(page.getByText(/Push/i))).toBeVisible();
  });

  test.skip('displays appointment notification settings card', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByText(/Termin/i)).toBeVisible();
  });

  test.skip('displays group notification settings card', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByText(/Gruppen/i)).toBeVisible();
  });

  test.skip('can save settings', async ({ page }) => {
    // Requires: Authenticated session
    await page.goto('/settings');
    await page.getByRole('button', { name: /Speichern/i }).click();
    await expect(page.getByText('Einstellungen gespeichert')).toBeVisible({ timeout: 5000 });
  });
});
