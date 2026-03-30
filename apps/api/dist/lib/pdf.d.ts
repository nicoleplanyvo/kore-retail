import PDFDocument from 'pdfkit';
export declare function createPdfDocument(title?: string): InstanceType<typeof PDFDocument>;
export declare function addHeader(doc: InstanceType<typeof PDFDocument>, title: string, subtitle?: string): void;
export declare function addSectionTitle(doc: InstanceType<typeof PDFDocument>, title: string): void;
export declare function addKeyValue(doc: InstanceType<typeof PDFDocument>, label: string, value: string): void;
export declare function addTable(doc: InstanceType<typeof PDFDocument>, headers: string[], rows: string[][], colWidths?: number[]): void;
export declare function addFooter(doc: InstanceType<typeof PDFDocument>): void;
/** Formatiert eine Zahl im deutschen Format (z.B. 1.234,56) */
export declare function fmtDe(n: number, decimals?: number): string;
/** Formatiert Euro-Betraege im deutschen Format (z.B. 1.234,56 EUR) */
export declare function fmtEur(n: number, decimals?: number): string;
//# sourceMappingURL=pdf.d.ts.map