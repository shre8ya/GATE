import json, os

os.makedirs('src/data', exist_ok=True)

with open('gate_database.json', 'r', encoding='utf-8') as f:
    gate_db = json.load(f)

with open('gate_syllabus_structured.json', 'r', encoding='utf-8') as f:
    syllabus_db = json.load(f)

# High-yield GATE CSE Formulas & Theorems
formula_vault = [
    {
        "id": "f-dm-1",
        "subject": "Engineering Mathematics",
        "topic": "Discrete Mathematics - Graph Theory",
        "title": "Euler's Formula & Planar Graphs",
        "formula": "V - E + F = 2 (for connected planar graphs)\nFor simple connected planar graph: E <= 3V - 6 (for V >= 3)\nIf no triangles: E <= 2V - 4",
        "notes": "Crucial for GATE: A graph is planar iff it contains no subgraph homeomorphic to K_5 or K_{3,3} (Kuratowski's Theorem). In any graph, sum of degrees = 2E (Handshaking lemma)."
    },
    {
        "id": "f-dm-2",
        "subject": "Engineering Mathematics",
        "topic": "Discrete Mathematics - Combinatorics",
        "title": "Master Theorem for Divide & Conquer",
        "formula": "T(n) = a T(n/b) + Theta(n^k log^p n)\nCompare a with b^k:\n1. If a > b^k => T(n) = Theta(n^(log_b a))\n2. If a = b^k:\n   - if p > -1 => Theta(n^k log^(p+1) n)\n   - if p = -1 => Theta(n^k log(log n))\n   - if p < -1 => Theta(n^k)\n3. If a < b^k:\n   - if p >= 0 => Theta(n^k log^p n)",
        "notes": "Always check regularity condition when a < b^k: a*f(n/b) <= c*f(n) for c < 1."
    },
    {
        "id": "f-la-1",
        "subject": "Engineering Mathematics",
        "topic": "Linear Algebra",
        "title": "Eigenvalues & Determinants Properties",
        "formula": "1. Sum of eigenvalues = Trace(A) = sum of main diagonal elements\n2. Product of eigenvalues = det(A)\n3. Eigenvalues of A^k are lambda^k\n4. Eigenvalues of A^(-1) are 1/lambda (if det != 0)\n5. If A is upper/lower triangular or diagonal, eigenvalues are diagonal elements.",
        "notes": "Cayley-Hamilton Theorem: Every square matrix satisfies its own characteristic equation: det(A - lambda*I) = 0."
    },
    {
        "id": "f-la-2",
        "subject": "Engineering Mathematics",
        "topic": "Linear Algebra",
        "title": "System of Linear Equations (AX = B)",
        "formula": "Let [A|B] be augmented matrix, n = number of variables:\n1. rank(A) != rank(A|B) => Inconsistent (No Solution)\n2. rank(A) = rank(A|B) = n => Unique Solution\n3. rank(A) = rank(A|B) < n => Infinitely Many Solutions (n - rank free variables)",
        "notes": "Homogeneous AX = 0: always consistent (trivial solution X=0). Non-trivial solution exists iff det(A) = 0 or rank(A) < n."
    },
    {
        "id": "f-algo-1",
        "subject": "Algorithms",
        "topic": "Sorting & Complexity",
        "title": "Standard Sorting Complexities & Stability",
        "formula": "1. Merge Sort: O(n log n) best/avg/worst | Space: O(n) | Stable\n2. Quick Sort: O(n log n) best/avg, O(n^2) worst | Space: O(log n) | Unstable\n3. Heap Sort: O(n log n) best/avg/worst | Space: O(1) | Unstable\n4. Counting Sort: O(n + k) | Space: O(n + k) | Stable\n5. Radix Sort: O(d*(n + k)) | Stable",
        "notes": "Comparison-based sorting lower bound: Omega(n log n) in worst/average case."
    },
    {
        "id": "f-algo-2",
        "subject": "Algorithms",
        "topic": "Graph Algorithms",
        "title": "Shortest Paths & MST Time Complexities",
        "formula": "1. BFS / DFS: O(V + E)\n2. Topological Sort: O(V + E)\n3. Dijkstra: O((V + E) log V) with Min-Heap, O(V^2) with array. No negative edges!\n4. Bellman-Ford: O(V * E). Detects negative weight cycles!\n5. Floyd-Warshall (APSP): O(V^3)\n6. Kruskal's MST: O(E log E) or O(E log V) with Union-Find\n7. Prim's MST: O((V + E) log V) with Min-Heap",
        "notes": "Dijkstra fails for negative edges. Bellman-Ford works for negative weights but fails for negative weight cycles reachable from source."
    },
    {
        "id": "f-os-1",
        "subject": "Operating Systems",
        "topic": "Memory Management & Paging",
        "title": "Effective Memory Access Time (EMAT)",
        "formula": "Single-level Paging:\nEMAT = h * (t_TLB + t_m) + (1 - h) * (t_TLB + 2 * t_m)\nTwo-level Paging:\nEMAT = h * (t_TLB + t_m) + (1 - h) * (t_TLB + 3 * t_m)\nk-level Paging:\nEMAT = h * (t_TLB + t_m) + (1 - h) * (t_TLB + (k + 1) * t_m)\nWith Page Fault:\nEMAT = (1 - p) * (Memory Access Time) + p * (Page Fault Service Time)",
        "notes": "h = TLB hit ratio, t_TLB = TLB lookup time, t_m = main memory access time, p = page fault rate."
    },
    {
        "id": "f-os-2",
        "subject": "Operating Systems",
        "topic": "Deadlock & Concurrency",
        "title": "Banker's Algorithm & Resource Bounds",
        "formula": "1. Need Matrix = Max - Allocation\n2. Safe state condition: Work >= Need_i, then Work = Work + Allocation_i\n3. Minimum resources to prevent deadlock:\n   If n processes each need max m resources:\n   Min Resources = n * (m - 1) + 1",
        "notes": "Deadlock 4 conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait."
    },
    {
        "id": "f-cn-1",
        "subject": "Computer Networks",
        "topic": "Data Link & Flow Control",
        "title": "Flow Control Protocols & Efficiency",
        "formula": "Propagation Delay T_p = Distance / Propagation Speed\nTransmission Delay T_t = Packet Length / Bandwidth\na = T_p / T_t\n1. Stop-and-Wait: Efficiency = 1 / (1 + 2a)\n2. Go-Back-N (window W_s = 2^k - 1, W_r = 1):\n   Efficiency = min(1, W_s / (1 + 2a))\n3. Selective Repeat (window W_s = 2^(k-1), W_r = 2^(k-1)):\n   Efficiency = min(1, W_s / (1 + 2a))",
        "notes": "Minimum sequence numbers: GBN needs W_s + 1 = 2^k; SR needs W_s + W_r = 2 * W_s <= 2^k."
    },
    {
        "id": "f-cn-2",
        "subject": "Computer Networks",
        "topic": "Network Layer - IP & Subnetting",
        "title": "Subnetting, CIDR & Hamming Code",
        "formula": "1. Subnet mask /x leaves 32 - x host bits.\n2. Usable hosts per subnet = 2^(32 - x) - 2 (subtract Network ID and Broadcast ID).\n3. Hamming Code for single bit error correction:\n   2^p >= m + p + 1 (m = data bits, p = parity bits)\n4. Fragmentation:\n   Offset = (byte index from start) / 8\n   Total fragments = ceil(payload / max_payload_multiple_of_8)",
        "notes": "IP header size = 20 to 60 bytes. HLEN field is in 4-byte words. Total length field is in bytes."
    },
    {
        "id": "f-cd-1",
        "subject": "Compiler Design",
        "topic": "Parsing & Grammars",
        "title": "Parsing Tables & Grammar Hierarchy",
        "formula": "Parser Power Hierarchy:\nLR(0) < SLR(1) < LALR(1) < CLR(1) / LR(1)\nLL(1) is Top-Down, not strictly comparable to LR(0), but LL(1) < LR(1).\nGrammar is LL(1) iff for A -> alpha | beta:\n1. FIRST(alpha) intersect FIRST(beta) = empty\n2. If beta =>* epsilon, then FIRST(alpha) intersect FOLLOW(A) = empty",
        "notes": "LALR(1) has same number of states as LR(0) and SLR(1). LALR(1) merges states with identical LR(0) cores but different lookaheads. Merging NEVER creates shift-reduce conflicts, but can create reduce-reduce conflicts!"
    }
]

# AI GATE Knowledge Base & Practice Bank for Instant Offline Answering
ai_knowledge_bank = {
    "welcome": "Hello! I am your personal GATE CSE 2027 AI Mentor. I have full knowledge of your 12-week study plan, IIT Madras syllabus, all 6 core subjects, engineering mathematics, and daily aptitude targets. Ask me to explain a concept, give hints for PYQs, create a quick 3-question quiz, or guide your study strategy for today!",
    "subjects": {
        "C Programming": "Focus on pointers, pointer arithmetic, operator precedence (* vs ++ vs []), recursion execution tree, and storage classes (static, extern). GATE loves pointer-to-pointer and array-as-parameter questions.",
        "Data Structures": "High-yield topics: Binary Trees (traversal reconstructions, counting trees with n nodes), Binary Search Trees (min/max swaps, deletion cases), Binary Heaps (heapify O(n), heap sort O(n log n)), and Linked List cycle detection.",
        "Algorithms": "Master Theorem cases, Asymptotic notation definitions (O, Omega, Theta), Sorting algorithms (stabilities and in-place nature), Dynamic Programming (LCS, Matrix Chain, 0/1 Knapsack), and Graph algorithms (Dijkstra vs Bellman-Ford vs Floyd-Warshall).",
        "Compiler Design": "Lexical tokens vs white spaces, FIRST and FOLLOW computations, LL(1) parse table construction & conditions, LR(0)/SLR(1)/LALR(1)/CLR(1) item collections and conflicts, Syntax-Directed Translations (S-attributed vs L-attributed), and Intermediate code DAGs.",
        "Operating Systems": "Process state transitions, CPU scheduling (FCFS, SJF/SRTF, Round Robin convoy effects), Semaphore solutions & Dining Philosophers, Banker's algorithm safe sequence, Paging & EAT calculation with TLB, Page replacement (FIFO, LRU, Optimal/Belady anomaly).",
        "Computer Networks": "Layering & encapsulation, Hamming code (2^p >= m + p + 1), Flow control efficiency (Stop-and-Wait, GBN, SR), Subnetting & CIDR calculations, IP fragmentation and offset calculation, TCP 3-way handshake & slow-start congestion control.",
        "Engineering Mathematics": "Discrete Maths represents ~13-15 marks! Focus on Propositional Logic (tautologies, valid inferences), Graph Theory (Euler formula, planar graph bounds, vertex chromatic number), Combinatorics (generating functions, recurrence relations). Linear algebra: eigenvalues and system of equations.",
        "General Aptitude": "Free 15 marks! Practice 15-20 min daily: percentages, ratios, time & work, speed-time-distance, syllogisms, and reading comprehension. Do NOT ignore spatial aptitude (folding, 2D/3D projections)."
    }
}

full_data_js = f"""// Auto-generated GATE CSE 2027 Master Database
// Organized Institute: IIT Madras | University Exam Synergy: IPU 5th Sem

export const MASTER_PLANNER_DATA = {json.dumps(gate_db['masterPlanner'], ensure_ascii=False, indent=2)};

export const CORE_SUBJECTS_DATA = {json.dumps(gate_db['coreSubjects'], ensure_ascii=False, indent=2)};

export const ENGINEERING_MATHS_DATA = {json.dumps(gate_db['engineeringMaths'], ensure_ascii=False, indent=2)};

export const GENERAL_APTITUDE_DATA = {json.dumps(gate_db['generalAptitude'], ensure_ascii=False, indent=2)};

export const SUNDAY_REVISION_DATA = {json.dumps(gate_db['sundayRevision'], ensure_ascii=False, indent=2)};

export const UNIVERSITY_EXAMS_DATA = {json.dumps(gate_db['universityExams'], ensure_ascii=False, indent=2)};

export const PLAYLIST_DIRECTORY_DATA = {json.dumps(gate_db['playlistDirectory'], ensure_ascii=False, indent=2)};

export const OFFICIAL_SYLLABUS_DATA = {json.dumps(syllabus_db, ensure_ascii=False, indent=2)};

export const FORMULA_VAULT_DATA = {json.dumps(formula_vault, ensure_ascii=False, indent=2)};

export const AI_KNOWLEDGE_BANK = {json.dumps(ai_knowledge_bank, ensure_ascii=False, indent=2)};
"""

with open('src/data/database.js', 'w', encoding='utf-8') as f:
    f.write(full_data_js)

print("Generated src/data/database.js successfully!")
print("File size:", len(full_data_js), "bytes")
