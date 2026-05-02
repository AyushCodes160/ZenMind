# Zen Alpha

A calm, mindful mental wellness web app with AI chat, guided meditations, journaling, community, and daily quotes.

## Setup

1. **Install dependencies**
   ```
   npm install
   ```

2. **Create your `.env` file** (copy from example)
   ```
   cp .env.example .env
   ```
   Then edit `.env` and add your Groq API key:
   ```
   GROQ_API_KEY=gsk_your_key_here
   ```

3. **Start the server**
   ```
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173)

## Pages

| Page | URL |
|------|-----|
| Home dashboard | `/index.html` |
| AI Chat (Zen AI) | `/zen-ai.html` |
| Community feed | `/community.html` |
| Guided Meditations | `/meditation.html` |
| Calm Videos | `/videos.html` |
| Daily Quotes | `/quotes.html` |
| My Journal | `/journal.html` |

## Stack

- **Frontend**: Vanilla HTML / CSS / JS (no framework)
- **Backend**: Node.js + Express (proxies Groq API — key stays server-side)
- **AI**: Groq API (`llama-3.3-70b-versatile`)
- **Storage**: localStorage (streak, journal entries, chat history, favorites)

## Get a Groq API Key

Sign up at [console.groq.com](https://console.groq.com) — free tier available.
