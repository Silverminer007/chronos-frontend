import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays the Chronos logo and branding', async ({ page }) => {
    await expect(page.locator('img[alt="Chronos Logo"]')).toBeVisible();
    // Use first() to avoid strict mode violation - there are multiple "Chronos" texts
    await expect(page.getByText('Chronos', { exact: true }).first()).toBeVisible();
  });

  test('displays the hero section with headline', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Terminplanung/i })).toBeVisible();
    await expect(page.getByText(/Verwalte Team-Termine/i)).toBeVisible();
  });

  test('has login and register links', async ({ page }) => {
    const loginLink = page.getByRole('link', { name: 'Anmelden' });
    const registerLink = page.getByRole('link', { name: 'Registrieren' }).first();

    await expect(loginLink).toBeVisible();
    await expect(registerLink).toBeVisible();
    await expect(loginLink).toHaveAttribute('href', '/api/auth/login');
    await expect(registerLink).toHaveAttribute('href', '/api/auth/register');
  });

  test('displays feature cards', async ({ page }) => {
    await expect(page.getByText('Termine organisieren')).toBeVisible();
    await expect(page.getByText('Verfügbarkeit abfragen')).toBeVisible();
    await expect(page.getByText('Push-Benachrichtigungen')).toBeVisible();
    await expect(page.getByText('Einfache Zusagen')).toBeVisible();
  });

  test('displays demo appointment cards in preview', async ({ page }) => {
    // Use locator with text that matches the appointment names
    await expect(page.locator('text=Sommerfest').first()).toBeVisible();
    await expect(page.locator('text=Team-Meeting').first()).toBeVisible();
    await expect(page.locator('text=Gruppenstunde').first()).toBeVisible();
  });

  test('displays CTA section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Bereit loszulegen?' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Kostenlos registrieren' })).toBeVisible();
  });

  test('scroll to features button exists and features section present', async ({ page }) => {
    // Verify the scroll button exists
    const scrollButton = page.getByRole('button', { name: 'Mehr erfahren' });
    await expect(scrollButton).toBeVisible();

    // Verify the features section exists and has content
    const featuresSection = page.locator('#features');
    await expect(featuresSection).toBeVisible();
    await expect(featuresSection.getByRole('heading', { name: /Alles, was dein Team braucht/i })).toBeVisible();
  });

  test('displays footer with copyright', async ({ page }) => {
    const currentYear = new Date().getUTCFullYear();
    await expect(page.getByText(new RegExp(`© ${currentYear} Chronos`))).toBeVisible();
  });

  test('has responsive design on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      // On mobile, elements should still be visible but may be smaller
      await expect(page.getByRole('heading', { name: /Terminplanung/i })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Anmelden' })).toBeVisible();
    }
  });
});
