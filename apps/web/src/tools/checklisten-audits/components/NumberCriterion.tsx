/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  state: any;
  onUpdate: (criterionId: string, patch: any) => void;
  onSave: (criterionId: string, updates: any) => void;
}

export function NumberCriterion({ state, onUpdate, onSave }: Props) {
  const { criterionId, valueNumber } = state;

  return (
    <div>
      <label className="label-default">Zahlenwert</label>
      <input
        type="number"
        value={valueNumber ?? ''}
        onChange={(e) => {
          const val = e.target.value === '' ? null : parseFloat(e.target.value);
          onUpdate(criterionId, { valueNumber: val });
        }}
        onBlur={() => {
          if (valueNumber !== null) onSave(criterionId, { valueNumber });
        }}
        placeholder="Wert eingeben..."
        className="input-default w-full"
        step="any"
      />
    </div>
  );
}
