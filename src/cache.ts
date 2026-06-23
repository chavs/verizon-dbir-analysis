interface CACHED_AI_REQUEST {
  model: string;
  system: string;
  user: string;
}

interface CACHED_AI_RESPONSE {
  response: string;
  tokensIn: number;
  tokensOut: number;
  model: string;
  model_type: 'response' | 'summary' | 'explanation';
  created_at: string;
}

interface CacheRequest {
  type: string;
  key: string;
  data?: any;
}

export class AICache {
  private state: DurableObjectState;
  private env: any;

  constructor(state: DurableObjectState, env: any) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'POST') {
      const { type, key, data }: { type: string; key: string; any } = await request.json();

if (type === 'store' && key && data) {
        await this.store(key, data);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }

      if (type === 'get' && key) {
        const cached = await this.state.storage.get<CACHED_AI_RESPONSE>(key);
        if (cached) {
          return new Response(JSON.stringify(cached), { status: 200 });
        }
        return new Response(JSON.stringify({ cached: false }), { status: 200 });
      }

      if (type === 'get' && key) {
        const cached = await this.state.storage.get<CACHED_AI_RESPONSE>(key);
        if (cached) {
          return new Response(JSON.stringify(cached), { status: 200 });
        }
        return new Response(JSON.stringify({ cached: false }), { status: 200 });
      }

      if (type === 'delete' && key) {
        await this.state.storage.delete(key);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }

      if (type === 'cleanup') {
        await this.cleanup();
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }

      return new Response('Invalid request', { status: 400 });
    }

    return new Response('Method not allowed', { status: 405 });
  }

  private async generateCacheKey(request: CACHED_AI_REQUEST): Promise<string> {
    const { model, system, user } = request;
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${model}:${system}:${user}`));
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .substring(0, 16);
  }

  private async store(key: string, cached: CACHED_AI_RESPONSE): Promise<void> {
    // Store with timestamp
    this.state.storage.put(key, {
      ...cached,
      created_at: new Date().toISOString()
    });

    // Clean up old entries periodically (maintain max 1000 entries)
    const entries = await this.state.storage.list<CACHED_AI_RESPONSE>();
    let count = 0;
    for await (const _ of entries.values()) {
      count++;
      if (count > 1000) {
        await this.state.storage.delete(key);
      }
    }
  }

  private async cleanup(): Promise<void> {
    // Delete entries older than 24 hours
    const entries = await this.state.storage.list<CACHED_AI_RESPONSE>();
    const now = Date.now();
    for await (const entry of entries.values()) {
      const createdAt = new Date(entry.created_at).getTime();
      if (now - createdAt > 24 * 60 * 60 * 1000) {
        await this.state.storage.delete(entry.key);
      }
    }
  }
}