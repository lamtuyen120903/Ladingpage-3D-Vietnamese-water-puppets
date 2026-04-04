import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Theater framing — green tasseled barrier, overhead foliage.
 * Optimized: shared geometries, InstancedMesh for tassels.
 */
export default function TheaterFrame() {
  const greenDark = useMemo(() => mat('#1a5a3a', 0.65, '#0a3a20', 0.15), [])
  const greenFringe = useMemo(() => mat('#1a6a3a', 0.6, '#0a4a28', 0.2), [])
  const greenLeaf = useMemo(() => mat('#2a7a30', 0.6, '#1a5a20', 0.2), [])
  const greenLeafDark = useMemo(() => mat('#1a5a20', 0.65, '#0a3a10', 0.15), [])
  const wood = useMemo(() => mat('#5a3a20', 0.7, '#3a2210', 0.08), [])
  const goldTrim = useMemo(() => mat('#c8a040', 0.35, '#a08030', 0.3, 0.6), [])
  const numberPlate = useMemo(() => mat('#d8c890', 0.75, '#b0a068', 0.1), [])
  const numSquareMat = useMemo(() => mat('#4a3a20', 0.8, '#2a1a08', 0.1), [])

  // Shared geometries
  const geo = useMemo(() => ({
    numPlate: new THREE.BoxGeometry(0.35, 0.25, 0.02),
    numSquare: new THREE.BoxGeometry(0.15, 0.15, 0.005),
    post: new THREE.BoxGeometry(0.06, 0.4, 0.2),
    branch: new THREE.BoxGeometry(2.5, 0.08, 0.06),
    leaf1: new THREE.BoxGeometry(0.4, 0.08, 0.2),
    leaf2: new THREE.BoxGeometry(0.35, 0.06, 0.18),
    leaf3: new THREE.BoxGeometry(0.3, 0.07, 0.15),
  }), [])

  return (
    <group>
      {/* ===== GREEN TASSELED BARRIER ===== */}
      <group position={[0, -0.4, 4.3]}>
        <mesh position={[0, -0.15, 0]} material={greenDark}>
          <boxGeometry args={[12, 0.6, 0.15]} />
        </mesh>
        <mesh position={[0, 0.16, 0]} material={goldTrim}>
          <boxGeometry args={[12.1, 0.04, 0.18]} />
        </mesh>
        <mesh position={[0, -0.46, 0]} material={goldTrim}>
          <boxGeometry args={[12.1, 0.03, 0.16]} />
        </mesh>

        {/* Tassels — InstancedMesh (40 → 1 draw call) */}
        <TasselRow count={40} startX={-5.8} spacing={0.145} material={greenFringe} />

        {/* Seat number plates */}
        {Array.from({ length: 20 }).map((_, i) => (
          <group key={`bn-${i}`} position={[-5.2 + i * 0.54, -0.12, 0.09]}>
            <mesh geometry={geo.numPlate} material={numberPlate} />
            <mesh position={[0, 0, 0.012]} geometry={geo.numSquare} material={numSquareMat} />
          </group>
        ))}

        {/* Decorative posts */}
        {[-4.5, -2.25, 0, 2.25, 4.5].map((x, i) => (
          <mesh key={`bp-${i}`} position={[x, 0, 0]} geometry={geo.post} material={goldTrim} />
        ))}
      </group>

      {/* ===== OVERHEAD FOLIAGE ===== */}
      <group position={[0, 6.5, 0]}>
        {generateLeafPositions().map((pos, i) => {
          const s = 0.6 + seededRandom(i * 7 + 50) * 0.5
          const lm = i % 2 === 0 ? greenLeaf : greenLeafDark
          return (
            <group key={`leaf-${i}`} position={pos} scale={s}>
              <mesh geometry={geo.leaf1} material={lm} rotation={[0.2, 0.3, 0.1]} />
              <mesh geometry={geo.leaf2} material={lm} position={[0.15, -0.05, 0.1]} rotation={[-0.15, -0.2, 0.3]} />
              <mesh geometry={geo.leaf3} material={lm} position={[-0.1, 0.05, -0.08]} rotation={[0.1, 0.5, -0.2]} />
            </group>
          )
        })}
        {[[-3, 0.2, 1], [2.5, 0.3, 0.5], [-1, 0.1, -0.5], [4, 0.15, 0.8]].map(([x, y, z], i) => (
          <mesh key={`branch-${i}`} position={[x, y, z]} rotation={[0, 0, (i % 2 === 0 ? 0.3 : -0.2)]}
            geometry={geo.branch} material={wood} />
        ))}
      </group>
    </group>
  )
}

/** InstancedMesh for animated tassels — 40 meshes → 1 draw call */
function TasselRow({ count, startX, spacing, material }: {
  count: number; startX: number; spacing: number; material: THREE.Material
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const geo = useMemo(() => new THREE.BoxGeometry(0.015, 0.2, 0.01), [])
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Set initial positions
  useMemo(() => {
    if (!meshRef.current) return
    for (let i = 0; i < count; i++) {
      dummy.position.set(startX + i * spacing, -0.55, 0.08)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [meshRef.current])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const x = startX + i * spacing
      dummy.position.set(x, -0.55, 0.08)
      dummy.rotation.set(0, 0, Math.sin(t * 0.5 + x * 4) * 0.04)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={meshRef} args={[geo, material, count]} />
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

function generateLeafPositions(): [number, number, number][] {
  const positions: [number, number, number][] = []
  for (let i = 0; i < 20; i++) {
    const x = (seededRandom(i * 3) - 0.5) * 14
    const y = (seededRandom(i * 3 + 1) - 0.5) * 0.8
    const z = (seededRandom(i * 3 + 2) - 0.5) * 3 - 0.5
    positions.push([x, y, z])
  }
  return positions
}

function mat(color: string, roughness: number, emissive: string, emissiveIntensity: number, metalness = 0.05) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, emissive, emissiveIntensity })
}
