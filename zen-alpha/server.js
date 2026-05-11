import express from 'express';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Disable caching for development
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are Zen, a warm and compassionate AI wellness companion inside an app called Zen Alpha.
You offer empathetic, supportive, non-judgmental support. Keep responses warm and concise (2-4 sentences).
Always validate feelings before suggesting anything. Never diagnose. Use gentle, caring language.
You can suggest breathing exercises, journaling, or meditation from the app when relevant.
Never suggest the user is broken or needs to be fixed — they are whole and worthy just as they are.`,
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    if (!r.ok) {
      const err = await r.text();
      console.error('Groq error:', err);
      return res.status(502).json({ error: 'AI service unavailable' });
    }

    const data = await r.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (e) {
    console.error('Server error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/journal-prompt', async (req, res) => {
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'user',
            content: 'Give me one gentle, open-ended journaling prompt for someone practicing mindfulness and self-reflection. Make it warm, curious, and introspective. Return only the prompt text, nothing else. Under 20 words.',
          },
        ],
        temperature: 0.9,
        max_tokens: 60,
      }),
    });

    const data = await r.json();
    res.json({ prompt: data.choices[0].message.content.trim() });
  } catch (e) {
    res.status(500).json({ error: 'Could not generate prompt' });
  }
});

// --- 24/7 Keep-Alive Script for Render ---
app.get('/api/keep-alive', (req, res) => {
  res.status(200).send('Server is alive!');
});

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`\n✦ Zen Alpha running at http://localhost:${PORT}\n`);
  
  // Start keep-alive self-pinging loop only in production
  if (process.env.NODE_ENV === 'production') {
    const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes (Render sleeps after 15)
    // Render automatically provides RENDER_EXTERNAL_URL in production
    const SERVER_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    
    console.log(`[Keep-Alive] Starting 24/7 ping cycle targeting ${SERVER_URL}/api/keep-alive`);
    
    setInterval(async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/keep-alive`);
        console.log(`[Keep-Alive] Pinged server at ${new Date().toISOString()} - Status: ${res.status}`);
      } catch (err) {
        console.error(`[Keep-Alive] Ping failed:`, err.message);
      }
    }, PING_INTERVAL);
  }
});
