const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../utils/LoginPage');
const { HomePage } = require('../utils/HomePage');

test.describe('Authentication Flow', () => {
  let loginPage;
  let homePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
  });

  test('should display login form correctly', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.isLoginFormVisible();
    
    // Take screenshot for verification
    await page.screenshot({ path: 'screenshots/login-form.png', fullPage: true });
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await loginPage.navigate();
    
    // Attempt login with invalid credentials
    await loginPage.login('invalid@example.com', 'wrongpassword');
    
    // Verify error message appears
    await loginPage.expectLoginError();
    
    // Take screenshot of error state
    await page.screenshot({ path: 'screenshots/login-error.png', fullPage: true });
  });

  test('should handle empty login form submission', async ({ page }) => {
    await loginPage.navigate();
    
    // Try to submit empty form
    await loginPage.loginButton.click();
    
    // Verify validation messages or error handling
    const hasValidationError = await page.locator('input:invalid').count() > 0 ||
                              await loginPage.errorMessage.isVisible();
    
    expect(hasValidationError).toBeTruthy();
    
    // Take screenshot
    await page.screenshot({ path: 'screenshots/login-validation.png', fullPage: true });
  });

  test('should attempt login with valid-looking credentials', async ({ page }) => {
    await loginPage.navigate();
    
    // Use realistic test credentials
    await loginPage.login('test@certicraft.com', 'Test123!');
    
    // Wait a moment for any response
    await page.waitForTimeout(2000);
    
    // Take screenshot of result (could be error or success)
    await page.screenshot({ path: 'screenshots/login-attempt.png', fullPage: true });
    
    // Check if we're still on login page or redirected
    const currentUrl = page.url();
    console.log('After login attempt, current URL:', currentUrl);
  });

  test('should navigate to signup page from login', async ({ page }) => {
    await loginPage.navigate();
    
    // Check if signup link exists and click it
    if (await loginPage.signUpLink.isVisible()) {
      await loginPage.signUpLink.click();
      
      // Verify navigation occurred
      await page.waitForTimeout(1000);
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/sign.?up|register|create/i);
      
      // Take screenshot
      await page.screenshot({ path: 'screenshots/signup-navigation.png', fullPage: true });
    } else {
      console.log('Signup link not found on login page');
    }
  });

  test('should navigate to forgot password from login', async ({ page }) => {
    await loginPage.navigate();
    
    // Check if forgot password link exists and click it
    if (await loginPage.forgotPasswordLink.isVisible()) {
      await loginPage.forgotPasswordLink.click();
      
      // Verify navigation occurred
      await page.waitForTimeout(1000);
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/forgot|reset|password/i);
      
      // Take screenshot
      await page.screenshot({ path: 'screenshots/forgot-password-navigation.png', fullPage: true });
    } else {
      console.log('Forgot password link not found on login page');
    }
  });
});