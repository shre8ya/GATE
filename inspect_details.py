import json

with open('gate_planner_extracted.json', 'r', encoding='utf-8') as f:
    raw = json.load(f)

for sname in ['1 C Programming', '2 Data Structures', '3 Algorithms DAA']:
    print(f"=== {sname} ===")
    for r in raw[sname][7:]:
        clean = {k: str(v).encode('ascii', errors='replace').decode() for k, v in r['cells'].items() if str(v).strip()}
        print(f"  R{r['row']}: {clean}")
    print()
