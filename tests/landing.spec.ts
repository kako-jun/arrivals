import { test, expect } from '@playwright/test';

// baseURL is http://localhost:4321/landing/
// Paths without leading slash are relative to baseURL

test.describe('Landing Page', () => {
  test('index page shows app list', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('h1')).toContainText('Landing Pages');
    await expect(page.locator('.app-card')).toHaveCount(1);
  });

  test('japanese landing page loads correctly', async ({ page }) => {
    await page.goto('./narukami/ja/');
    await expect(page.locator('h1')).toContainText('金沢は今日も鳴雷');
    await expect(page.locator('.tagline')).toBeVisible();
    await expect(page.locator('.media img, .media video')).toBeVisible();
  });

  test('english landing page loads correctly', async ({ page }) => {
    await page.goto('./narukami/en/');
    await expect(page.locator('h1')).toContainText('Narukami');
  });

  test('language switcher works', async ({ page }) => {
    await page.goto('./narukami/ja/');
    await page.click('.lang a[href*="/en/"]');
    await expect(page).toHaveURL(/\/narukami\/en\//);
    await expect(page.locator('h1')).toContainText('Narukami');
  });

  test('CTA button is visible and has correct href', async ({ page }) => {
    await page.goto('./narukami/ja/');
    const cta = page.locator('.cta-button');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /narukami\.llll-ll\.com/);
    await expect(cta).toHaveAttribute('target', '_blank');
    await expect(cta).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('gallery images are lazy loaded', async ({ page }) => {
    await page.goto('./narukami/ja/');
    const galleryImages = page.locator('.gallery img');
    const count = await galleryImages.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(galleryImages.nth(i)).toHaveAttribute('loading', 'lazy');
    }
  });

  test('page has correct meta tags', async ({ page }) => {
    await page.goto('./narukami/ja/');

    // Check title
    await expect(page).toHaveTitle('金沢は今日も鳴雷');

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
    await page.goto('./narukami/ja/');

    const hreflangs = page.locator('link[rel="alternate"][hreflang]');
    const count = await hreflangs.count();
    expect(count).toBeGreaterThanOrEqual(3); // ja, en, zh-cn, x-default
  });

  test('skip link is accessible', async ({ page }) => {
    await page.goto('./narukami/ja/');

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
});

test.describe('Accessibility', () => {
  test('page has no duplicate IDs', async ({ page }) => {
    await page.goto('./narukami/ja/');

    const ids = await page.evaluate(() => {
      const elements = document.querySelectorAll('[id]');
      const idList = Array.from(elements).map((el) => el.id);
      const duplicates = idList.filter((id, index) => idList.indexOf(id) !== index);
      return duplicates;
    });

    expect(ids).toHaveLength(0);
  });

  test('images have alt attributes', async ({ page }) => {
    await page.goto('./narukami/ja/');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});
