'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  colors?: string[]
}

export function ParticlesTorus({ colors }: Props) {
  const particlesRef = useRef<THREE.Points>(null)
  const torus1Ref = useRef<THREE.Mesh>(null)
  const torus2Ref = useRef<THREE.Mesh>(null)

  // Default rainbow colors or theme colors
  const themeColors = colors || ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#c77dff', '#ff9a3c']

  // Generate particles
  const particles = useMemo(() => {
    const count = 1800
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20

      const color = new THREE.Color(themeColors[i % themeColors.length])
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    return { positions, colors }
  }, [themeColors])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.05
      particlesRef.current.rotation.x = Math.sin(t * 0.1) * 0.2
    }

    if (torus1Ref.current) {
      torus1Ref.current.rotation.x = t * 0.3
      torus1Ref.current.rotation.y = t * 0.2
    }

    if (torus2Ref.current) {
      torus2Ref.current.rotation.x = -t * 0.25
      torus2Ref.current.rotation.y = -t * 0.15
    }
  })

  return (
    <>
      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} vertexColors transparent opacity={0.8} />
      </points>

      {/* Torus Ring 1 */}
      <mesh ref={torus1Ref} position={[0, 0, 0]}>
        <torusGeometry args={[3, 0.08, 16, 100]} />
        <meshBasicMaterial color={themeColors[4]} wireframe />
      </mesh>

      {/* Torus Ring 2 */}
      <mesh ref={torus2Ref} position={[0, 0, 0]}>
        <torusGeometry args={[4.5, 0.06, 16, 100]} />
        <meshBasicMaterial color={themeColors[3]} wireframe />
      </mesh>
    </>
  )
}
