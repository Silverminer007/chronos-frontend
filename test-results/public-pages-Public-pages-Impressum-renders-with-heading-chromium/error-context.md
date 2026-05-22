# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public-pages.spec.ts >> Public pages >> Impressum renders with heading
- Location: e2e/public-pages.spec.ts:4:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/public/impressum
Call log:
  - navigating to "http://localhost:3000/public/impressum", waiting until "domcontentloaded"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('Public pages', () => {
  4  |   test('Impressum renders with heading', async ({ page }) => {
> 5  |     await page.goto('/public/impressum', { waitUntil: 'domcontentloaded' })
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/public/impressum
  6  |     await expect(page.getByRole('heading', { name: 'Impressum' })).toBeVisible()
  7  |   })
  8  | 
  9  |   test('Impressum has Chronos logo link back to home', async ({ page }) => {
  10 |     await page.goto('/public/impressum', { waitUntil: 'domcontentloaded' })
  11 |     const logoLink = page.getByRole('link', { name: /Chronos/ }).first()
  12 |     await expect(logoLink).toBeVisible()
  13 |     await logoLink.click()
  14 |     await expect(page).toHaveURL('/')
  15 |   })
  16 | 
  17 |   test('Datenschutz page renders', async ({ page }) => {
  18 |     await page.goto('/public/datenschutz', { waitUntil: 'domcontentloaded' })
  19 |     await expect(page.locator('h1').first()).toBeVisible()
  20 |   })
  21 | 
  22 |   test('Install page renders', async ({ page }) => {
  23 |     await page.goto('/public/install', { waitUntil: 'domcontentloaded' })
  24 |     await expect(page.locator('body')).toBeVisible()
  25 |   })
  26 | 
  27 |   test('PWA manifest is served with correct content type', async ({ request }) => {
  28 |     const response = await request.get('/manifest.webmanifest')
  29 |     expect(response.status()).toBe(200)
  30 |     expect(response.headers()['content-type']).toContain('application/manifest+json')
  31 |   })
  32 | 
  33 |   test('PWA manifest has required fields', async ({ request }) => {
  34 |     const response = await request.get('/manifest.webmanifest')
  35 |     const manifest = await response.json()
  36 |     expect(manifest.name).toBeTruthy()
  37 |     expect(manifest.icons).toBeDefined()
  38 |     expect(Array.isArray(manifest.icons)).toBe(true)
  39 |     expect(manifest.start_url).toBeDefined()
  40 |   })
  41 | })
  42 | 
```