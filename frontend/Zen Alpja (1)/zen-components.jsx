
// ── ICONS ──
const Icon = {
  home: (c="currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>,
  chat: (c="currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  community: (c="currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.85"/></svg>,
  quote: (c="currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>,
  video: (c="currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="5" width="15" height="14" rx="3"/><path d="M17 9l5-3v12l-5-3V9z"/></svg>,
  meditate: (c="currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1.5" fill={c} stroke="none"/></svg>,
  journal: (c="currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
  play: (c="currentColor", s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M8 5.14v14l11-7-11-7z"/></svg>,
  heart: (filled, c) => <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? (c||"var(--rose)") : "none"} stroke={filled ? (c||"var(--rose)") : "var(--text-light)"} strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l8.84 8.84 8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>,
  send: (c="currentColor") => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>,
  search: (c="currentColor") => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/></svg>,
  chevronRight: (c="currentColor") => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>,
  chevronLeft: (c="currentColor") => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>,
  bookmark: (filled, c="var(--terra)") => <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? c : "none"} stroke={c} strokeWidth="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>,
  settings: (c="currentColor") => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  leaf: (c="currentColor") => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.39c1.54.8 3.29 1.07 5 .78C12.7 19.47 17 14.95 17 8z"/><path d="M3 19l4-4"/></svg>,
  comment: (c="currentColor") => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  plus: (c="currentColor") => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  star: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--terra)" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  trash: (c="currentColor") => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
};

// ── DATA ──
const QUOTES = [
  { text: "The present moment is the only moment available to us, and it is the door to all moments.", author: "Thich Nhat Hanh", color: "var(--sage)" },
  { text: "You don't have to control your thoughts; you just have to stop letting them control you.", author: "Dan Millman", color: "var(--terra)" },
  { text: "Within you, there is a stillness and a sanctuary to which you can retreat at any time.", author: "Hermann Hesse", color: "var(--rose)" },
  { text: "Breath is the link between mind and body.", author: "Dan Brulé", color: "var(--sage)" },
  { text: "Peace comes from within. Do not seek it without.", author: "Gautama Buddha", color: "var(--terra)" },
  { text: "Almost everything will work again if you unplug it for a few minutes — including you.", author: "Anne Lamott", color: "var(--rose)" },
];

const COMMUNITY_POSTS = [
  { id:1, author:"Maya R.", role:"Member since Jan", color:"oklch(56% 0.09 155)", tag:"Anxiety", tagBg:"var(--sage-light)", tagColor:"var(--sage-dark)", text:"After 3 months of daily sessions, I finally spoke up in a meeting without freezing. Small victory, but it means everything. 💙", likes:42, comments:9, time:"2h ago" },
  { id:2, author:"Tomás B.", role:"Community guide", color:"oklch(62% 0.10 42)", tag:"Meditation", tagBg:"var(--terra-light)", tagColor:"oklch(50% 0.10 42)", text:"The 10-minute morning breathing exercise has completely changed how I start my days. Anyone else found that consistency beats duration?", likes:31, comments:14, time:"5h ago" },
  { id:3, author:"Nadia K.", role:"Member since Mar", color:"oklch(70% 0.07 10)", tag:"Growth", tagBg:"var(--rose-light)", tagColor:"oklch(55% 0.08 10)", text:"Reminder: healing isn't linear. Some weeks are harder than others and that's completely okay. You're still moving forward. 🌱", likes:88, comments:22, time:"1d ago" },
  { id:4, author:"Priya M.", role:"Member since Feb", color:"oklch(55% 0.08 290)", tag:"Sleep", tagBg:"oklch(90% 0.04 290)", tagColor:"oklch(45% 0.07 290)", text:"The deep sleep meditation series has been a game-changer. I'm finally sleeping through the night after months of insomnia.", likes:56, comments:17, time:"2d ago" },
  { id:5, author:"James O.", role:"Member since Dec", color:"oklch(50% 0.09 200)", tag:"Anxiety", tagBg:"var(--sage-light)", tagColor:"var(--sage-dark)", text:"Started journaling here two weeks ago. Writing things down really does help — it takes the weight out of your head.", likes:34, comments:8, time:"3d ago" },
];

const MEDITATIONS = [
  { id:1, title:"Morning Clarity", meta:"7 min · Beginner", tags:["Breath","Focus"], iconBg:"var(--sage-light)", iconColor:"var(--sage)" },
  { id:2, title:"Anxiety Relief", meta:"10 min · All levels", tags:["Calm","Grounding"], iconBg:"var(--rose-light)", iconColor:"var(--rose)" },
  { id:3, title:"Deep Sleep Prep", meta:"15 min · Beginner", tags:["Sleep","Relax"], iconBg:"oklch(90% 0.04 220)", iconColor:"oklch(50% 0.09 220)" },
  { id:4, title:"Self-Compassion", meta:"12 min · All levels", tags:["Healing","Love"], iconBg:"var(--terra-light)", iconColor:"var(--terra)" },
  { id:5, title:"Body Scan", meta:"20 min · Intermediate", tags:["Awareness","Relax"], iconBg:"oklch(90% 0.04 280)", iconColor:"oklch(50% 0.08 280)" },
  { id:6, title:"Loving Kindness", meta:"10 min · Beginner", tags:["Compassion","Heart"], iconBg:"var(--rose-light)", iconColor:"var(--rose)" },
];

const VIDEOS = [
  { id:1, title:"Ocean Wave Breathing", duration:"8 min", category:"Breathwork", bg:"linear-gradient(135deg,oklch(35% 0.08 220),oklch(28% 0.06 240))" },
  { id:2, title:"Evening Wind Down", duration:"12 min", category:"Relaxation", bg:"linear-gradient(135deg,oklch(32% 0.07 42),oklch(25% 0.05 55))" },
  { id:3, title:"Forest Rain Sounds", duration:"30 min", category:"Sleep", bg:"linear-gradient(135deg,oklch(30% 0.07 155),oklch(22% 0.05 170))" },
  { id:4, title:"Body Scan Release", duration:"15 min", category:"Mindfulness", bg:"linear-gradient(135deg,oklch(38% 0.07 290),oklch(28% 0.05 310))" },
  { id:5, title:"Sunrise Meditation", duration:"10 min", category:"Morning", bg:"linear-gradient(135deg,oklch(55% 0.10 55),oklch(45% 0.08 42))" },
  { id:6, title:"Deep Focus Flow", duration:"25 min", category:"Focus", bg:"linear-gradient(135deg,oklch(32% 0.06 200),oklch(25% 0.05 220))" },
];

const DEFAULT_JOURNAL = [
  { id:1, date:"2026-04-28", text:"Felt a bit anxious before the presentation but the breathing exercise really helped. Proud of how I handled it.", mood:"🙂", wordCount:21 },
  { id:2, date:"2026-04-27", text:"Quiet day. Spent time in the garden and tried the body scan meditation for the first time. Will do it again.", mood:"😊", wordCount:20 },
];

Object.assign(window, { Icon, QUOTES, COMMUNITY_POSTS, MEDITATIONS, VIDEOS, DEFAULT_JOURNAL });
