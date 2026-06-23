import type { Env, AiMessage, AiResponse } from '../types';

const MODEL_COST_PER_1K_IN = { '@cf/moonshotai/kimi-k2.6': 0.0015, '@cf/meta/llama-3.1-8b-instruct': 0.0003, '@cf/meta/llama-3.2-1b-instruct': 0.0001, '@cf/meta/llama-3.2-3b-instruct': 0.0002 };
const MODEL_COST_PER_1K_OUT = { '@cf/moonshotai/kimi-k2.6': 0.0020, '@cf/meta/llama-3.1-8b-instruct': 0.0006, '@cf/meta/llama-3.2-1b-instruct': 0.0002, '@cf/meta/llama-3.2-3b-instruct': 0.0003 };

const FALLBACK_CHAIN = [
  '@cf/moonshotai/kimi-k2.6',
  '@cf/meta/llama-3.1-8b-instruct',
  '@cf/meta/llama-3.2-1b-instruct',
  '@cf/meta/llama-3.2-3b-instruct',
  '@cf/meta/phi-3-mini-4k-instruct'
];

async function cacheResult(env: Env, key: string, result: AiResponse, model: string): Promise<void> {
  try {
    const cost = result.cost;
    await env.DB.prepare('INSERT OR REPLACE INTO ai_cache (id, model, system, user, response, tokens_in, tokens_out, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime("now"))')
      .bind(key, model, '', '', result.response, result.tokensIn, result.tokensOut, cost)
      .run();
    console.log(`[AI Cache] Stored: ${model}`);
  } catch (e) {
    console.warn('[AI Cache] Write failed', e);
  }
}

export async function callAiWithCache(
  env: Env,
  system: string,
  user: string,
  options?: { model?: string; maxTokens?: number; temperature?: number }
): Promise<AiResponse> {
  const model = options?.model || env.PRIMARY_MODEL || FALLBACK_CHAIN[0];
  const maxTokens = parseInt(options?.maxTokens?.toString() || env.MAX_TOKENS || '4096');
  const temperature = parseFloat(options?.temperature?.toString() || env.TEMPERATURE || '0.3');

  const cacheKey = await generateCacheKey(env, system, user, model);

  try {
    const cached = await env.DB.prepare('SELECT response, tokens_in, tokens_out, model FROM ai_cache WHERE id = ? AND created_at > datetime("now", "-24 hours")')
      .bind(cacheKey)
      .first();
    if (cached) {
      console.log(`[AI Cache] HIT: ${model}`);
      return {
        response: cached.response as string,
        tokensIn: cached.tokens_in as number,
        tokensOut: cached.tokens_out as number,
        model: cached.model as string,
        cost: 0
      };
    }
  } catch (e) {
    console.warn('[AI Cache] Read failed, continuing to AI model', e);
  }

  console.log(`[AI Cache] MISS: ${model}, calling AI...`);

  const messages: AiMessage[] = [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];

  let error: Error | null = null;
  for (const model of FALLBACK_CHAIN) {
    try {
      const result = await tryModel(env, model, messages, maxTokens, temperature);
      if (result) {
        await cacheResult(env, cacheKey, result, model);
        return result;
      }
    } catch (e) {
      error = e as Error;
    }
  }

  throw new Error(`All models failed: ${error?.message}`);
}

async function generateCacheKey(env: Env, system: string, user: string, model: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${model}:${system}:${user}`));
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .substring(0, 16);
}

async function tryModel(
  env: Env,
  model: string,
  messages: AiMessage[],
  maxTokens: number,
  temperature: number
): Promise<AiResponse | null> {
  try {
    const response = await env.AI.run(model, {
      messages: messages,
      max_tokens: maxTokens,
      temperature,
      stream: false,
    });

    const text = typeof (response as any).response === 'string'
      ? (response as any).response
      : (response as any).text || JSON.stringify(response);

    const usage = (response as any).usage || {};
    const tokensIn = (usage.prompt_tokens || usage.input_tokens || 0) as number;
    const tokensOut = (usage.completion_tokens || usage.output_tokens || 0) as number;

    const costIn = ((tokensIn / 1000) * (MODEL_COST_PER_1K_IN[model as keyof typeof MODEL_COST_PER_1K_IN] || 0.001));
    const costOut = ((tokensOut / 1000) * (MODEL_COST_PER_1K_OUT[model as keyof typeof MODEL_COST_PER_1K_OUT] || 0.001));

    return {
      response: text,
      tokensIn,
      tokensOut,
      model,
      cost: costIn + costOut,
    };
  } catch (err) {
    console.error(`[AI] Model ${model} failed:`, err);
    return null;
  }
}