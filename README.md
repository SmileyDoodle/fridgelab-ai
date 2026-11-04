# FridgeLab AI 🍳

A cozy, zero-waste recipe generator that invents comforting home-cooked meals from whatever ingredients you already have on hand.

Powered by **Cloudflare Workers AI** (Meta Llama 3.1 8B Instruct) at the edge, built with **React 19**, **TypeScript**, and **Tailwind CSS**.

---

## ✨ Features

- **Pantry Staples Grid**: Tap common ingredients (eggs, cheese, potatoes, rice, pasta, etc.) with instant visual feedback.
- **Custom Fridge Leftovers**: Add half-jars of sauce, odd vegetables, or fresh herbs with automatic input sanitization and duplicate prevention.
- **Energy & Time Calibration**: Choose between 3 effort modes:
  - 🥱 *Tired / Low-Effort* (~5 min, microwave/toaster, minimal cleanup)
  - 🫖 *Cozy Stovetop* (~15 min, single skillet, gentle comfort)
  - 👨‍🍳 *Hungry Chef Mode* (25+ min, crisping, pan sauces, unhurried cooking)
- **Zero-Latency Quick Inspirations**: Instant curated pantry presets with pre-tested recipes for immediate demonstration without waiting on network calls.
- **Dietary Tagging**: Automated ingredient-level dietary verification (Vegetarian, Vegan, Gluten-free, Dairy-free, Egg-free, Nut-free).
- **One-Click Share & Copy**: Copy clean recipe text formatted with timestamps, ingredients, and step-by-step instructions.
- **Accessible & Responsive**: Fully keyboard navigable, screen-reader friendly.

---

## 🏗 Architecture & Engineering Highlights

- **Edge Serverless Inference**: Deployed via Cloudflare Pages Functions using Cloudflare Workers AI (`@cf/meta/llama-3.1-8b-instruct-fp8`) for sub-second edge response times with zero client-side API keys.
- **Multi-Step Safety & Prompt Guardrails**:
  - *Food Validation*: Rejects non-edible inputs (`NOT_FOOD`) before recipe generation.
  - *Safety Check*: Refuses unsafe or hazardous combinations (`NO_SAFE_RECIPE`).
  - *Strict Markdown Contract*: Output format enforced to guarantee predictable client-side extraction.
  - *Prompt Injection Defense*: Isolates user input parameters from system instructions.
- **Zero-Friction Offline Development**: Custom Vite dev middleware (`devApiRecipePlugin` in `vite.config.ts`) mocks the edge API during local development so contributors can develop and test completely offline without cloud setup.
- **Defensive Client Parsing**: Tolerant streaming-compatible markdown parser that normalizes dietary tags against a strict canonical whitelist, strips markdown artifacts, and handles edge fallback.
- **User-Centric Error Handling**: Technical network failures, rate limits, and server timeouts are mapped into clear, friendly guidance instead of leaking raw exception traces.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Bundler & Tooling** | [Vite 8](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom Typography (`Playfair Display` + `Inter`) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Backend / Edge** | [Cloudflare Pages Functions](https://pages.cloudflare.com/) + [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) |
| **AI Model** | Meta Llama 3.1 8B Instruct FP8 (`@cf/meta/llama-3.1-8b-instruct-fp8`) |
| **Testing** | [Vitest](https://vitest.dev/) |
| **Linter** | [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`

### Development

Starts the Vite local development server with the offline mock API enabled:

```bash
npm run dev
```

---

## 📄 License

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)](LICENSE).
