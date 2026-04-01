import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ChevronDown, ChevronRight, Copy, Trash2, ClipboardCheck, CheckSquare } from 'lucide-react';
import { useCATemplates, useDeleteCATemplate, useCloneCATemplate } from '../useChecklistenAudits';
import { Breadcrumb } from '../../../components/Breadcrumb';

export function TemplatesPage() {
  const [typeFilter, setTypeFilter] = useState<'AUDIT' | 'CHECKLIST' | undefined>(undefined);
  const { data: templates, isLoading } = useCATemplates(typeFilter);
  const deleteTemplate = useDeleteCATemplate();
  const cloneTemplate = useCloneCATemplate();

  const auditTemplates = (templates ?? []).filter((t: any) => t.templateType === 'AUDIT');
  const checklistTemplates = (templates ?? []).filter((t: any) => t.templateType === 'CHECKLIST');

  return (
    <div className="p-xl max-w-6xl">
      <Breadcrumb items={[
        { label: 'Checklisten & Audits', href: '/app/tools/checklisten-audits' },
        { label: 'Templates' },
      ]} />

      <div className="flex items-center justify-between mb-2xl">
        <h1 className="font-display text-h1 text-kore-ink">Templates</h1>
        <Link to="new" className="flex items-center gap-sm bg-kore-ink text-kore-white px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-brass transition-colors">
          <Plus size={16} /> Neues Template
        </Link>
      </div>

      {isLoading ? (
        <div className="text-body text-kore-mid">Lade Templates...</div>
      ) : (
        <div className="space-y-2xl">
          {/* Audit Templates */}
          <TemplateGroup
            title="Audit-Templates"
            icon={<ClipboardCheck size={18} className="text-kore-brass" />}
            templates={auditTemplates}
            onDelete={(id) => deleteTemplate.mutate(id)}
            onClone={(id) => cloneTemplate.mutate(id)}
          />

          {/* Checklisten Templates */}
          <TemplateGroup
            title="Checklisten-Templates"
            icon={<CheckSquare size={18} className="text-blue-600" />}
            templates={checklistTemplates}
            onDelete={(id) => deleteTemplate.mutate(id)}
            onClone={(id) => cloneTemplate.mutate(id)}
          />
        </div>
      )}
    </div>
  );
}

// ── Sub-Components ─────────────────────────────────

function TemplateGroup({
  title, icon, templates, onDelete, onClone,
}: {
  title: string;
  icon: React.ReactNode;
  templates: any[];
  onDelete: (id: string) => void;
  onClone: (id: string) => void;
}) {
  if (templates.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-md mb-lg">
        {icon}
        <h2 className="font-display text-h3 text-kore-ink">{title}</h2>
        <span className="text-caption text-kore-mid">({templates.length})</span>
      </div>
      <div className="space-y-sm">
        {templates.map((t: any) => (
          <TemplateCard key={t.id} template={t} onDelete={onDelete} onClone={onClone} />
        ))}
      </div>
    </div>
  );
}

function TemplateCard({
  template, onDelete, onClone,
}: {
  template: any;
  onDelete: (id: string) => void;
  onClone: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const categories = template.categories ?? [];
  const totalCriteria = categories.reduce(
    (sum: number, cat: any) => sum + (cat.criteria?.length ?? cat._count?.criteria ?? 0),
    0,
  );

  return (
    <div className="bg-kore-white border border-kore-border">
      <div className="flex items-center justify-between p-lg">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-md flex-1 text-left"
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <div>
            <h3 className="text-body font-medium text-kore-ink">{template.name}</h3>
            <div className="flex items-center gap-lg text-small text-kore-mid">
              <span>{categories.length} Kategorien</span>
              <span>{totalCriteria} Kriterien</span>
              {template.isDefault && (
                <span className="text-caption text-kore-brass border border-kore-brass px-sm py-px uppercase tracking-widest">KORE Standard</span>
              )}
              {template.recurrence && (
                <span className="text-caption">{template.recurrence}</span>
              )}
              <span>v{template.version}</span>
            </div>
          </div>
        </button>
        <div className="flex gap-sm">
          <button onClick={() => onClone(template.id)} title="Klonen"
            className="p-sm text-kore-mid hover:text-kore-ink transition-colors">
            <Copy size={16} />
          </button>
          {!template.isDefault && (
            <button onClick={() => onDelete(template.id)} title="Löschen"
              className="p-sm text-kore-mid hover:text-red-600 transition-colors">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {expanded && categories.length > 0 && (
        <div className="border-t border-kore-border px-lg py-md space-y-md">
          {categories.map((cat: any) => (
            <div key={cat.id}>
              <div className="flex items-center justify-between mb-xs">
                <span className="text-small font-medium text-kore-ink">{cat.name}</span>
                <span className="text-caption text-kore-mid">Gewicht: {cat.weight}</span>
              </div>
              <div className="pl-lg space-y-xs">
                {(cat.criteria ?? []).map((crit: any) => (
                  <div key={crit.id} className="flex items-center justify-between text-small text-kore-mid">
                    <span>{crit.name}</span>
                    <div className="flex items-center gap-md">
                      <span className="text-caption border border-kore-border px-sm py-px uppercase tracking-widest">{crit.type ?? 'SCORED'}</span>
                      {crit.isRequired && <span className="text-caption text-kore-brass">Pflicht</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
