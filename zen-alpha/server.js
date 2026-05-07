import express from 'express';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(__dirname));

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

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`\n✦ Zen Alpha running at http://localhost:${PORT}\n`);
});
