import zipfile, xml.etree.ElementTree as ET, json

z = zipfile.ZipFile('GATE_2027_Study_Planner.xlsx')

# 1. extract relationship links
sheet_rels = {}
for f in z.namelist():
    if 'worksheets/_rels/' in f:
        sheet_file = f.replace('worksheets/_rels/', 'worksheets/').replace('.xml.rels', '.xml')
        root = ET.fromstring(z.read(f))
        rels = {}
        for rel in root.iter('{http://schemas.openxmlformats.org/package/2006/relationships}Relationship'):
            rid = rel.attrib.get('Id')
            target = rel.attrib.get('Target')
            rels[rid] = target
        sheet_rels[sheet_file] = rels

# 2. extract hyperlink tags from worksheets
sheet_hyperlinks = {}
for sheet_file, rels in sheet_rels.items():
    if sheet_file in z.namelist():
        root = ET.fromstring(z.read(sheet_file))
        links = {}
        for hl in root.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}hyperlink'):
            ref = hl.attrib.get('ref')
            rid = hl.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
            url = rels.get(rid)
            if url:
                links[ref] = url
        sheet_hyperlinks[sheet_file] = links

print("Total sheets with hyperlinks:", len(sheet_hyperlinks))
total_links = sum(len(l) for l in sheet_hyperlinks.values())
print("Total hyperlinks found:", total_links)

with open('excel_hyperlinks.json', 'w', encoding='utf-8') as f:
    json.dump(sheet_hyperlinks, f, indent=2)

for sf, l in sheet_hyperlinks.items():
    if l:
        print(f"{sf}: {len(l)} links. Sample:", list(l.items())[:2])
