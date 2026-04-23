import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const LERP_SPEEDS = [0.025, 0.03, 0.035, 0.028, 0.032, 0.027, 0.033, 0.029]
const PLATFORM_WIDTH = 1.5

interface InteractiveMusicianProps {
  position: [number, number, number]
  side: -1 | 1
  index: number
  instrumentType: 'danNguyet' | 'danNhi' | 'saoTruoc' | 'danTyBa' | 'drum' | 'singer' | 'silk'
  pose: 'standing' | 'sitting'
  gender: 'male' | 'female'
  facingAngle: number
  tunicColor: string
  pantsColor: string
  headwear: 'khan' | 'bun' | 'pink-wrap' | 'none'
  armsOut?: boolean
}

function InteractiveMusician({
  position,
  side,
  index,
  instrumentType,
  pose,
  gender,
  facingAngle,
  tunicColor,
  pantsColor,
  headwear,
  armsOut,
}: InteractiveMusicianProps) {
  const groupRef = useRef<THREE.Group>(null)
  const targetXRef = useRef(position[0])
  const currentXRef = useRef(position[0])
  const lerpSpeed = LERP_SPEEDS[index % LERP_SPEEDS.length]
  const seed = useMemo(() => Math.random() * 100, [])
  const { mouse } = useThree()
  const clockRef = useRef({ getElapsedTime: () => 0 })

  const isFemale = gender === 'female'
  const isStanding = pose === 'standing'
  const skinColor = '#ecd8b8'
  const hairColor = '#1a1018'

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    // Calculate target X based on mouse position
    const platformCenterX = position[0]
    const mouseInfluence = mouse.x * side * 1.5
    targetXRef.current = THREE.MathUtils.clamp(
      platformCenterX + mouseInfluence,
      platformCenterX - PLATFORM_WIDTH,
      platformCenterX + PLATFORM_WIDTH
    )

    // Smooth lerp to target
    currentXRef.current = THREE.MathUtils.lerp(currentXRef.current, targetXRef.current, lerpSpeed)
    groupRef.current.position.x = currentXRef.current
    groupRef.current.position.y = position[1]
    groupRef.current.position.z = position[2]

    // Existing animations
    const t = clock.getElapsedTime() + seed
    groupRef.current.rotation.y = facingAngle + Math.sin(t * 1.6) * 0.1
    groupRef.current.rotation.z = Math.sin(t * 2.4 + 1) * 0.05
    if (groupRef.current.children[0]) {
      groupRef.current.children[0].position.y = (isStanding ? 0.54 : 0.52) + Math.sin(t * 3) * 0.015
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={[0, facingAngle, 0]}>
      {/* HEAD */}
      <mesh position={[0, isStanding ? 0.54 : 0.52, 0]}>
        <sphereGeometry args={[0.075, 32, 24]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} emissive="#c8b090" emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[0, isStanding ? 0.56 : 0.54, -0.02]}>
        <sphereGeometry args={[0.078, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
        <meshStandardMaterial color={hairColor} roughness={0.7} />
      </mesh>
      <mesh position={[0, isStanding ? 0.59 : 0.57, 0.04]}>
        <boxGeometry args={[0.12, 0.025, 0.04]} />
        <meshStandardMaterial color={hairColor} roughness={0.7} />
      </mesh>
      {/* Eyes */}
      {[-0.025, 0.025].map((x, i) => (
        <mesh key={`eye-${i}`} position={[x, isStanding ? 0.545 : 0.525, 0.07]}>
          <boxGeometry args={[0.02, 0.006, 0.003]} />
          <meshBasicMaterial color="#2a1808" />
        </mesh>
      ))}
      {/* Cheeks */}
      {[-0.04, 0.04].map((x, i) => (
        <mesh key={`ck-${i}`} position={[x, isStanding ? 0.53 : 0.51, 0.065]}>
          <sphereGeometry args={[0.012, 32, 24]} />
          <meshStandardMaterial color="#e09888" roughness={0.6} emissive="#c07868" emissiveIntensity={0.1} />
        </mesh>
      ))}
      {/* Smile */}
      <mesh position={[0, isStanding ? 0.52 : 0.50, 0.072]}>
        <boxGeometry args={[0.02, 0.005, 0.003]} />
        <meshStandardMaterial color="#c06050" roughness={0.5} />
      </mesh>
      <mesh position={[0, isStanding ? 0.54 : 0.52, 0.075]}>
        <sphereGeometry args={[0.006, 32, 24]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>

      {/* HEADWEAR */}
      {headwear === 'khan' && (
        <group position={[0, isStanding ? 0.6 : 0.58, 0]}>
          <mesh><boxGeometry args={[0.13, 0.05, 0.11]} />
            <meshStandardMaterial color="#1a1828" roughness={0.65} /></mesh>
          <mesh position={[0, 0.015, 0.02]}><boxGeometry args={[0.11, 0.035, 0.06]} />
            <meshStandardMaterial color="#222238" roughness={0.6} /></mesh>
        </group>
      )}
      {headwear === 'bun' && (
        <group position={[0, isStanding ? 0.62 : 0.6, -0.01]}>
          <mesh><sphereGeometry args={[0.04, 32, 24]} />
            <meshStandardMaterial color={hairColor} roughness={0.7} /></mesh>
          <mesh position={[0.02, 0.02, 0.01]}><boxGeometry args={[0.05, 0.006, 0.006]} />
            <meshStandardMaterial color="#d4a540" roughness={0.3} metalness={0.6} /></mesh>
        </group>
      )}
      {headwear === 'pink-wrap' && (
        <group position={[0, isStanding ? 0.58 : 0.56, 0]}>
          <mesh><sphereGeometry args={[0.082, 32, 24]} />
            <meshStandardMaterial color="#e8889a" roughness={0.55} emissive="#c07080" emissiveIntensity={0.1} /></mesh>
          <mesh position={[0.04, -0.04, -0.05]} rotation={[0.3, 0, 0.3]}>
            <boxGeometry args={[0.03, 0.1, 0.015]} />
            <meshStandardMaterial color="#e898a8" roughness={0.5} /></mesh>
        </group>
      )}

      {/* BODY */}
      <mesh position={[0, isStanding ? 0.32 : 0.30, 0]}>
        <boxGeometry args={[0.17, isStanding ? 0.3 : 0.28, 0.11]} />
        <meshStandardMaterial color={tunicColor} roughness={0.6} emissive={tunicColor} emissiveIntensity={0.06} />
      </mesh>
      <mesh position={[0, isStanding ? 0.44 : 0.42, 0.05]}>
        <boxGeometry args={[0.06, 0.06, 0.02]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>
      <mesh position={[0, isStanding ? 0.19 : 0.18, 0]}>
        <boxGeometry args={[0.18, 0.02, 0.12]} />
        <meshStandardMaterial color="#4a3a2a" roughness={0.5} />
      </mesh>

      {/* LOWER BODY */}
      {isStanding ? (
        <>
          <mesh position={[-0.04, 0.06, 0]}>
            <boxGeometry args={[0.07, 0.22, 0.08]} />
            <meshStandardMaterial color={pantsColor} roughness={0.65} />
          </mesh>
          <mesh position={[0.04, 0.06, 0]}>
            <boxGeometry args={[0.07, 0.22, 0.08]} />
            <meshStandardMaterial color={pantsColor} roughness={0.65} />
          </mesh>
          {[-0.04, 0.04].map((x, i) => (
            <mesh key={`ft-${i}`} position={[x, -0.05, 0.02]}>
              <boxGeometry args={[0.06, 0.02, 0.07]} />
              <meshStandardMaterial color="#2a2018" roughness={0.7} />
            </mesh>
          ))}
        </>
      ) : (
        <>
          <mesh position={[-0.04, 0.07, 0.02]}>
            <boxGeometry args={[0.07, 0.1, 0.1]} />
            <meshStandardMaterial color={pantsColor} roughness={0.7} />
          </mesh>
          <mesh position={[0.04, 0.07, 0.02]}>
            <boxGeometry args={[0.07, 0.1, 0.1]} />
            <meshStandardMaterial color={pantsColor} roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.02, 0]}>
            <boxGeometry args={[0.18, 0.05, 0.16]} />
            <meshStandardMaterial color="#6a2020" roughness={0.6} emissive="#4a1010" emissiveIntensity={0.1} />
          </mesh>
        </>
      )}

      {/* ARMS */}
      {armsOut ? (
        <>
          <mesh position={[-0.14, 0.35, 0.04]} rotation={[0.2, 0, -0.8]}>
            <capsuleGeometry args={[0.025, 0.14, 12, 24]} />
            <meshStandardMaterial color={tunicColor} roughness={0.6} emissive={tunicColor} emissiveIntensity={0.06} />
          </mesh>
          <mesh position={[0.14, 0.35, 0.04]} rotation={[0.2, 0, 0.8]}>
            <capsuleGeometry args={[0.025, 0.14, 12, 24]} />
            <meshStandardMaterial color={tunicColor} roughness={0.6} emissive={tunicColor} emissiveIntensity={0.06} />
          </mesh>
          <mesh position={[-0.24, 0.26, 0.06]}>
            <sphereGeometry args={[0.02, 32, 24]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
          <mesh position={[0.24, 0.26, 0.06]}>
            <sphereGeometry args={[0.02, 32, 24]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[-0.11, 0.33, 0.04]} rotation={[0.3, 0, -0.35]}>
            <capsuleGeometry args={[0.025, 0.14, 12, 24]} />
            <meshStandardMaterial color={tunicColor} roughness={0.6} emissive={tunicColor} emissiveIntensity={0.06} />
          </mesh>
          <mesh position={[0.11, 0.33, 0.04]} rotation={[0.3, 0, 0.35]}>
            <capsuleGeometry args={[0.025, 0.14, 12, 24]} />
            <meshStandardMaterial color={tunicColor} roughness={0.6} emissive={tunicColor} emissiveIntensity={0.06} />
          </mesh>
          <mesh position={[-0.17, 0.24, 0.08]}>
            <sphereGeometry args={[0.02, 32, 24]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
          <mesh position={[0.17, 0.24, 0.08]}>
            <sphereGeometry args={[0.02, 32, 24]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
        </>
      )}

      {/* INSTRUMENTS */}
      {instrumentType === 'danNguyet' && (
        <group position={[0.12, 0.35, 0.06]} rotation={[0, 0, 0.6]}>
          <mesh><cylinderGeometry args={[0.1, 0.1, 0.035, 24]} />
            <meshStandardMaterial color="#8a5a28" roughness={0.45} emissive="#5a3818" emissiveIntensity={0.15} /></mesh>
          <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.085, 0.085, 0.02, 24]} />
            <meshStandardMaterial color="#d4a840" roughness={0.35} metalness={0.3} /></mesh>
          <mesh position={[0, 0.28, 0]}><boxGeometry args={[0.04, 0.38, 0.02]} />
            <meshStandardMaterial color="#5a3018" roughness={0.5} /></mesh>
          <mesh position={[0, 0.5, 0]}><boxGeometry args={[0.06, 0.06, 0.02]} />
            <meshStandardMaterial color="#4a2810" roughness={0.5} /></mesh>
          {[-0.03, 0.03].map((x, i) => (
            <mesh key={`peg-${i}`} position={[x, 0.48, 0.015]}><boxGeometry args={[0.008, 0.04, 0.008]} />
              <meshStandardMaterial color="#3a2010" roughness={0.6} /></mesh>
          ))}
          {[-0.008, 0.008].map((x, i) => (
            <mesh key={`str-${i}`} position={[x, 0.16, 0.02]}><boxGeometry args={[0.002, 0.5, 0.002]} />
              <meshStandardMaterial color="#c8c8c8" roughness={0.3} metalness={0.7} /></mesh>
          ))}
        </group>
      )}

      {instrumentType === 'danNhi' && (
        <group position={[0.15, 0.08, 0]}>
          <mesh><cylinderGeometry args={[0.05, 0.04, 0.1, 12]} />
            <meshStandardMaterial color="#6a3a18" roughness={0.5} emissive="#4a2810" emissiveIntensity={0.12} /></mesh>
          <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.012, 0.012, 0.52, 32]} />
            <meshStandardMaterial color="#5a3018" roughness={0.5} /></mesh>
          <mesh position={[0, 0.58, 0]}><sphereGeometry args={[0.025, 32, 24]} />
            <meshStandardMaterial color="#4a2810" roughness={0.5} /></mesh>
          <mesh position={[0.08, 0.2, 0]} rotation={[0, 0, 0.2]}><cylinderGeometry args={[0.003, 0.003, 0.4, 6]} />
            <meshStandardMaterial color="#5a3818" roughness={0.5} /></mesh>
        </group>
      )}

      {instrumentType === 'saoTruoc' && (
        <>
          <mesh position={[0.18, 0.42, 0.06]} rotation={[0, Math.PI / 2, 0.15]}>
            <cylinderGeometry args={[0.012, 0.012, 0.35, 32]} />
            <meshStandardMaterial color="#b8a050" roughness={0.4} emissive="#887830" emissiveIntensity={0.15} />
          </mesh>
          <group position={[0.04, 0.12, 0.04]}>
            <mesh><boxGeometry args={[0.08, 0.07, 0.04]} />
              <meshStandardMaterial color="#8a6838" roughness={0.55} emissive="#5a4820" emissiveIntensity={0.1} /></mesh>
            <mesh position={[0, 0.04, 0]}><boxGeometry args={[0.09, 0.015, 0.045]} />
              <meshStandardMaterial color="#6a5028" roughness={0.5} /></mesh>
            <mesh position={[-0.02, 0.18, -0.01]} rotation={[0, 0, -0.3]}><boxGeometry args={[0.015, 0.25, 0.005]} />
              <meshStandardMaterial color="#6a5028" roughness={0.5} /></mesh>
          </group>
        </>
      )}

      {instrumentType === 'danTyBa' && (
        <group position={[-0.14, 0.3, 0.05]} rotation={[0, 0, -0.4]}>
          <mesh scale={[1, 1.3, 0.3]}><sphereGeometry args={[0.1, 32, 24]} />
            <meshStandardMaterial color="#b07830" roughness={0.4} emissive="#805020" emissiveIntensity={0.15} /></mesh>
          <mesh position={[0, 0.22, 0]}><boxGeometry args={[0.04, 0.22, 0.02]} />
            <meshStandardMaterial color="#6a4020" roughness={0.5} /></mesh>
          <mesh position={[0, 0.35, 0]}><boxGeometry args={[0.05, 0.05, 0.015]} />
            <meshStandardMaterial color="#4a2810" roughness={0.5} /></mesh>
          {[-0.01, 0.01].map((x, i) => (
            <mesh key={`pstr-${i}`} position={[x, 0.1, 0.018]}><boxGeometry args={[0.002, 0.4, 0.002]} />
              <meshStandardMaterial color="#c8c8c8" roughness={0.3} metalness={0.7} /></mesh>
          ))}
        </group>
      )}

      {instrumentType === 'drum' && (
        <group position={[-0.2, 0.08, 0]}>
          <mesh><cylinderGeometry args={[0.07, 0.06, 0.1, 32]} />
            <meshStandardMaterial color="#5a2a10" roughness={0.5} emissive="#3a1808" emissiveIntensity={0.12} /></mesh>
          <mesh position={[0, 0.052, 0]}><cylinderGeometry args={[0.072, 0.072, 0.008, 32]} />
            <meshStandardMaterial color="#d8c898" roughness={0.6} /></mesh>
          <mesh position={[0, 0.048, 0]}><cylinderGeometry args={[0.075, 0.075, 0.006, 32]} />
            <meshStandardMaterial color="#c8a040" roughness={0.3} metalness={0.5} /></mesh>
          {[0, 2.1, 4.2].map((a, i) => (
            <mesh key={`tleg-${i}`} position={[Math.sin(a) * 0.04, -0.12, Math.cos(a) * 0.04]}
              rotation={[Math.cos(a) * 0.25, 0, -Math.sin(a) * 0.25]}>
              <cylinderGeometry args={[0.008, 0.008, 0.2, 6]} />
              <meshStandardMaterial color="#3a2010" roughness={0.6} />
            </mesh>
          ))}
        </group>
      )}

      {instrumentType === 'drum' && (
        <mesh position={[-0.16, 0.28, 0.06]} rotation={[0.5, 0, -0.3]}>
          <cylinderGeometry args={[0.005, 0.005, 0.18, 6]} />
          <meshStandardMaterial color="#5a3818" roughness={0.5} />
        </mesh>
      )}

      {instrumentType === 'silk' && (
        <>
          <mesh position={[-0.22, 0.3, 0.04]} rotation={[0.2, 0, -0.5]}>
            <boxGeometry args={[0.04, 0.3, 0.008]} />
            <meshStandardMaterial color="#e8889a" roughness={0.5} emissive="#c06878" emissiveIntensity={0.15} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[-0.28, 0.18, 0.06]} rotation={[0.3, 0.2, -0.8]}>
            <boxGeometry args={[0.035, 0.2, 0.006]} />
            <meshStandardMaterial color="#e898a8" roughness={0.5} emissive="#c07888" emissiveIntensity={0.12} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}
    </group>
  )
}

interface InteractiveMusiciansProps {
  side: -1 | 1
  basePosition: [number, number, number]
}

export default function InteractiveMusicians({ side, basePosition }: InteractiveMusiciansProps) {
  const musicians: InteractiveMusicianProps[] = side === -1
    ? [
        { position: [basePosition[0], basePosition[1], basePosition[2] - 1.3], side, index: 0, instrumentType: 'danNguyet', pose: 'standing', gender: 'male', facingAngle: Math.PI / 2, tunicColor: '#1a1a28', pantsColor: '#1a1a28', headwear: 'khan' },
        { position: [basePosition[0], basePosition[1], basePosition[2] - 0.4], side, index: 1, instrumentType: 'danNhi', pose: 'sitting', gender: 'male', facingAngle: Math.PI / 2, tunicColor: '#1a1a28', pantsColor: '#1a1a28', headwear: 'khan' },
        { position: [basePosition[0], basePosition[1], basePosition[2] + 0.3], side, index: 2, instrumentType: 'saoTruoc', pose: 'standing', gender: 'female', facingAngle: Math.PI / 2, tunicColor: '#e8e0d8', pantsColor: '#1a1a28', headwear: 'bun' },
        { position: [basePosition[0], basePosition[1], basePosition[2] + 1.0], side, index: 3, instrumentType: 'singer', pose: 'standing', gender: 'male', facingAngle: Math.PI / 2, tunicColor: '#1a2a3a', pantsColor: '#1a1a28', headwear: 'none', armsOut: true },
      ]
    : [
        { position: [basePosition[0], basePosition[1], basePosition[2] - 1.3], side, index: 4, instrumentType: 'singer', pose: 'standing', gender: 'female', facingAngle: -Math.PI / 2, tunicColor: '#1a1a28', pantsColor: '#1a1a28', headwear: 'bun', armsOut: true },
        { position: [basePosition[0], basePosition[1], basePosition[2] - 0.4], side, index: 5, instrumentType: 'drum', pose: 'standing', gender: 'male', facingAngle: -Math.PI / 2, tunicColor: '#1a1a28', pantsColor: '#1a1a28', headwear: 'khan' },
        { position: [basePosition[0], basePosition[1], basePosition[2] + 0.3], side, index: 6, instrumentType: 'danTyBa', pose: 'standing', gender: 'male', facingAngle: -Math.PI / 2, tunicColor: '#1a1a28', pantsColor: '#1a1a28', headwear: 'khan' },
        { position: [basePosition[0], basePosition[1], basePosition[2] + 1.0], side, index: 7, instrumentType: 'silk', pose: 'standing', gender: 'female', facingAngle: -Math.PI / 2, tunicColor: '#1a1a28', pantsColor: '#1a1a28', headwear: 'pink-wrap' },
      ]

  return (
    <group scale={[1.5, 1.5, 1.5]}>
      {musicians.map((props, i) => (
        <InteractiveMusician key={`${side}-${i}`} {...props} />
      ))}
    </group>
  )
}
