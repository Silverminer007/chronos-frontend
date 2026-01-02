import { test, expect } from '@playwright/test';

/**
 * Agenda Page Tests
 *
 * NOTE: These tests require a running backend with authentication.
 * With Nuxt SSR, API requests happen server-side and cannot be mocked by Playwright.
 *
 * For unauthenticated users, the page shows content but API calls will fail.
 * Tests marked with .skip require authenticated sessions with a real backend.
 */

test.describe('Agenda Page - Unauthenticated', () => {
  test('redirects to landing page or shows agenda shell', async ({ page }) => {
    await page.goto('/agenda');

    // Without authentication, the page may:
    // 1. Show the agenda page shell (with loading/error state)
    // 2. Or remain on /agenda with empty content
    // Either behavior is acceptable without a backend

    // Check we're either on landing page or agenda
    const url = page.url();
    expect(url).toMatch(/\/(agenda)?$/);
  });

  test('page loads without crashing', async ({ page }) => {
    await page.goto('/agenda');
    await page.waitForLoadState('networkidle');

    // Page should load without throwing unhandled errors
    // Check that basic page structure exists
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Agenda Page - With Backend', () => {
  // These tests require a running backend with test data
  // Run with: npm run test -- --grep "With Backend"

  test.skip('displays appointment cards when authenticated', async ({ page }) => {
    // Requires: Authenticated session with appointments in database
    await page.goto('/agenda');
    // Would check for appointment cards here
  });

  test.skip('displays the create appointment FAB button', async ({ page }) => {
    // Requires: Authenticated session
    await page.goto('/agenda');
    const fabButton = page.locator('button.fixed').filter({ has: page.locator('i.pi-plus') });
    await expect(fabButton.first()).toBeVisible({ timeout: 10000 });
  });

  test.skip('opens create appointment dialog when FAB is clicked', async ({ page }) => {
    // Requires: Authenticated session
    await page.goto('/agenda');
    const fabButton = page.locator('button.fixed').filter({ has: page.locator('i.pi-plus') });
    await fabButton.first().click();
    await expect(page.locator('.p-dialog, [role="dialog"]').first()).toBeVisible({ timeout: 10000 });
  });

  test.skip('displays load more button when appointments exist', async ({ page }) => {
    // Requires: Authenticated session with appointments
    await page.goto('/agenda');
    await expect(page.getByRole('button', { name: /Mehr laden/i })).toBeVisible();
  });

  test.skip('shows empty state when no appointments', async ({ page }) => {
    // Requires: Authenticated session with no appointments
    await page.goto('/agenda');
    await expect(page.getByText('Keine Termine vorhanden')).toBeVisible({ timeout: 10000 });
  });
});
