// 1. Mocking and Network Interception

import { test, expect } from '@playwright/test';


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
  
  // Go to Mocked card
  await page.locator('.project-card').hover();
  // Take a screenshot for verification
  await page.screenshot({ path: 'card_screenshot.png' });
  // Validate the mocked content
  const projectCard = page.locator('.project-card').first();
  await expect(projectCard).toHaveText('SUPREME COURT OF MCP');
  await expect(projectCard).toHaveAttribute('href', '/#');
  await expect(projectCard.locator('img')).toHaveAttribute('src', '/assets/img/public-sector.jpg');
  console.log('Mocked project card validation passed.');

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

  // Visual validation using of the first card
  await expect(firstCard).toHaveScreenshot();

  // Visual validation with diff tolerance
  await expect(page).toHaveScreenshot({ maxDiffPixels: 100 });
});


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
  await expect(page.locator('h1:has-text("PROJECTS")')).toBeVisible();
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
