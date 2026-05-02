import asyncio
from playwright.async_api import async_playwright
import os

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        print("Navigating to app...")
        await page.goto("http://localhost:1420/index.html")

        # 1. Welcome
        await page.wait_for_selector("text=Benvenuto", timeout=10000)
        await page.screenshot(path="screenshots/final_integrated_01_welcome.png")
        print("Welcome OK")

        # 2. Login
        await page.click("text=Inizia Ora")
        await page.wait_for_selector('input[placeholder="Email"]')
        await page.fill('input[placeholder="Email"]', "admin@protype.com")
        await page.fill('input[placeholder="Password"]', "admin")
        await page.click("button:has-text('Accedi')")

        # 3. Dashboard (Layout check)
        await page.wait_for_selector("text=Dashboard Operativa", timeout=10000)
        await page.screenshot(path="screenshots/final_integrated_02_dashboard.png")
        print("Dashboard & Layout OK")

        # 4. Create Project Modal
        await page.click("text=Nuovo Progetto")
        await page.wait_for_selector("text=Nome Progetto")
        await page.screenshot(path="screenshots/final_integrated_03_project_modal.png")
        await page.click("button:has-text('Annulla')")
        print("Modals OK")

        # 5. Project Detail & Whiteboard
        await page.click("text=Progetti")
        await page.click("text=Brand Identity 2024")
        await page.click("text=Whiteboard")
        await asyncio.sleep(2)
        await page.screenshot(path="screenshots/final_integrated_04_whiteboard.png")
        print("Whiteboard OK")

        await browser.close()

if __name__ == "__main__":
    if not os.path.exists("screenshots"):
        os.makedirs("screenshots")
    asyncio.run(verify())
