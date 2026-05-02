import asyncio
from playwright.async_api import async_playwright
import time
import os

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        print("Navigating to app...")
        await page.goto("http://localhost:1420")

        # Wait for either Accedi button or the dashboard if already logged in
        try:
            await page.wait_for_selector("text=Accedi", timeout=10000)
            print("Welcome screen visible")
            await page.screenshot(path="screenshots/final_01_welcome.png")

            # Login
            await page.click("text=Accedi")
            await page.wait_for_selector('input[placeholder="Email"]')
            await page.fill('input[placeholder="Email"]', "admin@protype.com")
            await page.fill('input[placeholder="Password"]', "admin")
            await page.click("button:has-text('Accedi')")
        except Exception as e:
            print(f"Direct login not possible or already logged in: {e}")

        # Wait for Dashboard
        await page.wait_for_selector("text=Dashboard Operativa", timeout=10000)
        print("Dashboard verified")
        await page.screenshot(path="screenshots/final_02_dashboard.png")

        # Projects and Detail
        await page.click("text=Progetti")
        await page.wait_for_selector("text=Brand Identity 2024")
        await page.screenshot(path="screenshots/final_03_projects_list.png")

        await page.click("text=Brand Identity 2024")
        await page.wait_for_selector("text=Whiteboard")
        await page.screenshot(path="screenshots/final_04_project_detail.png")
        print("Project Detail verified")

        # Whiteboard
        await page.click("text=Whiteboard")
        await page.wait_for_selector("canvas", timeout=5000)
        await page.screenshot(path="screenshots/final_05_whiteboard.png")
        print("Whiteboard verified")

        # Calendar
        await page.click("text=Calendario")
        await page.wait_for_selector("text=Ottobre 2023")
        await page.screenshot(path="screenshots/final_06_calendar.png")
        print("Calendar verified")

        await browser.close()

if __name__ == "__main__":
    if not os.path.exists("screenshots"):
        os.makedirs("screenshots")
    asyncio.run(verify())
