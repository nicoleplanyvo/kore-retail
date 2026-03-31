#!/usr/bin/env npx tsx

/**
 * KORE Retail Platform — API Smoke Test
 *
 * Tests all 34 tool endpoints with GET-only requests.
 * No destructive operations are performed.
 *
 * Usage:
 *   npx tsx scripts/test-api.ts
 *   npx tsx scripts/test-api.ts --url=https://app.kore-retail.de
 */

import { writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ToolDefinition {
  readonly name: string;
  readonly slug: string;
  readonly endpoints: readonly string[];
}

interface EndpointResult {
  readonly endpoint: string;
  readonly url: string;
  readonly status: number | null;
  readonly ok: boolean;
  readonly warning: boolean;
  readonly ms: number;
  readonly dataCount: number | null;
  readonly error: string | null;
}

interface ToolResult {
  readonly tool: string;
  readonly slug: string;
  readonly endpoints: readonly EndpointResult[];
}

interface Report {
  readonly timestamp: string;
  readonly baseUrl: string;
  readonly totalEndpoints: number;
  readonly passed: number;
  readonly warned: number;
  readonly failed: number;
  readonly passRate: string;
  readonly tools: readonly ToolResult[];
  readonly failures: readonly { tool: string; endpoint: string; status: number | null; error: string | null }[];
  readonly warnings: readonly { tool: string; endpoint: string; status: number | null; error: string | null }[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const REQUEST_TIMEOUT_MS = 5_000;

const TOOLS: readonly ToolDefinition[] = [
  { name: 'Store Excellence Audit', slug: 'sea', endpoints: ['/stores', '/templates', '/sessions'] },
  { name: 'Checklisten', slug: 'checklisten', endpoints: ['/stores', '/templates'] },
  { name: 'SOP Bibliothek', slug: 'sop', endpoints: ['/stores', '/categories', '/documents'] },
  { name: 'VM Foto-Compliance', slug: 'vm-compliance', endpoints: ['/stores', '/checks', '/dashboard'] },
  { name: 'Store Standards', slug: 'store-standards', endpoints: ['/stores', '/scenarios'] },
  { name: 'KPI Dashboard', slug: 'kpi', endpoints: ['/stores', '/entries', '/summary'] },
  { name: 'Budget Tracker', slug: 'budget', endpoints: ['/stores', '/targets', '/dashboard'] },
  { name: 'Forecast', slug: 'forecast', endpoints: ['/stores', '/', '/dashboard'] },
  { name: 'Loss Prevention', slug: 'loss-prevention', endpoints: ['/stores', '/incidents', '/dashboard'] },
  { name: 'Inventory', slug: 'inventory', endpoints: ['/stores', '/counts'] },
  { name: 'Live Floor', slug: 'live-floor', endpoints: ['/stores', '/zones', '/dashboard'] },
  { name: 'FR Tracking', slug: 'fr-tracking', endpoints: ['/stores', '/dashboard', '/entries'] },
  { name: 'VM Guidelines', slug: 'vm-guidelines', endpoints: ['/stores', '/', '/dashboard'] },
  { name: 'Maintenance', slug: 'maintenance', endpoints: ['/stores', '/requests', '/dashboard'] },
  { name: 'Training Hub', slug: 'training-hub', endpoints: ['/courses', '/enrollments', '/reports/completion'] },
  { name: 'Training Hours', slug: 'training-hours', endpoints: ['/stores', '/logs', '/summary'] },
  { name: 'Challenges', slug: 'challenges', endpoints: ['/stores', '/', '/dashboard'] },
  { name: 'Onboarding', slug: 'onboarding', endpoints: ['/stores', '/templates', '/journeys'] },
  { name: 'Coaching', slug: 'coaching', endpoints: ['/stores', '/sessions', '/dashboard'] },
  { name: 'PDP/PIP', slug: 'pdp-pip', endpoints: ['/stores', '/plans', '/dashboard'] },
  { name: 'Appraisals', slug: 'appraisals', endpoints: ['/stores', '/appraisals', '/dashboard'] },
  { name: 'Shift Planning', slug: 'shift-planning', endpoints: ['/stores', '/users', '/dashboard'] },
  { name: 'Pulse Survey', slug: 'pulse-survey', endpoints: ['/stores', '/surveys', '/dashboard'] },
  { name: 'Wellbeing', slug: 'wellbeing', endpoints: ['/stores', '/checkins', '/dashboard'] },
  { name: 'Briefings', slug: 'briefings', endpoints: ['/stores', '/', '/dashboard'] },
  { name: 'Handover', slug: 'handover', endpoints: ['/stores', '/', '/dashboard'] },
  { name: 'Team Push', slug: 'team-push', endpoints: ['/stores', '/messages'] },
  { name: 'Newsletter', slug: 'newsletter', endpoints: ['/', '/dashboard'] },
  { name: 'FR Conversion', slug: 'fr-conversion', endpoints: ['/stores', '/rooms', '/dashboard'] },
  { name: 'Clienteling', slug: 'clienteling', endpoints: ['/stores', '/customers', '/dashboard'] },
  { name: 'Stock Callouts', slug: 'stock-callouts', endpoints: ['/stores', '/callouts', '/dashboard'] },
  { name: 'Track & Trace', slug: 'track-trace', endpoints: ['/stores', '/orders', '/dashboard'] },
  { name: 'Multi-Store', slug: 'multi-store', endpoints: ['/stores', '/comparison'] },
  { name: 'RM Dashboard', slug: 'rm-dashboard', endpoints: ['/stores', '/summary'] },
] as const;

// ---------------------------------------------------------------------------
// ANSI color helpers
// ---------------------------------------------------------------------------

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
} as const;

function green(s: string): string { return `${c.green}${s}${c.reset}`; }
function red(s: string): string { return `${c.red}${s}${c.reset}`; }
function yellow(s: string): string { return `${c.yellow}${s}${c.reset}`; }
function cyan(s: string): string { return `${c.cyan}${s}${c.reset}`; }
function bold(s: string): string { return `${c.bold}${s}${c.reset}`; }
function dim(s: string): string { return `${c.dim}${s}${c.reset}`; }

// ---------------------------------------------------------------------------
// Arg parsing
// ---------------------------------------------------------------------------

function parseArgs(): { baseUrl: string } {
  const args = process.argv.slice(2);
  let baseUrl = 'http://localhost:3001';

  for (const arg of args) {
    if (arg.startsWith('--url=')) {
      baseUrl = arg.slice('--url='.length).replace(/\/+$/, '');
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
${bold('KORE API Smoke Test')}

${bold('Usage:')}
  npx tsx scripts/test-api.ts [options]

${bold('Options:')}
  --url=<base>   Base URL of the API (default: http://localhost:3001)
  --help, -h     Show this help message
`);
      process.exit(0);
    }
  }

  return { baseUrl };
}

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function login(baseUrl: string): Promise<string> {
  const url = `${baseUrl}/api/auth/login`;
  const body = JSON.stringify({ email: 'ta@modehouse.de', password: 'demo1234' });

  const res = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  }, REQUEST_TIMEOUT_MS);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Login failed (${res.status}): ${text}`);
  }

  const data = await res.json() as { accessToken?: string; token?: string };
  const token = data.accessToken ?? data.token;
  if (!token) {
    throw new Error('Login response missing accessToken field');
  }
  return token;
}

// ---------------------------------------------------------------------------
// Data count extraction
// ---------------------------------------------------------------------------

function extractDataCount(body: unknown): number | null {
  if (Array.isArray(body)) {
    return body.length;
  }
  if (body !== null && typeof body === 'object') {
    const obj = body as Record<string, unknown>;
    // Common paginated envelope: { data: [...], total: N }
    if (Array.isArray(obj.data)) {
      return obj.data.length;
    }
    if (typeof obj.total === 'number') {
      return obj.total;
    }
    // Dashboard / summary endpoints return an object — no count
  }
  return null;
}

// ---------------------------------------------------------------------------
// Endpoint testing
// ---------------------------------------------------------------------------

async function testEndpoint(
  baseUrl: string,
  token: string,
  slug: string,
  endpoint: string,
): Promise<EndpointResult> {
  // Normalize: '/' means the tool root, otherwise append the sub-path
  const path = endpoint === '/'
    ? `/api/tools/${slug}`
    : `/api/tools/${slug}${endpoint}`;
  const url = `${baseUrl}${path}`;

  const start = performance.now();
  try {
    const res = await fetchWithTimeout(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }, REQUEST_TIMEOUT_MS);

    const ms = Math.round(performance.now() - start);

    let dataCount: number | null = null;
    let errorText: string | null = null;

    if (res.ok) {
      try {
        const json = await res.json();
        dataCount = extractDataCount(json);
      } catch {
        // Non-JSON body is fine for some endpoints
      }
    } else {
      errorText = await res.text().catch(() => null);
      // Truncate long error messages
      if (errorText && errorText.length > 200) {
        errorText = errorText.slice(0, 200) + '...';
      }
    }

    // 403 means tool not assigned — expected for some tenants
    const warning = res.status === 403;
    const ok = res.ok || warning;

    return { endpoint, url, status: res.status, ok, warning, ms, dataCount, error: ok ? null : errorText };
  } catch (err) {
    const ms = Math.round(performance.now() - start);
    const message = err instanceof Error ? err.message : String(err);
    const isTimeout = message.includes('abort');
    return {
      endpoint,
      url,
      status: null,
      ok: false,
      warning: false,
      ms,
      dataCount: null,
      error: isTimeout ? 'TIMEOUT' : message,
    };
  }
}

async function testTool(
  baseUrl: string,
  token: string,
  tool: ToolDefinition,
): Promise<ToolResult> {
  const results: EndpointResult[] = [];
  for (const ep of tool.endpoints) {
    const result = await testEndpoint(baseUrl, token, tool.slug, ep);
    results.push(result);
  }
  return { tool: tool.name, slug: tool.slug, endpoints: results };
}

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

function statusCell(r: EndpointResult): string {
  if (r.warning) {
    const label = `W ${r.status}`;
    return yellow(label.padEnd(10));
  }
  if (r.ok) {
    const count = r.dataCount !== null ? ` (${r.dataCount})` : '';
    const label = `P ${r.status}${count}`;
    return green(label.padEnd(10));
  }
  const label = r.status !== null ? `F ${r.status}` : 'F ERR';
  return red(label.padEnd(10));
}

function printTable(results: readonly ToolResult[]): void {
  // Collect all unique endpoint names in order of first appearance
  const allEndpoints: string[] = [];
  for (const tr of results) {
    for (const er of tr.endpoints) {
      if (!allEndpoints.includes(er.endpoint)) {
        allEndpoints.push(er.endpoint);
      }
    }
  }

  const nameWidth = 26;
  const colWidth = 14;

  // Header
  const headerName = bold('Tool'.padEnd(nameWidth));
  const headerCols = allEndpoints.map((ep) => bold(ep.padEnd(colWidth))).join('');
  const headerMs = bold('Avg ms'.padEnd(8));
  console.log(`  ${headerName}${headerCols}${headerMs}`);
  console.log(dim(`  ${'─'.repeat(nameWidth + allEndpoints.length * colWidth + 8)}`));

  for (const tr of results) {
    const name = tr.tool.length > nameWidth - 1
      ? tr.tool.slice(0, nameWidth - 2) + '..'
      : tr.tool;

    const cols = allEndpoints.map((ep) => {
      const found = tr.endpoints.find((e) => e.endpoint === ep);
      if (!found) return dim('—'.padEnd(colWidth));
      return statusCell(found).padEnd(colWidth);
    }).join('');

    const avgMs = tr.endpoints.length > 0
      ? Math.round(tr.endpoints.reduce((s, e) => s + e.ms, 0) / tr.endpoints.length)
      : 0;

    console.log(`  ${name.padEnd(nameWidth)}${cols}${dim(String(avgMs).padStart(5) + ' ms')}`);
  }
}

function printSummary(report: Report): void {
  const total = report.totalEndpoints;
  const pct = report.passRate;

  console.log('');
  console.log(bold('  Summary'));
  console.log(dim(`  ${'─'.repeat(50)}`));
  console.log(`  Endpoints tested:  ${bold(String(total))}`);
  console.log(`  Passed:            ${green(String(report.passed))}`);
  console.log(`  Warnings (403):    ${yellow(String(report.warned))}`);
  console.log(`  Failed:            ${report.failed > 0 ? red(String(report.failed)) : green('0')}`);
  console.log(`  Pass rate:         ${Number(pct.replace('%', '')) >= 90 ? green(pct) : red(pct)}`);

  if (report.failures.length > 0) {
    console.log('');
    console.log(bold(red('  Failures:')));
    for (const f of report.failures) {
      const statusStr = f.status !== null ? String(f.status) : 'ERR';
      const errStr = f.error ? ` — ${f.error.slice(0, 80)}` : '';
      console.log(red(`    - ${f.tool} ${f.endpoint}: ${statusStr}${errStr}`));
    }
  }

  if (report.warnings.length > 0) {
    console.log('');
    console.log(bold(yellow('  Warnings (tool not assigned / 403):')));
    for (const w of report.warnings) {
      console.log(yellow(`    - ${w.tool} ${w.endpoint}: ${w.status}`));
    }
  }
}

// ---------------------------------------------------------------------------
// Report builder
// ---------------------------------------------------------------------------

function buildReport(baseUrl: string, results: readonly ToolResult[]): Report {
  const failures: Report['failures'][number][] = [];
  const warnings: Report['warnings'][number][] = [];
  let passed = 0;
  let warned = 0;
  let failed = 0;
  let totalEndpoints = 0;

  for (const tr of results) {
    for (const er of tr.endpoints) {
      totalEndpoints++;
      if (er.warning) {
        warned++;
        warnings.push({ tool: tr.tool, endpoint: er.endpoint, status: er.status, error: er.error });
      } else if (er.ok) {
        passed++;
      } else {
        failed++;
        failures.push({ tool: tr.tool, endpoint: er.endpoint, status: er.status, error: er.error });
      }
    }
  }

  const passRate = totalEndpoints > 0
    ? `${((passed + warned) / totalEndpoints * 100).toFixed(1)}%`
    : '0%';

  return {
    timestamp: new Date().toISOString(),
    baseUrl,
    totalEndpoints,
    passed,
    warned,
    failed,
    passRate,
    tools: results,
    failures,
    warnings,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const { baseUrl } = parseArgs();

  console.log('');
  console.log(bold(cyan('  KORE Retail Platform — API Smoke Test')));
  console.log(dim(`  Target: ${baseUrl}`));
  console.log(dim(`  Time:   ${new Date().toISOString()}`));
  console.log('');

  // 1. Login
  process.stdout.write(dim('  Authenticating... '));
  let token: string;
  try {
    token = await login(baseUrl);
    console.log(green('OK'));
  } catch (err) {
    console.log(red('FAILED'));
    console.error(red(`  ${err instanceof Error ? err.message : String(err)}`));
    process.exit(1);
  }

  // 2. Test all tools
  const totalEndpoints = TOOLS.reduce((s, t) => s + t.endpoints.length, 0);
  console.log(dim(`  Testing ${TOOLS.length} tools (${totalEndpoints} endpoints)...\n`));

  const results: ToolResult[] = [];
  let completed = 0;

  for (const tool of TOOLS) {
    const result = await testTool(baseUrl, token, tool);
    results.push(result);
    completed += tool.endpoints.length;
    const pct = Math.round((completed / totalEndpoints) * 100);
    process.stdout.write(`\r  ${dim(`Progress: ${completed}/${totalEndpoints} (${pct}%)`)}`);
  }
  console.log('\n');

  // 3. Print results
  printTable(results);
  console.log('');

  // 4. Build and print summary
  const report = buildReport(baseUrl, results);
  printSummary(report);

  // 5. Save JSON report
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const outputPath = resolve(scriptDir, 'test-results.json');
  await writeFile(outputPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log('');
  console.log(dim(`  Report saved to ${outputPath}`));
  console.log('');

  // Exit with non-zero if there are hard failures
  if (report.failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(red(`\n  Fatal error: ${err instanceof Error ? err.message : String(err)}`));
  process.exit(1);
});
