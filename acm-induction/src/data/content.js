// ============================================================
// Code Galaxy — content & data model
// All copy + domain / project / crew data lives here.
// ============================================================

export const COLORS = {
  bg: '#05050f',
  purple: '#7c6ff7',
  teal: '#1dc891',
  blue: '#378add',
  amber: '#f0a500',
  pink: '#d4537e',
  text: '#f0f0ff',
  muted: '#8a8aaa',
};

export const DOMAINS = [
  {
    id: 'web',
    name: 'Web development',
    icon: 'globe',
    color: '#378add',
    emissive: '#185fa5',
    orbitRadius: 3.5,
    orbitSpeed: 0.4,
    orbitPhase: 0,
    tech: ['React', 'Next.js', 'TailwindCSS', 'TypeScript'],
    description: "Build the web's next layer — from pixel-perfect UIs to full-stack apps.",
    openRoles: 8,
  },
  {
    id: 'app',
    name: 'App development',
    icon: 'smartphone',
    color: '#7c6ff7',
    emissive: '#534ab7',
    orbitRadius: 4.8,
    orbitSpeed: 0.28,
    orbitPhase: Math.PI / 3,
    tech: ['Flutter', 'React Native', 'Kotlin', 'Swift'],
    description: 'Ship to the App Store. Build cross-platform experiences people actually use.',
    openRoles: 6,
  },
  {
    id: 'ai',
    name: 'AI / ML',
    icon: 'brain',
    color: '#1dc891',
    emissive: '#0f6e56',
    orbitRadius: 6.2,
    orbitSpeed: 0.2,
    orbitPhase: (2 * Math.PI) / 3,
    tech: ['PyTorch', 'TensorFlow', 'scikit-learn', 'LangChain'],
    description: 'Train models, build pipelines, and put intelligence into products.',
    openRoles: 5,
  },
  {
    id: 'ui',
    name: 'UI / UX design',
    icon: 'palette',
    color: '#d4537e',
    emissive: '#993556',
    orbitRadius: 3.8,
    orbitSpeed: 0.35,
    orbitPhase: Math.PI,
    tech: ['Figma', 'Framer', 'Protopie', 'User research'],
    description: 'Design the experience before a single line of code is written.',
    openRoles: 4,
  },
  {
    id: 'backend',
    name: 'Backend & DevOps',
    icon: 'server',
    color: '#f0a500',
    emissive: '#854f0b',
    orbitRadius: 5.5,
    orbitSpeed: 0.25,
    orbitPhase: (4 * Math.PI) / 3,
    tech: ['Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    description: 'The infrastructure everything else runs on — databases, APIs, pipelines.',
    openRoles: 6,
  },
  {
    id: 'opensource',
    name: 'Open source',
    icon: 'git',
    color: '#8a8aaa',
    emissive: '#5f5e5a',
    orbitRadius: 7.0,
    orbitSpeed: 0.15,
    orbitPhase: (5 * Math.PI) / 3,
    tech: ['GitHub', 'PR reviews', 'OSS contributions', 'Docs'],
    description: 'Contribute to real projects used by thousands. Your name on the commit log.',
    openRoles: 10,
  },
];

export const DOMAIN_COLOR = Object.fromEntries(DOMAINS.map((d) => [d.id, d.color]));

export const PROJECTS = [
  { id: 'giggrad',   name: 'GigGrad',      desc: 'Campus micro-jobs platform',        domain: 'web',     tech: ['Next.js', 'PostgreSQL', 'Razorpay'], color: '#378add' },
  { id: 'clubsync',  name: 'ClubSync',     desc: 'College event management app',       domain: 'app',     tech: ['Flutter', 'Firebase'],               color: '#7c6ff7' },
  { id: 'mediscan',  name: 'MediScan',     desc: 'AI-powered symptom checker',         domain: 'ai',      tech: ['PyTorch', 'FastAPI'],                color: '#1dc891' },
  { id: 'stylebot',  name: 'StyleBot',     desc: 'AI fashion recommendation engine',   domain: 'ai',      tech: ['LangChain', 'Next.js'],              color: '#1dc891' },
  { id: 'pulse',     name: 'Amrita Pulse', desc: 'College news aggregator',            domain: 'web',     tech: ['React', 'Node.js'],                  color: '#378add' },
  { id: 'fintrack',  name: 'FinTrack',     desc: 'Student expense tracker app',        domain: 'app',     tech: ['React Native', 'Supabase'],          color: '#7c6ff7' },
  { id: 'designkit', name: 'DesignKit',    desc: 'Shared UI component library',        domain: 'ui',      tech: ['Storybook', 'Figma tokens'],         color: '#d4537e' },
  { id: 'devops101', name: 'DevOps 101',   desc: 'Beginner DevOps workshop kit',       domain: 'backend', tech: ['Docker', 'GitHub Actions'],          color: '#f0a500' },
];

export const PROJECT_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'web', label: 'Web' },
  { id: 'app', label: 'App' },
  { id: 'ai', label: 'AI' },
  { id: 'ui', label: 'UI' },
  { id: 'backend', label: 'Backend' },
];

export const CREW = [
  { name: 'Aarav Menon',  role: 'President',          specialty: 'React',    bio: 'Building in public since 2023. Ships first, sleeps later.', c1: '#7c6ff7', c2: '#1dc891' },
  { name: 'Diya Nair',    role: 'Tech Lead — Web',    specialty: 'Next.js',  bio: 'Turns Figma into pixel-perfect web in record time.',        c1: '#378add', c2: '#7c6ff7' },
  { name: 'Karan Iyer',   role: 'Tech Lead — AI',     specialty: 'PyTorch',  bio: 'Talks to GPUs more than people. Loves a clean loss curve.', c1: '#1dc891', c2: '#f0a500' },
  { name: 'Meera Pillai', role: 'Design Head',        specialty: 'Figma',    bio: 'Believes whitespace is a feature, not a bug.',              c1: '#d4537e', c2: '#7c6ff7' },
];

export const LEADS = [
  { name: 'Rohan S.',  role: 'App Lead',     color: '#7c6ff7' },
  { name: 'Ananya K.', role: 'Backend Lead', color: '#f0a500' },
  { name: 'Vikram R.', role: 'DevOps',       color: '#378add' },
  { name: 'Sneha M.',  role: 'UI Lead',      color: '#d4537e' },
  { name: 'Aditya N.', role: 'OSS Lead',     color: '#1dc891' },
  { name: 'Priya V.',  role: 'ML Lead',      color: '#1dc891' },
  { name: 'Nikhil J.', role: 'Events',       color: '#f0a500' },
  { name: 'Tara B.',   role: 'Outreach',     color: '#d4537e' },
];

export const BRANCHES = [
  'CSE S1', 'CSE S2', 'CSE-AI S1', 'CSE-AI S2',
  'ECE S1', 'ECE S2', 'EEE S1', 'Mechanical S1', 'Other',
];

export const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'domains', label: 'Domains' },
  { id: 'projects', label: 'Projects' },
  { id: 'team', label: 'Team' },
  { id: 'join', label: 'Join' },
];

export const initials = (name) =>
  name.split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase();
