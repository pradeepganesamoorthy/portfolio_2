'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { colors?: string[]; speed?: number }

export function DataFlowPipeline({ colors, speed = 1 }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const packetsRef = useRef<THREE.InstancedMesh>(null)

  const c = colors || ['#c77dff', '#4d96ff', '#ff6b6b', '#ffd93d', '#6bcb77', '#ff9a3c']

  // Pipeline nodes (like ETL stages: Extract → Transform → Load)
  const nodes = useMemo(() => [
    { pos: [-7, 0, 0] as [number, number, number], label: 'E', color: c[0] },
    { pos: [-3, 2, -1] as [number, number, number], label: 'T', color: c[1] },
    { pos: [1, -1, 1] as [number, number, number], label: 'T', color: c[2] },
    { pos: [5, 1, -2] as [number, number, number], label: 'L', color: c[3] },
    { pos: [-5, -3, 2] as [number, number, number], label: 'T', color: c[4] },
    { pos: [3, -3, 0] as [number, number, number], label: 'L', color: c[5] },
  ], [c])

  const pipes = useMemo(() => [
    [0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [3, 5], [1, 5]
  ], [])

  // 80 data packets flowing along pipes
  const PACKET_COUNT = 80
  const packetData = useMemo(() => Array.from({ length: PACKET_COUNT }, (_, i) => ({
    pipe: pipes[i % pipes.length],
    t: Math.random(),
    speed: (0.1 + Math.random() * 0.15) * speed,
    color: new THREE.Color(c[i % c.length]),
  })), [pipes, c, speed])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.06 * speed
      groupRef.current.rotation.x = Math.sin(t * 0.04 * speed) * 0.2
    }

    if (packetsRef.current) {
      packetData.forEach((p, i) => {
        p.t = (p.t + p.speed * 0.01) % 1
        const from = nodes[p.pipe[0]].pos
        const to = nodes[p.pipe[1]].pos
        dummy.position.set(
          THREE.MathUtils.lerp(from[0], to[0], p.t),
          THREE.MathUtils.lerp(from[1], to[1], p.t),
          THREE.MathUtils.lerp(from[2], to[2], p.t),
        )
        dummy.scale.setScalar(0.12)
        dummy.updateMatrix()
        packetsRef.current!.setMatrixAt(i, dummy.matrix)
      })
      packetsRef.current.instanceMatrix.needsUpdate = true
    }
  })

  // Build pipe line geometry
  const pipeGeo = useMemo(() => {
    const lines: number[] = []
    pipes.forEach(([a, b]) => {
      lines.push(...nodes[a].pos, ...nodes[b].pos)
    })
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lines), 3))
    return geo
  }, [nodes, pipes])

  return (
    <group ref={groupRef}>
      {/* Pipeline connection tubes */}
      <lineSegments geometry={pipeGeo}>
        <lineBasicMaterial color={c[1]} transparent opacity={0.35} />
      </lineSegments>

      {/* Stage nodes */}
      {nodes.map((n, i) => (
        <mesh key={i} position={n.pos}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color={n.color} emissive={n.color} emissiveIntensity={0.6} transparent opacity={0.9} />
        </mesh>
      ))}

      {/* Flowing data packets */}
      <instancedMesh ref={packetsRef} args={[undefined, undefined, PACKET_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={c[2]} emissive={c[0]} emissiveIntensity={0.8} />
      </instancedMesh>

      {/* Ambient field particles */}
      <DataParticles colors={c} />

      <ambientLight intensity={0.3} />
      <pointLight color={c[0]} intensity={1.5} position={[5, 5, 5]} />
      <pointLight color={c[1]} intensity={1} position={[-5, -3, 2]} />
    </group>
  )
}

function DataParticles({ colors }: { colors: string[] }) {
  const ref = useRef<THREE.Points>(null)
  const { positions, cols } = useMemo(() => {
    const count = 600
    const positions = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15
      const col = new THREE.Color(colors[i % colors.length])
      cols[i * 3] = col.r; cols[i * 3 + 1] = col.g; cols[i * 3 + 2] = col.b
    }
    return { positions, cols }
  }, [colors])

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.02
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={cols} count={cols.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.5} />
    </points>
  )
}
