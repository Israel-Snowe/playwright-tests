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
If you encounter browser installation issues, try:
```bash
npx playwright install --force
```

### Test Failures
1. Check the HTML report: `npm run report`
2. Review screenshots in the `screenshots/` directory
3. Check the console output for error messages
4. Verify the base URL is correct

### Environment Issues
- Ensure the Certicraft application is accessible
- Check network connectivity
- Verify environment variables are set correctly

## Notes

- Tests are designed to be resilient and handle various page structures
- Screenshots are taken for manual verification of visual elements
- Tests include fallback strategies for different UI implementations
- Mobile responsive testing is included for key flows