'use client'
import { Canvas } from '@react-three/fiber'
import { ParticleField } from './ParticleField'
import { Suspense } from 'react'

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 60 }}
      style={{ position: 'absolute', inset: 0 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <ParticleField count={1800} />
      </Suspense>
    </Canvas>
  )
}
