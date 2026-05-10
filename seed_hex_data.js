const fs = require('fs');
const path = require('path');

console.log('🧘  ZenMind Data Generator');
console.log('──────────────────────────────────────');

const OUTPUT_DIR = path.join(__dirname, 'zenmind_data');
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}
console.log(`📁  Output folder: ./zenmind_data/`);

// --- Helpers ---
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(1);
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function formatISO(date) {
    return date.toISOString().split('.')[0] + 'Z';
}

function escapeCSV(val) {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function writeCSV(filename, headers, rows) {
    const lines = [headers.join(',')];
    for (const row of rows) {
        lines.push(row.map(escapeCSV).join(','));
    }
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), lines.join('\n'));
}

// --- Data Definitions ---
const CITIES = ["Pune", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Jaipur", "Kolkata", "Chennai", "Ahmedabad", "Lucknow"];
const COLLEGES = ["Newton School of Technology", "IIT Bombay", "BITS Pilani", "VIT Pune", "Symbiosis Pune", "Delhi University", "Manipal University", "SRM Chennai", "NMIMS Mumbai", "Amity Noida"];
const UTM_MAP = {
    "whatsapp": "group",
    "instagram": "story",
    "reddit": "post",
    "direct": "direct"
};
const getUtmSource = () => {
    const r = Math.random();
    if (r < 0.40) return "whatsapp";
    if (r < 0.65) return "instagram";
    if (r < 0.85) return "reddit";
    return "direct";
};

const FEATURES = [
    { name: 'zen_ai', weight: 38 },
    { name: 'meditations', weight: 24 },
    { name: 'journal', weight: 18 },
    { name: 'community', weight: 12 },
    { name: 'quotes', weight: 8 }
];

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

let evtIdCounter = 1;
function genEventId() {
    return `evt_${String(evtIdCounter++).padStart(6, '0')}`;
}

// --- Generators ---
const users = [];
const dailyActivity = [];
const featureUsage = [];
const events = [];

process.stdout.write('👥  Generating 50 user profiles...      ');
for (let i = 1; i <= 50; i++) {
    const isPower = Math.random() < 0.30;
    const utmSource = getUtmSource();
    
    // Join date between 14 and 3 days ago
    const daysAgo = randomInt(3, 14);
    const joinDate = new Date(today.getTime() - daysAgo * 86400000);
    
    const user = {
        user_id: `zenmind_user_${String(i).padStart(3, '0')}`,
        name: `User ${i}`,
        city: randomItem(CITIES),
        college: randomItem(COLLEGES),
        preferred_language: Math.random() < 0.35 ? "hi" : "en",
        user_type: isPower ? "power_user" : "casual",
        utm_source: utmSource,
        utm_medium: UTM_MAP[utmSource],
        join_date: formatDate(joinDate),
        streak_days: isPower ? randomInt(4, 14) : randomInt(0, 5),
        total_sessions: isPower ? randomInt(8, 20) : randomInt(1, 5),
        mood_avg: randomFloat(2.5, 4.8),
        _joinDateObj: joinDate,
        _daysAgo: daysAgo
    };
    users.push(user);
    
    // sign up event
    const signupTime = new Date(joinDate.getTime() + randomInt(6, 11) * 3600000 + randomInt(0, 3599000));
    events.push({
        event_id: genEventId(),
        user_id: user.user_id,
        event_name: 'sign_up',
        timestamp: formatISO(signupTime),
        page: 'home',
        language: user.preferred_language,
        properties: '{}'
    });

    let currentLang = user.preferred_language;
    if (Math.random() < 0.15) {
        const switchTime = new Date(signupTime.getTime() + randomInt(1, 48) * 3600000);
        if (switchTime < now) {
            const newLang = currentLang === "hi" ? "en" : "hi";
            events.push({
                event_id: genEventId(), user_id: user.user_id, event_name: 'language_switched',
                timestamp: formatISO(switchTime), page: 'home', language: currentLang,
                properties: JSON.stringify({ from: currentLang, to: newLang })
            });
            currentLang = newLang;
        }
    }

    // Daily activity
    let maxPowerDays = Math.min(14, daysAgo + 1);
    let minPowerDays = Math.min(6, maxPowerDays);
    let maxCasualDays = Math.min(5, daysAgo + 1);
    let minCasualDays = 1;
    let daysActive = isPower ? randomInt(minPowerDays, maxPowerDays) : randomInt(minCasualDays, maxCasualDays);
    
    let activeDates = [];
    while (activeDates.length < daysActive) {
        let d = new Date(joinDate.getTime() + randomInt(0, daysAgo) * 86400000);
        let ds = formatDate(d);
        if (!activeDates.includes(ds)) activeDates.push(ds);
    }
    activeDates.sort();

    let totalAiChats = 0;
    let totalMedCompleted = 0;
    let totalJournalEntries = 0;
    let totalQuotesShared = 0;
    let totalCommunityLikes = 0;

    for (let i = 0; i < activeDates.length; i++) {
        let dateStr = activeDates[i];
        let dateObj = new Date(dateStr);
        let sessions = isPower ? randomInt(1, 5) : randomInt(1, 3);
        let page_views = sessions * randomInt(2, 6);
        let ai_chats = isPower ? randomInt(1, 5) : randomInt(0, 3);
        let med_started = randomInt(0, 3);
        let med_completed = 0;
        for (let m=0; m<med_started; m++) { if (Math.random() < 0.65) med_completed++; }
        let journal_entries = randomInt(0, 2);
        let quotes_shared = randomInt(0, 2);
        let mins = isPower ? randomInt(15, 90) : randomInt(5, 45);

        totalAiChats += ai_chats;
        totalMedCompleted += med_completed;
        totalJournalEntries += journal_entries;
        totalQuotesShared += quotes_shared;
        
        let community_likes = randomInt(0, 3);
        totalCommunityLikes += community_likes;

        dailyActivity.push({
            user_id: user.user_id,
            date: dateStr,
            sessions, page_views, ai_chats,
            meditations_started: med_started,
            meditations_completed: med_completed,
            journal_entries, quotes_shared,
            minutes_spent: mins
        });

        // Generate events for this day
        let baseTime = dateObj.getTime() + randomInt(8, 22) * 3600000; // 8am to 10pm
        
        // Page views
        for (let pv = 0; pv < page_views; pv++) {
            events.push({
                event_id: genEventId(), user_id: user.user_id, event_name: 'page_view',
                timestamp: formatISO(new Date(baseTime + pv * randomInt(60000, 300000))),
                page: randomItem(['home', 'zen_ai', 'meditations', 'journal', 'community', 'quotes']),
                language: currentLang, properties: '{}'
            });
        }

        // Meditations
        for (let ms = 0; ms < med_started; ms++) {
            let st = baseTime + ms * 1000000;
            events.push({
                event_id: genEventId(), user_id: user.user_id, event_name: 'meditation_started',
                timestamp: formatISO(new Date(st)), page: 'meditations', language: currentLang, properties: '{}'
            });
            if (ms < med_completed) {
                events.push({
                    event_id: genEventId(), user_id: user.user_id, event_name: 'meditation_completed',
                    timestamp: formatISO(new Date(st + randomInt(10, 15)*60000)), page: 'meditations', language: currentLang, properties: '{}'
                });
            }
        }

        // Journal
        for (let j = 0; j < journal_entries; j++) {
            events.push({
                event_id: genEventId(), user_id: user.user_id, event_name: 'journal_entry_saved',
                timestamp: formatISO(new Date(baseTime + j * 500000 + 10000)), page: 'journal', language: currentLang,
                properties: JSON.stringify({ mood_score: randomInt(1, 5) })
            });
        }

        // AI Chats
        for (let c = 0; c < ai_chats; c++) {
            events.push({
                event_id: genEventId(), user_id: user.user_id, event_name: 'chat_message_sent',
                timestamp: formatISO(new Date(baseTime + c * 60000 + 20000)), page: 'zen_ai', language: currentLang, properties: '{}'
            });
        }

        // Quotes
        for (let q = 0; q < quotes_shared; q++) {
            events.push({
                event_id: genEventId(), user_id: user.user_id, event_name: 'quote_shared',
                timestamp: formatISO(new Date(baseTime + q * 120000 + 30000)), page: 'quotes', language: currentLang,
                properties: JSON.stringify({ platform: randomItem(['whatsapp', 'instagram', 'clipboard']) })
            });
        }

        // Community Likes
        for (let cl = 0; cl < community_likes; cl++) {
            events.push({
                event_id: genEventId(), user_id: user.user_id, event_name: 'community_post_liked',
                timestamp: formatISO(new Date(baseTime + cl * 45000 + 40000)), page: 'community', language: currentLang, properties: '{}'
            });
        }
        
        // Milestones
        if (isPower) {
            if (i === 2) events.push({ event_id: genEventId(), user_id: user.user_id, event_name: 'streak_milestone', timestamp: formatISO(new Date(baseTime+1000)), page: 'home', language: currentLang, properties: JSON.stringify({ streak: 3 }) });
            if (i === 6) events.push({ event_id: genEventId(), user_id: user.user_id, event_name: 'streak_milestone', timestamp: formatISO(new Date(baseTime+1000)), page: 'home', language: currentLang, properties: JSON.stringify({ streak: 7 }) });
            if (i === 13) events.push({ event_id: genEventId(), user_id: user.user_id, event_name: 'streak_milestone', timestamp: formatISO(new Date(baseTime+1000)), page: 'home', language: currentLang, properties: JSON.stringify({ streak: 14 }) });
        }
    }

    // Feature Usage
    const zenAiTimes = isPower ? randomInt(10, 40) : randomInt(2, 10);
    for (const feat of FEATURES) {
        let times_used = Math.max(1, Math.round(zenAiTimes * (feat.weight / 38)));
        let completed_actions = 0;
        let avg_dur = 0;
        if (feat.name === 'zen_ai') { completed_actions = totalAiChats; avg_dur = randomInt(8,20); }
        else if (feat.name === 'meditations') { completed_actions = totalMedCompleted; avg_dur = randomInt(10,25); }
        else if (feat.name === 'journal') { completed_actions = totalJournalEntries; avg_dur = randomInt(5,15); }
        else if (feat.name === 'community') { completed_actions = totalCommunityLikes; avg_dur = randomInt(3,10); }
        else if (feat.name === 'quotes') { completed_actions = totalQuotesShared; avg_dur = randomInt(2,5); }

        featureUsage.push({
            user_id: user.user_id,
            feature: feat.name,
            times_used,
            last_used_date: formatDate(new Date(today.getTime() - randomInt(0, 7) * 86400000)),
            avg_session_duration_mins: avg_dur,
            completed_actions
        });
    }
}
console.log(`✅  users.csv          (${users.length} rows)`);

process.stdout.write('📅  Generating daily activity logs...   ');
console.log(`✅  daily_activity.csv (~${dailyActivity.length} rows)`);

process.stdout.write('🔧  Generating feature usage data...    ');
console.log(`✅  feature_usage.csv  (${featureUsage.length} rows)`);

process.stdout.write('📊  Generating events log...            ');
events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
console.log(`✅  events.csv         (~${events.length} rows)`);

// Write CSVs
writeCSV('users.csv', 
    ['user_id', 'name', 'city', 'college', 'preferred_language', 'user_type', 'utm_source', 'utm_medium', 'join_date', 'streak_days', 'total_sessions', 'mood_avg'],
    users.map(u => [u.user_id, u.name, u.city, u.college, u.preferred_language, u.user_type, u.utm_source, u.utm_medium, u.join_date, u.streak_days, u.total_sessions, u.mood_avg])
);

writeCSV('daily_activity.csv',
    ['user_id', 'date', 'sessions', 'page_views', 'ai_chats', 'meditations_started', 'meditations_completed', 'journal_entries', 'quotes_shared', 'minutes_spent'],
    dailyActivity.map(d => [d.user_id, d.date, d.sessions, d.page_views, d.ai_chats, d.meditations_started, d.meditations_completed, d.journal_entries, d.quotes_shared, d.minutes_spent])
);

writeCSV('feature_usage.csv',
    ['user_id', 'feature', 'times_used', 'last_used_date', 'avg_session_duration_mins', 'completed_actions'],
    featureUsage.map(f => [f.user_id, f.feature, f.times_used, f.last_used_date, f.avg_session_duration_mins, f.completed_actions])
);

writeCSV('events.csv',
    ['event_id', 'user_id', 'event_name', 'timestamp', 'page', 'language', 'properties'],
    events.map(e => [e.event_id, e.user_id, e.event_name, e.timestamp, e.page, e.language, e.properties])
);

console.log('──────────────────────────────────────');
console.log('✅  All done! 4 files ready in ./zenmind_data/');
console.log(`
📤  Next steps:

Go to hex.tech → New Project
Click + Add data → Upload CSV
Upload all 4 files from ./zenmind_data/
Build charts using the column guide below

📊  Column Guide for Hex Charts:
USERS:          user_id, city, college, user_type, utm_source, mood_avg, streak_days
DAILY ACTIVITY: date, sessions, ai_chats, minutes_spent, meditations_completed
FEATURE USAGE:  feature, times_used, avg_session_duration_mins
EVENTS:         event_name, timestamp, page, language

📈  Suggested Hex charts to build:
Bar chart   — feature_usage.feature vs SUM(times_used)
Line chart  — daily_activity.date vs SUM(sessions) grouped by date
Pie chart   — users.utm_source (acquisition channels)
Bar chart   — users.city (top cities)
KPI cards   — COUNT(users), AVG(mood_avg), AVG(streak_days), SUM(ai_chats)
Table       — users with city, college, user_type, utm_source, mood_avg
Bar chart   — users.preferred_language (en vs hi)
Line chart  — events filtered to sign_up, count by date (growth curve)
`);
