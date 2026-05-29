'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { colors?: string[]; speed?: number }

export function PlasmaField({ colors, speed = 1 }: Props) {
  const ref  = useRef<THREE.Points>(null)
  const c = colors || ['#c77dff','#4d96ff','#ff6b6b','#ffd93d','#6bcb77']
  const COUNT = 4000

  const { positions, offsets, cols } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const offsets   = new Float32Array(COUNT * 3)
    const cols      = new Float32Array(COUNT * 3)
    for (let i=0;i<COUNT;i++) {
      positions[i*3]   = (Math.random()-0.5)*14
      positions[i*3+1] = (Math.random()-0.5)*10
      positions[i*3+2] = (Math.random()-0.5)*10
      offsets[i*3]   = Math.random()*Math.PI*2
      offsets[i*3+1] = Math.random()*Math.PI*2
      offsets[i*3+2] = Math.random()*Math.PI*2
      const cc = new THREE.Color(c[i % c.length])
      cols[i*3]=cc.r; cols[i*3+1]=cc.g; cols[i*3+2]=cc.b
    }
    return { positions, offsets, cols }
  }, [c])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed
    if (ref.current) {
      const pos = ref.current.geometry.attributes.position.array as Float32Array
      for (let i=0;i<COUNT;i++) {
        const ox=offsets[i*3], oy=offsets[i*3+1], oz=offsets[i*3+2]
        pos[i*3]   += Math.sin(t*0.5+oy)*0.012*speed
        pos[i*3+1] += Math.cos(t*0.4+ox)*0.012*speed
        pos[i*3+2] += Math.sin(t*0.3+oz)*0.010*speed
        // Soft boundary
        if (Math.abs(pos[i*3])>7)   pos[i*3]   *= 0.97
        if (Math.abs(pos[i*3+1])>5) pos[i*3+1] *= 0.97
        if (Math.abs(pos[i*3+2])>5) pos[i*3+2] *= 0.97
      }
      ref.current.geometry.attributes.position.needsUpdate=true
      ref.current.rotation.y = t*0.04
    }
  })

  return (
    <>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={positions} count={COUNT} itemSize={3}/>
          <bufferAttribute attach="attributes-color"    array={cols}      count={COUNT} itemSize={3}/>
        </bufferGeometry>
        <pointsMaterial size={0.06} vertexColors transparent opacity={0.75} sizeAttenuation/>
      </points>
      <ambientLight intensity={0.1}/>
      <pointLight color={c[0]} intensity={2.5} position={[5,5,5]}/>
      <pointLight color={c[1]} intensity={2} position={[-5,-4,3]}/>
      <pointLight color={c[2]} intensity={1.5} position={[0,6,-5]}/>
    </>
  )
}
