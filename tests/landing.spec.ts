import { test, expect } from '@playwright/test';

// baseURL is http://localhost:4321/landing/
// Paths without leading slash are relative to baseURL

test.describe('Landing Page', () => {
  test('index page shows app list', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('h1')).toContainText('Landing Pages');
    await expect(page.locator('.app-card')).toHaveCount(2); // 3min and agasteer
  });

  test('japanese landing page loads correctly', async ({ page }) => {
    await page.goto('./3min/ja/');
    await expect(page.locator('h1')).toContainText('3 min. Calendar');
    await expect(page.locator('.tagline')).toBeVisible();
    await expect(page.locator('.media img, .media video')).toBeVisible();
  });

  test('english landing page loads correctly', async ({ page }) => {
    await page.goto('./3min/en/');
    await expect(page.locator('h1')).toContainText('3 min. Calendar');
  });

  test('language switcher works', async ({ page }) => {
    await page.goto('./3min/ja/');
    await page.click('.lang a[href*="/en/"]');
    await expect(page).toHaveURL(/\/3min\/en\//);
    await expect(page.locator('h1')).toContainText('3 min. Calendar');
  });

  test('CTA button is visible and has correct href', async ({ page }) => {
    await page.goto('./3min/ja/');
    const cta = page.locator('.cta-button');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /3min\.llll-ll\.com/);
    await expect(cta).toHaveAttribute('target', '_blank');
    await expect(cta).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('page has correct meta tags', async ({ page }) => {
    await page.goto('./3min/ja/');

    // Check title
    await expect(page).toHaveTitle('3 min. Calendar');

    // Check meta description
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /.+/);

    // Check OG tags
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /^https?:\/\//
    );

    // Check canonical
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /.+/);
  });

  test('page has hreflang tags', async ({ page }) => {
    await page.goto('./3min/ja/');

    const hreflangs = page.locator('link[rel="alternate"][hreflang]');
    const count = await hreflangs.count();
    expect(count).toBeGreaterThanOrEqual(3); // ja, en, zh-cn, x-default
  });

  test('skip link is accessible', async ({ page }) => {
    await page.goto('./3min/ja/');

    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeAttached();

    // Focus the skip link
    await skipLink.focus();
    await expect(skipLink).toBeFocused();
  });

  test('404 page displays correctly', async ({ page }) => {
    await page.goto('./nonexistent/');
    await expect(page.locator('h1')).toContainText('404');
  });

  test('agasteer page loads correctly', async ({ page }) => {
    await page.goto('./agasteer/ja/');
    await expect(page.locator('h1')).toContainText('Agasteer');
  });
});

test.describe('Accessibility', () => {
  test('page has no duplicate IDs', async ({ page }) => {
    await page.goto('./3min/ja/');

    const ids = await page.evaluate(() => {
      const elements = document.querySelectorAll('[id]');
      const idList = Array.from(elements).map((el) => el.id);
      const duplicates = idList.filter((id, index) => idList.indexOf(id) !== index);
      return duplicates;
    });

    expect(ids).toHaveLength(0);
  });

  test('images have alt attributes', async ({ page }) => {
    await page.goto('./3min/ja/');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});
