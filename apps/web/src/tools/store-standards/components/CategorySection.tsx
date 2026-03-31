import { Save } from 'lucide-react';
import type { StdCategory, StdDefinition, StdScore } from '../useStoreStandards';
import { evaluateScorePreview } from '../useStoreStandards';
import { ScoreBar } from './ScoreBar';
import { OperatorBadge } from './OperatorBadge';

// ---------- DefinitionRow ----------

function DefinitionRow({
  definition,
  existingScore,
  value,
  onValueChange,
  onSave,
  isSaving,
  isEditable,
}: {
  definition: StdDefinition;
  existingScore: StdScore | undefined;
  value: { actualValue: string; comment: string };
  onValueChange: (defId: string, field: 'actualValue' | 'comment', val: string) => void;
  onSave: (defId: string) => void;
  isSaving: boolean;
  isEditable: boolean;
}) {
  const preview = value.actualValue
    ? evaluateScorePreview(
        parseFloat(value.actualValue),
        definition.targetValue,
        definition.operator,
      )
    : null;

  return (
    <div className="p-lg">
      <div className="flex items-center justify-between mb-sm">
        <div>
          <span className="text-body font-medium text-kore-ink">
            {definition.name}
          </span>
          {definition.description && (
            <p className="text-small text-kore-mid mt-xs">
              {definition.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-md flex-shrink-0">
          <OperatorBadge
            operator={definition.operator}
            targetValue={definition.targetValue}
            unit={definition.unit}
          />
          <span className="text-small text-kore-faint">
            Gew. {definition.weight}
          </span>
        </div>
      </div>

      {isEditable ? (
        <div className="flex items-end gap-md">
          <div className="flex-1">
            <label className="text-small text-kore-mid">Ist-Wert</label>
            <input
              type="number"
              step="0.01"
              value={value.actualValue}
              onChange={(e) =>
                onValueChange(definition.id, 'actualValue', e.target.value)
              }
              className="w-full border border-kore-border px-md py-sm text-body focus:outline-none focus:border-kore-brass mt-xs"
              placeholder={`Ziel: ${definition.targetValue}${definition.unit ? ' ' + definition.unit : ''}`}
            />
          </div>
          <div className="flex-1">
            <label className="text-small text-kore-mid">Kommentar</label>
            <input
              type="text"
              value={value.comment}
              onChange={(e) =>
                onValueChange(definition.id, 'comment', e.target.value)
              }
              className="w-full border border-kore-border px-md py-sm text-body focus:outline-none focus:border-kore-brass mt-xs"
              placeholder="Optional..."
            />
          </div>
          <button
            onClick={() => onSave(definition.id)}
            disabled={!value.actualValue || isSaving}
            className="flex items-center gap-sm border border-kore-border text-kore-ink px-md py-sm text-small hover:bg-kore-surface transition-colors disabled:opacity-30"
          >
            <Save size={14} />
          </button>
        </div>
      ) : existingScore ? (
        <div className="flex items-center gap-md">
          <span className="text-body text-kore-ink">
            {existingScore.actualValue}
            {definition.unit ? ` ${definition.unit}` : ''}
          </span>
          {existingScore.comment && (
            <span className="text-small text-kore-mid">
              — {existingScore.comment}
            </span>
          )}
        </div>
      ) : null}

      {/* Score preview or existing */}
      {(preview ?? existingScore) && (
        <div className="mt-sm flex items-center gap-md">
          <span
            className={`text-small font-medium ${
              (preview?.passed ?? existingScore?.passed)
                ? 'text-emerald-600'
                : 'text-red-600'
            }`}
          >
            {(preview?.passed ?? existingScore?.passed)
              ? 'Bestanden'
              : 'Nicht bestanden'}
          </span>
          <span className="text-small text-kore-faint">
            Score: {Math.round(preview?.score ?? existingScore?.score ?? 0)}%
          </span>
        </div>
      )}
    </div>
  );
}

// ---------- CategorySection ----------

export function CategorySection({
  category,
  existingScores,
  values,
  onValueChange,
  onSaveScore,
  isSaving,
  isEditable,
}: {
  category: StdCategory;
  existingScores: Map<string, StdScore>;
  values: Map<string, { actualValue: string; comment: string }>;
  onValueChange: (defId: string, field: 'actualValue' | 'comment', value: string) => void;
  onSaveScore: (defId: string) => void;
  isSaving: boolean;
  isEditable: boolean;
}) {
  const categoryScores = category.definitions
    .map((d) => existingScores.get(d.id))
    .filter(Boolean) as StdScore[];
  const avgScore =
    categoryScores.length > 0
      ? Math.round(
          categoryScores.reduce((s, sc) => s + sc.score, 0) /
            categoryScores.length,
        )
      : null;

  return (
    <div className="bg-kore-white border border-kore-border">
      <div className="p-lg border-b border-kore-border flex items-center justify-between">
        <div>
          <h3 className="font-display text-h3 text-kore-ink">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-small text-kore-mid mt-xs">
              {category.description}
            </p>
          )}
        </div>
        {avgScore !== null && (
          <div className="w-24">
            <ScoreBar score={avgScore} label={`${avgScore}%`} />
          </div>
        )}
      </div>

      <div className="divide-y divide-kore-border">
        {category.definitions.map((def) => (
          <DefinitionRow
            key={def.id}
            definition={def}
            existingScore={existingScores.get(def.id)}
            value={values.get(def.id) ?? { actualValue: '', comment: '' }}
            onValueChange={onValueChange}
            onSave={onSaveScore}
            isSaving={isSaving}
            isEditable={isEditable}
          />
        ))}
      </div>
    </div>
  );
}
