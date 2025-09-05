const { expect } = require('@playwright/test');
const { BasePage } = require('../utils/BasePage');

class CertificatesPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Page elements
    this.pageTitle = page.locator('h1:has-text("Certificate"), .page-title');
    this.certificatesList = page.locator('.certificates-list, .certificate-grid, .certificates');
    this.certificateCard = page.locator('.certificate-card, .certificate-item, .cert-item');
    
    // Actions
    this.createCertificateButton = page.locator('button:has-text("Create Certificate"), .btn-create-cert');
    this.searchInput = page.locator('input[placeholder*="search"], input[type="search"]');
    this.filterDropdown = page.locator('select[name="filter"], .filter-dropdown');
    
    // Certificate details
    this.certificateTitle = page.locator('.cert-title, .certificate-name, h3');
    this.certificateStatus = page.locator('.cert-status, .certificate-status, .status');
    this.certificateDate = page.locator('.cert-date, .certificate-date, .date');
    
    // Actions on certificates
    this.viewButton = page.locator('button:has-text("View"), a:has-text("View Details")');
    this.editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")');
    this.deleteButton = page.locator('button:has-text("Delete"), .btn-delete');
    this.downloadButton = page.locator('button:has-text("Download"), a:has-text("Download")');
  }

  async navigate() {
    await super.navigate('/certificates');
  }

  async searchCertificates(searchTerm) {
    await this.searchInput.fill(searchTerm);
    await this.searchInput.press('Enter');
    await this.waitForPageLoad();
  }

  async filterCertificates(filterValue) {
    if (await this.filterDropdown.isVisible()) {
      await this.filterDropdown.selectOption(filterValue);
      await this.waitForPageLoad();
    }
  }

  async getCertificateCount() {
    return await this.certificateCard.count();
  }

  async viewFirstCertificate() {
    await this.certificateCard.first().click();
  }

  async createNewCertificate() {
    await this.createCertificateButton.click();
  }

  async expectCertificatesPageLoaded() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.certificatesList).toBeVisible();
  }

  async expectCertificateExists(certificateName) {
    const certificate = this.page.locator(`.certificate-card:has-text("${certificateName}")`);
    await expect(certificate).toBeVisible();
  }

  async expectNoCertificatesMessage() {
    const noResultsMessages = [
      this.page.locator(':has-text("No certificates found")'),
      this.page.locator(':has-text("No results")'),
      this.page.locator('.empty-state, .no-data')
    ];
    
    let found = false;
    for (const locator of noResultsMessages) {
      if (await locator.isVisible()) {
        found = true;
        break;
      }
    }
    
    expect(found).toBeTruthy();
  }
}

module.exports = { CertificatesPage };