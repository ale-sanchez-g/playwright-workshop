# playwright-workshop
This is the 2025 testing talk conference Playwright Workshop


## Install the
```sh
# Ensure you have Python installed (3.8+ recommended)
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
```

1. Mocking and Network Interception
The first example demonstrates how to:

Intercept API requests and provide mock responses
Monitor network traffic in both directions
Verify specific API calls are made when user actions occur
Validate that mocked data appears correctly in the UI

2. Visual Validations
The visual validation example shows:

Taking full-page and element-specific screenshots
Setting up consistent viewport sizes for reproducible visual tests
Comparing screenshots against baseline images
Generating and saving visual difference images for inspection

3. Browser Context Isolation
This example illustrates:

Creating multiple isolated browser contexts
Testing with different user accounts simultaneously
Saving and reusing authentication states
Demonstrating that actions in one context don't affect others

4. Enhancing CI/CD Pipeline
The CI/CD example shows how to:

Run multiple tests in parallel for faster feedback
Record videos of test runs for debugging failures
Take screenshots on test failures
Structure test results for CI/CD integration
Handle exceptions properly for reliable reporting