import type { Env, PipelineParams, PipelineState } from './types';
import { DbirPipeline } from './workflow';

export type { PipelineState, PipelineParams };
export { DbirPipeline };

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const method = req.method;
    const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };

    if (method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

    try {
      // Health check
      if (method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
        return json({ status: 'ok', version: '0.2.0', worker: 'dbir-agents' }, corsHeaders);
      }

      // Start pipeline
      if (method === 'POST' && url.pathname === '/pipeline/run') {
        const body: PipelineParams = req.body ? (await req.json().catch(() => ({})) as PipelineParams) : {};
        const runId = crypto.randomUUID();

        try {
          const dbirPipeline = new DbirPipeline(env, runId, body.topics || [], body);
          await dbirPipeline.invoke(body);
          return json({ id: runId, statusUrl: `/pipeline/${runId}` }, corsHeaders, 202);
        } catch (err) {
          return json({ error: err instanceof Error ? err.message : 'Pipeline failed to start' }, corsHeaders, 500);
        }
      }

      // Pipeline status
      if (method === 'GET' && url.pathname.startsWith('/pipeline/')) {
        const id = url.pathname.split('/pipeline/')[1]?.split('/')[0];
        if (!id) return json({ error: 'Missing pipeline ID' }, corsHeaders, 400);
        
        try {
          const pipelineRecord = await env.DB.prepare('SELECT * FROM pipeline_runs WHERE id = ?').bind(id).first();
          const status = pipelineRecord;
          if (!status) return json({ error: 'Pipeline not found' }, corsHeaders, 404);
          return json(status, corsHeaders);
        } catch (err) {
          return json({ error: err instanceof Error ? err.message : 'Pipeline not found' }, corsHeaders, 404);
        }
      }

      // List artifacts for a pipeline
      if (method === 'GET' && url.pathname.match(/^\/pipeline\/.+\//)) {
        const id = url.pathname.split('/')[2];
        const { results } = await env.DB.prepare('SELECT id, topic_id, step_name, artifact_type, model_used, tokens_in, tokens_out, cost, created_at FROM artifacts WHERE pipeline_run_id = ? ORDER BY created_at').bind(id).all();
        return json(results || [], corsHeaders);
      }

      // Get specific artifact
      if (method === 'GET' && url.pathname.startsWith('/artifacts/')) {
        const id = url.pathname.split('/')[1];
        const artifact = await env.DB.prepare('SELECT * FROM artifacts WHERE id = ?').bind(id).first();
        if (!artifact) return json({ error: 'Artifact not found' }, corsHeaders, 404);
        return json(artifact, corsHeaders);
      }

      // List completed reports
      if (method === 'GET' && url.pathname === '/reports') {
        const { results } = await env.DB.prepare("SELECT id, topic_id, status, created_at, updated_at, total_cost FROM pipeline_runs WHERE status = 'completed' ORDER BY created_at DESC").all();
        return json(results || [], corsHeaders);
      }

      return json({ error: 'Not found', path: url.pathname }, corsHeaders, 404);
    } catch (err) {
      console.error('[Worker] unhandled error:', err);
      return json({ error: err instanceof Error ? err.message : 'Internal error' }, corsHeaders, 500);
    }
  },
};

function json(unknown: unknown, headers: Record<string, string>, status = 200): Response {
  return new Response(JSON.stringify(unknown, null, 2), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}