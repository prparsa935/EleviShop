# -*- coding: utf-8 -*-
"""Render docx -> pdf (Word COM) -> page PNGs, and locate caption pages geometrically.

Captions are bold 11pt paragraphs starting with جدول/شکل. Bidi text extraction scrambles
the caption text, but caption labels appear in a KNOWN document order, so we map them
positionally and verify the kind (table/figure) at each position.
"""
import json, os, subprocess, sys
import pymupdf

BASE = os.path.dirname(os.path.abspath(__file__))
DOCX = os.path.join(BASE, "EleviShop-Thesis.docx")
PDF = os.path.join(BASE, "render.pdf")
PAGES_DIR = os.path.join(BASE, "pages")

# expected caption order in the body: (kind, id)
EXPECTED = [
    ("شکل", "2-1"),
    ("جدول", "2-1"), ("جدول", "2-2"),
    ("جدول", "3-1"), ("جدول", "3-2"),
    ("شکل", "3-1"), ("شکل", "3-2a"), ("شکل", "3-2b"),
    ("جدول", "3-3"), ("جدول", "3-4"),
    ("شکل", "3-3"),
    ("جدول", "3-5"), ("شکل", "3-4"), ("جدول", "3-6"),
    ("شکل", "4-1"),
    ("جدول", "4-1"), ("جدول", "4-2"),
    ("جدول", "5-1"), ("شکل", "5-1"),
    ("جدول", "A-1"),  # appendix caption (ignored in lists)
]

# ---- 1. Word COM export ----
ps = os.path.join(BASE, "convert.ps1")
r = subprocess.run(
    ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", ps, "-InPath", DOCX, "-OutPath", PDF],
    capture_output=True, text=True, timeout=300)
print(r.stdout.strip())
if r.returncode != 0:
    print(r.stderr)
    sys.exit(1)

# ---- 2. render PNGs ----
os.makedirs(PAGES_DIR, exist_ok=True)
for f in os.listdir(PAGES_DIR):
    os.remove(os.path.join(PAGES_DIR, f))
docpdf = pymupdf.open(PDF)
n = len(docpdf)
print("pdf pages:", n)
for i, page in enumerate(docpdf):
    pix = page.get_pixmap(dpi=100)
    pix.save(os.path.join(PAGES_DIR, f"page-{i+1:02d}.png"))

FA = "۰۱۲۳۴۵۶۷۸۹"

def line_text(line):
    return "".join(s["text"] for s in line["spans"])

def is_bold_label(line, word):
    sizes = [s["size"] for s in line["spans"]]
    fonts = [s["font"] for s in line["spans"]]
    bold = any(f.endswith("Bold") for f in fonts)
    return bold and any(abs(sz - 11.0) < 0.3 for sz in sizes) and line_text(line).strip().startswith(word)

# ---- 3. collect bold caption labels in document order ----
labels = []  # (pdf_page_index, y, kind)
chapter_pages = []
for i, page in enumerate(docpdf):
    d = page.get_text("dict")
    for block in d["blocks"]:
        for line in block.get("lines", []):
            t = line_text(line)
            for kind in ("جدول", "شکل"):
                if is_bold_label(line, kind):
                    labels.append((i, line["bbox"][1], kind))
                    break
            tt = t.replace(" ", "")
            if "فصلاول" in tt:
                chapter_pages.append(i)

if not chapter_pages:
    print("ERROR: chapter 1 not found")
    sys.exit(1)
body_start = chapter_pages[-1]
print("body starts at pdf page", body_start + 1)

body_labels = [lb for lb in labels if lb[0] >= body_start]
body_labels.sort(key=lambda lb: (lb[0], lb[1]))
print("caption labels found in body:", len(body_labels), "expected:", len(EXPECTED))
kinds_found = [lb[2] for lb in body_labels]
kinds_expected = [e[0] for e in EXPECTED]
if kinds_found != kinds_expected:
    print("KIND MISMATCH!")
    print("found:   ", kinds_found)
    print("expected:", kinds_expected)
    sys.exit(1)

def body_no(pdf_idx):
    return "".join(FA[int(c)] for c in str(pdf_idx - body_start + 1))

result_tables, result_figures = {}, {}
for (kind, cid), (pi, y, _) in zip(EXPECTED, body_labels):
    page_str = body_no(pi)
    print(f"{kind} {cid} -> pdf {pi+1} -> body {page_str}")
    (result_tables if kind == "جدول" else result_figures)[cid] = page_str

out = {
    "tables": {k: result_tables.get(k, "۰") for k in
               ["2-1", "2-2", "3-1", "3-2", "3-3", "3-4", "3-5", "3-6", "4-1", "4-2", "5-1"]},
    "figures": {k: result_figures.get(k, "۰") for k in
                ["2-1", "3-1", "3-2a", "3-2b", "3-3", "3-4", "4-1", "5-1"]},
}
with open(os.path.join(BASE, "listpages.json"), "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print("listpages.json written")
