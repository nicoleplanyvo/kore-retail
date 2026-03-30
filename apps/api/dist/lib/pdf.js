import PDFDocument from 'pdfkit';
const COLORS = {
    brass: '#b08d57',
    ink: '#1a1a1a',
    mid: '#6b7280',
    border: '#e5e7eb',
    surface: '#f9fafb',
};
export function createPdfDocument(title = 'KORE Report') {
    const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 60, left: 50, right: 50 },
        info: { Title: title, Author: 'KORE Retail Platform' },
        bufferPages: true,
    });
    return doc;
}
export function addHeader(doc, title, subtitle) {
    // KORE brass bar at top
    doc.rect(50, 30, 495, 3).fill(COLORS.brass);
    doc.fontSize(20).fillColor(COLORS.ink).text(title, 50, 50);
    if (subtitle) {
        doc.fontSize(10).fillColor(COLORS.mid).text(subtitle, 50, 75);
    }
    doc.moveDown(2);
}
export function addSectionTitle(doc, title) {
    const y = doc.y;
    doc.fontSize(14).fillColor(COLORS.brass).text(title, 50, y);
    doc.moveDown(0.5);
    doc.rect(50, doc.y, 200, 1).fill(COLORS.brass);
    doc.moveDown(1);
}
export function addKeyValue(doc, label, value) {
    const y = doc.y;
    doc.fontSize(9).fillColor(COLORS.mid).text(label, 50, y, { width: 140 });
    doc.fontSize(11).fillColor(COLORS.ink).text(value, 200, y);
    doc.y = Math.max(doc.y, y + 16);
    doc.moveDown(0.3);
}
export function addTable(doc, headers, rows, colWidths) {
    const startX = 50;
    const widths = colWidths || headers.map(() => Math.floor(495 / headers.length));
    // Header row
    let x = startX;
    const headerY = doc.y;
    doc.fontSize(8).fillColor(COLORS.mid);
    headers.forEach((h, i) => {
        doc.text(h.toUpperCase(), x, headerY, { width: widths[i], align: 'left' });
        x += widths[i];
    });
    doc.moveDown(0.5);
    doc.rect(startX, doc.y, 495, 0.5).fill(COLORS.border);
    doc.moveDown(0.5);
    // Data rows
    rows.forEach((row) => {
        if (doc.y > 720) {
            doc.addPage();
        }
        x = startX;
        const y = doc.y;
        doc.fontSize(9).fillColor(COLORS.ink);
        row.forEach((cell, i) => {
            doc.text(cell, x, y, { width: widths[i], align: 'left' });
            x += widths[i];
        });
        doc.moveDown(0.8);
    });
}
export function addFooter(doc) {
    const pages = doc.bufferedPageRange();
    for (let i = pages.start; i < pages.start + pages.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(8).fillColor(COLORS.mid);
        doc.text(`KORE Retail Platform  --  Seite ${i + 1} von ${pages.count}  --  ${new Date().toLocaleDateString('de-DE')}`, 50, 780, { align: 'center', width: 495 });
    }
}
/** Formatiert eine Zahl im deutschen Format (z.B. 1.234,56) */
export function fmtDe(n, decimals = 0) {
    return n.toLocaleString('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
/** Formatiert Euro-Betraege im deutschen Format (z.B. 1.234,56 EUR) */
export function fmtEur(n, decimals = 2) {
    return `${fmtDe(n, decimals)} EUR`;
}
//# sourceMappingURL=pdf.js.map