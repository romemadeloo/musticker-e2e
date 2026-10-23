import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { createHash, randomUUID } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

export const hash = value => createHash('sha256').update(value).digest('hex')
export function safePath(root, relative) {
  if (typeof relative !== 'string' || !relative || !/^[a-zA-Z0-9_./-]+$/.test(relative) || relative.split('/').some(x => !x || x === '.' || x === '..') || path.isAbsolute(relative)) throw new Error('Invalid bundle path.')
  const base = fs.realpathSync(root)
  const target = path.resolve(base, relative)
  if (!target.startsWith(base + path.sep)) throw new Error('Path escapes bundle/repository.')
  let current = base
  for (const part of relative.split('/')) { current = path.join(current, part); if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) throw new Error('Symbolic links are not permitted in promotion paths.') }
  return target
}
export function devServers(servers) {
  if (!servers?.storefront || !servers.api) throw new Error('Promotion needs explicit storefront and API dev servers.')
  let tier
  for (const [kind, value] of Object.entries(servers)) {
    if (!['storefront', 'api', 'admin'].includes(kind)) throw new Error('Unknown server kind.')
    const url = new URL(value)
    const match = url.hostname.match(/^shared-dev-static-(sf|api|admin)(?:-([2-6]))?\.musticker\.com$/)
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || (!match && !local)) throw new Error('Promotion validation only accepts explicit dev/loopback servers.')
    if (match && match[1] !== ({ storefront: 'sf', api: 'api', admin: 'admin' })[kind]) throw new Error('Incorrect server role.')
    const current = local ? 'local' : (match[2] || '1')
    if (tier && tier !== current) throw new Error('Promotion servers belong to different environments.')
    tier = current
  }
  return servers
}
function payload(bundle, relative) {
  const file = safePath(bundle, `files/${relative}`)
  if (fs.statSync(file).size > 1024 * 1024) throw new Error('Bundle file exceeds 1 MB.')
  return fs.readFileSync(file)
}
export function inspectBundle(repo, bundle) {
  const manifestBytes = fs.readFileSync(safePath(bundle, 'manifest.json'))
  if (manifestBytes.length > 256 * 1024) throw new Error('Manifest is too large.')
  const manifest = JSON.parse(manifestBytes)
  if (manifest.version !== 1 || !/^[A-Z][A-Z0-9]{1,15}-[1-9][0-9]{0,9}$/.test(manifest.ticket || '')) throw new Error('Invalid promotion manifest version/ticket.')
  for (const field of ['reviewer', 'maintenanceOwner', 'build', 'buildEvidence']) if (typeof manifest[field] !== 'string' || !manifest[field].trim()) throw new Error(`Manifest needs ${field}.`)
  if (!['done', 'completed', 'closed'].includes(manifest.ticketStatus) || !manifest.completionEvidence?.trim()) throw new Error('Owner-confirmed ticket completion is required.')
  if (!['chromium-desktop', 'firefox-desktop', 'webkit-desktop', 'chromium-mobile'].includes(manifest.project)) throw new Error('Choose an existing browser project.')
  devServers(manifest.servers)
  if (!Array.isArray(manifest.sources) || !manifest.sources.length || !manifest.sources.every(source => typeof source.path === 'string' && /^[a-f0-9]{64}$/.test(source.sha256 || '') && ['acIds', 'caseIds', 'destinationIds'].every(key => Array.isArray(source[key]) && source[key].length && source[key].every(id => typeof id === 'string' && id.trim())))) throw new Error('Source hashes and AC/case-to-master ID mappings are required.')
  if (!Array.isArray(manifest.files) || !manifest.files.length || manifest.files.length > 100) throw new Error('Bundle needs 1-100 files.')
  const seen = new Set()
  for (const file of manifest.files) {
    if (!(/^tests\/(e2e|pom)\/.+\.ts$/.test(file.path || '') || /^tests\/fixtures\/.+\.(ts|json|csv|png|pdf)$/.test(file.path || '')) || seen.has(file.path)) throw new Error('Only unique spec/POM/fixture paths are supported.')
    seen.add(file.path)
    if (!/^[a-f0-9]{64}$/.test(file.sha256 || '') || !(file.beforeSha256 === null || /^[a-f0-9]{64}$/.test(file.beforeSha256 || ''))) throw new Error('Every file needs payload and previous-content hashes (null for new files).')
    if (hash(payload(bundle, file.path)) !== file.sha256) throw new Error(`Bundle payload changed: ${file.path}`)
    const target = safePath(repo, file.path)
    const before = fs.existsSync(target) ? hash(fs.readFileSync(target)) : null
    if (before !== file.beforeSha256 && before !== file.sha256) throw new Error(`Destination changed since review: ${file.path}`)
    if (file.path.endsWith('.spec.ts') && /@baseline|\[BASELINE-/i.test(payload(bundle, file.path).toString())) throw new Error('Baseline-only specs do not qualify for promotion.')
  }
  if (!manifest.files.some(file => /^tests\/e2e\/.+\.spec\.ts$/.test(file.path))) throw new Error('Bundle must include an adapted spec.')
  return { manifest, manifestHash: hash(manifestBytes), files: manifest.files.map(file => ({ ...file })) }
}
function allFiles(root, relative = '') {
  const files = []
  for (const item of fs.readdirSync(path.join(root, relative), { withFileTypes: true })) {
    if (item.name.startsWith('.') || ['node_modules', 'promotions', 'test-results', 'playwright-report', 'blob-report', 'allure-results', 'allure-report'].includes(item.name)) continue
    const name = relative ? `${relative}/${item.name}` : item.name
    if (item.isSymbolicLink()) continue
    if (item.isDirectory()) files.push(...allFiles(root, name))
    else if (/\.(ts|mts|js|mjs|json|csv|css|png|pdf|xlsx)$/.test(name)) files.push(name)
  }
  return files.sort()
}
export function repositoryHash(repo) { return hash(allFiles(repo).map(file => `${file}:${hash(fs.readFileSync(path.join(repo, file)))}`).join('\n')) }
export function affectedSpecs(repo, changed) {
  const files = allFiles(repo).filter(file => file.endsWith('.ts'))
  // Data assets can be loaded dynamically; conservatively include the full suite.
  if (changed.some(file => file.startsWith('tests/fixtures/') && !file.endsWith('.ts'))) return files.filter(file => file.startsWith('tests/e2e/') && file.endsWith('.spec.ts'))
  const imports = new Map(files.map(file => {
    const refs = [...fs.readFileSync(path.join(repo, file), 'utf8').matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.[^'"]+)['"]/g)].map(match => path.posix.normalize(path.posix.join(path.posix.dirname(file), match[1].replace(/\.js$/, '.ts'))))
    return [file, refs]
  }))
  const affected = new Set(changed)
  let more = true
  while (more) { more = false; for (const [file, refs] of imports) if (!affected.has(file) && refs.some(ref => affected.has(ref))) { affected.add(file); more = true } }
  return [...affected].filter(file => file.startsWith('tests/e2e/') && file.endsWith('.spec.ts') && fs.existsSync(path.join(repo, file))).sort()
}
export function assertCleanReport(report, repeats = 3) {
  if (report.errors?.length || report.stats?.unexpected || report.stats?.skipped || report.stats?.flaky) throw new Error('Promotion has errors, failures, skips or flaky tests.')
  const tests = []
  const cases = new Map()
  function walk(suites) { for (const suite of suites || []) { for (const spec of suite.specs || []) { for (const test of spec.tests) { const key = JSON.stringify([spec.file, spec.line, spec.column, spec.title, test.projectName]); cases.set(key, (cases.get(key) || 0) + 1); tests.push(test) } } walk(suite.suites) } }
  walk(report.suites)
  if ([...cases.values()].some(count => count !== repeats)) throw new Error('Each selected case must execute three times.')
  if (!tests.length || tests.length % repeats || tests.some(test => test.expectedStatus !== 'passed' || test.results?.length !== 1 || test.results[0].status !== 'passed' || test.results[0].retry !== 0)) throw new Error('Promotion requires three clean executions, without retries or expected failures, of every selected test.')
  return tests.length
}
export function assertMappedCases(report, manifest) {
  const titles = []
  function walk(suites) { for (const suite of suites || []) { titles.push(...(suite.specs || []).map(spec => spec.title)); walk(suite.suites) } }
  walk(report.suites)
  for (const id of manifest.sources.flatMap(source => source.destinationIds)) {
    if (!titles.some(title => title === id || title.startsWith(`${id} `) || title.startsWith(`[${id}]`))) throw new Error(`Mapped destination case was not executed: ${id}`)
  }
}
function run(repo, args, env, logPath) {
  const result = spawnSync(process.execPath, args, { cwd: repo, env, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, windowsHide: true })
  fs.writeFileSync(logPath, `${result.stdout || ''}\n${result.stderr || ''}`)
  if (result.error || result.status !== 0) throw new Error(`Validation failed (${args.join(' ')}). See ${logPath}`)
  return result.stdout
}
export function validateBundle(repo, bundle) {
  const inspected = inspectBundle(repo, bundle)
  const { manifest } = inspected
  const validationFile = safePath(bundle, 'validation.json')
  if (fs.existsSync(validationFile)) fs.unlinkSync(validationFile)
  const originalHash = repositoryHash(repo)
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'musticker-promotion-'))
  if (!temporary.startsWith(path.join(os.tmpdir(), 'musticker-promotion-'))) throw new Error('Unexpected temporary directory.')
  const evidence = path.join(bundle, 'evidence', new Date().toISOString().replace(/[:.]/g, '-'))
  fs.mkdirSync(evidence, { recursive: true })
  try {
    const skip = new Set(['.git', 'node_modules', '.env', '.auth', 'promotions', 'test-results', 'playwright-report', 'allure-results', 'allure-report', 'blob-report'])
    fs.cpSync(repo, temporary, { recursive: true, filter: source => source === repo || !path.relative(repo, source).split(path.sep).some(part => skip.has(part)) })
    fs.symlinkSync(path.join(repo, 'node_modules'), path.join(temporary, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir')
    // Session files are local-only; never share cleanup ledgers across runs.
    const auth = path.join(repo, '.auth')
    if (fs.existsSync(auth)) fs.cpSync(auth, path.join(temporary, '.auth'), { recursive: true, filter: source => !source.endsWith('.jsonl') && !path.relative(auth, source).split(path.sep).includes('runs') })
    for (const file of manifest.files) { const target = safePath(temporary, file.path); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, payload(bundle, file.path)) }
    const specs = affectedSpecs(temporary, manifest.files.map(file => file.path))
    const envFile = path.join(repo, '.env')
    const localEnv = fs.existsSync(envFile) ? createRequire(path.join(repo, 'package.json'))('dotenv').parse(fs.readFileSync(envFile)) : {}
    const env = { ...localEnv, ...process.env, E2E_ENVIRONMENT: '', BASE_URL: manifest.servers.storefront, API_BASE_URL: manifest.servers.api, ADMIN_BASE_URL: manifest.servers.admin || '', E2E_BROWSER_PROJECT: manifest.project, PROMOTION_VALIDATION: 'true', SELF_HEAL: 'off', PW_WORKERS: '1', E2E_RUN_ID: randomUUID(), ALLURE_RESULTS_DIR: '', PW_BLOB_REPORT: 'false' }
    const commands = [
      ['node_modules/typescript/bin/tsc', '--noEmit'],
      ['node_modules/eslint/bin/eslint.js', '.'],
      ['node_modules/@playwright/test/cli.js', 'test', ...specs, '--list', '--reporter=json'],
      ['node_modules/@playwright/test/cli.js', 'test', ...specs, '--retries=0', '--repeat-each=3', '--workers=1', '--reporter=json'],
    ]
    for (let i = 0; i < commands.length - 1; i++) run(temporary, commands[i], env, path.join(evidence, `check-${i}.log`))
    const reportBytes = run(temporary, commands[3], env, path.join(evidence, 'runs.json'))
    const report = JSON.parse(reportBytes)
    const executions = assertCleanReport(report)
    assertMappedCases(report, manifest)
    const ledger = path.join(temporary, '.auth', 'runs', env.E2E_RUN_ID, 'created-accounts.jsonl')
    if (fs.existsSync(ledger) && fs.readFileSync(ledger, 'utf8').trim()) throw new Error('Created accounts remain uncleaned; see retained cleanup ledgers in validation evidence.')
    if (repositoryHash(repo) !== originalHash) throw new Error('Main repository changed during validation; review again.')
    // runs.json is written by run() with stderr appended; retain a canonical report separately.
    const reportPath = `${path.relative(bundle, evidence).split(path.sep).join('/')}/report.json`
    fs.writeFileSync(safePath(bundle, reportPath), reportBytes)
    const receipt = { version: 1, verdict: 'VALIDATED', manifestHash: inspected.manifestHash, repositoryHash: originalHash, testedAt: new Date().toISOString(), specs, executions, repeats: 3, retries: 0, selfHeal: false, servers: manifest.servers, build: manifest.build, commands, evidence, reportPath, reportHash: hash(reportBytes) }
    fs.writeFileSync(path.join(bundle, 'validation.json'), JSON.stringify(receipt, null, 2))
    return receipt
  } finally {
    const artifacts = path.join(temporary, 'test-results')
    if (fs.existsSync(artifacts)) fs.cpSync(artifacts, path.join(evidence, 'artifacts'), { recursive: true })
    const ledgers = path.join(temporary, '.auth', 'runs')
    if (fs.existsSync(ledgers)) fs.cpSync(ledgers, path.join(evidence, 'cleanup-ledgers'), { recursive: true })
    // Unlink junctions before removing the owned temporary directory.
    const modules = path.join(temporary, 'node_modules')
    if (fs.existsSync(modules) && fs.lstatSync(modules).isSymbolicLink()) fs.unlinkSync(modules)
    fs.rmSync(temporary, { recursive: true, force: true })
  }
}
export function applyBundle(repo, bundle) {
  const inspected = inspectBundle(repo, bundle)
  const receipt = JSON.parse(fs.readFileSync(safePath(bundle, 'validation.json')))
  if (receipt.verdict !== 'VALIDATED' || receipt.manifestHash !== inspected.manifestHash || receipt.repositoryHash !== repositoryHash(repo) || Date.now() - Date.parse(receipt.testedAt) > 24 * 60 * 60 * 1000 || !Number.isFinite(Date.parse(receipt.testedAt))) throw new Error('A current successful validation matching this bundle and repository is required.')
  const report = fs.readFileSync(safePath(bundle, receipt.reportPath))
  if (hash(report) !== receipt.reportHash || receipt.repeats !== 3 || receipt.retries !== 0 || receipt.selfHeal !== false || assertCleanReport(JSON.parse(report)) !== receipt.executions) throw new Error('Validation evidence changed or is incomplete.')
  assertMappedCases(JSON.parse(report), inspected.manifest)
  const written = []
  try {
    for (const file of inspected.manifest.files) {
      const target = safePath(repo, file.path)
      const previous = fs.existsSync(target) ? fs.readFileSync(target) : null
      fs.mkdirSync(path.dirname(target), { recursive: true })
      written.push({ target, previous })
      fs.writeFileSync(target, payload(bundle, file.path), previous ? undefined : { flag: 'wx' })
    }
    fs.writeFileSync(path.join(bundle, 'applied.json'), JSON.stringify({ appliedAt: new Date().toISOString(), manifestHash: inspected.manifestHash, files: inspected.manifest.files }, null, 2))
    return { applied: written.length, ticket: inspected.manifest.ticket }
  } catch (error) { for (const { target, previous } of written.reverse()) { if (previous) fs.writeFileSync(target, previous); else if (fs.existsSync(target)) fs.unlinkSync(target) } throw error }
}
export function ciBundles(repo, base) {
  if (!/^[a-f0-9]{40}$/.test(base || '')) throw new Error('CI needs the PR base commit SHA.')
  const result = spawnSync('git', ['diff', '--name-only', `${base}...HEAD`], { cwd: repo, encoding: 'utf8' })
  if (result.status) throw new Error('Could not inspect PR changes.')
  const changed = result.stdout.trim().split(/\r?\n/).filter(Boolean)
  const bundles = [...new Set(changed.map(file => file.match(/^promotions\/([^/]+)\//)?.[1]).filter(Boolean))].map(id => safePath(repo, `promotions/${id}`)).filter(dir => fs.existsSync(path.join(dir, 'manifest.json')))
  const covered = new Set(bundles.flatMap(dir => inspectBundle(repo, dir).manifest.files.map(file => file.path)))
  const uncovered = changed.filter(file => /^tests\/(e2e|pom|fixtures)\/.+\.(ts|json|csv|png|pdf)$/.test(file) && !covered.has(file))
  if (uncovered.length) throw new Error(`PR test/POM/fixture changes need a reviewed promotion manifest: ${uncovered.join(', ')}`)
  return bundles.map(dir => validateBundle(repo, dir))
}
const current = fileURLToPath(import.meta.url)
if (process.argv[1] && path.resolve(process.argv[1]) === current) {
  try {
    const repo = path.resolve(path.dirname(current), '..')
    const [action, argument] = process.argv.slice(2)
    const result = action === 'ci' ? ciBundles(repo, argument) : action === 'validate' ? validateBundle(repo, path.resolve(argument || '')) : action === 'apply' ? applyBundle(repo, path.resolve(argument || '')) : (() => { throw new Error('Use validate <bundle-dir>, apply <bundle-dir> or ci <base-sha>.') })()
    console.log(JSON.stringify(result, null, 2))
  } catch (error) { console.error(error.message); process.exitCode = 1 }
}
