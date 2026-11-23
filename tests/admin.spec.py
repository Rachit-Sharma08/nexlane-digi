import asyncio
import json
import os
import sys
import time
from pathlib import Path
from playwright.async_api import async_playwright

BASE_URL = os.getenv("NEXLANE_BASE_URL", "http://localhost:3000").rstrip("/")
ADMIN_ROUTE_SLUG = os.getenv("ADMIN_ROUTE_SLUG", "panel-x7f").strip("/")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL_1", "")
ADMIN_PASSWORD = os.getenv("ADMIN_TEST_PASSWORD", "")
ADMIN_URL = f"{BASE_URL}/{ADMIN_ROUTE_SLUG}"
ADMIN_LOGIN_URL = f"{ADMIN_URL}/login"

async def test_admin_flow():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1440, "height": 900},
            reduced_motion="reduce"
        )
        page = await context.new_page()
        
        results = []
        test_slug = f"ui-smoke-post-{int(time.time())}"
        test_title = "UI Smoke Test Post"
        test_desc = "This is a smoke test post created by Playwright"
        test_category = "Testing"
        test_date = "2026-11-08"
        updated_title = "UI Smoke Test Post - Updated"
        
        def record(name, passed, details=""):
            results.append({"test": name, "passed": passed, "details": details})
            status = "PASS" if passed else "FAIL"
            print(f"[{status}] {name}: {details}")
        
        async def debug_page(name):
            print(f"\n--- DEBUG {name} ---")
            print(f"URL: {page.url}")
            content = await page.content()
            # Search for key indicators
            if "Loading" in content:
                print("FOUND: 'Loading' in content")
            if "Error" in content or "error" in content.lower():
                print("FOUND: 'Error' in content")
            if "Post not found" in content:
                print("FOUND: 'Post not found' in content")
            if "Edit Post" in content:
                print("FOUND: 'Edit Post' in content")
            if 'id="title"' in content:
                print("FOUND: title input in content")
            if "PostEditor" in content:
                print("FOUND: PostEditor in content")
            # Look for error message in the page
            if "Failed to load" in content:
                print("FOUND: 'Failed to load' in content")
            if "401" in content:
                print("FOUND: '401' in content")
            if "404" in content:
                print("FOUND: '404' in content")
            # Print first 12000 chars, handling encoding
            try:
                print(content[:12000])
            except UnicodeEncodeError:
                print(content[:12000].encode('ascii', 'replace').decode('ascii'))
        
        print("\n=== Test 1: Unauthenticated panel redirects to login ===")
        await page.goto(ADMIN_URL)
        await page.wait_for_url(f"**/{ADMIN_ROUTE_SLUG}/login**")
        record("Unauthenticated redirect", page.url.endswith(f"/{ADMIN_ROUTE_SLUG}/login"), f"URL: {page.url}")
        
        # Test 2: Wrong password -> error message visible
        print("\n=== Test 2: Wrong password shows error ===")
        await page.fill('input[type="password"]', "wrong-password")
        await page.click('button[type="submit"]')
        await page.wait_for_timeout(500)
        error_visible = await page.locator('text="Invalid credentials"').is_visible()
        record("Wrong password error", error_visible, "Generic credentials error displayed")
        
        # Test 3: Right password -> dashboard shows sample-draft-post with Draft badge
        print("\n=== Test 3: Correct password shows dashboard with sample post ===")
        await page.fill('input[type="email"]', ADMIN_EMAIL)
        await page.fill('input[type="password"]', ADMIN_PASSWORD)
        await page.click('button[type="submit"]')
        await page.wait_for_url(f"**/{ADMIN_ROUTE_SLUG}", timeout=15000)
        await page.wait_for_timeout(1500)
        
        # Check for sample-draft-post row - target the title link specifically
        sample_post = page.locator('a.font-medium:has-text("How a Kaithal shop can get found on Google Maps")')
        draft_badge = page.locator('text="Draft"').first
        record("Dashboard loads", await sample_post.is_visible(), "Sample post visible")
        record("Draft badge shown", await draft_badge.is_visible(), "Draft badge visible")
        
        # Test 4: Create new post
        print("\n=== Test 4: Create new post ===")
        await page.click('a:has-text("New post")')
        await page.wait_for_url(f"**/{ADMIN_ROUTE_SLUG}/posts/new")
        await page.wait_for_timeout(500)
        
        # Fill the form
        await page.fill('input[id="title"]', test_title)
        await page.fill('input[id="slug"]', test_slug)
        await page.fill('textarea[id="description"]', test_desc)
        await page.fill('input[id="category"]', test_category)
        await page.fill('input[id="date"]', test_date)
        await page.select_option('select[id="author"]', "Rachit Sharma")
        
        # Keep draft checked (default)
        
        # Add a paragraph block (already there by default)
        await page.fill('textarea[placeholder="Paragraph text..."].resize-none', "This is a test paragraph created by the smoke test.")
        
        # Save - the page returns to the configured admin route.
        print("Clicking Create post...")
        await page.click('button:has-text("Create post")')
        await page.wait_for_url(f"**/{ADMIN_ROUTE_SLUG}", timeout=15000)
        await page.wait_for_timeout(1000)
        
        # Debug after create - should be on dashboard now
        await debug_page("dashboard after create")
        
        # Verify new post appears in list - target the title link specifically (has class font-medium)
        new_post_link = page.locator(f'a.font-medium[href="/{ADMIN_ROUTE_SLUG}/posts/{test_slug}"]')
        record("New post in dashboard", await new_post_link.is_visible(), f"Post '{test_title}' listed with slug {test_slug}")
        
        # Test 5: Edit the post - click the Edit button (btn-ghost) not the title link
        print("\n=== Test 5: Edit post ===")
        await page.click(f'a.btn-ghost[href="/{ADMIN_ROUTE_SLUG}/posts/{test_slug}"]')
        await page.wait_for_url(f"**/{ADMIN_ROUTE_SLUG}/posts/{test_slug}")
        # Debug: see what's on the edit page
        await debug_page("edit page loaded")
        # Wait a bit more for client-side hydration and data fetch
        await page.wait_for_timeout(3000)
        # Debug again after waiting
        await debug_page("edit page after wait")
        # Wait for the title input to be visible (page loads post data)
        await page.wait_for_selector('input[id="title"]', state="visible", timeout=15000)
        
        await page.fill('input[id="title"]', updated_title)
        await page.click('button:has-text("Save changes")')
        await page.wait_for_timeout(2000)
        
        # Debug after edit
        await debug_page("after edit post click")
        
        # Check success message (edit page stays on edit page)
        success_msg = page.locator('text="Saved — goes live on the next deploy."')
        record("Edit post success", await success_msg.is_visible(), "Success message shown")
        
        # Go back to dashboard
        await page.click('button:has-text("Back to posts")')
        await page.wait_for_url(f"**/{ADMIN_ROUTE_SLUG}", timeout=15000)
        await page.wait_for_timeout(500)
        
        # Verify updated title in dashboard - target the title link specifically
        updated_link = page.locator(f'a.font-medium[href="/{ADMIN_ROUTE_SLUG}/posts/{test_slug}"]')
        record("Updated post in dashboard", await updated_link.is_visible(), "Updated title listed")
        
        # Verify the link text is the updated title
        link_text = await updated_link.text_content()
        record("Updated title correct", link_text == updated_title, f"Link text: {link_text}")
        
        # Test 6: Delete the post
        print("\n=== Test 6: Delete post ===")
        # Find the delete button for our post - use the row with the slug link (title link)
        delete_btn = page.locator(f'tr:has(a.font-medium[href="/{ADMIN_ROUTE_SLUG}/posts/{test_slug}"]) button:has-text("Delete")')
        # Confirm dialog - must be set up BEFORE clicking
        page.once("dialog", lambda dialog: dialog.accept())
        await delete_btn.click()
        await page.wait_for_timeout(2000)
        
        # Debug after delete
        await debug_page("after delete click")
        
        # Verify post is gone - target the title link specifically
        deleted_link = page.locator(f'a.font-medium[href="/{ADMIN_ROUTE_SLUG}/posts/{test_slug}"]')
        is_gone = not await deleted_link.is_visible()
        record("Post deleted from dashboard", is_gone, "Post no longer listed" if is_gone else "Post still visible")
        
        # Test 7: Log out
        print("\n=== Test 7: Log out ===")
        await page.click('button:has-text("Log out")')
        await page.wait_for_url(f"**/{ADMIN_ROUTE_SLUG}/login")
        record("Log out redirect", page.url.endswith(f"/{ADMIN_ROUTE_SLUG}/login"), f"URL: {page.url}")
        
        print("\n=== Test 8: Panel access stays protected after logout ===")
        await page.goto(ADMIN_URL)
        await page.wait_for_url(f"**/{ADMIN_ROUTE_SLUG}/login**")
        record("Middleware redirect", page.url.endswith(f"/{ADMIN_ROUTE_SLUG}/login"), f"URL: {page.url}")
        
        await browser.close()
        
        # Verify blog.json
        print("\n=== Verify blog.json ===")
        blog_json = Path("src/content/blog.json")
        if blog_json.exists():
            data = json.loads(blog_json.read_text())
            has_ui_post = any(p["slug"] == test_slug for p in data)
            record("blog.json updated", not has_ui_post, f"{test_slug} removed from blog.json after delete" if not has_ui_post else f"{test_slug} still in blog.json")
        else:
            record("blog.json exists", False, "blog.json not found")
        
        # Summary
        print("\n=== SUMMARY ===")
        passed = sum(1 for r in results if r["passed"])
        total = len(results)
        print(f"Passed: {passed}/{total}")
        for r in results:
            status = "PASS" if r["passed"] else "FAIL"
            print(f"  [{status}] {r['test']}: {r['details']}")
        
        return all(r["passed"] for r in results)

if __name__ == "__main__":
    if not ADMIN_EMAIL or not ADMIN_PASSWORD:
        print("Skipping live admin checks: set ADMIN_EMAIL_1 and ADMIN_TEST_PASSWORD in the test process.")
        sys.exit(0)
    result = asyncio.run(test_admin_flow())
    sys.exit(0 if result else 1)
