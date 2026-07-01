# Pentest automation scripts

Orchestrator: **`pipeline.py`** — run phases in order, enforce scope, pause at human gates.

```bash
cd ceh
pip install -r scripts/requirements.txt

python scripts/pipeline.py init --engagement lab-2025-06 --scope scope.json.example
python scripts/pipeline.py run --engagement lab-2025-06 --dry-run
python scripts/pipeline.py status --engagement lab-2025-06
```

See [pipeline.html](../pipeline.html) for architecture and artifact schemas.

## Core (implemented)

| Script | Purpose |
|--------|---------|
| `pipeline.py` | Orchestrator: init, run, approve gates, status |
| `campaign_log.py` | Append JSONL timeline |
| `validate_scope.py` | In-scope check for a target |
| `lib/scope.py` | Shared scope loading and matching |
| `lib/paths.py` | `data/<engagement>/` layout |

## Phase scripts (implement next — pipeline skips if missing)

| Script | Page | Reads → Writes |
|--------|------|----------------|
| `subdomain_enum.py` | recon | `scope.json` → `recon/inventory.json` |
| `port_scan_batch.py` | scanning | `recon/inventory.json` → `scans/summary.json` |
| `service_enum.py` | enumeration | `scans/summary.json` → `enum/details.json` |
| `cve_lookup.py` | vuln analysis | scan + enum → `vuln/candidates.json` |
| `validation_plan.py` | exploitation | `vuln/candidates.json` → `validate/plans.json` |
| `web_recon.py` | web (branch) | `scans/summary.json` → `enum/web_map.json` |
| `report_builder.py` | reporting | `findings.json` → `reports/draft.html` |
| `finding_add.py` | reporting | CLI → append `findings.json` |

Stub code lives in HTML `<!-- comments -->` on each phase page.

Every phase script should accept `--engagement <id>` and use `lib.scope` before touching targets.
