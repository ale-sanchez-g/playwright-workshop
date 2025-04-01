# 1. Mocking and Network Interception

import asyncio
import json
from playwright.async_api import async_playwright, expect
import os

async def test_network_interception():
    """
    Example demonstrating API mocking and network interception.
    This test intercepts a request to a products API and mocks the response.
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch()  # Set to False for debugging
        context = await browser.new_context()
        
        # Create a new page
        page = await context.new_page()
        
        # Set up request interception for a specific API endpoint
        await page.route("**/assets/manifest/projects.json", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps(
                {
                    "projects": [
                        {
                        "project-industry": "MOCKED SECTOR",
                        "project-title": "SUPREME COURT OF MCP",
                        "project-image": "/assets/img/public-sector.jpg",
                        "view-project-url": "/#"
                        }
                    ]
                }
            )
        ))

        # Navigate to page that makes API requests
        await page.goto("https://devops1.com.au/projects/")
        
        # Wait for network to be idle
        await page.wait_for_load_state("networkidle")
        
        try:
           # Go to Mocked card
            await page.locator(".project-card").hover()
           # Take a screenshot for verification
            await page.screenshot(path="card_screenshot.png")
            
        except Exception as e:
            # Take screenshot on failure for debugging
            await page.screenshot(path="error_screenshot.png")
            print(f"Error occurred: {e}")
            
        await browser.close()

# 2. Visual Validations

async def test_visual_validation():
    """
    Example of validation using accessibility snapshots instead of pixel-perfect comparisons.
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch()

        # Create context with specific viewport for consistent rendering
        context = await browser.new_context(
            viewport={"width": 1280, "height": 720}
        )
        page = await context.new_page()

        # Navigate to the page
        await page.goto("https://devops1.com.au/projects/")
        
        # Wait for the page to be visually stable
        await page.wait_for_load_state("networkidle")
        
        
        # Scroll to the first card
        first_card = page.locator(".project-card").first
        await first_card.scroll_into_view_if_needed()

        # if no baseline image is available inthe file system, create one
        if not os.path.exists(os.path.join(os.path.dirname(__file__), "baseline_first_card_screenshot.png")):
            await first_card.screenshot(path="baseline_first_card_screenshot.png")
    
        # Take a screenshot of the first card for visual validation
        await first_card.screenshot(path="first_card_screenshot.png")
        print("Screenshot of the first card taken.")

        # Example of visual comparison (typically used with a visual comparison library)
        # Here we're just demonstrating the concept
        from PIL import Image, ImageChops
        
        def compare_images(baseline_path, actual_path):
            if not os.path.exists(baseline_path):
                print(f"Baseline image {baseline_path} does not exist. Creating it now.")
                os.rename(actual_path, baseline_path)
                return True
            
            baseline = Image.open(baseline_path)
            actual = Image.open(actual_path)
            
            # Check if images have the same size
            if baseline.size != actual.size:
                print(f"Image size mismatch: {baseline.size} vs {actual.size}")
                return False
            
            # Compare images
            diff = ImageChops.difference(baseline, actual)
            
            # If the images are identical, the diff image will be completely black
            if diff.getbbox() is None:
                print("Images are identical")
                return True
            
            # Create a visual diff with red highlighting
            width, height = baseline.size
            visual_diff = Image.new('RGBA', (width, height), (0, 0, 0, 0))
            
            # Convert diff to a mask that highlights changes
            diff_mask = diff.convert('L').point(lambda x: 255 if x > 30 else 0)  # Threshold for difference detection
            
            # Create a red layer for highlighting differences
            red_layer = Image.new('RGBA', (width, height), (255, 0, 0, 128))  # Semi-transparent red
            
            # Apply the mask to the red layer
            visual_diff = Image.composite(red_layer, visual_diff, diff_mask)
            
            # Overlay the red differences on the actual image
            highlighted_diff = Image.alpha_composite(actual.convert('RGBA'), visual_diff)
            
            # Save the highlighted diff image
            highlighted_diff.save("diff_highlighted.png")
            
            # Also save the raw diff for technical analysis
            diff.save("diff_raw.png")
            
            print("Images differ - see diff_highlighted.png for visualization")
            return False
        
        # Call the comparison function
        is_matching = compare_images("baseline_first_card_screenshot.png", "first_card_screenshot.png")
        assert is_matching, "Dashboard visual appearance has changed"
          
        await browser.close()


# 3. Browser Context Isolation

async def test_browser_context_isolation():
    """
    Example demonstrating browser context isolation for parallel testing.
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        
        # Create two isolated browser contexts
        context1 = await browser.new_context()
        context2 = await browser.new_context()
        
        # Create pages in each context
        page1 = await context1.new_page()
        page2 = await context2.new_page()
        
        # Set different storage states
        await page1.goto("https://your-application.com/login")
        await page1.fill("#username", "user1@example.com")
        await page1.fill("#password", "password1")
        await page1.click("#login-button")
        await page1.wait_for_selector(".welcome-message")
        
        # Save storage state (cookies, local storage)
        storage_state1 = await context1.storage_state()
        
        # Different user in the second context
        await page2.goto("https://your-application.com/login")
        await page2.fill("#username", "user2@example.com")
        await page2.fill("#password", "password2")
        await page2.click("#login-button")
        await page2.wait_for_selector(".welcome-message")
        
        # Demonstrate isolation - actions in one context don't affect the other
        await page1.goto("https://your-application.com/profile")
        await expect(page1.locator(".username")).to_have_text("user1@example.com")
        
        await page2.goto("https://your-application.com/profile")
        await expect(page2.locator(".username")).to_have_text("user2@example.com")
        
        # Create a new context with saved storage state (for CI/CD reuse)
        context3 = await browser.new_context(storage_state=storage_state1)
        page3 = await context3.new_page()
        await page3.goto("https://your-application.com/profile")
        await expect(page3.locator(".username")).to_have_text("user1@example.com")
        
        await browser.close()


# 4. Enhancing CI/CD Pipeline

async def run_parallel_tests():
    """
    Example of running tests in parallel for CI/CD pipelines.
    """
    async with async_playwright() as p:
        # Launch browser once and reuse for multiple tests
        browser = await p.chromium.launch()
        
        # Define list of test scenarios
        test_scenarios = [
            {"name": "login", "url": "/login", "expect_selector": ".dashboard"},
            {"name": "products", "url": "/products", "expect_selector": ".product-list"},
            {"name": "checkout", "url": "/checkout", "expect_selector": ".payment-form"}
        ]
        
        # Run tests in parallel
        tasks = []
        for scenario in test_scenarios:
            tasks.append(run_test_scenario(browser, scenario))
        
        # Wait for all tests to complete
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Process results
        failed_tests = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                failed_tests.append({
                    "scenario": test_scenarios[i]["name"],
                    "error": str(result)
                })
        
        # Output results for CI/CD pipeline
        if failed_tests:
            for failed in failed_tests:
                print(f"❌ Test '{failed['scenario']}' failed: {failed['error']}")
            exit_code = 1
        else:
            print("✅ All tests passed!")
            exit_code = 0
        
        # In a real CI/CD pipeline, you'd use this exit code
        # to determine build success/failure
        print(f"Exiting with code: {exit_code}")
        
        await browser.close()
        return exit_code

async def run_test_scenario(browser, scenario):
    """Helper function to run a single test scenario."""
    # Create a new context for each test for isolation
    context = await browser.new_context(
        record_video_dir="videos/",  # Record video for failed tests
        viewport={"width": 1280, "height": 720}
    )
    
    try:
        page = await context.new_page()
        
        # Add test artifacts for CI/CD debugging
        page.on("console", lambda msg: print(f"BROWSER LOG: {msg.text}"))
        
        # Navigate to test URL
        base_url = "https://your-application.com"
        await page.goto(f"{base_url}{scenario['url']}")
        
        # Wait for expected element
        await page.wait_for_selector(scenario["expect_selector"], timeout=10000)
        
        # Test passed
        print(f"✅ Test '{scenario['name']}' passed")
        
    except Exception as e:
        # Take screenshot on failure
        await page.screenshot(path=f"screenshots/failed_{scenario['name']}.png")
        raise e
    
    finally:
        # Always close the context to clean up
        await context.close()


# Run all examples
async def main():
    print("1. Running Network Interception Example...")
    await test_network_interception()
    
    print("\n2. Running Visual Validation Example...")
    await test_visual_validation()
    
    # print("\n3. Running Browser Context Isolation Example...")
    # await test_browser_context_isolation()
    
    # print("\n4. Running CI/CD Pipeline Example...")
    # await run_parallel_tests()

# Uncomment to run all examples
if __name__ == "__main__":
    asyncio.run(main())