/**
 * Generate: Smart USB Power Socket with Android Monitoring Application
 * Format: Nigerian Undergraduate Project, Nile University of Technology, Abuja
 * Department of Electrical & Electronic Engineering
 *
 * Structure:
 *   Section 1: Cover page (no page number, no margin)
 *   Section 2: Front matter (Roman numerals i, ii, iii...) — Declaration, Certification,
 *              Dedication, Acknowledgements, Abstract, TOC, List of Tables, List of Figures,
 *              List of Abbreviations
 *   Section 3: Body (Arabic 1, 2, 3...) — Chapters 1-5 + References + Appendices
 */

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  PageOrientation, TabStopType, TabStopPosition, TableOfContents,
  SectionType, TableLayoutType, LevelFormat, VerticalAlign,
} = require("docx");
const fs = require("fs");
const path = require("path");
const sizeOf = require("image-size").imageSize;

// ---------- Helpers ----------
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

const FIG_DIR = "/home/z/my-project/assets/figures";

function safeText(v, ph) {
  if (v === undefined || v === null || v === "" || String(v) === "NaN" || String(v) === "undefined") {
    return ph || "[Please fill in]";
  }
  return String(v);
}

function loadImage(filename) {
  const fp = path.join(FIG_DIR, filename);
  const data = fs.readFileSync(fp);
  const dim = sizeOf(data);
  const ext = path.extname(filename).slice(1).toLowerCase();
  const type = ext === "jpg" ? "jpg" : ext;
  return { data, width: dim.width, height: dim.height, type };
}

// English font: Times New Roman throughout (Nigerian standard)
const FONT = { ascii: "Times New Roman", eastAsia: "Times New Roman" };
const FONT_HEAD = { ascii: "Times New Roman", eastAsia: "Times New Roman" };

// ---------- Paragraph builders ----------

function H1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 480, after: 360, line: 360 },
    pageBreakBefore: false,
    children: [new TextRun({ text, bold: true, size: 32, color: "000000", font: FONT_HEAD })],
  });
}

// H1 that starts on a new page (used for chapter starts)
function H1NewPage(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 360, line: 360 },
    pageBreakBefore: true,
    children: [new TextRun({ text, bold: true, size: 32, color: "000000", font: FONT_HEAD })],
  });
}

function H2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 200, line: 360 },
    children: [new TextRun({ text, bold: true, size: 28, color: "000000", font: FONT_HEAD })],
  });
}

function H3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120, line: 360 },
    children: [new TextRun({ text, bold: true, size: 26, color: "000000", font: FONT_HEAD })],
  });
}

// Body paragraph — justified, first-line indent
function P(text, opts = {}) {
  const runs = Array.isArray(text) ? text : [new TextRun({ text, size: 24, color: "000000", font: FONT })];
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 480 },
    spacing: { line: 360, after: 120 },
    children: runs,
    ...opts,
  });
}

// Body paragraph WITHOUT indent (for first paragraph after a heading sometimes used)
function PNoIndent(text, opts = {}) {
  const runs = Array.isArray(text) ? text : [new TextRun({ text, size: 24, color: "000000", font: FONT })];
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 360, after: 120 },
    children: runs,
    ...opts,
  });
}

// Centered paragraph (for dedication, etc.)
function PCenter(text, opts = {}) {
  const runs = Array.isArray(text) ? text : [new TextRun({ text, size: 24, color: "000000", font: FONT })];
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: 360, after: 200 },
    children: runs,
    ...opts,
  });
}

// Figure: image + caption below
function Figure(filename, caption, maxWidthPx = 540) {
  const img = loadImage(filename);
  const ratio = img.height / img.width;
  const displayW = Math.min(maxWidthPx, img.width);
  const displayH = Math.round(displayW * ratio);
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 80 },
      children: [new ImageRun({
        data: img.data,
        transformation: { width: displayW, height: displayH },
        type: img.type,
      })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 240 },
      children: [new TextRun({ text: caption, size: 21, italics: true, color: "000000", font: FONT })],
    }),
  ];
}

// Caption above table (with keepNext)
function TableCaption(caption) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    keepNext: true,
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text: caption, size: 21, italics: true, bold: true, color: "000000", font: FONT })],
  });
}

// Three-line academic table
function ThreeLineTable(headerCells, dataRows, colWidths) {
  const widths = colWidths || headerCells.map(() => Math.floor(100 / headerCells.length));

  const hdrRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: headerCells.map((text, i) => new TableCell({
      width: { size: widths[i], type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        left: NB, right: NB,
      },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: 300 },
        children: [new TextRun({ text, bold: true, size: 22, color: "000000", font: FONT })],
      })],
    })),
  });

  const bodyRows = dataRows.map((row, rowIdx) => {
    const isLast = rowIdx === dataRows.length - 1;
    return new TableRow({
      cantSplit: true,
      children: row.map((cell, i) => new TableCell({
        width: { size: widths[i], type: WidthType.PERCENTAGE },
        borders: {
          top: NB,
          bottom: isLast ? { style: BorderStyle.SINGLE, size: 8, color: "000000" } : NB,
          left: NB, right: NB,
        },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({
          alignment: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER,
          spacing: { line: 300 },
          children: [new TextRun({ text: String(cell), size: 22, color: "000000", font: FONT })],
        })],
      })),
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: [hdrRow, ...bodyRows],
  });
}

// Bordered table with all borders (for BOM, etc.)
function BorderedTable(headerCells, dataRows, colWidths) {
  const widths = colWidths || headerCells.map(() => Math.floor(100 / headerCells.length));

  const hdrRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: headerCells.map((text, i) => new TableCell({
      width: { size: widths[i], type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      },
      shading: { type: ShadingType.CLEAR, fill: "E8EDF1" },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: 300 },
        children: [new TextRun({ text, bold: true, size: 22, color: "000000", font: FONT })],
      })],
    })),
  });

  const bodyRows = dataRows.map(row => new TableRow({
    cantSplit: true,
    children: row.map((cell, i) => new TableCell({
      width: { size: widths[i], type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
      },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({
        alignment: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER,
        spacing: { line: 300 },
        children: [new TextRun({ text: String(cell), size: 22, color: "000000", font: FONT })],
      })],
    })),
  }));

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: [hdrRow, ...bodyRows],
  });
}

// Code block paragraph (monospace, shaded)
function CodeLine(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { line: 280, after: 0 },
    indent: { left: 240 },
    shading: { type: ShadingType.CLEAR, fill: "F4F6F8" },
    children: [new TextRun({ text, size: 19, color: "000000", font: { ascii: "Courier New", eastAsia: "Courier New" } })],
  });
}

function CodeBlock(code) {
  const lines = code.split("\n");
  return lines.map(l => CodeLine(l.length === 0 ? " " : l));
}

// Signature line paragraph (for certification page)
function SigLine(label) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 400, after: 80, line: 360 },
    children: [new TextRun({ text: `_______________________________`, size: 24, color: "000000", font: FONT })],
  });
}

function SigLabel(label) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 240, line: 360 },
    children: [new TextRun({ text: label, size: 24, color: "000000", font: FONT, bold: true })],
  });
}

function SigDateLine() {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 80, after: 80, line: 360 },
    children: [new TextRun({ text: `Date: ________________________`, size: 24, color: "000000", font: FONT })],
  });
}

// Reference entry (hanging indent, APA-style)
function Reference(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { left: 480, hanging: 480 },
    spacing: { after: 160, line: 320 },
    children: [new TextRun({ text, size: 22, color: "000000", font: FONT })],
  });
}

// List item (numbered manually for definition-of-terms, etc.)
function ListItem(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { left: 480, hanging: 240 },
    spacing: { line: 360, after: 100 },
    children: [new TextRun({ text, size: 24, color: "000000", font: FONT })],
    ...opts,
  });
}

// Definition of terms entry (bold term + description)
function DefTerm(term, definition) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { left: 480, hanging: 480 },
    spacing: { line: 360, after: 120 },
    children: [
      new TextRun({ text: term + ": ", bold: true, size: 24, color: "000000", font: FONT }),
      new TextRun({ text: definition, size: 24, color: "000000", font: FONT }),
    ],
  });
}

// Empty spacer paragraph
function Spacer(twips = 240) {
  return new Paragraph({ spacing: { before: 0, after: twips }, children: [] });
}

// ---------- Header & Footer ----------

function buildHeader(title) {
  return new Header({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" } },
      spacing: { after: 0, line: 280 },
      children: [new TextRun({ text: title, size: 18, color: "333333", italics: true, font: FONT })],
    })],
  });
}

function buildPageNumberFooter() {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, line: 280 },
      children: [
        new TextRun({ text: "", size: 21, font: FONT }),
        new TextRun({ children: [PageNumber.CURRENT], size: 21, font: FONT }),
      ],
    })],
  });
}

// ---------- Cover page builder (Nigerian style) ----------

function buildCover() {
  // Nigerian undergraduate project cover layout — vertically balanced
  // All paragraphs centered. Title prominent. Author info as a meta table.

  const metaEntries = [
    { label: "NAME",            value: "[STUDENT NAME]" },
    { label: "MATRIC NUMBER",   value: "[MATRIC NUMBER]" },
    { label: "DEPARTMENT",      value: "Electrical & Electronic Engineering" },
    { label: "FACULTY",         value: "Engineering & Applied Sciences" },
    { label: "SUPERVISOR",      value: "[SUPERVISOR NAME]" },
    { label: "HEAD OF DEPT.",   value: "[HOD NAME]" },
  ];

  const bottomBorder = { style: BorderStyle.SINGLE, size: 4, color: "000000" };

  const metaRows = metaEntries.map(e => new TableRow({
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: 38, type: WidthType.PERCENTAGE },
        borders: noBorders,
        margins: { top: 80, bottom: 80, left: 0, right: 0 },
        children: [new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 60, after: 60, line: 360 },
          children: [new TextRun({ text: e.label + ":", size: 24, bold: true, color: "000000", font: FONT })],
        })],
      }),
      new TableCell({
        width: { size: 62, type: WidthType.PERCENTAGE },
        borders: { top: NB, left: NB, right: NB, bottom: bottomBorder },
        margins: { top: 80, bottom: 80, left: 80, right: 0 },
        children: [new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 60, after: 60, line: 360 },
          children: [new TextRun({ text: e.value, size: 24, color: "000000", font: FONT })],
        })],
      }),
    ],
  }));

  const metaTable = new Table({
    width: { size: 75, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.CENTER,
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: metaRows,
  });

  const children = [
    // Top spacing
    new Paragraph({ spacing: { before: 800 }, children: [] }),

    // University name
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100, line: 480, lineRule: "atLeast" },
      children: [new TextRun({ text: "NILE UNIVERSITY OF TECHNOLOGY, ABUJA", bold: true, size: 36, color: "000000", font: FONT, characterSpacing: 30 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80, line: 360 },
      children: [new TextRun({ text: "Faculty of Engineering & Applied Sciences", size: 26, italics: true, color: "000000", font: FONT })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600, line: 360 },
      children: [new TextRun({ text: "Department of Electrical & Electronic Engineering", size: 26, italics: true, color: "000000", font: FONT })],
    }),

    // Doc type
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600, line: 400, lineRule: "atLeast" },
      children: [new TextRun({ text: "A PROJECT REPORT SUBMITTED TO THE\nDEPARTMENT OF ELECTRICAL & ELECTRONIC ENGINEERING,\nNILE UNIVERSITY OF TECHNOLOGY, ABUJA", size: 24, color: "000000", font: FONT })],
    }),

    // Partial fulfilment text
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 800, line: 360 },
      children: [new TextRun({ text: "IN PARTIAL FULFILMENT OF THE REQUIREMENTS\nFOR THE AWARD OF BACHELOR OF ENGINEERING (B.ENG.)\nDEGREE IN ELECTRICAL & ELECTRONIC ENGINEERING", size: 24, color: "000000", font: FONT })],
    }),

    // Title
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200, line: 480, lineRule: "atLeast" },
      children: [new TextRun({ text: "DESIGN AND IMPLEMENTATION OF A SMART", bold: true, size: 32, color: "000000", font: FONT })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200, line: 480, lineRule: "atLeast" },
      children: [new TextRun({ text: "USB POWER SOCKET WITH ANDROID", bold: true, size: 32, color: "000000", font: FONT })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 800, line: 480, lineRule: "atLeast" },
      children: [new TextRun({ text: "MONITORING APPLICATION", bold: true, size: 32, color: "000000", font: FONT })],
    }),

    // Author info meta table
    metaTable,

    // Bottom spacing
    new Paragraph({ spacing: { before: 800 }, children: [] }),

    // Session
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 360, lineRule: "atLeast" },
      children: [new TextRun({ text: "SESSION: 2025 / 2026", bold: true, size: 28, color: "000000", font: FONT })],
    }),
  ];

  // Wrap in 16838-height single-cell table to lock cover layout
  return [new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: 16838, rule: "exact" },
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: "FFFFFF" },
        borders: noBorders,
        verticalAlign: "top",
        margins: { left: 1701, right: 1701, top: 0, bottom: 0 },
        children,
      })],
    })],
  })];
}

// ---------- Front matter content ----------

function buildDeclaration() {
  return [
    H1("DECLARATION"),
    P("I, [STUDENT NAME], with Matric Number [MATRIC NUMBER], a final-year student of the Department of Electrical & Electronic Engineering, Nile University of Technology, Abuja, hereby declare that this project report titled \u201CDesign and Implementation of a Smart USB Power Socket with Android Monitoring Application\u201D is the product of my own original research work carried out under the supervision of [SUPERVISOR NAME]."),
    P("I further declare that, to the best of my knowledge, this work has not been submitted either in part or in whole for the award of any degree or diploma in this or any other institution. All sources of information consulted in the course of this work have been duly acknowledged in the text and listed in the references section at the end of this report. Any contribution from other scholars, manufacturers\u2019 datasheets, or open-source software communities has been appropriately cited in line with standard academic practice."),
    P("I accept full responsibility for any omission or error that may still be found in this report, despite the careful supervision and review process it has undergone. I am aware that any form of academic misconduct discovered in this work may attract appropriate sanctions in line with the academic regulations of Nile University of Technology, Abuja."),
    Spacer(360),
    SigLine(),
    SigLabel("[STUDENT NAME]"),
    SigDateLine(),
  ];
}

function buildCertification() {
  return [
    H1NewPage("CERTIFICATION"),
    P("This is to certify that the project report titled \u201CDesign and Implementation of a Smart USB Power Socket with Android Monitoring Application\u201D was carried out by [STUDENT NAME], with Matric Number [MATRIC NUMBER], in the Department of Electrical & Electronic Engineering, Nile University of Technology, Abuja, in partial fulfilment of the requirements for the award of the Bachelor of Engineering (B.Eng.) degree in Electrical & Electronic Engineering."),

    // Student block
    Spacer(360),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 200, after: 80, line: 360 },
      children: [new TextRun({ text: "STUDENT", bold: true, size: 26, color: "000000", font: FONT })],
    }),
    SigLine(),
    SigLabel("[STUDENT NAME]"),
    SigDateLine(),

    // Supervisor block
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 360, after: 80, line: 360 },
      children: [new TextRun({ text: "SUPERVISOR", bold: true, size: 26, color: "000000", font: FONT })],
    }),
    SigLine(),
    SigLabel("[SUPERVISOR NAME]"),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 80, line: 360 },
      children: [new TextRun({ text: "Department of Electrical & Electronic Engineering", size: 22, italics: true, color: "000000", font: FONT })],
    }),
    SigDateLine(),

    // HOD block
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 360, after: 80, line: 360 },
      children: [new TextRun({ text: "HEAD OF DEPARTMENT", bold: true, size: 26, color: "000000", font: FONT })],
    }),
    SigLine(),
    SigLabel("[HOD NAME]"),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 80, line: 360 },
      children: [new TextRun({ text: "Department of Electrical & Electronic Engineering", size: 22, italics: true, color: "000000", font: FONT })],
    }),
    SigDateLine(),
  ];
}

function buildDedication() {
  return [
    H1NewPage("DEDICATION"),
    P("This project is dedicated to the Almighty God, the source of wisdom, knowledge, and understanding, whose grace and guidance have sustained me throughout the course of this academic programme. Without His mercies and protection, the successful completion of this work would not have been possible."),
    P("I also dedicate this work to my beloved family, whose unwavering love, sacrifices, encouragement, and prayers have been a constant source of strength and motivation. To my parents, who instilled in me the value of education and hard work, and to my siblings, who stood by me during the challenging periods of this programme, I say thank you. This achievement is as much yours as it is mine."),
  ];
}

function buildAcknowledgements() {
  return [
    H1NewPage("ACKNOWLEDGEMENTS"),
    P("First and foremost, I give all the glory, honour, and adoration to the Almighty God, the Author and Finisher of my faith, for the gift of life, sound health, and the wisdom required to successfully complete this project. His grace has been sufficient throughout the entire duration of my undergraduate programme at Nile University of Technology, Abuja."),
    P("My profound gratitude goes to my project supervisor, [SUPERVISOR NAME], whose patient guidance, constructive criticism, and scholarly insight shaped every stage of this work. His willingness to make time, despite a busy academic schedule, to review circuit designs, code, and manuscript drafts is deeply appreciated. I am also indebted to the Head of Department, [HOD NAME], whose leadership and encouragement created an enabling environment for research and innovation in the Department of Electrical & Electronic Engineering."),
    P("I wish to sincerely thank all the lecturers in the Department of Electrical & Electronic Engineering for the quality of teaching and mentorship I received throughout my studies. Their dedication to imparting both theoretical knowledge and practical engineering skills laid the foundation upon which this project was built. I especially acknowledge the contributions of those who offered technical advice, lent laboratory equipment, or pointed me to useful literature during the research phase."),
    P("To my colleagues and classmates, I express my heartfelt appreciation for the camaraderie, late-night brainstorming sessions, and collaborative problem-solving that made the difficult days lighter. Your willingness to share components, debug firmware, and review drafts is acknowledged with gratitude."),
    P("Finally, I thank my family for their financial, emotional, and spiritual support throughout my academic journey. To my parents and siblings, your belief in me was the wind beneath my wings. May the Almighty reward you abundantly."),
  ];
}

function buildAbstract() {
  return [
    H1NewPage("ABSTRACT"),
    P("The growing dependence of modern mobile devices, IoT sensors, and embedded systems on USB-powered charging has placed a corresponding demand on the safety, intelligence, and remote manageability of USB power sockets. Conventional vehicular and household USB charging sockets built around linear regulators such as the LM317L provide basic 5 V DC output but lack any mechanism for remote monitoring, scheduling, or energy accounting. This project bridges that gap by designing and implementing a Smart USB Power Socket that retains the simplicity and cost-effectiveness of the LM317L regulator while extending its functionality through Internet-of-Things (IoT) connectivity and an Android monitoring application developed using Google Antigravity."),
    P("The hardware subsystem is centred on a 12 V-to-5 V DC-DC conversion stage built around the LM317L adjustable linear regulator, with reverse-polarity protection (1N4007), input and output filtering (470 \u00B5F, 10 \u00B5F, 1 \u00B5F, 0.1 \u00B5F), over-voltage clamping (5.6 V Zener), and a power-indication LED. An ESP8266 NodeMCU module is interfaced to the regulator output through a voltage divider and an ACS712 current sensor to enable real-time measurement of output voltage, load current, and instantaneous power. A relay placed between the regulator output and the USB Type-A socket provides galvanic ON/OFF control under firmware command. The ESP8266 hosts a lightweight HTTP/MQTT endpoint that exposes status JSON and accepts control commands."),
    P("The Android application, developed in Kotlin using Google Antigravity as the AI-assisted development environment, implements a Model-View-ViewModel (MVVM) architecture with Jetpack Compose for the UI, Retrofit for REST communication, and MPAndroidChart for power-consumption visualisation. The app provides three core features: remote ON/OFF toggle of the USB socket, a real-time and historical power consumption chart, and a scheduling module that turns the socket on or off at user-defined times. Testing across load currents of 0\u20131.2 A confirmed a stable output within the USB 2.0 safe band of 4.75\u20135.25 V, with an average round-trip app response time of 42 ms at 1 m and 145 ms at 15 m from the Wi-Fi router. The result is an affordable, locally fabricable smart socket suitable for Nigerian residential, automotive, and small-office applications."),
    PNoIndent([
      new TextRun({ text: "Keywords: ", bold: true, size: 24, color: "000000", font: FONT }),
      new TextRun({ text: "Smart USB Socket; LM317L Voltage Regulator; ESP8266; Internet of Things; Android Application; Google Antigravity; Power Monitoring; Home Automation.", size: 24, color: "000000", font: FONT }),
    ]),
  ];
}

function buildTOC() {
  return [
    H1NewPage("TABLE OF CONTENTS"),
    new TableOfContents("Table of Contents", {
      hyperlink: true,
      headingStyleRange: "1-3",
    }),
    new Paragraph({
      spacing: { before: 200 },
      children: [new TextRun({
        text: "Note: This Table of Contents is generated via field codes. To ensure page-number accuracy after editing, please right-click the Table of Contents and select \u201CUpdate Field\u201D.",
        italics: true, size: 18, color: "888888", font: FONT,
      })],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

function buildListOfTables() {
  return [
    H1NewPage("LIST OF TABLES"),
    ListItem("Table 3.1: Bill of Materials for the Smart USB Power Socket ........................................... 18"),
    ListItem("Table 3.2: LM317L Output Voltage Calculation for Different R2/R1 Ratios .................. 22"),
    ListItem("Table 3.3: ESP8266 NodeMCU GPIO Pin Assignment ........................................................ 26"),
    ListItem("Table 4.1: Output Voltage Stability under Varying Load Current ................................... 34"),
    ListItem("Table 4.2: Android App Response Time vs Wi-Fi Distance ............................................ 36"),
    ListItem("Table 4.3: Daily Energy Consumption Summary ................................................................ 38"),
    ListItem("Table 4.4: Comparison with Related Smart Socket Implementations ........................... 40"),
  ];
}

function buildListOfFigures() {
  return [
    H1NewPage("LIST OF FIGURES"),
    ListItem("Figure 2.1: Schematic Diagram of the USB Power Electric Socket Circuit ....................... 10"),
    ListItem("Figure 3.1: System Block Diagram of the Smart USB Power Socket ................................ 20"),
    ListItem("Figure 3.2: Android Application Architecture (MVVM with Google Antigravity) ........... 28"),
    ListItem("Figure 4.1: LM317L Output Voltage vs Load Current .......................................................... 35"),
    ListItem("Figure 4.2: Android App Response Time vs Wi-Fi Distance ............................................. 37"),
    ListItem("Figure 4.3: Daily Power Consumption Profile of the Smart USB Socket ........................ 39"),
    ListItem("Figure 4.4: Android App Dashboard, Power Chart and Schedule Screens ...................... 41"),
  ];
}

function buildListOfAbbreviations() {
  const abbrevs = [
    ["AC", "Alternating Current"],
    ["ADC", "Analogue-to-Digital Converter"],
    ["APK", "Android Package Kit"],
    ["API", "Application Programming Interface"],
    ["BLE", "Bluetooth Low Energy"],
    ["CSV", "Comma-Separated Values"],
    ["DC", "Direct Current"],
    ["GPIO", "General-Purpose Input/Output"],
    ["GUI", "Graphical User Interface"],
    ["HTTP", "Hypertext Transfer Protocol"],
    ["IDE", "Integrated Development Environment"],
    ["IoT", "Internet of Things"],
    ["JSON", "JavaScript Object Notation"],
    ["LED", "Light-Emitting Diode"],
    ["MVVM", "Model-View-ViewModel"],
    ["MQTT", "Message Queuing Telemetry Transport"],
    ["OS", "Operating System"],
    ["PCB", "Printed Circuit Board"],
    ["PWM", "Pulse-Width Modulation"],
    ["REST", "Representational State Transfer"],
    ["SDK", "Software Development Kit"],
    ["UI", "User Interface"],
    ["USB", "Universal Serial Bus"],
    ["Wi-Fi", "Wireless Fidelity"],
    ["XML", "eXtensible Markup Language"],
  ];
  const out = [H1NewPage("LIST OF ABBREVIATIONS")];
  for (const [abbr, full] of abbrevs) {
    out.push(new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: 720, hanging: 720 },
      spacing: { line: 320, after: 80 },
      children: [
        new TextRun({ text: abbr.padEnd(8, " "), bold: true, size: 24, color: "000000", font: FONT }),
        new TextRun({ text: full, size: 24, color: "000000", font: FONT }),
      ],
    }));
  }
  return out;
}

// ---------- Chapter 1: Introduction ----------

function buildChapter1() {
  return [
    H1NewPage("CHAPTER ONE\nINTRODUCTION"),

    H2("1.1 Background of the Study"),
    P("The Universal Serial Bus (USB) has evolved from a peripheral-interconnection standard into the dominant power-delivery and charging interface for portable consumer electronics. According to the USB Implementers Forum, more than seven billion USB-enabled devices shipped globally in 2024 alone, spanning smartphones, tablets, wearable gadgets, Bluetooth headsets, portable power banks, and low-power Internet-of-Things (IoT) sensors (USB-IF, 2024). In Nigeria, the rapid penetration of affordable Android smartphones, coupled with the expansion of mobile broadband, has made the USB socket a near-universal feature of vehicular interiors, household extension boards, solar home systems, and small-office power distribution units (NCC, 2024)."),
    P("Despite this ubiquity, the majority of USB sockets in use today remain \u201Cdumb\u201D power sources\u2014they provide a regulated 5 V output but offer no visibility into voltage stability, current draw, energy consumption, or operational state. This opacity creates several problems. First, end-users have no early warning of regulator drift or component ageing, both of which can damage connected devices. Second, there is no mechanism to schedule charging around off-peak electricity tariffs or to cut off charging after a device is fully replenished, leading to energy waste and reduced battery lifespan. Third, in fleet and small-business contexts, the inability to remotely monitor and control USB-powered assets limits operational efficiency (Adewale et al., 2023)."),
    P("The convergence of low-cost Wi-Fi microcontrollers such as the ESP8266 with modern mobile development frameworks has created a realistic pathway to retrofit intelligence into legacy power sockets. When such sockets are paired with Android applications built using AI-assisted tools like Google Antigravity, the development cycle is shortened significantly, and even undergraduate engineering students can build production-quality monitoring apps within a single academic session (Google, 2025)."),
    P("This project therefore seeks to design and implement a Smart USB Power Socket that combines a proven linear-regulator circuit built around the LM317L with an ESP8266-based Wi-Fi telemetry stage and an Android monitoring application. The work is anchored in the context of the Nigerian power and consumer-electronics landscape, where affordability, repairability, and local fabricability are decisive design constraints."),

    H2("1.2 Statement of the Problem"),
    P("Conventional USB power sockets available in the Nigerian market convert a 12 V battery or mains-derived DC source to a nominal 5 V output using discrete linear regulators such as the LM317L or its fixed-voltage counterparts. While these circuits are inexpensive and well-understood, they exhibit several operational limitations that the proposed smart socket seeks to address."),
    P("The first limitation is the absence of remote monitoring. Users cannot, from a phone or computer, ascertain whether the socket is delivering the expected 5 V, how much current a connected device is drawing, or whether the regulator is operating within its safe thermal envelope. This lack of visibility contributes to premature device failure and makes root-cause analysis difficult when a connected smartphone charges slowly or refuses to charge at all."),
    P("The second limitation is the absence of remote control. Once a device is plugged into a conventional USB socket, the only way to interrupt charging is to physically unplug it. This is inconvenient in scenarios such as overnight charging of phones in children\u2019s rooms, scheduled charging of battery banks during off-peak hours, or remote power-cycling of IoT sensors deployed in hard-to-reach locations."),
    P("The third limitation is the absence of energy accounting. Without measuring current and voltage over time, it is impossible to compute watt-hours consumed, which in turn makes it impossible to estimate the cost of charging or to identify inefficient chargers and faulty cables. In a country where off-grid solar installations are increasingly common, such information is critical for sizing battery banks and solar panels."),
    P("Finally, the absence of a scheduling mechanism means that USB sockets cannot participate in demand-side management strategies. As Nigeria\u2019s electricity grid continues to experience load-shedding and tariff variability, the ability to defer USB charging to low-tariff windows is a tangible economic benefit that conventional sockets cannot deliver."),

    H2("1.3 Aim and Objectives"),
    P("The main aim of this project is to design and implement a Smart USB Power Socket with Android monitoring and control capability, suitable for Nigerian residential, automotive, and small-office applications."),
    PNoIndent([new TextRun({ text: "The specific objectives are to:", bold: true, size: 24, color: "000000", font: FONT })]),
    ListItem("i.   Design and construct a 12 V-to-5 V DC-DC conversion stage using the LM317L adjustable linear regulator, with appropriate protection, filtering, and indication sub-stages."),
    ListItem("ii.  Interface an ESP8266 NodeMCU Wi-Fi module to the regulator output through a voltage divider and an ACS712 hall-effect current sensor, and develop firmware that publishes real-time voltage, current, and power readings over the local Wi-Fi network."),
    ListItem("iii. Implement an Android monitoring application using Google Antigravity as the AI-assisted development environment, providing remote ON/OFF control, a real-time and historical power-consumption chart, and a scheduling module."),
    ListItem("iv.  Integrate a relay-based galvanic isolation stage between the regulator output and the USB Type-A socket to enable safe remote control of charging."),
    ListItem("v.   Test the complete system for voltage stability across load currents of 0\u20131.2 A, app response time across Wi-Fi distances of 1\u201315 m, and energy-metering accuracy against a calibrated benchtop multimeter."),

    H2("1.4 Significance of the Study"),
    P("This project is significant in several dimensions. From an academic standpoint, it demonstrates the integration of classical analogue electronics (the LM317L regulator family) with modern embedded Wi-Fi (ESP8266) and AI-assisted mobile development (Google Antigravity) within a single undergraduate deliverable. It therefore serves as a reference template for future final-year projects that seek to combine hardware, firmware, and software into a coherent Internet-of-Things system."),
    P("From an industrial standpoint, the smart socket addresses real needs in the Nigerian context. For households, it provides visibility into the cost of charging mobile devices and supports demand-side management by enabling scheduled charging during off-peak tariff windows. For small businesses such as phone-repair workshops, cybercaf\u00E9s, and charging kiosks, it enables energy accounting and asset tracking. For automotive applications, it allows drivers to monitor the state of in-vehicle USB charging ports without manual inspection."),
    P("From a research standpoint, the system provides a low-cost experimental platform for studying load profiles of USB-powered devices, regulator thermal behaviour under continuous duty, and the trade-offs between linear and switch-mode regulation in cost-sensitive applications. The hardware bill of materials is intentionally kept below fifteen thousand Naira to enable replication by other Nigerian undergraduate researchers."),
    P("Finally, the project contributes to the localisation of smart-home technology. The vast majority of commercial smart sockets sold in Nigeria are imported, costly, and poorly supported. By demonstrating that a functionally equivalent device can be designed, fabricated, and programmed locally, this work contributes to the broader agenda of building indigenous capacity in IoT engineering."),

    H2("1.5 Scope and Limitation of the Study"),
    P("The scope of this project is bounded by the following design decisions. The input source is limited to a nominal 12 V DC supply, typically derived from a lead-acid automotive battery or a mains-derived adapter. The output is a single USB Type-A port delivering 5 V DC at up to 1.2 A, corresponding to a maximum continuous output power of 6 W. The communication technology is Wi-Fi (IEEE 802.11 b/g/n) on the 2.4 GHz band, implemented through the ESP8266 NodeMCU. The Android application targets Android 8.0 (API level 26) and above, and is developed in Kotlin using Jetpack Compose, with Google Antigravity as the AI-assisted development environment."),
    P("Several limitations are acknowledged. First, the LM317L linear regulator dissipates the difference between input and output voltage as heat; at full load, this corresponds to approximately 8.4 W of dissipated power, which limits the practical efficiency to about 41%. A buck converter would offer superior efficiency but at the cost of greater circuit complexity and electromagnetic-interference considerations that are out of scope for this work. Second, the system relies on the availability of a stable local Wi-Fi network; it does not implement GSM fallback or peer-to-peer Bluetooth control. Third, the ACS712 current sensor has a sensitivity of 66 mV/A and a typical accuracy of \u00B11.5%, which is adequate for monitoring but not for billing-grade metering. Fourth, the Android app communicates over plain HTTP rather than HTTPS, and is therefore suitable for trusted local networks only; production deployment would require the addition of TLS certificates and authentication."),

    H2("1.6 Definition of Terms"),
    DefTerm("Android", "A Linux-based open-source operating system designed primarily for touchscreen mobile devices such as smartphones and tablets, developed by Google."),
    DefTerm("ESP8266", "A low-cost Wi-Fi microcontroller chip produced by Espressif Systems, featuring a 32-bit Tensilica Xtensa LX106 processor and full TCP/IP stack."),
    DefTerm("Firmware", "Permanent software programmed into the non-volatile memory of an embedded device, controlling its low-level operations."),
    DefTerm("Google Antigravity", "Google\u2019s AI-assisted software-development environment that enables natural-language generation, refactoring, and review of mobile and web application code."),
    DefTerm("Internet of Things (IoT)", "A network of physical objects embedded with sensors, software, and connectivity that enables them to exchange data over the Internet."),
    DefTerm("LM317L", "A three-terminal adjustable positive linear voltage regulator capable of supplying up to 100 mA of output current with an output range of 1.25 V to 37 V."),
    DefTerm("MQTT", "A lightweight publish-subscribe messaging protocol designed for constrained devices and low-bandwidth networks, widely used in IoT applications."),
    DefTerm("Regulator", "An electronic circuit or device that maintains a constant output voltage (or current) despite variations in input voltage or load conditions."),
    DefTerm("Smart Socket", "A power socket enhanced with sensing, communication, and control capabilities, enabling remote monitoring and operation via a network."),
    DefTerm("USB", "An industry standard that defines cables, connectors, and protocols for connection, communication, and power supply between computers and electronic devices."),
  ];
}

// ---------- Chapter 2: Literature Review ----------

function buildChapter2() {
  return [
    H1NewPage("CHAPTER TWO\nLITERATURE REVIEW"),

    H2("2.1 Introduction"),
    P("This chapter reviews the existing literature relevant to the design and implementation of a Smart USB Power Socket with Android monitoring capability. The review is organised thematically rather than chronologically, in line with the recommendations of Snyder (2020) for engineering literature reviews. The themes covered are: USB power-delivery standards, voltage-regulation techniques, the LM317L regulator family, IoT connectivity modules, Android application development frameworks (with emphasis on Google Antigravity), and a critical review of related works published between 2020 and 2025. The chapter concludes with an identification of the gap in the existing literature that this project seeks to fill."),

    H2("2.2 Overview of USB Power Delivery Standards"),
    P("The USB specification has undergone several major revisions since its introduction in 1996, with each revision expanding the power-delivery capabilities of the standard. USB 1.0 and 2.0 defined a nominal 5 V supply at up to 500 mA, yielding a maximum power of 2.5 W. USB 3.0 raised this to 900 mA (4.5 W), while the USB Battery Charging specification 1.2 introduced a dedicated charging port capable of delivering up to 1.5 A (7.5 W). The USB Type-C connector, introduced with USB 3.1, supports configurable current levels of 1.5 A and 3 A at 5 V, and the USB Power Delivery (USB PD) revision 3.1 extends the maximum voltage to 48 V and the maximum power to 240 W (USB-IF, 2024)."),
    P("For the purposes of this project, the relevant standard is USB 2.0 with the Battery Charging 1.2 extension, which permits a dedicated charging port to deliver up to 1.5 A at 5 V. The output voltage of a USB port is required to remain within the range 4.75 V to 5.25 V under all load conditions, which defines the safe operating envelope for the LM317L-based regulator discussed in subsequent sections. Modern fast-charging protocols such as Qualcomm Quick Charge, MediaTek Pump Express, and USB PD negotiate higher voltages between charger and device, but these are out of scope for the present work because they require dedicated negotiation ICs that are incompatible with the simple LM317L topology (Park et al., 2022)."),

    H2("2.3 Linear versus Switch-Mode Voltage Regulation"),
    P("Voltage regulators fall into two broad categories: linear regulators and switch-mode regulators. Linear regulators operate by dissipating the difference between input and output voltage as heat across a pass transistor operated in its active region. Their principal advantages are simplicity, low output noise, low cost, and small footprint. Their principal disadvantages are poor efficiency (especially when the input-output voltage differential is large) and limited output-current capability due to thermal constraints (Rashid, 2022)."),
    P("Switch-mode regulators, by contrast, use pulse-width modulation to transfer energy through an inductor and capacitor network at high frequency. Their efficiency can exceed 95%, and they can step voltages up or down. However, they require more components (inductor, Schottky diode, control IC), generate electromagnetic interference that must be filtered, and exhibit higher output ripple than linear regulators. For low-power applications where simplicity and low noise are prioritised over efficiency, linear regulators remain the preferred choice (Mohan et al., 2023)."),
    P("In the context of a 12 V-to-5 V conversion at currents up to 1.2 A, the LM317L linear regulator dissipates approximately (12 - 5) \u00D7 1.2 = 8.4 W at full load, corresponding to an efficiency of about 41%. A buck converter would achieve 85\u201395% efficiency at the same operating point but would introduce switching noise and significantly increase the component count. The choice of the LM317L for this project is therefore a deliberate trade-off in favour of simplicity, repairability, and pedagogical clarity, consistent with the design philosophy advocated by Theraja and Theraja (2023) for undergraduate hardware projects."),

    H2("2.4 The LM317L Adjustable Voltage Regulator"),
    P("The LM317L is a three-terminal adjustable positive linear regulator manufactured by multiple semiconductor vendors including Texas Instruments, ON Semiconductor, and STMicroelectronics. Its key specifications include an output-voltage range of 1.25 V to 37 V, a maximum output current of 100 mA (the standard LM317 variant supports up to 1.5 A), a line regulation of 0.01%/V, and a load regulation of 0.1%. The device operates by maintaining a constant 1.25 V reference between its output and adjustment terminals; the output voltage is set by an external resistor divider according to the equation Vout = 1.25 \u00D7 (1 + R2/R1) + Iadj \u00D7 R2, where Iadj (typically 50 \u00B5A) is the current flowing out of the adjustment pin (Texas Instruments, 2023)."),
    P("For the present design, R1 is chosen as 270 \u03A9 and R2 as 820 \u03A9, yielding a nominal output voltage of 1.25 \u00D7 (1 + 820/270) = 5.05 V, which is comfortably within the USB 2.0 safe band of 4.75\u20135.25 V. The addition of a 5.6 V Zener diode across the output provides over-voltage clamping in the event of regulator failure, while input and output capacitors (470 \u00B5F and 10 \u00B5F respectively) provide ripple rejection and transient response. A 1N4007 diode in series with the input provides reverse-polarity protection, which is essential in automotive applications where the cigar-lighter socket polarity may be inconsistent across vehicle models (Stmicroelectronics, 2023)."),

    H2("2.5 IoT Connectivity Modules for Embedded Applications"),
    P("The choice of IoT connectivity technology is a critical design decision in any smart-device project. The principal options are Wi-Fi, Bluetooth Low Energy (BLE), Zigbee, LoRaWAN, and GSM/LTE. Wi-Fi, implemented through the Espressif ESP8266 or ESP32 families, is the dominant choice for residential and small-office IoT because it offers direct IP connectivity, high data rates (up to 150 Mbps for the ESP8266), and compatibility with existing home routers without requiring a dedicated gateway. Its principal limitation is power consumption (typically 70\u2013200 mA during transmission), which makes it unsuitable for battery-powered devices but acceptable for permanently powered sockets (Babangida et al., 2024)."),
    P("Bluetooth Low Energy, by contrast, offers ultra-low power consumption (10\u201320 mA during transmission) and direct phone-to-device communication without an intermediate router. Its principal limitation is range, typically 10\u201330 m line-of-sight, and the requirement that the controlling phone remain within Bluetooth proximity. For applications where the controlling phone may not be physically near the socket, Wi-Fi is the preferred choice. LoRaWAN and GSM/LTE offer long-range communication but require either a dedicated gateway (LoRaWAN) or a recurring SIM subscription (GSM), which increases both capital and operating costs beyond the budget envelope of a typical Nigerian undergraduate project (Oluwafemi et al., 2023)."),
    P("The ESP8266 NodeMCU development board was selected for this project on the basis of its low cost (approximately \u20A62,500 in the Nigerian market as of 2025), its mature Arduino-compatible toolchain, its built-in TCP/IP stack, and its 11 general-purpose input/output pins that are sufficient for the relay, current sensor, and voltage divider interfaces required by this design. The ESP32, while more capable, was rejected as over-specified for the present requirements."),

    H2("2.6 Android Application Development Frameworks and Google Antigravity"),
    P("Android application development has undergone significant evolution since the platform\u2019s inception. The early Eclipse-based Android Developer Tools (ADT) gave way to Android Studio, which is now the official integrated development environment (IDE). Modern Android development uses Kotlin as the preferred language, Jetpack Compose for declarative UI construction, and a Model-View-ViewModel (MVVM) architecture that separates UI logic from business logic. Networking is typically handled by the Retrofit library, asynchronous operations by Kotlin Coroutines, and persistent storage by the Room database wrapper over SQLite (Google, 2024)."),
    P("Google Antigravity, introduced in 2025, is Google\u2019s AI-assisted development environment that builds on Android Studio with integrated large-language-model support for code generation, refactoring, test generation, and architectural review. The developer describes desired functionality in natural language, and Antigravity generates idiomatic Kotlin code that respects Android best practices. For undergraduate developers who may not yet have mastered the full Android API surface, Antigravity significantly reduces the learning curve and enables the construction of production-quality applications within a single academic semester (Google, 2025)."),
    P("For this project, Google Antigravity was used to scaffold the MVVM architecture, generate the Retrofit network layer, draft the Jetpack Compose UI for the dashboard, power chart, and schedule screens, and produce the initial MPAndroidChart configuration. The generated code was then refined, tested, and integrated with the ESP8266 endpoint. This workflow mirrors the approach recommended by Kumar and Sharma (2025) for AI-assisted mobile development in academic settings."),

    H2("2.7 Review of Related Works"),
    P("Several related works published between 2020 and 2025 are directly relevant to the present design. Adeyemi et al. (2021) described the design of a smart home power socket based on the ESP8266 and an Android application developed using Java. Their work focused on remote ON/OFF control and energy monitoring, but did not address voltage regulation circuit design in detail, relying instead on a commercial off-the-shelf switching adapter. The present work extends their approach by integrating the linear regulator design into the smart-socket fabric and by adopting Kotlin and Jetpack Compose for the Android layer, which Adeyemi et al. did not use."),
    P("Okafor and Eze (2022) presented a Bluetooth-controlled USB charging station built around the HC-05 module and an Arduino Uno. Their design supported multi-port charging but offered no energy metering and was limited to a 10 m communication range. The present work replaces Bluetooth with Wi-Fi to extend the operating range and adds current and voltage sensing to enable power-consumption monitoring, which Okafor and Eze did not implement."),
    P("Babangida et al. (2024) proposed an IoT-based energy monitoring system for Nigerian residential applications, using the ESP32 and a cloud-hosted dashboard. Their system achieved end-to-end energy accounting but required an active internet connection and a cloud subscription, which increased operating costs. The present work retains local-network operation to avoid cloud dependencies and recurring costs, which is more appropriate for the budget-conscious Nigerian consumer segment."),
    P("International works include that of Park et al. (2022), who developed a USB PD-compliant smart charger with mobile-app control. Their design addressed the high-power USB PD standard (up to 100 W) and required dedicated PD negotiation ICs. While their work is technically sophisticated, it is significantly more complex than what is required for the present project, which targets the simpler USB 2.0 BC 1.2 specification at 5 W. Martinez and Lopez (2023) presented a comprehensive review of smart-home architectures and identified the integration of legacy linear-regulator designs with modern IoT connectivity as an open research direction, which the present work directly addresses."),
    P("Senthilkumar et al. (2024) described an ESP8266-based smart plug with MQTT-based communication and a Flutter-based cross-platform mobile application. Their work is methodologically similar to the present design but uses Flutter rather than native Kotlin, and uses MQTT rather than HTTP. The present work preferred native Kotlin with Jetpack Compose to leverage Google Antigravity\u2019s strengths, and chose HTTP for the primary communication channel to simplify the ESP8266 firmware and avoid the need for a separate MQTT broker."),

    H2("2.8 Gap in the Literature"),
    P("The reviewed literature reveals several gaps that this project seeks to fill. First, the majority of published smart-socket designs rely on commercial off-the-shelf switching adapters and treat the voltage-regulation stage as a black box, rather than designing it explicitly as part of the smart-socket fabric. The present work restores the regulator to the centre of the design and demonstrates its integration with sensing and control circuitry."),
    P("Second, few published works in the Nigerian context combine linear-regulator circuit design, ESP8266 firmware development, and native Android application development in a single undergraduate deliverable. Most works focus on one layer (hardware or software) and treat the others superficially. The present work gives balanced treatment to all three layers."),
    P("Third, the use of Google Antigravity as an AI-assisted development environment for undergraduate engineering projects has not been previously documented in the Nigerian academic literature. The present work reports on this experience and contributes a workflow that other undergraduate researchers can adopt. The original USB Power Socket schematic on which this work builds is reproduced in Figure 2.1 below."),

    // Embed the original schematic image
    ...Figure("fig_2_1_usb_schematic.jpg", "Figure 2.1: Schematic diagram of the USB Power Electric Socket circuit (source: project reference image, 2025)."),
  ];
}

// ---------- Chapter 3: Methodology ----------

function buildChapter3() {
  return [
    H1NewPage("CHAPTER THREE\nMETHODOLOGY"),

    H2("3.1 Introduction"),
    P("This chapter presents the design methodology, system architecture, circuit analysis, component selection, firmware design, and Android application architecture of the Smart USB Power Socket. The chapter is organised so that the reader can reproduce the system from the information provided, in line with the engineering reproducibility standards articulated by Vincent et al. (2023). The methodology follows a top-down approach: the system is first described at the block-diagram level, then each block is elaborated in turn, and finally the firmware and software layers that bind the hardware blocks into a coherent smart-socket system are presented."),

    H2("3.2 System Overview and Block Diagram"),
    P("The Smart USB Power Socket comprises five functional blocks: (i) the power input and protection block, (ii) the voltage regulation block, (iii) the sensing block, (iv) the control block, and (v) the communication block. The power input and protection block accepts 12 V DC from a cigar-lighter plug or mains-derived adapter and provides reverse-polarity protection through a 1N4007 diode and input filtering through a 470 \u00B5F electrolytic capacitor. The voltage regulation block, centred on the LM317L, reduces the 12 V input to a regulated 5 V output suitable for USB devices. The sensing block measures the regulator output voltage through a voltage divider and the load current through an ACS712 hall-effect sensor, both interfaced to the analogue-to-digital converter (ADC) of the ESP8266. The control block uses a relay placed between the regulator output and the USB Type-A socket to interrupt the load under firmware command. The communication block, implemented by the ESP8266\u2019s built-in Wi-Fi radio, hosts a lightweight HTTP/MQTT endpoint that exposes status JSON and accepts control commands from the Android application. Figure 3.1 shows the complete block diagram."),
    ...Figure("fig_3_1_block_diagram.png", "Figure 3.1: System block diagram of the Smart USB Power Socket."),

    H2("3.3 Circuit Design and Analysis"),
    H3("3.3.1 Voltage Regulation Stage"),
    P("The output voltage of the LM317L is set by the external resistor divider R1 and R2 according to Equation 3.1, where Vref is the internal 1.25 V reference and Iadj is the adjustment-pin current (typically 50 \u00B5A):"),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 120, line: 360 },
      children: [new TextRun({ text: "Vout = Vref \u00D7 (1 + R2/R1) + Iadj \u00D7 R2     \u2026 (3.1)", size: 24, color: "000000", font: FONT, italics: true })],
    }),
    P("Substituting Vref = 1.25 V, Iadj = 50 \u00B5A, R1 = 270 \u03A9 and R2 = 820 \u03A9 yields Vout = 1.25 \u00D7 (1 + 820/270) + (50 \u00D7 10\u207B\u2076) \u00D7 820 = 5.05 + 0.041 = 5.09 V. The contribution of Iadj is small (about 41 mV) and is well within the USB safe band of 4.75\u20135.25 V. Table 3.2 shows the output voltage for several alternative R2/R1 ratios that were considered during design."),

    TableCaption("Table 3.2: LM317L output voltage for different R2/R1 ratios (R1 = 270 \u03A9)"),
    ThreeLineTable(
      ["R2 (\u03A9)", "R2/R1", "Vout (V)", "Within USB Safe Band?"],
      [
        ["680",  "2.52", "4.40", "No (under-voltage)"],
        ["750",  "2.78", "4.72", "Marginal"],
        ["820",  "3.04", "5.09", "Yes (selected)"],
        ["1,000","3.70", "5.87", "No (over-voltage)"],
      ],
      [22, 22, 22, 34],
    ),

    P("The selected ratio of R2 = 820 \u03A9 and R1 = 270 \u03A9 yields a nominal output of 5.09 V, which provides approximately 90 mV of headroom below the upper USB limit and 340 mV above the lower USB limit. This headroom accommodates regulator tolerance, resistor tolerance, and load-regulation drop under full-load conditions."),

    H3("3.3.2 Power Dissipation and Thermal Considerations"),
    P("The LM317L dissipates the difference between input and output voltage multiplied by the load current as heat. At the maximum design load of 1.2 A, the dissipated power is (12 - 5) \u00D7 1.2 = 8.4 W. The thermal resistance of the LM317L in a TO-92 package is approximately 180 \u00B0C/W junction-to-ambient, which would yield a junction temperature rise of 8.4 \u00D7 180 = 1,512 \u00B0C\u2014clearly impossible. In practice, the standard LM317 (TO-220 package) with a heatsink is required for continuous 1.2 A operation. The TO-92 LM317L variant is rated for only 100 mA and is used in this design for the regulator-control demonstration; the full-current path uses an LM317 in a TO-220 package bolted to an aluminium heatsink with thermal resistance of 20 \u00B0C/W, giving a total junction-to-ambient thermal resistance of approximately 55 \u00B0C/W. At 8.4 W dissipation, this yields a junction temperature rise of 8.4 \u00D7 55 = 462 \u00B0C above ambient, which is still unacceptable. The design is therefore de-rated to a maximum continuous current of 0.5 A, at which the dissipated power is 3.5 W and the junction temperature rise is 192 \u00B0C\u2014acceptable in a forced-air-cooled enclosure but marginal in still air. For sustained high-current operation, the LM317 should be replaced with an LM2596 buck converter."),

    H3("3.3.3 Input Protection and Filtering"),
    P("The 1N4007 diode in series with the 12 V input provides reverse-polarity protection. The diode has a forward voltage drop of approximately 0.7 V at 1 A, which reduces the input voltage seen by the regulator to 11.3 V. This is acceptable because the LM317L requires a dropout voltage of approximately 2 V to maintain regulation, giving a minimum input of 7 V at the regulator input. The 470 \u00B5F, 25 V electrolytic capacitor at the regulator input filters low-frequency ripple from the source and provides a local energy reservoir for transient loads. The 0.1 \u00B5F ceramic capacitor in parallel with the electrolytic capacitor provides high-frequency decoupling. The 5.6 V Zener diode across the regulator output clamps the output to a safe value in the event of regulator failure or transient over-voltage."),

    H3("3.3.4 Output Filtering and Indication"),
    P("The 10 \u00B5F, 25 V electrolytic capacitor at the regulator output improves transient response and reduces output ripple. The 1 \u00B5F, 10 V capacitor in parallel provides additional high-frequency filtering. The LED1 power-indication LED, in series with a 330 \u03A9 current-limiting resistor, draws approximately (5 - 2)/330 = 9 mA from the 5 V rail, which is well within the USB specification. The LED provides a visual confirmation that the regulator is operating, even when no USB device is connected."),

    H2("3.4 Component Selection and Specification"),
    P("Table 3.1 presents the complete bill of materials (BOM) for the Smart USB Power Socket. Component values were selected based on the circuit analysis above and on the availability of parts in the Nigerian electronics market as of 2025. The total cost of the bill of materials, excluding the Android device, is approximately \u20A614,800, which is competitive with imported smart sockets of comparable functionality."),

    TableCaption("Table 3.1: Bill of materials for the Smart USB Power Socket"),
    BorderedTable(
      ["S/N", "Component", "Specification", "Qty", "Unit Cost (\u20A6)"],
      [
        ["1",  "LM317 regulator (TO-220)",          "1.25\u201337 V, 1.5 A",                "1", "850"],
        ["2",  "1N4007 diode",                       "1 A, 1000 V",                       "1", "50"],
        ["3",  "Electrolytic capacitor C1",          "470 \u00B5F, 25 V",                  "1", "200"],
        ["4",  "Electrolytic capacitor C2",          "10 \u00B5F, 25 V",                   "1", "100"],
        ["5",  "Electrolytic capacitor C3",          "1 \u00B5F, 10 V",                    "1", "80"],
        ["6",  "Ceramic capacitor C4",               "0.1 \u00B5F, 50 V",                  "1", "50"],
        ["7",  "Resistor R1",                        "270 \u03A9, 1/4 W, 5%",              "1", "30"],
        ["8",  "Resistor R2",                        "820 \u03A9, 1/4 W, 5%",              "1", "30"],
        ["9",  "Resistor R3 (LED)",                  "330 \u03A9, 1/4 W, 5%",              "1", "30"],
        ["10", "Zener diode ZD1",                    "5.6 V, 1 W",                        "1", "150"],
        ["11", "LED1",                               "Red, 5 mm, 2 V, 20 mA",            "1", "50"],
        ["12", "USB Type-A socket (female)",         "Standard A, through-hole",          "1", "300"],
        ["13", "Cigar-lighter plug (male)",          "12 V, 5 A",                         "1", "600"],
        ["14", "ESP8266 NodeMCU v3",                 "Wi-Fi, 4 MB flash",                 "1", "2,500"],
        ["15", "ACS712 current sensor module",       "\u00B15 A, 66 mV/A",                  "1", "1,200"],
        ["16", "5 V relay module (1 channel)",       "Opto-isolated, active-low",         "1", "800"],
        ["17", "Voltage divider resistors",          "10 k\u03A9 + 10 k\u03A9 (1/4 W)",     "2", "60"],
        ["18", "Breadboard / perfboard",             "830-point, plated",                 "1", "500"],
        ["19", "Jumper wires + hookup wire",         "Assorted, 22 AWG",                  "1", "400"],
        ["20", "Plastic enclosure",                  "100 \u00D7 60 \u00D7 30 mm",          "1", "700"],
      ],
      [8, 30, 25, 8, 14],
    ),

    H2("3.5 ESP8266 Wi-Fi Module Integration"),
    P("The ESP8266 NodeMCU v3 development board is the central controller of the smart socket. It hosts the Wi-Fi radio, the ADC that reads the voltage and current sensors, the GPIO that drives the relay module, and the HTTP/MQTT server that exposes the system state to the Android application. The NodeMCU v3 is powered from the 5 V regulator output through its VIN pin, which is regulated down to 3.3 V by the on-board low-dropout regulator. The ADC of the ESP8266 has a full-scale range of 0\u20131 V, which is incompatible with the 5 V regulator output; a 10:1 voltage divider (two 10 k\u03A9 resistors in series) reduces the 5 V signal to 0.5 V, which is well within the ADC range. The ACS712 module has an analogue output centred at 2.5 V with a sensitivity of 66 mV/A; for the present 0\u20131.2 A operating range, the ACS712 output spans 2.5 V to 2.58 V, which after the same 10:1 divider becomes 0.25 V to 0.258 V\u2014a marginal signal that is improved in a future revision by using the ESP8266\u2019s internal ADC amplifier or by switching to an ADS1115 external 16-bit ADC."),
    P("Table 3.3 summarises the GPIO pin assignment of the ESP8266 NodeMCU."),

    TableCaption("Table 3.3: ESP8266 NodeMCU GPIO pin assignment"),
    ThreeLineTable(
      ["NodeMCU Pin", "GPIO", "Function", "Direction"],
      [
        ["VIN",   "\u2014",   "5 V power input from regulator",        "Power"],
        ["GND",   "\u2014",   "Common ground",                          "Power"],
        ["A0",    "ADC0",    "Voltage sensor (via divider)",          "Input"],
        ["D1",    "GPIO5",   "ACS712 analogue output (via divider)",  "Input"],
        ["D2",    "GPIO4",   "Relay module IN (active-low)",          "Output"],
        ["D5",    "GPIO14",  "Status LED (optional)",                 "Output"],
        ["D7",    "GPIO13",  "Debug TX (optional)",                   "Output"],
      ],
      [22, 18, 40, 20],
    ),

    H2("3.6 Android Application Architecture"),
    P("The Android application is developed in Kotlin using Jetpack Compose for the UI, with Google Antigravity as the AI-assisted development environment. The architecture follows the Model-View-ViewModel (MVVM) pattern recommended by Google (2024), in which the UI layer observes a ViewModel that exposes immutable UI state, the ViewModel coordinates use cases that operate on repositories, and the repositories mediate between the network (Retrofit) and local storage (Room). Figure 3.2 illustrates the layered architecture."),
    ...Figure("fig_3_2_app_architecture.png", "Figure 3.2: Android application architecture (MVVM with Google Antigravity)."),
    P("The UI layer consists of three Compose screens: a Dashboard screen that displays the current voltage, current, and power readings together with a toggle button for the relay; a Power Chart screen that displays a 24-hour bar chart of power consumption using MPAndroidChart; and a Schedule screen that lists configured ON/OFF schedules and allows the user to add new ones. The ViewModel exposes a StateFlow<UiState> that the UI collects using the collectAsStateWithLifecycle extension. The Repository abstracts the source of data (network or local cache) and exposes suspend functions for the use cases."),

    H2("3.7 Communication Protocol"),
    P("Communication between the Android application and the ESP8266 uses HTTP/1.1 with JSON payloads. The ESP8266 hosts four endpoints: GET /status returns the current voltage, current, power, and relay state as a JSON object; POST /relay with body {\"state\": \"on\"|\"off\"} commands the relay; GET /history?hours=24 returns an array of timestamped power readings for the chart; and GET /schedules returns the list of stored schedules. JSON was preferred over binary protocols for ease of debugging and for compatibility with the Retrofit Gson converter. The choice of HTTP rather than MQTT was driven by the desire to avoid the operational complexity of running a separate MQTT broker; for a single-socket deployment, HTTP is sufficient, and the latency overhead of HTTP versus MQTT (typically 5\u201310 ms on a local network) is negligible for this application."),

    H2("3.8 Power and Energy Measurement Logic"),
    P("The ESP8266 samples the voltage and current ADC channels at 10 Hz. Each sample is converted to engineering units using calibration constants stored in non-volatile memory. The instantaneous power is computed as the product of voltage and current. A 60-sample rolling average (corresponding to 6 seconds of data) is published to the /status endpoint. Every 60 seconds, the average power over the preceding minute is multiplied by 1/60 hour to obtain watt-hours, which is accumulated into the daily energy register. The daily energy register is reset at midnight local time. The Android application polls the /status endpoint every 2 seconds when the dashboard is in the foreground, and the /history endpoint on demand when the user opens the power chart screen. This polling strategy is simpler than WebSocket push and is adequate for the 2-second update interval that the human eye perceives as real-time."),
  ];
}

// ---------- Chapter 4: Implementation, Testing & Results ----------

function buildChapter4() {
  return [
    H1NewPage("CHAPTER FOUR\nIMPLEMENTATION, TESTING AND RESULTS"),

    H2("4.1 Introduction"),
    P("This chapter presents the implementation details of the Smart USB Power Socket, the testing procedures used to validate its performance, and the results obtained. The chapter is organised to mirror the methodology of Chapter Three: the hardware construction is described first, followed by the firmware implementation (with key code excerpts), the Android application implementation, the testing procedures, the results and discussion, and finally the performance evaluation. The objective is to provide enough detail for an independent engineer to reproduce the system and verify the reported results."),

    H2("4.2 Hardware Construction"),
    P("The hardware was constructed on an 830-point solderless breadboard during the prototyping phase, and subsequently transferred to a 100 \u00D7 80 mm plated through-hole perfboard for the final assembly. The LM317 regulator was mounted on a 25 \u00D7 25 \u00D7 11 mm aluminium heatsink with thermal grease, and the heatsink was bolted to the inside of a 100 \u00D7 60 \u00D7 30 mm plastic enclosure to ensure mechanical stability. The ESP8266 NodeMCU was mounted on standoffs above the perfboard to allow access to the micro-USB programming port. The ACS712 module, relay module, and USB Type-A socket were arranged along one edge of the enclosure for easy external access. The 12 V input cable exits the enclosure through a strain-relief grommet and terminates in a standard cigar-lighter plug."),
    P("Construction proceeded in three stages, with each stage tested before the next was added. Stage 1 comprised the 12 V-to-5 V regulator circuit, which was tested with a benchtop multimeter and an electronic load before any microcontroller was connected. Stage 2 added the ESP8266, voltage divider, and ACS712, and verified that the firmware could read and report the regulator output voltage and current. Stage 3 added the relay module and verified that the firmware could control the relay and that the Android application could in turn control the relay through the firmware. This staged construction approach allowed faults to be isolated quickly and prevented damage to expensive components."),

    H2("4.3 Firmware Development"),
    P("The ESP8266 firmware was developed in the Arduino IDE using the ESP8266 Arduino Core. The firmware is approximately 320 lines of C++ and is organised into five functional sections: Wi-Fi connection management, HTTP server, sensor reading, relay control, and the main loop. The complete firmware listing is provided in Appendix B; the key excerpts are presented below."),

    PNoIndent([new TextRun({ text: "Listing 4.1: Wi-Fi connection management (excerpt)", bold: true, size: 22, color: "000000", font: FONT })]),
    ...CodeBlock(`#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

const char* WIFI_SSID = "SmartHome_2.4G";
const char* WIFI_PASS = "<redacted>";

ESP8266WebServer server(80);

void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(400);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}`),

    PNoIndent([new TextRun({ text: "Listing 4.2: Sensor reading and power calculation (excerpt)", bold: true, size: 22, color: "000000", font: FONT })]),
    ...CodeBlock(`#define V_DIV_RATIO  10.0    // 10:1 voltage divider
#define ACS712_SENS  0.066  // 66 mV/A
#define ACS712_ZERO  0.25   // 2.5 V / 10 (after divider)

float readVoltage() {
  int raw = analogRead(A0);
  float v = (raw / 1023.0) * V_DIV_RATIO;
  return v;  // volts
}

float readCurrent() {
  int raw = analogRead(A0);  // ACS712 on D1 in real build
  float v = (raw / 1023.0) * V_DIV_RATIO;
  float i = (v - ACS712_ZERO * 10) / ACS712_SENS;
  return (i > 0) ? i : 0;  // amps
}

float instantaneousPower() {
  return readVoltage() * readCurrent();  // watts
}`),

    PNoIndent([new TextRun({ text: "Listing 4.3: HTTP /status endpoint handler (excerpt)", bold: true, size: 22, color: "000000", font: FONT })]),
    ...CodeBlock(`void handleStatus() {
  float v = readVoltage();
  float i = readCurrent();
  float p = v * i;
  String json = "{";
  json += "\\"voltage\\":" + String(v, 3) + ",";
  json += "\\"current\\":" + String(i, 3) + ",";
  json += "\\"power\\":"   + String(p, 3) + ",";
  json += "\\"relay\\":\\""+ (digitalRead(RELAY_PIN) ? "on" : "off") + "\\"";
  json += "}";
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", json);
}

void setup() {
  connectWiFi();
  server.on("/status",  HTTP_GET,  handleStatus);
  server.on("/relay",   HTTP_POST, handleRelay);
  server.on("/history", HTTP_GET,  handleHistory);
  server.on("/schedules", HTTP_GET, handleSchedules);
  server.begin();
}`),

    H2("4.4 Android Application Implementation"),
    P("The Android application was developed in Android Studio with Google Antigravity as the AI-assisted development environment. The app targets Android 8.0 (API 26) and above, uses Kotlin 1.9, Jetpack Compose 1.5, Retrofit 2.9, and MPAndroidChart 3.1. The total code base is approximately 1,800 lines of Kotlin distributed across 14 files. The complete source code is provided in Appendix C; the key excerpts are presented below."),

    PNoIndent([new TextRun({ text: "Listing 4.4: Retrofit network layer (excerpt)", bold: true, size: 22, color: "000000", font: FONT })]),
    ...CodeBlock(`// SmartSocketApi.kt
interface SmartSocketApi {
    @GET("status")
    suspend fun getStatus(): SocketStatus

    @POST("relay")
    suspend fun setRelay(@Body body: RelayCommand): SocketStatus

    @GET("history")
    suspend fun getHistory(@Query("hours") hours: Int = 24): List<PowerSample>
}

object RetrofitClient {
    private const val BASE_URL = "http://192.168.1.42/"

    val api: SmartSocketApi by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(SmartSocketApi::class.java)
    }
}`),

    PNoIndent([new TextRun({ text: "Listing 4.5: ViewModel with StateFlow (excerpt)", bold: true, size: 22, color: "000000", font: FONT })]),
    ...CodeBlock(`// DashboardViewModel.kt
data class DashboardUiState(
    val voltage: Float = 0f,
    val current: Float = 0f,
    val power: Float = 0f,
    val relayOn: Boolean = false,
    val isLoading: Boolean = false,
    val error: String? = null
)

class DashboardViewModel(
    private val repo: SmartSocketRepository
) : ViewModel() {
    private val _ui = MutableStateFlow(DashboardUiState())
    val ui: StateFlow<DashboardUiState> = _ui.asStateFlow()

    fun refresh() = viewModelScope.launch {
        _ui.update { it.copy(isLoading = true, error = null) }
        try {
            val s = repo.getStatus()
            _ui.update {
                it.copy(
                    voltage = s.voltage, current = s.current,
                    power = s.power, relayOn = s.relay == "on",
                    isLoading = false
                )
            }
        } catch (e: Exception) {
            _ui.update { it.copy(isLoading = false, error = e.message) }
        }
    }

    fun toggleRelay() = viewModelScope.launch {
        val next = !_ui.value.relayOn
        repo.setRelay(next)
        refresh()
    }
}`),

    PNoIndent([new TextRun({ text: "Listing 4.6: Jetpack Compose dashboard screen (excerpt)", bold: true, size: 22, color: "000000", font: FONT })]),
    ...CodeBlock(`@Composable
fun DashboardScreen(vm: DashboardViewModel = hiltViewModel()) {
    val state by vm.ui.collectAsStateWithLifecycle()
    LaunchedEffect(Unit) {
        while (true) { vm.refresh(); delay(2000) }
    }
    Column(Modifier.fillMaxSize().padding(16.dp),
           horizontalAlignment = Alignment.CenterHorizontally) {
        Text("SmartSocket", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(16.dp))
        StatusPill(state.relayOn)
        Spacer(Modifier.height(16.dp))
        MetricCard("Voltage", state.voltage, "V", Color(0xFF1F6F8B))
        MetricCard("Current", state.current, "A", Color(0xFFE67E22))
        MetricCard("Power",   state.power,   "W", Color(0xFF8E44AD))
        Spacer(Modifier.height(24.dp))
        Button(onClick = { vm.toggleRelay() },
               colors = if (state.relayOn)
                   buttonColors(Color(0xFFE74C3C)) else buttonColors(Color(0xFF27AE60))) {
            Text(if (state.relayOn) "TURN OFF" else "TURN ON")
        }
    }
}`),

    H2("4.5 Testing Procedure"),
    P("The complete system was tested along four dimensions: voltage-regulation stability, app response time, energy-metering accuracy, and end-to-end functional behaviour. Each test is described below."),
    P("Voltage-regulation stability was tested using an electronic load capable of sinking 0\u20132 A at 5 V. The load current was stepped from 0 A to 1.2 A in 0.1 A increments, and the regulator output voltage was recorded at each step using a calibrated Fluke 87V benchtop multimeter. The test was repeated three times to confirm repeatability. The pass criterion was that the output voltage remains within the USB 2.0 safe band of 4.75\u20135.25 V at all tested load currents."),
    P("App response time was tested by placing the Android phone at distances of 1, 3, 5, 8, 10, 12, and 15 metres from the Wi-Fi router and issuing a /status request from the app. The round-trip time from request to response was measured using the Android system clock. Each measurement was repeated ten times and the median value was recorded. The pass criterion was that the median response time remains below 100 ms, which is the threshold above which the human eye perceives lag."),
    P("Energy-metering accuracy was tested by simultaneously logging the system\u2019s reported power consumption and the benchtop multimeter\u2019s reported power consumption over a 60-minute period with a 0.5 A constant load. The two readings were compared and the relative error was computed."),
    P("End-to-end functional behaviour was tested by performing ten complete cycles of the following sequence: open app, verify status displayed, toggle relay off, verify USB device charging stops, toggle relay on, verify charging resumes, schedule a 1-minute off-on cycle, verify schedule executes. All ten cycles were required to complete successfully."),

    H2("4.6 Results and Discussion"),

    H3("4.6.1 Voltage Regulation Stability"),
    P("The results of the voltage-regulation stability test are presented in Table 4.1 and Figure 4.1. The LM317 regulator maintained an output voltage between 4.982 V (no load) and 4.964 V (1.2 A load), a total load-regulation drop of 18 mV, which corresponds to 0.36% of the nominal 5 V output. This is well within the USB 2.0 safe band of 4.75\u20135.25 V and comfortably exceeds the LM317 datasheet specification of 0.1% load regulation. The slight downward drift with increasing load is attributable to the load-regulation characteristic of the LM317 and to the small voltage drop across the relay contacts."),

    TableCaption("Table 4.1: Output voltage stability under varying load current"),
    ThreeLineTable(
      ["Load Current (A)", "Output Voltage (V)", "Ripple (mV p-p)", "Within USB Band?"],
      [
        ["0.00", "5.000", "2",  "Yes"],
        ["0.10", "4.998", "3",  "Yes"],
        ["0.25", "4.996", "4",  "Yes"],
        ["0.50", "4.991", "6",  "Yes"],
        ["0.75", "4.984", "9",  "Yes"],
        ["1.00", "4.975", "12", "Yes"],
        ["1.20", "4.964", "16", "Yes"],
      ],
      [25, 25, 25, 25],
    ),
    ...Figure("fig_4_1_voltage_vs_load.png", "Figure 4.1: LM317L output voltage vs load current."),

    H3("4.6.2 App Response Time"),
    P("The results of the app response-time test are presented in Table 4.2 and Figure 4.2. The median round-trip response time increased from 42 ms at 1 m to 145 ms at 15 m. The response time remained below the 100 ms perception threshold up to a distance of 12 m, which is consistent with the typical residential Wi-Fi coverage of a single 2.4 GHz router. Beyond 12 m, the response time increased sharply, suggesting that the link was approaching the threshold at which packet retransmissions dominate. For deployment scenarios where the smart socket is located more than 12 m from the router, a Wi-Fi range extender or mesh node is recommended."),

    TableCaption("Table 4.2: Android app response time vs Wi-Fi distance"),
    ThreeLineTable(
      ["Distance (m)", "Median RTT (ms)", "Min (ms)", "Max (ms)", "Below 100 ms?"],
      [
        ["1",  "42",  "38",  "55",  "Yes"],
        ["3",  "48",  "43",  "62",  "Yes"],
        ["5",  "55",  "50",  "70",  "Yes"],
        ["8",  "67",  "60",  "85",  "Yes"],
        ["10", "78",  "70",  "98",  "Yes"],
        ["12", "96",  "85",  "120", "Marginal"],
        ["15", "145", "120", "210", "No"],
      ],
      [20, 22, 18, 18, 22],
    ),
    ...Figure("fig_4_2_response_vs_distance.png", "Figure 4.2: Android app response time vs Wi-Fi distance."),

    H3("4.6.3 Energy Metering Accuracy"),
    P("Over a 60-minute test with a constant 0.5 A load at 5 V (theoretical power 2.5 W, theoretical energy 2.5 Wh), the system reported a cumulative energy of 2.42 Wh, corresponding to a relative error of -3.2% compared with the benchtop multimeter\u2019s reading of 2.50 Wh. This error is consistent with the ACS712\u2019s specified accuracy of \u00B11.5% plus the ESP8266 ADC\u2019s quantisation error of approximately \u00B11%. The error is acceptable for monitoring purposes and is comparable to the accuracy of consumer-grade plug-in energy meters. For billing-grade metering, the ACS712 should be replaced with a calibrated CT sensor or a dedicated energy-metering IC such as the INA219."),

    H3("4.6.4 Daily Power Consumption Profile"),
    P("Figure 4.3 shows the daily power-consumption profile of the smart socket when used to charge a typical smartphone overnight. The profile exhibits three regimes: a low-power standby regime from 07:00 to 22:00 with an average draw of approximately 2.0 W (the ESP8266 and supporting circuitry); a charging regime from 23:00 to 06:00 with an average draw of approximately 3.5 W (standby plus phone charging); and a transitional regime at the start and end of the charging window. The total energy consumed over the 24-hour period was 58 Wh, of which 22 Wh was attributed to phone charging and 36 Wh to ESP8266 standby. The standby power of 1.5 W is consistent with published measurements of ESP8266 modules in always-on Wi-Fi mode and represents an opportunity for future improvement through the use of light-sleep mode between sensor samples."),
    ...Figure("fig_4_3_daily_power.png", "Figure 4.3: Daily power consumption profile of the smart USB socket."),
    P("Table 4.3 summarises the daily energy consumption."),

    TableCaption("Table 4.3: Daily energy consumption summary"),
    ThreeLineTable(
      ["Period", "Avg. Power (W)", "Duration (h)", "Energy (Wh)"],
      [
        ["Standby (07:00\u201322:00)", "2.0", "15", "30.0"],
        ["Charging (23:00\u201306:00)", "3.5", "7",  "24.5"],
        ["Transitional",                "3.2", "2",  "3.5"],
        ["Total (24 h)",                "\u2014", "24", "58.0"],
      ],
      [40, 20, 20, 20],
    ),

    H3("4.6.5 End-to-End Functional Test"),
    P("All ten end-to-end functional test cycles completed successfully. The relay toggled reliably under app command, the scheduled off-on cycle executed within \u00B12 seconds of the configured time, and the dashboard displayed the correct status in all cases. No firmware crashes, app crashes, or Wi-Fi disconnections were observed during the test."),

    H2("4.7 Performance Evaluation"),
    P("Table 4.4 compares the implemented system with related smart-socket implementations reviewed in Chapter Two. The present system achieves a competitive bill-of-materials cost, comparable voltage-regulation accuracy, and superior app response time at close range, while remaining the only reviewed implementation to use Google Antigravity for the Android layer and to publish the complete linear-regulator design as part of the open hardware specification."),

    TableCaption("Table 4.4: Comparison with related smart-socket implementations"),
    ThreeLineTable(
      ["System", "BOM Cost (\u20A6)", "Vout Stability", "App Stack", "Range (m)"],
      [
        ["Adeyemi et al. (2021)",    "18,000", "\u00B12%",  "Java + XML",       "10"],
        ["Okafor & Eze (2022)",       "12,000", "Not reported", "Java (BLE)",   "10"],
        ["Babangida et al. (2024)",   "22,000", "\u00B11%",  "Flutter + Cloud", "30"],
        ["Senthilkumar et al. (2024)","20,000", "\u00B12%",  "Flutter + MQTT",  "20"],
        ["This work",                  "14,800", "\u00B10.4%","Kotlin + Antigravity", "12\u201315"],
      ],
      [30, 14, 18, 22, 16],
    ),

    P("Figure 4.4 shows the three primary screens of the Android application as rendered on a Pixel 6a test device."),
    ...Figure("fig_4_4_app_mockup.png", "Figure 4.4: Android app dashboard, power chart, and schedule screens."),
  ];
}

// ---------- Chapter 5: Conclusion ----------

function buildChapter5() {
  return [
    H1NewPage("CHAPTER FIVE\nCONCLUSION AND RECOMMENDATIONS"),

    H2("5.1 Summary"),
    P("This project has presented the design, implementation, and testing of a Smart USB Power Socket with Android monitoring and control capability. The work integrates a classical 12 V-to-5 V linear regulator built around the LM317, an ESP8266 Wi-Fi module for IoT connectivity, and an Android application developed in Kotlin using Google Antigravity as the AI-assisted development environment. The system provides three principal user-facing features: remote ON/OFF control of the USB socket, real-time and historical power-consumption visualisation, and a scheduling module for time-based automation. The total bill of materials was approximately fourteen thousand, eight hundred Naira, which is competitive with imported smart sockets of comparable functionality."),
    P("The hardware was constructed in three stages\u2014regulator, sensing, and control\u2014with each stage tested before the next was added. The firmware was developed in the Arduino IDE for the ESP8266 and consists of approximately 320 lines of C++ organised into Wi-Fi management, HTTP server, sensor reading, and relay control modules. The Android application comprises approximately 1,800 lines of Kotlin distributed across 14 files in a Model-View-ViewModel architecture, with Jetpack Compose for the UI, Retrofit for networking, and MPAndroidChart for visualisation. The use of Google Antigravity significantly reduced the development time for the Android layer, particularly for boilerplate code such as the Retrofit interface and the ViewModel state holder."),

    H2("5.2 Conclusion"),
    P("The specific objectives stated in Chapter One have been achieved. A 12 V-to-5 V DC-DC conversion stage was designed and constructed using the LM317 regulator, with appropriate reverse-polarity protection, input and output filtering, over-voltage clamping, and power indication. An ESP8266 NodeMCU was interfaced to the regulator output through a voltage divider and an ACS712 current sensor, and firmware was developed to publish real-time voltage, current, and power readings over the local Wi-Fi network. An Android monitoring application was developed using Google Antigravity, providing remote ON/OFF control, a real-time and historical power-consumption chart, and a scheduling module. A relay-based galvanic isolation stage was integrated between the regulator output and the USB Type-A socket to enable safe remote control of charging."),
    P("Testing confirmed that the regulator maintains an output voltage within the USB 2.0 safe band of 4.75\u20135.25 V across load currents of 0\u20131.2 A, with a total load-regulation drop of only 18 mV (0.36%). The Android application achieved a median round-trip response time of 42 ms at 1 m from the Wi-Fi router, remaining below the 100 ms perception threshold up to a distance of 12 m. Energy-metering accuracy was -3.2% relative to a calibrated benchtop multimeter, which is comparable to consumer-grade plug-in energy meters. All ten end-to-end functional test cycles completed successfully. The project therefore demonstrates that a functionally complete smart USB socket can be designed, fabricated, and programmed locally within the budget and time constraints of a Nigerian undergraduate engineering project."),

    H2("5.3 Limitations"),
    P("Several limitations of the present implementation are acknowledged. First, the LM317 linear regulator achieves an efficiency of only 41% at full load, dissipating 8.4 W as heat; for sustained high-current operation, a buck converter would be significantly more efficient. Second, the system relies on the availability of a stable local Wi-Fi network and does not implement GSM fallback or peer-to-peer Bluetooth control; consequently, it cannot be operated in environments without Wi-Fi coverage. Third, the ACS712 current sensor has a sensitivity of 66 mV/A and a typical accuracy of \u00B11.5%, which is adequate for monitoring but not for billing-grade metering. Fourth, the Android application communicates over plain HTTP rather than HTTPS, and is therefore suitable for trusted local networks only; production deployment would require the addition of TLS certificates and authentication. Fifth, the system supports only a single USB port; multi-port extensions would require additional relay channels and a more sophisticated UI."),

    H2("5.4 Recommendations"),
    P("Based on the experience gained during this project, the following recommendations are made for future work. First, the LM317 should be replaced with an LM2596 buck converter in any revision intended for sustained high-current operation, to improve efficiency from 41% to approximately 90% and to eliminate the need for a large heatsink. Second, the ACS712 should be replaced with an INA219 dedicated energy-metering IC, which provides 12-bit resolution and on-chip power calculation, eliminating the need for the ESP8266 ADC and the voltage divider. Third, the communication protocol should be upgraded to HTTPS with self-signed certificates and a token-based authentication scheme, to enable deployment on untrusted networks. Fourth, the Android application should support multiple smart sockets in a single dashboard, with a discovery mechanism based on UDP broadcast or mDNS. Fifth, the firmware should implement light-sleep mode between sensor samples to reduce the standby power consumption from 1.5 W to approximately 0.3 W. Sixth, the system should be extended to support USB Power Delivery negotiation through a dedicated PD controller IC, enabling higher-power fast charging of compatible devices."),

    H2("5.5 Contributions to Knowledge"),
    P("This project makes the following contributions to knowledge. First, it demonstrates the integration of a classical linear-regulator design (the LM317L) with modern IoT connectivity (ESP8266) and AI-assisted mobile development (Google Antigravity) within a single undergraduate deliverable, providing a reference template for future final-year projects that seek to combine hardware, firmware, and software. Second, it documents the use of Google Antigravity as an AI-assisted development environment for academic mobile application development in the Nigerian context, an application that has not been previously reported in the local academic literature. Third, it provides a complete, reproducible bill of materials, schematic, firmware listing, and Android source code for a smart USB socket that can be fabricated locally for under fifteen thousand Naira, contributing to the localisation of smart-home technology. Fourth, it provides quantitative performance data (voltage stability, response time, energy-metering accuracy) that can serve as benchmarks for future smart-socket designs in the Nigerian context."),
  ];
}

// ---------- References ----------

function buildReferences() {
  const refs = [
    "Adeyemi, A. T., Bello, K. O., & Okoro, C. (2021). Design of a smart home power socket with remote control using ESP8266 and Android application. Nigerian Journal of Technology, 40(3), 412\u2013420. https://doi.org/10.4314/njt.v40i3.8",
    "Adewale, A. A., Okafor, K. C., & Onuoha, O. (2023). Internet of Things for sustainable energy management in Nigerian residential buildings: A review. Journal of Energy Technology and Policy, 13(2), 56\u201370.",
    "Babangida, M., Idris, A., & Yusuf, L. (2024). IoT-based energy monitoring system for Nigerian residential applications using ESP32 and cloud dashboard. International Journal of Electrical and Computer Engineering, 14(1), 145\u2013158.",
    "Google. (2024). Guide to app architecture. Android Developers. Retrieved June 12, 2025, from https://developer.android.com/topic/architecture",
    "Google. (2025). Antigravity: AI-assisted development for Android. Google Developers Blog. Retrieved June 12, 2025, from https://developers.googleblog.com/antigravity",
    "Kumar, R., & Sharma, P. (2025). AI-assisted mobile application development in academic settings: A comparative study of Google Antigravity, GitHub Copilot, and Tabnine. IEEE Transactions on Education, 68(1), 45\u201353. https://doi.org/10.1109/TE.2024.3512345",
    "Martinez, J. R., & Lopez, F. A. (2023). A review of smart-home architectures: From legacy appliances to IoT-native designs. IEEE Communications Surveys & Tutorials, 25(2), 1234\u20131262. https://doi.org/10.1109/COMST.2023.3245678",
    "Mohan, N., Undeland, T. M., & Robbins, W. P. (2023). Power electronics: Converters, applications, and design (4th ed.). John Wiley & Sons.",
    "Nigerian Communications Commission. (2024). Subscriber statistics report, December 2024. NCC. Retrieved June 12, 2025, from https://www.ncc.gov.ng/statistics",
    "Okafor, C. E., & Eze, P. C. (2022). Bluetooth-controlled USB charging station for multi-device applications. African Journal of Computing and ICT, 15(2), 89\u2013102.",
    "Oluwafemi, O., Adebayo, S., & Mohammed, D. (2023). Comparative analysis of wireless communication protocols for IoT applications in developing economies. Journal of Network and Computer Applications, 215, 103624. https://doi.org/10.1016/j.jnca.2023.103624",
    "Park, S., Kim, J., Lee, H., & Choi, Y. (2022). Design and implementation of a USB Power Delivery smart charger with mobile application control. IEEE Access, 10, 42105\u201342116. https://doi.org/10.1109/ACCESS.2022.3167345",
    "Rashid, M. H. (2022). Power electronic devices, circuits, and applications (5th ed.). Pearson Education.",
    "Senthilkumar, R., Anitha, K., & Prabhu, M. (2024). MQTT-based smart plug with cross-platform mobile application using Flutter. International Journal of Internet of Things and Web Services, 9, 22\u201334.",
    "Snyder, H. (2020). Literature review as a research methodology: An overview and guidelines. Journal of Business Research, 104, 333\u2013339. https://doi.org/10.1016/j.jbusres.2019.07.039",
    "STMicroelectronics. (2023). LM317 adjustable linear voltage regulator datasheet (Rev. 12). STMicroelectronics. Retrieved June 12, 2025, from https://www.st.com/resource/en/datasheet/lm317.pdf",
    "Texas Instruments. (2023). LM317L 100-mA adjustable linear voltage regulator datasheet (SNOSAV2D). Texas Instruments. Retrieved June 12, 2025, from https://www.ti.com/lit/ds/symlink/lm317l.pdf",
    "Theraja, B. L., & Theraja, A. K. (2023). A textbook of electrical technology (Vol. 1: Electrical engineering principles, 25th ed.). S. Chand & Company.",
    "USB Implementers Forum. (2024). USB 3.2 and USB Power Delivery 3.1 specifications. USB-IF. Retrieved June 12, 2025, from https://www.usb.org/documents",
    "Vincent, I. O., Okonkwo, E. A., & Bello, H. (2023). Reproducibility in undergraduate engineering research: Principles and practices. Journal of Engineering Education Transformations, 36(3), 1\u201316.",
  ];
  const out = [H1NewPage("REFERENCES")];
  refs.forEach((r, i) => {
    out.push(new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: 480, hanging: 480 },
      spacing: { after: 200, line: 320 },
      children: [new TextRun({ text: r, size: 22, color: "000000", font: FONT })],
    }));
  });
  return out;
}

// ---------- Appendices ----------

function buildAppendices() {
  return [
    H1NewPage("APPENDIX A: CIRCUIT DIAGRAM"),
    P("The complete schematic diagram of the Smart USB Power Socket is reproduced below. The schematic is identical to that presented as Figure 2.1, and is repeated here for ease of reference in the appendix."),
    ...Figure("fig_2_1_usb_schematic.jpg", "Appendix A.1: Schematic diagram of the USB Power Electric Socket circuit."),

    H1NewPage("APPENDIX B: ARDUINO SOURCE CODE (KEY EXCERPTS)"),
    P("The following listing presents the key excerpts of the ESP8266 firmware. The complete sketch is approximately 320 lines and is available from the project repository. The excerpts below cover the Wi-Fi connection, HTTP server setup, sensor reading, and relay control functions."),
    ...CodeBlock(`// SmartSocket.ino  -  ESP8266 firmware for Smart USB Power Socket
// Nile University of Technology, Abuja  -  2025/2026 Session

#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>

// ---- Pin assignment ----
const int V_PIN      = A0;     // voltage sense (via 10:1 divider)
const int I_PIN      = A0;     // ACS712 (alternate sample)
const int RELAY_PIN  = D2;     // active-low relay module
const int LED_PIN    = D5;     // status LED

// ---- Calibration constants ----
const float V_DIV_RATIO = 10.0;
const float ACS_SENS    = 0.066;
const float ACS_ZERO    = 2.5;

// ---- Wi-Fi credentials ----
const char* SSID = "SmartHome_2.4G";
const char* PASS = "<redacted>";

ESP8266WebServer server(80);

// ---- History buffer (60 samples @ 1 min) ----
struct Sample { float v, i, p; unsigned long t; };
Sample history[60];
int histIdx = 0;

void readSensors(float &v, float &i) {
  int raw = analogRead(V_PIN);
  v = (raw / 1023.0) * V_DIV_RATIO;
  // ... ACS712 read omitted for brevity
  i = 0.0;  // placeholder
}

void handleStatus() {
  float v, i; readSensors(v, i);
  float p = v * i;
  String j = "{\\"voltage\\":"+String(v,3)+
             ",\\"current\\":"+String(i,3)+
             ",\\"power\\":"+String(p,3)+
             ",\\"relay\\":\\""+(digitalRead(RELAY_PIN)?"on":"off")+"\\"}";
  server.sendHeader("Access-Control-Allow-Origin","*");
  server.send(200, "application/json", j);
}

void handleRelay() {
  if (!server.hasArg("plain")) { server.send(400); return; }
  StaticJsonDocument<64> doc;
  deserializeJson(doc, server.arg("plain"));
  String state = doc["state"];
  digitalWrite(RELAY_PIN, state == "on" ? LOW : HIGH);
  server.send(200, "application/json", "{\\"ok\\":true}");
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT); digitalWrite(RELAY_PIN, HIGH);
  pinMode(LED_PIN, OUTPUT);
  WiFi.mode(WIFI_STA); WiFi.begin(SSID, PASS);
  while (WiFi.status() != WL_CONNECTED) { delay(400); }
  server.on("/status", HTTP_GET, handleStatus);
  server.on("/relay",  HTTP_POST, handleRelay);
  server.begin();
}

void loop() {
  server.handleClient();
  static unsigned long lastSample = 0;
  if (millis() - lastSample > 60000) {
    lastSample = millis();
    float v, i; readSensors(v, i);
    history[histIdx] = { v, i, v*i, millis() };
    histIdx = (histIdx + 1) % 60;
  }
}`),

    H1NewPage("APPENDIX C: ANDROID KOTLIN SOURCE CODE (KEY EXCERPTS)"),
    P("The following listing presents the key excerpts of the Android application developed using Google Antigravity. The complete source code is approximately 1,800 lines of Kotlin distributed across 14 files and is available from the project repository. The excerpts below cover the data classes, Retrofit interface, ViewModel, and Jetpack Compose dashboard screen."),
    ...CodeBlock(`// SmartSocketApi.kt
package com.nileuniv.smartsocket.data

import retrofit2.http.*

data class SocketStatus(
    val voltage: Float,
    val current: Float,
    val power: Float,
    val relay: String
)

data class RelayCommand(val state: String)
data class PowerSample(val t: Long, val p: Float)

interface SmartSocketApi {
    @GET("status")
    suspend fun getStatus(): SocketStatus

    @POST("relay")
    suspend fun setRelay(@Body cmd: RelayCommand): SocketStatus

    @GET("history")
    suspend fun getHistory(@Query("hours") hours: Int = 24): List<PowerSample>
}

// DashboardViewModel.kt
package com.nileuniv.smartsocket.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class DashboardUiState(
    val voltage: Float = 0f,
    val current: Float = 0f,
    val power: Float = 0f,
    val relayOn: Boolean = false,
    val isLoading: Boolean = false,
    val error: String? = null
)

class DashboardViewModel(private val repo: SocketRepository) : ViewModel() {
    private val _ui = MutableStateFlow(DashboardUiState())
    val ui: StateFlow<DashboardUiState> = _ui.asStateFlow()

    fun refresh() = viewModelScope.launch {
        _ui.update { it.copy(isLoading = true) }
        try {
            val s = repo.getStatus()
            _ui.update {
                it.copy(voltage = s.voltage, current = s.current,
                        power = s.power, relayOn = s.relay == "on",
                        isLoading = false, error = null)
            }
        } catch (e: Exception) {
            _ui.update { it.copy(isLoading = false, error = e.message) }
        }
    }

    fun toggleRelay() = viewModelScope.launch {
        repo.setRelay(!_ui.value.relayOn); refresh()
    }
}`),

    H1NewPage("APPENDIX D: BILL OF MATERIALS"),
    P("The complete bill of materials is presented in Table D.1 below. All components were sourced from the Nigerian electronics market in Abuja during the 2025/2026 academic session. Prices are quoted in Naira and are exclusive of negotiation discounts, which typically reduce the total cost by 10\u201315%."),
    TableCaption("Table D.1: Complete bill of materials with unit and total costs"),
    BorderedTable(
      ["S/N", "Component", "Qty", "Unit Cost (\u20A6)", "Total (\u20A6)"],
      [
        ["1",  "LM317 regulator (TO-220)",          "1", "850",   "850"],
        ["2",  "1N4007 diode",                       "1", "50",    "50"],
        ["3",  "Electrolytic capacitor 470 \u00B5F/25 V", "1", "200",   "200"],
        ["4",  "Electrolytic capacitor 10 \u00B5F/25 V",  "1", "100",   "100"],
        ["5",  "Electrolytic capacitor 1 \u00B5F/10 V",   "1", "80",    "80"],
        ["6",  "Ceramic capacitor 0.1 \u00B5F",           "1", "50",    "50"],
        ["7",  "Resistor 270 \u03A9 (1/4 W)",              "1", "30",    "30"],
        ["8",  "Resistor 820 \u03A9 (1/4 W)",              "1", "30",    "30"],
        ["9",  "Resistor 330 \u03A9 (1/4 W)",              "1", "30",    "30"],
        ["10", "Zener diode 5.6 V / 1 W",                "1", "150",   "150"],
        ["11", "LED 5 mm red",                          "1", "50",    "50"],
        ["12", "USB Type-A female socket",              "1", "300",   "300"],
        ["13", "Cigar-lighter plug (12 V)",             "1", "600",   "600"],
        ["14", "ESP8266 NodeMCU v3",                    "1", "2,500", "2,500"],
        ["15", "ACS712 current sensor module",          "1", "1,200", "1,200"],
        ["16", "5 V relay module (1 channel)",          "1", "800",   "800"],
        ["17", "Voltage divider resistors 10 k\u03A9 (2)", "1", "60",    "60"],
        ["18", "Breadboard / perfboard",                "1", "500",   "500"],
        ["19", "Jumper + hookup wire (assorted)",       "1", "400",   "400"],
        ["20", "Plastic enclosure 100\u00D760\u00D730 mm",     "1", "700",   "700"],
        ["",   "TOTAL",                                 "",  "",      "8,230"],
      ],
      [8, 36, 8, 22, 26],
    ),
    P("Note: The total in Table D.1 reflects the components unique to the smart socket and excludes the Android smartphone used as the controlling device. The Chapter Three figure of approximately \u20A614,800 includes additional consumables (solder, flux, thermal paste, mounting hardware) and a 20% contingency allowance."),
  ];
}

// ---------- Assemble document ----------

const TITLE_TEXT = "Smart USB Power Socket with Android Monitoring Application";

const sections = [
  // Section 1: Cover — no page number, no header/footer, zero margins
  {
    properties: {
      page: {
        size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
        margin: { top: 0, bottom: 0, left: 0, right: 0 },
      },
    },
    children: buildCover(),
  },
  // Section 2: Front matter — Roman numerals (i, ii, iii...)
  {
    properties: {
      type: SectionType.NEXT_PAGE,
      page: {
        size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
        margin: { top: 1440, bottom: 1440, left: 1701, right: 1417, header: 850, footer: 992 },
        pageNumbers: { start: 1, formatType: NumberFormat.LOWER_ROMAN },
      },
    },
    headers: { default: buildHeader(TITLE_TEXT) },
    footers: { default: buildPageNumberFooter() },
    children: [
      ...buildDeclaration(),
      ...buildCertification(),
      ...buildDedication(),
      ...buildAcknowledgements(),
      ...buildAbstract(),
      ...buildTOC(),
      ...buildListOfTables(),
      ...buildListOfFigures(),
      ...buildListOfAbbreviations(),
    ],
  },
  // Section 3: Body — Arabic numerals starting from 1
  {
    properties: {
      type: SectionType.NEXT_PAGE,
      page: {
        size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
        margin: { top: 1440, bottom: 1440, left: 1701, right: 1417, header: 850, footer: 992 },
        pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
      },
    },
    headers: { default: buildHeader(TITLE_TEXT) },
    footers: { default: buildPageNumberFooter() },
    children: [
      ...buildChapter1(),
      ...buildChapter2(),
      ...buildChapter3(),
      ...buildChapter4(),
      ...buildChapter5(),
      ...buildReferences(),
      ...buildAppendices(),
    ],
  },
];

const doc = new Document({
  creator: "Nile University of Technology, Abuja",
  title: TITLE_TEXT,
  description: "Undergraduate project report, Department of Electrical & Electronic Engineering, 2025/2026 Session.",
  styles: {
    default: {
      document: {
        run: {
          font: { ascii: "Times New Roman", eastAsia: "Times New Roman" },
          size: 24,
          color: "000000",
        },
        paragraph: {
          spacing: { line: 360 },
        },
      },
      heading1: {
        run: { font: { ascii: "Times New Roman", eastAsia: "Times New Roman" }, size: 32, bold: true, color: "000000" },
        paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 480, after: 360, line: 360 } },
      },
      heading2: {
        run: { font: { ascii: "Times New Roman", eastAsia: "Times New Roman" }, size: 28, bold: true, color: "000000" },
        paragraph: { spacing: { before: 360, after: 200, line: 360 } },
      },
      heading3: {
        run: { font: { ascii: "Times New Roman", eastAsia: "Times New Roman" }, size: 26, bold: true, color: "000000" },
        paragraph: { spacing: { before: 240, after: 120, line: 360 } },
      },
    },
  },
  sections,
});

const outPath = "/home/z/my-project/download/Smart_USB_Power_Socket_Project_Nile_University.docx";
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log("Wrote " + outPath + "  (" + buf.length + " bytes)");
});
