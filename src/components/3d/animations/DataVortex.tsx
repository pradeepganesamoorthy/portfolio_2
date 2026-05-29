'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { colors?: string[]; speed?: number }

export function DataVortex({ colors, speed = 1 }: Props) {
  const pointsRef = useRef<THREE.Points>(null)
  const ringsRef = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)]
  const c = colors || ['#c77dff', '#4d96ff', '#ff6b6b', '#ffd93d', '#6bcb77', '#ff9a3c']

  const COUNT = 2000
  const { positions, cols, phases, radii } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const cols = new Float32Array(COUNT * 3)
    const phases = new Float32Array(COUNT)
    const radii = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = Math.random() * 6 + 0.5
      const h = (Math.random() - 0.5) * 12
      positions[i * 3] = Math.cos(angle) * r
      positions[i * 3 + 1] = h
      positions[i * 3 + 2] = Math.sin(angle) * r
      phases[i] = angle
      radii[i] = r
      const col = new THREE.Color(c[i % c.length])
      cols[i * 3] = col.r; cols[i * 3 + 1] = col.g; cols[i * 3 + 2] = col.b
    }
    return { positions, cols, phases, radii }
  }, [c])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < COUNT; i++) {
        const angularSpeed = (1 / radii[i]) * 0.8 * speed
        phases[i] += angularSpeed * 0.016
        const taper = (1 - Math.abs(pos[i * 3 + 1] / 6)) * 0.8 + 0.2
        pos[i * 3] = Math.cos(phases[i]) * radii[i] * taper
        pos[i * 3 + 2] = Math.sin(phases[i]) * radii[i] * taper
        // Drift upward, wrap
        pos[i * 3 + 1] += 0.02 * speed
        if (pos[i * 3 + 1] > 6) pos[i * 3 + 1] = -6
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }

    ringsRef.forEach((ref, i) => {
      if (ref.current) {
        ref.current.rotation.y = t * (0.3 + i * 0.15)
        ref.current.rotation.x = t * (0.2 - i * 0.1)
      }
    })
  })

  return (
    <>
      {/* Vortex particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={positions} count={COUNT} itemSize={3} />
          <bufferAttribute attach="attributes-color" array={cols} count={COUNT} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.06} vertexColors transparent opacity={0.75} sizeAttenuation />
      </points>

      {/* Spinning rings at different heights */}
      {[[-3, 2.5], [0, 4], [3, 1.8]].map(([y, r], i) => (
        <mesh key={i} ref={ringsRef[i]} position={[0, y, 0]}>
          <torusGeometry args={[r, 0.04, 8, 60]} />
          <meshBasicMaterial color={c[i % c.length]} transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Central data core */}
      <DataCore color={c[0]} speed={speed} />

      <ambientLight intensity={0.15} />
      <pointLight color={c[0]} intensity={2.5} position={[0, 0, 0]} />
      <pointLight color={c[2]} intensity={1} position={[0, 8, 0]} />
    </>
  )
}

function DataCore({ color, speed }: { color: string; speed: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.elapsedTime * 0.5 * speed
      ref.current.rotation.y = clock.elapsedTime * 0.3 * speed
      const s = 1 + Math.sin(clock.elapsedTime * 2) * 0.1
      ref.current.scale.setScalar(s)
    }
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.8, 1]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.9} wireframe />
    </mesh>
  )
}
