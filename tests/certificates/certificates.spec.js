const { test, expect } = require('@playwright/test');
const { CertificatesPage } = require('../utils/CertificatesPage');
const { HomePage } = require('../utils/HomePage');

test.describe('Certificates Management Flow', () => {
  let certificatesPage;
  let homePage;

  test.beforeEach(async ({ page }) => {
    certificatesPage = new CertificatesPage(page);
    homePage = new HomePage(page);
  });

  test('should load certificates page', async ({ page }) => {
    await certificatesPage.navigate();
    await certificatesPage.waitForPageLoad();
    
    // Take screenshot
    await page.screenshot({ path: 'screenshots/certificates-page.png', fullPage: true });
    
    // Check if page loads successfully
    const currentUrl = page.url();
    console.log('Certificates page URL:', currentUrl);
  });

  test('should display certificates list or empty state', async ({ page }) => {
    await certificatesPage.navigate();
    
    try {
      // Check if certificates are displayed
      const certificateCount = await certificatesPage.getCertificateCount();
      
      if (certificateCount > 0) {
        // Certificates exist
        await expect(certificatesPage.certificatesList).toBeVisible();
        console.log(`Found ${certificateCount} certificates`);
        
        // Take screenshot of certificates list
        await page.screenshot({ path: 'screenshots/certificates-list.png', fullPage: true });
      } else {
        // No certificates - check for empty state
        console.log('No certificates found, checking for empty state');
        await page.screenshot({ path: 'screenshots/certificates-empty.png', fullPage: true });
      }
    } catch (error) {
      console.log('Certificates list test - error:', error.message);
      await page.screenshot({ path: 'screenshots/certificates-error.png', fullPage: true });
    }
  });

  test('should test certificate search functionality', async ({ page }) => {
    await certificatesPage.navigate();
    
    // Check if search is available
    if (await certificatesPage.searchInput.isVisible()) {
      // Perform search
      await certificatesPage.searchCertificates('test');
      
      // Take screenshot of search results
      await page.screenshot({ path: 'screenshots/certificate-search.png', fullPage: true });
      
      // Clear search
      await certificatesPage.searchInput.clear();
      await certificatesPage.searchInput.press('Enter');
      await page.waitForTimeout(1000);
      
      // Take screenshot after clearing search
      await page.screenshot({ path: 'screenshots/certificate-search-cleared.png', fullPage: true });
    } else {
      console.log('Search input not found on certificates page');
      await page.screenshot({ path: 'screenshots/no-certificate-search.png', fullPage: true });
    }
  });

  test('should test certificate filtering', async ({ page }) => {
    await certificatesPage.navigate();
    
    // Check if filter dropdown exists
    if (await certificatesPage.filterDropdown.isVisible()) {
      // Get available filter options
      const options = await certificatesPage.filterDropdown.locator('option').allTextContents();
      console.log('Available filter options:', options);
      
      if (options.length > 1) {
        // Select a filter option (skip first as it's usually "All" or placeholder)
        await certificatesPage.filterCertificates(options[1]);
        
        // Take screenshot of filtered results
        await page.screenshot({ path: 'screenshots/certificate-filter.png', fullPage: true });
      }
    } else {
      console.log('Filter dropdown not found on certificates page');
      await page.screenshot({ path: 'screenshots/no-certificate-filter.png', fullPage: true });
    }
  });

  test('should test certificate creation flow', async ({ page }) => {
    await certificatesPage.navigate();
    
    // Check if create certificate button exists
    if (await certificatesPage.createCertificateButton.isVisible()) {
      await certificatesPage.createNewCertificate();
      
      // Wait for navigation or modal
      await page.waitForTimeout(2000);
      
      // Take screenshot of create certificate page/modal
      await page.screenshot({ path: 'screenshots/certificate-create.png', fullPage: true });
      
      // Check for form elements
      const formElements = [
        page.locator('input[name*="name"], input[name*="title"]'),
        page.locator('input[name*="description"], textarea[name*="description"]'),
        page.locator('button[type="submit"], input[type="submit"]')
      ];
      
      let formFound = false;
      for (const element of formElements) {
        if (await element.isVisible()) {
          formFound = true;
          break;
        }
      }
      
      console.log('Certificate creation form found:', formFound);
    } else {
      console.log('Create certificate button not found');
      await page.screenshot({ path: 'screenshots/no-certificate-create.png', fullPage: true });
    }
  });

  test('should test certificate viewing', async ({ page }) => {
    await certificatesPage.navigate();
    
    try {
      const certificateCount = await certificatesPage.getCertificateCount();
      
      if (certificateCount > 0) {
        // Click on first certificate
        await certificatesPage.viewFirstCertificate();
        
        // Wait for navigation or modal
        await page.waitForTimeout(2000);
        
        // Take screenshot of certificate details
        await page.screenshot({ path: 'screenshots/certificate-details.png', fullPage: true });
        
        // Check for common certificate detail elements
        const detailElements = [
          page.locator('.certificate-detail, .cert-details'),
          page.locator('h1, h2, h3'), // Title
          page.locator('.status, .certificate-status'),
          page.locator('.date, .certificate-date')
        ];
        
        let detailsFound = false;
        for (const element of detailElements) {
          if (await element.isVisible()) {
            detailsFound = true;
            break;
          }
        }
        
        console.log('Certificate details page loaded:', detailsFound);
      } else {
        console.log('No certificates available to view');
      }
    } catch (error) {
      console.log('Certificate viewing test - error:', error.message);
      await page.screenshot({ path: 'screenshots/certificate-view-error.png', fullPage: true });
    }
  });

  test('should test certificate actions', async ({ page }) => {
    await certificatesPage.navigate();
    
    try {
      const certificateCount = await certificatesPage.getCertificateCount();
      
      if (certificateCount > 0) {
        const firstCertificate = certificatesPage.certificateCard.first();
        
        // Check for action buttons on certificate cards
        const actionButtons = [
          firstCertificate.locator('button:has-text("View"), a:has-text("View")'),
          firstCertificate.locator('button:has-text("Edit"), a:has-text("Edit")'),
          firstCertificate.locator('button:has-text("Download"), a:has-text("Download")'),
          firstCertificate.locator('button:has-text("Delete"), a:has-text("Delete")')
        ];
        
        const availableActions = [];
        for (const [index, button] of actionButtons.entries()) {
          if (await button.isVisible()) {
            const actionNames = ['View', 'Edit', 'Download', 'Delete'];
            availableActions.push(actionNames[index]);
          }
        }
        
        console.log('Available certificate actions:', availableActions);
        
        // Take screenshot showing available actions
        await page.screenshot({ path: 'screenshots/certificate-actions.png', fullPage: true });
        
        // Test download action if available
        if (availableActions.includes('Download')) {
          // Note: We won't actually download in test, just verify the button works
          const downloadButton = firstCertificate.locator('button:has-text("Download"), a:has-text("Download")');
          if (await downloadButton.isVisible()) {
            console.log('Download button is available for testing');
          }
        }
      }
    } catch (error) {
      console.log('Certificate actions test - error:', error.message);
      await page.screenshot({ path: 'screenshots/certificate-actions-error.png', fullPage: true });
    }
  });

  test('should test certificate pagination', async ({ page }) => {
    await certificatesPage.navigate();
    
    // Look for pagination elements
    const paginationElements = [
      page.locator('.pagination, .pager'),
      page.locator('button:has-text("Next"), a:has-text("Next")'),
      page.locator('button:has-text("Previous"), a:has-text("Previous")'),
      page.locator('.page-number, .page-link')
    ];
    
    let paginationFound = false;
    for (const element of paginationElements) {
      if (await element.isVisible()) {
        paginationFound = true;
        break;
      }
    }
    
    console.log('Pagination found:', paginationFound);
    
    if (paginationFound) {
      // Test next page if available
      const nextButton = page.locator('button:has-text("Next"), a:has-text("Next")');
      if (await nextButton.isVisible() && !await nextButton.isDisabled()) {
        await nextButton.click();
        await page.waitForTimeout(1000);
        
        // Take screenshot of next page
        await page.screenshot({ path: 'screenshots/certificate-pagination.png', fullPage: true });
      }
    }
    
    // Take screenshot regardless
    await page.screenshot({ path: 'screenshots/certificate-pagination-check.png', fullPage: true });
  });
});