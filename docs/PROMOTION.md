# Master-suite promotion workflow

Keep the existing domain specs, POM and fixture structure. Incoming ticket code
is a reviewed change set, staged outside `tests/e2e/`, rather than a raw spec
copied into the active suite.

## Prepare after ticket completion

`qa-automation-reviewer` confirms the owner's done/completed/closed decision,
checks duplicate coverage, and adapts qualified cases to the existing POM,
fixtures, locale, IDs, tags, data and teardown. Keep ticket AC/TC-to-MS-case ID
traceability. Preserve unrelated local edits and the original generated source.

Prepare the following in the multi-agent workspace:

```text
tickets/<TICKET>/promotion/
  manifest.json
  files/tests/e2e/<domain>/<suite>.spec.ts
  files/tests/pom/<domain>/<page>.ts
  files/tests/fixtures/<helper-or-data-file>
```

Include all required changes. Existing files need their exact pre-review
SHA-256; new files use `beforeSha256: null`. Never invent hashes, completion,
build evidence or execution results. Use this manifest schema:

```json
{
  "version": 1,
  "ticket": "YOUR-123",
  "ticketStatus": "done",
  "completionEvidence": "Reference to the QA owner's completion decision",
  "reviewer": "qa-automation-reviewer",
  "maintenanceOwner": "Named QA owner",
  "build": "Actual verified served build ID",
  "buildEvidence": "Path to retained build-verification evidence",
  "project": "chromium-desktop",
  "servers": {
    "storefront": "https://shared-dev-static-sf.musticker.com/kr",
    "api": "https://shared-dev-static-api.musticker.com/index.php",
    "admin": "https://shared-dev-static-admin.musticker.com"
  },
  "sources": [{
    "path": "tests/e2e/feature/source.spec.ts",
    "sha256": "<original source SHA-256>",
    "acIds": ["YOUR-123-AC-01"],
    "caseIds": ["YOUR-123-TC-001"],
    "destinationIds": ["<reviewed MS-module-case ID>"]
  }],
  "files": [{
    "path": "tests/e2e/storefront/feature/suite.spec.ts",
    "sha256": "<adapted file SHA-256>",
    "beforeSha256": null
  }]
}
```

These URLs illustrate a coherent set; use the actual ticket's saved dev servers.
Placeholder hashes and IDs are intentionally invalid. API and storefront are
mandatory; include admin when the selected tests need it. Supported payloads
are TypeScript specs/POM/helpers and fixture JSON/CSV/PNG/PDF files (1 MB each).
Do not include secrets or auth state. A changed fixture asset conservatively
selects the entire suite because assets can be loaded dynamically.

## Stage, validate, apply, review

The Office Automation review page displays bundle paths and hashes. Its
**Stage reviewed change set** action checks completion, source hashes, bundle
contents and destination preimages, then stages the bundle under
`promotions/<TICKET>/` in the master repo. It does not write active tests.
The staging checklist confirms review readiness, not successful execution.

From the master repository:

```text
npm run promotion:validate -- promotions/<TICKET>
npm run promotion:apply -- promotions/<TICKET>
```

Validation overlays all payloads in an owned temporary copy and runs:

1. TypeScript and ESLint.
2. Test discovery and affected regression computed through POM/fixture imports.
3. Three executions of every selected case, with one worker, retries disabled,
   and `SELF_HEAL=off`. Failures, skips, expected failures, flaky results, missing
   tests or commands that fail all block validation.

The explicit dev servers and recorded build are retained in the receipt. The
build evidence is a reviewer-supplied reference; the gate does not independently
query an application-specific build endpoint. Verify it before starting a run.
There is no production fallback, and conflicting server roles/environments are
rejected. Missing credentials or data remain blockers rather than false passes.
Local auth files may be copied into the temporary run; `.env` credentials are
loaded into the validation process without copying the file. Shell credentials
take precedence and must belong to the selected dev environment. Manifest URLs
override environment-file targets. Previous cleanup ledgers are not copied.
No credentials are committed with a bundle. Uncleaned created accounts block
validation, and their scoped records are retained in the evidence directory.

Reports, logs and artifacts stay in the bundle's ignored `evidence/` directory.
`validation.json` is also local and ignored. A failed new validation removes
the prior successful receipt. Applying requires a matching report hash, current
manifest and unchanged repository fingerprint, with validation no older than
24 hours. Partial apply failures roll back written files.

Inspect the resulting Git diff and commit the manifest plus reviewed payloads
and applied code through your normal PR process. No command commits, pushes or
merges. CI requires manifests to cover changed specs/POM/fixtures and re-runs
the same dev validation, including affected tests beyond the smoke selection.
PR validation uses dev credentials; configure `PROMOTION_USER_DELETE_ENDPOINT`
only when it matches the selected dev API. Changes to shared fixtures can
legitimately select many tests and need the corresponding accounts/data.

## Environment and cleanup changes

Normal suite runs now require an explicit `E2E_ENVIRONMENT` or `BASE_URL`.
Known environments resolve a coherent storefront/API/admin set. The Musticker
storefront origin normalizes to `/kr`. Unknown custom/dev targets need explicit
API/admin URLs when those apps are used; no helper guesses a production API.
Conflicting `.env` or shell overrides fail rather than silently mixing servers.

Each run sets `E2E_RUN_ID`, inherited by all workers. New created-account records
live under `.auth/runs/<run-id>/created-accounts.jsonl` and carry the run ID and
storefront/API origins. Cleanup accepts only the same run and origins, and its
endpoint must match that dev API. Historical unscoped ledgers are left intact
for manual reconciliation. A failed cleanup retains the scoped records.

Run `npm run test:framework` for local framework and POM checks. These use an
isolated local DOM or synthetic files and never test a real application server.
