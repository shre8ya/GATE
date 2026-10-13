import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  Key 
} from 'lucide-react';
import { playClick } from '../utils/audio';

export default function AiMentorView({ 
  currentDate, 
  masterSchedule, 
  geminiApiKey, 
  onOpenSettings 
}) {
  const currentItem = masterSchedule.find(m => m.date === currentDate) || masterSchedule[0];

  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Hello! I am your personal **GATE CSE 2027 AI Mentor**.\n\nToday is **${currentItem.day}, ${currentDate}**.\nYour mission is **${currentItem.subject}: ${currentItem.mainFocus}** + **Maths: ${currentItem.mathsLecture}**.\n\nHow can I help you right now? You can ask me to:\n1. **Explain any concept** with intuitive proofs and GATE trap-cases\n2. **Give progressive hints for a PYQ** without spoiling the final answer\n3. **Quiz you with 3 rapid questions** on today's lecture\n4. **Solve your doubt or debug C code**`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    `Quiz me on ${currentItem.subject}`,
    `Explain today's Maths: ${currentItem.mathsLecture.split(':')[1] || currentItem.mathsLecture}`,
    `What are the most common GATE traps in ${currentItem.subject}?`,
    `How to balance IPU 5th Sem and GATE CSE?`
  ];

  const generateOfflineResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes('quiz') || q.includes('test me')) {
      return `### 🎯 Quick 3-Question Rapid Quiz on ${currentItem.subject}\n\n` +
        `**Question 1 (Concept Check):**\n` +
        `In C programming, what is the output of:\n` +
        `\`\`\`c\n` +
        `int a = 5;\n` +
        `printf("%d %d %d", a++, ++a, a);\n` +
        `\`\`\`\n` +
        `*Hint: Is the order of evaluation of function arguments specified in the C standard? (Think about Undefined Behavior vs Sequence Points!)*\n\n` +
        `**Question 2 (Propositional Logic):**\n` +
        `Is the formula $(P \\rightarrow Q) \\rightarrow (\\neg P \\rightarrow \\neg Q)$ a tautology, contradiction, or contingency?\n\n` +
        `**Question 3 (GATE Trap):**\n` +
        `Does $(A \\rightarrow B)$ logically entail $(B \\rightarrow A)$? What is the relation between a conditional and its converse?\n\n` +
        `*Reply with your answers and I will evaluate your reasoning!*`;
    }

    if (q.includes('balance') || q.includes('ipu') || q.includes('college') || q.includes('time')) {
      return `### ⏱️ Strategic Balance: IPU 5th Sem + GATE CSE 2027\n\n` +
        `1. **The 4-Subject Overlap Advantage:**\n` +
        `   Your 5th sem papers are **DAA (CIC-311)**, **Compiler Design (CIC-303)**, **Operating Systems (CIC-305)**, and **Computer Networks (CIC-307)**. These 4 subjects account for **~35-40 marks in GATE**!\n\n` +
        `2. **Daily 2.5-Hour Minimum Rule:**\n` +
        `   - 15 min Aptitude warmup (keeps mind sharp)\n` +
        `   - 30 min Engineering Maths (non-negotiable daily continuity)\n` +
        `   - 60-90 min Core subject block (prepares you for BOTH GATE & IPU end-term university exams)\n\n` +
        `3. **Practical Exams (Nov 26 - Dec 6):**\n` +
        `   We intentionally drop the daily study target to **2.5 hours/day** so you can finish lab files and vivas without feeling burnt out.\n\n` +
        `4. **Theory Exams (Dec 11 - Dec 31):**\n` +
        `   Follow the **IPU Exam Sync tab** in this app — every exam day has a morning formula refresh and post-exam rest block!`;
    }

    if (q.includes('maths') || q.includes('discrete') || q.includes('logic')) {
      return `### 📐 Engineering Mathematics: Logic & Connectives Deep Dive\n\n` +
        `1. **Implication $P \\rightarrow Q$ Truth Table:**\n` +
        `   - $P \\rightarrow Q$ is FALSE **only** when $P$ is True and $Q$ is False.\n` +
        `   - If $P$ is False, $P \\rightarrow Q$ is **vacuously True** (e.g. $F \\rightarrow F = T$, $F \\rightarrow T = T$).\n\n` +
        `2. **Equivalences to Memorize:**\n` +
        `   - $P \\rightarrow Q \\equiv \\neg P \\lor Q$\n` +
        `   - Contrapositive: $P \\rightarrow Q \\equiv \\neg Q \\rightarrow \\neg P$ *(Always logically equivalent!)*\n` +
        `   - Converse: $Q \\rightarrow P$ *(NOT equivalent to original)*\n` +
        `   - Inverse: $\\neg P \\rightarrow \\neg Q$ *(Equivalent to converse, NOT original)*\n\n` +
        `3. **Functional Completeness:**\n` +
        `   - $\\{ \\text{NAND} \\}$ and $\\{ \\text{NOR} \\}$ are minimal functionally complete sets of size 1.\n` +
        `   - $\\{ \\neg, \\land \\}$ and $\\{ \\neg, \\lor \\}$ and $\\{ \\neg, \\rightarrow \\}$ are functionally complete!`;
    }

    return `### 🧠 GATE Analysis & Guidance\n\n` +
      `Regarding **"${query}"**:\n\n` +
      `In GATE CSE, standard questions test three key dimensions:\n` +
      `1. **Formal Definition & Boundary Conditions:** Don't just learn the general case; always check empty sets, single node graphs, zero elements, or null pointers.\n` +
      `2. **Time and Space Asymptotics:** Always distinguish between worst-case, average-case, and best-case bounds.\n` +
      `3. **Negative Marking & MSQs:** GATE 2027 by IIT Madras has Multiple Select Questions (MSQs) with zero partial marking. Verify every option independently!\n\n` +
      `*Tip: If you'd like full generative AI explanations powered by Gemini, you can add your free Gemini API key under Settings!*`;
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    playClick();
    const userMsg = { id: 'user-' + Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    if (geminiApiKey && geminiApiKey.trim()) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey.trim()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `You are an elite GATE CSE Mentor assisting a candidate preparing for GATE 2027 (Organized by IIT Madras). Current focus: ${currentItem.subject} - ${currentItem.mainFocus}. Give concise, top-ranker guidance with clear examples, formulas, and trap warnings.\n\nUser Question: ${text}` }]
              }
            ]
          })
        });

        const data = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || generateOfflineResponse(text);
        setMessages(prev => [...prev, { id: 'ai-' + Date.now(), sender: 'ai', text: replyText }]);
      } catch (err) {
        setMessages(prev => [...prev, { id: 'ai-' + Date.now(), sender: 'ai', text: generateOfflineResponse(text) }]);
      }
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: 'ai-' + Date.now(), sender: 'ai', text: generateOfflineResponse(text) }]);
      }, 400);
    }

    setIsLoading(false);
  };

  const handleCopyMessage = (id, text) => {
    playClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ padding: '0 18px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="sketch-card" style={{ padding: '20px 24px', marginBottom: '20px' }}>
        <div className="tape-strip"></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.8rem' }}>🤖</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 className="font-title" style={{ fontSize: '1.6rem', margin: 0 }}>
                  GATE CSE AI Mentor & Doubt Solver
                </h1>
                <span className="badge-sketch badge-sketch-yellow">
                  {geminiApiKey ? 'Gemini 1.5 Live' : 'Built-in Engine'}
                </span>
              </div>
              <p style={{ color: 'var(--ink-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
                Context-aware companion trained on your 12-week schedule, formulas, and IIT Madras syllabus.
              </p>
            </div>
          </div>

          {!geminiApiKey && (
            <button 
              className="btn-sketch"
              onClick={onOpenSettings}
              style={{ fontSize: '0.85rem' }}
            >
              <Key size={14} /> Add Gemini Key (Optional)
            </button>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div className="sketch-card" style={{ 
        height: '620px', 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden' 
      }}>
        
        {/* Messages Stream */}
        <div style={{ 
          flex: 1, 
          padding: '20px', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px' 
        }}>
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div 
                key={msg.id}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  alignSelf: isUser ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  marginBottom: '4px',
                  fontSize: '0.8rem',
                  color: 'var(--ink-muted)'
                }}>
                  {isUser ? '✏️ You' : '🤖 GATE AI Mentor'}
                </div>

                <div className="sketch-card" style={{ 
                  background: isUser ? 'var(--highlight-yellow)' : 'var(--paper-card)',
                  borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  padding: '14px 18px',
                  color: 'var(--ink-primary)',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  position: 'relative'
                }}>
                  {msg.text}

                  {!isUser && (
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      style={{ 
                        position: 'absolute', 
                        top: '8px', 
                        right: '8px', 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--ink-muted)', 
                        cursor: 'pointer' 
                      }}
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check size={14} color="#15803D" /> : <Copy size={14} />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="sketch-card" style={{ alignSelf: 'flex-start', padding: '10px 16px', background: 'var(--highlight-blue)', fontSize: '0.9rem' }}>
              Thinking and formulating GATE solution...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div style={{ 
          padding: '10px 16px', 
          borderTop: '2px dashed var(--ink-border)', 
          background: 'var(--paper-card-subtle)',
          display: 'flex', 
          gap: '8px', 
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              className="btn-sketch"
              onClick={() => handleSendMessage(prompt)}
              style={{ fontSize: '0.8rem', padding: '4px 10px', whiteSpace: 'nowrap' }}
            >
              <Sparkles size={12} color="#7C3AED" /> {prompt}
            </button>
          ))}
        </div>

        {/* Input Box */}
        <div style={{ 
          padding: '14px 18px', 
          borderTop: '2px solid var(--ink-border)', 
          background: 'var(--paper-card)',
          display: 'flex', 
          gap: '10px',
          alignItems: 'center'
        }}>
          <input 
            type="text" 
            className="input-sketch" 
            placeholder="Ask a doubt, paste code, request PYQ hints, or ask for strategy..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
          />
          <button 
            className="btn-sketch btn-sketch-primary"
            onClick={() => handleSendMessage()}
            style={{ padding: '10px 18px' }}
          >
            <Send size={16} />
          </button>
        </div>

      </div>

    </div>
  );
}
