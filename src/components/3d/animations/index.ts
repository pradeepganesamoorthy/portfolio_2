// Export all hero animations
export { ParticlesTorus } from './ParticlesTorus'
export { FloatingOrbs } from './FloatingOrbs'
// Data Engineering themed animations
export { DataFlowPipeline } from './DataFlowPipeline'
export { DatabaseClusters } from './DatabaseClusters'
export { ETLStream } from './ETLStream'
export { NeuralMesh } from './NeuralMesh'
export { DataVortex } from './DataVortex'
export { CloudNodes } from './CloudNodes'
export { StreamProcessor } from './StreamProcessor'
export { SchemaGraph } from './SchemaGraph'
export { BigQueryGlobe } from './BigQueryGlobe'

// Animation metadata
export const ANIMATION_META = [
  { id: 'default',             name: 'Particles & Torus',   emoji: '✨', desc: 'Classic floating particles with spinning torus rings' },
  { id: 'data-flow-pipeline',  name: 'Data Flow Pipeline',  emoji: '🔀', desc: 'ETL pipeline with data packets flowing between nodes' },
  { id: 'database-clusters',   name: 'Database Clusters',   emoji: '🗄️', desc: 'DB stacks — BigQuery, PostgreSQL, Redis with query packets' },
  { id: 'etl-stream',          name: 'ETL Stream',          emoji: '⚙️', desc: 'Extract → Transform → Load stages with streaming particles' },
  { id: 'neural-mesh',         name: 'Neural Mesh',         emoji: '🧠', desc: 'ML-style connected nodes with signal pulses' },
  { id: 'data-vortex',         name: 'Data Vortex',         emoji: '🌀', desc: 'Swirling data tornado — high-throughput ingestion feel' },
  { id: 'cloud-nodes',         name: 'Cloud Architecture',  emoji: '☁️', desc: 'GCP/AWS zone layout with datacenter nodes' },
  { id: 'stream-processor',    name: 'Stream Processor',    emoji: '📨', desc: 'Kafka producers, brokers, consumers — message streaming' },
  { id: 'schema-graph',        name: 'Schema Graph',        emoji: '🗃️', desc: 'ER diagram tables with FK connections + queries' },
  { id: 'bigquery-globe',      name: 'BigQuery Globe',      emoji: '🌐', desc: 'Globe with GCP datacenter nodes and query beams' },
  { id: 'floating-orbs',       name: 'Floating Orbs',       emoji: '🫧', desc: 'Glowing theme-colored spheres in 3D space' },
]
