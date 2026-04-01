/**
 * Checklisten & Audits — Scoring-Logik
 * Shared zwischen API (Berechnung bei Abschluss) und Frontend (Live-Preview)
 *
 * Unterstützt gemischte Kriterientypen:
 *   SCORED  — Prozent-Slider 0-100, fließt in gewichteten Score ein
 *   BOOLEAN — Ja/Nein, 100 % bei bestanden / 0 % bei nicht bestanden
 *   TEXT    — Freitext, zählt als erledigt/nicht erledigt, kein Score-Einfluss
 *   NUMBER  — Zahlenwert, zählt als erledigt/nicht erledigt, kein Score-Einfluss
 */
export interface ScoredCategory {
    categoryId: string;
    categoryName: string;
    weight: number;
    criteriaCount: number;
    scoredCount: number;
    averagePercent: number;
    passCount: number;
    failCount: number;
    passRate: number;
    completedCount: number;
}
export interface AuditScoreResult {
    overallScore: number;
    overallPassRate: number;
    completionRate: number;
    categories: ScoredCategory[];
}
export type CriterionType = 'SCORED' | 'BOOLEAN' | 'TEXT' | 'NUMBER';
interface CategoryInput {
    id: string;
    name: string;
    weight: number;
    criteria: Array<{
        id: string;
        isRequired: boolean;
        type?: CriterionType;
    }>;
}
interface ResponseInput {
    criterionId: string;
    scorePercent: number | null;
    passed: boolean | null;
    valueBool?: boolean | null;
    valueText?: string | null;
    valueNumber?: number | null;
}
/**
 * Berechnet den gewichteten Gesamtscore eines Audits.
 * BOOLEAN-Items: 100 % (bestanden) oder 0 % (nicht bestanden).
 * TEXT/NUMBER-Items: Zählen als erledigt, beeinflussen aber nicht den Prozent-Score.
 */
export declare function calculateAuditScore(categories: CategoryInput[], responses: ResponseInput[]): AuditScoreResult;
/**
 * Berechnet die Completion-Rate für einfache Checklisten.
 * Gibt einen Wert zwischen 0 und 100 zurück.
 */
export declare function calculateCompletionRate(totalItems: number, completedItems: number): number;
export {};
//# sourceMappingURL=audit-scoring.d.ts.map