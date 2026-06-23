import type { Env, AiMessage, AiResponse } from '../types';

export { callAiWithCache } from './ai-cache';

const FALLBACK_CHAIN = [
  '@cf/moonshotai/kimi-k2.6',
  '@cf/meta/llama-3.1-8b-instruct',
  '@cf/meta/llama-3.2-1b-instruct',
  '@cf/meta/llama-3.2-3b-instruct',
  '@cf/meta/phi-3-mini-4k-instruct'
];
const MODEL_COST_PER_1K_IN = { '@cf/moonshotai/kimi-k2.6': 0.0015, '@cf/meta/llama-3.1-8b-instruct': 0.0003, '@cf/meta/llama-3.2-1b-instruct': 0.0001, '@cf/meta/llama-3.2-3b-instruct': 0.0002 };
const MODEL_COST_PER_1K_OUT = { '@cf/moonshotai/kimi-k2.6': 0.0020, '@cf/meta/llama-3.1-8b-instruct': 0.0006, '@cf/meta/llama-3.2-1b-instruct': 0.0002, '@cf/meta/llama-3.2-3b-instruct': 0.0003 };

export async function callAi(
  env: Env,
  system: string,
  user: string,
  options?: { model?: string; maxTokens?: number; temperature?: number }
): Promise<AiResponse> {
  const primaryModel = options?.model || env.PRIMARY_MODEL || FALLBACK_CHAIN[0];
  const maxTokens = parseInt(options?.maxTokens?.toString() || env.MAX_TOKENS || '4096');
  const temperature = parseFloat(options?.temperature?.toString() || env.TEMPERATURE || '0.3');

  const messages: AiMessage[] = [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];

  let error: Error | null = null;

  for (const model of FALLBACK_CHAIN) {
    try {
      console.log(`[AI] Trying ${model}`);
      const result = await tryModel(env, model, messages, maxTokens, temperature);
      if (result) return result;
    } catch (e) {
      error = e as Error;
    }
  }

  throw new Error(`All ${FALLBACK_CHAIN.length} models failed: ${error?.message}`);
}

async function tryModel(
  env: Env,
  model: string,
  messages: AiMessage[],
  maxTokens: number,
  temperature: number
): Promise<AiResponse | null> {
  try {
    const response = await env.AI.run(model as any, {
      messages: messages as any,
      max_tokens: maxTokens,
      temperature,
      stream: false,
    } as any);

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
