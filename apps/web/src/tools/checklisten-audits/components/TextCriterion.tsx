/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  state: any;
  onUpdate: (criterionId: string, patch: any) => void;
  onSave: (criterionId: string, updates: any) => void;
}

export function TextCriterion({ state, onUpdate, onSave }: Props) {
  const { criterionId, valueText } = state;

  return (
    <div>
      <label className="label-default">Texteingabe</label>
      <textarea
        value={valueText ?? ''}
        onChange={(e) => onUpdate(criterionId, { valueText: e.target.value })}
        onBlur={() => { if (valueText) onSave(criterionId, { valueText }); }}
        placeholder="Freitext eingeben..."
        rows={3}
        className="input-default resize-none w-full"
      />
    </div>
  );
}
