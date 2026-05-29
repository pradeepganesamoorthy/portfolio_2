'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { colors?: string[]; speed?: number }

export function CloudNodes({ colors, speed = 1 }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const c = colors || ['#c77dff', '#4d96ff', '#ff6b6b', '#ffd93d', '#6bcb77', '#ff9a3c']

  // Cloud service nodes arranged in 3 layers (like GCP zones)
  const zones = useMemo(() => [
    // Zone A (top)
    { pos: [-3, 4, 0] as [number, number, number], color: c[0], size: 0.7, label: 'BigQuery' },
    { pos: [0, 4, -2] as [number, number, number], color: c[0], size: 0.6, label: 'Dataflow' },
    { pos: [3, 4, 0] as [number, number, number], color: c[0], size: 0.5, label: 'Pub/Sub' },
    // Zone B (middle)
    { pos: [-4, 0, 1] as [number, number, number], color: c[1], size: 0.8, label: 'GCS' },
    { pos: [-1, 0, -1] as [number, number, number], color: c[1], size: 0.9, label: 'GKE' },
    { pos: [2, 0, 2] as [number, number, number], color: c[1], size: 0.7, label: 'CloudSQL' },
    { pos: [5, 0, -1] as [number, number, number], color: c[1], size: 0.55, label: 'Firestore' },
    // Zone C (bottom)
    { pos: [-2, -4, 0] as [number, number, number], color: c[2], size: 0.65, label: 'Airflow' },
    { pos: [1, -4, -2] as [number, number, number], color: c[2], size: 0.6, label: 'Spark' },
    { pos: [4, -4, 1] as [number, number, number], color: c[2], size: 0.5, label: 'Kafka' },
  ], [c])

  const edges = useMemo(() => {
    // Interconnect nodes within zones + cross-zone links
    return [
      [0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5],[5,6],
      [3,7],[4,8],[5,9],[7,8],[8,9]
    ]
  }, [])

  const lineGeo = useMemo(() => {
    const lines: number[] = []
    edges.forEach(([a, b]) => lines.push(...zones[a].pos, ...zones[b].pos))
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lines), 3))
    return geo
  }, [zones, edges])

  // Data packets
  const PCOUNT = 50
  const packets = useMemo(() => Array.from({ length: PCOUNT }, (_, i) => ({
    edge: edges[i % edges.length],
    t: Math.random(),
    spd: (0.006 + Math.random() * 0.01) * speed,
    dir: Math.random() > 0.5 ? 1 : -1,
  })), [edges, speed])

  const instRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.04
      groupRef.current.rotation.x = Math.sin(t * 0.025) * 0.15
    }

    // Pulse nodes
    nodeRefs.current.forEach((m, i) => {
      if (m) {
        const s = zones[i].size * (1 + Math.sin(t * 1.2 + i * 0.8) * 0.12)
        m.scale.setScalar(s)
      }
    })

    // Move packets
    if (instRef.current) {
      packets.forEach((p, i) => {
        p.t = (p.t + p.spd * p.dir + 1) % 1
        const [ai, bi] = p.edge
        dummy.position.lerpVectors(
          new THREE.Vector3(...zones[ai].pos),
          new THREE.Vector3(...zones[bi].pos),
          p.t
        )
        dummy.scale.setScalar(0.08)
        dummy.updateMatrix()
        instRef.current!.setMatrixAt(i, dummy.matrix)
      })
      instRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={c[1]} transparent opacity={0.2} />
      </lineSegments>

      {zones.map((z, i) => (
        <group key={i} position={z.pos}>
          {/* Outer glow ring */}
          <mesh>
            <torusGeometry args={[z.size + 0.15, 0.03, 8, 32]} />
            <meshBasicMaterial color={z.color} transparent opacity={0.4} />
          </mesh>
          {/* Node body */}
          <mesh ref={el => { nodeRefs.current[i] = el }}>
            <dodecahedronGeometry args={[z.size * 0.7, 0]} />
            <meshStandardMaterial color={z.color} emissive={z.color} emissiveIntensity={0.5} transparent opacity={0.85} />
          </mesh>
        </group>
      ))}

      <instancedMesh ref={instRef} args={[undefined, undefined, PCOUNT]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial color={c[3]} emissive={c[3]} emissiveIntensity={2} />
      </instancedMesh>

      {/* Background particles */}
      <BGParticles colors={c} />

      <ambientLight intensity={0.2} />
      <pointLight color={c[0]} intensity={2} position={[0, 6, 4]} />
      <pointLight color={c[2]} intensity={1.5} position={[0, -6, -3]} />
    </group>
  )
}

function BGParticles({ colors }: { colors: string[] }) {
  const ref = useRef<THREE.Points>(null)
  const { pos, col } = useMemo(() => {
    const n = 600
    const pos = new Float32Array(n * 3)
    const col = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14
      const c = new THREE.Color(colors[i % colors.length])
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
    }
    return { pos, col }
  }, [colors])
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.01 })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={pos} count={pos.length / 3} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={col} count={col.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.35} />
    </points>
  )
}
