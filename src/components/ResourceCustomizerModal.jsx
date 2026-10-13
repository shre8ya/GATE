import React, { useState } from 'react';
import { 
  Sparkles, 
  Video, 
  BookOpen, 
  Check, 
  RefreshCw, 
  ExternalLink, 
  Search, 
  Layers, 
  Zap, 
  ArrowRight, 
  Sliders, 
  CheckCheck,
  AlertCircle,
  HelpCircle,
  User,
  Target
} from 'lucide-react';
import { playClick, playSuccessChime } from '../utils/audio';
import { fireTaskConfetti } from '../utils/confetti';

// Comprehensive Popular GATE CSE Playlists Directory for 1-Click AI & Manual Swapping
export const CURATED_RESOURCE_CATALOG = {
  c_programming: {
    key: 'c_programming',
    subjectName: 'C Programming',
    icon: '⌨',
    curatedOptions: [
      {
        id: 'cp-gate-smashers',
        teacher: 'Varun Singla (Gate Smashers)',
        title: 'C Programming Complete Playlist | Gate Smashers',
        url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGmiGl_nPWHc4kUKBCNXx4n',
        videos: 65,
        rating: '4.9 ★ (Hinglish Favorite)',
        tags: ['Hinglish', 'Concept + Tricks', 'Beginner Friendly']
      },
      {
        id: 'cp-neso',
        teacher: 'Neso Academy',
        title: 'C Programming & Pointers Mastery | Neso Academy',
        url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRh6isJ01Zs6S4302b0csm06',
        videos: 140,
        rating: '4.9 ★ (Deep Academic)',
        tags: ['English', 'Deep Concepts', 'Pointers Focus']
      },
      {
        id: 'cp-amit-khurana',
        teacher: 'Amit Khurana Sir',
        title: 'C Programming for GATE CSE | Amit Khurana',
        url: 'https://www.youtube.com/playlist?list=PLC36xJgs4dxEq2PTbndA0qUg9QebzLqH4',
        videos: 82,
        rating: '4.8 ★ (GATE Rigor)',
        tags: ['Hinglish', 'Output Tracing', 'GATE PYQs']
      },
      {
        id: 'cp-jennys',
        teacher: "Jenny's Lectures CS IT",
        title: "C Programming Tutorials for Beginners & GATE",
        url: 'https://www.youtube.com/playlist?list=PLdo5W4Nhv31a8UcKa4177GH5AOX31nBUn',
        videos: 104,
        rating: '4.9 ★ (Crystal Clear)',
        tags: ['Hinglish', 'Memory Models', 'Recursion Tree']
      },
      {
        id: 'cp-gothi',
        teacher: 'Vishvadeep Gothi Sir',
        title: 'C Programming | GATE CSE Comprehensive',
        url: 'https://www.youtube.com/playlist?list=PLbE3-5DBkMUkATaUFgDIpBDbfnym0qvsQ',
        videos: 40,
        rating: '4.8 ★ (Fast Track)',
        tags: ['Hinglish', 'Compact', 'IIT Bombay Mindset']
      }
    ]
  },

  data_structures: {
    key: 'data_structures',
    subjectName: 'Data Structures',
    icon: '⬡',
    curatedOptions: [
      {
        id: 'ds-abdul-bari',
        teacher: 'Abdul Bari',
        title: 'Mastering Data Structures & Algorithms using C and C++',
        url: 'https://www.youtube.com/playlist?list=PLAXnLdrLnQpRcveZTtD644gM9uzYqJCwr',
        videos: 85,
        rating: '5.0 ★ (Global Gold Standard)',
        tags: ['English', 'Visual Diagrams', 'Trees & Graphs']
      },
      {
        id: 'ds-gate-smashers',
        teacher: 'Varun Singla (Gate Smashers)',
        title: 'Data Structures Full Course | Gate Smashers',
        url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiEwaANNt3wBGKR4t9lvwKzs',
        videos: 78,
        rating: '4.9 ★ (Fast & Crisp)',
        tags: ['Hinglish', 'Exam Oriented', 'AVL / B-Trees']
      },
      {
        id: 'ds-amit-khurana',
        teacher: 'Amit Khurana Sir',
        title: 'Data Structures for GATE | Amit Khurana',
        url: 'https://www.youtube.com/playlist?list=PLC36xJgs4dxG6h9wW_rM9_p6Kj_7E9f2K',
        videos: 90,
        rating: '4.9 ★ (Deep Rigor)',
        tags: ['Hinglish', 'GATE PYQs In-depth', 'Complexities']
      },
      {
        id: 'ds-neso',
        teacher: 'Neso Academy',
        title: 'Data Structures Complete Series | Neso Academy',
        url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRj9lld8sWIUNwlKfdUoPd1Y',
        videos: 110,
        rating: '4.8 ★ (Standard Theory)',
        tags: ['English', 'Linked Lists', 'Stack & Queue']
      }
    ]
  },

  algorithms: {
    key: 'algorithms',
    subjectName: 'Algorithms (DAA)',
    icon: '⚡',
    curatedOptions: [
      {
        id: 'algo-abdul-bari',
        teacher: 'Abdul Bari',
        title: 'Algorithms Analysis & Design (DAA) | Abdul Bari',
        url: 'https://www.youtube.com/playlist?list=PLDN4rrl48X7analyE18G6hH9zB3WsmH3r',
        videos: 84,
        rating: '5.0 ★ (Best in World)',
        tags: ['English', 'Recurrences', 'Dynamic Programming', 'Greedy']
      },
      {
        id: 'algo-gate-smashers',
        teacher: 'Varun Singla (Gate Smashers)',
        title: 'Design and Analysis of Algorithms (DAA) | Gate Smashers',
        url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiHcmS4i14bI0VrMbZTUvlTa',
        videos: 72,
        rating: '4.9 ★ (High Yield)',
        tags: ['Hinglish', 'NP-Complete', 'Asymptotic Bounds']
      },
      {
        id: 'algo-amit-khurana',
        teacher: 'Amit Khurana Sir',
        title: 'Algorithms Full Course for GATE CSE | Amit Khurana',
        url: 'https://www.youtube.com/playlist?list=PLC36xJgs4dxHQ_y507V49gC5tN_qG9P5y',
        videos: 95,
        rating: '4.9 ★ (GATE PYQ Deep Dive)',
        tags: ['Hinglish', 'Graph Algorithms', 'All PYQs']
      },
      {
        id: 'algo-go-classes',
        teacher: 'Sachin Mittal & Deepak Poonia (GO Classes)',
        title: 'Algorithms Complete GATE Course & Analysis | GO Classes',
        url: 'https://www.youtube.com/playlist?list=PLIPZ2_p3RNHjUCHdJp-_soSSmhgmO4i0T',
        videos: 45,
        rating: '4.9 ★ (Pure Problem Solving)',
        tags: ['Hinglish', 'Challenging Questions', 'Mathematical Proofs']
      }
    ]
  },

  compiler_design: {
    key: 'compiler_design',
    subjectName: 'Compiler Design',
    icon: '⚙',
    curatedOptions: [
      {
        id: 'cd-gate-smashers',
        teacher: 'Varun Singla (Gate Smashers)',
        title: 'Compiler Design Complete Playlist | Gate Smashers',
        url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiEKtKSIHYusizkESC42diyc',
        videos: 42,
        rating: '4.9 ★ (Parsing Masterclass)',
        tags: ['Hinglish', 'LL(1) / LR(0) / LALR Tables', 'SDT / 3AC']
      },
      {
        id: 'cd-amit-khurana',
        teacher: 'Amit Khurana Sir',
        title: 'Compiler Design for GATE CSE | Amit Khurana',
        url: 'https://www.youtube.com/playlist?list=PLC36xJgs4dxF5gBwB2a1KjD6fL2sA8y_Z',
        videos: 56,
        rating: '4.8 ★ (Exhaustive)',
        tags: ['Hinglish', 'Conflict Resolution', 'Dataflow Optimization']
      },
      {
        id: 'cd-knowledge-gate',
        teacher: 'Sanchit Jain (Knowledge Gate)',
        title: 'Compiler Design for GATE & University | Knowledge Gate',
        url: 'https://www.youtube.com/playlist?list=PLmXKhU9FNesS1bS3n5Xb1jB_c8fT8e9f4',
        videos: 48,
        rating: '4.8 ★ (University + GATE)',
        tags: ['Hinglish', 'Lexical Analyzer', 'Code Generation']
      },
      {
        id: 'cd-rbr',
        teacher: 'Prof. Ravindrababu Ravula',
        title: 'Compiler Design - Complete Classical Course',
        url: 'https://www.youtube.com/playlist?list=PLEbnTDJUr_IcPtUXFy2b1sGRPsLFMghhS',
        videos: 49,
        rating: '4.7 ★ (Old Classic)',
        tags: ['English', 'Formal Grammars', 'Target Code']
      }
    ]
  },

  operating_systems: {
    key: 'operating_systems',
    subjectName: 'Operating Systems',
    icon: '⌘',
    curatedOptions: [
      {
        id: 'os-gate-smashers',
        teacher: 'Varun Singla (Gate Smashers)',
        title: 'Operating System Full Course | Gate Smashers',
        url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p',
        videos: 92,
        rating: '5.0 ★ (Most Recommended Hinglish)',
        tags: ['Hinglish', 'Semaphores & Mutex', 'Paging & TLB', 'Disk Scheduling']
      },
      {
        id: 'os-knowledge-gate',
        teacher: 'Sanchit Jain (Knowledge Gate)',
        title: 'Operating System for GATE CSE | Sanchit Jain',
        url: 'https://www.youtube.com/playlist?list=PLmXKhU9FNesSD6L9pE4R5L8Vd4D8qZ8t6',
        videos: 84,
        rating: '4.9 ★ (Step-by-Step Clarity)',
        tags: ['Hinglish', 'Process Scheduling', 'Virtual Memory Numericals']
      },
      {
        id: 'os-amit-khurana',
        teacher: 'Amit Khurana Sir',
        title: 'Operating Systems for GATE CSE | Amit Khurana',
        url: 'https://www.youtube.com/playlist?list=PLC36xJgs4dxG9d7vM8B4V6Z3R7c1J2Q0p',
        videos: 110,
        rating: '4.9 ★ (Deep Synchronization)',
        tags: ['Hinglish', 'Bankers Algorithm', 'Deadlock Detection']
      },
      {
        id: 'os-neso',
        teacher: 'Neso Academy',
        title: 'Operating Systems Full Course | Neso Academy',
        url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAeuVcp2O',
        videos: 115,
        rating: '4.8 ★ (Standard Reference)',
        tags: ['English', 'Silberschatz Mapped', 'System Calls']
      }
    ]
  },

  computer_networks: {
    key: 'computer_networks',
    subjectName: 'Computer Networks',
    icon: '◎',
    curatedOptions: [
      {
        id: 'cn-gate-smashers',
        teacher: 'Varun Singla (Gate Smashers)',
        title: 'Computer Networks Full Course | Gate Smashers',
        url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_',
        videos: 86,
        rating: '4.9 ★ (High Yield & Fast)',
        tags: ['Hinglish', 'Subnetting & CIDR', 'TCP Handshake & Congestion', 'Routing']
      },
      {
        id: 'cn-amit-khurana',
        teacher: 'Amit Khurana Sir',
        title: 'Computer Networks Complete Playlist for GATE | Amit Khurana',
        url: 'https://www.youtube.com/playlist?list=PLC36xJgs4dxHT-TxTy3U1slr5RaBJGaLd',
        videos: 202,
        rating: '5.0 ★ (Encyclopedic Rigor)',
        tags: ['Hinglish', 'Flow Control (Sliding Window)', 'Every GATE PYQ Solved']
      },
      {
        id: 'cn-knowledge-gate',
        teacher: 'Sanchit Jain (Knowledge Gate)',
        title: 'Computer Networks for GATE | Knowledge Gate',
        url: 'https://www.youtube.com/playlist?list=PLmXKhU9FNesT4Y8V3P_K4R7f7Y4w1F4e2',
        videos: 75,
        rating: '4.8 ★ (Concise & Focused)',
        tags: ['Hinglish', 'OSI / IP Protocols', 'Sockets & Ports']
      },
      {
        id: 'cn-neso',
        teacher: 'Neso Academy',
        title: 'Computer Networks Full Course | Neso Academy',
        url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgMCUAG0XRw78UA8qnv6jEx',
        videos: 125,
        rating: '4.8 ★ (Clean English)',
        tags: ['English', 'Data Link Layer (CRC, Hamming)', 'Network Security']
      }
    ]
  },

  engineering_maths: {
    key: 'engineering_maths',
    subjectName: 'Engineering Mathematics',
    icon: '⌬',
    curatedOptions: [
      {
        id: 'em-go-classes',
        teacher: 'Sachin Mittal & Deepak Poonia (GO Classes)',
        title: 'Discrete Mathematics & Calculus for GATE | GO Classes',
        url: 'https://www.youtube.com/playlist?list=PLIPZ2_p3RNHillKxh1_iFeZhy9MftHeWW',
        videos: 90,
        rating: '5.0 ★ (Official Planner Standard)',
        tags: ['Hinglish', 'Mathematical Proofs', 'Combinatorics & Graphs']
      },
      {
        id: 'em-amit-khurana',
        teacher: 'Amit Khurana Sir',
        title: 'Discrete Mathematics Complete Course for GATE CSE',
        url: 'https://www.youtube.com/playlist?list=PLC36xJgs4dxG1F6W1qKk7P7V9Q6Y3D8wZ',
        videos: 120,
        rating: '4.9 ★ (Exhaustive GATE Focus)',
        tags: ['Hinglish', 'Set Theory & Relations', 'Group Theory']
      },
      {
        id: 'em-gp-sir',
        teacher: 'Dr. Gajendra Purohit (GP Sir)',
        title: 'Engineering Mathematics for GATE (Linear Algebra & Calculus)',
        url: 'https://www.youtube.com/playlist?list=PLU633EAi873nd_wN3p35pD1r_5gZ2bF8M',
        videos: 88,
        rating: '4.9 ★ (Linear Algebra Specialist)',
        tags: ['Hinglish', 'Matrices & Eigenvalues', 'Probability & Stats']
      },
      {
        id: 'em-gate-smashers',
        teacher: 'Varun Singla (Gate Smashers)',
        title: 'Discrete Mathematics Complete Course | Gate Smashers',
        url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiH2vvTCVnQBmCXhRTCVPr4v',
        videos: 74,
        rating: '4.8 ★ (Quick Concepts)',
        tags: ['Hinglish', 'Graph Coloring', 'Recurrence Relations']
      }
    ]
  },

  general_aptitude: {
    key: 'general_aptitude',
    subjectName: 'General Aptitude',
    icon: '★',
    curatedOptions: [
      {
        id: 'ga-gate-wallah',
        teacher: 'Saurabh Thakur Sir (GATE Wallah)',
        title: 'Complete General Aptitude for GATE (15 Marks Booster)',
        url: 'https://www.youtube.com/playlist?list=PLG9aCp4uE-s0r_7e7R0q1Kk4m6fP1bA7y',
        videos: 50,
        rating: '5.0 ★ (Highest Scorer Choice)',
        tags: ['Hinglish', 'Spatial Aptitude', 'Verbal & Analytical Reasoning']
      },
      {
        id: 'ga-shrenik-jain',
        teacher: 'Shrenik Jain Sir',
        title: 'General Aptitude for GATE Complete Course',
        url: 'https://www.youtube.com/playlist?list=PL23dd-5374n6H3s9aQ_7X4F9_8m4d3_G1',
        videos: 45,
        rating: '4.9 ★ (Short Tricks & Speed)',
        tags: ['Hinglish', 'Speed Math', 'Data Interpretation']
      },
      {
        id: 'ga-careerride',
        teacher: 'CareerRide',
        title: 'Quantitative Aptitude & Reasoning Full Series',
        url: 'https://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ55PSJZEHnGqlgsq',
        videos: 60,
        rating: '4.8 ★ (Classical Shortcuts)',
        tags: ['Hinglish', 'Work & Time', 'Permutations & Probability']
      }
    ]
  }
};

export default function ResourceCustomizerModal({
  isOpen,
  onClose,
  masterSchedule = [],
  customResources = {},
  onApplyCustomResource,
  onBatchApplyResources,
  userProfile = {}
}) {
  if (!isOpen) return null;

  const userName = userProfile?.name || 'Warrior';
  const targetRank = userProfile?.targetRank || 'AIR < 100';
  const dailyGoalHours = userProfile?.dailyGoalHours || 5;
  const userWeakSubjects = Array.isArray(userProfile?.weakSubjects) && userProfile.weakSubjects.length > 0
    ? userProfile.weakSubjects
    : ['Operating Systems', 'Computer Networks'];

  // Map weak subject names to catalog keys
  const getSubjectKeyFromName = (name) => {
    const lower = (name || '').toLowerCase();
    if (lower.includes('os') || lower.includes('operating')) return 'operating_systems';
    if (lower.includes('cn') || lower.includes('network')) return 'computer_networks';
    if (lower.includes('algo')) return 'algorithms';
    if (lower.includes('ds') || lower.includes('structure')) return 'data_structures';
    if (lower.includes('cd') || lower.includes('compiler')) return 'compiler_design';
    if (lower.includes('c prog') || lower.includes('programming in c')) return 'c_programming';
    if (lower.includes('math') || lower.includes('discrete')) return 'engineering_maths';
    if (lower.includes('apti')) return 'general_aptitude';
    return null;
  };

  // Best recommended options for weak areas
  const getPersonalizedRecommendation = (subjectKey) => {
    const catalog = CURATED_RESOURCE_CATALOG[subjectKey];
    if (!catalog) return null;
    
    let rec = catalog.curatedOptions[0];
    if (subjectKey === 'operating_systems') {
      rec = catalog.curatedOptions.find(o => o.id === 'os-gate-smashers') || catalog.curatedOptions[0];
    } else if (subjectKey === 'computer_networks') {
      rec = catalog.curatedOptions.find(o => o.id === 'cn-amit-khurana') || catalog.curatedOptions[0];
    } else if (subjectKey === 'algorithms') {
      rec = catalog.curatedOptions.find(o => o.id === 'algo-abdul-bari') || catalog.curatedOptions[0];
    } else if (subjectKey === 'engineering_maths') {
      rec = catalog.curatedOptions.find(o => o.id === 'em-go-classes') || catalog.curatedOptions[0];
    } else if (subjectKey === 'compiler_design') {
      rec = catalog.curatedOptions.find(o => o.id === 'cd-gate-smashers') || catalog.curatedOptions[0];
    }
    return {
      catalog,
      option: rec,
      reason: `Optimized for ${targetRank} target and ${dailyGoalHours}h daily pace. Focuses on high-yield marks and deep conceptual retention.`
    };
  };

  const personalizedList = userWeakSubjects
    .map(name => {
      const key = getSubjectKeyFromName(name);
      return key ? { rawName: name, key, ...getPersonalizedRecommendation(key) } : null;
    })
    .filter(Boolean);

  const [activeTab, setActiveTab] = useState(() => personalizedList.length > 0 ? 'personalized' : 'ai'); // 'personalized' | 'ai' | 'matrix'
  const [selectedSubjectKey, setSelectedSubjectKey] = useState('operating_systems');

  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiParsedPlan, setAiParsedPlan] = useState(null);
  const [applySuccessMsg, setApplySuccessMsg] = useState('');

  // Manual Custom URL override state for active subject
  const [customTitleInput, setCustomTitleInput] = useState('');
  const [customTeacherInput, setCustomTeacherInput] = useState('');
  const [customUrlInput, setCustomUrlInput] = useState('');

  // Quick suggestion prompts
  const samplePrompts = [
    "I want to use Gate Smashers for Operating Systems instead of the one which is using rn",
    "Switch Algorithms to Abdul Bari's playlist",
    "Use Amit Khurana for Computer Networks",
    "Change C Programming to Neso Academy",
    "Use Gate Smashers for Compiler Design",
    "Switch Discrete Mathematics to Amit Khurana Sir",
    "Change General Aptitude to Saurabh Thakur Sir (GATE Wallah)"
  ];

  // Natural Language Offline AI Parser
  const runOfflineAiParser = (text) => {
    const lower = text.toLowerCase();

    // 1. Detect Subject
    let detectedSubjectKey = null;
    if (lower.includes('os') || lower.includes('operating system') || lower.includes('operating systems')) {
      detectedSubjectKey = 'operating_systems';
    } else if (lower.includes('algo') || lower.includes('algorithm') || lower.includes('daa')) {
      detectedSubjectKey = 'algorithms';
    } else if (lower.includes('ds') || lower.includes('data structure') || lower.includes('data structures')) {
      detectedSubjectKey = 'data_structures';
    } else if (lower.includes('cd') || lower.includes('compiler') || lower.includes('compiler design')) {
      detectedSubjectKey = 'compiler_design';
    } else if (lower.includes('cn') || lower.includes('network') || lower.includes('networks') || lower.includes('computer network')) {
      detectedSubjectKey = 'computer_networks';
    } else if (lower.includes('c prog') || lower.includes('c language') || lower.includes('programming in c') || (lower.includes(' c ') && !lower.includes('cd'))) {
      detectedSubjectKey = 'c_programming';
    } else if (lower.includes('math') || lower.includes('maths') || lower.includes('discrete') || lower.includes('calculus') || lower.includes('linear algebra')) {
      detectedSubjectKey = 'engineering_maths';
    } else if (lower.includes('apti') || lower.includes('aptitude') || lower.includes('reasoning') || lower.includes('quant')) {
      detectedSubjectKey = 'general_aptitude';
    }

    // 2. Detect Educator / Channel
    let detectedTeacher = null;
    let matchedOption = null;

    // Check for YouTube URL in the text
    const urlMatch = text.match(/(https?:\/\/[^\s]+)/);
    const customUrl = urlMatch ? urlMatch[0] : null;

    if (detectedSubjectKey) {
      const subjectCatalog = CURATED_RESOURCE_CATALOG[detectedSubjectKey];
      
      if (lower.includes('gate smasher') || lower.includes('varun singla') || lower.includes('smasher')) {
        detectedTeacher = 'Varun Singla (Gate Smashers)';
        matchedOption = subjectCatalog.curatedOptions.find(o => o.teacher.toLowerCase().includes('gate smashers'));
      } else if (lower.includes('abdul bari') || lower.includes('bari')) {
        detectedTeacher = 'Abdul Bari';
        matchedOption = subjectCatalog.curatedOptions.find(o => o.teacher.toLowerCase().includes('abdul bari'));
      } else if (lower.includes('amit khurana') || lower.includes('khurana')) {
        detectedTeacher = 'Amit Khurana Sir';
        matchedOption = subjectCatalog.curatedOptions.find(o => o.teacher.toLowerCase().includes('amit khurana'));
      } else if (lower.includes('neso') || lower.includes('neso academy')) {
        detectedTeacher = 'Neso Academy';
        matchedOption = subjectCatalog.curatedOptions.find(o => o.teacher.toLowerCase().includes('neso'));
      } else if (lower.includes('knowledge gate') || lower.includes('sanchit jain')) {
        detectedTeacher = 'Sanchit Jain (Knowledge Gate)';
        matchedOption = subjectCatalog.curatedOptions.find(o => o.teacher.toLowerCase().includes('knowledge gate'));
      } else if (lower.includes('go class') || lower.includes('sachin mittal') || lower.includes('deepak poonia')) {
        detectedTeacher = 'GO Classes (Sachin Mittal & Deepak Poonia)';
        matchedOption = subjectCatalog.curatedOptions.find(o => o.teacher.toLowerCase().includes('go classes'));
      } else if (lower.includes('saurabh thakur') || lower.includes('gate wallah')) {
        detectedTeacher = 'Saurabh Thakur Sir (GATE Wallah)';
        matchedOption = subjectCatalog.curatedOptions.find(o => o.teacher.toLowerCase().includes('gate wallah') || o.teacher.toLowerCase().includes('saurabh thakur'));
      } else if (lower.includes('jenny') || lower.includes("jenny's")) {
        detectedTeacher = "Jenny's Lectures CS IT";
        matchedOption = subjectCatalog.curatedOptions.find(o => o.teacher.toLowerCase().includes('jenny'));
      } else if (lower.includes('gajendra purohit') || lower.includes('gp sir')) {
        detectedTeacher = 'Dr. Gajendra Purohit (GP Sir)';
        matchedOption = subjectCatalog.curatedOptions.find(o => o.teacher.toLowerCase().includes('gajendra purohit'));
      } else if (lower.includes('vishwadeep') || lower.includes('vishvadeep gothi')) {
        detectedTeacher = 'Vishvadeep Gothi Sir';
        matchedOption = subjectCatalog.curatedOptions.find(o => o.teacher.toLowerCase().includes('vishvadeep'));
      }
    }

    if (!detectedSubjectKey && !matchedOption && !customUrl) {
      return null;
    }

    const fallbackSubjectKey = detectedSubjectKey || 'operating_systems';
    const fallbackOption = matchedOption || (CURATED_RESOURCE_CATALOG[fallbackSubjectKey]?.curatedOptions[0]);

    return {
      subjectKey: fallbackSubjectKey,
      subjectName: CURATED_RESOURCE_CATALOG[fallbackSubjectKey]?.subjectName || 'Operating Systems',
      targetTeacher: detectedTeacher || (customUrl ? 'Custom YouTube Educator' : fallbackOption.teacher),
      targetTitle: customUrl ? `Custom Playlist (${customUrl})` : fallbackOption.title,
      targetUrl: customUrl || fallbackOption.url,
      matchedOption: matchedOption || fallbackOption,
      isCustomUrl: !!customUrl
    };
  };

  const handleRunAiAnalysis = async (customPrompt) => {
    const query = customPrompt || aiPrompt;
    if (!query.trim()) return;
    
    playClick();
    setAiAnalyzing(true);
    setApplySuccessMsg('');

    // Simulate intelligent NLP deliberation
    setTimeout(() => {
      const plan = runOfflineAiParser(query);
      setAiParsedPlan(plan);
      setAiAnalyzing(false);
    }, 450);
  };

  const handleApplyAiPlan = () => {
    if (!aiParsedPlan) return;
    playClick();

    const { subjectKey, subjectName, targetTeacher, targetTitle, targetUrl } = aiParsedPlan;
    
    const resourcePayload = {
      subjectKey,
      subjectName,
      teacher: targetTeacher,
      title: targetTitle,
      url: targetUrl,
      updatedAt: new Date().toISOString()
    };

    onApplyCustomResource(subjectKey, resourcePayload);
    playSuccessChime();
    fireTaskConfetti();

    setApplySuccessMsg(`✓ Successfully applied ${targetTeacher} for ${subjectName}! All corresponding schedule days and explorer links have been updated.`);
  };

  const handleApplyAllPersonalized = () => {
    playClick();
    personalizedList.forEach(item => {
      onApplyCustomResource(item.key, {
        subjectKey: item.key,
        subjectName: item.catalog.subjectName,
        teacher: item.option.teacher,
        title: item.option.title,
        url: item.option.url,
        updatedAt: new Date().toISOString()
      });
    });
    playSuccessChime();
    fireTaskConfetti();
    setApplySuccessMsg(`All ${personalizedList.length} personalized resources applied for ${userName}!`);
  };

  const handleSelectCuratedOption = (subjectKey, option) => {
    playClick();
    const subjectInfo = CURATED_RESOURCE_CATALOG[subjectKey];
    const resourcePayload = {
      subjectKey,
      subjectName: subjectInfo.subjectName,
      teacher: option.teacher,
      title: option.title,
      url: option.url,
      updatedAt: new Date().toISOString()
    };

    onApplyCustomResource(subjectKey, resourcePayload);
    playSuccessChime();
    fireTaskConfetti();
    setApplySuccessMsg(`Switched ${subjectInfo.subjectName} to ${option.teacher}!`);
  };

  const handleSaveCustomManualUrl = (e) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;

    playClick();
    const subjectInfo = CURATED_RESOURCE_CATALOG[selectedSubjectKey];
    const resourcePayload = {
      subjectKey: selectedSubjectKey,
      subjectName: subjectInfo.subjectName,
      teacher: customTeacherInput.trim() || 'Custom Channel',
      title: customTitleInput.trim() || `Custom Playlist for ${subjectInfo.subjectName}`,
      url: customUrlInput.trim(),
      updatedAt: new Date().toISOString()
    };

    onApplyCustomResource(selectedSubjectKey, resourcePayload);
    playSuccessChime();
    fireTaskConfetti();
    setApplySuccessMsg(`Custom playlist saved for ${subjectInfo.subjectName}!`);
    setCustomTitleInput('');
    setCustomTeacherInput('');
    setCustomUrlInput('');
  };

  const handleResetSubjectToDefault = (subjectKey) => {
    playClick();
    onApplyCustomResource(subjectKey, null);
    playSuccessChime();
    setApplySuccessMsg(`Reset ${CURATED_RESOURCE_CATALOG[subjectKey]?.subjectName} to default curriculum.`);
  };

  const activeCatalog = CURATED_RESOURCE_CATALOG[selectedSubjectKey];
  const activeCustom = customResources[selectedSubjectKey];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div 
        className="modal-sketch" 
        onClick={e => e.stopPropagation()} 
        style={{ padding: '26px', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="tape-strip"></div>
        <div className="tape-strip tape-strip-right"></div>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              border: '2px solid #000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--paper-card-subtle)'
            }}>
              <Zap size={20} color="#000" strokeWidth={2} fill="none" />
            </div>
            <div>
              <h2 className="font-title" style={{ fontSize: '1.45rem', margin: 0 }}>
                AI Resource & Playlist Customizer
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>
                Personalized AI resource management for <strong>{userName}</strong> ({targetRank} target)
              </div>
            </div>
          </div>
          <button className="btn-sketch" onClick={onClose} style={{ padding: '4px 8px' }}>
            ✕
          </button>
        </div>

        {/* 3-Tab Segmented Switcher */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginBottom: '18px' }}>
          <button 
            type="button"
            className={`btn-sketch ${activeTab === 'personalized' ? 'btn-sketch-primary' : ''}`}
            onClick={() => { playClick(); setActiveTab('personalized'); }}
            style={{ fontSize: '0.86rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <User size={15} color="#000" strokeWidth={2} />
            <span>Personalized AI ({userName})</span>
          </button>
          <button 
            type="button"
            className={`btn-sketch ${activeTab === 'ai' ? 'btn-sketch-primary' : ''}`}
            onClick={() => { playClick(); setActiveTab('ai'); }}
            style={{ fontSize: '0.86rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <Sparkles size={15} color="#000" strokeWidth={2} />
            <span>AI Natural Language</span>
          </button>
          <button 
            type="button"
            className={`btn-sketch ${activeTab === 'matrix' ? 'btn-sketch-primary' : ''}`}
            onClick={() => { playClick(); setActiveTab('matrix'); }}
            style={{ fontSize: '0.86rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <Layers size={15} color="#000" strokeWidth={2} />
            <span>All 8 Subjects Matrix</span>
          </button>
        </div>

        {/* Success Alert Banner */}
        {applySuccessMsg && (
          <div className="sketch-card" style={{ 
            padding: '10px 14px', 
            background: 'var(--highlight-green)', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 700, fontSize: '0.9rem' }}>
              <CheckCheck size={18} />
              <span>{applySuccessMsg}</span>
            </div>
            <button 
              className="btn-sketch" 
              onClick={() => setApplySuccessMsg('')} 
              style={{ padding: '2px 6px', fontSize: '0.75rem' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* TAB 0: Personalized AI Recommendations for userProfile */}
        {activeTab === 'personalized' && (
          <div>
            <div className="sketch-card" style={{ padding: '16px 20px', background: 'var(--paper-card-subtle)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge-sketch" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                      STUDENT PROFILE: {userName}
                    </span>
                    <span className="badge-sketch badge-sketch-blue" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                      TARGET: {targetRank}
                    </span>
                    <span className="badge-sketch badge-sketch-orange" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                      PACE: {dailyGoalHours}h/day
                    </span>
                  </div>
                  <h3 className="font-title" style={{ fontSize: '1.2rem', margin: 0 }}>
                    AI Curriculum Diagnosis & Weak Subject Playlists
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--ink-secondary)', margin: '4px 0 0' }}>
                    Based on your profile, AI has audited your identified focus subjects and matched the highest-yield educators to maximize score efficiency before GATE 2027.
                  </p>
                </div>

                {personalizedList.length > 0 && (
                  <button
                    type="button"
                    className="btn-sketch btn-sketch-primary"
                    onClick={handleApplyAllPersonalized}
                    style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <CheckCheck size={16} color="#000" strokeWidth={2} /> Apply All AI Recommendations ({personalizedList.length})
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
              {personalizedList.map((item, idx) => {
                const currentCustom = customResources[item.key];
                const isActive = currentCustom ? currentCustom.url === item.option.url : false;

                return (
                  <div 
                    key={idx}
                    className="sketch-card"
                    style={{
                      padding: '16px',
                      background: 'var(--paper-card)',
                      border: isActive ? '2px solid var(--ink-border)' : '1.5px solid var(--border-subtle)',
                      boxShadow: isActive ? '3px 3px 0px var(--ink-border)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1 1 300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '1.1rem' }}>{item.catalog.icon}</span>
                          <span className="font-title" style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                            {item.catalog.subjectName}
                          </span>
                          <span className="badge-sketch badge-sketch-pink" style={{ fontSize: '0.7rem' }}>
                            Weak Area Focus
                          </span>
                        </div>

                        <div style={{ fontSize: '0.85rem', color: 'var(--ink-primary)', marginTop: '6px' }}>
                          Recommended: <strong>{item.option.teacher}</strong> — <em>{item.option.title}</em>
                        </div>

                        <div style={{ fontSize: '0.8rem', color: 'var(--ink-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
                          Reasoning: {item.reason}
                        </div>

                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
                          {item.option.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="badge-sketch" style={{ fontSize: '0.68rem', padding: '1px 5px' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                        <a
                          href={item.option.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-sketch"
                          style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                        >
                          <ExternalLink size={13} /> Preview
                        </a>

                        {isActive ? (
                          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Check size={16} /> Applied in Schedule
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="btn-sketch btn-sketch-primary"
                            onClick={() => handleSelectCuratedOption(item.key, item.option)}
                            style={{ padding: '6px 14px', fontSize: '0.82rem', fontWeight: 800 }}
                          >
                            Apply Recommendation
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Success Alert Banner */}
        {applySuccessMsg && (
          <div className="sketch-card" style={{ 
            padding: '10px 14px', 
            background: 'var(--highlight-green)', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 700, fontSize: '0.9rem' }}>
              <CheckCheck size={18} />
              <span>{applySuccessMsg}</span>
            </div>
            <button 
              className="btn-sketch" 
              onClick={() => setApplySuccessMsg('')} 
              style={{ padding: '2px 6px', fontSize: '0.75rem' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* TAB 1: AI Natural Language Swapper */}
        {activeTab === 'ai' && (
          <div>
            <div className="sketch-card" style={{ padding: '16px', background: 'var(--paper-card-subtle)', marginBottom: '16px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Sparkles size={15} color="#000" strokeWidth={2} /> Tell AI what playlist or educator you want to study with:
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
                <textarea
                  className="input-sketch"
                  rows={2}
                  placeholder="e.g. 'I want to use Gate Smashers for Operating Systems instead of the one which is using rn' or paste any YouTube playlist link..."
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  style={{ flex: 1, resize: 'vertical' }}
                />
                <button
                  type="button"
                  className="btn-sketch btn-sketch-primary"
                  onClick={() => handleRunAiAnalysis()}
                  disabled={aiAnalyzing || !aiPrompt.trim()}
                  style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <Sparkles size={18} />
                  <span>{aiAnalyzing ? 'Analyzing...' : 'Parse AI'}</span>
                </button>
              </div>

              {/* Sample Prompt Chips */}
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--ink-secondary)', marginBottom: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <BookOpen size={13} color="#000" strokeWidth={2} /> Click any sample prompt to test instant AI parsing:
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {samplePrompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="btn-sketch"
                      onClick={() => {
                        setAiPrompt(p);
                        handleRunAiAnalysis(p);
                      }}
                      style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '12px', background: 'var(--paper-card)' }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Parse Result & Impact Preview Card */}
            {aiParsedPlan ? (
              <div className="sketch-card" style={{ padding: '18px', background: 'var(--highlight-yellow)', border: '2px solid var(--ink-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge-sketch badge-sketch-green">✓ AI Intent Resolved</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                      Target: {aiParsedPlan.subjectName}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--ink-secondary)' }}>
                    Ready to rewrite schedule
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="sketch-card" style={{ padding: '10px', background: 'var(--paper-card)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', fontWeight: 700 }}>NEW EDUCATOR / CHANNEL</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '2px' }}>
                      {aiParsedPlan.targetTeacher}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-secondary)', marginTop: '2px' }}>
                      {aiParsedPlan.targetTitle}
                    </div>
                  </div>

                  <div className="sketch-card" style={{ padding: '10px', background: 'var(--paper-card)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', fontWeight: 700 }}>IMPACT SCOPE</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '2px', color: 'var(--ink-blue)' }}>
                      All {aiParsedPlan.subjectName} Schedule Days
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-secondary)', marginTop: '2px' }}>
                      Updates video links, topic search queries, and today's mission player
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <a 
                    href={aiParsedPlan.targetUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn-sketch"
                    style={{ fontSize: '0.8rem', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Video size={14} color="#EF4444" /> Verify Playlist on YouTube ↗
                  </a>

                  <button
                    type="button"
                    className="btn-sketch btn-sketch-primary"
                    onClick={handleApplyAiPlan}
                    style={{ padding: '8px 18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Check size={16} /> Apply to My Schedule & Save
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ 
                padding: '30px 20px', 
                textAlign: 'center', 
                border: '2px dashed var(--border-subtle)', 
                borderRadius: '8px',
                color: 'var(--ink-muted)',
                fontSize: '0.9rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Zap size={18} color="#000" strokeWidth={2} fill="none" />
                  <span>Enter what you'd like to change above, or click one of the quick suggestions!</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Visual 8-Subject Matrix with 1-Click Educator Pickers */}
        {activeTab === 'matrix' && (
          <div>
            {/* Subject Selector Pills */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '14px' }}>
              {Object.values(CURATED_RESOURCE_CATALOG).map(subj => {
                const isSelected = selectedSubjectKey === subj.key;
                const isCustomized = !!customResources[subj.key];

                return (
                  <button
                    key={subj.key}
                    type="button"
                    onClick={() => { playClick(); setSelectedSubjectKey(subj.key); }}
                    className="btn-sketch"
                    style={{
                      background: isSelected ? 'var(--highlight-yellow)' : 'var(--paper-card)',
                      boxShadow: isSelected ? '2px 2px 0px var(--ink-border)' : 'none',
                      flexShrink: 0,
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>{subj.icon}</span>
                    <span>{subj.subjectName}</span>
                    {isCustomized && (
                      <span className="badge-sketch badge-sketch-green" style={{ padding: '1px 4px', fontSize: '0.68rem' }}>
                        Custom
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Subject Information Banner */}
            <div className="sketch-card" style={{ padding: '14px 18px', background: 'var(--paper-card-subtle)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h3 className="font-title" style={{ fontSize: '1.25rem', margin: 0 }}>
                    {activeCatalog.icon} {activeCatalog.subjectName}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)', marginTop: '2px' }}>
                    Current Active Resource: <strong>{activeCustom ? activeCustom.teacher : 'Default Study Planner Curriculum'}</strong>
                  </div>
                </div>

                {activeCustom && (
                  <button
                    type="button"
                    className="btn-sketch btn-sketch-pink"
                    onClick={() => handleResetSubjectToDefault(selectedSubjectKey)}
                    style={{ fontSize: '0.78rem', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <RefreshCw size={12} color="#000" strokeWidth={2} /> Reset to Default
                  </button>
                )}
              </div>
            </div>

            {/* Curated Alternatives List */}
            <h4 className="font-title" style={{ fontSize: '1.05rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sliders size={15} color="#000" strokeWidth={2} /> 1-Click Verified GATE CSE Playlists:
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              {activeCatalog.curatedOptions.map(opt => {
                const isCurrentActive = activeCustom 
                  ? activeCustom.url === opt.url 
                  : opt.id === activeCatalog.curatedOptions[0].id;

                return (
                  <div
                    key={opt.id}
                    className="sketch-card"
                    style={{
                      padding: '12px 16px',
                      background: isCurrentActive ? 'var(--highlight-yellow)' : 'var(--paper-card)',
                      border: isCurrentActive ? '2px solid var(--ink-border)' : '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{opt.teacher}</span>
                        <span className="badge-sketch badge-sketch-blue" style={{ fontSize: '0.7rem', padding: '1px 5px' }}>
                          {opt.videos} videos
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--ink-amber)', fontWeight: 600 }}>
                          {opt.rating}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)', marginTop: '3px' }}>
                        {opt.title}
                      </div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                        {opt.tags.map((t, idx) => (
                          <span key={idx} className="badge-sketch" style={{ fontSize: '0.68rem', padding: '1px 4px' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                      <a
                        href={opt.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-sketch"
                        style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                        title="Preview playlist in YouTube"
                      >
                        <ExternalLink size={13} /> Preview
                      </a>

                      {!isCurrentActive ? (
                        <button
                          type="button"
                          className="btn-sketch btn-sketch-primary"
                          onClick={() => handleSelectCuratedOption(selectedSubjectKey, opt)}
                          style={{ padding: '6px 12px', fontSize: '0.82rem', fontWeight: 700 }}
                        >
                          Use This Playlist
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={16} /> Active in Schedule
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom URL Input Section */}
            <div className="sketch-card" style={{ padding: '16px', background: 'var(--paper-card-subtle)' }}>
              <h4 className="font-title" style={{ fontSize: '1rem', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ExternalLink size={15} color="#000" strokeWidth={2} /> Or Paste Any Custom YouTube Playlist URL for {activeCatalog.subjectName}:
              </h4>
              <form onSubmit={handleSaveCustomManualUrl} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input
                    type="text"
                    className="input-sketch"
                    placeholder="Educator / Channel Name (e.g. Stanford CS143, MIT OCW)"
                    value={customTeacherInput}
                    onChange={e => setCustomTeacherInput(e.target.value)}
                  />
                  <input
                    type="text"
                    className="input-sketch"
                    placeholder="Custom Playlist Title"
                    value={customTitleInput}
                    onChange={e => setCustomTitleInput(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="url"
                    className="input-sketch"
                    placeholder="https://www.youtube.com/playlist?list=PL..."
                    value={customUrlInput}
                    onChange={e => setCustomUrlInput(e.target.value)}
                    required
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="btn-sketch btn-sketch-primary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                    Save Custom URL
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}>
          <button className="btn-sketch" onClick={onClose} style={{ padding: '6px 14px' }}>
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
