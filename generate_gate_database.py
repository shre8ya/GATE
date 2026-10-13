import json, datetime

with open('gate_planner_extracted.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

with open('excel_hyperlinks.json', 'r', encoding='utf-8') as f:
    hyperlinks = json.load(f)

# Helper for date
def excel_date_to_iso(val):
    try:
        serial = float(val)
        dt = datetime.datetime(1899, 12, 30) + datetime.timedelta(days=serial)
        return dt.strftime('%Y-%m-%d')
    except:
        return str(val)

def get_link(sheet_file, cell_ref):
    return hyperlinks.get(sheet_file, {}).get(cell_ref, '')

# Subject sheets map to sheet file
sheet_file_map = {
    '1 C Programming': 'xl/worksheets/sheet4.xml',
    '2 Data Structures': 'xl/worksheets/sheet5.xml',
    '3 Algorithms DAA': 'xl/worksheets/sheet6.xml',
    '4 Compiler Design': 'xl/worksheets/sheet7.xml',
    '5 Operating Systems': 'xl/worksheets/sheet8.xml',
    '6 Computer Networks': 'xl/worksheets/sheet9.xml',
    '7 Engineering Maths': 'xl/worksheets/sheet10.xml',
    '8 Aptitude': 'xl/worksheets/sheet11.xml',
    'Sunday Revision': 'xl/worksheets/sheet12.xml',
    'Uni Exams & Wrap-up': 'xl/worksheets/sheet13.xml',
    'Playlist Directory': 'xl/worksheets/sheet14.xml',
}

# 1. Master Planner
master_items = []
for r in raw_data.get('Master Planner', []):
    if r['row'] >= 5:
        c = r['cells']
        date_raw = c.get('A', '')
        if not date_raw:
            continue
        date_iso = excel_date_to_iso(date_raw)
        master_items.append({
            'id': f"mp-{r['row']}",
            'row': r['row'],
            'date': date_iso,
            'day': c.get('B', ''),
            'type': c.get('C', ''),
            'subject': c.get('D', ''),
            'mainFocus': c.get('E', ''),
            'mathsLecture': c.get('F', ''),
            'easyStartMin': int(float(c.get('G', 0))) if str(c.get('G', '')).replace('.','',1).isdigit() else 0,
            'mathsMin': int(float(c.get('H', 0))) if str(c.get('H', '')).replace('.','',1).isdigit() else 0,
            'mainBlockMin': int(float(c.get('I', 0))) if str(c.get('I', '')).replace('.','',1).isdigit() else 0,
            'practiceMin': int(float(c.get('J', 0))) if str(c.get('J', '')).replace('.','',1).isdigit() else 0,
            'totalHrs': float(c.get('K', 0)) if str(c.get('K', '')).replace('.','',1).isdigit() else 0.0,
            'note': c.get('L', ''),
            'status': 'Not Started'
        })

# 2. Subject day sheets
subject_configs = [
    {'key': 'c_programming', 'sheet': '1 C Programming', 'name': 'C Programming', 'code': 'CS-PROG'},
    {'key': 'data_structures', 'sheet': '2 Data Structures', 'name': 'Data Structures', 'code': 'CS-DS'},
    {'key': 'algorithms', 'sheet': '3 Algorithms DAA', 'name': 'Algorithms (DAA)', 'code': 'CS-ALGO'},
    {'key': 'compiler_design', 'sheet': '4 Compiler Design', 'name': 'Compiler Design', 'code': 'CS-CD'},
    {'key': 'operating_systems', 'sheet': '5 Operating Systems', 'name': 'Operating Systems', 'code': 'CS-OS'},
    {'key': 'computer_networks', 'sheet': '6 Computer Networks', 'name': 'Computer Networks', 'code': 'CS-CN'},
]

subjects_data = {}

for cfg in subject_configs:
    sname = cfg['sheet']
    sfile = sheet_file_map[sname]
    rows = raw_data.get(sname, [])
    
    # Extract playlists from rows 4-7
    playlists = []
    for r in rows:
        if 4 <= r['row'] <= 7:
            c = r['cells']
            role = c.get('A', '')
            desc = c.get('D', '')
            link = get_link(sfile, f"D{r['row']}")
            if role and desc:
                playlists.append({'role': role, 'description': desc, 'url': link})
    
    # Extract days starting row 8 or 9
    days = []
    for r in rows:
        c = r['cells']
        # Check if row is a day row (A is a number)
        day_num_str = str(c.get('A', '')).strip()
        if day_num_str.isdigit() and r['row'] >= 8:
            row_idx = r['row']
            date_iso = excel_date_to_iso(c.get('B', ''))
            
            day_item = {
                'id': f"{cfg['key']}-d{day_num_str}",
                'dayNumber': int(day_num_str),
                'date': date_iso,
                'dayOfWeek': c.get('C', ''),
                'aptitudeWarmup': c.get('D', ''),
                'aptitudeLink': get_link(sfile, f"D{row_idx}"),
                'mathsLecture': c.get('E', ''),
                'mathsPlaylist': c.get('F', ''),
                'mathsPlaylistUrl': get_link(sfile, f"F{row_idx}"),
                'mathsSearchQuery': c.get('G', ''),
                'mathsSearchUrl': get_link(sfile, f"G{row_idx}"),
                'topic': c.get('H', ''),
                'subtopics': c.get('I', ''),
                'mainPlaylist': c.get('J', ''),
                'mainPlaylistUrl': get_link(sfile, f"J{row_idx}"),
                'topicSearch': c.get('K', ''),
                'topicSearchUrl': get_link(sfile, f"K{row_idx}"),
                'revisionPlaylist': c.get('L', ''),
                'revisionPlaylistUrl': get_link(sfile, f"L{row_idx}"),
                'bookRef': c.get('M', ''),
                'practicePyq': c.get('N', ''),
                'plannedHrs': float(c.get('O', 0)) if str(c.get('O', '')).replace('.','',1).isdigit() else 0.0,
                'status': 'Not Started',
                'notes': c.get('Q', '') if 'Q' in c else c.get('P', '') if c.get('P') not in ['Not Started', 'In Progress', 'Done'] else ''
            }
            days.append(day_item)
            
    subjects_data[cfg['key']] = {
        'name': cfg['name'],
        'code': cfg['code'],
        'sheet': sname,
        'playlists': playlists,
        'days': days,
        'totalDays': len(days),
        'totalHours': sum(d['plannedHrs'] for d in days)
    }

# 3. Engineering Maths (Sheet 10)
maths_file = sheet_file_map['7 Engineering Maths']
maths_rows = raw_data.get('7 Engineering Maths', [])
maths_days = []
for r in maths_rows:
    c = r['cells']
    day_str = str(c.get('A', '')).strip()
    if day_str.isdigit() and r['row'] >= 5:
        row_idx = r['row']
        maths_days.append({
            'id': f"em-d{day_str}",
            'dayNumber': int(day_str),
            'date': excel_date_to_iso(c.get('B', '')),
            'dayOfWeek': c.get('C', ''),
            'lectureTopic': c.get('D', ''),
            'whatsCovered': c.get('E', ''),
            'playlist': c.get('F', ''),
            'playlistUrl': get_link(maths_file, f"F{row_idx}"),
            'searchQuery': c.get('G', ''),
            'searchUrl': get_link(maths_file, f"G{row_idx}"),
            'sameDaySubject': c.get('H', ''),
            'quickPractice': c.get('I', ''),
            'plannedMin': int(float(c.get('J', 0))) if str(c.get('J', '')).replace('.','',1).isdigit() else 30,
            'status': 'Not Started',
            'notes': c.get('L', '')
        })

# 4. Aptitude (Sheet 11)
apt_file = sheet_file_map['8 Aptitude']
apt_rows = raw_data.get('8 Aptitude', [])
apt_days = []
for r in apt_rows:
    c = r['cells']
    day_str = str(c.get('A', '')).strip()
    if day_str.isdigit() and r['row'] >= 11:
        row_idx = r['row']
        apt_days.append({
            'id': f"ga-d{day_str}",
            'dayNumber': int(day_str),
            'date': excel_date_to_iso(c.get('B', '')),
            'dayOfWeek': c.get('C', ''),
            'round': c.get('D', ''),
            'topic': c.get('E', ''),
            'whatToDo': c.get('F', ''),
            'source': c.get('G', ''),
            'sourceUrl': get_link(apt_file, f"G{row_idx}"),
            'searchQuery': c.get('H', ''),
            'searchUrl': get_link(apt_file, f"H{row_idx}"),
            'plannedMin': int(float(c.get('I', 0))) if str(c.get('I', '')).replace('.','',1).isdigit() else 15,
            'status': 'Not Started',
            'notes': c.get('K', '')
        })

# 5. Sunday Revision (Sheet 12)
sun_file = sheet_file_map['Sunday Revision']
sun_rows = raw_data.get('Sunday Revision', [])
sunday_items = []
for r in sun_rows:
    c = r['cells']
    date_raw = c.get('A', '')
    if r['row'] >= 5 and date_raw:
        row_idx = r['row']
        sunday_items.append({
            'id': f"sun-r{row_idx}",
            'date': excel_date_to_iso(date_raw),
            'dayOfWeek': c.get('B', 'Sun'),
            'topicsToRevise': c.get('C', ''),
            'task1Notes': c.get('D', 'Re-read short notes (30 min)'),
            'task2TimedTest': c.get('E', 'Timed Test: 25 Subject Qs + 10 Maths Qs (90 min)'),
            'task3ErrorLog': c.get('F', 'Error Log + Redo (60 min)'),
            'plannedHrs': float(c.get('G', 3)) if str(c.get('G', '')).replace('.','',1).isdigit() else 3.0,
            'status': 'Not Started'
        })

# 6. Uni Exams & Wrap-up (Sheet 13)
uni_file = sheet_file_map['Uni Exams & Wrap-up']
uni_rows = raw_data.get('Uni Exams & Wrap-up', [])
uni_items = []
for r in uni_rows:
    c = r['cells']
    date_raw = c.get('A', '')
    if r['row'] >= 5 and date_raw:
        row_idx = r['row']
        uni_items.append({
            'id': f"uni-r{row_idx}",
            'date': excel_date_to_iso(date_raw),
            'dayOfWeek': c.get('B', ''),
            'event': c.get('C', ''),
            'subject': c.get('D', ''),
            'focus': c.get('E', ''),
            'detailedPlan': c.get('F', ''),
            'resources': c.get('G', ''),
            'plannedHrs': float(c.get('H', 0)) if str(c.get('H', '')).replace('.','',1).isdigit() else 0.0,
            'status': 'Not Started'
        })

# 7. Playlist Directory (Sheet 14)
pl_file = sheet_file_map['Playlist Directory']
pl_rows = raw_data.get('Playlist Directory', [])
playlist_items = []
for r in pl_rows:
    c = r['cells']
    if r['row'] >= 5 and c.get('A'):
        row_idx = r['row']
        playlist_items.append({
            'id': f"pl-r{row_idx}",
            'subject': c.get('A', ''),
            'role': c.get('B', ''),
            'title': c.get('C', ''),
            'teacher': c.get('D', ''),
            'uploader': c.get('E', ''),
            'videos': c.get('F', ''),
            'url': get_link(pl_file, f"G{row_idx}")
        })

database = {
    'masterPlanner': master_items,
    'coreSubjects': subjects_data,
    'engineeringMaths': {
        'name': 'Engineering Mathematics',
        'code': 'EM',
        'days': maths_days,
        'totalDays': len(maths_days),
        'totalHours': sum(d['plannedMin'] for d in maths_days) / 60.0
    },
    'generalAptitude': {
        'name': 'General Aptitude',
        'code': 'GA',
        'days': apt_days,
        'totalDays': len(apt_days),
        'totalHours': sum(d['plannedMin'] for d in apt_days) / 60.0
    },
    'sundayRevision': sunday_items,
    'universityExams': uni_items,
    'playlistDirectory': playlist_items
}

with open('gate_database.json', 'w', encoding='utf-8') as f:
    json.dump(database, f, ensure_ascii=False, indent=2)

print("Database generation complete!")
print(f"Master Planner: {len(master_items)} days")
for k, v in subjects_data.items():
    print(f"  {v['name']}: {len(v['days'])} days, {v['totalHours']}h")
print(f"Engineering Maths: {len(maths_days)} days")
print(f"General Aptitude: {len(apt_days)} days")
print(f"Sunday Revisions: {len(sunday_items)} sessions")
print(f"Uni Exams & Wrap-up: {len(uni_items)} entries")
print(f"Playlist Directory: {len(playlist_items)} playlists")
