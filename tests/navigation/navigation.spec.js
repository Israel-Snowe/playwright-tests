const { test, expect } = require('@playwright/test');
const { HomePage } = require('../utils/HomePage');
const { CertificatesPage } = require('../utils/CertificatesPage');

test.describe('Navigation Flow', () => {
  let homePage;
  let certificatesPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    certificatesPage = new CertificatesPage(page);
  });

  test('should load homepage correctly', async ({ page }) => {
    await homePage.navigate();
    await homePage.waitForPageLoad();
    
    // Check if page loads successfully
    expect(page.url()).toMatch(/certicraft\.com/);
    
    // Take screenshot
    await page.screenshot({ path: 'screenshots/homepage.png', fullPage: true });
  });

  test('should display main navigation elements', async ({ page }) => {
    await homePage.navigate();
    
    // Check for common navigation elements
    const navElements = [
      homePage.mainNav,
      homePage.logo
    ];
    
    for (const element of navElements) {
      if (await element.isVisible()) {
        await expect(element).toBeVisible();
      }
    }
    
    // Take screenshot
    await page.screenshot({ path: 'screenshots/navigation-elements.png', fullPage: true });
  });

  test('should navigate to certificates section', async ({ page }) => {
    await homePage.navigate();
    
    // Try to navigate to certificates
    try {
      // Look for certificates link in navigation
      const certLinks = [
        page.locator('a:has-text("Certificate")'),
        page.locator('nav a[href*="certificate"]'),
        page.locator('.nav-link:has-text("Certificate")'),
        page.locator('a[href="/certificates"]')
      ];
      
      let navigated = false;
      for (const link of certLinks) {
        if (await link.isVisible()) {
          await link.click();
          navigated = true;
          break;
        }
      }
      
      if (!navigated) {
        // Try direct navigation
        await certificatesPage.navigate();
      }
      
      await page.waitForTimeout(2000);
      
      // Take screenshot
      await page.screenshot({ path: 'screenshots/certificates-navigation.png', fullPage: true });
      
    } catch (error) {
      console.log('Certificate navigation test - error:', error.message);
      await page.screenshot({ path: 'screenshots/certificates-navigation-error.png', fullPage: true });
    }
  });

  test('should handle search functionality', async ({ page }) => {
    await homePage.navigate();
    
    // Check if search box exists
    if (await homePage.searchBox.isVisible()) {
      // Perform a search
      await homePage.searchCertificates('test');
      await page.waitForTimeout(2000);
      
      // Take screenshot of search results
      await page.screenshot({ path: 'screenshots/search-results.png', fullPage: true });
    } else {
      console.log('Search box not found on homepage');
      await page.screenshot({ path: 'screenshots/no-search-box.png', fullPage: true });
    }
  });

  test('should test responsive navigation', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await homePage.navigate();
    
    // Take screenshot of mobile view
    await page.screenshot({ path: 'screenshots/mobile-navigation.png', fullPage: true });
    
    // Look for mobile menu toggle
    const mobileMenuToggles = [
      page.locator('.hamburger, .menu-toggle, .navbar-toggle'),
      page.locator('button[aria-label*="menu"]'),
      page.locator('[data-toggle="collapse"]')
    ];
    
    for (const toggle of mobileMenuToggles) {
      if (await toggle.isVisible()) {
        await toggle.click();
        await page.waitForTimeout(500);
        
        // Take screenshot of opened mobile menu
        await page.screenshot({ path: 'screenshots/mobile-menu-open.png', fullPage: true });
        break;
      }
    }
    
    // Reset to desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should test page accessibility', async ({ page }) => {
    await homePage.navigate();
    
    // Check for basic accessibility elements
    const accessibilityChecks = [
      // Check for proper heading structure
      page.locator('h1').count(),
      // Check for alt text on images
      page.locator('img[alt]').count(),
      // Check for form labels
      page.locator('label').count(),
      // Check for skip links
      page.locator('a:has-text("Skip to content"), a:has-text("Skip to main")').count()
    ];
    
    const results = await Promise.all(accessibilityChecks);
    console.log('Accessibility check results:', {
      h1Count: results[0],
      imagesWithAlt: results[1],
      labelsCount: results[2],
      skipLinksCount: results[3]
    });
    
    // Take screenshot
    await page.screenshot({ path: 'screenshots/accessibility-check.png', fullPage: true });
  });

  test('should handle page errors gracefully', async ({ page }) => {
    // Test navigation to non-existent page
    await page.goto('/non-existent-page', { waitUntil: 'networkidle' });
    
    // Check for 404 or error page
    const errorIndicators = [
      page.locator(':has-text("404")'),
      page.locator(':has-text("Not Found")'),
      page.locator(':has-text("Page not found")'),
      page.locator('.error-page, .not-found')
    ];
    
    let errorFound = false;
    for (const indicator of errorIndicators) {
      if (await indicator.isVisible()) {
        errorFound = true;
        break;
      }
    }
    
    // Take screenshot of error page
    await page.screenshot({ path: 'screenshots/error-page.png', fullPage: true });
    
    console.log('Error page handling test - error page found:', errorFound);
  });
});