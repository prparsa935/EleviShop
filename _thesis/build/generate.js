// Assemble the full thesis document
const {
  Document, Packer, Paragraph, TextRun, Header, Footer, PageNumber,
  AlignmentType, NumberFormat, SectionType, BorderStyle, TableOfContents, PageBreak,
} = require("docx");
const fs = require("fs");
const path = require("path");

const H = require("./helpers");
const F = require("./front");
const CH = { 1: require("./ch1"), 2: require("./ch2"), 3: require("./ch3"), 4: require("./ch4"), 5: require("./ch5") };
const B = require("./back");

const PAGE = { size: { width: 11906, height: 16838 } };
// RTL binding: wider margin on the right
const MARGIN = { top: 1440, bottom: 1440, left: 1417, right: 1701, header: 850, footer: 992 };

const THESIS_HEADER = "طراحی و پیاده‌سازی فروشگاه اینترنتی الوی‌شاپ";

function arabicFooter() {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: [PageNumber.CURRENT], size: 22, font: H.FONTS_EN_ONLY })],
    })],
  });
}

function bodyHeader() {
  return new Header({
    children: [new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.CENTER,
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "333333" } },
      spacing: { after: 60 },
      children: [H.faRun(THESIS_HEADER, { size: 18, color: "333333" })],
    })],
  });
}

function tocBlock() {
  return [
    new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.CENTER,
      pageBreakBefore: true,
      spacing: { before: 240, after: 360, line: 500, lineRule: "atLeast" },
      children: [H.faRun("فهرست مطالب", { bold: true, size: 32 })],
    }),
    new TableOfContents("فهرست مطالب", { hyperlink: true, headingStyleRange: "1-3" }),
    new Paragraph({
      bidirectional: true,
      spacing: { before: 200 },
      children: [H.faRun("توجه: این فهرست با کد فیلد ساخته شده است؛ پس از هرگونه ویرایش، برای به‌روزرسانی شماره صفحه‌ها روی فهرست راست‌کلیک کرده و گزینه «به‌روزرسانی فیلد» را انتخاب کنید.", { italics: true, size: 18, color: "888888" })],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

const frontMatterChildren = [
  ...F.buildDedication(),
  ...F.buildAcknowledgments(),
  ...F.buildAbstractFa(),
  ...F.buildAbstractEn(),
  ...tocBlock(),
  ...B.buildTableList(),
  ...B.buildFigureList(),
];

const bodyChildren = [
  ...CH[1],
  ...CH[2],
  ...CH[3],
  ...CH[4],
  ...CH[5],
  ...B.buildReferences(),
  ...B.buildAppendixA(),
  ...B.buildAppendixB(),
];

const doc = new Document({
  creator: "EleviShop Thesis",
  title: "طراحی و پیاده‌سازی فروشگاه اینترنتی محصولات سرامیکی (الوی‌شاپ)",
  description: "پایان‌نامه",
  features: { updateFields: true },
  styles: {
    default: {
      document: {
        run: { font: H.FONTS, size: 24, color: "000000" },
        paragraph: { spacing: { line: 360 } },
      },
      heading1: {
        run: { font: H.FONTS, size: 32, bold: true, color: "000000" },
        paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 240, after: 360, line: 360 } },
      },
      heading2: {
        run: { font: H.FONTS, size: 28, bold: true, color: "000000" },
        paragraph: { spacing: { before: 300, after: 180, line: 360 } },
      },
      heading3: {
        run: { font: H.FONTS, size: 26, bold: true, color: "000000" },
        paragraph: { spacing: { before: 240, after: 120, line: 360 } },
      },
    },
  },
  sections: [
    {
      // 1) Cover — no page number, no header/footer
      properties: { page: { ...PAGE, margin: { top: 0, bottom: 0, left: 0, right: 0 } } },
      children: F.buildCover(),
    },
    {
      // 2) Bismillah — own page, unnumbered
      properties: { type: SectionType.NEXT_PAGE, page: { ...PAGE, margin: MARGIN } },
      children: F.buildBismillah(),
    },
    {
      // 3) Front matter — Roman numerals
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { ...PAGE, margin: MARGIN, pageNumbers: { start: 1, formatType: NumberFormat.UPPER_ROMAN } },
      },
      footers: { default: arabicFooter() },
      children: frontMatterChildren,
    },
    {
      // 4) Body + references + appendices — Arabic numerals from 1
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { ...PAGE, margin: MARGIN, pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } },
      },
      headers: { default: bodyHeader() },
      footers: { default: arabicFooter() },
      children: bodyChildren,
    },
  ],
});

const OUT = process.argv[2] || path.join(__dirname, "..", "EleviShop-Thesis.docx");
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT, buf);
  console.log("written:", OUT, buf.length, "bytes");
});
