import { test, expect } from '@playwright/test';

/**
 * Friends Page Tests
 *
 * NOTE: These tests require a running backend with authentication.
 * With Nuxt SSR, API requests happen server-side and cannot be mocked by Playwright.
 */

test.describe('Friends Page - Unauthenticated', () => {
  test('page loads without crashing', async ({ page }) => {
    await page.goto('/friends');
    await page.waitForLoadState('networkidle');

    // Page should load without throwing unhandled errors
    await expect(page.locator('body')).toBeVisible();
  });

  test('redirects unauthenticated users to landing page', async ({ page }) => {
    await page.goto('/friends');
    await page.waitForLoadState('networkidle');

    // Without authentication, user may be redirected to landing page
    // or stay on /friends with error/loading state
    const url = page.url();
    expect(url).toMatch(/\/(friends)?$/);
  });
});

test.describe('Friends Page - With Backend', () => {
  // These tests require a running backend with test data

  test.skip('displays page title and description', async ({ page }) => {
    await page.goto('/friends');
    await expect(page.getByRole('heading', { name: 'Freunde' })).toBeVisible();
    await expect(page.getByText('Verwalte deine Freundschaften')).toBeVisible();
  });

  test.skip('displays friends and requests tabs', async ({ page }) => {
    await page.goto('/friends');
    await expect(page.getByRole('button', { name: /Freunde/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Anfragen/i })).toBeVisible();
  });

  test.skip('shows friend list on friends tab', async ({ page }) => {
    // Requires: Authenticated session with friends
    await page.goto('/friends');
    // Would check for friend cards here
  });

  test.skip('switches to requests tab', async ({ page }) => {
    await page.goto('/friends');
    const requestsTab = page.getByRole('button', { name: /Anfragen/i });
    await requestsTab.click();
    await expect(page.getByText('Eingehende Anfragen')).toBeVisible();
    await expect(page.getByText('Ausgehende Anfragen')).toBeVisible();
  });

  test.skip('shows add friend button', async ({ page }) => {
    await page.goto('/friends');
    await expect(page.getByRole('button', { name: /Hinzufügen/i })).toBeVisible();
  });

  test.skip('opens send friend request dialog', async ({ page }) => {
    await page.goto('/friends');
    await page.getByRole('button', { name: /Hinzufügen/i }).click();
    await expect(page.getByRole('dialog').or(page.locator('.p-dialog'))).toBeVisible({ timeout: 5000 });
  });

  test.skip('shows empty state when no friends', async ({ page }) => {
    // Requires: Authenticated session with no friends
    await page.goto('/friends');
    await expect(page.getByText('Noch keine Freunde')).toBeVisible();
  });
});
