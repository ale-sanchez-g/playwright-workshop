#!/bin/bash

# Script to install dependencies and run the TypeScript version of Playwright tests

# Navigate to the TypeScript project directory
cd "$(dirname "$0")"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Install browsers if not already installed
if [ ! -d "$(pwd)/node_modules/.cache/playwright" ]; then
    echo "Installing Playwright browsers..."
    npx playwright install
fi

# Run tests
echo "Running Playwright tests..."
npx playwright test

# Check exit code
if [ $? -eq 0 ]; then
    echo "✅ All tests completed successfully!"
else
    echo "❌ Some tests failed. Check the output above for more details."
fi
