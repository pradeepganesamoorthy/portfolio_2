'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { colors?: string[]; speed?: number }

export function CrystalLattice({ colors, speed = 1 }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const c = colors || ['#c77dff','#4d96ff','#ff6b6b','#ffd93d','#6bcb77']

  const GRID = 4
  const nodes = useMemo(() => {
    const ns: {pos:[number,number,number]; color:string}[] = []
    for (let x=-GRID;x<=GRID;x++) for (let y=-GRID;y<=GRID;y++) for (let z=-GRID;z<=GRID;z++) {
      if (Math.abs(x)+Math.abs(y)+Math.abs(z) <= GRID+1) {
        ns.push({ pos:[x*1.4,y*1.4,z*1.4], color: c[(Math.abs(x+y+z)) % c.length] })
      }
    }
    return ns
  }, [c])

  const lineGeo = useMemo(() => {
    const lines: number[] = []
    for (let i=0;i<nodes.length;i++) for (let j=i+1;j<nodes.length;j++) {
      const [ax,ay,az] = nodes[i].pos; const [bx,by,bz] = nodes[j].pos
      const d = Math.sqrt((ax-bx)**2+(ay-by)**2+(az-bz)**2)
      if (d < 1.6) { lines.push(ax,ay,az,bx,by,bz) }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lines),3))
    return g
  }, [nodes])

  const instRef = useRef<THREE.InstancedMesh>(null)
  const dummy   = useMemo(()=>new THREE.Object3D(),[])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed
    if (groupRef.current) { groupRef.current.rotation.y=t*0.1; groupRef.current.rotation.x=Math.sin(t*0.07)*0.3 }
    if (instRef.current) {
      nodes.forEach((n,i)=>{
        const pulse = 1 + Math.sin(t*1.5+i*0.3)*0.15
        dummy.position.set(...n.pos)
        dummy.scale.setScalar(0.12*pulse)
        dummy.updateMatrix()
        instRef.current!.setMatrixAt(i,dummy.matrix)
        instRef.current!.setColorAt(i,new THREE.Color(n.color))
      })
      instRef.current.instanceMatrix.needsUpdate=true
      if(instRef.current.instanceColor)instRef.current.instanceColor.needsUpdate=true
    }
  })

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeo}><lineBasicMaterial color={c[1]} transparent opacity={0.2}/></lineSegments>
      <instancedMesh ref={instRef} args={[undefined,undefined,nodes.length]}>
        <octahedronGeometry args={[1,0]}/>
        <meshStandardMaterial emissiveIntensity={0.6} toneMapped={false}/>
      </instancedMesh>
      <ambientLight intensity={0.2}/>
      <pointLight color={c[0]} intensity={3} position={[5,5,5]}/>
      <pointLight color={c[2]} intensity={2} position={[-5,-4,-4]}/>
    </group>
  )
}
