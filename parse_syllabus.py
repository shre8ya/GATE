import json

with open('CS_GATE2027_Syllabus.txt', 'r', encoding='utf-8') as f:
    cs_raw = f.read()

with open('GA_GATE2027_Syllabus.txt', 'r', encoding='utf-8') as f:
    ga_raw = f.read()

# Let's inspect the sections in CS
sections = []
current_sec = None
current_content = []

for line in cs_raw.split('\n'):
    line_s = line.strip()
    if line_s.startswith('Section'):
        if current_sec:
            sections.append({'title': current_sec, 'content': '\n'.join(current_content).strip()})
        current_sec = line_s
        current_content = []
    elif current_sec and line_s:
        current_content.append(line_s)

if current_sec:
    sections.append({'title': current_sec, 'content': '\n'.join(current_content).strip()})

print(f"Extracted {len(sections)} CS sections.")
for s in sections:
    print(s['title'], "-> length:", len(s['content']))

# GA sections
ga_sections = []
curr_ga = None
curr_ga_c = []
for line in ga_raw.split('\n'):
    line_s = line.strip()
    if line_s.startswith('Section'):
        if curr_ga:
            ga_sections.append({'title': curr_ga, 'content': '\n'.join(curr_ga_c).strip()})
        curr_ga = line_s
        curr_ga_c = []
    elif curr_ga and line_s:
        curr_ga_c.append(line_s)

if curr_ga:
    ga_sections.append({'title': curr_ga, 'content': '\n'.join(curr_ga_c).strip()})

print(f"Extracted {len(ga_sections)} GA sections.")
for s in ga_sections:
    print(s['title'], "-> length:", len(s['content']))

with open('gate_syllabus_structured.json', 'w', encoding='utf-8') as f:
    json.dump({'cs': sections, 'ga': ga_sections}, f, indent=2)
