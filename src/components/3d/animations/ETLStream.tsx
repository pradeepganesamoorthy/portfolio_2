'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { colors?: string[]; speed?: number }

export function ETLStream({ colors, speed = 1 }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const c = colors || ['#c77dff', '#4d96ff', '#ff6b6b', '#ffd93d', '#6bcb77', '#ff9a3c']

  // Three main stages of ETL arranged in 3D
  const stages = useMemo(() => [
    { pos: [-5, 0, 0] as [number, number, number], color: c[0], label: 'EXTRACT', shape: 'tetra' },
    { pos: [0, 0, 0] as [number, number, number], color: c[1], label: 'TRANSFORM', shape: 'ico' },
    { pos: [5, 0, 0] as [number, number, number], color: c[2], label: 'LOAD', shape: 'cube' },
  ], [c])

  // Streams of particles flowing between stages
  const STREAM_COUNT = 120
  const streams = useMemo(() => Array.from({ length: STREAM_COUNT }, (_, i) => ({
    phase: i < 60 ? 0 : 1, // 0 = E→T, 1 = T→L
    t: Math.random(),
    spd: (0.005 + Math.random() * 0.01) * speed,
    yOff: (Math.random() - 0.5) * 2,
    zOff: (Math.random() - 0.5) * 2,
    col: new THREE.Color(c[i % c.length]),
  })), [c, speed])

  const stageRefs = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
  ]
  const inst0 = useRef<THREE.InstancedMesh>(null)
  const inst1 = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05
      groupRef.current.rotation.x = Math.sin(t * 0.04) * 0.15
    }

    stageRefs.forEach((ref, i) => {
      if (ref.current) {
        ref.current.rotation.x = t * (0.2 + i * 0.1)
        ref.current.rotation.y = t * (0.3 - i * 0.08)
        const pulse = 1 + Math.sin(t * 1.5 + i * 2) * 0.08
        ref.current.scale.setScalar(pulse)
      }
    })

    // Stream 0: Extract → Transform
    const s0 = streams.filter(s => s.phase === 0)
    if (inst0.current) {
      s0.forEach((s, i) => {
        s.t = (s.t + s.spd) % 1
        dummy.position.set(
          THREE.MathUtils.lerp(-5, 0, s.t),
          s.yOff * (1 - Math.abs(s.t - 0.5) * 2) * 0.5,
          s.zOff * Math.sin(s.t * Math.PI) * 0.5,
        )
        dummy.scale.setScalar(0.08)
        dummy.updateMatrix()
        inst0.current!.setMatrixAt(i, dummy.matrix)
      })
      inst0.current.instanceMatrix.needsUpdate = true
    }
    // Stream 1: Transform → Load
    if (inst1.current) {
      const s1 = streams.filter(s => s.phase === 1)
      s1.forEach((s, i) => {
        s.t = (s.t + s.spd) % 1
        dummy.position.set(
          THREE.MathUtils.lerp(0, 5, s.t),
          s.yOff * Math.sin(s.t * Math.PI) * 0.4,
          s.zOff * Math.sin(s.t * Math.PI) * 0.4,
        )
        dummy.scale.setScalar(0.1)
        dummy.updateMatrix()
        inst1.current!.setMatrixAt(i, dummy.matrix)
      })
      inst1.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef}>
      {/* Stage meshes */}
      <mesh ref={stageRefs[0]} position={stages[0].pos}>
        <tetrahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color={stages[0].color} emissive={stages[0].color} emissiveIntensity={0.5} transparent opacity={0.85} wireframe />
      </mesh>
      <mesh ref={stageRefs[1]} position={stages[1].pos}>
        <icosahedronGeometry args={[1.0, 0]} />
        <meshStandardMaterial color={stages[1].color} emissive={stages[1].color} emissiveIntensity={0.5} transparent opacity={0.85} wireframe />
      </mesh>
      <mesh ref={stageRefs[2]} position={stages[2].pos}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color={stages[2].color} emissive={stages[2].color} emissiveIntensity={0.5} transparent opacity={0.85} wireframe />
      </mesh>

      {/* Stream E→T */}
      <instancedMesh ref={inst0} args={[undefined, undefined, 60]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial color={c[0]} emissive={c[0]} emissiveIntensity={1.5} />
      </instancedMesh>

      {/* Stream T→L */}
      <instancedMesh ref={inst1} args={[undefined, undefined, 60]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial color={c[2]} emissive={c[2]} emissiveIntensity={1.5} />
      </instancedMesh>

      {/* Side field particles */}
      <SideParticles colors={c} />

      <ambientLight intensity={0.2} />
      <pointLight color={c[0]} intensity={2} position={[-5, 3, 3]} />
      <pointLight color={c[1]} intensity={2} position={[0, 4, -2]} />
      <pointLight color={c[2]} intensity={2} position={[5, -3, 2]} />
    </group>
  )
}

function SideParticles({ colors }: { colors: string[] }) {
  const ref = useRef<THREE.Points>(null)
  const { pos, col } = useMemo(() => {
    const count = 800
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14
      const c = new THREE.Color(colors[i % colors.length])
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
    }
    return { pos, col }
  }, [colors])
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.015 })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={pos} count={pos.length / 3} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={col} count={col.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.45} />
    </points>
  )
}
