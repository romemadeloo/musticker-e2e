import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { hash, inspectBundle, safePath, devServers, affectedSpecs, assertCleanReport, assertMappedCases, applyBundle, repositoryHash, validateBundle, ciBundles } from '../promotion.mjs'

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'master-promotion-test-'))
  t.after(() => { assert.ok(root.startsWith(path.join(os.tmpdir(), 'master-promotion-test-'))); fs.rmSync(root, { recursive: true, force: true }) })
  const repo = path.join(root, 'repo'), bundle = path.join(root, 'bundle')
  fs.mkdirSync(repo); fs.mkdirSync(bundle)
  const write = (base, file, data) => { const target = path.join(base, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, data) }
  const files = [{ path: 'tests/e2e/storefront/cart/new.spec.ts', code: "import { cart } from '../../../pom/storefront/cart.js';\n// QA-123-TC-001 MS-CRT-999\n" }, { path: 'tests/pom/storefront/cart.ts', code: 'export const cart = true;\n' }]
  for (const file of files) write(bundle, `files/${file.path}`, file.code)
  write(repo, 'package.json', '{}')
  const manifest = { version: 1, ticket: 'QA-123', ticketStatus: 'done', completionEvidence: 'Owner decision in handoff', reviewer: 'qa-automation-reviewer', maintenanceOwner: 'QA', build: 'test-build', buildEvidence: 'ticket evidence/build.json', project: 'chromium-desktop', servers: { storefront: 'http://127.0.0.1:9/kr', api: 'http://127.0.0.1:9/api' }, sources: [{ path: 'tests/e2e/cart.spec.ts', sha256: hash('source'), acIds: ['QA-123-AC-01'], caseIds: ['QA-123-TC-001'], destinationIds: ['MS-CRT-999'] }], files: files.map(file => ({ path: file.path, sha256: hash(file.code), beforeSha256: null })) }
  const save = () => write(bundle, 'manifest.json', JSON.stringify(manifest))
  save()
  return { root, repo, bundle, manifest, write, save }
}
test('complete spec/POM bundle is inspectable; payload drift and destination changes fail', t => {
  const f = fixture(t)
  assert.equal(inspectBundle(f.repo, f.bundle).manifest.files.length, 2)
  f.write(f.repo, f.manifest.files[1].path, 'unrelated local work')
  assert.throws(() => inspectBundle(f.repo, f.bundle), /Destination changed/)
  fs.unlinkSync(path.join(f.repo, f.manifest.files[1].path))
  f.write(f.bundle, `files/${f.manifest.files[0].path}`, 'altered')
  assert.throws(() => inspectBundle(f.repo, f.bundle), /payload changed/)
})
test('dev servers must be explicit, match roles and belong to one environment', () => {
  for (let number = 1; number <= 6; number++) {
    const suffix = number === 1 ? '' : `-${number}`
    const servers = {
      storefront: `https://shared-dev-static-sf${suffix}.musticker.com/kr`,
      api: `https://shared-dev-static-api${suffix}.musticker.com/index.php`,
      admin: `https://shared-dev-static-admin${suffix}.musticker.com`
    }
    assert.deepEqual(devServers(servers), servers)
    assert.throws(() => devServers({ ...servers, admin: 'https://shared-dev-static-admin-7.musticker.com' }), /dev/)
  }
  assert.throws(() => devServers({ storefront: 'https://unregistered-sf.musticker.com/kr', api: 'https://unregistered-api.musticker.com' }), /dev/)
  assert.throws(() => devServers({ storefront: 'https://www.musticker.com/kr', api: 'https://api.musticker.com' }), /dev/)
  assert.throws(() => devServers({ storefront: 'https://shared-dev-static-sf-6.musticker.com/kr', api: 'https://shared-dev-static-api.musticker.com' }), /different/)
  assert.throws(() => devServers({ storefront: 'https://shared-dev-static-api-6.musticker.com', api: 'https://shared-dev-static-sf-6.musticker.com' }), /role/)
  assert.throws(() => devServers({ storefront: 'http://127.0.0.1:9/kr' }), /explicit/)
})
test('uncompleted tickets and missing traceability cannot be promoted', t => {
  const f = fixture(t); f.manifest.ticketStatus = 'in_progress'; f.save()
  assert.throws(() => inspectBundle(f.repo, f.bundle), /completion/)
  f.manifest.ticketStatus = 'done'; f.manifest.sources = []; f.save()
  assert.throws(() => inspectBundle(f.repo, f.bundle), /mappings/)
})
test('affected regression follows POM and fixture imports transitively', t => {
  const f = fixture(t)
  f.write(f.repo, 'tests/fixtures/base.ts', 'export const data = 1')
  f.write(f.repo, 'tests/pom/cart.ts', "import { data } from '../fixtures/base.js'")
  f.write(f.repo, 'tests/e2e/cart.spec.ts', "import { cart } from '../pom/cart.js'")
  f.write(f.repo, 'tests/e2e/other.spec.ts', 'export {}')
  assert.deepEqual(affectedSpecs(f.repo, ['tests/fixtures/base.ts']), ['tests/e2e/cart.spec.ts'])
})
test('retries, skips, expected failures and missing executions do not satisfy promotion', () => {
  const report = { stats: {}, suites: [{ specs: [{ title: 'MS-CRT-999 unit case', tests: Array.from({ length: 3 }, () => ({ expectedStatus: 'passed', results: [{ status: 'passed', retry: 0 }] })) }] }] }
  assert.equal(assertCleanReport(report), 3)
  assert.throws(() => assertCleanReport({ ...report, stats: { skipped: 1 } }), /skips/)
  report.suites[0].specs[0].tests[0].results[0].retry = 1
  assert.throws(() => assertCleanReport(report), /three clean/)
})
test('passing unrelated tests cannot satisfy a missing mapped destination case', () => {
  const report = { suites: [{ specs: [{ title: 'MS-CRT-001 existing coverage' }] }] }
  assert.throws(() => assertMappedCases(report, { sources: [{ destinationIds: ['MS-CRT-999'] }] }), /not executed/)
})
test('CI refuses changed tests that are not covered by a reviewed manifest', t => {
  const f = fixture(t)
  const git = args => {
    const result = spawnSync('git', args, { cwd: f.repo, encoding: 'utf8' })
    assert.equal(result.status, 0, result.stderr)
    return result.stdout.trim()
  }
  git(['init'])
  git(['add', '.'])
  git(['-c', 'user.name=Framework Test', '-c', 'user.email=unit@example.test', 'commit', '-m', 'test baseline'])
  const base = git(['rev-parse', 'HEAD'])
  f.write(f.repo, 'tests/e2e/incoming.spec.ts', 'export {}')
  git(['add', '.'])
  git(['-c', 'user.name=Framework Test', '-c', 'user.email=unit@example.test', 'commit', '-m', 'test incoming file'])
  assert.throws(() => ciBundles(f.repo, base), /need a reviewed promotion manifest/)
  const assetBase = git(['rev-parse', 'HEAD'])
  f.write(f.repo, 'tests/fixtures/incoming.csv', 'name\nexample')
  git(['add', '.'])
  git(['-c', 'user.name=Framework Test', '-c', 'user.email=unit@example.test', 'commit', '-m', 'test incoming fixture'])
  assert.throws(() => ciBundles(f.repo, assetBase), /incoming\.csv/)
})
test('apply requires matching fresh validation and protects unrelated destination edits', t => {
  const f = fixture(t)
  assert.throws(() => applyBundle(f.repo, f.bundle))
  const receipt = { verdict: 'VALIDATED', manifestHash: inspectBundle(f.repo, f.bundle).manifestHash, repositoryHash: repositoryHash(f.repo), testedAt: new Date().toISOString() }
  f.write(f.bundle, 'validation.json', JSON.stringify(receipt))
  f.write(f.repo, 'tests/fixtures/unrelated.ts', 'export {}')
  assert.throws(() => applyBundle(f.repo, f.bundle), /current successful/)
  fs.unlinkSync(path.join(f.repo, 'tests/fixtures/unrelated.ts'))
  const report = JSON.stringify({ stats: {}, suites: [{ specs: [{ title: 'MS-CRT-999 unit case', tests: Array.from({ length: 3 }, () => ({ expectedStatus: 'passed', results: [{ status: 'passed', retry: 0 }] })) }] }] })
  f.write(f.bundle, 'evidence/report.json', report)
  f.write(f.bundle, 'validation.json', JSON.stringify({ ...receipt, reportPath: 'evidence/report.json', reportHash: hash(report), repeats: 3, retries: 0, selfHeal: false, executions: 3 }))
  assert.equal(applyBundle(f.repo, f.bundle).applied, 2)
  assert.equal(fs.readFileSync(path.join(f.repo, f.manifest.files[1].path), 'utf8'), 'export const cart = true;\n')
})
test('path traversal and junction escapes cannot write outside the repository', t => {
  const f = fixture(t)
  assert.throws(() => safePath(f.repo, '../outside.ts'), /Invalid/)
  const outside = path.join(f.root, 'outside'); fs.mkdirSync(outside)
  fs.symlinkSync(outside, path.join(f.repo, 'escape'), process.platform === 'win32' ? 'junction' : 'dir')
  assert.throws(() => safePath(f.repo, 'escape/file.ts'), /Symbolic/)
})
test('partial apply failure rolls back earlier files without changing unrelated local work', t => {
  const f = fixture(t)
  const blocked = 'tests/fixtures/blocked/helper.ts'
  f.write(f.repo, 'tests/fixtures/blocked', 'unrelated local file')
  f.manifest.files[1].path = blocked
  f.write(f.bundle, `files/${blocked}`, 'export const cart = true;\n')
  f.save()
  const report = JSON.stringify({ stats: {}, suites: [{ specs: [{ title: 'MS-CRT-999 local case', tests: Array.from({ length: 3 }, () => ({ expectedStatus: 'passed', results: [{ status: 'passed', retry: 0 }] })) }] }] })
  f.write(f.bundle, 'evidence/report.json', report)
  f.write(f.bundle, 'validation.json', JSON.stringify({ verdict: 'VALIDATED', manifestHash: inspectBundle(f.repo, f.bundle).manifestHash, repositoryHash: repositoryHash(f.repo), testedAt: new Date().toISOString(), reportPath: 'evidence/report.json', reportHash: hash(report), repeats: 3, retries: 0, selfHeal: false, executions: 3 }))
  assert.throws(() => applyBundle(f.repo, f.bundle))
  assert.equal(fs.existsSync(path.join(f.repo, f.manifest.files[0].path)), false)
  assert.equal(fs.readFileSync(path.join(f.repo, 'tests/fixtures/blocked'), 'utf8'), 'unrelated local file')
})
test('validation overlays a complete bundle in isolation and executes three hermetic repeats before apply', t => {
  const f = fixture(t)
  const originalModules = path.resolve('node_modules')
  fs.symlinkSync(originalModules, path.join(f.repo, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir')
  f.write(f.repo, 'package.json', '{"type":"module"}')
  f.write(f.repo, 'tsconfig.json', '{"compilerOptions":{"target":"ES2022","module":"NodeNext","strict":true,"noEmit":true}}')
  f.write(f.repo, 'eslint.config.js', 'export default [{ files: ["**/*.ts"], rules: {} }]')
  f.write(f.repo, 'playwright.config.ts', "export default { testDir: './tests/e2e', projects: [{name:'chromium-desktop'}] }")
  const code = "import {test, expect} from '@playwright/test'; test('MS-CRT-999 isolated check', () => {expect(1+1).toBe(2)});"
  f.write(f.bundle, `files/${f.manifest.files[0].path}`, code)
  f.manifest.files[0].sha256 = hash(code); f.save()
  try {
    const result = validateBundle(f.repo, f.bundle)
    assert.equal(result.executions, 3)
    assert.equal(fs.existsSync(path.join(f.repo, f.manifest.files[0].path)), false)
    assert.equal(applyBundle(f.repo, f.bundle).applied, 2)
  } finally { fs.unlinkSync(path.join(f.repo, 'node_modules')) }
})
