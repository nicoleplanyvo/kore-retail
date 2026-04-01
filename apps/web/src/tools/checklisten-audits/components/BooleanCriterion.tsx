/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckSquare, Square } from 'lucide-react';

interface Props {
  state: any;
  onUpdate: (criterionId: string, patch: any) => void;
  onSave: (criterionId: string, updates: any) => void;
}

export function BooleanCriterion({ state, onUpdate, onSave }: Props) {
  const { criterionId, valueBool } = state;

  const toggle = (value: boolean) => {
    onUpdate(criterionId, { valueBool: value });
    onSave(criterionId, { valueBool: value });
  };

  return (
    <div>
      <label className="label-default">Erledigt?</label>
      <div className="flex gap-md">
        <button type="button" onClick={() => toggle(true)}
          className={`flex items-center gap-sm px-xl py-md text-body font-medium border transition-colors ${
            valueBool === true
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'border-kore-border text-kore-mid hover:bg-emerald-50'
          }`}>
          <CheckSquare size={20} /> Ja
        </button>
        <button type="button" onClick={() => toggle(false)}
          className={`flex items-center gap-sm px-xl py-md text-body font-medium border transition-colors ${
            valueBool === false
              ? 'bg-red-600 text-white border-red-600'
              : 'border-kore-border text-kore-mid hover:bg-red-50'
          }`}>
          <Square size={20} /> Nein
        </button>
      </div>
    </div>
  );
}
