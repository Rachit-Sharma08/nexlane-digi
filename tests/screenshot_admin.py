import asyncio
import os
from pathlib import Path
from playwright.async_api import async_playwright

BASE_URL = os.getenv("NEXLANE_BASE_URL", "http://localhost:3000").rstrip("/")
ADMIN_ROUTE_SLUG = os.getenv("ADMIN_ROUTE_SLUG", "panel-x7f").strip("/")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL_1", "")
ADMIN_PASSWORD = os.getenv("ADMIN_TEST_PASSWORD", "")
ADMIN_URL = f"{BASE_URL}/{ADMIN_ROUTE_SLUG}"
SCREENSHOTS = Path("screenshots")


async def take_screenshots():
    SCREENSHOTS.mkdir(exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        for width, height in [(1440, 900), (768, 1024), (360, 800)]:
            context = await browser.new_context(
                viewport={"width": width, "height": height}, reduced_motion="reduce"
            )
            page = await context.new_page()
            await page.goto(f"{ADMIN_URL}/login", wait_until="networkidle")
            await page.screenshot(path=str(SCREENSHOTS / f"admin-login-{width}.png"), full_page=True)
            metrics = await page.evaluate(
                "({width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth})"
            )
            assert metrics["scrollWidth"] <= metrics["width"], f"Horizontal overflow at {width}px"
            print(f"Login {width}px screenshot saved")

            if ADMIN_EMAIL and ADMIN_PASSWORD:
                await page.fill('input[type="email"]', ADMIN_EMAIL)
                await page.fill('input[type="password"]', ADMIN_PASSWORD)
                await page.click('button[type="submit"]')
                await page.wait_for_url(f"**/{ADMIN_ROUTE_SLUG}", timeout=15000)
                await page.screenshot(path=str(SCREENSHOTS / f"admin-dashboard-{width}.png"), full_page=True)
                print(f"Dashboard {width}px screenshot saved")
            await context.close()
        await browser.close()


if __name__ == "__main__":
    asyncio.run(take_screenshots())
