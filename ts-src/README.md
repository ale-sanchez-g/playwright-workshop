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

4. **Accessibility Testing with ARIA Snapshots**
   - Testing page accessibility using ARIA snapshots
   - Validating navigation menu accessibility structure
   - Ensuring proper semantic markup and roles

5. **CI/CD Integration**
   - Parallel test execution
   - Video recording
   - Error reporting and screenshots

6. **Playwright MCP**
   - Connect MCP to VSCode and Github Copilot
   - Generate a Black box test cases

```txt
Using the Playwright MCP navigate to https://devops1.com.au
- Expand to a Desktop viewport
- And you Click on the contact us button
- Then you are redirected to the contact us form
- And when you fill the form with with all the relevant details
- Then you are ready to submit the form

After this flow create a new file pw.mcp.spec.ts and create the same test
using playwright to execute in my CI/CD tool later
```

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

# Run accessibility tests
npx playwright test accesibility.spec.ts

# Run in headed mode (to see the browser)
npx playwright test --headed

# Run with debug mode
npx playwright test --debug
```

## Project Structure

- `pw-test.spec.ts` - Main test file with all examples
- `accesibility.spec.ts` - Accessibility tests using ARIA snapshots
- `playwright.config.ts` - Playwright configuration

## Key Features Demonstrated

- API mocking and request interception
- Visual comparison testing with highlighted differences
- Browser context isolation for parallel testing
- Handling of multiple user sessions
- Storage state management
- ARIA snapshot testing for accessibility validation
- CI/CD pipeline integration
- Playwright MCP with Github Copilot (ts only)
