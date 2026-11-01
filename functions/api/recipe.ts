interface Env {
  AI: any;
}

// Minimal PagesFunction typing for Cloudflare Pages Functions
type PagesFunction<T = unknown> = (context: {
  request: Request;
  env: T;
  params?: Record<string, string | string[]>;
  data?: Record<string, unknown>;
  next?: () => Promise<Response>;
  waitUntil?: (promise: Promise<unknown>) => void;
}) => Promise<Response>;

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const body = (await request.json()) as {
      ingredients?: string[];
      energy?: string;
      vibe?: string;
    };
    const { ingredients } = body;
    const energy = body.energy || body.vibe || 'Cozy';

    // Safety guardrail: reject empty or excessive input
    if (!Array.isArray(ingredients) || ingredients.length === 0 || ingredients.length > 12) {
      return Response.json(
        { error: 'Please select between 1 and 12 ingredients.' },
        { status: 400 }
      );
    }

    // Call Cloudflare's serverless AI at the edge
    const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fp8', {
      messages: [
        {
          role: 'system',
          content: `You are FridgeLab AI, a cozy and warm culinary assistant. Suggest one simple, comforting dish using the provided pantry ingredients and energy level.
Format strictly in clean Markdown:
### [Dish Name]
- **Effort:** [e.g. 5 mins, 1 pan]
- **Ingredients Used:** [items]
- **Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]
- **Chef's Cozy Tip:** [One warm tip]

If any item is clearly not edible food, reply with exactly: NOT_FOOD`,
        },
        {
          role: 'user',
          content: `Ingredients: ${ingredients.join(', ')}. Energy level: ${energy}`,
        },
      ],
      max_tokens: 350,
      temperature: 0.6,
    });

    return Response.json({ result: response.response });
  } catch (err: any) {
    console.error('Cloudflare Workers AI error:', err);
    return Response.json(
      { error: 'The kitchen is taking a quick nap. Please try again!' },
      { status: 500 }
    );
  }
};
