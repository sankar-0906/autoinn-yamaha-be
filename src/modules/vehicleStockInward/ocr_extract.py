import sys
import subprocess
import os
from pathlib import Path
from pdfminer.high_level import extract_text

def process_pdf(input_pdf_path):
    # Ensure input path is absolute
    input_pdf = os.path.abspath(input_pdf_path)
    output_dir = os.path.dirname(input_pdf)
    base_name = os.path.basename(input_pdf)
    ocr_pdf = os.path.join(output_dir, f"ocr_{base_name}")

    try:
        # 1) Run OCRmyPDF
        # --pages 1 to only process the first page as per user requirement
        subprocess.run([
            "ocrmypdf",
            "--rotate-pages",
            "--deskew",
            "--clean",
            "--optimize", "3",
            "--force-ocr",
            "--pages", "1",
            input_pdf,
            ocr_pdf
        ], check=True, capture_output=True, text=True)

        # 2) Extract text from OCR processed PDF
        text = extract_text(ocr_pdf)

        # 3) Cleanup OCR PDF
        if os.path.exists(ocr_pdf):
            os.remove(ocr_pdf)

        return text
    except subprocess.CalledProcessError as e:
        print(f"Error during OCRmyPDF: {e.stderr}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python ocr_extract.py <input_pdf_path>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    extracted_text = process_pdf(input_path)
    print(extracted_text)
