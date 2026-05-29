'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { colors?: string[]; speed?: number }

export function CosmicRibbon({ colors, speed = 1 }: Props) {
  const groupRef  = useRef<THREE.Group>(null)
  const points1   = useRef<THREE.Points>(null)
  const points2   = useRef<THREE.Points>(null)
  const c = colors || ['#c77dff','#4d96ff','#ff6b6b','#ffd93d','#6bcb77']

  const COUNT = 2000
  const { geo1, geo2 } = useMemo(() => {
    const p1 = new Float32Array(COUNT * 3)
    const p2 = new Float32Array(COUNT * 3)
    const col1 = new Float32Array(COUNT * 3)
    const col2 = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const t  = (i / COUNT) * Math.PI * 8
      const r1 = 3 + Math.sin(t * 0.5) * 1.5
      const r2 = 2.5 + Math.cos(t * 0.7) * 1.2
      p1[i*3]   = Math.cos(t) * r1; p1[i*3+1] = Math.sin(t * 0.4) * 2; p1[i*3+2] = Math.sin(t) * r1
      p2[i*3]   = Math.cos(t+Math.PI) * r2; p2[i*3+1] = Math.cos(t * 0.3) * 2.5; p2[i*3+2] = Math.sin(t+Math.PI) * r2
      const c1n = new THREE.Color(c[i % c.length])
      const c2n = new THREE.Color(c[(i+2) % c.length])
      col1[i*3]=c1n.r; col1[i*3+1]=c1n.g; col1[i*3+2]=c1n.b
      col2[i*3]=c2n.r; col2[i*3+1]=c2n.g; col2[i*3+2]=c2n.b
    }
    const g1 = new THREE.BufferGeometry()
    g1.setAttribute('position', new THREE.BufferAttribute(p1, 3))
    g1.setAttribute('color',    new THREE.BufferAttribute(col1, 3))
    const g2 = new THREE.BufferGeometry()
    g2.setAttribute('position', new THREE.BufferAttribute(p2, 3))
    g2.setAttribute('color',    new THREE.BufferAttribute(col2, 3))
    return { geo1: g1, geo2: g2 }
  }, [c])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed
    if (groupRef.current) { groupRef.current.rotation.y = t * 0.08; groupRef.current.rotation.x = Math.sin(t*0.05)*0.2 }
    if (points1.current)  points1.current.rotation.z = t * 0.05
    if (points2.current)  points2.current.rotation.z = -t * 0.04
  })

  return (
    <group ref={groupRef}>
      <points ref={points1} geometry={geo1}><pointsMaterial size={0.055} vertexColors transparent opacity={0.85} sizeAttenuation /></points>
      <points ref={points2} geometry={geo2}><pointsMaterial size={0.04}  vertexColors transparent opacity={0.7}  sizeAttenuation /></points>
      <ambientLight intensity={0.15} />
      <pointLight color={c[0]} intensity={2} position={[5,5,5]} />
      <pointLight color={c[2]} intensity={1.5} position={[-5,-3,-4]} />
    </group>
  )
}
