-- D1 schema for dbir-agents pipeline

CREATE TABLE IF NOT EXISTS pipeline_runs (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  steps_completed INTEGER DEFAULT 0,
  total_cost REAL DEFAULT 0,
  model_used TEXT,
  error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_pipeline_runs_topic ON pipeline_runs(topic_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_status ON pipeline_runs(status);

CREATE TABLE IF NOT EXISTS artifacts (
  id TEXT PRIMARY KEY,
  pipeline_run_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  step_name TEXT NOT NULL,
  artifact_type TEXT NOT NULL,
  content TEXT,
  r2_key TEXT,
  model_used TEXT,
  tokens_in INTEGER DEFAULT 0,
  tokens_out INTEGER DEFAULT 0,
  cost REAL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (pipeline_run_id) REFERENCES pipeline_runs(id)
);

CREATE INDEX IF NOT EXISTS idx_artifacts_pipeline ON artifacts(pipeline_run_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_topic ON artifacts(topic_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_type ON artifacts(artifact_type);

CREATE TABLE IF NOT EXISTS extraction_cache (
  year INTEGER PRIMARY KEY,
  page_count INTEGER,
  char_count INTEGER,
  text_key TEXT,
  pages_key TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cost_tracking (
  id TEXT PRIMARY KEY,
  pipeline_run_id TEXT,
  topic_id TEXT NOT NULL,
  step_name TEXT NOT NULL,
  model_used TEXT NOT NULL,
  tokens_in INTEGER DEFAULT 0,
  tokens_out INTEGER DEFAULT 0,
  cost REAL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (pipeline_run_id) REFERENCES pipeline_runs(id)
);

CREATE INDEX IF NOT EXISTS idx_cost_tracking_pipeline ON cost_tracking(pipeline_run_id);
CREATE INDEX IF NOT EXISTS idx_cost_tracking_topic ON cost_tracking(topic_id);

CREATE TABLE IF NOT EXISTS report_metadata (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL,
  title TEXT,
  word_count INTEGER,
  diagram_count INTEGER DEFAULT 0,
  source_count INTEGER DEFAULT 0,
  published_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (topic_id) REFERENCES pipeline_runs(topic_id)
);
