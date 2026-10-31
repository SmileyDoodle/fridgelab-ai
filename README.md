# FridgeLab AI 🍳

A 100% client-side, zero-cost pantry recipe generator that runs open-weight LLMs locally in your browser using **Transformers.js (v3)** and **WebGPU**. No backend servers, no API keys, and no subscription fees.

---

## Features

- **Local & Private:** Inference runs directly on the user's device via `onnx-community/Qwen2.5-0.5B-Instruct`. No data leaves the browser.
- **Hardware Acceleration:** Leverages WebGPU for fast local inference with seamless fallback to multi-threaded CPU / WASM.
- **Non-Blocking UI:** Heavy model loading and token streaming are offloaded to a dedicated Web Worker (`worker.ts`), keeping the main thread and UI responsive.
- **Cache Persistence & Management:** Model weights are stored in browser Cache Storage upon initial download and loaded instantly on subsequent visits. Includes an integrated storage management tool to inspect and clear cached models.
- **Cozy UX:** Curated quick-select emoji ingredients, custom ingredient chip inputs, effort level toggles, and live markdown recipe card formatting.

---

## Architecture & Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 + Lucide React
- **ML Runtime:** `@huggingface/transformers` (Transformers.js v3) with ONNX Runtime Web
- **Thread Model:**
  - `src/worker.ts`: Background pipeline initialization, weight download progress tracking, and token streaming.
  - `src/hooks/useCozyAI.ts`: State management and message passing between worker and React components.
  - `src/components/ModelStorage.tsx`: Direct Cache Storage interface for inspecting and clearing cached ONNX assets.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- A modern browser with WebGPU support (Chrome, Edge, Brave, or Chromium-based browsers) or standard modern browsers for WASM fallback.

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd <project-folder>

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

The dev server will start at `http://localhost:5173`. Cross-origin isolation headers (`Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy: credentialless`) are configured in `vite.config.ts` to allow `SharedArrayBuffer` for multi-threaded WASM execution while maintaining external asset accessibility.

### Production Build

```bash
npm run build
npm run preview
```

---

## License

MIT
