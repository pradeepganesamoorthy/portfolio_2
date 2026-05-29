'use client'
import { Canvas } from '@react-three/fiber'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

const ParticleField    = dynamic(() => import('./ParticleField').then(m=>m.ParticleField),{ssr:false})
const ParticlesTorus   = dynamic(() => import('./animations/ParticlesTorus').then(m=>m.ParticlesTorus),{ssr:false})
const FloatingOrbs     = dynamic(() => import('./animations/FloatingOrbs').then(m=>m.FloatingOrbs),{ssr:false})
const DataFlowPipeline = dynamic(() => import('./animations/DataFlowPipeline').then(m=>m.DataFlowPipeline),{ssr:false})
const DatabaseClusters = dynamic(() => import('./animations/DatabaseClusters').then(m=>m.DatabaseClusters),{ssr:false})
const ETLStream        = dynamic(() => import('./animations/ETLStream').then(m=>m.ETLStream),{ssr:false})
const NeuralMesh       = dynamic(() => import('./animations/NeuralMesh').then(m=>m.NeuralMesh),{ssr:false})
const DataVortex       = dynamic(() => import('./animations/DataVortex').then(m=>m.DataVortex),{ssr:false})
const CloudNodes       = dynamic(() => import('./animations/CloudNodes').then(m=>m.CloudNodes),{ssr:false})
const StreamProcessor  = dynamic(() => import('./animations/StreamProcessor').then(m=>m.StreamProcessor),{ssr:false})
const SchemaGraph      = dynamic(() => import('./animations/SchemaGraph').then(m=>m.SchemaGraph),{ssr:false})
const BigQueryGlobe    = dynamic(() => import('./animations/BigQueryGlobe').then(m=>m.BigQueryGlobe),{ssr:false})
const MorphingGeometry = dynamic(() => import('./animations/MorphingGeometry').then(m=>m.MorphingGeometry),{ssr:false})
const QuantumField     = dynamic(() => import('./animations/QuantumField').then(m=>m.QuantumField),{ssr:false})
const DNADouble        = dynamic(() => import('./animations/DNADouble').then(m=>m.DNADouble),{ssr:false})
// 5 new professional animations
const CosmicRibbon     = dynamic(() => import('./animations/CosmicRibbon').then(m=>m.CosmicRibbon),{ssr:false})
const GravityWell      = dynamic(() => import('./animations/GravityWell').then(m=>m.GravityWell),{ssr:false})
const CrystalLattice   = dynamic(() => import('./animations/CrystalLattice').then(m=>m.CrystalLattice),{ssr:false})
const PlasmaField      = dynamic(() => import('./animations/PlasmaField').then(m=>m.PlasmaField),{ssr:false})
const InterstellarDust = dynamic(() => import('./animations/InterstellarDust').then(m=>m.InterstellarDust),{ssr:false})

interface Cfg { selectedAnimation:string; animationSpeed:'slow'|'normal'|'fast'; useThemeColors:boolean }
type AnimProps = { colors?:string[]; speed?:number }

const animMap: Record<string, React.ComponentType<AnimProps>> = {
  'particles-torus':    ParticlesTorus,
  'floating-orbs':      FloatingOrbs,
  'data-flow-pipeline': DataFlowPipeline,
  'database-clusters':  DatabaseClusters,
  'etl-stream':         ETLStream,
  'neural-mesh':        NeuralMesh,
  'data-vortex':        DataVortex,
  'cloud-nodes':        CloudNodes,
  'stream-processor':   StreamProcessor,
  'schema-graph':       SchemaGraph,
  'bigquery-globe':     BigQueryGlobe,
  'morphing-geometry':  MorphingGeometry,
  'quantum-field':      QuantumField,
  'dna-double':         DNADouble,
  'cosmic-ribbon':      CosmicRibbon,
  'gravity-well':       GravityWell,
  'crystal-lattice':    CrystalLattice,
  'plasma-field':       PlasmaField,
  'interstellar-dust':  InterstellarDust,
}

function getColors() {
  return (window as any).__themeColors ?? ['#c77dff','#4d96ff','#ff6b6b','#ffd93d','#6bcb77']
}
function getSpeed(s:'slow'|'normal'|'fast'){ return s==='slow'?.5:s==='fast'?2:1 }

function Anim({ cfg }:{ cfg:Cfg }) {
  const colors = cfg.useThemeColors ? getColors() : undefined
  const speed  = getSpeed(cfg.animationSpeed)
  const Comp   = animMap[cfg.selectedAnimation]
  if (!Comp) return <ParticleField count={1800} />
  return <Comp colors={colors} speed={speed} />
}

export function Scene() {
  const [cfg, setCfg]     = useState<Cfg>({ selectedAnimation:'default', animationSpeed:'normal', useThemeColors:true })
  const [ready, setReady] = useState(false)
  const lastKey           = useRef('')

  const load = useCallback(async () => {
    try {
      const res  = await fetch('/api/animation', { cache:'no-store' })
      if (!res.ok) return
      const { config } = await res.json() as { config?: Cfg }
      if (!config) return
      const key = `${config.selectedAnimation}-${config.animationSpeed}-${config.useThemeColors}`
      if (key !== lastKey.current) { lastKey.current=key; setCfg(config) }
    } catch { /* keep previous */ }
  }, [])

  useEffect(() => {
    let mounted = true
    load().then(() => { if (mounted) setReady(true) })
    const id = setInterval(load, 5000)
    return () => { mounted=false; clearInterval(id) }
  }, [load])

  if (!ready) return null

  return (
    <Canvas camera={{position:[0,0,12],fov:60}} style={{position:'absolute',inset:0}} gl={{antialias:true,alpha:true}} dpr={[1,2]}>
      <Suspense fallback={null}><Anim cfg={cfg}/></Suspense>
    </Canvas>
  )
}
