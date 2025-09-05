const { test, expect } = require('@playwright/test');

test.describe('Example Certicraft Test Demo', () => {
  test('should demonstrate a complete user flow', async ({ page }) => {
    try {
      // Navigate to Certicraft homepage
      await page.goto('/', { waitUntil: 'networkidle', timeout: 10000 });
      
      // Take screenshot of homepage
      await page.screenshot({ path: 'screenshots/demo-homepage.png', fullPage: true });
      
      // Try to find and click login/sign in button
      const loginSelectors = [
        'a:has-text("Login")',
        'a:has-text("Sign in")', 
        'button:has-text("Login")',
        'button:has-text("Sign in")',
        '.login-btn',
        '#login-btn'
      ];
      
      let loginButtonFound = false;
      for (const selector of loginSelectors) {
        const element = page.locator(selector);
        if (await element.isVisible()) {
          await element.click();
          loginButtonFound = true;
          break;
        }
      }
      
      if (loginButtonFound) {
        // Wait for login page to load
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'screenshots/demo-login-page.png', fullPage: true });
        
        // Try to fill in login form
        const emailField = page.locator('input[type="email"], input[name="email"], #email');
        const passwordField = page.locator('input[type="password"], input[name="password"], #password');
        
        if (await emailField.isVisible() && await passwordField.isVisible()) {
          await emailField.fill('demo@certicraft.com');
          await passwordField.fill('DemoPassword123!');
          
          // Take screenshot of filled form
          await page.screenshot({ path: 'screenshots/demo-login-filled.png', fullPage: true });
          
          // Find and click submit button
          const submitSelectors = [
            'button[type="submit"]',
            'input[type="submit"]',
            'button:has-text("Login")',
            'button:has-text("Sign in")'
          ];
          
          for (const selector of submitSelectors) {
            const submitBtn = page.locator(selector);
            if (await submitBtn.isVisible()) {
              await submitBtn.click();
              break;
            }
          }
          
          // Wait for response and take screenshot
          await page.waitForTimeout(3000);
          await page.screenshot({ path: 'screenshots/demo-login-result.png', fullPage: true });
        }
      }
      
      // Navigate to certificates section
      try {
        await page.goto('/certificates', { waitUntil: 'networkidle', timeout: 10000 });
        await page.screenshot({ path: 'screenshots/demo-certificates.png', fullPage: true });
      } catch (e) {
        console.log('Could not access certificates page:', e.message);
      }
      
      console.log('Demo test completed successfully');
      
    } catch (error) {
      console.log('Demo test error:', error.message);
      // Take screenshot of error state
      await page.screenshot({ path: 'screenshots/demo-error.png', fullPage: true });
    }
  });
  
  test('should demonstrate mobile testing', async ({ page }) => {
    try {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Navigate to homepage
      await page.goto('/', { waitUntil: 'networkidle', timeout: 10000 });
      
      // Take mobile screenshot
      await page.screenshot({ path: 'screenshots/demo-mobile-homepage.png', fullPage: true });
      
      // Look for mobile menu toggle
      const mobileMenuSelectors = [
        '.hamburger',
        '.menu-toggle',
        '.navbar-toggle',
        'button[aria-label*="menu"]',
        '[data-toggle="collapse"]'
      ];
      
      for (const selector of mobileMenuSelectors) {
        const toggle = page.locator(selector);
        if (await toggle.isVisible()) {
          await toggle.click();
          await page.waitForTimeout(500);
          await page.screenshot({ path: 'screenshots/demo-mobile-menu.png', fullPage: true });
          break;
        }
      }
      
      console.log('Mobile demo test completed');
      
    } catch (error) {
      console.log('Mobile demo test error:', error.message);
      await page.screenshot({ path: 'screenshots/demo-mobile-error.png', fullPage: true });
    }
  });
});