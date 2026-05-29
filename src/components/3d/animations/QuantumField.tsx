'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { colors?: string[]; speed?: number }

// Quantum field — grid of pulsing pillars like a 3D histogram / data bars
export function QuantumField({ colors, speed = 1 }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const instRef  = useRef<THREE.InstancedMesh>(null)
  const c = colors || ['#c77dff', '#4d96ff', '#ff6b6b', '#ffd93d', '#6bcb77']

  const COLS = 14, ROWS = 14
  const COUNT = COLS * ROWS
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const phases = useMemo(() =>
    Array.from({ length: COUNT }, () => Math.random() * Math.PI * 2), [COUNT])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05
      groupRef.current.rotation.x = Math.sin(t * 0.03) * 0.25
    }
    if (instRef.current) {
      for (let i = 0; i < COUNT; i++) {
        const col = i % COLS
        const row = Math.floor(i / COLS)
        const x = (col - COLS/2) * 0.9
        const z = (row - ROWS/2) * 0.9
        const wave = Math.sin(col * 0.5 + t * 1.2) * Math.cos(row * 0.5 + t * 0.9)
        const h = 0.1 + ((wave + 1) / 2) * 2.5
        dummy.position.set(x, h / 2 - 1.5, z)
        dummy.scale.set(0.55, h, 0.55)
        dummy.updateMatrix()
        instRef.current.setMatrixAt(i, dummy.matrix)
        // Color gradient based on height
        const norm = (wave + 1) / 2
        const col3 = new THREE.Color(c[Math.floor(norm * (c.length - 1))])
        instRef.current.setColorAt(i, col3)
      }
      instRef.current.instanceMatrix.needsUpdate = true
      if (instRef.current.instanceColor) instRef.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef}>
      <instancedMesh ref={instRef} args={[undefined, undefined, COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial emissiveIntensity={0.5} toneMapped={false} />
      </instancedMesh>

      {/* Ground grid plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[14, 14, 13, 13]} />
        <meshBasicMaterial color={c[1]} wireframe transparent opacity={0.1} />
      </mesh>

      <ambientLight intensity={0.15} />
      <pointLight color={c[0]} intensity={3} position={[0, 8, 0]} />
      <pointLight color={c[2]} intensity={2} position={[6, 2, 6]} />
      <pointLight color={c[1]} intensity={2} position={[-6, 2, -6]} />
    </group>
  )
}
