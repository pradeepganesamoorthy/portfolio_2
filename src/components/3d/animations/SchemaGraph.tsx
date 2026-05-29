'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { colors?: string[]; speed?: number }

export function SchemaGraph({ colors, speed = 1 }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const c = colors || ['#c77dff', '#4d96ff', '#ff6b6b', '#ffd93d', '#6bcb77', '#ff9a3c']

  // Tables as flat boxes arranged in space
  const tables = useMemo(() => [
    { pos: [0, 0, 0] as [number, number, number], color: c[0], w: 2, h: 0.15, d: 1.4, rows: 5 },
    { pos: [-5, 2, -2] as [number, number, number], color: c[1], w: 1.8, h: 0.15, d: 1.2, rows: 4 },
    { pos: [5, -1, -1] as [number, number, number], color: c[2], w: 2.2, h: 0.15, d: 1.4, rows: 6 },
    { pos: [-3, -3, 1] as [number, number, number], color: c[3], w: 1.6, h: 0.15, d: 1, rows: 3 },
    { pos: [3, 3, 2] as [number, number, number], color: c[4], w: 1.4, h: 0.15, d: 1, rows: 4 },
    { pos: [0, -4, -3] as [number, number, number], color: c[5], w: 1.8, h: 0.15, d: 1.2, rows: 5 },
  ], [c])

  const edges = [[0,1],[0,2],[0,3],[1,4],[2,5],[3,5],[2,4]]

  const lineGeo = useMemo(() => {
    const lines: number[] = []
    edges.forEach(([a, b]) => lines.push(...tables[a].pos, ...tables[b].pos))
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lines), 3))
    return geo
  }, [tables])

  const QUERY_COUNT = 20
  const queries = useMemo(() => Array.from({ length: QUERY_COUNT }, (_, i) => ({
    edge: edges[i % edges.length],
    t: Math.random(),
    spd: (0.007 + Math.random() * 0.01) * speed,
  })), [speed])

  const instRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const tableRefs = useRef<(THREE.Group | null)[]>([])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.04
      groupRef.current.rotation.x = Math.sin(t * 0.03) * 0.18
    }

    // Gentle float for each table
    tableRefs.current.forEach((g, i) => {
      if (g) {
        g.position.y = tables[i].pos[1] + Math.sin(t * 0.6 + i * 1.2) * 0.2
      }
    })

    if (instRef.current) {
      queries.forEach((q, i) => {
        q.t = (q.t + q.spd) % 1
        const [ai, bi] = q.edge
        dummy.position.lerpVectors(
          new THREE.Vector3(...tables[ai].pos),
          new THREE.Vector3(...tables[bi].pos),
          q.t
        )
        dummy.scale.setScalar(0.09)
        dummy.updateMatrix()
        instRef.current!.setMatrixAt(i, dummy.matrix)
      })
      instRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef}>
      {/* FK lines */}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={c[1]} transparent opacity={0.3} />
      </lineSegments>

      {/* Tables */}
      {tables.map((t, ti) => (
        <group key={ti} position={t.pos} ref={el => { tableRefs.current[ti] = el }}>
          {/* Table top */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[t.w, t.h, t.d]} />
            <meshStandardMaterial color={t.color} emissive={t.color} emissiveIntensity={0.5} transparent opacity={0.9} />
          </mesh>
          {/* Row lines */}
          {Array.from({ length: t.rows }, (_, ri) => (
            <mesh key={ri} position={[0, t.h / 2 + ri * 0.22 + 0.11, 0]}>
              <boxGeometry args={[t.w, 0.18, t.d]} />
              <meshStandardMaterial
                color={t.color}
                emissive={t.color}
                emissiveIntensity={0.2 + ri * 0.05}
                transparent
                opacity={0.5 - ri * 0.06}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Query packets */}
      <instancedMesh ref={instRef} args={[undefined, undefined, QUERY_COUNT]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={c[3]} emissive={c[3]} emissiveIntensity={2} />
      </instancedMesh>

      <BGField colors={c} />
      <ambientLight intensity={0.2} />
      <pointLight color={c[0]} intensity={2} position={[4, 5, 3]} />
      <pointLight color={c[2]} intensity={1.5} position={[-4, -4, -2]} />
    </group>
  )
}

function BGField({ colors }: { colors: string[] }) {
  const ref = useRef<THREE.Points>(null)
  const { pos, col } = useMemo(() => {
    const n = 500
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
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.012 })
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
