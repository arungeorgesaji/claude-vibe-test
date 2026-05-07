import 'dotenv/config';
import express from 'express';
import { readdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static('public'));

const API_BASE = 'https://ai.hackclub.com/proxy/v1';
const MODEL = 'minimax/minimax-m2-her';

async function loadPersonalities() {
  const dir = join(__dirname, 'personalities');
  const files = (await readdir(dir)).filter(f => f.endsWith('.json'));
  const entries = await Promise.all(
    files.map(async f => {
      const data = JSON.parse(await readFile(join(dir, f), 'utf8'));
      return [data.id, data];
    })
  );
  return Object.fromEntries(entries);
}

let personalities = {};
loadPersonalities().then(p => {
  personalities = p;
  console.log(`Loaded personalities: ${Object.keys(p).join(', ')}`);
});

app.get('/api/personalities', (req, res) => {
  const list = Object.values(personalities).map(({ id, name, emoji, tagline, description, accentFrom, accentTo }) => ({
    id, name, emoji, tagline, description, accentFrom, accentTo,
  }));
  res.json(list);
});

app.post('/api/chat', async (req, res) => {
  const { messages, personalityId } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format' });
  }

  const personality = personalities[personalityId] ?? personalities['yuki'];
  if (!personality) {
    return res.status(400).json({ error: 'Unknown personality' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const upstream = await fetch(`${API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        ...(process.env.API_KEY ? { 'Authorization': `Bearer ${process.env.API_KEY}` } : {}),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        temperature: 0.88,
        max_tokens: 512,
        messages: [
          { role: 'system', content: personality.systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!upstream.ok) {
      const err = await upstream.text();
      console.error('Upstream error:', upstream.status, err);
      res.write(`data: ${JSON.stringify({ error: 'API error — please check your key.' })}\n\n`);
      return res.end();
    }

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;
        const data = trimmed.slice(5).trim();
        if (data === '[DONE]') {
          res.write('data: [DONE]\n\n');
          continue;
        }
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) res.write(`data: ${JSON.stringify({ content })}\n\n`);
        } catch {}
      }
    }

    res.end();
  } catch (err) {
    console.error('Server error:', err);
    res.write(`data: ${JSON.stringify({ error: 'Something went wrong...' })}\n\n`);
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✿ App ready at http://localhost:${PORT}`);
});
