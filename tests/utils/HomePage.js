const { expect } = require('@playwright/test');
const { BasePage } = require('../utils/BasePage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    
    // Navigation elements
    this.mainNav = page.locator('nav, .navbar, .navigation');
    this.logo = page.locator('.logo, [alt*="logo"], [alt*="Certicraft"]');
    this.userMenu = page.locator('.user-menu, .profile-menu, .account-menu');
    this.logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout"), button:has-text("Sign out")');
    
    // Main content areas
    this.dashboardTitle = page.locator('h1, .page-title, .dashboard-title');
    this.searchBox = page.locator('input[type="search"], input[placeholder*="search"], #search');
    this.certificatesSection = page.locator('.certificates, #certificates, [data-testid="certificates"]');
    
    // Common action buttons
    this.createButton = page.locator('button:has-text("Create"), button:has-text("Add"), .btn-create');
    this.viewAllButton = page.locator('button:has-text("View All"), a:has-text("View All")');
  }

  async navigate() {
    await super.navigate('/');
  }

  async isUserLoggedIn() {
    // Check for elements that indicate user is logged in
    return await this.userMenu.isVisible() || 
           await this.logoutButton.isVisible() ||
           await this.page.locator('.dashboard, .user-dashboard').isVisible();
  }

  async logout() {
    if (await this.userMenu.isVisible()) {
      await this.userMenu.click();
    }
    await this.logoutButton.click();
  }

  async searchCertificates(searchTerm) {
    await this.searchBox.fill(searchTerm);
    await this.searchBox.press('Enter');
  }

  async navigateToCertificates() {
    await this.certificatesSection.click();
  }

  async expectWelcomeMessage() {
    // Look for common welcome messages
    const welcomeLocators = [
      this.page.locator(':has-text("Welcome")'),
      this.page.locator(':has-text("Dashboard")'),
      this.page.locator(':has-text("Home")')
    ];
    
    let found = false;
    for (const locator of welcomeLocators) {
      if (await locator.isVisible()) {
        found = true;
        break;
      }
    }
    
    expect(found).toBeTruthy();
  }
}

module.exports = { HomePage };