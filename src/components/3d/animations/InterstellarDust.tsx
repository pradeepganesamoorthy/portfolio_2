'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { colors?: string[]; speed?: number }

export function InterstellarDust({ colors, speed = 1 }: Props) {
  const starsRef = useRef<THREE.Points>(null)
  const dustRef  = useRef<THREE.Points>(null)
  const armRef   = useRef<THREE.Points>(null)
  const c = colors || ['#c77dff','#4d96ff','#ff6b6b','#ffd93d','#6bcb77']

  const { starGeo, dustGeo, armGeo } = useMemo(() => {
    // Background stars
    const sn=1500, sp=new Float32Array(sn*3), sc=new Float32Array(sn*3)
    for(let i=0;i<sn;i++){
      const r=8+Math.random()*10, th=Math.random()*Math.PI*2, ph=Math.acos(2*Math.random()-1)
      sp[i*3]=r*Math.sin(ph)*Math.cos(th); sp[i*3+1]=r*Math.sin(ph)*Math.sin(th); sp[i*3+2]=r*Math.cos(ph)
      const cc=new THREE.Color(0.8+Math.random()*0.2,0.8+Math.random()*0.2,1)
      sc[i*3]=cc.r; sc[i*3+1]=cc.g; sc[i*3+2]=cc.b
    }
    const sg=new THREE.BufferGeometry()
    sg.setAttribute('position',new THREE.BufferAttribute(sp,3))
    sg.setAttribute('color',   new THREE.BufferAttribute(sc,3))

    // Dust clouds
    const dn=800, dp=new Float32Array(dn*3), dc=new Float32Array(dn*3)
    for(let i=0;i<dn;i++){
      dp[i*3]=(Math.random()-0.5)*12; dp[i*3+1]=(Math.random()-0.5)*3; dp[i*3+2]=(Math.random()-0.5)*12
      const cc=new THREE.Color(c[i%c.length]); dc[i*3]=cc.r; dc[i*3+1]=cc.g; dc[i*3+2]=cc.b
    }
    const dg=new THREE.BufferGeometry()
    dg.setAttribute('position',new THREE.BufferAttribute(dp,3))
    dg.setAttribute('color',   new THREE.BufferAttribute(dc,3))

    // Galaxy arm
    const an=2000, ap=new Float32Array(an*3), ac=new Float32Array(an*3)
    for(let i=0;i<an;i++){
      const t=(i/an)*Math.PI*6, r=0.3+t*0.5, jit=0.3
      const arm=i%2===0?0:Math.PI
      ap[i*3]=Math.cos(t+arm)*r+(Math.random()-0.5)*jit
      ap[i*3+1]=(Math.random()-0.5)*0.4
      ap[i*3+2]=Math.sin(t+arm)*r+(Math.random()-0.5)*jit
      const cc=new THREE.Color(c[i%c.length]); ac[i*3]=cc.r; ac[i*3+1]=cc.g; ac[i*3+2]=cc.b
    }
    const ag=new THREE.BufferGeometry()
    ag.setAttribute('position',new THREE.BufferAttribute(ap,3))
    ag.setAttribute('color',   new THREE.BufferAttribute(ac,3))

    return { starGeo:sg, dustGeo:dg, armGeo:ag }
  }, [c])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed
    if (starsRef.current) starsRef.current.rotation.y = t*0.01
    if (dustRef.current)  { dustRef.current.rotation.y=t*0.02; dustRef.current.rotation.x=Math.sin(t*0.03)*0.1 }
    if (armRef.current)   armRef.current.rotation.y = t*0.06
  })

  return (
    <>
      <points ref={starsRef} geometry={starGeo}><pointsMaterial size={0.04} vertexColors transparent opacity={0.9} sizeAttenuation/></points>
      <points ref={dustRef}  geometry={dustGeo}><pointsMaterial size={0.12} vertexColors transparent opacity={0.3} sizeAttenuation/></points>
      <points ref={armRef}   geometry={armGeo}> <pointsMaterial size={0.06} vertexColors transparent opacity={0.75} sizeAttenuation/></points>
      <ambientLight intensity={0.05}/>
      <pointLight color={c[0]} intensity={2} position={[0,3,0]}/>
    </>
  )
}
