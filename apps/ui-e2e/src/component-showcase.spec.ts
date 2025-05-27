import { test, expect } from '@playwright/test';

test.describe('Component Showcase', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render all major component sections', async ({ page }) => {
    // Check main title
    await expect(page.locator('h1')).toContainText('Component Showcase');

    // Verify major sections are present
    const sections = [
      'Button Components',
      'Form Components',
      'Feedback Components',
      'Layout Components'
    ];

    for (const section of sections) {
      await expect(page.getByText(section, { exact: false })).toBeVisible();
    }
  });

  test('should have working button interactions', async ({ page }) => {
    // Test primary button
    const primaryButton = page.locator('button:has-text("Primary")').first();
    await expect(primaryButton).toBeVisible();
    await primaryButton.click();

    // Test secondary button
    const secondaryButton = page.locator('button:has-text("Secondary")').first();
    await expect(secondaryButton).toBeVisible();
    await secondaryButton.click();
  });

  test('should have working form components', async ({ page }) => {
    // Test input
    const input = page.locator('input[type="text"]').first();
    await expect(input).toBeVisible();
    await input.fill('Test input');
    await expect(input).toHaveValue('Test input');

    // Test select/dropdown
    const select = page.locator('select').first();
    await expect(select).toBeVisible();
  });

  test('should handle dark mode toggle', async ({ page }) => {
    // Find and click dark mode toggle
    const darkModeToggle = page.getByRole('switch').first();
    await expect(darkModeToggle).toBeVisible();
    
    // Get initial state
    const initialIsDark = await page.evaluate(() => 
      document.documentElement.classList.contains('dark')
    );

    // Click toggle
    await darkModeToggle.click();

    // Verify state changed
    const newIsDark = await page.evaluate(() => 
      document.documentElement.classList.contains('dark')
    );
    expect(newIsDark).not.toBe(initialIsDark);
  });
});
