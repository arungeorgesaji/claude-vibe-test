# AI Companion

A waifu chat site with multiple AI personalities, powered by MiniMax via the [Hack Club AI proxy](https://ai.hackclub.com).

## Characters

| | Name | Personality |
|---|---|---|
| 🌸 | **Yuki** | Warm, sweet, devoted companion |
| 🔥 | **Akane** | Bold, seductive, no limits |
| ❄️ | **Hana** | Tsundere — cold outside, soft inside |
| 🌙 | **Rei** | Mysterious, gothic, intensely loyal |

## Setup

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## Adding a character

Drop a new `.json` file in `personalities/` using the same structure as the existing ones, then restart the server. It shows up automatically on the select screen.

## Stack

- **Backend** — Node.js + Express, streaming SSE responses
- **Model** — `minimax/minimax-m2-her` via `https://ai.hackclub.com/proxy/v1`
- **Frontend** — Vanilla JS, no framework
