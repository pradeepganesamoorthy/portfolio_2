'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { colors?: string[]; speed?: number }

export function DatabaseClusters({ colors, speed = 1 }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const c = colors || ['#c77dff', '#4d96ff', '#ff6b6b', '#ffd93d', '#6bcb77', '#ff9a3c']

  // Each "database" = stack of cylinders
  const clusters = useMemo(() => [
    { pos: [-4, -1, -2] as [number, number, number], disks: 4, color: c[0], name: 'BigQuery' },
    { pos: [0, 1, -3] as [number, number, number], disks: 6, color: c[1], name: 'PostgreSQL' },
    { pos: [4, -2, -1] as [number, number, number], disks: 3, color: c[2], name: 'MongoDB' },
    { pos: [-2, 3, 0] as [number, number, number], disks: 5, color: c[3], name: 'Redis' },
    { pos: [2, 2, 1] as [number, number, number], disks: 4, color: c[4], name: 'Kafka' },
    { pos: [-5, 1, 2] as [number, number, number], disks: 2, color: c[5], name: 'Airflow' },
  ], [c])

  // Connections between DBs
  const connGeo = useMemo(() => {
    const lines: number[] = []
    const pairs = [[0,1],[1,2],[0,3],[3,4],[1,4],[2,5],[4,5]]
    pairs.forEach(([a, b]) => lines.push(...clusters[a].pos, ...clusters[b].pos))
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lines), 3))
    return geo
  }, [clusters])

  // Query packets travelling between clusters
  const PCOUNT = 40
  const packetState = useMemo(() => Array.from({ length: PCOUNT }, (_, i) => ({
    from: clusters[i % clusters.length].pos,
    to: clusters[(i + 2) % clusters.length].pos,
    t: Math.random(),
    spd: 0.008 + Math.random() * 0.012,
  })), [clusters])

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const instRef = useRef<THREE.InstancedMesh>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.04
      groupRef.current.rotation.x = Math.sin(t * 0.03) * 0.15
    }

    if (instRef.current) {
      packetState.forEach((p, i) => {
        p.t = (p.t + p.spd * speed) % 1
        dummy.position.set(
          THREE.MathUtils.lerp(p.from[0], p.to[0], p.t),
          THREE.MathUtils.lerp(p.from[1], p.to[1], p.t),
          THREE.MathUtils.lerp(p.from[2], p.to[2], p.t),
        )
        dummy.scale.setScalar(0.1)
        dummy.updateMatrix()
        instRef.current!.setMatrixAt(i, dummy.matrix)
      })
      instRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef}>
      {/* Connection network */}
      <lineSegments geometry={connGeo}>
        <lineBasicMaterial color={c[0]} transparent opacity={0.2} />
      </lineSegments>

      {/* Database stacks */}
      {clusters.map((cl, ci) => (
        <group key={ci} position={cl.pos}>
          {Array.from({ length: cl.disks }, (_, di) => (
            <mesh key={di} position={[0, di * 0.35 - (cl.disks * 0.35) / 2, 0]}>
              <cylinderGeometry args={[0.6, 0.6, 0.25, 16]} />
              <meshStandardMaterial
                color={cl.color}
                emissive={cl.color}
                emissiveIntensity={0.3 + di * 0.1}
                transparent
                opacity={0.85}
              />
            </mesh>
          ))}
          {/* Top glow cap */}
          <mesh position={[0, cl.disks * 0.175 + 0.05, 0]}>
            <circleGeometry args={[0.6, 16]} />
            <meshStandardMaterial color={cl.color} emissive={cl.color} emissiveIntensity={1} transparent opacity={0.9} />
          </mesh>
        </group>
      ))}

      {/* Query packets */}
      <instancedMesh ref={instRef} args={[undefined, undefined, PCOUNT]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color={c[2]} emissive={c[2]} emissiveIntensity={1.5} />
      </instancedMesh>

      {/* Ambient particles */}
      <BackgroundField colors={c} />

      <ambientLight intensity={0.2} />
      <pointLight color={c[0]} intensity={2} position={[3, 5, 3]} />
      <pointLight color={c[3]} intensity={1.5} position={[-4, -3, -2]} />
    </group>
  )
}

function BackgroundField({ colors }: { colors: string[] }) {
  const ref = useRef<THREE.Points>(null)
  const { pos, col } = useMemo(() => {
    const count = 500
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22
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
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.4} />
    </points>
  )
}
