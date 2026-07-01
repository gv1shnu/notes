#!/usr/bin/env python3
"""Append-only JSONL campaign timeline for an engagement."""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from lib.paths import artifact


def log_event(
    engagement: str,
    phase: str,
    tool: str,
    note: str = "",
    target: str = "",
    artifact_path: str = "",
) -> Path:
    log_path = artifact(engagement, "campaign.jsonl")
    log_path.parent.mkdir(parents=True, exist_ok=True)
    entry = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "phase": phase,
        "tool": tool,
        "target": target,
        "note": note,
        "artifact": artifact_path,
    }
    with log_path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")
    return log_path


def main() -> None:
    parser = argparse.ArgumentParser(description="Append a line to campaign.jsonl")
    parser.add_argument("--engagement", required=True)
    parser.add_argument("--phase", required=True)
    parser.add_argument("--tool", required=True)
    parser.add_argument("--note", default="")
    parser.add_argument("--target", default="")
    parser.add_argument("--artifact", default="")
    args = parser.parse_args()
    path = log_event(
        args.engagement,
        args.phase,
        args.tool,
        args.note,
        args.target,
        args.artifact,
    )
    print(path)


if __name__ == "__main__":
    main()
