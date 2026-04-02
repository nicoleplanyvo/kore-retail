import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import {
  useStdCategories,
  useStdEvaluation,
  useSaveScore,
  useCompleteEvaluation,
  type StdScore,
} from '../useStoreStandards';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { ScoreBar } from '../components/ScoreBar';
import { CategorySection } from '../components/CategorySection';

export function EvaluationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: evaluation, isLoading } = useStdEvaluation(id);
  const { data: categories } = useStdCategories();
  const saveScoreMut = useSaveScore();
  const completeMut = useCompleteEvaluation();

  const [values, setValues] = useState<
    Map<string, { actualValue: string; comment: string }>
  >(new Map());

  // Populate values from existing scores
  useEffect(() => {
    if (!evaluation?.scores) return;
    setValues((prev) => {
      const next = new Map(prev);
      for (const score of evaluation.scores ?? []) {
        if (!next.has(score.definitionId)) {
          next.set(score.definitionId, {
            actualValue: String(score.actualValue),
            comment: score.comment ?? '',
          });
        }
      }
      return next;
    });
  }, [evaluation?.scores]);

  const existingScores = useMemo(() => {
    const map = new Map<string, StdScore>();
    for (const s of evaluation?.scores ?? []) {
      map.set(s.definitionId, s);
    }
    return map;
  }, [evaluation?.scores]);

  const handleValueChange = (
    defId: string,
    field: 'actualValue' | 'comment',
    val: string,
  ) => {
    setValues((prev) => {
      const next = new Map(prev);
      const current = next.get(defId) ?? { actualValue: '', comment: '' };
      next.set(defId, { ...current, [field]: val });
      return next;
    });
  };

  const handleSaveScore = (defId: string) => {
    if (!id) return;
    const val = values.get(defId);
    if (!val?.actualValue) return;
    saveScoreMut.mutate({
      evaluationId: id,
      definitionId: defId,
      actualValue: parseFloat(val.actualValue),
      comment: val.comment || undefined,
    });
  };

  const handleComplete = () => {
    if (!id) return;
    if (!confirm('Bewertung abschliessen? Dies kann nicht rueckgaengig gemacht werden.')) {
      return;
    }
    completeMut.mutate(id, {
      onSuccess: () => {
        navigate('/app/tools/store-standards');
      },
    });
  };

  if (isLoading) {
    return <div className="p-xl text-body text-kore-mid">Lade...</div>;
  }
  if (!evaluation) {
    return (
      <div className="p-xl text-body text-kore-mid">
        Bewertung nicht gefunden.
      </div>
    );
  }

  const isEditable = evaluation.status === 'IN_PROGRESS';

  // Calculate live overall score from existing scores
  const totalWeight = (evaluation.scores ?? []).reduce(
    (sum, s) => sum + (s.definition?.weight ?? 1),
    0,
  );
  const weightedSum = (evaluation.scores ?? []).reduce(
    (sum, s) => sum + s.score * (s.definition?.weight ?? 1),
    0,
  );
  const liveOverall =
    totalWeight > 0 ? Math.round(weightedSum / totalWeight) : null;
  const displayScore = evaluation.overallScore ?? liveOverall;

  return (
    <div className="p-xl max-w-4xl">
      <Breadcrumb
        items={[
          { label: 'Store Standards', href: '/app/tools/store-standards' },
          { label: evaluation.store?.name ?? 'Bewertung' },
        ]}
      />
      <button
        onClick={() => navigate('/app/tools/store-standards')}
        className="flex items-center gap-sm text-small text-kore-mid hover:text-kore-ink mb-xl"
      >
        <ArrowLeft size={16} /> Zurueck
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-2xl">
        <div>
          <h1 className="font-display text-h1 text-kore-ink">
            {evaluation.store?.name}
          </h1>
          <div className="flex items-center gap-md mt-sm">
            <span className="text-small text-kore-mid">
              {evaluation.period}
            </span>
            <span className="text-small text-kore-faint">
              {new Date(evaluation.evaluatedAt).toLocaleDateString('de-DE')}
            </span>
            <span
              className={`text-small font-medium px-md py-xs border ${
                evaluation.status === 'COMPLETED'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {evaluation.status === 'COMPLETED'
                ? 'Abgeschlossen'
                : 'In Arbeit'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-md">
          {displayScore !== null && displayScore !== undefined && (
            <div className="text-center">
              <div className="font-display text-h1 text-kore-ink">
                {Math.round(displayScore)}%
              </div>
              <div className="text-small text-kore-mid">Gesamt</div>
            </div>
          )}
          {isEditable && (
            <button
              onClick={handleComplete}
              disabled={
                completeMut.isPending ||
                (evaluation.scores ?? []).length === 0
              }
              className="flex items-center gap-sm bg-emerald-600 text-white px-lg py-sm text-small font-medium uppercase tracking-widest hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <CheckCircle size={16} /> Abschliessen
            </button>
          )}
        </div>
      </div>

      {/* Overall score bar */}
      {displayScore !== null && displayScore !== undefined && (
        <div className="mb-xl">
          <ScoreBar score={displayScore} label="Gesamtscore" />
        </div>
      )}

      {/* Categories with definitions */}
      <div className="space-y-xl">
        {(categories ?? []).map((cat) => (
          <CategorySection
            key={cat.id}
            category={cat}
            existingScores={existingScores}
            values={values}
            onValueChange={handleValueChange}
            onSaveScore={handleSaveScore}
            isSaving={saveScoreMut.isPending}
            isEditable={isEditable}
          />
        ))}
      </div>

      {completeMut.isError && (
        <div className="mt-xl flex items-center gap-sm text-small text-red-600">
          <AlertCircle size={14} />
          {(completeMut.error as Error).message}
        </div>
      )}
    </div>
  );
}
