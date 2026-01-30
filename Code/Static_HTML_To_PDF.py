from weasyprint import HTML
import os
import glob

# Input file path (HTML on D: drive)
input_path = r"D:\Study\Learning Series\HTML files"

# Output file path (PDF on E: drive)
output_path = r"D:\Study\Learning Series\PDFs"

# Ensure output directory exists
os.makedirs(output_path, exist_ok=True)

# Find all HTML files in input directory
html_files = glob.glob(os.path.join(input_path, "*.html"))

# Loop through each HTML file and convert
for html_file in html_files:
    # Extract filename without extension
    filename = os.path.splitext(os.path.basename(html_file))[0]
    output_dir = os.path.join(output_path, f"{filename}.pdf")
    
    # Convert HTML to PDF
    HTML(html_file).write_pdf(output_dir)
    print(f"Converted: {html_file} → {output_dir}")