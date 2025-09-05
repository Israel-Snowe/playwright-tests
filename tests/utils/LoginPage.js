const { expect } = require('@playwright/test');
const { BasePage } = require('../utils/BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators for login page elements
    this.emailInput = page.locator('input[type="email"], input[name="email"], #email');
    this.passwordInput = page.locator('input[type="password"], input[name="password"], #password');
    this.loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign in")');
    this.signUpLink = page.locator('a:has-text("Sign up"), a:has-text("Register"), a:has-text("Create account")');
    this.forgotPasswordLink = page.locator('a:has-text("Forgot password"), a:has-text("Reset password")');
    this.errorMessage = page.locator('.error, .alert-danger, [role="alert"]');
    this.successMessage = page.locator('.success, .alert-success, [role="status"]');
  }

  async navigate() {
    await super.navigate('/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async isLoginFormVisible() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async expectLoginError(message) {
    await expect(this.errorMessage).toBeVisible();
    if (message) {
      await expect(this.errorMessage).toContainText(message);
    }
  }

  async expectLoginSuccess() {
    // Wait for redirect or success indicator
    await this.page.waitForURL(url => !url.includes('/login'));
  }
}

module.exports = { LoginPage };