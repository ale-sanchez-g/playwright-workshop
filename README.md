# Playwright Workshop - Python & TypeScript

Welcome to the 2025 Testing Talk Conference Playwright Workshop! This repository contains examples of automated testing using Playwright in both Python and TypeScript implementations.

## Project Structure

This project is organized with two separate implementations:

- `src/` - Contains the Python implementation
- `ts-src/` - Contains the TypeScript implementation

Both implementations demonstrate the same test examples and concepts, just using different programming languages.

## Key Testing Concepts Demonstrated

### 1. Mocking and Network Interception
- Intercept API requests and provide mock responses
- Monitor network traffic in both directions
- Verify specific API calls are made when user actions occur
- Validate that mocked data appears correctly in the UI

### 2. Visual Validations
- Taking full-page and element-specific screenshots
- Setting up consistent viewport sizes for reproducible visual tests
- Comparing screenshots against baseline images
- Generating and saving visual difference images for inspection

### 3. Browser Context Isolation
- Creating multiple isolated browser contexts
- Testing with different user accounts simultaneously
- Saving and reusing authentication states
- Demonstrating that actions in one context don't affect others

### 4. Enhancing CI/CD Pipeline
- Run multiple tests in parallel for faster feedback
- Record videos of test runs for debugging failures
- Take screenshots on test failures
- Structure test results for CI/CD integration
- Handle exceptions properly for reliable reporting

## Python Implementation (src/)

### Requirements
- Python 3.8+
- pip

### Setup and Running Tests

```bash
# Ensure you have Python installed
python3 --version

# Create and activate a virtual environment (recommended)
python3 -m venv playwright-venv
source playwright-venv/bin/activate

# Navigate to the source code directory
cd src/

# Install Requirements
pip install -r requirements.txt

# Install browser binaries
playwright install

# Run the tests
python pw-test.py
```

## TypeScript Implementation (ts-src/)

### Requirements
- Node.js 16+
- npm

### Setup and Running Tests

```bash
# Navigate to the TypeScript source directory
cd ts-src/

# Install dependencies
npm install

# Install browser binaries
npm run install-browsers
# or
npx playwright install

# Run the tests
npm test
# or use one of the convenience scripts
npm run test:headed  # run with browser visible
npm run test:debug   # run in debug mode
npm run test:ui      # run with Playwright UI

# Alternatively, use the shell script which handles installation and execution
./run-tests.sh
```

## Choosing Between Python and TypeScript

### Python Advantages
- Simple syntax, easier for beginners
- Great for quick prototyping
- Excellent for data-oriented testing
- Strong integration with data science tools

### TypeScript Advantages
- Static typing helps catch errors early
- Better IDE support and code completion
- Native integration with web technologies
- Robust package ecosystem for web testing
- Better performance for large test suites

## Additional Resources

- [Playwright Python Documentation](https://playwright.dev/python/docs/intro)
- [Playwright TypeScript Documentation](https://playwright.dev/docs/intro)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Playwright GitHub Repository](https://github.com/microsoft/playwright)

