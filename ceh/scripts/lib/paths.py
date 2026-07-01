"""Engagement directory layout and artifact paths."""

from __future__ import annotations

from pathlib import Path

CEH_ROOT = Path(__file__).resolve().parents[2]
DATA_ROOT = CEH_ROOT / "data"


def engagement_dir(engagement_id: str) -> Path:
    return DATA_ROOT / engagement_id


def artifact(engagement_id: str, *parts: str) -> Path:
    return engagement_dir(engagement_id).joinpath(*parts)
