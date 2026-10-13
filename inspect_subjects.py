import json

with open('planner_summary.json', 'r', encoding='utf-8') as f:
    summary = json.load(f)

for name in ['1 C Programming', '2 Data Structures', '3 Algorithms DAA', '4 Compiler Design', 
             '5 Operating Systems', '6 Computer Networks', '7 Engineering Maths', '8 Aptitude', 
             'Sunday Revision', 'Uni Exams & Wrap-up', 'Playlist Directory', 'Master Planner']:
    info = summary.get(name, {})
    print(f"=== {name} ===")
    for r in info.get('sample', [])[:7]:
        clean_cells = {k: str(v).encode('ascii', errors='replace').decode() for k, v in r['cells'].items()}
        print(f"  Row {r['row']}: {clean_cells}")
    print()
