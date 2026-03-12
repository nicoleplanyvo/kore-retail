/**
 * KORE Tool Route Registry
 *
 * Mapping von ToolDefinition.key → Dashboard-Route.
 * Wenn ein neues Tool ein Dashboard-UI bekommt, wird hier der
 * Eintrag hinzugefügt — das reicht, damit es in der ToolsOverviewPage
 * automatisch klickbar wird.
 */
export const TOOL_ROUTES: Record<string, string> = {
  'standards.excellence_tracker': '/tools/sea',
  'standards.checklisten': '/tools/checklisten',
  'standards.sop_bibliothek': '/tools/sop',
  'standards.vm_foto_compliance': '/tools/vm-compliance',
  'standards.store_standards': '/tools/store-standards',
  // Performance & Sichtbarkeit
  'performance.kpi_dashboard': '/tools/kpi',
  'performance.budget_tracker': '/tools/budget',
  'performance.forecast': '/tools/forecast',
  'performance.loss_prevention': '/tools/loss-prevention',
  'performance.inventory': '/tools/inventory',
};

/**
 * Gibt die Dashboard-Route für ein Tool zurück, falls vorhanden.
 */
export function getToolRoute(toolKey: string): string | undefined {
  return TOOL_ROUTES[toolKey];
}
