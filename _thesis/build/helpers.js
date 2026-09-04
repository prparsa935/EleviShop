// RTL-aware docx builders for the Persian thesis (B Nazanin 12 body)
const {
  Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
} = require("docx");
const fs = require("fs");
const path = require("path");

const FA_FONT = "B Nazanin";
const EN_FONT = "Times New Roman";
const FONTS = { ascii: EN_FONT, hAnsi: EN_FONT, cs: FA_FONT };
const FONTS_EN_ONLY = { ascii: EN_FONT, hAnsi: EN_FONT, cs: EN_FONT };
const INK = "000000";

const FIGS = path.join(__dirname, "..", "figs");
const MANIFEST = JSON.parse(fs.readFileSync(path.join(FIGS, "manifest.json"), "utf-8"));

const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const NO_BORDERS = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

function safeText(v, ph) {
  if (v === undefined || v === null || v === "" || String(v) === "NaN" || String(v) === "undefined") {
    return ph || "\u3010\u0645\u0642\u062f\u0627\u0631 \u0631\u0627 \u0628\u0646\u0648\u06cc\u0633\u06cc\u062f\u3011";
  }
  return String(v);
}

// Persian run: mixed Persian/Latin text in one run; Word picks cs font for Persian, ascii font for Latin
function faRun(text, o = {}) {
  const size = o.size || 24;
  return new TextRun({
    text: safeText(text, "\u3010\u0645\u062a\u0646\u3011"),
    rightToLeft: true,
    font: FONTS,
    size,
    sizeComplexScript: size,
    bold: !!o.bold,
    boldComplexScript: !!o.bold,
    italics: !!o.italics,
    color: o.color || INK,
  });
}

// Pure-Latin run (for English abstract, code identifiers as standalone blocks)
function enRun(text, o = {}) {
  const size = o.size || 24;
  return new TextRun({
    text: safeText(text, "[text]"),
    font: FONTS_EN_ONLY,
    size,
    sizeComplexScript: size,
    bold: !!o.bold,
    italics: !!o.italics,
    color: o.color || INK,
  });
}

// Body paragraph. segs: string OR array of {t, en, b} segments
function p(segs, o = {}) {
  const arr = typeof segs === "string" ? [{ t: segs }] : segs;
  return new Paragraph({
    bidirectional: true,
    alignment: o.align || AlignmentType.JUSTIFIED,
    indent: o.noIndent ? undefined : { firstLine: o.firstLine !== undefined ? o.firstLine : 400 },
    spacing: { line: o.line || 360, before: o.before || 0, after: o.after || 120 },
    children: arr.map(s => s.en ? enRun(s.t, { bold: s.b, size: s.size || o.size || 24 }) : faRun(s.t, { bold: s.b, size: s.size || o.size || 24 })),
  });
}

// Manual numbered list item (Persian numeral passed in text) — hanging indent on the right
function li(text, o = {}) {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.JUSTIFIED,
    indent: { left: 900, hanging: 460 },
    spacing: { line: 360, after: o.after !== undefined ? o.after : 60 },
    children: [faRun(text, { bold: o.bold })],
  });
}

function h1(text, o = {}) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    bidirectional: true,
    alignment: AlignmentType.CENTER,
    pageBreakBefore: !o.noBreak,
    spacing: { before: 240, after: 360, line: 500, lineRule: "atLeast" },
    children: [faRun(text, { bold: true, size: 32 })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    keepNext: true,
    spacing: { before: 300, after: 180, line: 420, lineRule: "atLeast" },
    children: [faRun(text, { bold: true, size: 28 })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    keepNext: true,
    spacing: { before: 240, after: 120, line: 400, lineRule: "atLeast" },
    children: [faRun(text, { bold: true, size: 26 })],
  });
}

// ---------- captions ----------
function tableCaption(text) {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.CENTER,
    keepNext: true,
    spacing: { before: 240, after: 120, line: 340 },
    children: [faRun(text, { bold: true, size: 22 })],
  });
}

function figCaption(text) {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 240, line: 340 },
    children: [faRun(text, { bold: true, size: 22 })],
  });
}

function figure(name, o = {}) {
  const meta = MANIFEST[name];
  if (!meta) throw new Error("missing figure: " + name);
  const width = o.width || 540;
  const height = Math.round(width * meta.h / meta.w);
  const img = new Paragraph({
    alignment: AlignmentType.CENTER,
    keepNext: true,
    spacing: { before: 200, after: 0 },
    children: [new ImageRun({
      data: fs.readFileSync(path.join(FIGS, name + ".png")),
      transformation: { width, height },
      type: "png",
    })],
  });
  return img;
}

// ---------- three-line table (RTL) ----------
function t3({ widths, header, rows, aligns }) {
  // widths: percentage numbers summing 100 (RTL: first item = rightmost column)
  const alignFor = (i) => (aligns && aligns[i]) || AlignmentType.CENTER;
  const lastIdx = rows.length - 1;
  const mk = (text, i, isHeader, isLast) => new TableCell({
    width: { size: widths[i], type: WidthType.PERCENTAGE },
    borders: (isHeader
      ? { top: NB, left: NB, right: NB, bottom: { style: BorderStyle.SINGLE, size: 4, color: INK } }
      : { top: NB, left: NB, right: NB, bottom: isLast ? { style: BorderStyle.SINGLE, size: 8, color: INK } : NB }),
    shading: isHeader ? { type: ShadingType.CLEAR, fill: "F5F7FA" } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({
      bidirectional: true,
      alignment: isHeader ? AlignmentType.CENTER : alignFor(i),
      spacing: { line: 300 },
      children: [faRun(text, { bold: isHeader, size: 22 })],
    })],
  });
  return new Table({
    visuallyRightToLeft: true,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: INK },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: INK },
      left: NB, right: NB, insideHorizontal: NB, insideVertical: NB,
    },
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: header.map((t, i) => mk(t, i, true, false)) }),
      ...rows.map((r, ri) => new TableRow({ cantSplit: true, children: r.map((t, i) => mk(t, i, false, ri === lastIdx)) })),
    ],
  });
}

// Unnumbered front-matter section title (plain, NOT a Heading style)
function fmTitle(text) {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.CENTER,
    pageBreakBefore: true,
    spacing: { before: 240, after: 360, line: 500, lineRule: "atLeast" },
    children: [faRun(text, { bold: true, size: 32 })],
  });
}

// First front-matter title of the section (no page break before)
function fmTitleFirst(text) {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 360, line: 500, lineRule: "atLeast" },
    children: [faRun(text, { bold: true, size: 32 })],
  });
}

// Static list table for فهرست جداول / فهرست اشکال (entries filled in second pass)
function listOf(items, kindLabel) {
  return new Table({
    visuallyRightToLeft: true,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: INK },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: INK },
      left: NB, right: NB, insideHorizontal: NB, insideVertical: NB,
    },
    rows: [
      new TableRow({
        tableHeader: true, cantSplit: true,
        children: [
          new TableCell({
            width: { size: 16, type: WidthType.PERCENTAGE },
            borders: { top: NB, left: NB, right: NB, bottom: { style: BorderStyle.SINGLE, size: 4, color: INK } },
            shading: { type: ShadingType.CLEAR, fill: "F5F7FA" },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            children: [new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER, spacing: { line: 300 }, children: [faRun(kindLabel, { bold: true, size: 22 })] })],
          }),
          new TableCell({
            width: { size: 72, type: WidthType.PERCENTAGE },
            borders: { top: NB, left: NB, right: NB, bottom: { style: BorderStyle.SINGLE, size: 4, color: INK } },
            shading: { type: ShadingType.CLEAR, fill: "F5F7FA" },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            children: [new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER, spacing: { line: 300 }, children: [faRun("عنوان", { bold: true, size: 22 })] })],
          }),
          new TableCell({
            width: { size: 12, type: WidthType.PERCENTAGE },
            borders: { top: NB, left: NB, right: NB, bottom: { style: BorderStyle.SINGLE, size: 4, color: INK } },
            shading: { type: ShadingType.CLEAR, fill: "F5F7FA" },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            children: [new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER, spacing: { line: 300 }, children: [faRun("صفحه", { bold: true, size: 22 })] })],
          }),
        ],
      }),
      ...items.map(it => new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: 16, type: WidthType.PERCENTAGE },
            borders: { top: NB, left: NB, right: NB, bottom: NB },
            margins: { top: 40, bottom: 40, left: 100, right: 100 },
            children: [new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER, spacing: { line: 300 }, children: [faRun(it.no, { size: 22 })] })],
          }),
          new TableCell({
            width: { size: 72, type: WidthType.PERCENTAGE },
            borders: { top: NB, left: NB, right: NB, bottom: NB },
            margins: { top: 40, bottom: 40, left: 100, right: 100 },
            children: [new Paragraph({ bidirectional: true, alignment: AlignmentType.RIGHT, spacing: { line: 300 }, children: [faRun(it.title, { size: 22 })] })],
          }),
          new TableCell({
            width: { size: 12, type: WidthType.PERCENTAGE },
            borders: { top: NB, left: NB, right: NB, bottom: NB },
            margins: { top: 40, bottom: 40, left: 100, right: 100 },
            children: [new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER, spacing: { line: 300 }, children: [faRun(it.page, { size: 22 })] })],
          }),
        ],
      })),
    ],
  });
}

module.exports = {
  FA_FONT, EN_FONT, FONTS, FONTS_EN_ONLY, INK, NB, NO_BORDERS,
  safeText, faRun, enRun, p, li, h1, h2, h3,
  tableCaption, figCaption, figure, t3, fmTitle, fmTitleFirst, listOf,
};
