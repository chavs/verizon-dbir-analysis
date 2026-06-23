import type { Env, PipelineParams } from './types';

type PipelineState = {
  get id(): string;
  id: string;
  topics: string[];
  status: 'pending' | 'draft' | 'reviewed' | 'diagramed' | 'finalized' | 'running' | 'completed' | 'failed';
  params: PipelineParams;
  currentStep: number;
  artifactCount: number;
  totalCost: number;
  costs: Record<string, number>;
  results: Record<string, string>;
  errors: string[];
  createdAt?: string;
  updatedAt?: string;
};

import { callAiWithCache } from './utils/ai';
import { buildAnalystSystem } from './utils/prompts';
import { buildReviewerSystem } from './utils/prompts';
import { buildDiagrammerSystem } from './utils/prompts';
import { buildPmSystem } from './utils/prompts';

export class DbirPipeline {
  private state: PipelineState;
  private env: Env;

  constructor(env: Env, id: string, topics: string[], params: PipelineParams = {}) {
    this.env = env;
    this.state = {
      id,
      topics,
      status: 'pending',
      params,
      currentStep: 1,
      artifactCount: 0,
      totalCost: 0,
      costs: {},
      results: {},
      errors: [],
    };
  }

getId(): string {
  return this.state.id;
}

  async invoke(params: PipelineParams = {}): Promise<void> {
    console.log(`[Workflow] Starting pipeline for topics: ${params.topics?.join(', ')}`);

    this.state = {
      ...this.state,
      params,
      topics: params.topics || [],
      currentStep: params.startFromStep || 1,
      status: 'running',
    };

    await this.stateExists();
    await this.updateState();
    await this.run();

    this.state.status = 'completed';
    await this.updateState();
  }

  private async stateExists() {
    try {
      const existing = await this.env.DB.prepare('SELECT id FROM pipeline_runs WHERE id = ?').bind(this.state.id).first();
      console.log(`[Workflow] State exists check for ${this.state.id}:`, existing ? 'found' : 'not found');
      if (!existing) {
        const topicId = this.state.topics?.[0] || 'default';
        const result = await this.env.DB.prepare('INSERT INTO pipeline_runs (id, topic_id, state, created_at, updated_at) VALUES (?, ?, ?, ?, ?)').bind(
          this.state.id,
          topicId,
          JSON.stringify(this.state),
          new Date().toISOString(),
          new Date().toISOString()
        ).run();
        console.log(`[Workflow] Inserted pipeline state:`, result);
      }
    } catch (e) {
      console.error(`[Workflow] Failed to ensure state exists:`, e);
    }
  }

  async get(id: string): Promise<PipelineState> {
    const row = await this.env.DB.prepare(`
      SELECT state FROM pipeline_runs WHERE id = ?
    `).bind(id).first() as { state: string } | null;

    if (!row) {
      throw new Error('Pipeline not found');
    }

    try {
      return JSON.parse(row.state) as PipelineState;
    } catch (e) {
      console.error(`[Workflow] Failed to parse state for ${id}:`, e);
      throw new Error('Invalid pipeline state');
    }
  }

  async saveArtifact(
    topicId: string,
    stepName: string,
    artifactType: string,
    modelUsed: string,
    content: string,
    tokensIn: number,
    tokensOut: number
  ) {
    const id = await crypto.randomUUID();
    const cost = ((tokensIn / 1000) * 0.001) + ((tokensOut / 1000) * 0.001);

    await this.env.DB.prepare(`
      INSERT INTO artifacts (
        id, pipeline_run_id, topic_id, step_name, artifact_type,
        model_used, tokens_in, tokens_out, cost, content, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      this.state.id,
      topicId,
      stepName,
      artifactType,
      modelUsed,
      tokensIn,
      tokensOut,
      cost,
      content,
      new Date().toISOString()
    ).run();

    this.state.artifactCount += 1;
    this.state.totalCost += cost;
    this.state.costs[stepName] = (this.state.costs[stepName] || 0) + cost;

    await this.updateState();
    return id;
  }

  private async updateState() {
    this.state.updatedAt = new Date().toISOString();
    await this.env.DB.prepare(`
      UPDATE pipeline_runs
      SET state = ?, updated_at = ?
      WHERE id = ?
    `).bind(JSON.stringify(this.state), this.state.updatedAt, this.state.id).run();
  }

  private async run() {
    try {
      const topicSlugs = this.state.topics.map((t) =>
        t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      );
      const topicNames = this.state.topics;

      // Phase 1-2: Process each topic (draft → review → revise → diagram)
      for (let i = 0; i < topicSlugs.length; i++) {
        await this.runTopic(topicSlugs[i], topicNames[i]);
      }

      // Phase 3: Generate executive summary after all topics complete
      this.state.status = 'finalized';
      await this.updateState();

      const execSummary = await this.generateExecSummary();
      if (execSummary) {
        await this.saveArtifact('exec-summary', 'pm-brief', 'executive-summary', this.env.PRIMARY_MODEL, execSummary.response, execSummary.tokensIn, execSummary.tokensOut);
        this.state.results.execSummary = execSummary.response;
      }

      this.state.status = 'completed';
      await this.updateState();
    } catch (err) {
      console.error(`[Workflow] Pipeline failed for ${this.state.id}:`, err instanceof Error ? err.message : String(err));
      this.state.status = 'failed';
      this.state.errors.push(err instanceof Error ? err.message : 'Unknown error');
      await this.updateState();
    }
  }

  private async runTopic(slug: string, topicName: string) {
    console.log(`[Workflow] Processing topic: ${topicName}`);

    const [existingDraft, existingReview] = await Promise.all([
      this.loadFromR2(slug, 'draft-v1'),
      this.loadFromR2(slug, 'review-round-1'),
    ]);

    // Generate draft-v1 if it doesn't already exist in R2
    const draftV1 = !existingDraft ? await this.generateDraft(slug, topicName, 'draft-v1', null, null) : { response: existingDraft, tokensIn: 0, tokensOut: 0 };
    if (draftV1) {
      await this.saveArtifact(slug, 'draft-v1', 'draft', this.env.PRIMARY_MODEL, draftV1.response, draftV1.tokensIn, draftV1.tokensOut);
      this.state.results.draftV1 = draftV1.response;
    }

    // Generate review if it doesn't already exist in R2
    const reviewV1 = !existingReview ? await this.generateReview(slug, topicName, draftV1?.response || null, null) : { response: existingReview, tokensIn: 0, tokensOut: 0 };
    if (reviewV1) {
      await this.saveArtifact(slug, 'review-round-1', 'review', this.env.PRIMARY_MODEL, reviewV1.response, reviewV1.tokensIn, reviewV1.tokensOut);
      this.state.results.reviewV1 = reviewV1.response;
    }

    const draftV2 = draftV1 && reviewV1 ? await this.generateDraft(slug, topicName, 'draft-v2', reviewV1.response, draftV1.response) : null;
    if (draftV2) {
      await this.saveArtifact(slug, 'draft-v2', 'draft', this.env.PRIMARY_MODEL, draftV2.response, draftV2.tokensIn, draftV2.tokensOut);
      this.state.results.draftV2 = draftV2.response;
    }

    const diagram = await this.generateDiagram(slug, topicName, draftV2?.response || draftV1?.response || 'No draft available');
    if (diagram) {
      await this.saveArtifact(slug, 'diagram', 'diagram', this.env.PRIMARY_MODEL, diagram.response, diagram.tokensIn, diagram.tokensOut);
      this.state.results.diagram = diagram.response;
    }

    console.log(`[Workflow] Completed topic: ${topicName}`);
  }

  private async loadFromR2(slug: string, version: string): Promise<string | null> {
    try {
      const stream = await this.env.DBIR_PDFS.get(`${slug}/${version}.md`);
      return stream?.text() || null;
    } catch (e) {
      console.error(`[Workflow] Failed to load from R2: ${slug}/${version}.md`, e);
      return null;
    }
  }

  private async generateDraft(
    slug: string,
    topicName: string,
    version: string,
    previousReview: string | null,
    existingDraft: string | null
  ) {
    console.log(`[Workflow] Generating draft ${version} for ${topicName}`);
    const result = await callAiWithCache(
      this.env,
      buildAnalystSystem(),
      this.buildDraftPrompt(topicName, slug, version, previousReview, existingDraft),
      { model: this.env.PRIMARY_MODEL }
    );
    return result;
  }

  private buildDraftPrompt(
    topicName: string,
    slug: string,
    version: string,
    previousReview: string | null,
    existingDraft: string | null
  ) {
    const common = `Topic: ${topicName} (slug: ${slug})\nDraft version: ${version}\n\nWrite this topic as a comprehensive draft document based on Verizon DBIR. Structure it with headings and sections. Keep it under 3000 words.`;

    return previousReview && existingDraft
      ? `Topic: ${topicName} (slug: ${slug})\nDraft version: ${version} — REVISION based on reviewer feedback.\n\nEXISTING DRAFT (${version}):\n${existingDraft}\n\nREVIEWER FEEDBACK TO ADDRESS:\n${previousReview}\n\nRevise the existing draft to address ALL blocking issues from the review. Keep the same structure. Stay under 3000 words. Mark changes vs ${version} in a header comment.`
      : common;
  }

private async generateReview(
    slug: string,
    topicName: string,
    draft: string | null,
    previousReview: string | null
  ) {
    console.log(`[Workflow] Generating review for ${topicName}`);
    return await callAiWithCache(
      this.env,
      buildReviewerSystem(),
      `Topic: ${topicName} (slug: ${slug})\\n\\nDraft to review:\\n${draft || 'No draft available'}\\n\\n${!previousReview ? 'Provide a critical review of this draft. Identify blocking issues, gaps, and areas for improvement. Then generate a second review based on this feedback.' : ''}`,
      { model: this.env.PRIMARY_MODEL }
    );
  }

private async generateDiagram(slug: string, topicName: string, content: string) {
    console.log(`[Workflow] Generating diagram for ${topicName}`);
    return await callAiWithCache(
      this.env,
      buildDiagrammerSystem(),
      `Topic: ${topicName} (slug: ${slug})\\n\\nContent for diagram:\\n${content}\\n\\nCreate an ASCII art diagram or biagram that visually represents the key relationships and processes. Keep it simple but informative.`,
      { model: this.env.PRIMARY_MODEL }
    );
  }

  private async generateExecSummary() {
    console.log(`[Workflow] Generating executive summary`);
    
    // Gather all final topic drafts
    const topics = Object.entries(this.state.results)
      .filter(([key]) => key.startsWith('draftV2') || key.startsWith('draftV1'))
      .map(([, content]) => content);
    
    if (topics.length === 0) {
      console.warn('[Workflow] No topic drafts found for exec summary');
      return null;
    }

    const prompt = `You have analyzed four DBIR topics. Here are the final analyses:

${topics.map((t, i) => `TOPIC ${i + 1}:\n${t.substring(0, 2000)}...\n`).join('\n')}

Synthesize these into an executive brief. Focus on cross-cutting trends and budget implications.`;

    return await callAiWithCache(
      this.env,
      buildPmSystem(),
      prompt,
      { model: this.env.PRIMARY_MODEL }
    );
  }
}