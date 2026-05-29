'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  colors?: string[]
}

export function FloatingOrbs({ colors }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const themeColors = colors || ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#c77dff', '#ff9a3c']

  const orbs = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
      ] as [number, number, number],
      scale: Math.random() * 0.5 + 0.3,
      color: themeColors[i % themeColors.length],
      speed: Math.random() * 0.5 + 0.3,
      offset: Math.random() * Math.PI * 2,
    }))
  }, [themeColors])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <FloatingOrb key={i} {...orb} index={i} />
      ))}
    </group>
  )
}

function FloatingOrb({
  position,
  scale,
  color,
  speed,
  offset,
  index,
}: {
  position: [number, number, number]
  scale: number
  color: string
  speed: number
  offset: number
  index: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t * speed + offset) * 2
      meshRef.current.position.x = position[0] + Math.cos(t * speed * 0.5 + offset) * 1.5
      
      // Glow effect
      const pulseScale = 1 + Math.sin(t * 2 + offset) * 0.1
      meshRef.current.scale.setScalar(scale * pulseScale)
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}
