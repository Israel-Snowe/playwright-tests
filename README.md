# Certicraft Automation Tests

This repository contains automated end-to-end tests for Certicraft using Playwright. The tests cover simple user flows including authentication, navigation, and certificate management.

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd playwright-tests
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npm run install-browsers
```

## Test Structure

The tests are organized into the following directories:

- `tests/auth/` - Authentication related tests (login, registration)
- `tests/navigation/` - Navigation and UI flow tests
- `tests/certificates/` - Certificate management functionality tests
- `tests/utils/` - Page object models and utility classes

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (with browser UI)
```bash
npm run test:headed
```

### Run tests with debug mode
```bash
npm run test:debug
```

### Run tests with UI mode (interactive)
```bash
npm run test:ui
```

### Run specific test suites
```bash
# Authentication tests only
npm run test:auth

# Navigation tests only
npm run test:navigation

# Certificate tests only
npm run test:certificates

# Demo flow (comprehensive example)
npx playwright test tests/demo-flow.spec.js
```

### View test reports
```bash
npm run report
```

## Test Coverage

### Authentication Flow Tests
- Login form validation
- Invalid credentials handling
- Registration form validation
- Password strength validation
- Email format validation
- Navigation between login/registration pages

### Navigation Flow Tests
- Homepage loading
- Main navigation elements
- Search functionality
- Responsive navigation (mobile)
- Error page handling
- Basic accessibility checks

### Certificate Management Tests
- Certificates page loading
- Certificate listing/empty state
- Search and filtering
- Certificate creation flow
- Certificate viewing
- Certificate actions (view, edit, download, delete)
- Pagination

### Demo Flow Tests
- Complete end-to-end user journey
- Mobile responsive testing
- Visual regression testing with screenshots
- Error handling demonstration

## Configuration

The test configuration is defined in `playwright.config.js`. Key settings include:

- **Base URL**: Set via `BASE_URL` environment variable (defaults to `https://certicraft.com`)
- **Browsers**: Tests run on Chromium, Firefox, WebKit, and mobile viewports
- **Screenshots**: Taken on test failures
- **Videos**: Recorded on test failures
- **Traces**: Collected on retry

### Environment Variables

- `BASE_URL`: The base URL for the Certicraft application
- `CI`: Set to enable CI-specific behavior (retries, workers)

## Page Object Model

The tests use the Page Object Model pattern for better maintainability:

- `BasePage`: Common functionality for all pages
- `LoginPage`: Login page interactions
- `HomePage`: Homepage and dashboard interactions
- `CertificatesPage`: Certificate management interactions
- `RegistrationPage`: User registration interactions

## Screenshots

Test screenshots are saved to the `screenshots/` directory and include:

- Form validations
- Error states
- Successful operations
- Navigation states
- Mobile responsive views

## Contributing

When adding new tests:

1. Follow the existing Page Object Model pattern
2. Add appropriate screenshots for verification
3. Include both positive and negative test cases
4. Update this README if adding new test categories

## Troubleshooting

### Browser Installation Issues
Browser installation can fail in CI environments or with network restrictions. Try these solutions:

```bash
# Force reinstall all browsers
npx playwright install --force

# Install only Chromium (smaller download)
npx playwright install chromium

# Install browsers with dependencies (Linux)
npx playwright install-deps
npx playwright install
```

If browser installation continues to fail:
1. Check network connectivity and proxy settings
2. Try running in a different environment
3. Use Docker with pre-installed browsers
4. Contact your system administrator about firewall/proxy settings

### Test Failures
1. **Check the HTML report**: `npm run report`
2. **Review screenshots**: Check the `screenshots/` directory for visual debugging
3. **Console output**: Look for error messages and network failures
4. **Verify base URL**: Ensure `BASE_URL` environment variable is correct
5. **Browser compatibility**: Try different browsers with `--project=chromium` or `--project=firefox`

### Environment Issues
- **Application accessibility**: Ensure the Certicraft application is running and accessible
- **Network connectivity**: Check firewall rules and DNS resolution
- **Environment variables**: Verify `BASE_URL` and other configuration
- **Permissions**: Ensure write permissions for screenshots and reports

### Common Error Solutions

**"Executable doesn't exist" error**:
```bash
npm run install-browsers
```

**Timeout errors**:
- Increase timeout in `playwright.config.js`
- Check network speed and stability
- Verify application responsiveness

**Element not found errors**:
- Check if selectors match the actual application
- Review screenshots to see current page state
- Update selectors in page objects if UI has changed

### Running in CI/CD
For continuous integration environments:
```bash
# Install dependencies first
npm ci

# Install browsers with system dependencies
npx playwright install-deps
npx playwright install

# Run tests with CI configuration
CI=true npm test
```

## Notes

- Tests are designed to be resilient and handle various page structures
- Screenshots are taken for manual verification of visual elements
- Tests include fallback strategies for different UI implementations
- Mobile responsive testing is included for key flows