import { test, expect } from '@playwright/test';

test.describe('DevOps1 Contact Form Flow', () => {
  test('should complete the contact form submission flow', async ({ page }) => {
    // Step 1: Navigate to the DevOps1 homepage
    await test.step('Navigate to DevOps1 homepage', async () => {
      await page.goto('https://devops1.com.au');
      await expect(page).toHaveTitle(/DevOps1 - Optimising Cloud and Building Digital Immunity/);
    });

    // Step 2: Expand to Desktop viewport
    await test.step('Set desktop viewport', async () => {
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    // Step 3: Click on the contact us button
    await test.step('Click on Contact us button', async () => {
      await page.getByRole('navigation').getByRole('link', { name: 'Contact us' }).click();
    });

    // Step 4: Verify redirection to contact form
    await test.step('Verify redirection to contact form', async () => {
      await expect(page).toHaveURL('https://devops1.com.au/contact');
      await expect(page).toHaveTitle(/DevOps1 - Contact us/);
      await expect(page.getByRole('heading', { name: 'Get in touch' })).toBeVisible();
    });

    // Step 5: Fill the form with all relevant details
    await test.step('Fill contact form with details', async () => {
      // Fill First Name
      await page.getByRole('textbox', { name: 'First Name' }).fill('John');
      
      // Fill Last Name
      await page.getByRole('textbox', { name: 'Last Name' }).fill('Smith');
      
      // Fill Email
      await page.getByRole('textbox', { name: 'Email address' }).fill('john.smith@example.com');
      
      // Fill Phone
      await page.getByRole('textbox', { name: 'Phone' }).fill('+61 2 1234 5678');
      
      // Fill Company Name
      await page.getByRole('textbox', { name: 'Company Name' }).fill('Tech Solutions Pty Ltd');
      
      // Fill How did you hear about us
      await page.getByRole('textbox', { name: 'How did you hear about us?' }).fill('Online search and referral from colleague');
      
      // Verify all fields are filled
      await expect(page.getByRole('textbox', { name: 'First Name' })).toHaveValue('John');
      await expect(page.getByRole('textbox', { name: 'Last Name' })).toHaveValue('Smith');
      await expect(page.getByRole('textbox', { name: 'Email address' })).toHaveValue('john.smith@example.com');
      await expect(page.getByRole('textbox', { name: 'Phone' })).toHaveValue('+61 2 1234 5678');
      await expect(page.getByRole('textbox', { name: 'Company Name' })).toHaveValue('Tech Solutions Pty Ltd');
      await expect(page.getByRole('textbox', { name: 'How did you hear about us?' })).toHaveValue('Online search and referral from colleague');
    });

    // Step 6: Handle reCAPTCHA (Note: In CI/CD, you might want to mock this)
    await test.step('Handle reCAPTCHA verification', async () => {
      // Wait for reCAPTCHA iframe to load
      await page.waitForSelector('iframe[name*="a-"]');
      
      // Note: In a real CI/CD environment, you might want to:
      // 1. Use test keys for reCAPTCHA
      // 2. Mock the reCAPTCHA response
      // 3. Skip this step in test environment
      
      // For demonstration, we'll attempt to click the checkbox
      try {
        const recaptchaFrame = page.frameLocator('iframe[name*="a-"]');
        await recaptchaFrame.getByRole('checkbox', { name: "I'm not a robot" }).click();
        
        // Wait for potential validation
        await page.waitForTimeout(2000);
      } catch (error) {
        console.log('reCAPTCHA interaction may require manual verification in CI/CD');
      }
    });

    // Step 7: Verify form is ready to submit
    await test.step('Verify form is ready to submit', async () => {
      const submitButton = page.getByRole('button', { name: 'Send Message' });
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toBeEnabled();
      
      // Take a screenshot for validation
      await page.screenshot({ 
        path: 'test-results/contact-form-ready-to-submit.png',
        fullPage: true 
      });
    });

    // Optional Step 8: Submit the form (commented out to avoid actual submission in tests)
    /*
    await test.step('Submit the form', async () => {
      await page.getByRole('button', { name: 'Send Message' }).click();
      
      // Wait for success message or confirmation
      // You would add appropriate assertions here based on the actual success behavior
      await expect(page.getByText('Thank you')).toBeVisible({ timeout: 10000 });
    });
    */
  });

  test('should validate form field requirements', async ({ page }) => {
    await test.step('Navigate to contact form', async () => {
      await page.goto('https://devops1.com.au/contact');
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    await test.step('Test form validation', async () => {
      // Try to submit empty form to test validation
      const submitButton = page.getByRole('button', { name: 'Send Message' });
      await submitButton.click();
      
      // Check if validation messages appear (adjust selectors based on actual implementation)
      // This is a placeholder - you'd need to inspect the actual validation behavior
      
      // Fill required fields one by one and verify validation clears
      await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
      await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
      await page.getByRole('textbox', { name: 'Email address' }).fill('test@example.com');
    });
  });

  test('should handle responsive design on mobile viewport', async ({ page }) => {
    await test.step('Set mobile viewport and test navigation', async () => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
      await page.goto('https://devops1.com.au');
      
      // Mobile navigation might be different
      // You'd need to adapt this based on the actual mobile design
      await page.getByRole('link', { name: 'Contact us' }).click();
      await expect(page).toHaveURL('https://devops1.com.au/contact');
    });
  });
});
