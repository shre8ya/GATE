import json

with open('planner_summary.json', 'r', encoding='utf-8') as f:
    summary = json.load(f)

for name in ['1 C Programming', 'Playlist Directory']:
    info = summary.get(name, {})
    print(f"=== {name} ===")
    for r in info.get('sample', []):
        clean_cells = {k: str(v).encode('ascii', errors='replace').decode() for k, v in r['cells'].items()}
        print(f"  Row {r['row']}: {clean_cells}")
    print()
