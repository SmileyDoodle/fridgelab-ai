import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Cross-origin isolation enables SharedArrayBuffer -> multi-threaded WASM fallback.
// `credentialless` (instead of `require-corp`) lets us still fetch model weights
// from the Hugging Face CDN without it needing to send CORP headers.
const isolationHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'credentialless',
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { headers: isolationHeaders },
  preview: { headers: isolationHeaders },
  // Workers must be ES modules so they can `import` transformers.js.
  worker: { format: 'es' },
  // Pre-bundling breaks onnxruntime-web's dynamic WASM loading.
  optimizeDeps: { exclude: ['@huggingface/transformers'] },
  build: { target: 'esnext' },
})
