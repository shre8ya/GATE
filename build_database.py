import json, re, datetime

# Load extracted planner
with open('gate_planner_extracted.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

# Load hyperlinks
with open('excel_hyperlinks.json', 'r', encoding='utf-8') as f:
    hyperlinks = json.load(f)

def excel_date_to_iso(val):
    try:
        serial = float(val)
        dt = datetime.datetime(1899, 12, 30) + datetime.timedelta(days=serial)
        return dt.strftime('%Y-%m-%d')
    except:
        return str(val)

# Helper to find link for a cell
def get_link(sheet_file, cell_ref):
    sheet_links = hyperlinks.get(sheet_file, {})
    return sheet_links.get(cell_ref, '')

# Let's inspect Overview sheet
overview_rows = raw_data.get('Overview', [])
overview_info = []
for r in overview_rows:
    c = r['cells']
    if any(c.values()):
        overview_info.append(c)

# Let's inspect Master Planner
master_rows = raw_data.get('Master Planner', [])
master_items = []
# Row 4 is header: A: Date, B: Day, C: Type, D: Subject, E: Main focus, F: Maths lecture, G: Easy start (min), H: Maths (min), I: Main block (min), J: Practice (min), K: Total (hrs), L: Note
for r in master_rows:
    if r['row'] >= 5:
        c = r['cells']
        date_raw = c.get('A', '')
        if not date_raw:
            continue
        date_iso = excel_date_to_iso(date_raw)
        day_name = c.get('B', '')
        plan_type = c.get('C', '')
        subject = c.get('D', '')
        main_focus = c.get('E', '')
        maths_lecture = c.get('F', '')
        easy_start_min = c.get('G', '0')
        maths_min = c.get('H', '0')
        main_block_min = c.get('I', '0')
        practice_min = c.get('J', '0')
        total_hrs = c.get('K', '0')
        note = c.get('L', '')
        
        master_items.append({
            'row': r['row'],
            'date': date_iso,
            'day': day_name,
            'type': plan_type,
            'subject': subject,
            'mainFocus': main_focus,
            'mathsLecture': maths_lecture,
            'easyStartMin': int(float(easy_start_min)) if easy_start_min and easy_start_min.replace('.','',1).isdigit() else 0,
            'mathsMin': int(float(maths_min)) if maths_min and maths_min.replace('.','',1).isdigit() else 0,
            'mainBlockMin': int(float(main_block_min)) if main_block_min and main_block_min.replace('.','',1).isdigit() else 0,
            'practiceMin': int(float(practice_min)) if practice_min and practice_min.replace('.','',1).isdigit() else 0,
            'totalHrs': float(total_hrs) if total_hrs and total_hrs.replace('.','',1).isdigit() else 0.0,
            'note': note
        })

print(f"Master items extracted: {len(master_items)}")
print("First item:", master_items[0])
print("Last item:", master_items[-1])
