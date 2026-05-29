'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { colors?: string[]; speed?: number }

export function GravityWell({ colors, speed = 1 }: Props) {
  const ref  = useRef<THREE.Points>(null)
  const core = useRef<THREE.Mesh>(null)
  const ring = useRef<THREE.Mesh>(null)
  const c = colors || ['#c77dff','#4d96ff','#ff6b6b','#ffd93d','#6bcb77']

  const COUNT = 3000
  const { positions, velocities, cols } = useMemo(() => {
    const positions  = new Float32Array(COUNT * 3)
    const velocities = new Float32Array(COUNT * 2) // angle, radius
    const cols       = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const angle  = Math.random() * Math.PI * 2
      const radius = 2 + Math.random() * 7
      positions[i*3]   = Math.cos(angle) * radius
      positions[i*3+1] = (Math.random()-0.5) * 1.5 * (1 - radius/9)
      positions[i*3+2] = Math.sin(angle) * radius
      velocities[i*2]   = angle
      velocities[i*2+1] = radius
      const cc = new THREE.Color(c[i % c.length])
      cols[i*3]=cc.r; cols[i*3+1]=cc.g; cols[i*3+2]=cc.b
    }
    return { positions, velocities, cols }
  }, [c])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (ref.current) {
      const pos = ref.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < COUNT; i++) {
        let angle  = velocities[i*2]
        let radius = velocities[i*2+1]
        const spd  = (speed * 0.4) / (radius + 0.5)
        angle  += spd * 0.016
        radius -= 0.002 * speed
        if (radius < 0.3) { radius = 2 + Math.random() * 7; angle = Math.random()*Math.PI*2 }
        pos[i*3]   = Math.cos(angle) * radius
        pos[i*3+1] = (Math.random()-0.5) * 0.08 + pos[i*3+1] * 0.98
        pos[i*3+2] = Math.sin(angle) * radius
        velocities[i*2]   = angle
        velocities[i*2+1] = radius
      }
      ref.current.geometry.attributes.position.needsUpdate = true
    }
    if (core.current) { core.current.rotation.y = t*speed*0.3; const s=1+Math.sin(t*2)*0.08; core.current.scale.setScalar(s) }
    if (ring.current) { ring.current.rotation.z = t*speed*0.15 }
  })

  return (
    <>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={positions} count={COUNT} itemSize={3} />
          <bufferAttribute attach="attributes-color"    array={cols}      count={COUNT} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.04} vertexColors transparent opacity={0.8} sizeAttenuation />
      </points>
      <mesh ref={core}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={c[0]} emissive={c[0]} emissiveIntensity={2} />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI/2,0,0]}>
        <torusGeometry args={[1.2, 0.06, 8, 64]} />
        <meshBasicMaterial color={c[3]} transparent opacity={0.5} />
      </mesh>
      <ambientLight intensity={0.1} />
      <pointLight color={c[0]} intensity={4} position={[0,0,0]} />
      <pointLight color={c[1]} intensity={1.5} position={[6,4,6]} />
    </>
  )
}
