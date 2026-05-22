# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: landing.spec.ts >> Landing Page >> renders hero heading and tagline
- Location: e2e/landing.spec.ts:9:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "domcontentloaded"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | // The landing page does `await fetchUser()` during SSR which proxies to the
  4  | // Quarkus backend. In CI the backend is absent, so the fetch fails with
  5  | // ECONNREFUSED (fast) and the auth store falls back to unauthenticated state.
  6  | // Tests use 'domcontentloaded' to avoid waiting for background network activity.
  7  | 
  8  | test.describe('Landing Page', () => {
  9  |   test('renders hero heading and tagline', async ({ page }) => {
> 10 |     await page.goto('/', { waitUntil: 'domcontentloaded' })
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  11 |     await expect(page.getByRole('heading', { name: /Terminplanung/ })).toBeVisible()
  12 |     await expect(page.getByText('Für Jugendverbände gemacht')).toBeVisible()
  13 |   })
  14 | 
  15 |   test('shows Anmelden and Registrieren buttons', async ({ page }) => {
  16 |     await page.goto('/', { waitUntil: 'domcontentloaded' })
  17 |     await expect(page.getByRole('link', { name: 'Anmelden' }).first()).toBeVisible()
  18 |     await expect(page.getByRole('link', { name: 'Registrieren' }).first()).toBeVisible()
  19 |   })
  20 | 
  21 |   test('Anmelden links to /api/auth/login', async ({ page }) => {
  22 |     await page.goto('/', { waitUntil: 'domcontentloaded' })
  23 |     await expect(page.getByRole('link', { name: 'Anmelden' }).first())
  24 |       .toHaveAttribute('href', '/api/auth/login')
  25 |   })
  26 | 
  27 |   test('Registrieren links to /api/auth/register', async ({ page }) => {
  28 |     await page.goto('/', { waitUntil: 'domcontentloaded' })
  29 |     await expect(page.getByRole('link', { name: 'Registrieren' }).first())
  30 |       .toHaveAttribute('href', '/api/auth/register')
  31 |   })
  32 | 
  33 |   test('features section is present', async ({ page }) => {
  34 |     await page.goto('/', { waitUntil: 'domcontentloaded' })
  35 |     await expect(page.getByRole('heading', { name: 'Alles, was dein Team braucht' })).toBeVisible()
  36 |   })
  37 | 
  38 |   test('all four feature cards are present', async ({ page }) => {
  39 |     await page.goto('/', { waitUntil: 'domcontentloaded' })
  40 |     await expect(page.getByRole('heading', { name: 'Termine organisieren' })).toBeVisible()
  41 |     await expect(page.getByRole('heading', { name: 'Verfügbarkeit abfragen' })).toBeVisible()
  42 |     await expect(page.getByRole('heading', { name: 'Push-Benachrichtigungen' })).toBeVisible()
  43 |     await expect(page.getByRole('heading', { name: 'Einfache Zusagen' })).toBeVisible()
  44 |   })
  45 | 
  46 |   test('CTA section is present', async ({ page }) => {
  47 |     await page.goto('/', { waitUntil: 'domcontentloaded' })
  48 |     await expect(page.getByRole('heading', { name: 'Bereit loszulegen?' })).toBeVisible()
  49 |   })
  50 | })
  51 | 
```