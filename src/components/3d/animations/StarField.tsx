'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  colors?: string[]
}

export function StarField({ colors }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const themeColors = colors || ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#c77dff', '#ff9a3c']

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* StarField animation implementation */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={themeColors[0]} />
      </mesh>
    </group>
  )
}
