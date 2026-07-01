"""Load scope file and check targets against allowlists."""

from __future__ import annotations

import ipaddress
import json
from pathlib import Path
from typing import Any


def load_scope(scope_path: Path) -> dict[str, Any]:
    with scope_path.open(encoding="utf-8") as f:
        if scope_path.suffix in (".yaml", ".yml"):
            try:
                import yaml
            except ImportError as e:
                raise ImportError(
                    "PyYAML required for .yaml scope files. "
                    "Use scope.json or: pip install pyyaml"
                ) from e
            return yaml.safe_load(f) or {}
        return json.load(f)


def host_in_scope(host: str, scope: dict[str, Any]) -> bool:
    forbidden = scope.get("forbidden") or []
    for entry in forbidden:
        if _matches(host, entry):
            return False

    allowed_hosts = scope.get("hosts") or []
    if host in allowed_hosts:
        return True

    for domain in scope.get("domains") or []:
        if _domain_matches(host, domain):
            return True

    for cidr in scope.get("cidrs") or []:
        try:
            if ipaddress.ip_address(host) in ipaddress.ip_network(cidr, strict=False):
                return True
        except ValueError:
            continue

    return False


def technique_allowed(scope: dict[str, Any], technique: str) -> bool:
    allowed = scope.get("allowed_techniques") or {}
    return bool(allowed.get(technique, False))


def _domain_matches(host: str, pattern: str) -> bool:
    host = host.lower().rstrip(".")
    pattern = pattern.lower().rstrip(".")
    if pattern.startswith("*."):
        suffix = pattern[2:]
        return host == suffix or host.endswith("." + suffix)
    return host == pattern


def _matches(host: str, entry: str) -> bool:
    try:
        return ipaddress.ip_address(host) in ipaddress.ip_network(entry, strict=False)
    except ValueError:
        return _domain_matches(host, entry)
