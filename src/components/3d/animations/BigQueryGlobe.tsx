'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { colors?: string[]; speed?: number }

// Convert lat/lon to 3D sphere point
function latLonToVec3(lat: number, lon: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  )
}

export function BigQueryGlobe({ colors, speed = 1 }: Props) {
  const globeRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const c = colors || ['#c77dff', '#4d96ff', '#ff6b6b', '#ffd93d', '#6bcb77', '#ff9a3c']

  // Major data center locations (approx lat/lon)
  const datacenters = useMemo(() => [
    { lat: 37.4, lon: -122.1, label: 'us-west1' },     // GCP Oregon
    { lat: 40.7, lon: -74.0,  label: 'us-east1' },     // GCP South Carolina
    { lat: 51.5, lon: -0.1,   label: 'europe-west2' }, // London
    { lat: 48.8, lon: 2.3,    label: 'europe-west1' }, // Belgium
    { lat: 35.7, lon: 139.7,  label: 'asia-northeast1' }, // Tokyo
    { lat: 1.3,  lon: 103.8,  label: 'asia-southeast1' }, // Singapore
    { lat: -33.9,lon: 151.2,  label: 'australia-southeast1' }, // Sydney
    { lat: 19.4, lon: -99.1,  label: 'northamerica-northeast1' }, // Montreal
  ], [])

  const RADIUS = 3.5

  const dcPositions = useMemo(() =>
    datacenters.map(dc => latLonToVec3(dc.lat, dc.lon, RADIUS)), [datacenters])

  // Query beams between DC pairs
  const beams = useMemo(() => {
    const pairs: [number, number][] = [
      [0,1],[0,4],[1,2],[2,3],[3,5],[4,5],[5,6],[6,7],[0,7],[1,3]
    ]
    return pairs.map(([a, b]) => ({ from: dcPositions[a], to: dcPositions[b] }))
  }, [dcPositions])

  // Beam particles
  const BEAM_PTS = 25
  const beamData = useMemo(() => beams.flatMap(b =>
    Array.from({ length: BEAM_PTS }, (_, i) => ({
      from: b.from,
      to: b.to,
      t: (i / BEAM_PTS) + Math.random() * 0.1,
      spd: (0.004 + Math.random() * 0.006) * speed,
    }))
  ), [beams, speed])

  const instRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed
    if (globeRef.current) {
      globeRef.current.rotation.y = t * 0.08
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.15
      ringRef.current.rotation.z = t * 0.07
    }

    if (instRef.current) {
      beamData.forEach((b, i) => {
        b.t = (b.t + b.spd) % 1
        // Arc over sphere surface
        const mid = new THREE.Vector3().addVectors(b.from, b.to).multiplyScalar(0.5)
        mid.normalize().multiplyScalar(RADIUS + 1.5)
        // Quadratic bezier
        const p0 = b.from, p1 = mid, p2 = b.to
        const tt = b.t
        const pos = new THREE.Vector3(
          (1-tt)*(1-tt)*p0.x + 2*(1-tt)*tt*p1.x + tt*tt*p2.x,
          (1-tt)*(1-tt)*p0.y + 2*(1-tt)*tt*p1.y + tt*tt*p2.y,
          (1-tt)*(1-tt)*p0.z + 2*(1-tt)*tt*p1.z + tt*tt*p2.z,
        )
        dummy.position.copy(pos)
        dummy.scale.setScalar(0.07)
        dummy.updateMatrix()
        instRef.current!.setMatrixAt(i, dummy.matrix)
      })
      instRef.current.instanceMatrix.needsUpdate = true
    }
  })

  // Globe wireframe lines (latitude/longitude)
  const gridGeo = useMemo(() => {
    const lines: number[] = []
    const LATS = 10, LONS = 18, SEGMENTS = 64
    // Latitude circles
    for (let la = -LATS/2; la <= LATS/2; la++) {
      const lat = (la / LATS) * 160
      for (let s = 0; s <= SEGMENTS; s++) {
        const lon = (s / SEGMENTS) * 360 - 180
        const v = latLonToVec3(lat, lon, RADIUS * 1.01)
        lines.push(v.x, v.y, v.z)
        if (s > 0 && s < SEGMENTS) lines.push(v.x, v.y, v.z)
      }
    }
    // Longitude lines
    for (let lo = 0; lo < LONS; lo++) {
      const lon = (lo / LONS) * 360 - 180
      for (let s = 0; s <= SEGMENTS; s++) {
        const lat = (s / SEGMENTS) * 180 - 90
        const v = latLonToVec3(lat, lon, RADIUS * 1.01)
        lines.push(v.x, v.y, v.z)
        if (s > 0 && s < SEGMENTS) lines.push(v.x, v.y, v.z)
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lines), 3))
    return geo
  }, [])

  return (
    <>
      {/* Globe wireframe */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[RADIUS, 32, 32]} />
        <meshStandardMaterial color={c[1]} transparent opacity={0.08} />
      </mesh>

      {/* Grid lines (rotates with globe) */}
      <group ref={globeRef as any}>
        <lineSegments geometry={gridGeo}>
          <lineBasicMaterial color={c[1]} transparent opacity={0.18} />
        </lineSegments>

        {/* Datacenter dots */}
        {dcPositions.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color={c[i % c.length]} emissive={c[i % c.length]} emissiveIntensity={1.5} />
          </mesh>
        ))}
      </group>

      {/* Orbit ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[RADIUS + 0.8, 0.03, 8, 120]} />
        <meshBasicMaterial color={c[0]} transparent opacity={0.4} />
      </mesh>

      {/* Query beam particles */}
      <instancedMesh ref={instRef} args={[undefined, undefined, beamData.length]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial color={c[3]} emissive={c[3]} emissiveIntensity={2.5} />
      </instancedMesh>

      {/* Ambient background */}
      <StarBG colors={c} />

      <ambientLight intensity={0.1} />
      <pointLight color={c[0]} intensity={3} position={[6, 4, 5]} />
      <pointLight color={c[1]} intensity={2} position={[-5, -3, -4]} />
      <pointLight color={c[3]} intensity={1} position={[0, 8, 0]} />
    </>
  )
}

function StarBG({ colors }: { colors: string[] }) {
  const ref = useRef<THREE.Points>(null)
  const { pos, col } = useMemo(() => {
    const n = 1200
    const pos = new Float32Array(n * 3)
    const col = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const r = 12 + Math.random() * 10
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      const c = new THREE.Color(colors[i % colors.length])
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
    }
    return { pos, col }
  }, [colors])
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.008 })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={pos} count={pos.length / 3} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={col} count={col.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.5} />
    </points>
  )
}
