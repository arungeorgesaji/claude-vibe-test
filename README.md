# AI Companion

A waifu chat site with multiple AI personalities, powered by MiniMax via the [Hack Club AI proxy](https://ai.hackclub.com).

> **Note:** This project was vibecoded entirely by Claude as a test of its capabilities. It is not intended for production use.

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
| 🕐 | **Kana** | Darkly charming, genuinely dangerous |

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
  "avatarUrl": "https://i.pinimg.com/...",
  "systemPrompt": "Full system prompt defining the character..."
}
```

### Custom avatar images

Add an `avatarUrl` to any personality JSON to use an external image (e.g. from Pinterest) instead of the default SVG illustration. The SVG is always kept as a fallback — if the URL fails to load, it automatically shows the SVG.

```json
"avatarUrl": "https://i.pinimg.com/736x/ab/cd/ef/abcdef.jpg"
```

`avatarUrl` is optional — omit it to use the SVG.

## Stack

- **Backend** — Node.js + Express, streaming SSE responses
- **Model** — `minimax/minimax-m2-her` via `https://ai.hackclub.com/proxy/v1`
- **Frontend** — Vanilla JS, no framework
- **Portraits** — Hand-crafted SVG illustrations per character
