'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { colors?: string[]; speed?: number }

export function MorphingGeometry({ colors, speed = 1 }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const outerRef = useRef<THREE.Mesh>(null)
  const ringRefs = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)]
  const c = colors || ['#c77dff', '#4d96ff', '#ff6b6b', '#ffd93d', '#6bcb77']

  // Store original positions for morphing
  const { icoPositions, boxPositions } = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(2, 2)
    const box = new THREE.SphereGeometry(2, 16, 16)
    return {
      icoPositions: ico.attributes.position.array.slice(),
      boxPositions: box.attributes.position.array.slice(),
    }
  }, [])

  const geo = useMemo(() => new THREE.IcosahedronGeometry(2, 2), [])
  const pts = useMemo(() => new Float32Array(geo.attributes.position.count * 3), [geo])

  const particleGeo = useMemo(() => {
    const count = 400
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 3.5 + Math.random() * 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i*3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i*3+2] = r * Math.cos(phi)
      const cl = new THREE.Color(c[i % c.length])
      col[i*3] = cl.r; col[i*3+1] = cl.g; col[i*3+2] = cl.b
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return g
  }, [c])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed
    const morph = (Math.sin(t * 0.4) + 1) / 2

    // Morph between ico and sphere
    if (meshRef.current && icoPositions.length === pts.length) {
      for (let i = 0; i < pts.length; i++) {
        const from = icoPositions[i] ?? 0
        const to = boxPositions[i] ?? 0
        pts[i] = THREE.MathUtils.lerp(from, to, morph)
        // Add noise
        if (i % 3 === 0) {
          pts[i] += Math.sin(t * 1.2 + i * 0.1) * 0.08
          pts[i+1] = (pts[i+1] || 0) + Math.cos(t * 0.9 + i * 0.07) * 0.08
        }
      }
      ;(geo.attributes.position.array as Float32Array).set(pts)
      geo.attributes.position.needsUpdate = true
      geo.computeVertexNormals()
      meshRef.current.rotation.y = t * 0.18
      meshRef.current.rotation.x = t * 0.09
    }

    if (outerRef.current) {
      outerRef.current.rotation.y = -t * 0.12
      outerRef.current.rotation.z = t * 0.06
    }

    ringRefs.forEach((ref, i) => {
      if (ref.current) {
        ref.current.rotation.x = t * (0.3 + i * 0.15)
        ref.current.rotation.y = t * (0.2 - i * 0.08)
      }
    })
  })

  return (
    <group>
      {/* Central morphing shape */}
      <mesh ref={meshRef} geometry={geo}>
        <meshStandardMaterial color={c[0]} emissive={c[0]} emissiveIntensity={0.3} wireframe transparent opacity={0.7} />
      </mesh>

      {/* Outer wireframe */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2.6, 1]} />
        <meshBasicMaterial color={c[1]} wireframe transparent opacity={0.15} />
      </mesh>

      {/* Orbit rings */}
      {[3.2, 4, 5].map((r, i) => (
        <mesh key={i} ref={ringRefs[i]}>
          <torusGeometry args={[r, 0.025, 8, 80]} />
          <meshBasicMaterial color={c[i % c.length]} transparent opacity={0.4} />
        </mesh>
      ))}

      {/* Ambient particles */}
      <points geometry={particleGeo}>
        <pointsMaterial size={0.05} vertexColors transparent opacity={0.5} sizeAttenuation />
      </points>

      <ambientLight intensity={0.2} />
      <pointLight color={c[0]} intensity={3} position={[4, 4, 4]} />
      <pointLight color={c[1]} intensity={2} position={[-4, -3, -3]} />
    </group>
  )
}
