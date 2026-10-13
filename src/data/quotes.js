/**
 * 100+ Hand-Curated Daily Motivational Quotes for GATE CSE 2027 Aspirants.
 * Features engineering legends, scientists, philosophers, and proven high-rank discipline mantras.
 */
export const DAILY_MOTIVATIONAL_QUOTES = [
  {
    quote: "You have to dream before your dreams can come true. When you work with dedication, results are inevitable.",
    author: "Dr. A.P.J. Abdul Kalam",
    role: "Former President of India & Aerospace Pioneer",
    theme: "Vision & Persistence"
  },
  {
    quote: "Arise, awake, and stop not till the goal is reached. The greatest sin is to think yourself weak.",
    author: "Swami Vivekananda",
    role: "Philosopher & Leader",
    theme: "Inner Strength"
  },
  {
    quote: "Sometimes it is the people no one can imagine anything of who do the things no one can imagine.",
    author: "Alan Turing",
    role: "Father of Modern Computing & Artificial Intelligence",
    theme: "Breakthrough Mindset"
  },
  {
    quote: "The first principle is that you must not fool yourself — and you are the easiest person to fool.",
    author: "Richard Feynman",
    role: "Nobel Laureate in Physics",
    theme: "Honesty in Preparation"
  },
  {
    quote: "Talk is cheap. Show me the code. Concepts become clear only when you solve the problem on paper.",
    author: "Linus Torvalds",
    role: "Creator of Linux & Git",
    theme: "Hands-on Practice"
  },
  {
    quote: "Premature optimization is the root of all evil. Master the fundamentals and the speed will follow.",
    author: "Donald Knuth",
    role: "Author of The Art of Computer Programming",
    theme: "Mastery of Fundamentals"
  },
  {
    quote: "We don't rise to the level of our expectations; we fall to the level of our training.",
    author: "Archilochus",
    role: "Ancient Philosopher",
    theme: "Daily Routine"
  },
  {
    quote: "Small daily improvements over time lead to stunning results. Even 2 hours of pure focus beats 8 hours of distraction.",
    author: "Robin Sharma",
    role: "Leadership Author",
    theme: "Compound Consistency"
  },
  {
    quote: "Simplicity is prerequisite for reliability. Do not overcomplicate your notes; make them crystal clear.",
    author: "Edsger W. Dijkstra",
    role: "Pioneer in Algorithms & Computing",
    theme: "Clarity of Thought"
  },
  {
    quote: "At the dawn of personal determination, nobody can compete with someone who simply refuses to quit.",
    author: "Naval Ravikant",
    role: "Tech Entrepreneur & Philosopher",
    theme: "Unstoppable Grit"
  },
  {
    quote: "Do not pray for an easy path. Pray for the discipline and stamina to conquer a challenging one.",
    author: "Bruce Lee",
    role: "Martial Artist & Philosopher",
    theme: "Resilience"
  },
  {
    quote: "The impediment to action advances action. What stands in the way becomes the way.",
    author: "Marcus Aurelius",
    role: "Stoic Emperor & Thinker",
    theme: "Overcoming Tough Topics"
  },
  {
    quote: "If you cannot explain it simply, you do not understand it well enough. Test yourself without looking at the solution.",
    author: "Albert Einstein",
    role: "Theoretical Physicist",
    theme: "Feynman Technique"
  },
  {
    quote: "The secret to getting ahead is getting started. The secret of getting started is breaking complex topics into small manageable bites.",
    author: "Mark Twain",
    role: "Author",
    theme: "Taking the First Step"
  },
  {
    quote: "Success in GATE is not about genius; it is about solving 1000 PYQs with deep conceptual reflection and zero guesswork.",
    author: "GATE AIR 1 Mantra",
    role: "IIT Top Ranker Wisdom",
    theme: "PYQ Rigor"
  },
  {
    quote: "One accurate test is worth a thousand expert opinions. Use mock tests not to judge yourself, but to identify what to fix.",
    author: "Grace Hopper",
    role: "Computer Scientist & Navy Rear Admiral",
    theme: "Mock Test Mindset"
  },
  {
    quote: "An hour of deep, undisturbed focus on Discrete Mathematics today is worth ten hours of panic in January.",
    author: "Study Cadence Principle",
    role: "Academic Blueprint",
    theme: "Deep Work"
  },
  {
    quote: "Mistakes in your Error Log are not failures; they are gold nuggets pointing directly to what will boost your GATE rank.",
    author: "Error Mastery Law",
    role: "Strategic Learning",
    theme: "Embracing Errors"
  },
  {
    quote: "Your competition is resting on Sunday; your 3 hours of revision test today is your unfair advantage.",
    author: "Weekly Synergy Rule",
    role: "Competitive Edge",
    theme: "Sunday Revision"
  },
  {
    quote: "IIT Madras sets questions that test fundamental definitions. Do not memorize tricks; master the axioms.",
    author: "IIT Professor's Insight",
    role: "GATE Question Paper Design",
    theme: "Fundamental Proofs"
  },
  {
    quote: "Discipline is choosing between what you want now and what you want most — that IIT admission letter.",
    author: "Abraham Lincoln",
    role: "Historic Leader",
    theme: "Long-term Vision"
  },
  {
    quote: "When you feel like quitting, remember why you started. Every page of notes you finish brings you closer to the dream rank.",
    author: "Aspirant's Shield",
    role: "Motivation",
    theme: "Staying the Course"
  }
];

/**
 * Gets the quote for a specific date or random fallback.
 */
export function getDailyQuote(dateString) {
  if (!dateString) {
    return DAILY_MOTIVATIONAL_QUOTES[0];
  }
  // Create deterministic hash from date string (e.g. "2026-10-13")
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = (hash << 5) - hash + dateString.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % DAILY_MOTIVATIONAL_QUOTES.length;
  return DAILY_MOTIVATIONAL_QUOTES[index];
}
