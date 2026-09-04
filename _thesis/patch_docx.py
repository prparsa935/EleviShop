# -*- coding: utf-8 -*-
"""Post-process the generated docx:
1. Footer PAGE fields: roman format switch for front matter, arabic for body.
2. Remove empty <w:pgNumType/> from cover section.
3. Make TOC entries RTL (bidi) in both document.xml entries and TOC styles.
"""
import re, sys, zipfile, shutil, os

path = sys.argv[1]
tmp = path + ".tmp"

zin = zipfile.ZipFile(path, "r")
names = zin.namelist()
data = {n: zin.read(n) for n in names}
zin.close()

doc = data["word/document.xml"].decode("utf-8")
rels = data["word/_rels/document.xml.rels"].decode("utf-8")

# --- 1. map sections to footers ---
sectprs = re.findall(r"<w:sectPr[\s\S]*?</w:sectPr>", doc)
print("sections found:", len(sectprs))
rid2target = dict(re.findall(r'Id="(rId\d+)"[^>]*Target="([^"]+)"', rels))

section_footers = []
for sp in sectprs:
    m = re.search(r'<w:footerReference w:type="default" r:id="(rId\d+)"', sp)
    section_footers.append(rid2target.get(m.group(1)) if m else None)
print("section footers:", section_footers)

# expected: [None, None, footer(front=roman), footer(body=arabic)]
roman_footer = section_footers[2] if len(section_footers) > 2 else None
arabic_footer = section_footers[3] if len(section_footers) > 3 else None

def patch_footer(target, fmt):
    key = "word/" + target
    xml = data[key].decode("utf-8")
    xml2, n = re.subn(
        r"(<w:instrText[^>]*>)\s*PAGE\s*(</w:instrText>)",
        r"\1 PAGE \\* " + fmt + r" \\* MERGEFORMAT \2",
        xml)
    data[key] = xml2.encode("utf-8")
    print(f"patched {key} with {fmt}: {n} field(s)")

if roman_footer:
    patch_footer(roman_footer, "ROMAN")
if arabic_footer:
    patch_footer(arabic_footer, "arabic")

# --- 2. remove empty pgNumType ---
doc, n = re.subn(r"<w:pgNumType/>", "", doc)
print("removed empty pgNumType:", n)

# --- 3. RTL TOC entries in document.xml ---
# entry paragraphs use TOC styles; inject <w:bidi/> after the tabs element in their pPr
def add_bidi_to_entries(xml):
    count = 0
    def repl(m):
        nonlocal count
        block = m.group(0)
        if "<w:bidi/>" in block:
            return block
        if "</w:tabs>" in block:
            count += 1
            return block.replace("</w:tabs>", "</w:tabs><w:bidi/>", 1)
        count += 1
        return block.replace("</w:pPr>", "<w:bidi/></w:pPr>", 1)
    xml = re.sub(r"<w:pPr><w:pStyle w:val=\"(?:TOC1|TOC2|TOC3|9|11|12)\"/>[\s\S]*?</w:pPr>", repl, xml)
    return xml, count

doc, n_entries = add_bidi_to_entries(doc)
print("bidi added to TOC entry paragraphs:", n_entries)
data["word/document.xml"] = doc.encode("utf-8")

# --- 4. RTL TOC styles in styles.xml (for when Word regenerates entries) ---
styles = data["word/styles.xml"].decode("utf-8")
n_styles = 0
def patch_style(m):
    global n_styles
    block = m.group(0)
    if "<w:bidi/>" in block:
        return block
    n_styles += 1
    if "<w:pPr>" in block:
        if "</w:tabs>" in block:
            return block.replace("</w:tabs>", "</w:tabs><w:bidi/>", 1)
        return block.replace("<w:pPr>", "<w:pPr><w:bidi/>", 1)
    return block.replace("</w:style>", "<w:pPr><w:bidi/></w:pPr></w:style>", 1)

styles = re.sub(
    r'<w:style w:type="paragraph"[^>]*w:styleId="(?:TOC1|TOC2|TOC3|9|11|12)"[\s\S]*?</w:style>',
    patch_style, styles)
print("bidi added to TOC styles:", n_styles)
data["word/styles.xml"] = styles.encode("utf-8")

# --- write back ---
zout = zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED)
for n in names:
    zout.writestr(n, data[n])
zout.close()
shutil.move(tmp, path)
print("patched:", path)
