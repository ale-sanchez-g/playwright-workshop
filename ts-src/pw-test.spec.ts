// 1. Mocking and Network Interception

import { test, expect, chromium, Page, Browser, BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { createCanvas, loadImage, Image, ImageData } from 'canvas';

// 1. Mocking and Network Interception
test('network interception', async ({ page }) => {
  /**
   * Example demonstrating API mocking and network interception.
   * This test intercepts a request to a products API and mocks the response.
   */
  
  // Set up request interception for a specific API endpoint
  await page.route('**/assets/manifest/projects.json', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      projects: [
        {
          "project-industry": "MOCKED SECTOR",
          "project-title": "SUPREME COURT OF MCP",
          "project-image": "/assets/img/public-sector.jpg",
          "view-project-url": "/#"
        }
      ]
    })
  }));

  // Navigate to page that makes API requests
  await page.goto('https://devops1.com.au/projects/');
  
  // Wait for network to be idle
  await page.waitForLoadState('networkidle');
  
  try {
    // Go to Mocked card
    await page.locator('.project-card').hover();
    // Take a screenshot for verification
    await page.screenshot({ path: 'card_screenshot.png' });
  } catch (e) {
    // Take screenshot on failure for debugging
    await page.screenshot({ path: 'error_screenshot.png' });
    console.log(`Error occurred: ${e}`);
  }
});

// 2. Visual Validations
test('visual validation', async ({ browser }) => {
  /**
   * Example of validation using accessibility snapshots instead of pixel-perfect comparisons.
   */
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();

  // Navigate to the page
  await page.goto('https://devops1.com.au/projects/');
  
  // Wait for the page to be visually stable
  await page.waitForLoadState('networkidle');
  
  // Scroll to the first card
  const firstCard = page.locator('.project-card').first();
  await firstCard.scrollIntoViewIfNeeded();

  // if no baseline image is available in the file system, create one
  const baselinePath = path.join(__dirname, 'baseline_first_card_screenshot.png');
  if (!fs.existsSync(baselinePath)) {
    await firstCard.screenshot({ path: baselinePath });
  }

  // Take a screenshot of the first card for visual validation
  const actualPath = path.join(__dirname, 'first_card_screenshot.png');
  await firstCard.screenshot({ path: actualPath });
  console.log('Screenshot of the first card taken.');

  // Compare the images using the helper function
  const isMatching = await compareImages(baselinePath, actualPath);
  expect(isMatching).toBeTruthy();
});

// Helper function for image comparison
async function compareImages(baselinePath: string, actualPath: string): Promise<boolean> {
  if (!fs.existsSync(baselinePath)) {
    console.log(`Baseline image ${baselinePath} does not exist. Creating it now.`);
    fs.renameSync(actualPath, baselinePath);
    return true;
  }
  
  // Load both images
  const baseline = await loadImage(baselinePath);
  const actual = await loadImage(actualPath);
  
  // Check if images have the same size
  if (baseline.width !== actual.width || baseline.height !== actual.height) {
    console.log(`Image size mismatch: ${baseline.width}x${baseline.height} vs ${actual.width}x${actual.height}`);
    return false;
  }
  
  // Create canvas to compare images
  const canvas = createCanvas(baseline.width, baseline.height);
  const ctx = canvas.getContext('2d');
  
  // Draw baseline image
  ctx.drawImage(baseline, 0, 0);
  const baselineData = ctx.getImageData(0, 0, baseline.width, baseline.height).data;
  
  // Draw actual image
  ctx.clearRect(0, 0, baseline.width, baseline.height);
  ctx.drawImage(actual, 0, 0);
  const actualData = ctx.getImageData(0, 0, baseline.width, baseline.height).data;
  
  // Compare pixel data
  let diffFound = false;
  const diffCanvas = createCanvas(baseline.width, baseline.height);
  const diffCtx = diffCanvas.getContext('2d');
  diffCtx.fillStyle = 'rgba(0, 0, 0, 0)';
  diffCtx.fillRect(0, 0, baseline.width, baseline.height);
  
  for (let i = 0; i < baselineData.length; i += 4) {
    const r1 = baselineData[i];
    const g1 = baselineData[i + 1];
    const b1 = baselineData[i + 2];
    const a1 = baselineData[i + 3];
    
    const r2 = actualData[i];
    const g2 = actualData[i + 1];
    const b2 = actualData[i + 2];
    const a2 = actualData[i + 3];
    
    // Calculate difference threshold
    const diff = Math.sqrt(
      Math.pow(r1 - r2, 2) +
      Math.pow(g1 - g2, 2) +
      Math.pow(b1 - b2, 2) +
      Math.pow(a1 - a2, 2)
    );
    
    // If difference is above threshold, mark it
    if (diff > 30) {
      diffFound = true;
      const x = (i / 4) % baseline.width;
      const y = Math.floor((i / 4) / baseline.width);
      
      // Mark the difference in red
      diffCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      diffCtx.fillRect(x, y, 1, 1);
    }
  }
  
  if (diffFound) {
    // Save the highlighted diff image
    const highlightedDiffStream = diffCanvas.createPNGStream();
    const highlightedDiffOut = fs.createWriteStream('diff_highlighted.png');
    highlightedDiffStream.pipe(highlightedDiffOut);
    
    // Also save the raw diff for technical analysis
    const diffImage = createCanvas(baseline.width, baseline.height);
    const diffImageCtx = diffImage.getContext('2d');
    
    // Overlay actual with diff
    diffImageCtx.drawImage(actual, 0, 0);
    diffImageCtx.drawImage(diffCanvas, 0, 0);
    
    const rawDiffStream = diffImage.createPNGStream();
    const rawDiffOut = fs.createWriteStream('diff_raw.png');
    rawDiffStream.pipe(rawDiffOut);
    
    console.log('Images differ - see diff_highlighted.png for visualization');
    return false;
  }
  
  console.log('Images are identical');
  return true;
}

// 3. Browser Context Isolation
test('browser context isolation', async ({ browser }) => {
  /**
   * Example demonstrating browser context isolation for parallel testing.
   */
  
  // Create two isolated browser contexts
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();
  
  // Create pages in each context
  const page1 = await context1.newPage();
  const page2 = await context2.newPage();
  
  // Set different storage states
  await page1.goto('https://www.saucedemo.com/');
  await page1.fill('#user-name', 'standard_user');
  await page1.fill('#password', 'secret_sauce');
  await page1.click('#login-button');
  await page1.waitForSelector('.app_logo');
  await page1.click('#add-to-cart-sauce-labs-backpack');
  
  // Save storage state (cookies, local storage)
  const storageState1 = await context1.storageState();
  
  // Different user in the second context
  await page2.goto('https://www.saucedemo.com/');
  await page2.fill('#user-name', 'problem_user');
  await page2.fill('#password', 'secret_sauce');
  await page2.click('#login-button');
  await page2.waitForSelector('.app_logo');
  await page2.click('#add-to-cart-sauce-labs-bike-light');
  
  // Demonstrate isolation - actions in one context don't affect the other
  await page1.goto('https://www.saucedemo.com/cart.html');
  // Screenshot of the cart in context1
  await page1.screenshot({ path: 'cart_context1.png' });
  
  await page2.goto('https://www.saucedemo.com/cart.html');
  // Screenshot of the cart in context2
  await page2.screenshot({ path: 'cart_context2.png' });
  
  // Create a new context with saved storage state (for CI/CD reuse)
  const context3 = await browser.newContext({ storageState: storageState1 });
  const page3 = await context3.newPage();
  await page3.goto('https://www.saucedemo.com/cart.html');
  // Screenshot of the cart in context3
  await page3.screenshot({ path: 'cart_context3.png' });
});

// 4. Page Navigation Tests
test('homepage navigation', async ({ page }) => {
  await page.goto('https://devops1.com.au/');
  await expect(page.locator('text=Anticipate is the first line of defence')).toBeVisible();
  expect(await page.title()).toContain('DevOps1');
});

test('projects page navigation', async ({ page }) => {
  await page.goto('https://devops1.com.au/projects/');
  await expect(page.locator('text=Featured Projects')).toBeVisible();
  expect(await page.title()).toContain('DevOps1');
});

test('about page navigation', async ({ page }) => {
  await page.goto('https://devops1.com.au/about/');
  await expect(page.locator('text=We are technology obsessed')).toBeVisible();
  expect(await page.title()).toContain('DevOps1');
});

test('services page navigation', async ({ page }) => {
  await page.goto('https://devops1.com.au/services/');
  await expect(page.locator('text=Uplifting engineering practices')).toBeVisible();
  expect(await page.title()).toContain('DevOps1');
});
