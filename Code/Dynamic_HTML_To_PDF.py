import asyncio
import os
import glob
from playwright.async_api import async_playwright
from PyPDF2 import PdfMerger

async def convert_and_merge():
    input_dir = r"D:\Study\Learning Series\HTML"
    output_dir = r"D:\Study\Learning Series\PDF"
    os.makedirs(output_dir, exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        # Collect all HTML files in the folder
        html_files = glob.glob(os.path.join(input_dir, "*.html"))

        for html_file in html_files:
            # Create a fresh page for each file
            page = await browser.new_page()

            file_url = f"file:///{html_file.replace(os.sep, '/')}"
            await page.goto(file_url, wait_until="networkidle")

            filename = os.path.splitext(os.path.basename(html_file))[0]
            merger = PdfMerger()
            page_num = 1
            temp_files = []  # track temporary PDFs

            while True:
                # Save each page with unique filename
                temp_pdf = os.path.join(output_dir, f"{filename}_page{page_num}.pdf")
                await page.pdf(path=temp_pdf, format="A4")
                merger.append(temp_pdf)
                temp_files.append(temp_pdf)
                print(f"Saved {temp_pdf}")

                # Try to click "Next" if it exists
                next_button = await page.query_selector("text=Next")
                if next_button:
                    await next_button.click()
                    await page.wait_for_timeout(10)
                    page_num += 1
                else: break

            # Write combined PDF for this HTML file
            combined_path = os.path.join(output_dir, f"{filename}.pdf")
            merger.write(combined_path)
            merger.close()
            print(f"Combined PDF saved to {combined_path}")

            # Delete temporary PDFs
            for temp_pdf in temp_files:
                try:
                    os.remove(temp_pdf)
                    print(f"Deleted temporary file: {temp_pdf}")
                except Exception as e:
                    print(f"Could not delete {temp_pdf}: {e}")

        await browser.close()

# Run the async function
asyncio.run(convert_and_merge())
