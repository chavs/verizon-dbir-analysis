export interface Env {
  AI: Ai;
  DBIR_PDFS: R2Bucket;
  DB: D1Database;
  VECTORIZE: VectorizeIndex;
  BROWSER: Fetcher;
  DBIR_PIPELINE: Workflow;
  PIPELINE_STATE: DurableObjectNamespace;
  PRIMARY_MODEL: string;
  FALLBACK_MODEL: string;
  MAX_TOKENS: string;
  TEMPERATURE: string;
  PIPELINE_MODE: string;
}

export interface PipelineParams {
  topics?: string[];
  mode?: 'sequential' | 'parallel';
  startFromStep?: number;
}

export interface PipelineStatus {
  id: string;
  topicId: string;
  status: 'pending' | 'running' | 'step_completed' | 'completed' | 'failed';
  step: number;
  stepName: string;
  error?: string;
  modelUsed?: string;
  totalCost?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Artifact {
  id: string;
  pipelineRunId: string;
  topicId: string;
  stepName: string;
  artifactType: 'draft' | 'review' | 'diagram' | 'summary' | 'final';
  content?: string;
  r2Key?: string;
  modelUsed?: string;
  tokensIn: number;
  tokensOut: number;
  cost: number;
  createdAt: string;
}

export interface AiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiResponse {
  response: string;
  tokensIn: number;
  tokensOut: number;
  model: string;
  cost: number;
}

export const TOPICS = [
  { id: 'topic-1', slug: 'nhi', name: 'Non-Human Identities' },
  { id: 'topic-2', slug: 'supply-chain', name: 'Supply Chain Security' },
  { id: 'topic-3', slug: 'appsec', name: 'Application Security' },
  { id: 'topic-4', slug: 'vuln-remediation', name: 'Vulnerability Remediation' },
] as const;

export interface PipelineState {
  id: string;
  topics: string[];
  status: 'pending' | 'draft' | 'reviewed' | 'diagramed' | 'running' | 'completed' | 'failed';
  params: PipelineParams;
  currentStep: number;
  artifactCount: number;
  totalCost: number;
  costs: Record<string, number>;
  results: Record<string, string>;
  errors: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type TopicId = typeof TOPICS[number]['id'];
export type TopicSlug = typeof TOPICS[number]['slug'];

export interface PipelineState {
  id: string;
  topics: string[];
  status: 'pending' | 'draft' | 'reviewed' | 'diagramed' | 'running' | 'completed' | 'failed';
  params: PipelineParams;
  currentStep: number;
  artifactCount: number;
  totalCost: number;
  costs: Record<string, number>;
  results: Record<string, string>;
  errors: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const WORKFLOW_STEPS = [
  { step: 1, name: 'analyst-draft', persona: 'Persona #1 — Analyst' },
  { step: 2, name: 'reviewer-round-1', persona: 'Persona #2 — Reviewer' },
  { step: 3, name: 'analyst-revision', persona: 'Persona #1 — Analyst (revision)' },
  { step: 4, name: 'reviewer-round-2', persona: 'Persona #2 — Reviewer (round 2)' },
  { step: 5, name: 'diagrammer', persona: 'Persona #3 — Diagrammer' },
  { step: 6, name: 'pm-summary', persona: 'Persona #4 — PM' },
  { step: 7, name: 'publish', persona: 'System — Publishing' },
] as const;
