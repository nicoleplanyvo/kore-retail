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
/**
 * Berechnet den gewichteten Gesamtscore eines Audits.
 * BOOLEAN-Items: 100 % (bestanden) oder 0 % (nicht bestanden).
 * TEXT/NUMBER-Items: Zählen als erledigt, beeinflussen aber nicht den Prozent-Score.
 */
export function calculateAuditScore(categories, responses) {
    const responseMap = new Map(responses.map((r) => [r.criterionId, r]));
    let totalWeight = 0;
    let weightedScoreSum = 0;
    let totalPassed = 0;
    let totalEvaluated = 0;
    let totalCriteria = 0;
    let totalCompleted = 0;
    const scoredCategories = categories.map((cat) => {
        const catResult = scoreSingleCategory(cat, responseMap);
        totalWeight += cat.weight;
        weightedScoreSum += catResult.averagePercent * cat.weight;
        totalPassed += catResult.passCount;
        totalEvaluated += catResult.passCount + catResult.failCount;
        totalCriteria += catResult.criteriaCount;
        totalCompleted += catResult.completedCount;
        return catResult;
    });
    const overallScore = totalWeight > 0 ? Math.round((weightedScoreSum / totalWeight) * 10) / 10 : 0;
    const overallPassRate = totalEvaluated > 0 ? Math.round((totalPassed / totalEvaluated) * 1000) / 10 : 0;
    const completionRate = totalCriteria > 0 ? Math.round((totalCompleted / totalCriteria) * 1000) / 10 : 0;
    return { overallScore, overallPassRate, completionRate, categories: scoredCategories };
}
/** Berechnet Score-Daten einer einzelnen Kategorie. */
function scoreSingleCategory(cat, responseMap) {
    let catScoreSum = 0;
    let catScored = 0;
    let catPassed = 0;
    let catFailed = 0;
    let catCompleted = 0;
    for (const crit of cat.criteria) {
        const resp = responseMap.get(crit.id);
        if (!resp)
            continue;
        const critType = crit.type ?? 'SCORED';
        const completed = isResponseCompleted(critType, resp);
        if (completed)
            catCompleted++;
        if (critType === 'SCORED') {
            if (resp.scorePercent !== null && resp.scorePercent !== undefined) {
                catScoreSum += resp.scorePercent;
                catScored++;
            }
            if (resp.passed === true) {
                catPassed++;
            }
            else if (resp.passed === false) {
                catFailed++;
            }
        }
        else if (critType === 'BOOLEAN') {
            const boolVal = resp.valueBool ?? resp.passed;
            if (boolVal === true) {
                catScoreSum += 100;
                catScored++;
                catPassed++;
            }
            else if (boolVal === false) {
                catScoreSum += 0;
                catScored++;
                catFailed++;
            }
        }
        // TEXT/NUMBER: zählen nur für Completion, nicht für Score
    }
    const avgPercent = catScored > 0 ? catScoreSum / catScored : 0;
    const passRate = catPassed + catFailed > 0 ? (catPassed / (catPassed + catFailed)) * 100 : 0;
    return {
        categoryId: cat.id,
        categoryName: cat.name,
        weight: cat.weight,
        criteriaCount: cat.criteria.length,
        scoredCount: catScored,
        averagePercent: Math.round(avgPercent * 10) / 10,
        passCount: catPassed,
        failCount: catFailed,
        passRate: Math.round(passRate * 10) / 10,
        completedCount: catCompleted,
    };
}
/** Prüft ob eine Antwort als erledigt gilt. */
function isResponseCompleted(critType, resp) {
    switch (critType) {
        case 'SCORED':
            return resp.scorePercent !== null && resp.scorePercent !== undefined;
        case 'BOOLEAN':
            return (resp.valueBool ?? resp.passed) !== null && (resp.valueBool ?? resp.passed) !== undefined;
        case 'TEXT':
            return resp.valueText !== null && resp.valueText !== undefined && resp.valueText !== '';
        case 'NUMBER':
            return resp.valueNumber !== null && resp.valueNumber !== undefined;
        default:
            return false;
    }
}
/**
 * Berechnet die Completion-Rate für einfache Checklisten.
 * Gibt einen Wert zwischen 0 und 100 zurück.
 */
export function calculateCompletionRate(totalItems, completedItems) {
    if (totalItems <= 0)
        return 0;
    return Math.round((completedItems / totalItems) * 1000) / 10;
}
//# sourceMappingURL=audit-scoring.js.map