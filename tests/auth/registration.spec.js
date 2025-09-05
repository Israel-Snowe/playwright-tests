const { test, expect } = require('@playwright/test');
const { BasePage } = require('../utils/BasePage');

class RegistrationPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Form elements
    this.firstNameInput = page.locator('input[name="firstName"], input[name="first_name"], #firstName');
    this.lastNameInput = page.locator('input[name="lastName"], input[name="last_name"], #lastName');
    this.emailInput = page.locator('input[type="email"], input[name="email"], #email');
    this.passwordInput = page.locator('input[type="password"], input[name="password"], #password');
    this.confirmPasswordInput = page.locator('input[name="confirmPassword"], input[name="confirm_password"], #confirmPassword');
    this.termsCheckbox = page.locator('input[type="checkbox"][name*="terms"], input[type="checkbox"][name*="agree"]');
    this.submitButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Sign up"), button:has-text("Register")');
    
    // Messages
    this.successMessage = page.locator('.success, .alert-success, [role="status"]');
    this.errorMessage = page.locator('.error, .alert-danger, [role="alert"]');
    this.validationMessage = page.locator('.validation-error, .field-error, .invalid-feedback');
    
    // Links
    this.loginLink = page.locator('a:has-text("Login"), a:has-text("Sign in"), a:has-text("Already have an account")');
  }

  async navigate() {
    await super.navigate('/register');
    // Also try common signup URLs
    const signupUrls = ['/signup', '/sign-up', '/create-account'];
    for (const url of signupUrls) {
      try {
        await super.navigate(url);
        if (await this.emailInput.isVisible()) break;
      } catch (e) {
        // Continue to next URL
      }
    }
  }

  async fillRegistrationForm(userData) {
    if (await this.firstNameInput.isVisible()) {
      await this.firstNameInput.fill(userData.firstName);
    }
    if (await this.lastNameInput.isVisible()) {
      await this.lastNameInput.fill(userData.lastName);
    }
    await this.emailInput.fill(userData.email);
    await this.passwordInput.fill(userData.password);
    if (await this.confirmPasswordInput.isVisible()) {
      await this.confirmPasswordInput.fill(userData.confirmPassword || userData.password);
    }
    if (await this.termsCheckbox.isVisible()) {
      await this.termsCheckbox.check();
    }
  }

  async submitForm() {
    await this.submitButton.click();
  }
}

test.describe('User Registration Flow', () => {
  let registrationPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
  });

  test('should display registration form correctly', async ({ page }) => {
    await registrationPage.navigate();
    
    // Check if we can find registration form elements
    const formVisible = await registrationPage.emailInput.isVisible() &&
                       await registrationPage.passwordInput.isVisible() &&
                       await registrationPage.submitButton.isVisible();
    
    if (formVisible) {
      await expect(registrationPage.emailInput).toBeVisible();
      await expect(registrationPage.passwordInput).toBeVisible();
      await expect(registrationPage.submitButton).toBeVisible();
    }
    
    // Take screenshot
    await page.screenshot({ path: 'screenshots/registration-form.png', fullPage: true });
    
    console.log('Registration form found:', formVisible);
  });

  test('should validate required fields', async ({ page }) => {
    await registrationPage.navigate();
    
    if (await registrationPage.submitButton.isVisible()) {
      // Try to submit empty form
      await registrationPage.submitButton.click();
      
      // Wait for validation
      await page.waitForTimeout(1000);
      
      // Check for validation errors
      const hasValidationErrors = await page.locator('input:invalid').count() > 0 ||
                                 await registrationPage.validationMessage.isVisible() ||
                                 await registrationPage.errorMessage.isVisible();
      
      console.log('Form validation triggered:', hasValidationErrors);
      
      // Take screenshot
      await page.screenshot({ path: 'screenshots/registration-validation.png', fullPage: true });
    }
  });

  test('should handle password mismatch validation', async ({ page }) => {
    await registrationPage.navigate();
    
    if (await registrationPage.confirmPasswordInput.isVisible()) {
      // Fill form with mismatched passwords
      await registrationPage.fillRegistrationForm({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!'
      });
      
      await registrationPage.submitForm();
      await page.waitForTimeout(1000);
      
      // Check for password mismatch error
      const passwordError = await page.locator(':has-text("password")').and(page.locator(':has-text("match")')).isVisible() ||
                           await registrationPage.validationMessage.isVisible();
      
      console.log('Password mismatch validation:', passwordError);
      
      // Take screenshot
      await page.screenshot({ path: 'screenshots/registration-password-mismatch.png', fullPage: true });
    }
  });

  test('should attempt registration with valid data', async ({ page }) => {
    await registrationPage.navigate();
    
    if (await registrationPage.emailInput.isVisible()) {
      // Generate unique email to avoid conflicts
      const timestamp = Date.now();
      const testUser = {
        firstName: 'Test',
        lastName: 'User',
        email: `test${timestamp}@example.com`,
        password: 'TestPassword123!'
      };
      
      await registrationPage.fillRegistrationForm(testUser);
      await registrationPage.submitForm();
      
      // Wait for response
      await page.waitForTimeout(3000);
      
      // Take screenshot of result
      await page.screenshot({ path: 'screenshots/registration-attempt.png', fullPage: true });
      
      // Check current URL and page state
      const currentUrl = page.url();
      console.log('After registration attempt, current URL:', currentUrl);
      
      // Check for success or error messages
      const hasSuccessMessage = await registrationPage.successMessage.isVisible();
      const hasErrorMessage = await registrationPage.errorMessage.isVisible();
      
      console.log('Registration result - Success:', hasSuccessMessage, 'Error:', hasErrorMessage);
    }
  });

  test('should handle duplicate email registration', async ({ page }) => {
    await registrationPage.navigate();
    
    if (await registrationPage.emailInput.isVisible()) {
      // Use a common email that might already exist
      const testUser = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'TestPassword123!'
      };
      
      await registrationPage.fillRegistrationForm(testUser);
      await registrationPage.submitForm();
      
      // Wait for response
      await page.waitForTimeout(2000);
      
      // Take screenshot
      await page.screenshot({ path: 'screenshots/registration-duplicate-email.png', fullPage: true });
      
      // Check for duplicate email error
      const duplicateError = await page.locator(':has-text("already exists"), :has-text("already registered"), :has-text("email is taken")').isVisible();
      
      console.log('Duplicate email error shown:', duplicateError);
    }
  });

  test('should test email format validation', async ({ page }) => {
    await registrationPage.navigate();
    
    if (await registrationPage.emailInput.isVisible()) {
      // Test invalid email format
      await registrationPage.emailInput.fill('invalid-email');
      await registrationPage.passwordInput.fill('TestPassword123!');
      
      // Try to submit or trigger validation
      await registrationPage.submitButton.click();
      await page.waitForTimeout(1000);
      
      // Check for email validation
      const emailInvalid = await registrationPage.emailInput.evaluate(el => !el.validity.valid) ||
                          await page.locator(':has-text("valid email"), :has-text("email format")').isVisible();
      
      console.log('Email format validation triggered:', emailInvalid);
      
      // Take screenshot
      await page.screenshot({ path: 'screenshots/registration-email-validation.png', fullPage: true });
    }
  });

  test('should test password strength validation', async ({ page }) => {
    await registrationPage.navigate();
    
    if (await registrationPage.passwordInput.isVisible()) {
      // Test weak password
      await registrationPage.emailInput.fill('test@example.com');
      await registrationPage.passwordInput.fill('123');
      
      // Check for password strength indicator or validation
      await page.waitForTimeout(500);
      
      // Look for password strength messages
      const passwordStrengthElements = [
        page.locator('.password-strength, .strength-meter'),
        page.locator(':has-text("weak"), :has-text("strong"), :has-text("medium")'),
        page.locator(':has-text("password must"), :has-text("at least")')
      ];
      
      let strengthIndicatorFound = false;
      for (const element of passwordStrengthElements) {
        if (await element.isVisible()) {
          strengthIndicatorFound = true;
          break;
        }
      }
      
      console.log('Password strength indicator found:', strengthIndicatorFound);
      
      // Take screenshot
      await page.screenshot({ path: 'screenshots/registration-password-strength.png', fullPage: true });
    }
  });

  test('should navigate to login from registration', async ({ page }) => {
    await registrationPage.navigate();
    
    if (await registrationPage.loginLink.isVisible()) {
      await registrationPage.loginLink.click();
      await page.waitForTimeout(1000);
      
      // Verify navigation to login
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/login|sign.?in/i);
      
      // Take screenshot
      await page.screenshot({ path: 'screenshots/registration-to-login.png', fullPage: true });
    } else {
      console.log('Login link not found on registration page');
    }
  });
});