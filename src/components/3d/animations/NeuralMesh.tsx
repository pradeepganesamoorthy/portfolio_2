'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { colors?: string[]; speed?: number }

export function NeuralMesh({ colors, speed = 1 }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const c = colors || ['#c77dff', '#4d96ff', '#ff6b6b', '#ffd93d', '#6bcb77', '#ff9a3c']

  const NODE_COUNT = 30
  const nodes = useMemo(() => Array.from({ length: NODE_COUNT }, (_, i) => ({
    pos: new THREE.Vector3(
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
    ),
    color: c[i % c.length],
    scale: 0.15 + Math.random() * 0.25,
    pulseOffset: Math.random() * Math.PI * 2,
  })), [c])

  // Build connections (edges) between nearby nodes
  const { lineGeo, edges } = useMemo(() => {
    const lines: number[] = []
    const edges: [number, number][] = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = nodes[i].pos.distanceTo(nodes[j].pos)
        if (d < 5 && edges.length < 60) {
          lines.push(...nodes[i].pos.toArray(), ...nodes[j].pos.toArray())
          edges.push([i, j])
        }
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lines), 3))
    return { lineGeo: geo, edges }
  }, [nodes])

  // Signal pulses travelling along edges
  const PULSE_COUNT = Math.min(edges.length, 40)
  const pulses = useMemo(() => Array.from({ length: PULSE_COUNT }, (_, i) => ({
    edge: edges[i % edges.length],
    t: Math.random(),
    spd: (0.007 + Math.random() * 0.01) * speed,
  })), [edges, speed])

  const nodeRefs = useRef<(THREE.Mesh | null)[]>([])
  const pulseInst = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.04
      groupRef.current.rotation.x = Math.sin(t * 0.03) * 0.2
    }

    // Pulse nodes
    nodeRefs.current.forEach((m, i) => {
      if (m && nodes[i]) {
        const s = nodes[i].scale * (1 + Math.sin(t * 1.5 + nodes[i].pulseOffset) * 0.2)
        m.scale.setScalar(s)
      }
    })

    // Move signal pulses
    if (pulseInst.current) {
      pulses.forEach((p, i) => {
        p.t = (p.t + p.spd) % 1
        const [ai, bi] = p.edge
        if (!nodes[ai] || !nodes[bi]) return
        dummy.position.lerpVectors(nodes[ai].pos, nodes[bi].pos, p.t)
        dummy.scale.setScalar(0.08)
        dummy.updateMatrix()
        pulseInst.current!.setMatrixAt(i, dummy.matrix)
      })
      pulseInst.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef}>
      {/* Edges */}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={c[1]} transparent opacity={0.25} />
      </lineSegments>

      {/* Nodes */}
      {nodes.map((n, i) => (
        <mesh
          key={i}
          position={n.pos}
          ref={el => { nodeRefs.current[i] = el }}
        >
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color={n.color} emissive={n.color} emissiveIntensity={0.6} transparent opacity={0.85} />
        </mesh>
      ))}

      {/* Signal pulses */}
      <instancedMesh ref={pulseInst} args={[undefined, undefined, PULSE_COUNT]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color={c[3]} emissive={c[3]} emissiveIntensity={2} />
      </instancedMesh>

      <ambientLight intensity={0.2} />
      <pointLight color={c[0]} intensity={2} position={[6, 4, 4]} />
      <pointLight color={c[3]} intensity={1.5} position={[-5, -4, -3]} />
    </group>
  )
}
