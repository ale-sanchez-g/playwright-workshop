# Playwright Workshop - TypeScript Version

This is the TypeScript version of the Playwright workshop examples. The project demonstrates various testing capabilities of Playwright including:

1. **Network Interception & API Mocking**
   - Intercepting network requests
   - Mocking API responses

2. **Visual Testing**
   - Screenshot comparisons 
   - Visual regression testing with difference highlighting

3. **Browser Context Isolation**
   - Running isolated browser contexts
   - Managing state between contexts
   - Reusing authentication states

4. **CI/CD Integration**
   - Parallel test execution
   - Video recording
   - Error reporting and screenshots

## Requirements

- Node.js 16+ 
- npm or yarn

## Installation

```bash
# Install dependencies
npm install
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test
npx playwright test pw-test.spec.ts

# Run in headed mode (to see the browser)
npx playwright test --headed

# Run with debug mode
npx playwright test --debug
```

## Project Structure

- `pw-test.spec.ts` - Main test file with all examples
- `playwright.config.ts` - Playwright configuration

## Key Features Demonstrated

- API mocking and request interception
- Visual comparison testing with highlighted differences
- Browser context isolation for parallel testing
- Handling of multiple user sessions
- Storage state management
- CI/CD pipeline integration
