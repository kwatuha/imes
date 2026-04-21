/**
 * PDF exports from the M&E Excel bundle (GET /reports/me-report/export).
 * The printable PDF includes Summary, yearly, and coverage only (project list is Excel-only).
 */
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import reportsService from '../api/reportsService';

function cellText(ws, addr) {
  const c = ws[addr];
  if (!c) return '';
  if (c.w != null && c.w !== '') return String(c.w);
  if (c.v != null && c.v !== '') return String(c.v);
  return '';
}

function fmt(v) {
  if (v === null || v === undefined) return '';
  return String(v);
}

async function loadMEReportWorkbook() {
  const { blob, fileName } = await reportsService.downloadMEReport();
  const ab = await blob.arrayBuffer();
  const wb = XLSX.read(ab, { type: 'array', cellDates: true });
  return { wb, fileName };
}

/** Resolve worksheet by name (case-insensitive). */
function getWorksheetCI(wb, candidates) {
  const names = Array.isArray(candidates) ? candidates : [candidates];
  const found = wb.SheetNames.find((n) =>
    names.some((c) => n.toLowerCase() === String(c).toLowerCase())
  );
  return found ? wb.Sheets[found] : null;
}

function rowEmpty(row) {
  if (!row || !row.length) return true;
  return row.every((c) => !String(c ?? '').trim());
}

/**
 * Drop fully empty leading/trailing rows and unused empty columns.
 */
function padRows(matrix) {
  if (!matrix.length) return [];
  const maxC = Math.max(1, ...matrix.map((r) => r.length));
  return matrix.map((r) => {
    const x = [...r];
    while (x.length < maxC) x.push('');
    return x;
  });
}

function trimMatrix(matrix) {
  if (!matrix.length) return [];
  let start = 0;
  let end = matrix.length - 1;
  while (start <= end && rowEmpty(matrix[start])) start += 1;
  while (end >= start && rowEmpty(matrix[end])) end -= 1;
  if (start > end) return [];
  const slice = matrix.slice(start, end + 1);
  let minC = Infinity;
  let maxC = -1;
  slice.forEach((row) => {
    row.forEach((c, i) => {
      if (String(c ?? '').trim()) {
        minC = Math.min(minC, i);
        maxC = Math.max(maxC, i);
      }
    });
  });
  if (maxC < minC) {
    return slice.map((r) => [...r]);
  }
  return slice.map((r) => {
    const row = r.slice(minC, maxC + 1);
    return row;
  });
}

function sheetToMatrix(ws) {
  return XLSX.utils.sheet_to_json(ws, {
    header: 1,
    raw: false,
    defval: '',
  });
}

/** Status counts block (Summary sheet B5:C11 area). */
function getSummaryIndicatorRows(wb) {
  const summaryWs = getWorksheetCI(wb, ['Summary']);
  if (!summaryWs) return [];
  const rows = [];
  for (let r = 5; r <= 12; r++) {
    const label = cellText(summaryWs, `B${r}`);
    const val = cellText(summaryWs, `C${r}`);
    if (label || val) {
      rows.push([label, val]);
    }
  }
  return rows;
}

const HEAD_BLUE = {
  fillColor: [41, 128, 185],
  textColor: 255,
  fontStyle: 'bold',
};

function nextStartY(doc, marginBottom = 20) {
  const ly = doc.lastAutoTable?.finalY;
  return ly != null ? ly + marginBottom : marginBottom;
}

/**
 * Summary PDF: Status summary (Summary sheet) + Yearly sheet + Coverage sheet (matches API template).
 * @returns {Promise<void>}
 */
export async function downloadMEReportSummaryPdf() {
  const { wb, fileName } = await loadMEReportWorkbook();

  const summaryBody = getSummaryIndicatorRows(wb);

  const yearlyWs = getWorksheetCI(wb, ['yearly', 'Yearly']);
  const yearlyMatrix = yearlyWs ? trimMatrix(sheetToMatrix(yearlyWs)) : [];

  const coverageWs = getWorksheetCI(wb, ['coverage', 'Coverage']);
  const coverageMatrix = coverageWs ? trimMatrix(sheetToMatrix(coverageWs)) : [];

  const hasSummary = summaryBody.length > 0;
  const hasYearly = yearlyMatrix.length >= 2;
  const hasCoverage = coverageMatrix.length > 0;

  if (!hasSummary && !hasYearly && !hasCoverage) {
    throw new Error(
      'No data found for the summary PDF. Expected content on the Summary, yearly, or coverage sheets.'
    );
  }

  // Landscape fits yearly (9 columns) and long coverage lists.
  const doc = new jsPDF('landscape', 'pt', 'a4');
  const margin = { left: 36, right: 36 };
  let startY = 32;

  doc.setFontSize(14);
  doc.text('M&E Report — Summary, yearly & coverage', 40, startY);
  doc.setFontSize(9);
  doc.text(`Excel source: ${fileName}`, 40, startY + 16);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 40, startY + 30);

  startY = 76;

  if (hasSummary) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Status summary', 40, startY);
    doc.setFont('helvetica', 'normal');
    startY += 12;

    autoTable(doc, {
      head: [['Indicator', 'Value']],
      body: summaryBody,
      startY,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: HEAD_BLUE,
      alternateRowStyles: { fillColor: [250, 250, 250] },
      margin,
      tableWidth: 'wrap',
    });
    startY = nextStartY(doc, 22);
  }

  if (hasYearly) {
    const yearlyPadded = padRows(yearlyMatrix);
    const headRow = yearlyPadded[0].map(fmt);
    const bodyRows = yearlyPadded.slice(1).map((r) => r.map(fmt));
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Yearly breakdown', 40, startY);
    doc.setFont('helvetica', 'normal');
    startY += 12;

    autoTable(doc, {
      head: [headRow],
      body: bodyRows,
      startY,
      styles: {
        fontSize: 7,
        cellPadding: 2,
        overflow: 'linebreak',
        valign: 'middle',
      },
      headStyles: { ...HEAD_BLUE, fontSize: 7 },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      margin,
    });
    startY = nextStartY(doc, 22);
  }

  if (hasCoverage) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Coverage (sub-counties & wards)', 40, startY);
    doc.setFont('helvetica', 'normal');
    startY += 12;

    autoTable(doc, {
      body: padRows(coverageMatrix).map((r) => r.map(fmt)),
      startY,
      styles: {
        fontSize: 7,
        cellPadding: 2,
        overflow: 'linebreak',
        valign: 'top',
      },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      margin,
    });
  }

  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`me_report_summary_${dateStr}.pdf`);
}
