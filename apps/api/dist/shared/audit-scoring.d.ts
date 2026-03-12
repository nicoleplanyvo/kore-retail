/**
 * Store Excellence Audit — Scoring-Logik
 * Shared zwischen API (Berechnung bei Abschluss) und Frontend (Live-Preview)
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
}
export interface AuditScoreResult {
    overallScore: number;
    overallPassRate: number;
    categories: ScoredCategory[];
}
interface CategoryInput {
    id: string;
    name: string;
    weight: number;
    criteria: Array<{
        id: string;
        isRequired: boolean;
    }>;
}
interface ResponseInput {
    criterionId: string;
    scorePercent: number | null;
    passed: boolean | null;
}
/**
 * Berechnet den gewichteten Gesamtscore eines Audits.
 * Jede Kategorie hat ein Gewicht (weight), der Gesamtscore ist der gewichtete Durchschnitt.
 */
export declare function calculateAuditScore(categories: CategoryInput[], responses: ResponseInput[]): AuditScoreResult;
export {};
//# sourceMappingURL=audit-scoring.d.ts.map