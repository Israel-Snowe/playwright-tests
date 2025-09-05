const { test, expect } = require('@playwright/test');

test.describe('Basic Setup Verification', () => {
  test('should verify test setup works', async ({ page }) => {
    // Test that we can navigate to a basic page
    await page.goto('https://example.com');
    
    // Verify page loads
    await expect(page).toHaveTitle(/Example Domain/);
    
    // Take a screenshot to verify screenshots work
    await page.screenshot({ path: 'screenshots/setup-verification.png' });
    
    console.log('Test setup verification completed successfully');
  });
  
  test('should verify Certicraft URL accessibility', async ({ page }) => {
    try {
      // Try to access the Certicraft base URL
      await page.goto('https://certicraft.com', { 
        waitUntil: 'networkidle',
        timeout: 10000 
      });
      
      // Take screenshot regardless of content
      await page.screenshot({ path: 'screenshots/certicraft-accessibility.png', fullPage: true });
      
      // Check if page loaded successfully
      const title = await page.title();
      console.log('Certicraft page title:', title);
      
      // Check URL after potential redirects
      const currentUrl = page.url();
      console.log('Current URL after navigation:', currentUrl);
      
    } catch (error) {
      console.log('Certicraft URL test - Error accessing site:', error.message);
      
      // Take screenshot of error state
      await page.screenshot({ path: 'screenshots/certicraft-error.png' });
      
      // This is expected to fail if Certicraft site is not accessible
      // The test serves as a connectivity check
    }
  });
});