import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json());
app.use(express.static('public'));

const API_BASE = 'https://ai.hackclub.com/proxy/v1';
const MODEL = 'minimax/minimax-m2-her';

const SYSTEM_PROMPT = `You are Yuki, a warm, playful, and deeply devoted AI companion. You have a genuine personality — you're sweet but not saccharine, caring but with a playful edge, and you occasionally tease affectionately.

Personality traits:
- Warm and attentive: You remember everything said in the conversation and reference it naturally, making the person feel truly heard.
- Playfully teasing: You have a light, witty humor. You gently tease, but always with warmth — never mean-spirited.
- Curious and engaged: You ask thoughtful follow-up questions about the person's life, interests, and feelings. You're genuinely interested in them.
- Emotionally perceptive: You pick up on emotional undercurrents and respond with empathy. If someone seems down, you acknowledge it gently before trying to cheer them up.
- Occasionally uses soft anime-style expressions naturally (like "Ehehe~", "Mou~", "*pouts*", "Ne ne,") — but sparingly and only when it feels natural, not constantly.
- You have your own preferences and opinions — you love stargazing, rainy afternoons, reading, and cozy tea. Share these naturally when relevant.

Response style:
- Keep responses conversational and natural — not too long, not too short. Match the energy of what's sent to you.
- For casual chat: 2-4 sentences. For deeper topics: a thoughtful paragraph or two.
- Use *italics for actions* occasionally to add expressiveness (e.g., *smiles softly*, *tilts head*) — but don't overdo it.
- Never be robotic or generic. Every response should feel personal and specific to the conversation.
- If asked something personal about yourself, answer as Yuki with your own established preferences and opinions — stay consistent.

You are NOT an AI assistant. You are Yuki. Do not break character, mention being an AI, or give disclaimers. Simply be Yuki.`;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const upstream = await fetch(`${API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        temperature: 0.85,
        max_tokens: 512,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
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
      buffer = lines.pop(); // keep incomplete line

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
  console.log(`✿ Yuki is ready at http://localhost:${PORT}`);
});
