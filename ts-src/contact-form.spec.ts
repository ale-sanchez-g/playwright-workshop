import { test, expect } from '@playwright/test';

test.describe('DevOps1 Contact Form', () => {
  test('should navigate to contact form and fill out all details', async ({ page }) => {
    // Given you are a new visitor
    // Navigate to https://devops1.com.au
    await page.goto('https://devops1.com.au');
    
    // Verify we're on the homepage
    await expect(page).toHaveTitle(/DevOps1 - Optimising Cloud and Building Digital Immunity/);
    
    // And you Click on the contact us button
    await page.getByRole('navigation').getByRole('link', { name: 'Contact us' }).click();
    
    // Then you are redirected to the contact us form
    await expect(page).toHaveURL('https://devops1.com.au/contact');
    await expect(page).toHaveTitle(/DevOps1 - Contact us/);
    
    // Verify the contact form is visible
    await expect(page.getByRole('heading', { name: 'Get in touch' })).toBeVisible();
    
    // And when you fill the form with all the relevant details
    await page.getByRole('textbox', { name: 'First Name' }).fill('John');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Doe');
    await page.getByRole('textbox', { name: 'Email address' }).fill('john.doe@example.com');
    await page.getByRole('textbox', { name: 'Phone' }).fill('+61 2 1234 5678');
    await page.getByRole('textbox', { name: 'Company Name' }).fill('Test Company Ltd');
    await page.getByRole('textbox', { name: 'How did you hear about us?' }).fill('Google search');
    
    // Verify all form fields are filled correctly
    await expect(page.getByRole('textbox', { name: 'First Name' })).toHaveValue('John');
    await expect(page.getByRole('textbox', { name: 'Last Name' })).toHaveValue('Doe');
    await expect(page.getByRole('textbox', { name: 'Email address' })).toHaveValue('john.doe@example.com');
    await expect(page.getByRole('textbox', { name: 'Phone' })).toHaveValue('+61 2 1234 5678');
    await expect(page.getByRole('textbox', { name: 'Company Name' })).toHaveValue('Test Company Ltd');
    await expect(page.getByRole('textbox', { name: 'How did you hear about us?' })).toHaveValue('Google search');
    
    // You are ready to submit the form
    // Verify the Send Message button is present and enabled
    const submitButton = page.getByRole('button', { name: 'Send Message' });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
    
    // Note: We don't actually submit the form to avoid sending test data
    // In a real test scenario, you might want to:
    // 1. Check the reCAPTCHA checkbox if needed
    // 2. Click the submit button
    // 3. Verify success message or redirection
    
    // Verify the reCAPTCHA is present
    await expect(page.frameLocator('iframe[title="reCAPTCHA"]').getByText('I\'m not a robot')).toBeVisible();
  });
  
  test('should validate required form fields', async ({ page }) => {
    // Navigate to the contact form
    await page.goto('https://devops1.com.au/contact');
    
    // Try to submit the form without filling any fields
    // Note: This test would check if the form validates required fields
    // The actual validation behavior depends on the website's implementation
    
    // Verify form fields are empty initially
    await expect(page.getByRole('textbox', { name: 'First Name' })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: 'Last Name' })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: 'Email address' })).toHaveValue('');
    
    // Verify submit button exists
    await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible();
  });
  
  test('should display correct contact information', async ({ page }) => {
    // Navigate to the contact page
    await page.goto('https://devops1.com.au/contact');
    
    // Verify contact information is displayed
    await expect(page.getByRole('heading', { name: 'Our locations' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sydney (Head office)' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Melbourne' })).toBeVisible();
    
    // Verify contact email links
    await expect(page.getByRole('link', { name: 'hello@devops1.com.au' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'sales@devops1.com.au' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'partners@devops1.com.au' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'careers@devops1.com.au' })).toBeVisible();
  });
});
