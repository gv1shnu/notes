#!/usr/bin/env python3
"""
Pentest pipeline orchestrator.

Wires phase scripts together via JSON artifacts under data/<engagement>/.
Human gates pause the run until checkpoints.json is updated or --force is used.
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from lib.paths import CEH_ROOT, artifact, engagement_dir
from lib.scope import load_scope, technique_allowed

SCRIPTS_DIR = Path(__file__).resolve().parent


@dataclass
class Phase:
    name: str
    script: str
    output: str
    inputs: list[str]
    technique: str | None = None
    gate_after: str | None = None
    parallel: bool = False


PHASES: list[Phase] = [
    Phase(
        name="recon",
        script="subdomain_enum.py",
        output="recon/inventory.json",
        inputs=["scope.json"],
        technique="active_scan",  # passive recon still needs engagement scope
        gate_after="post_recon",
    ),
    Phase(
        name="scanning",
        script="port_scan_batch.py",
        output="scans/summary.json",
        inputs=["recon/inventory.json"],
        technique="active_scan",
        gate_after="post_scan",
    ),
    Phase(
        name="enumeration",
        script="service_enum.py",
        output="enum/details.json",
        inputs=["scans/summary.json"],
        technique="active_scan",
    ),
    Phase(
        name="web",
        script="web_recon.py",
        output="enum/web_map.json",
        inputs=["scans/summary.json"],
        technique="active_scan",
        parallel=True,
    ),
    Phase(
        name="vuln_analysis",
        script="cve_lookup.py",
        output="vuln/candidates.json",
        inputs=["scans/summary.json", "enum/details.json"],
        gate_after="post_vuln",
    ),
    Phase(
        name="validation",
        script="validation_plan.py",
        output="validate/plans.json",
        inputs=["vuln/candidates.json"],
    ),
    Phase(
        name="reporting",
        script="report_builder.py",
        output="reports/draft.html",
        inputs=["findings.json", "campaign.jsonl"],
    ),
]

GATES = ["post_recon", "post_scan", "post_vuln", "pre_report"]


def _checkpoints_path(engagement: str) -> Path:
    return artifact(engagement, "checkpoints.json")


def _load_checkpoints(engagement: str) -> dict:
    path = _checkpoints_path(engagement)
    if not path.is_file():
        return {"approved": []}
    return json.loads(path.read_text(encoding="utf-8"))


def _gate_approved(engagement: str, gate: str) -> bool:
    return gate in _load_checkpoints(engagement).get("approved", [])


def cmd_init(args: argparse.Namespace) -> int:
    dest = engagement_dir(args.engagement)
    if dest.exists() and not args.force:
        print(f"ERROR: {dest} already exists (use --force to re-init)", file=sys.stderr)
        return 1

    dest.mkdir(parents=True, exist_ok=True)
    for sub in ("recon", "scans", "enum", "vuln", "validate", "reports"):
        (dest / sub).mkdir(exist_ok=True)

    scope_src = Path(args.scope)
    if not scope_src.is_file():
        scope_src = CEH_ROOT / "scope.json.example"
    shutil.copy(scope_src, dest / "scope.json")

    _checkpoints_path(args.engagement).write_text(
        json.dumps({"approved": [], "notes": {}}, indent=2) + "\n",
        encoding="utf-8",
    )
    (dest / "findings.json").write_text(
        json.dumps({"findings": []}, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Initialized {dest}")
    print(f"  Edit {dest / 'scope.json'} before running.")
    return 0


def cmd_approve(args: argparse.Namespace) -> int:
    path = _checkpoints_path(args.engagement)
    if not path.is_file():
        print(f"ERROR: run init first — {path} missing", file=sys.stderr)
        return 1

    data = _load_checkpoints(args.engagement)
    approved = set(data.get("approved", []))
    if args.gate not in GATES:
        print(f"ERROR: unknown gate {args.gate!r}. Valid: {GATES}", file=sys.stderr)
        return 1

    approved.add(args.gate)
    data["approved"] = sorted(approved)
    data.setdefault("notes", {})[args.gate] = {
        "at": datetime.now(timezone.utc).isoformat(),
        "by": "manual",
    }
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    print(f"Approved gate: {args.gate}")
    return 0


def _run_script(engagement: str, script_name: str, dry_run: bool) -> int:
    script_path = SCRIPTS_DIR / script_name
    if not script_path.is_file():
        print(f"  SKIP: {script_name} not implemented yet")
        _log(engagement, "pipeline", script_name, note="skipped — script missing")
        return 0

    cmd = [sys.executable, str(script_path), "--engagement", engagement]
    if dry_run:
        print(f"  DRY-RUN would run: {' '.join(cmd)}")
        return 0

    print(f"  RUN: {' '.join(cmd)}")
    env = {**os.environ, "PYTHONPATH": str(SCRIPTS_DIR)}
    result = subprocess.run(cmd, cwd=CEH_ROOT, env=env)
    _log(engagement, "pipeline", script_name, note=f"exit {result.returncode}")
    return result.returncode


def _log(engagement: str, phase: str, tool: str, note: str = "") -> None:
    log_script = SCRIPTS_DIR / "campaign_log.py"
    if log_script.is_file():
        subprocess.run(
            [
                sys.executable,
                str(log_script),
                "--engagement",
                engagement,
                "--phase",
                phase,
                "--tool",
                tool,
                "--note",
                note,
            ],
            cwd=CEH_ROOT,
            env={**os.environ, "PYTHONPATH": str(SCRIPTS_DIR)},
            capture_output=True,
        )


def _inputs_ready(engagement: str, phase: Phase) -> bool:
    for rel in phase.inputs:
        if not artifact(engagement, rel).is_file():
            print(f"  MISSING input: {rel}")
            return False
    return True


def _run_phase(engagement: str, phase: Phase, dry_run: bool, force: bool) -> int:
    print(f"\n=== Phase: {phase.name} ===")

    scope_path = artifact(engagement, "scope.json")
    if scope_path.is_file() and phase.technique:
        scope = load_scope(scope_path)
        if not technique_allowed(scope, phase.technique):
            print(f"  SKIP: technique {phase.technique!r} not allowed in scope.yaml")
            return 0

    if not _inputs_ready(engagement, phase):
        if dry_run:
            print("  (dry-run continues despite missing inputs)")
        else:
            return 1

    out_path = artifact(engagement, phase.output)
    if out_path.is_file() and not force and not dry_run:
        print(f"  Output exists: {phase.output} (use --force to re-run phase)")
        return 0

    rc = _run_script(engagement, phase.script, dry_run)
    if rc != 0:
        return rc

    if phase.gate_after and not force and not dry_run:
        if not _gate_approved(engagement, phase.gate_after):
            print(f"\n  GATE: approve before continuing:")
            print(f"    python scripts/pipeline.py approve --engagement {engagement} --gate {phase.gate_after}")
            return 2

    return 0


def cmd_run(args: argparse.Namespace) -> int:
    eng = args.engagement
    if not engagement_dir(eng).is_dir():
        print(f"ERROR: engagement not initialized: {engagement_dir(eng)}", file=sys.stderr)
        print(f"  Run: python scripts/pipeline.py init --engagement {eng}", file=sys.stderr)
        return 1

    selected = {args.phase} if args.phase != "all" else None
    linear = [p for p in PHASES if not p.parallel]
    parallel = [p for p in PHASES if p.parallel]

    for phase in linear:
        if selected and phase.name not in selected:
            continue
        rc = _run_phase(eng, phase, args.dry_run, args.force)
        if rc == 2:
            return 0  # stopped at gate — expected
        if rc != 0:
            return rc

    if not selected or any(p.name in selected for p in parallel):
        for phase in parallel:
            if selected and phase.name not in selected:
                continue
            rc = _run_phase(eng, phase, args.dry_run, args.force)
            if rc not in (0, 2):
                return rc

    print("\nPipeline pass complete.")
    return 0


def cmd_status(args: argparse.Namespace) -> int:
    eng = args.engagement
    base = engagement_dir(eng)
    if not base.is_dir():
        print(f"Not initialized: {eng}")
        return 1

    print(f"Engagement: {eng}")
    print(f"Gates approved: {_load_checkpoints(eng).get('approved', [])}")
    print("\nArtifacts:")
    for phase in PHASES:
        path = artifact(eng, phase.output)
        mark = "OK" if path.is_file() else "—"
        print(f"  [{mark}] {phase.output}  ({phase.name})")
    return 0


def main() -> None:
    parser = argparse.ArgumentParser(description="Pentest pipeline orchestrator")
    sub = parser.add_subparsers(dest="command", required=True)

    p_init = sub.add_parser("init", help="Create data/<engagement>/ from scope template")
    p_init.add_argument("--engagement", required=True)
    p_init.add_argument("--scope", default="scope.json.example")
    p_init.add_argument("--force", action="store_true")
    p_init.set_defaults(func=cmd_init)

    p_run = sub.add_parser("run", help="Run pipeline phases")
    p_run.add_argument("--engagement", required=True)
    p_run.add_argument("--phase", default="all", help="Phase name or 'all'")
    p_run.add_argument("--dry-run", action="store_true")
    p_run.add_argument("--force", action="store_true", help="Re-run phases and skip gates (lab only)")
    p_run.set_defaults(func=cmd_run)

    p_approve = sub.add_parser("approve", help="Approve a human gate")
    p_approve.add_argument("--engagement", required=True)
    p_approve.add_argument("--gate", required=True, choices=GATES)
    p_approve.set_defaults(func=cmd_approve)

    p_status = sub.add_parser("status", help="Show artifact and gate status")
    p_status.add_argument("--engagement", required=True)
    p_status.set_defaults(func=cmd_status)

    args = parser.parse_args()
    sys.exit(args.func(args))


if __name__ == "__main__":
    main()
