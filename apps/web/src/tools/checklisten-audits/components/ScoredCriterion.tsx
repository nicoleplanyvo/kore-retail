/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  state: any;
  onUpdate: (criterionId: string, patch: any) => void;
  onSave: (criterionId: string, updates: any) => void;
}

export function ScoredCriterion({ state, onUpdate, onSave }: Props) {
  const { criterionId } = state;

  return (
    <>
      {/* Score Slider */}
      <div>
        <label className="label-default">Score: {state.scorePercent ?? '—'}%</label>
        <input
          type="range" min={0} max={100} step={5}
          value={state.scorePercent ?? 50}
          onChange={(e) => onUpdate(criterionId, { scorePercent: parseInt(e.target.value) })}
          onMouseUp={(e) => onSave(criterionId, { scorePercent: parseInt((e.target as HTMLInputElement).value) })}
          onTouchEnd={(e) => onSave(criterionId, { scorePercent: parseInt((e.target as HTMLInputElement).value) })}
          className="w-full accent-kore-brass h-2"
        />
      </div>

      {/* Pass/Fail */}
      <div>
        <label className="label-default">Bestanden?</label>
        <div className="flex gap-md">
          <button type="button"
            onClick={() => { onUpdate(criterionId, { passed: true }); onSave(criterionId, { passed: true }); }}
            className={`px-lg py-sm text-small font-medium uppercase tracking-widest border transition-colors ${
              state.passed === true
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'border-kore-border text-kore-mid hover:bg-emerald-50'
            }`}>
            Ja
          </button>
          <button type="button"
            onClick={() => { onUpdate(criterionId, { passed: false }); onSave(criterionId, { passed: false }); }}
            className={`px-lg py-sm text-small font-medium uppercase tracking-widest border transition-colors ${
              state.passed === false
                ? 'bg-red-600 text-white border-red-600'
                : 'border-kore-border text-kore-mid hover:bg-red-50'
            }`}>
            Nein
          </button>
        </div>
      </div>
    </>
  );
}
