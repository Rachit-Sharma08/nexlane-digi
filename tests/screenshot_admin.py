import asyncio
from playwright.async_api import async_playwright

async def take_screenshots():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        BASE_URL = 'http://localhost:3000'
        ADMIN_PASSWORD = 'smoke-test-pw-2026'
        
        widths = [1440, 768, 360]
        
        for width in widths:
            context = await browser.new_context(
                viewport={'width': width, 'height': 900},
                reduced_motion='reduce'
            )
            page = await context.new_page()
            
            # Login first
            await page.goto(f'{BASE_URL}/admin/login')
            await page.fill('input[type="password"]', ADMIN_PASSWORD)
            await page.click('button[type="submit"]')
            await page.wait_for_url('**/admin', timeout=15000)
            await page.wait_for_timeout(1000)
            
            # Dashboard screenshot
            await page.screenshot(path=f'screenshots/admin-dashboard-{width}.png', full_page=True)
            print(f'Dashboard {width}px screenshot saved')
            
            await context.close()
        
        # Login page screenshots (not authenticated)
        for width in widths:
            context = await browser.new_context(
                viewport={'width': width, 'height': 900},
                reduced_motion='reduce'
            )
            page = await context.new_page()
            
            await page.goto(f'{BASE_URL}/admin/login')
            await page.wait_for_timeout(500)
            
            await page.screenshot(path=f'screenshots/admin-login-{width}.png', full_page=True)
            print(f'Login {width}px screenshot saved')
            
            await context.close()
        
        await browser.close()

asyncio.run(take_screenshots())