import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Audience seating — Vietnamese water puppet theater style.
 * Optimized: shared geometries, reduced draw calls.
 */
export default function AudienceSeats() {
  const crimson = useMemo(() => mat('#cc3030', 0.6, '#aa2020', 0.25), [])
  const crimsonDark = useMemo(() => mat('#b02828', 0.65, '#901818', 0.2), [])
  const beige = useMemo(() => mat('#e8d8a8', 0.7, '#c8b888', 0.15), [])
  const beigeDark = useMemo(() => mat('#d4c498', 0.72, '#b8a878', 0.12), [])
  const metalFrame = useMemo(() => mat('#6a6a6a', 0.45, '#4a4a4a', 0.05, 0.6), [])
  const floorMat = useMemo(() => mat('#050505', 0.95, '#020202', 0.01), [])
  const darkStripeMat = useMemo(() => mat('#a83030', 0.7, '#601818', 0.15), [])

  // Shared geometries — created once, reused by all seats
  const geo = useMemo(() => ({
    leg: new THREE.BoxGeometry(0.02, 0.18, 0.35),
    crossBar: new THREE.BoxGeometry(0.36, 0.015, 0.02),
    seatPad: new THREE.BoxGeometry(0.4, 0.06, 0.36),
    seatTrim: new THREE.BoxGeometry(0.4, 0.06, 0.02),
    backrest: new THREE.BoxGeometry(0.4, 0.52, 0.04),
    backStrip: new THREE.BoxGeometry(0.04, 0.48, 0.02),
    beigeCover: new THREE.BoxGeometry(0.36, 0.44, 0.015),
    coverFold: new THREE.BoxGeometry(0.36, 0.04, 0.08),
    stripe: new THREE.BoxGeometry(0.34, 0.04, 0.005),
    seatNum: new THREE.BoxGeometry(0.12, 0.09, 0.004),
  }), [])

  const rows = [
    { z: 4.8, y: -0.55, seats: 9, seatStart: 1 },
    { z: 5.5, y: -0.38, seats: 11, seatStart: 1 },
    { z: 6.2, y: -0.18, seats: 13, seatStart: 1 },
  ]
  const spacing = 0.65

  return (
    <group>
      <mesh position={[0, -0.82, 5.2]} material={floorMat} receiveShadow>
        <boxGeometry args={[12, 0.06, 3.5]} />
      </mesh>

      {rows.map((row, ri) => (
        <mesh key={`riser-${ri}`} position={[0, row.y - 0.17, row.z]} material={floorMat} receiveShadow>
          <boxGeometry args={[row.seats * spacing + 0.6, 0.1, 0.75]} />
        </mesh>
      ))}

      {rows.map((row, ri) =>
        Array.from({ length: row.seats }).map((_, si) => {
          const x = (si - (row.seats - 1) / 2) * spacing
          return (
            <group key={`s-${ri}-${si}`} position={[x, row.y, row.z]} rotation={[0, Math.PI, 0]}>
              {/* Legs */}
              <mesh position={[-0.18, -0.08, 0]} geometry={geo.leg} material={metalFrame} />
              <mesh position={[0.18, -0.08, 0]} geometry={geo.leg} material={metalFrame} />
              <mesh position={[0, -0.14, 0]} geometry={geo.crossBar} material={metalFrame} />
              {/* Seat pad */}
              <mesh position={[0, 0.02, 0.04]} geometry={geo.seatPad} material={crimson} />
              <mesh position={[0, 0.02, 0.23]} geometry={geo.seatTrim} material={crimsonDark} />
              {/* Backrest */}
              <mesh position={[0, 0.33, -0.16]} geometry={geo.backrest} material={crimson} />
              <mesh position={[-0.17, 0.33, -0.14]} geometry={geo.backStrip} material={crimsonDark} />
              <mesh position={[0.17, 0.33, -0.14]} geometry={geo.backStrip} material={crimsonDark} />
              {/* Beige cover */}
              <mesh position={[0, 0.38, -0.20]} geometry={geo.beigeCover} material={beige} />
              <mesh position={[0, 0.6, -0.17]} geometry={geo.coverFold} material={beigeDark} />
              <mesh position={[0, 0.28, -0.215]} geometry={geo.stripe} material={darkStripeMat} />
              <mesh position={[0, 0.48, -0.215]} geometry={geo.stripe} material={darkStripeMat} />
              <mesh position={[0, 0.38, -0.215]} geometry={geo.seatNum} material={beige} />
            </group>
          )
        })
      )}

      {/* Consolidated lights: 5 → 2 */}
      <pointLight position={[0, 3, 5.5]} intensity={5} color="#ffe8c0" distance={16} decay={1} />
      <pointLight position={[0, 0.5, 5.5]} intensity={1.5} color="#e0d0b0" distance={10} decay={1.3} />
    </group>
  )
}

function mat(color: string, roughness: number, emissive: string, emissiveIntensity: number, metalness = 0.05) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, emissive, emissiveIntensity })
}
