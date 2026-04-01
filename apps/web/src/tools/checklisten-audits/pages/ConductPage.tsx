import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { api } from '../../../lib/api';
import { ScoredCriterion } from '../components/ScoredCriterion';
import { BooleanCriterion } from '../components/BooleanCriterion';
import { TextCriterion } from '../components/TextCriterion';
import { NumberCriterion } from '../components/NumberCriterion';

const BASE = '/api/tools/checklisten-audits';

interface CriterionState {
  criterionId: string;
  scorePercent: number | null;
  passed: boolean | null;
  comment: string;
  valueBool: boolean | null;
  valueText: string;
  valueNumber: number | null;
  saving: boolean;
}

export function ConductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [currentCatIdx, setCurrentCatIdx] = useState(0);
  const [responses, setResponses] = useState<Map<string, CriterionState>>(new Map());
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    api<any>(`${BASE}/sessions/${id}`)
      .then((data) => {
        setSession(data);
        const cats = data.template?.categories ?? [];
        setCategories(cats);
        setResponses(buildResponseMap(cats, data.responses ?? []));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const saveResponse = useCallback(
    async (criterionId: string, updates: Partial<CriterionState>) => {
      markSaving(criterionId, true);
      try {
        await api(`${BASE}/sessions/${id}/responses/${criterionId}`, {
          method: 'PUT',
          body: JSON.stringify({
            scorePercent: updates.scorePercent,
            passed: updates.passed,
            comment: updates.comment,
            valueBool: updates.valueBool,
            valueText: updates.valueText,
            valueNumber: updates.valueNumber,
          }),
        });
      } catch (error) {
        console.error('Speichern fehlgeschlagen:', error);
      } finally {
        markSaving(criterionId, false);
      }
    },
    [id],
  );

  const markSaving = (criterionId: string, saving: boolean) => {
    setResponses((prev) => {
      const next = new Map(prev);
      const current = next.get(criterionId);
      if (current) next.set(criterionId, { ...current, saving });
      return next;
    });
  };

  const updateLocal = (criterionId: string, patch: Partial<CriterionState>) => {
    setResponses((prev) => {
      const next = new Map(prev);
      const current = next.get(criterionId);
      if (current) next.set(criterionId, { ...current, ...patch });
      return next;
    });
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await api(`${BASE}/sessions/${id}/complete`, { method: 'POST' });
      navigate(`/app/tools/checklisten-audits/sessions/${id}`);
    } catch (error) {
      console.error('Abschließen fehlgeschlagen:', error);
      setCompleting(false);
    }
  };

  if (loading || !session) {
    return <div className="p-xl"><div className="text-body text-kore-mid">Lade Session...</div></div>;
  }

  if (session.status === 'COMPLETED' || session.status === 'CANCELLED') {
    navigate(`/app/tools/checklisten-audits/sessions/${id}`);
    return null;
  }

  const currentCategory = categories[currentCatIdx];
  const criteria = currentCategory?.criteria ?? [];
  const isLastCategory = currentCatIdx === categories.length - 1;
  const isFirstCategory = currentCatIdx === 0;
  const isAudit = session.template?.templateType === 'AUDIT';

  const { answeredCount, totalCount, progressPct, runningScore } = computeProgress(categories, responses);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-kore-white border-b border-kore-border px-lg py-md-sm">
        <div className="flex items-center justify-between mb-sm">
          <span className="text-caption text-kore-mid uppercase tracking-widest">
            {session.template?.name} — {session.store?.name}
          </span>
          <div className="flex items-center gap-lg text-small text-kore-mid">
            <span>{answeredCount}/{totalCount} bewertet</span>
            {isAudit && runningScore > 0 && (
              <span className="font-medium text-kore-ink">Score: {runningScore.toFixed(1)}%</span>
            )}
          </div>
        </div>
        <div className="w-full h-1 bg-kore-border rounded-full overflow-hidden">
          <div className="h-full bg-kore-brass transition-all duration-300" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="flex gap-sm mt-md-sm overflow-x-auto">
          {categories.map((cat: any, idx: number) => (
            <button key={cat.id} onClick={() => setCurrentCatIdx(idx)}
              className={`whitespace-nowrap px-md-sm py-xs text-caption uppercase tracking-widest transition-colors ${
                idx === currentCatIdx
                  ? 'text-kore-brass border-b-2 border-kore-brass'
                  : 'text-kore-faint hover:text-kore-mid'
              }`}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-lg md:p-xl space-y-lg max-w-3xl">
        <h2 className="font-display text-h2 text-kore-ink">{currentCategory?.name}</h2>
        {currentCategory?.description && (
          <p className="text-small text-kore-mid">{currentCategory.description}</p>
        )}
        {currentCategory?.weight > 0 && isAudit && (
          <p className="text-caption text-kore-mid">Gewicht: {currentCategory.weight}%</p>
        )}

        {criteria.map((criterion: any) => {
          const state = responses.get(criterion.id);
          if (!state) return null;
          const critType = criterion.type ?? 'SCORED';

          return (
            <div key={criterion.id} className="bg-kore-white border border-kore-border p-lg space-y-md">
              <CriterionHeader criterion={criterion} />

              {critType === 'SCORED' && (
                <ScoredCriterion state={state} onUpdate={updateLocal} onSave={saveResponse} />
              )}
              {critType === 'BOOLEAN' && (
                <BooleanCriterion state={state} onUpdate={updateLocal} onSave={saveResponse} />
              )}
              {critType === 'TEXT' && (
                <TextCriterion state={state} onUpdate={updateLocal} onSave={saveResponse} />
              )}
              {critType === 'NUMBER' && (
                <NumberCriterion state={state} onUpdate={updateLocal} onSave={saveResponse} />
              )}

              {/* Comment (all types) */}
              <div>
                <label className="label-default">Kommentar</label>
                <textarea
                  value={state.comment}
                  onChange={(e) => updateLocal(criterion.id, { comment: e.target.value })}
                  onBlur={() => { if (state.comment) saveResponse(criterion.id, { comment: state.comment }); }}
                  placeholder="Optionaler Kommentar..."
                  rows={2}
                  className="input-default resize-none w-full"
                />
              </div>

              {state.saving && <span className="text-caption text-kore-faint">Speichern...</span>}
            </div>
          );
        })}
      </div>

      {/* Bottom Bar */}
      <div className="sticky bottom-0 bg-kore-white border-t border-kore-border px-lg py-md flex items-center justify-between">
        <button onClick={() => setCurrentCatIdx((i) => Math.max(0, i - 1))} disabled={isFirstCategory}
          className="flex items-center gap-xs text-small text-kore-mid hover:text-kore-ink disabled:opacity-30 transition-colors">
          <ChevronLeft size={16} /> Zurück
        </button>

        {isLastCategory ? (
          <button onClick={handleComplete} disabled={completing}
            className="flex items-center gap-sm bg-kore-success text-white px-xl py-md-sm text-small font-medium uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50">
            <CheckCircle size={16} />
            {completing ? 'Wird abgeschlossen...' : 'Abschließen'}
          </button>
        ) : (
          <button onClick={() => setCurrentCatIdx((i) => Math.min(categories.length - 1, i + 1))}
            className="flex items-center gap-xs text-small text-kore-brass hover:text-kore-brass-dk transition-colors">
            Weiter <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────

function buildResponseMap(cats: any[], existingResponses: any[]): Map<string, CriterionState> {
  const resMap = new Map<string, CriterionState>();
  for (const cat of cats) {
    for (const crit of cat.criteria ?? []) {
      const existing = existingResponses.find((r: any) => r.criterionId === crit.id);
      resMap.set(crit.id, {
        criterionId: crit.id,
        scorePercent: existing?.scorePercent ?? null,
        passed: existing?.passed ?? null,
        comment: existing?.comment ?? '',
        valueBool: existing?.valueBool ?? null,
        valueText: existing?.valueText ?? '',
        valueNumber: existing?.valueNumber ?? null,
        saving: false,
      });
    }
  }
  return resMap;
}

function computeProgress(categories: any[], responses: Map<string, CriterionState>) {
  let totalCount = 0;
  let answeredCount = 0;
  let weightedSum = 0;
  let totalWeight = 0;

  for (const cat of categories) {
    for (const crit of cat.criteria ?? []) {
      totalCount++;
      const state = responses.get(crit.id);
      if (!state) continue;
      const type = crit.type ?? 'SCORED';
      if (type === 'SCORED' && state.scorePercent !== null) {
        answeredCount++;
        weightedSum += state.scorePercent * (cat.weight || 1);
        totalWeight += cat.weight || 1;
      } else if (type === 'BOOLEAN' && state.valueBool !== null) {
        answeredCount++;
        weightedSum += (state.valueBool ? 100 : 0) * (cat.weight || 1);
        totalWeight += cat.weight || 1;
      } else if (type === 'TEXT' && state.valueText) {
        answeredCount++;
      } else if (type === 'NUMBER' && state.valueNumber !== null) {
        answeredCount++;
      }
    }
  }

  const progressPct = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
  const runningScore = totalWeight > 0 ? weightedSum / totalWeight : 0;

  return { answeredCount, totalCount, progressPct, runningScore };
}

function CriterionHeader({ criterion }: { criterion: any }) {
  return (
    <div className="flex items-start justify-between gap-md">
      <div>
        <h3 className="text-body text-kore-ink font-medium">{criterion.name}</h3>
        {criterion.description && (
          <p className="text-small text-kore-mid mt-xs">{criterion.description}</p>
        )}
      </div>
      <div className="flex items-center gap-md flex-shrink-0">
        {criterion.isRequired && <span className="text-caption text-kore-brass">Pflicht</span>}
        <span className="text-caption text-kore-mid border border-kore-border px-sm py-px uppercase tracking-widest">
          {criterion.type ?? 'SCORED'}
        </span>
      </div>
    </div>
  );
}
