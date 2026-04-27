'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function ParticleField({ count = 2000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const torusRef = useRef<THREE.Mesh>(null)
  const torusRef2 = useRef<THREE.Mesh>(null)
  const icosRef = useRef<THREE.Mesh>(null)

  const { positions, colors, linePositions } = useMemo(() => {
    const pts: number[] = []
    const cols: number[] = []
    const linePts: number[] = []
    const nodes: THREE.Vector3[] = []

    const palette = [
      new THREE.Color('#ff6b6b'),
      new THREE.Color('#ffd93d'),
      new THREE.Color('#6bcb77'),
      new THREE.Color('#4d96ff'),
      new THREE.Color('#c77dff'),
      new THREE.Color('#ff9a3c'),
      new THREE.Color('#00d2ff'),
    ]

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 8 + Math.random() * 10
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.6
      const z = r * Math.cos(phi)
      pts.push(x, y, z)
      nodes.push(new THREE.Vector3(x, y, z))
      const c = palette[Math.floor(Math.random() * palette.length)]
      cols.push(c.r, c.g, c.b)
    }

    for (let i = 0; i < Math.min(nodes.length, 300); i++) {
      for (let j = i + 1; j < Math.min(nodes.length, 300); j++) {
        const d = nodes[i].distanceTo(nodes[j])
        if (d < 3.5) {
          linePts.push(...nodes[i].toArray(), ...nodes[j].toArray())
        }
      }
    }

    return {
      positions: new Float32Array(pts),
      colors: new Float32Array(cols),
      linePositions: new Float32Array(linePts),
    }
  }, [count])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.05
      pointsRef.current.rotation.x = Math.sin(t * 0.03) * 0.15
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = t * 0.05
      linesRef.current.rotation.x = Math.sin(t * 0.03) * 0.15
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.3
      torusRef.current.rotation.y = t * 0.2
    }
    if (torusRef2.current) {
      torusRef2.current.rotation.x = -t * 0.2
      torusRef2.current.rotation.z = t * 0.15
    }
    if (icosRef.current) {
      icosRef.current.rotation.x = t * 0.15
      icosRef.current.rotation.y = t * 0.25
    }
  })

  return (
    <>
      {/* Colored particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
          <bufferAttribute attach="attributes-color" array={colors} count={colors.length / 3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.07} vertexColors transparent opacity={0.85} sizeAttenuation />
      </points>

      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={linePositions} count={linePositions.length / 3} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#4d96ff" transparent opacity={0.12} />
      </lineSegments>

      {/* Spinning torus 1 */}
      <mesh ref={torusRef} position={[4, 1, -3]}>
        <torusGeometry args={[2.2, 0.04, 8, 60]} />
        <meshBasicMaterial color="#c77dff" transparent opacity={0.5} />
      </mesh>

      {/* Spinning torus 2 */}
      <mesh ref={torusRef2} position={[-3, -1, -4]}>
        <torusGeometry args={[1.6, 0.03, 8, 50]} />
        <meshBasicMaterial color="#4d96ff" transparent opacity={0.45} />
      </mesh>

      {/* Wireframe icosahedron */}
      <mesh ref={icosRef} position={[0, 0, -6]}>
        <icosahedronGeometry args={[3, 1]} />
        <meshBasicMaterial color="#ff9a3c" wireframe transparent opacity={0.18} />
      </mesh>

      {/* Ambient glow points */}
      <pointLight color="#c77dff" intensity={0.8} position={[5, 3, 2]} />
      <pointLight color="#4d96ff" intensity={0.6} position={[-5, -2, 1]} />
      <pointLight color="#ff6b6b" intensity={0.4} position={[0, 5, -2]} />
    </>
  )
}
