import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { useStdStores, useCreateEvaluation } from '../useStoreStandards';
import { Breadcrumb } from '../../../components/Breadcrumb';

export function NewEvaluationPage() {
  const navigate = useNavigate();
  const { data: stores } = useStdStores();
  const createMut = useCreateEvaluation();
  const [storeId, setStoreId] = useState('');
  const [period, setPeriod] = useState(() => {
    const d = new Date();
    const weekNum = Math.ceil(
      (d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / 604800000,
    );
    return `${d.getFullYear()}-KW${String(weekNum).padStart(2, '0')}`;
  });

  const handleCreate = () => {
    if (!storeId || !period) return;
    createMut.mutate(
      { storeId, period },
      {
        onSuccess: (data) => {
          navigate(`/app/tools/store-standards/${data.id}`);
        },
      },
    );
  };

  return (
    <div className="p-xl max-w-2xl">
      <Breadcrumb
        items={[
          { label: 'Store Standards', href: '/app/tools/store-standards' },
          { label: 'Neue Bewertung' },
        ]}
      />
      <button
        onClick={() => navigate('/app/tools/store-standards')}
        className="flex items-center gap-sm text-small text-kore-mid hover:text-kore-ink mb-xl"
      >
        <ArrowLeft size={16} /> Zurueck
      </button>

      <h1 className="font-display text-h1 text-kore-ink mb-2xl flex items-center gap-sm">
        <Plus size={24} /> Neue Bewertung
      </h1>

      <div className="bg-kore-white border border-kore-border p-xl space-y-lg">
        <div>
          <label className="block text-small text-kore-mid uppercase tracking-widest mb-sm">
            Store
          </label>
          <select
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            className="w-full border border-kore-border px-lg py-md text-body bg-white focus:outline-none focus:border-kore-brass"
          >
            <option value="">Store waehlen...</option>
            {(stores ?? []).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
                {s.city ? ` (${s.city})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-small text-kore-mid uppercase tracking-widest mb-sm">
            Periode
          </label>
          <input
            type="text"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            placeholder="z.B. 2025-KW12"
            className="w-full border border-kore-border px-lg py-md text-body focus:outline-none focus:border-kore-brass"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleCreate}
            disabled={!storeId || !period || createMut.isPending}
            className="flex items-center gap-sm bg-kore-ink text-kore-white px-xl py-sm text-small font-medium uppercase tracking-widest hover:bg-kore-brass transition-colors disabled:opacity-50"
          >
            <CheckCircle size={16} /> Bewertung starten
          </button>
        </div>
        {createMut.isError && (
          <div className="flex items-center gap-sm text-small text-red-600">
            <AlertCircle size={14} />
            {(createMut.error as Error).message}
          </div>
        )}
      </div>
    </div>
  );
}
