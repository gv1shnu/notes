#!/usr/bin/env python3
"""Check whether a host or IP is in scope before scanning."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from lib.paths import artifact
from lib.scope import host_in_scope, load_scope


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate target against engagement scope")
    parser.add_argument("--engagement", required=True)
    parser.add_argument("--target", required=True)
    parser.add_argument("--scope", help="Override scope file path")
    args = parser.parse_args()

    scope_path = Path(args.scope) if args.scope else artifact(args.engagement, "scope.json")
    if not scope_path.is_file():
        print(f"ERROR: scope file not found: {scope_path}", file=sys.stderr)
        sys.exit(2)

    scope = load_scope(scope_path)
    ok = host_in_scope(args.target, scope)
    status = "IN-SCOPE" if ok else "OUT-OF-SCOPE"
    print(f"{args.target}: {status}")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
