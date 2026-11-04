import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/**
 * Local dev middleware so `npm run dev` responds to `/api/recipe`
 * without requiring a deployed Cloudflare environment during offline development.
 */
function devApiRecipePlugin(): Plugin {
  return {
    name: 'dev-api-recipe',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/recipe' && req.method === 'POST') {
          let rawBody = ''
          req.on('data', (chunk) => {
            rawBody += chunk
          })
          req.on('end', () => {
            try {
              const body = JSON.parse(rawBody || '{}')
              const { ingredients = [], energy = 'Cozy' } = body
              if (!Array.isArray(ingredients) || ingredients.length < 2 || ingredients.length > 12) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Please select between 2 and 12 ingredients.' }))
                return
              }

              const nonEdiblePattern = /\b(car|cars|vehicle|truck|metal|plastic|glass|paper|wood|rock|stone|dirt|poison|gasoline|petrol|diesel|bleach|detergent|battery|batteries|shoe|shoes|sock|socks|clothes|phone|laptop)\b/i
              if (ingredients.some((i: unknown) => typeof i === 'string' && nonEdiblePattern.test(i))) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'NOT_FOOD' }))
                return
              }

              const ingList = ingredients.join(', ')
              const titleItem = ingredients[0] || 'Pantry'
              const mockResult = `### Cozy ${titleItem} Skillet\n- **Effort:** ${energy}\n- **Ingredients Used:** ${ingList}\n- **Steps:**\n1. Prep and roughly chop the ${ingredients.slice(0, 2).join(' and ') || 'ingredients'}.\n2. Warm a medium skillet over gentle heat with a dab of butter or olive oil.\n3. Sauté everything together until fragrant, golden, and heated through (approx. 5-7 minutes).\n- **Chef's Cozy Tip:** Season generously at the very end to keep the flavours bright and comforting.`

              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ result: mockResult }))
            } catch {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Invalid JSON request body.' }))
            }
          })
          return
        }
        next()
      })
    },
  }
}

import pkg from './package.json' with { type: 'json' }

export default defineConfig({
  plugins: [react(), tailwindcss(), devApiRecipePlugin()],
  build: { target: 'esnext' },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
})

