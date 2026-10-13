import json

with open('planner_summary.json', 'r', encoding='utf-8') as f:
    summary = json.load(f)

for name, info in summary.items():
    print(f"=== {name} ({info['row_count']} rows) ===")
    for r in info['sample'][:4]:
        clean_cells = {k: str(v).encode('ascii', errors='replace').decode() for k, v in r['cells'].items()}
        print(f"  Row {r['row']}: {clean_cells}")
    print()
