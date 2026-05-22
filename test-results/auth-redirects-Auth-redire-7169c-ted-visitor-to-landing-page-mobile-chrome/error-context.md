# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-redirects.spec.ts >> Auth redirects >> /friends redirects unauthenticated visitor to landing page
- Location: e2e/auth-redirects.spec.ts:14:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/friends
Call log:
  - navigating to "http://localhost:3000/friends", waiting until "domcontentloaded"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | // The server middleware (server/middleware/refresh.global.ts) sends a 301
  4  | // redirect to '/' for any request without cookies that is not:
  5  | //   - the root path '/'
  6  | //   - under '/api/*'
  7  | //   - under '/public/*'
  8  | // These tests verify that redirect behaviour is intact.
  9  | 
  10 | test.describe('Auth redirects', () => {
  11 |   const protectedRoutes = ['/agenda', '/settings', '/profile', '/friends', '/groups']
  12 | 
  13 |   for (const route of protectedRoutes) {
  14 |     test(`${route} redirects unauthenticated visitor to landing page`, async ({ page }) => {
> 15 |       await page.goto(route, { waitUntil: 'domcontentloaded' })
     |                  ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/friends
  16 |       await expect(page).toHaveURL('/')
  17 |       // Confirm the landing page is shown, not an error page
  18 |       await expect(page.getByRole('heading', { name: /Terminplanung/ })).toBeVisible()
  19 |     })
  20 |   }
  21 | })
  22 | 
```