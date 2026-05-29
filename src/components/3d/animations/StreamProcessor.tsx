'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { colors?: string[]; speed?: number }

export function StreamProcessor({ colors, speed = 1 }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const c = colors || ['#c77dff', '#4d96ff', '#ff6b6b', '#ffd93d', '#6bcb77', '#ff9a3c']

  // Producers on the left, Kafka brokers in the middle, consumers on the right
  const producers = useMemo(() => Array.from({ length: 4 }, (_, i) => ({
    pos: [-7, (i - 1.5) * 2.5, 0] as [number, number, number],
    color: c[0],
  })), [c])

  const brokers = useMemo(() => Array.from({ length: 3 }, (_, i) => ({
    pos: [0, (i - 1) * 3, 0] as [number, number, number],
    color: c[1],
  })), [c])

  const consumers = useMemo(() => Array.from({ length: 4 }, (_, i) => ({
    pos: [7, (i - 1.5) * 2.5, 0] as [number, number, number],
    color: c[2],
  })), [c])

  // Messages flowing Producer→Broker
  const PMSG = 30
  const prodMsgs = useMemo(() => Array.from({ length: PMSG }, (_, i) => ({
    prod: i % producers.length,
    broker: i % brokers.length,
    t: Math.random(),
    spd: (0.008 + Math.random() * 0.01) * speed,
  })), [producers.length, brokers.length, speed])

  // Messages flowing Broker→Consumer
  const CMSG = 30
  const consMsgs = useMemo(() => Array.from({ length: CMSG }, (_, i) => ({
    broker: i % brokers.length,
    cons: i % consumers.length,
    t: Math.random(),
    spd: (0.008 + Math.random() * 0.01) * speed,
  })), [brokers.length, consumers.length, speed])

  const instP = useRef<THREE.InstancedMesh>(null)
  const instC = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const brokerRefs = useRef<(THREE.Mesh | null)[]>([])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.035
      groupRef.current.rotation.x = Math.sin(t * 0.025) * 0.12
    }

    // Pulse brokers
    brokerRefs.current.forEach((m, i) => {
      if (m) {
        m.rotation.y = t * 0.5
        const s = 1 + Math.sin(t * 2 + i * 1.5) * 0.1
        m.scale.setScalar(s)
      }
    })

    if (instP.current) {
      prodMsgs.forEach((m, i) => {
        m.t = (m.t + m.spd) % 1
        dummy.position.lerpVectors(
          new THREE.Vector3(...producers[m.prod].pos),
          new THREE.Vector3(...brokers[m.broker].pos),
          m.t
        )
        dummy.scale.setScalar(0.1)
        dummy.updateMatrix()
        instP.current!.setMatrixAt(i, dummy.matrix)
      })
      instP.current.instanceMatrix.needsUpdate = true
    }

    if (instC.current) {
      consMsgs.forEach((m, i) => {
        m.t = (m.t + m.spd) % 1
        dummy.position.lerpVectors(
          new THREE.Vector3(...brokers[m.broker].pos),
          new THREE.Vector3(...consumers[m.cons].pos),
          m.t
        )
        dummy.scale.setScalar(0.1)
        dummy.updateMatrix()
        instC.current!.setMatrixAt(i, dummy.matrix)
      })
      instC.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef}>
      {/* Producers */}
      {producers.map((p, i) => (
        <mesh key={i} position={p.pos}>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={0.5} transparent opacity={0.85} />
        </mesh>
      ))}

      {/* Brokers (cylinders) */}
      {brokers.map((b, i) => (
        <mesh key={i} position={b.pos} ref={el => { brokerRefs.current[i] = el }}>
          <cylinderGeometry args={[0.6, 0.6, 1.2, 12]} />
          <meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={0.6} transparent opacity={0.9} />
        </mesh>
      ))}

      {/* Consumers */}
      {consumers.map((con, i) => (
        <mesh key={i} position={con.pos}>
          <octahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color={con.color} emissive={con.color} emissiveIntensity={0.5} transparent opacity={0.85} />
        </mesh>
      ))}

      {/* Prod→Broker messages */}
      <instancedMesh ref={instP} args={[undefined, undefined, PMSG]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial color={c[0]} emissive={c[0]} emissiveIntensity={1.8} />
      </instancedMesh>

      {/* Broker→Consumer messages */}
      <instancedMesh ref={instC} args={[undefined, undefined, CMSG]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial color={c[2]} emissive={c[2]} emissiveIntensity={1.8} />
      </instancedMesh>

      {/* Background */}
      <BG colors={c} />

      <ambientLight intensity={0.2} />
      <pointLight color={c[0]} intensity={2} position={[-6, 4, 3]} />
      <pointLight color={c[2]} intensity={2} position={[6, -3, 2]} />
    </group>
  )
}

function BG({ colors }: { colors: string[] }) {
  const ref = useRef<THREE.Points>(null)
  const { pos, col } = useMemo(() => {
    const n = 600
    const pos = new Float32Array(n * 3)
    const col = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26
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
