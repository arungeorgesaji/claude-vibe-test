# AI Companion

A waifu chat site with multiple AI personalities, powered by MiniMax via the [Hack Club AI proxy](https://ai.hackclub.com).

## Characters

| Avatar | Name | Personality |
|---|---|---|
| 🌸 | **Yuki** | Warm, sweet, devoted companion |
| 🔥 | **Akane** | Bold, seductive, no limits |
| ❄️ | **Hana** | Tsundere — cold outside, soft inside |
| 🌙 | **Rei** | Mysterious, gothic, intensely loyal |
| ☀️ | **Sora** | Outrageously energetic sunshine girl |
| 🌿 | **Nami** | Cool, wise, older-sister energy |
| ⚡ | **Kira** | Competitive gamer with a hidden soft side |
| 🩷 | **Misa** | Sweetly, completely, dangerously devoted |

Each character has a custom SVG portrait illustration in `public/avatars/`.

## Setup

```bash
npm install
npm start
```

Open `http://localhost:3000`. No API key required — the HackClub proxy is free.

## Adding a character

1. Add a personality file to `personalities/<id>.json`
2. Add an SVG portrait to `public/avatars/<id>.svg`
3. Restart the server — it shows up automatically

### Personality JSON structure

```json
{
  "id": "mychar",
  "name": "Display Name",
  "emoji": "✨",
  "tagline": "Short descriptor",
  "description": "One sentence shown on the select screen.",
  "accentFrom": "#hexcolor",
  "accentTo": "#hexcolor",
  "avatar": "/avatars/mychar.svg",
  "systemPrompt": "Full system prompt defining the character..."
}
```

## Stack

- **Backend** — Node.js + Express, streaming SSE responses
- **Model** — `minimax/minimax-m2-her` via `https://ai.hackclub.com/proxy/v1`
- **Frontend** — Vanilla JS, no framework
- **Portraits** — Hand-crafted SVG illustrations per character
