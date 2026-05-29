'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { colors?: string[]; speed?: number }

export function DNADouble({ colors, speed = 1 }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const inst1 = useRef<THREE.InstancedMesh>(null)
  const inst2 = useRef<THREE.InstancedMesh>(null)
  const inst3 = useRef<THREE.InstancedMesh>(null)
  const c = colors || ['#c77dff', '#4d96ff', '#ff6b6b', '#ffd93d', '#6bcb77']

  const COUNT = 40  // nodes per strand
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.12
    }

    const RADIUS = 1.4
    const PITCH  = 0.32 // vertical spacing

    if (inst1.current && inst2.current && inst3.current) {
      for (let i = 0; i < COUNT; i++) {
        const angle = (i / COUNT) * Math.PI * 6 + t * 0.5
        const y = (i - COUNT / 2) * PITCH

        // Strand A
        dummy.position.set(Math.cos(angle) * RADIUS, y, Math.sin(angle) * RADIUS)
        dummy.scale.setScalar(0.18)
        dummy.updateMatrix()
        inst1.current.setMatrixAt(i, dummy.matrix)

        // Strand B (offset 180°)
        const angle2 = angle + Math.PI
        dummy.position.set(Math.cos(angle2) * RADIUS, y, Math.sin(angle2) * RADIUS)
        dummy.updateMatrix()
        inst2.current.setMatrixAt(i, dummy.matrix)

        // Cross-links every 4 nodes
        if (i % 4 === 0 && i < COUNT - 1) {
          const ax = Math.cos(angle) * RADIUS,   az = Math.sin(angle) * RADIUS
          const bx = Math.cos(angle2) * RADIUS,  bz = Math.sin(angle2) * RADIUS
          const midX = (ax + bx) / 2, midZ = (az + bz) / 2
          const linkLen = Math.sqrt((bx-ax)**2 + (bz-az)**2)
          dummy.position.set(midX, y, midZ)
          dummy.scale.set(linkLen / 0.6, 0.06, 0.06)
          dummy.lookAt(new THREE.Vector3(bx, y, bz))
          dummy.updateMatrix()
          inst3.current.setMatrixAt(i / 4, dummy.matrix)
        }
      }
      inst1.current.instanceMatrix.needsUpdate = true
      inst2.current.instanceMatrix.needsUpdate = true
      inst3.current.instanceMatrix.needsUpdate = true
    }
  })

  const LINKS = Math.ceil(COUNT / 4)

  return (
    <group ref={groupRef}>
      {/* Strand A */}
      <instancedMesh ref={inst1} args={[undefined, undefined, COUNT]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color={c[0]} emissive={c[0]} emissiveIntensity={0.7} />
      </instancedMesh>

      {/* Strand B */}
      <instancedMesh ref={inst2} args={[undefined, undefined, COUNT]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color={c[1]} emissive={c[1]} emissiveIntensity={0.7} />
      </instancedMesh>

      {/* Cross-links */}
      <instancedMesh ref={inst3} args={[undefined, undefined, LINKS]}>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <meshStandardMaterial color={c[2]} emissive={c[2]} emissiveIntensity={0.5} transparent opacity={0.8} />
      </instancedMesh>

      {/* Background particles */}
      <BGParticles colors={c} />

      <ambientLight intensity={0.2} />
      <pointLight color={c[0]} intensity={2.5} position={[4, 4, 4]} />
      <pointLight color={c[1]} intensity={2} position={[-4, -3, -3]} />
    </group>
  )
}

function BGParticles({ colors }: { colors: string[] }) {
  const ref = useRef<THREE.Points>(null)
  const { pos, col } = useMemo(() => {
    const n = 500
    const pos = new Float32Array(n * 3)
    const col = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      pos[i*3]   = (Math.random()-0.5)*20
      pos[i*3+1] = (Math.random()-0.5)*16
      pos[i*3+2] = (Math.random()-0.5)*14
      const c = new THREE.Color(colors[i % colors.length])
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b
    }
    return { pos, col }
  }, [colors])
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.015 })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={pos} count={pos.length/3} itemSize={3} />
        <bufferAttribute attach="attributes-color"    array={col} count={col.length/3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.4} />
    </points>
  )
}
