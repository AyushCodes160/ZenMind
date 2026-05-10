const axios = require('axios');

const MIXPANEL_PROJECT_TOKEN = "eb8f1b0d14f1c1217260214e3464b21d";
const MIXPANEL_API_URL = "https://api-eu.mixpanel.com";

// ==========================================
// HELPERS
// ==========================================

function validateEvent(event) {
    if (!event || !event.event || typeof event.event !== 'string') {
        return { valid: false, reason: "Missing or invalid event name" };
    }
    if (!event.properties || typeof event.properties !== 'object') {
        return { valid: false, reason: "Missing properties object" };
    }
    if (!event.properties.token) {
        return { valid: false, reason: "Missing token in properties" };
    }
    if (!event.properties.distinct_id) {
        return { valid: false, reason: "Missing distinct_id in properties" };
    }
    if (typeof event.properties.time !== 'number' || event.properties.time.toString().length > 10) {
        return { valid: false, reason: "Time is missing or not in UNIX seconds" };
    }

    // Clean undefined or null values
    for (const key in event.properties) {
        if (event.properties[key] === undefined || event.properties[key] === null) {
            delete event.properties[key];
        }
    }

    return { valid: true };
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function safeTrackBatch(events, retries = 3) {
    const validEvents = [];
    for (const ev of events) {
        const check = validateEvent(ev);
        if (check.valid) {
            validEvents.push(ev);
        } else {
            console.warn(`⚠️ Malformed payload skipped: ${check.reason}`, JSON.stringify(ev));
        }
    }

    if (validEvents.length === 0) return true;

    // Explicitly enforce UTF-8 encoding for emojis
    const encoded = Buffer.from(JSON.stringify(validEvents), 'utf-8').toString('base64');
    const params = new URLSearchParams();
    params.append('data', encoded);
    params.append('verbose', '1');

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.post(`${MIXPANEL_API_URL}/track`, params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                timeout: 10000
            });
            if (response.data && response.data.status === 1) {
                console.log(`✅ Batch sent successfully (${validEvents.length} events)`);
                return true;
            } else {
                throw new Error(`Mixpanel API error: ${JSON.stringify(response.data)}`);
            }
        } catch (error) {
            if (attempt === retries) {
                console.error(`❌ Request failed after ${retries} attempts:`, error.response ? error.response.data : error.message);
                return false;
            }
            await sleep(1000 * attempt);
        }
    }
    return false;
}

async function safeEngage(profile, retries = 3) {
    if (!profile || !profile.$token || !profile.$distinct_id || !profile.$set) {
        console.warn(`⚠️ Malformed profile payload skipped`);
        return false;
    }

    const encoded = Buffer.from(JSON.stringify([profile]), 'utf-8').toString('base64');
    const params = new URLSearchParams();
    params.append('data', encoded);
    params.append('verbose', '1');

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.post(`${MIXPANEL_API_URL}/engage`, params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                timeout: 10000
            });
            if (response.data && response.data.status === 1) {
                console.log(`✅ Profile created for ${profile.$distinct_id}`);
                return true;
            } else {
                throw new Error(`Mixpanel API error: ${JSON.stringify(response.data)}`);
            }
        } catch (error) {
            if (attempt === retries) {
                console.error(`❌ Profile request failed for ${profile.$distinct_id}:`, error.response ? error.response.data : error.message);
                return false;
            }
            await sleep(1000 * attempt);
        }
    }
    return false;
}

// ==========================================
// DATA GENERATOR
// ==========================================

const CITIES = ["Pune", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Jaipur", "Kolkata", "Chennai", "Ahmedabad", "Lucknow"];
const COLLEGES = ["Newton School of Technology", "IIT Bombay", "BITS Pilani", "VIT Pune", "Symbiosis Pune", "Delhi University", "Manipal University", "SRM Chennai", "NMIMS Mumbai", "Amity Noida"];
const UTM_SOURCES = ["whatsapp", "instagram", "reddit", "direct"];
const UTM_MEDIUMS = ["group", "story", "post", "direct"];
const MEDITATION_SESSIONS = ["Morning Calm (10 min)", "Anxiety Relief (15 min)", "Deep Sleep (20 min)", "Focus Boost (8 min)", "Breathing Reset (5 min)"];
const QUICK_PROMPTS = ["I'm feeling anxious", "Help me breathe", "I need motivation", "I can't sleep", "मुझे नींद नहीं आ रही", "मैं चिंतित हूं", "I feel lonely", "Help me focus"];
const MOODS = ["😔", "😐", "🙂", "😊", "🌟"];
const MOOD_SCORES = { "😔": 1, "😐": 2, "🙂": 3, "😊": 4, "🌟": 5 };

const PAGE_WEIGHTS = [
    { page: 'zen_ai', weight: 38 },
    { page: 'meditations', weight: 24 },
    { page: 'journal', weight: 18 },
    { page: 'community', weight: 12 },
    { page: 'quotes', weight: 8 }
];

function getWeightedPage() {
    const total = 100;
    let r = Math.random() * total;
    let sum = 0;
    for (let p of PAGE_WEIGHTS) {
        sum += p.weight;
        if (r <= sum) return p.page;
    }
    return 'zen_ai';
}

function generateRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function getRandomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

async function run() {
    const numUsers = 50;
    let allEvents = [];
    const maxTime = Math.floor(Date.now() / 1000);
    
    for (let i = 1; i <= numUsers; i++) {
        const idStr = String(i).padStart(3, '0');
        const distinctId = `zenmind_user_${idStr}`;
        const name = `User ${i}`;
        const city = getRandomItem(CITIES);
        const college = getRandomItem(COLLEGES);
        const lang = Math.random() < 0.35 ? "hi" : "en";
        const userType = Math.random() < 0.30 ? "power_user" : "casual";
        const joinDay = generateRandomInt(1, 12);
        const utmSource = getRandomItem(UTM_SOURCES);
        const utmMedium = getRandomItem(UTM_MEDIUMS);

        const user = {
            distinct_id: distinctId, name, city, college, preferred_language: lang,
            user_type: userType, join_day: joinDay, utm_source: utmSource, utm_medium: utmMedium
        };

        const profilePayload = {
            $token: MIXPANEL_PROJECT_TOKEN,
            $distinct_id: distinctId,
            $set: {
                $name: name,
                $created: new Date(Date.now() - joinDay * 86400000).toISOString(),
                city: city,
                college: college,
                preferred_language: lang,
                user_type: userType
            }
        };

        await safeEngage(profilePayload);

        let userEvents = [];
        let currentTime = Math.floor((Date.now() - user.join_day * 86400 * 1000) / 1000); 

        userEvents.push({
            event: "sign_up",
            properties: {
                distinct_id: user.distinct_id,
                time: currentTime,
                token: MIXPANEL_PROJECT_TOKEN,
                city: user.city,
                college: user.college,
                language: user.preferred_language,
                utm_source: user.utm_source,
                utm_medium: user.utm_medium,
                utm_campaign: "launch_v1"
            }
        });

        currentTime += generateRandomInt(10, 60);

        let numSessions = user.user_type === 'power_user' ? generateRandomInt(5, 10) : generateRandomInt(1, 4);
        
        for (let s = 0; s < numSessions; s++) {
            const sessionId = `${user.distinct_id}_s${s}`;
            const numPages = user.user_type === 'power_user' ? generateRandomInt(2, 5) : generateRandomInt(1, 3);
            
            let timeToMax = maxTime - currentTime;
            let sessionAdvance = generateRandomInt(3600, 86400);
            if (sessionAdvance > timeToMax - 3600) {
                sessionAdvance = Math.max(60, Math.floor(timeToMax / (numSessions - s + 1)));
            }
            currentTime += sessionAdvance;
            
            let currentLang = user.preferred_language;

            if (Math.random() < 0.20) {
                const newLang = currentLang === 'hi' ? 'en' : 'hi';
                userEvents.push({
                    event: "language_switched",
                    properties: { distinct_id: user.distinct_id, time: currentTime, token: MIXPANEL_PROJECT_TOKEN, from: currentLang, to: newLang }
                });
                currentLang = newLang;
                currentTime += generateRandomInt(5, 15);
            }

            for (let p = 0; p < numPages; p++) {
                const page = (p === 0) ? 'home' : getWeightedPage();
                
                userEvents.push({
                    event: "page_view",
                    properties: { distinct_id: user.distinct_id, time: currentTime, token: MIXPANEL_PROJECT_TOKEN, page: page, session_id: sessionId, language: currentLang }
                });

                currentTime += generateRandomInt(10, 30);

                if (page === 'zen_ai' && Math.random() < 0.80) {
                    const numMsgs = generateRandomInt(2, 8);
                    for (let m = 0; m < numMsgs; m++) {
                        const isQuick = (m === 0);
                        let props = { distinct_id: user.distinct_id, time: currentTime, token: MIXPANEL_PROJECT_TOKEN, language: currentLang, message_index: m + 1, is_quick_prompt: isQuick };
                        if (isQuick) props.prompt = getRandomItem(QUICK_PROMPTS);
                        userEvents.push({ event: "chat_message_sent", properties: props });
                        currentTime += generateRandomInt(10, 45);
                    }
                } else if (page === 'meditations' && Math.random() < 0.70) {
                    const sessionName = getRandomItem(MEDITATION_SESSIONS);
                    userEvents.push({
                        event: "meditation_started",
                        properties: { distinct_id: user.distinct_id, time: currentTime, token: MIXPANEL_PROJECT_TOKEN, session_name: sessionName, language: currentLang }
                    });
                    
                    if (Math.random() < 0.65) {
                        currentTime += 700 + generateRandomInt(-30, 30);
                        userEvents.push({
                            event: "meditation_completed",
                            properties: { distinct_id: user.distinct_id, time: currentTime, token: MIXPANEL_PROJECT_TOKEN, session_name: sessionName }
                        });
                    }
                } else if (page === 'journal' && Math.random() < 0.60) {
                    const mood = getRandomItem(MOODS);
                    userEvents.push({
                        event: "journal_entry_saved",
                        properties: { distinct_id: user.distinct_id, time: currentTime, token: MIXPANEL_PROJECT_TOKEN, mood: mood, mood_score: MOOD_SCORES[mood], word_count: generateRandomInt(30, 250) }
                    });
                    currentTime += generateRandomInt(15, 60);
                } else if (page === 'quotes' && Math.random() < 0.50) {
                    userEvents.push({
                        event: "quote_shared",
                        properties: { distinct_id: user.distinct_id, time: currentTime, token: MIXPANEL_PROJECT_TOKEN, language: currentLang, platform: getRandomItem(["whatsapp", "instagram", "clipboard"]) }
                    });
                    currentTime += generateRandomInt(5, 20);
                } else if (page === 'community' && Math.random() < 0.40) {
                    userEvents.push({
                        event: "community_post_liked",
                        properties: { distinct_id: user.distinct_id, time: currentTime, token: MIXPANEL_PROJECT_TOKEN, reaction: getRandomItem(["🌸 Relate", "💚 Support", "🙏 Strength"]) }
                    });
                    currentTime += generateRandomInt(5, 20);
                }
                currentTime += generateRandomInt(30, 120);
            }
        }

        if (user.user_type === 'power_user' && user.join_day >= 3) {
            userEvents.push({
                event: "streak_milestone",
                properties: { distinct_id: user.distinct_id, time: currentTime, token: MIXPANEL_PROJECT_TOKEN, streak_days: generateRandomInt(3, user.join_day) }
            });
        }
        allEvents.push(...userEvents);
    }

    allEvents.sort((a, b) => a.properties.time - b.properties.time);

    const BATCH_SIZE = 50;
    const numBatches = Math.ceil(allEvents.length / BATCH_SIZE);
    console.log(`\n📦 Sending ${allEvents.length} events in ${numBatches} batches...`);

    let batchesSent = 0;
    for (let i = 0; i < allEvents.length; i += BATCH_SIZE) {
        const batch = allEvents.slice(i, i + BATCH_SIZE);
        const success = await safeTrackBatch(batch);
        if (success) batchesSent++;
        await sleep(200);
    }

    console.log(`\n✅ Injection complete! Sent ${batchesSent} of ${numBatches} batches successfully.`);
}

run();
