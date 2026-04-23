import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface AudienceViewerProps {
  position: [number, number, number]
  rotation?: number
  pose: 'forward' | 'leaning' | 'phone' | 'side'
  tunicColor: string
  pantsColor: string
  headwear: 'none' | 'khan' | 'bun'
  scale?: number
}

function AudienceViewer({
  position,
  rotation = 0,
  pose,
  tunicColor,
  pantsColor,
  headwear,
  scale = 0.8,
}: AudienceViewerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)
  const seed = useMemo(() => Math.random() * 100, [])

  const skinColor = '#ecd8b8'
  const hairColor = '#1a1018'
  const woodColor = '#4a3020'
  const woodDark = '#3a2010'

  // Pose-specific adjustments
  const leanAngle = pose === 'leaning' ? 0.15 : pose === 'phone' ? 0.1 : 0
  const headOffset = pose === 'phone' ? 0.08 : pose === 'leaning' ? 0.05 : 0

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime() + seed

    // Subtle body sway
    groupRef.current.rotation.z = Math.sin(t * 0.3 + seed) * 0.01 + leanAngle
    groupRef.current.rotation.y = rotation + Math.sin(t * 0.2 + seed) * 0.02

    // Occasional head turn
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.15 + seed) * 0.08
      headRef.current.rotation.z = Math.sin(t * 0.25 + seed) * 0.02
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, leanAngle]} scale={scale}>
      {/* CHAIR - wooden seat */}
      {/* Chair legs - taller for proper seat height */}
      {[[-0.08, -0.15, -0.06], [0.08, -0.15, -0.06], [-0.08, -0.15, 0.06], [0.08, -0.15, 0.06]].map(([lx, ly, lz], i) => (
        <mesh key={`leg-${i}`} position={[lx, ly, lz]}>
          <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
          <meshStandardMaterial color={woodDark} roughness={0.65} />
        </mesh>
      ))}
      {/* Seat - at chair leg top */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.22, 0.03, 0.18]} />
        <meshStandardMaterial color={woodColor} roughness={0.6} emissive={woodDark} emissiveIntensity={0.1} />
      </mesh>
      {/* Backrest - behind seat */}
      <mesh position={[0, 0.15, 0.12]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.22, 0.25, 0.025]} />
        <meshStandardMaterial color={woodColor} roughness={0.6} emissive={woodDark} emissiveIntensity={0.1} />
      </mesh>

      {/* PERSON SITTING ON CHAIR */}
      {/* HEAD */}
      <group ref={headRef} position={[0, 0.4 + headOffset, 0.04]}>
        <mesh>
          <sphereGeometry args={[0.055, 24, 20]} />
          <meshStandardMaterial color={skinColor} roughness={0.5} />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 0.02, -0.01]}>
          <sphereGeometry args={[0.057, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial color={hairColor} roughness={0.7} />
        </mesh>
        {/* Headwear */}
        {headwear === 'khan' && (
          <mesh position={[0, 0.04, 0]}>
            <boxGeometry args={[0.09, 0.035, 0.07]} />
            <meshStandardMaterial color="#1a1828" roughness={0.65} />
          </mesh>
        )}
        {headwear === 'bun' && (
          <mesh position={[0, 0.06, -0.01]}>
            <sphereGeometry args={[0.028, 24, 20]} />
            <meshStandardMaterial color={hairColor} roughness={0.7} />
          </mesh>
        )}
        {/* Simple face - eyes */}
        <mesh position={[-0.012, 0.01, 0.05]}>
          <boxGeometry args={[0.01, 0.003, 0.002]} />
          <meshBasicMaterial color="#2a1808" />
        </mesh>
        <mesh position={[0.012, 0.01, 0.05]}>
          <boxGeometry args={[0.01, 0.003, 0.002]} />
          <meshBasicMaterial color="#2a1808" />
        </mesh>
      </group>

      {/* BODY - upper torso sitting */}
      <mesh position={[0, 0.25, 0.02]}>
        <boxGeometry args={[0.13, 0.2, 0.08]} />
        <meshStandardMaterial color={tunicColor} roughness={0.6} />
      </mesh>

      {/* LOWER BODY - sitting on chair seat */}
      <mesh position={[0, 0.08, 0.03]}>
        <boxGeometry args={[0.13, 0.08, 0.07]} />
        <meshStandardMaterial color={pantsColor} roughness={0.65} />
      </mesh>

      {/* ARMS - positioned on lap or holding phone */}
      {pose === 'phone' ? (
        /* Arms holding phone in front */
        <>
          <mesh position={[-0.08, 0.22, 0.06]} rotation={[0.5, 0, -0.4]}>
            <capsuleGeometry args={[0.018, 0.1, 8, 16]} />
            <meshStandardMaterial color={tunicColor} roughness={0.6} />
          </mesh>
          <mesh position={[0.08, 0.22, 0.06]} rotation={[0.5, 0, 0.4]}>
            <capsuleGeometry args={[0.018, 0.1, 8, 16]} />
            <meshStandardMaterial color={tunicColor} roughness={0.6} />
          </mesh>
          {/* Phone in hands */}
          <mesh position={[0, 0.18, 0.1]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.025, 0.045, 0.004]} />
            <meshStandardMaterial color="#303030" roughness={0.3} metalness={0.5} />
          </mesh>
        </>
      ) : pose === 'leaning' ? (
        /* Arms resting on lap */
        <>
          <mesh position={[-0.08, 0.2, 0.05]} rotation={[0.6, 0, -0.3]}>
            <capsuleGeometry args={[0.018, 0.1, 8, 16]} />
            <meshStandardMaterial color={tunicColor} roughness={0.6} />
          </mesh>
          <mesh position={[0.08, 0.2, 0.05]} rotation={[0.6, 0, 0.3]}>
            <capsuleGeometry args={[0.018, 0.1, 8, 16]} />
            <meshStandardMaterial color={tunicColor} roughness={0.6} />
          </mesh>
        </>
      ) : (
        /* Normal arms at side / resting on lap */
        <>
          <mesh position={[-0.08, 0.22, 0.04]} rotation={[0.3, 0, -0.2]}>
            <capsuleGeometry args={[0.018, 0.1, 8, 16]} />
            <meshStandardMaterial color={tunicColor} roughness={0.6} />
          </mesh>
          <mesh position={[0.08, 0.22, 0.04]} rotation={[0.3, 0, 0.2]}>
            <capsuleGeometry args={[0.018, 0.1, 8, 16]} />
            <meshStandardMaterial color={tunicColor} roughness={0.6} />
          </mesh>
        </>
      )}
    </group>
  )
}

// Color palettes for traditional Vietnamese clothing
const CLOTHING_PALETTES = [
  { tunic: '#2a4a6a', pants: '#1a1a28' }, // Dark blue/navy
  { tunic: '#4a3a2a', pants: '#2a2a1a' }, // Brown/earth
  { tunic: '#6a4a3a', pants: '#3a2a1a' }, // Terracotta
  { tunic: '#3a5a4a', pants: '#2a3a2a' }, // Forest green
  { tunic: '#5a3a4a', pants: '#3a2a3a' }, // Plum
  { tunic: '#e8d8c8', pants: '#4a3a2a' }, // Cream/brown
  { tunic: '#d8c8b8', pants: '#3a2a1a' }, // Beige/brown
  { tunic: '#2a3a4a', pants: '#1a1a28' }, // Slate blue
]

export default function AudienceViewers() {
  const viewers: AudienceViewerProps[] = []

  // Row 1 (closer, z ~ 4.8) - 6 viewers
  const row1Z = 4.8
  const row1Y = 0
  for (let i = 0; i < 6; i++) {
    const x = (i - 2.5) * 0.9
    const palette = CLOTHING_PALETTES[i % CLOTHING_PALETTES.length]
    const poses: AudienceViewerProps['pose'][] = ['forward', 'leaning', 'phone', 'forward', 'side', 'leaning']
    viewers.push({
      position: [x, row1Y, row1Z],
      rotation: Math.PI, // Facing the stage
      pose: poses[i],
      tunicColor: palette.tunic,
      pantsColor: palette.pants,
      headwear: i % 3 === 0 ? 'khan' : i % 3 === 1 ? 'bun' : 'none',
      scale: 0.8,
    })
  }

  // Row 2 (further, z ~ 5.5) - 6 viewers
  const row2Z = 5.5
  const row2Y = 0
  for (let i = 0; i < 6; i++) {
    const x = (i - 2.5) * 0.85
    const palette = CLOTHING_PALETTES[(i + 2) % CLOTHING_PALETTES.length]
    const poses: AudienceViewerProps['pose'][] = ['leaning', 'forward', 'side', 'phone', 'forward', 'leaning']
    viewers.push({
      position: [x, row2Y, row2Z],
      rotation: Math.PI,
      pose: poses[i],
      tunicColor: palette.tunic,
      pantsColor: palette.pants,
      headwear: i % 2 === 0 ? 'none' : 'bun',
      scale: 0.75,
    })
  }

  // Row 3 (furthest, z ~ 6.1) - 4 viewers
  const row3Z = 6.1
  const row3Y = 0
  for (let i = 0; i < 4; i++) {
    const x = (i - 1.5) * 1.0
    const palette = CLOTHING_PALETTES[(i + 4) % CLOTHING_PALETTES.length]
    viewers.push({
      position: [x, row3Y, row3Z],
      rotation: Math.PI,
      pose: 'forward',
      tunicColor: palette.tunic,
      pantsColor: palette.pants,
      headwear: 'none',
      scale: 0.7,
    })
  }

  return (
    <group>
      {viewers.map((viewer, i) => (
        <AudienceViewer key={`viewer-${i}`} {...viewer} />
      ))}
    </group>
  )
}
