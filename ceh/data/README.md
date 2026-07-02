# Engagement artifacts (lab output)

Each engagement gets its own subdirectory: `data/<engagement-id>/`.

Do not commit real client data. This folder is gitignored except this README.

Initialize with:

```bash
cd ceh
python scripts/pipeline.py init --engagement lab-2025-06 --scope scope.json.example
python scripts/pipeline.py status --engagement lab-2025-06
```

See [pipeline.html](../pipeline.html) for artifact schemas and gate workflow.
