import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef, useMemo } from 'react'
import * as THREE from 'three'
import type { ActId, StagePhase } from '../App'
import type { Project } from '../data/projects'
import ThuyDinh from './ThuyDinh'
import WaterSurface from './WaterSurface'
import PuppetGroup from './PuppetGroup'
import StageLighting from './StageLighting'
import AudienceSeats from './AudienceSeats'
import TheaterFrame from './TheaterFrame'
import EnhancedPostProcessing from './EnhancedPostProcessing'
import WaterParticles from './WaterParticles'
import AmbientParticles from './AmbientParticles'
import CinematicCamera from './CinematicCamera'

interface Props {
  currentAct: ActId
  phase: StagePhase
  onPuppetClick: (project: Project) => void
  onPuppetHover: (id: string | null) => void
}

export default function PuppetStage({ currentAct, phase, onPuppetClick, onPuppetHover }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 2.2, 9], fov: 56, near: 0.1, far: 60 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.3,
      }}
      scene={{ background: new THREE.Color('#f5ead4') }}
      shadows
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%' }}
    >
      <fog attach="fog" args={['#f5ead4', 18, 45]} />

      <Suspense fallback={null}>
        <CinematicCamera phase={phase} />
        <DongSonBackground />
        <StageLighting currentAct={currentAct} />
        <ThuyDinh />
        <WaterSurface />
        <PuppetGroup
          currentAct={currentAct}
          phase={phase}
          onPuppetClick={onPuppetClick}
          onPuppetHover={onPuppetHover}
        />
        <AudienceSeats />
        <TheaterFrame />
        <WaterParticles currentAct={currentAct} phase={phase} />
        <AmbientParticles />
        {/* Enhanced post-processing: Bloom + Vignette + ChromaticAberration */}
        <EnhancedPostProcessing />
      </Suspense>
    </Canvas>
  )
}

function DongSonBackground() {
  const ribbonRef1 = useRef<THREE.Group>(null)
  const ribbonRef2 = useRef<THREE.Group>(null)
  const starRef = useRef<THREE.Mesh>(null)
  const cloudRefs = useRef<THREE.Group[]>([])
  const craneRefs = useRef<THREE.Group[]>([])
  const petalRefs = useRef<THREE.Mesh[]>([])
  const mistRef = useRef<THREE.Group>(null)
  const villageRef = useRef<THREE.Group>(null)
  const starFieldRef = useRef<THREE.Group>(null)
  const lensFlareRef = useRef<THREE.Mesh>(null)
  const parallaxRef = useRef<THREE.Group>(null)

  // Memoized materials — prevent recreation every render
  const mats = useMemo(() => ({
    cream: new THREE.MeshBasicMaterial({ color: '#f5ead4' }),
    starGold: new THREE.MeshBasicMaterial({ color: '#e8c840', transparent: true, opacity: 0.85 }),
    starGlow: new THREE.MeshBasicMaterial({ color: '#f0d048', transparent: true, opacity: 0.3 }),
    starHalo: new THREE.MeshBasicMaterial({ color: '#f8e068', transparent: true, opacity: 0.12 }),
    frameRed: new THREE.MeshStandardMaterial({ color: '#b83828', roughness: 0.45, emissive: '#882018', emissiveIntensity: 0.25 }),
    frameRedInner: new THREE.MeshStandardMaterial({ color: '#a03020', roughness: 0.55, transparent: true, opacity: 0.5 }),
    trimGold: new THREE.MeshStandardMaterial({ color: '#d8a840', roughness: 0.25, metalness: 0.5, emissive: '#a07828', emissiveIntensity: 0.2 }),
    trimGoldInner: new THREE.MeshStandardMaterial({ color: '#c8982e', roughness: 0.3, metalness: 0.45 }),
    ribbonRed: new THREE.MeshStandardMaterial({ color: '#c83030', roughness: 0.4, emissive: '#a02020', emissiveIntensity: 0.22 }),
    ribbonRedAlt: new THREE.MeshStandardMaterial({ color: '#b82828', roughness: 0.4, emissive: '#a02020', emissiveIntensity: 0.22 }),
    ribbonGold: new THREE.MeshStandardMaterial({ color: '#d4a540', roughness: 0.25, metalness: 0.4 }),
    mistWhite: new THREE.MeshBasicMaterial({ color: '#f8f0d8', transparent: true, opacity: 0.45 }),
  }), [])

  const starShape = useMemo(() => {
    const shape = new THREE.Shape()
    const outerR = 3.2, innerR = 1.3
    for (let i = 0; i < 5; i++) {
      const oA = (i * 2 * Math.PI) / 5 - Math.PI / 2
      const iA = oA + Math.PI / 5
      const m = i === 0 ? 'moveTo' : 'lineTo'
      shape[m](Math.cos(oA) * outerR, Math.sin(oA) * outerR)
      shape.lineTo(Math.cos(iA) * innerR, Math.sin(iA) * innerR)
    }
    shape.closePath()
    return shape
  }, [])

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime()
    const mouseX = camera.position.x * 0.02

    // Star pulse + glow
    if (starRef.current) {
      const s = 1 + Math.sin(t * 0.2) * 0.02
      starRef.current.scale.set(s, s, 1)
    }
    // Ribbon sway
    if (ribbonRef1.current) {
      ribbonRef1.current.rotation.z = Math.sin(t * 0.15) * 0.02
      ribbonRef1.current.position.y = 5 + Math.sin(t * 0.1) * 0.1
    }
    if (ribbonRef2.current) {
      ribbonRef2.current.rotation.z = Math.sin(t * 0.12 + 1) * -0.018
      ribbonRef2.current.position.y = 6 + Math.sin(t * 0.13 + 2) * 0.08
    }
    // Cloud drift + bob + pulse — 4x speed with parallax
    cloudRefs.current.forEach((c, i) => {
      if (!c) return
      const depth = i < 6 ? 0.005 : 0.008 // Closer clouds move faster
      c.position.x += Math.sin(t * 0.6 + i * 1.7) * depth + mouseX * 0.002
      c.position.y += Math.cos(t * 0.8 + i * 2.3) * 0.004
      const pulse = 1 + Math.sin(t * 1.2 + i * 1.5) * 0.06
      const sx = c.scale.x > 0 ? pulse : -pulse
      c.scale.set(sx, pulse, 1)
    })
    // Crane flight — wing flapping + glide path
    craneRefs.current.forEach((cr, i) => {
      if (!cr) return
      const speed = 0.15 + i * 0.05
      const wingFlap = Math.sin(t * 2.5 + i * 3) * 0.25
      cr.position.x += Math.cos(t * speed + i * 2) * 0.003 + mouseX * 0.001
      cr.position.y += Math.sin(t * speed * 0.7 + i * 1.5) * 0.002
      cr.rotation.z = Math.sin(t * 0.2 + i) * 0.05
      // Flap wings via children
      if (cr.children[6]) cr.children[6].rotation.z = 0.3 + wingFlap
      if (cr.children[7]) cr.children[7].rotation.z = -0.3 - wingFlap
    })
    // Petals falling + spinning
    petalRefs.current.forEach((p, i) => {
      if (!p) return
      p.position.y -= 0.003 + (i % 3) * 0.001
      p.position.x += Math.sin(t * 0.5 + i * 2) * 0.002
      p.rotation.z += 0.008 + (i % 4) * 0.003
      p.rotation.x += 0.005
      if (p.position.y < -12) p.position.y = 10 + (i % 5)
    })
    // Mist layers drift with parallax
    if (mistRef.current) {
      mistRef.current.children.forEach((m, i) => {
        m.position.x = Math.sin(t * 0.03 + i * 1.8) * 0.5 + mouseX * (0.1 + i * 0.05)
      })
    }
    // Village silhouettes subtle parallax
    if (villageRef.current) {
      villageRef.current.position.x = mouseX * 0.3
    }
    // Star field parallax
    if (starFieldRef.current) {
      starFieldRef.current.position.x = mouseX * 0.1
      // Twinkling stars
      starFieldRef.current.children.forEach((star, i) => {
        if (star instanceof THREE.Mesh && star.material instanceof THREE.MeshBasicMaterial) {
          star.material.opacity = 0.3 + Math.sin(t * 0.5 + i * 0.7) * 0.25
        }
      })
    }
    // Lens flare subtle pulse
    if (lensFlareRef.current) {
      lensFlareRef.current.material instanceof THREE.MeshBasicMaterial &&
        (lensFlareRef.current.material.opacity = 0.15 + Math.sin(t * 0.3) * 0.08)
    }
  })

  return (
    <group position={[0, 4, -14]}>
      {/* === WARM SUNSET SKY GRADIENT === */}
      {/* Base sky layer */}
      <mesh position={[0, 0, -0.6]}>
        <planeGeometry args={[50, 32]} />
        <meshBasicMaterial color="#ffd89b" />
      </mesh>
      {/* Sunset gradient layer 1 - warm orange */}
      <mesh position={[0, 1, -0.58]}>
        <planeGeometry args={[50, 32]} />
        <meshBasicMaterial color="#f5a55a" transparent opacity={0.6} />
      </mesh>
      {/* Sunset gradient layer 2 - coral */}
      <mesh position={[0, 2, -0.56]}>
        <planeGeometry args={[50, 30]} />
        <meshBasicMaterial color="#e87856" transparent opacity={0.5} />
      </mesh>
      {/* Sunset gradient layer 3 - deep rose */}
      <mesh position={[0, 3, -0.54]}>
        <planeGeometry args={[50, 28]} />
        <meshBasicMaterial color="#d45a78" transparent opacity={0.45} />
      </mesh>
      {/* Upper sky - deep teal/sunset */}
      <mesh position={[0, 6, -0.52]}>
        <planeGeometry args={[50, 20]} />
        <meshBasicMaterial color="#19547b" transparent opacity={0.7} />
      </mesh>

      {/* === TWINKLING STARS === */}
      <group ref={starFieldRef} position={[0, 0, -0.5]}>
        {Array.from({ length: 40 }).map((_, i) => {
          const px = ((Math.sin(i * 137.5) * 0.5 + 0.5) * 40) - 20
          const py = ((Math.cos(i * 73.1) * 0.5 + 0.5) * 18) + 4
          const size = 0.02 + (i % 3) * 0.015
          return (
            <mesh key={`tstar-${i}`} position={[px, py, 0]}>
              <circleGeometry args={[size, 16]} />
              <meshBasicMaterial color="#fff8e0" transparent opacity={0.3} />
            </mesh>
          )
        })}
      </group>

      {/* === LENS FLARE from sun position === */}
      <group ref={lensFlareRef} position={[-8, 8, -0.3]}>
        {/* Main flare glow */}
        <mesh>
          <circleGeometry args={[2, 64]} />
          <meshBasicMaterial color="#ffd080" transparent opacity={0.2} />
        </mesh>
        {/* Inner bright core */}
        <mesh>
          <circleGeometry args={[0.8, 64]} />
          <meshBasicMaterial color="#fff0c0" transparent opacity={0.35} />
        </mesh>
        {/* Flare streak */}
        <mesh rotation={[0, 0, 0.5]}>
          <planeGeometry args={[0.3, 4]} />
          <meshBasicMaterial color="#ffd080" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[0, 0, -0.5]}>
          <planeGeometry args={[0.3, 4]} />
          <meshBasicMaterial color="#ffd080" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
        {/* Small flare artifacts */}
        {[1.5, 2.5, 3.5].map((offset, i) => (
          <mesh key={`flare-${i}`} position={[offset, offset * 0.3, 0.01]}>
            <circleGeometry args={[0.2 - i * 0.05, 32]} />
            <meshBasicMaterial color="#ffe0a0" transparent opacity={0.15 - i * 0.03} />
          </mesh>
        ))}
      </group>

      {/* === DISTANT VILLAGE SILHOUETTES === */}
      <group ref={villageRef} position={[0, -4, -0.48]}>
        {/* House shapes - simple geometric silhouettes */}
        {[
          [-12, 0, 0.6, 0.8], [-10, 0, 0.5, 0.7], [-8, 0, 0.7, 0.9],
          [-5, 0, 0.55, 0.75], [-3, 0, 0.65, 0.85], [0, 0, 0.5, 0.7],
          [3, 0, 0.6, 0.8], [5, 0, 0.7, 0.9], [8, 0, 0.55, 0.75],
          [10, 0, 0.5, 0.7], [12, 0, 0.6, 0.8],
        ].map(([x, y, w, h], i) => (
          <group key={`village-${i}`} position={[x as number, y as number, 0]}>
            {/* House body */}
            <mesh position={[0, (h as number) / 2, 0]}>
              <boxGeometry args={[w as number, h as number, 0.1]} />
              <meshBasicMaterial color="#2a2520" transparent opacity={0.7} />
            </mesh>
            {/* Roof */}
            <mesh position={[0, h as number + (w as number) * 0.3, 0]}>
              <coneGeometry args={[w as number * 0.7, (w as number) * 0.5, 4]} />
              <meshBasicMaterial color="#1a1815" transparent opacity={0.7} />
            </mesh>
            {/* Small window glow */}
            {(i % 3 === 0) && (
              <mesh position={[0, (h as number) * 0.6, 0.06]}>
                <circleGeometry args={[0.08, 16]} />
                <meshBasicMaterial color="#f0c850" transparent opacity={0.4} />
              </mesh>
            )}
          </group>
        ))}
      </group>

      {/* === CREAM PARCHMENT BACKGROUND (kept for compatibility) === */}
      <mesh position={[0, -1, -0.5]}>
        <planeGeometry args={[42, 28]} />
        <meshBasicMaterial color="#f5ead4" transparent opacity={0.3} />
      </mesh>
      {/* Warm center glow */}
      <mesh position={[0, 0, -0.48]}>
        <circleGeometry args={[12, 64]} />
        <meshBasicMaterial color="#faf0dc" transparent opacity={0.35} />
      </mesh>
      <mesh position={[0, 0, -0.47]}>
        <circleGeometry args={[8, 64]} />
        <meshBasicMaterial color="#fdf5e4" transparent opacity={0.25} />
      </mesh>
      {/* Edge darkening vignette */}
      {[[-16, 0], [16, 0], [0, 10], [0, -10]].map(([x, y], i) => (
        <mesh key={`vig-${i}`} position={[x, y, -0.46]}>
          <circleGeometry args={[8, 64]} />
          <meshBasicMaterial color="#e8d8b8" transparent opacity={0.2} />
        </mesh>
      ))}

      {/* === GOLDEN STAR with light rays === */}
      <mesh ref={starRef} position={[0, 0.5, -0.3]}>
        <shapeGeometry args={[starShape]} />
        <meshBasicMaterial color="#e8c840" transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 0.5, -0.32]}>
        <shapeGeometry args={[starShape]} />
        <meshBasicMaterial color="#f0d048" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 0.5, -0.35]}>
        <circleGeometry args={[5, 64]} />
        <meshBasicMaterial color="#f8e068" transparent opacity={0.12} />
      </mesh>
      {/* Light rays radiating from star */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        return (
          <mesh key={`ray-${i}`} position={[Math.cos(angle) * 5, 0.5 + Math.sin(angle) * 5, -0.36]}
            rotation={[0, 0, angle - Math.PI / 2]}>
            <planeGeometry args={[0.15, 6]} />
            <meshBasicMaterial color="#f0d858" transparent opacity={0.06 + (i % 2) * 0.03} side={THREE.DoubleSide} />
          </mesh>
        )
      })}

      {/* === RED BORDER FRAME — top/bottom only, no side columns === */}
      {/* Top */}
      <mesh position={[0, 10.5, -0.2]}>
        <boxGeometry args={[38, 1.3, 0.1]} />
        <meshStandardMaterial color="#b83828" roughness={0.45} emissive="#882018" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0, 10.5, -0.18]}>
        <boxGeometry args={[37.5, 1.1, 0.02]} />
        <meshStandardMaterial color="#a03020" roughness={0.55} transparent opacity={0.5} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -12, -0.2]}>
        <boxGeometry args={[38, 1.3, 0.1]} />
        <meshStandardMaterial color="#b83828" roughness={0.45} emissive="#882018" emissiveIntensity={0.25} />
      </mesh>
      {/* Gold trim — top/bottom only */}
      {[[0, 10, 36, 0.12, true], [0, -11.5, 36, 0.12, true],
      ].map(([x, y, w, h, horiz], i) => (
        <group key={`trim-${i}`}>
          <mesh position={[x as number, y as number, -0.14]}>
            <boxGeometry args={[w as number, h as number, 0.04]} />
            <meshStandardMaterial color="#d8a840" roughness={0.25} metalness={0.5} emissive="#a07828" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[x as number, (y as number) + (horiz ? -0.18 : 0), -0.14 + (horiz ? 0 : 0)]}>
            <boxGeometry args={[horiz ? (w as number) : 0.08, horiz ? 0.08 : (h as number), 0.03]} />
            <meshStandardMaterial color="#c8982e" roughness={0.3} metalness={0.45} />
          </mesh>
        </group>
      ))}

      {/* === RED RIBBONS — smoother flowing with animation === */}
      <group ref={ribbonRef1} position={[-3, 5, -0.1]}>
        {/* Main ribbon body — use multiple segments for curve */}
        {Array.from({ length: 8 }).map((_, i) => {
          const px = -6 + i * 2.2
          const py = Math.sin(i * 0.5) * 0.4
          const rz = -0.25 + Math.sin(i * 0.4) * 0.08
          return (
            <mesh key={`rb1-${i}`} position={[px, py, 0]} rotation={[0, 0, rz]}>
              <boxGeometry args={[2.4, 0.55 + Math.sin(i * 0.7) * 0.1, 0.04]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#c83030' : '#b82828'} roughness={0.4} emissive="#a02020" emissiveIntensity={0.22} />
            </mesh>
          )
        })}
        {/* Gold dragon motifs on ribbon */}
        {[-5, -2.5, 0, 2.5, 5, 7.5].map((x, i) => (
          <group key={`dm1-${i}`} position={[x, Math.sin(x * 0.25) * 0.35, 0.025]} rotation={[0, 0, -0.25 + Math.sin(x * 0.2) * 0.06]}>
            <mesh><boxGeometry args={[1.0, 0.12, 0.015]} />
              <meshStandardMaterial color="#d4a540" roughness={0.25} metalness={0.4} /></mesh>
            {/* Small dragon spiral details */}
            <mesh position={[0.3, 0.06, 0.005]}><circleGeometry args={[0.06, 12]} />
              <meshBasicMaterial color="#d8b050" transparent opacity={0.7} /></mesh>
            <mesh position={[-0.3, -0.06, 0.005]}><circleGeometry args={[0.05, 10]} />
              <meshBasicMaterial color="#c89830" transparent opacity={0.6} /></mesh>
          </group>
        ))}
        {/* Tail curves */}
        <mesh position={[10, -1.8, 0]} rotation={[0, 0, -0.7]}>
          <boxGeometry args={[3.5, 0.45, 0.035]} />
          <meshStandardMaterial color="#c83030" roughness={0.4} emissive="#a02020" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[11.5, -3, 0]} rotation={[0, 0, -1.0]}>
          <boxGeometry args={[2, 0.3, 0.03]} />
          <meshStandardMaterial color="#cc3838" roughness={0.4} emissive="#a82828" emissiveIntensity={0.18} />
        </mesh>
      </group>

      <group ref={ribbonRef2} position={[5, 6, -0.08]}>
        {Array.from({ length: 6 }).map((_, i) => {
          const px = -4 + i * 2
          const py = Math.sin(i * 0.6 + 1) * 0.3
          return (
            <mesh key={`rb2-${i}`} position={[px, py, 0]} rotation={[0, 0, 0.2 + Math.sin(i * 0.5) * 0.06]}>
              <boxGeometry args={[2.2, 0.4 + Math.sin(i) * 0.08, 0.035]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#cc3535' : '#c02e2e'} roughness={0.4} emissive="#a82525" emissiveIntensity={0.2} />
            </mesh>
          )
        })}
        {[-3, 0, 3].map((x, i) => (
          <mesh key={`dm2-${i}`} position={[x, x * 0.04 + 0.05, 0.02]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.9, 0.1, 0.012]} />
            <meshStandardMaterial color="#d4a540" roughness={0.25} metalness={0.4} />
          </mesh>
        ))}
        <mesh position={[-7, 1.2, 0]} rotation={[0, 0, 0.55]}>
          <boxGeometry args={[2.5, 0.35, 0.03]} />
          <meshStandardMaterial color="#cc3535" roughness={0.4} emissive="#a82525" emissiveIntensity={0.18} />
        </mesh>
      </group>

      {/* === MOUNTAIN RANGES — VIVID saturated blue/teal/gold === */}
      {/* Layer 1: Far — bright teal/cyan silhouettes */}
      <group position={[0, -2.5, -0.44]}>
        {([
          [-12, 7, 5], [-6, 9, 4.5], [0, 10, 6], [6, 8, 5], [11, 7, 4], [15, 6, 3.5],
          [-15, 5.5, 3], [3, 7, 3.5], [9, 5.5, 3],
        ] as [number, number, number][]).map(([x, h, w], i) => (
          <group key={`fm-${i}`} position={[x, 0, 0]}>
            <mesh position={[0, h / 2, 0]}>
              <coneGeometry args={[w, h, 32]} />
              <meshStandardMaterial color={['#70e0d0', '#60d0c8', '#80e8d8'][i % 3]}
                roughness={0.4} emissive={['#40b0a0', '#38a898', '#48b8a8'][i % 3]}
                emissiveIntensity={0.3} transparent opacity={0.55} />
            </mesh>
            {/* Bright gold ridge glow */}
            <mesh position={[w * 0.08, h * 0.75, 0.015]}>
              <boxGeometry args={[0.1, h * 0.5, 0.01]} />
              <meshBasicMaterial color="#e8d070" transparent opacity={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Layer 2: Mid — rich blue with vivid teal/cyan faces */}
      <group position={[0, -3.8, -0.41]}>
        {([
          [-14, 5.5, 4, '#2878c8'], [-9, 7.5, 4.5, '#1868b8'], [-4, 9, 5.5, '#1060b0'],
          [1.5, 8, 5, '#1868b8'], [6.5, 9.5, 5.5, '#0c58a8'], [11, 7, 4, '#2070b8'], [15, 5, 3, '#2878c8'],
        ] as [number, number, number, string][]).map(([x, h, w, col], i) => (
          <group key={`mm-${i}`} position={[x, 0, 0]}>
            <mesh position={[0, h / 2, 0]}>
              <coneGeometry args={[w, h, 32]} />
              <meshStandardMaterial color={col} roughness={0.35}
                emissive={col} emissiveIntensity={0.25} transparent opacity={0.75} />
            </mesh>
            {/* Vivid teal/cyan lit face */}
            <mesh position={[w * 0.15, h / 2 + 0.3, 0.02]}>
              <coneGeometry args={[w * 0.55, h * 0.82, 32]} />
              <meshStandardMaterial color="#48e0d0" roughness={0.35}
                emissive="#30c0b0" emissiveIntensity={0.3} transparent opacity={0.4} />
            </mesh>
            {/* Bright warm gold base */}
            <mesh position={[0, h * 0.15, 0.025]}>
              <coneGeometry args={[w * 0.9, h * 0.35, 32]} />
              <meshStandardMaterial color="#e8e0a0" roughness={0.4}
                emissive="#c8b870" emissiveIntensity={0.25} transparent opacity={0.35} />
            </mesh>
            {/* Bold gold veins */}
            {[0.1, -0.12, 0.22].map((ox, li) => (
              <mesh key={`v-${li}`} position={[ox * w, h * 0.5 + li * 0.5, 0.03]}>
                <boxGeometry args={[0.08, h * 0.5, 0.01]} />
                <meshBasicMaterial color="#f0c850" transparent opacity={0.6} />
              </mesh>
            ))}
            {/* Deep indigo shadow */}
            <mesh position={[-w * 0.18, h * 0.38, 0.015]}>
              <boxGeometry args={[0.1, h * 0.4, 0.008]} />
              <meshBasicMaterial color="#0c2060" transparent opacity={0.35} />
            </mesh>
            <mesh position={[w * 0.45, h * 0.2, -0.005]}>
              <coneGeometry args={[w * 0.3, h * 0.4, 32]} />
              <meshStandardMaterial color={col} roughness={0.4} emissive={col}
                emissiveIntensity={0.2} transparent opacity={0.6} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Layer 3: Near — deep vivid blue peaks */}
      <group position={[0, -5, -0.37]}>
        {([
          [-15, 4, 3, '#1050a8'], [-10, 6, 4, '#0c48a0'], [-5, 8, 5, '#084098'],
          [0, 6.5, 4, '#0c48a0'], [5, 8.5, 5.5, '#043890'], [10, 6.5, 4, '#0c48a0'], [14, 4.5, 3, '#1050a8'],
        ] as [number, number, number, string][]).map(([x, h, w, col], i) => (
          <group key={`nm-${i}`} position={[x, 0, 0]}>
            <mesh position={[0, h / 2, 0]}>
              <coneGeometry args={[w, h, 32]} />
              <meshStandardMaterial color={col} roughness={0.3}
                emissive={col} emissiveIntensity={0.3} transparent opacity={0.9} />
            </mesh>
            {/* Vivid bright teal face */}
            <mesh position={[w * 0.13, h / 2 + 0.4, 0.025]}>
              <coneGeometry args={[w * 0.45, h * 0.75, 32]} />
              <meshStandardMaterial color="#40d8c8" roughness={0.3}
                emissive="#28b8a8" emissiveIntensity={0.35} transparent opacity={0.45} />
            </mesh>
            {/* Warm golden base gradient */}
            <mesh position={[0, h * 0.12, 0.03]}>
              <coneGeometry args={[w * 0.85, h * 0.3, 32]} />
              <meshStandardMaterial color="#e0d890" roughness={0.35}
                emissive="#c0b060" emissiveIntensity={0.3} transparent opacity={0.4} />
            </mesh>
            {/* Bright gold veins — more prominent */}
            {[-0.15, 0.05, 0.18, -0.08, 0.12].map((ox, li) => (
              <mesh key={`nv-${li}`} position={[ox * w, h * (0.35 + li * 0.12), 0.035]}>
                <boxGeometry args={[0.06, h * (0.35 + (li % 2) * 0.15), 0.008]} />
                <meshBasicMaterial color="#f0c848" transparent opacity={0.55} />
              </mesh>
            ))}
            {/* Deep indigo shadow crevice */}
            <mesh position={[-w * 0.2, h * 0.35, 0.02]}>
              <boxGeometry args={[0.15, h * 0.4, 0.008]} />
              <meshBasicMaterial color="#081848" transparent opacity={0.35} />
            </mesh>
            {/* Bright cyan edge highlight */}
            <mesh position={[w * 0.25, h * 0.6, 0.03]}>
              <boxGeometry args={[0.05, h * 0.3, 0.006]} />
              <meshBasicMaterial color="#60f0e0" transparent opacity={0.35} />
            </mesh>
          </group>
        ))}
        {/* Pagoda — brighter */}
        <group position={[5, 8.2, 0.05]}>
          {[-0.2, 0.2].map((px, pi) => (
            <mesh key={`pg-${pi}`} position={[px, 0, 0]}>
              <boxGeometry args={[0.05, 0.5, 0.05]} />
              <meshStandardMaterial color="#3060b0" emissive="#2048a0" emissiveIntensity={0.3} roughness={0.4} />
            </mesh>
          ))}
          <mesh position={[0, 0.32, 0]}><coneGeometry args={[0.4, 0.18, 32]} />
            <meshStandardMaterial color="#2850a0" emissive="#1840a0" emissiveIntensity={0.3} roughness={0.4} /></mesh>
          <mesh position={[0, 0.45, 0]}><coneGeometry args={[0.25, 0.15, 32]} />
            <meshStandardMaterial color="#2048a0" emissive="#1838a0" emissiveIntensity={0.25} roughness={0.4} /></mesh>
          <mesh position={[0, 0.56, 0]}><sphereGeometry args={[0.04, 32, 24]} />
            <meshStandardMaterial color="#e8b840" emissive="#c09830" emissiveIntensity={0.4} metalness={0.5} roughness={0.25} /></mesh>
        </group>
        {/* Pine trees — vivid green */}
        {([[-9, 5.2], [-3, 6.5], [3, 5.5], [8.5, 5.8], [12, 3.8]] as [number, number][]).map(([tx, ty], ti) => (
          <group key={`pine-${ti}`} position={[tx, ty, 0.04]}>
            <mesh><cylinderGeometry args={[0.025, 0.035, 0.5, 8]} />
              <meshBasicMaterial color="#6a4020" /></mesh>
            {[0, 0.18, 0.32].map((fy, fi) => (
              <group key={`fl-${fi}`} position={[0.12 - fi * 0.04, 0.12 + fy, 0]}>
                <mesh><sphereGeometry args={[0.22 - fi * 0.04, 48, 36]} />
                  <meshStandardMaterial color={['#30c088', '#38c890', '#40d098'][fi]}
                    roughness={0.4} emissive={['#20a068', '#28a870', '#30b078'][fi]}
                    emissiveIntensity={0.3} transparent opacity={0.85} /></mesh>
              </group>
            ))}
          </group>
        ))}
      </group>

      {/* === MIST LAYERS — luminous === */}
      <group ref={mistRef} position={[0, -5, -0.35]}>
        {[0, 0.5, 1.0, 1.5].map((y, i) => (
          <mesh key={`mist-${i}`} position={[0, y, 0.06 + i * 0.01]}>
            <planeGeometry args={[38, 1.8 - i * 0.3]} />
            <meshBasicMaterial color={['#f8f0d8', '#f0e8d0', '#f5f0dc', '#faf5e4'][i]}
              transparent opacity={[0.75, 0.55, 0.45, 0.35][i]} />
          </mesh>
        ))}
        {([[-8, 0.3, 1.8], [-3, 0.5, 2.2], [2, 0.2, 2], [7, 0.6, 1.6], [12, 0.4, 1.5],
           [-12, 0.7, 1.4], [5, 0.1, 1.8], [-5, 0.8, 1.6]] as [number, number, number][]).map(([x, y, s], i) => (
          <mesh key={`mc-${i}`} position={[x, y, 0.07]}>
            <sphereGeometry args={[s * 0.5, 48, 36]} />
            <meshBasicMaterial color="#f8f0d8" transparent opacity={0.45} />
          </mesh>
        ))}
      </group>

      {/* === ORNATE CLOUDS — Golden folk-art style (mây vờn) === */}
      {([
        [-10, 3, 1.5, false], [9, 4, 1.3, true], [-5, 5, 1.1, false],
        [13, 1.5, 1.0, true], [-13, 1, 1.2, false], [5, 6, 0.9, true],
        [-8, -1, 0.8, false], [11, -1.5, 0.9, true], [-2, 6.5, 0.7, false],
        [15, 3.5, 0.75, true], [-15, 3, 0.85, false],
      ] as [number, number, number, boolean][]).map(([x, y, s, flip], i) => (
        <group key={`oc-${i}`} position={[x, y, -0.18]}
          ref={(el: THREE.Group | null) => { if (el) cloudRefs.current[i] = el }}
          scale={[flip ? -s : s, s, 1]}>
          {/* Core lobes — rich warm gold with coral/amber tints */}
          <mesh><sphereGeometry args={[0.55, 48, 36]} />
            <meshStandardMaterial color={['#d4a840', '#d88850', '#c8a048', '#d09848', '#d4a840', '#c89040', '#d88850', '#d4a840', '#c8a048', '#d09848', '#d4a840'][i]}
              roughness={0.3} metalness={0.35}
              emissive={['#b08020', '#b86830', '#a88028', '#b07828', '#b08020', '#a87020', '#b86830', '#b08020', '#a88028', '#b07828', '#b08020'][i]}
              emissiveIntensity={0.4} /></mesh>
          <mesh position={[0.42, 0.18, 0]}><sphereGeometry args={[0.48, 48, 36]} />
            <meshStandardMaterial color={i % 3 === 0 ? '#e8b850' : i % 3 === 1 ? '#e09060' : '#dbb548'}
              roughness={0.3} metalness={0.35}
              emissive={i % 3 === 0 ? '#c89838' : i % 3 === 1 ? '#c07040' : '#b89030'}
              emissiveIntensity={0.38} /></mesh>
          <mesh position={[-0.38, 0.12, 0]}><sphereGeometry args={[0.42, 48, 36]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#c89838' : '#d87848'}
              roughness={0.3} metalness={0.35}
              emissive={i % 2 === 0 ? '#a87820' : '#b86030'}
              emissiveIntensity={0.4} /></mesh>
          <mesh position={[0.18, 0.38, 0]}><sphereGeometry args={[0.38, 48, 36]} />
            <meshStandardMaterial color="#e8c858" roughness={0.28} metalness={0.4}
              emissive="#c8a840" emissiveIntensity={0.35} /></mesh>
          <mesh position={[-0.2, 0.35, 0]}><sphereGeometry args={[0.3, 48, 36]} />
            <meshStandardMaterial color="#e0b848" roughness={0.3} metalness={0.35}
              emissive="#c09830" emissiveIntensity={0.35} /></mesh>
          {/* Coral/amber accent lobes — more colorful */}
          <mesh position={[0.68, 0.05, 0.01]}><sphereGeometry args={[0.35, 48, 36]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#e8a050' : '#f0c860'}
              roughness={0.28} metalness={0.4}
              emissive={i % 2 === 0 ? '#c88038' : '#d0a848'}
              emissiveIntensity={0.4} /></mesh>
          <mesh position={[-0.55, -0.08, 0.01]}><sphereGeometry args={[0.3, 48, 36]} />
            <meshStandardMaterial color={i % 3 === 1 ? '#e08858' : '#e8c060'}
              roughness={0.28} metalness={0.38}
              emissive={i % 3 === 1 ? '#c06838' : '#c8a048'}
              emissiveIntensity={0.38} /></mesh>
          <mesh position={[0.08, -0.32, 0.01]}><sphereGeometry args={[0.32, 48, 36]} />
            <meshStandardMaterial color="#d8a040" roughness={0.3} metalness={0.35}
              emissive="#b88028" emissiveIntensity={0.35} /></mesh>
          <mesh position={[0.55, 0.3, 0.01]}><sphereGeometry args={[0.25, 48, 36]} />
            <meshStandardMaterial color="#f0d060" roughness={0.25} metalness={0.4}
              emissive="#d0b048" emissiveIntensity={0.35} /></mesh>
          {/* Bright highlight spots — warm white/cream */}
          <mesh position={[0.3, 0.42, 0.02]}><sphereGeometry args={[0.2, 48, 36]} />
            <meshStandardMaterial color="#f8e070" roughness={0.22} metalness={0.45}
              emissive="#d8c058" emissiveIntensity={0.45} transparent opacity={0.85} /></mesh>
          <mesh position={[0.72, 0.2, 0.02]}><sphereGeometry args={[0.18, 48, 36]} />
            <meshStandardMaterial color="#f0d868" roughness={0.22} metalness={0.45}
              emissive="#d0b850" emissiveIntensity={0.4} transparent opacity={0.8} /></mesh>
          {/* Deep amber/burnt orange shadow accents */}
          <mesh position={[-0.22, -0.18, 0.025]}><sphereGeometry args={[0.22, 48, 36]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#c07828' : '#b86830'}
              roughness={0.35} metalness={0.3}
              emissive={i % 2 === 0 ? '#a06018' : '#985020'}
              emissiveIntensity={0.38} /></mesh>
          <mesh position={[-0.12, -0.22, 0.03]}><sphereGeometry args={[0.16, 48, 36]} />
            <meshStandardMaterial color="#d89830" roughness={0.3} metalness={0.35}
              emissive="#b87820" emissiveIntensity={0.35} /></mesh>
          <mesh position={[-0.05, -0.24, 0.035]}><sphereGeometry args={[0.1, 48, 36]} />
            <meshStandardMaterial color="#e8b038" roughness={0.28} metalness={0.4}
              emissive="#c89028" emissiveIntensity={0.38} /></mesh>
          {/* Warm brown outline rings */}
          <mesh position={[0, 0, 0.025]}><ringGeometry args={[0.5, 0.57, 48]} />
            <meshBasicMaterial color="#8a5818" transparent opacity={0.22} side={THREE.DoubleSide} /></mesh>
          <mesh position={[0.42, 0.18, 0.025]}><ringGeometry args={[0.43, 0.49, 48]} />
            <meshBasicMaterial color="#8a5818" transparent opacity={0.2} side={THREE.DoubleSide} /></mesh>
          <mesh position={[-0.22, -0.18, 0.035]}><ringGeometry args={[0.19, 0.23, 48]} />
            <meshBasicMaterial color="#905820" transparent opacity={0.22} side={THREE.DoubleSide} /></mesh>
          {/* Flowing swirl tail — warm amber gradient */}
          <mesh position={[1.0, -0.08, 0]} rotation={[0, 0, -0.12]}>
            <capsuleGeometry args={[0.1, 0.7, 16, 32]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#d89838' : '#d08040'}
              roughness={0.3} metalness={0.35}
              emissive={i % 2 === 0 ? '#b87828' : '#b06030'}
              emissiveIntensity={0.35} /></mesh>
          <mesh position={[1.5, -0.18, 0]} rotation={[0, 0, -0.22]}>
            <capsuleGeometry args={[0.07, 0.55, 16, 32]} />
            <meshStandardMaterial color="#e8b848" roughness={0.28} metalness={0.35}
              emissive="#c89838" emissiveIntensity={0.3} /></mesh>
          <mesh position={[1.9, -0.25, 0]} rotation={[0, 0, -0.3]}>
            <capsuleGeometry args={[0.04, 0.35, 16, 32]} />
            <meshStandardMaterial color="#f0c850" roughness={0.25} metalness={0.4}
              emissive="#d0a840" emissiveIntensity={0.3} /></mesh>
        </group>
      ))}

      {/* === FLYING CRANES (hạc) — animated wing flap === */}
      {([
        [7, 4, 0.65, 0.15], [-6, 5, 0.55, -0.12], [2, 6, 0.5, 0.08],
        [-11, 3, 0.4, -0.2], [12, 5.5, 0.42, 0.25],
      ] as [number, number, number, number][]).map(([x, y, s, rot], i) => (
        <group key={`crane-${i}`} position={[x, y, -0.12]} scale={s} rotation={[0, 0, rot]}
          ref={(el: THREE.Group | null) => { if (el) craneRefs.current[i] = el }}>
          {/* 0: Body — smooth capsule */}
          <mesh><capsuleGeometry args={[0.14, 0.55, 16, 32]} />
            <meshBasicMaterial color="#f2ece0" /></mesh>
          {/* 1: Breast — white front */}
          <mesh position={[0.1, 0.05, 0.05]}>
            <sphereGeometry args={[0.13, 48, 36]} />
            <meshBasicMaterial color="#f8f4ea" />
          </mesh>
          {/* 2: Neck — graceful curve */}
          <mesh position={[0.32, 0.22, 0]} rotation={[0, 0, -0.7]}>
            <capsuleGeometry args={[0.04, 0.5, 6, 12]} />
            <meshBasicMaterial color="#f2ece0" /></mesh>
          {/* 3: Head */}
          <mesh position={[0.58, 0.48, 0]}>
            <sphereGeometry args={[0.07, 48, 36]} />
            <meshBasicMaterial color="#f2ece0" /></mesh>
          {/* 4: Red crown */}
          <mesh position={[0.6, 0.53, 0.02]}>
            <sphereGeometry args={[0.035, 32, 24]} />
            <meshBasicMaterial color="#cc2020" /></mesh>
          {/* 5: Beak — golden, longer */}
          <mesh position={[0.7, 0.48, 0]} rotation={[0, 0, -0.05]}>
            <coneGeometry args={[0.018, 0.18, 32]} />
            <meshBasicMaterial color="#c8a030" /></mesh>
          {/* 6: Left wing — multi-layered feathers, animated */}
          <group position={[-0.05, 0.15, 0]} rotation={[0, 0, 0.3]}>
            {/* Base white */}
            <mesh><boxGeometry args={[0.85, 0.1, 0.02]} />
              <meshBasicMaterial color="#f0e8d8" /></mesh>
            {/* Light teal mid-feathers */}
            <mesh position={[-0.15, -0.03, 0]}><boxGeometry args={[0.7, 0.14, 0.015]} />
              <meshBasicMaterial color="#80c8c0" /></mesh>
            {/* Teal feather layer */}
            <mesh position={[-0.25, -0.06, 0]}><boxGeometry args={[0.5, 0.12, 0.012]} />
              <meshBasicMaterial color="#48a8a8" /></mesh>
            {/* Dark blue tips */}
            <mesh position={[-0.4, -0.03, 0]}><boxGeometry args={[0.3, 0.08, 0.01]} />
              <meshBasicMaterial color="#1a5090" /></mesh>
            <mesh position={[-0.5, 0.01, 0]} rotation={[0, 0, 0.1]}>
              <boxGeometry args={[0.2, 0.05, 0.008]} />
              <meshBasicMaterial color="#143878" /></mesh>
            {/* Rose-gold highlight edge */}
            <mesh position={[-0.1, -0.08, 0.005]}><boxGeometry args={[0.6, 0.02, 0.005]} />
              <meshBasicMaterial color="#c89878" transparent opacity={0.6} /></mesh>
          </group>
          {/* 7: Right wing — mirror */}
          <group position={[-0.05, -0.15, 0]} rotation={[0, 0, -0.3]}>
            <mesh><boxGeometry args={[0.85, 0.1, 0.02]} />
              <meshBasicMaterial color="#f0e8d8" /></mesh>
            <mesh position={[-0.15, 0.03, 0]}><boxGeometry args={[0.7, 0.14, 0.015]} />
              <meshBasicMaterial color="#80c8c0" /></mesh>
            <mesh position={[-0.25, 0.06, 0]}><boxGeometry args={[0.5, 0.12, 0.012]} />
              <meshBasicMaterial color="#48a8a8" /></mesh>
            <mesh position={[-0.4, 0.03, 0]}><boxGeometry args={[0.3, 0.08, 0.01]} />
              <meshBasicMaterial color="#1a5090" /></mesh>
            <mesh position={[-0.5, -0.01, 0]} rotation={[0, 0, -0.1]}>
              <boxGeometry args={[0.2, 0.05, 0.008]} />
              <meshBasicMaterial color="#143878" /></mesh>
            <mesh position={[-0.1, 0.08, 0.005]}><boxGeometry args={[0.6, 0.02, 0.005]} />
              <meshBasicMaterial color="#c89878" transparent opacity={0.6} /></mesh>
          </group>
          {/* Tail feathers — dark flowing */}
          <mesh position={[-0.38, 0.02, 0]} rotation={[0, 0, 0.05]}>
            <boxGeometry args={[0.35, 0.05, 0.008]} />
            <meshBasicMaterial color="#1a4878" /></mesh>
          <mesh position={[-0.42, 0, 0]} rotation={[0, 0, -0.05]}>
            <boxGeometry args={[0.3, 0.04, 0.006]} />
            <meshBasicMaterial color="#2060a0" /></mesh>
          <mesh position={[-0.46, 0.04, 0]} rotation={[0, 0, 0.12]}>
            <boxGeometry args={[0.25, 0.03, 0.005]} />
            <meshBasicMaterial color="#2868a8" /></mesh>
          {/* Eye */}
          <mesh position={[0.62, 0.48, 0.06]}>
            <sphereGeometry args={[0.012, 32, 24]} />
            <meshBasicMaterial color="#0a0808" /></mesh>
          {/* Trailing legs */}
          <mesh position={[-0.32, -0.1, 0]} rotation={[0, 0, 0.08]}>
            <boxGeometry args={[0.4, 0.012, 0.008]} />
            <meshBasicMaterial color="#a08060" /></mesh>
          <mesh position={[-0.28, -0.12, 0]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[0.35, 0.012, 0.008]} />
            <meshBasicMaterial color="#a08060" /></mesh>
        </group>
      ))}

      {/* === FALLING PETALS / CONFETTI — animated === */}
      {Array.from({ length: 35 }).map((_, i) => {
        const ix = ((Math.sin(i * 137.5) * 0.5 + 0.5) * 32) - 16
        const iy = ((Math.cos(i * 73.1) * 0.5 + 0.5) * 22) - 10
        const colors = ['#d4a540', '#c83838', '#48a848', '#3878c8', '#d880a0', '#e8c850']
        return (
          <mesh key={`petal-${i}`} position={[ix, iy, -0.04]}
            rotation={[i * 0.5, i * 0.3, i * 0.7]}
            ref={(el: THREE.Mesh | null) => { if (el) petalRefs.current[i] = el }}>
            <boxGeometry args={[0.18 + (i % 3) * 0.05, 0.1 + (i % 2) * 0.04, 0.008]} />
            <meshBasicMaterial color={colors[i % 6]} transparent opacity={0.45 + (i % 3) * 0.1} />
          </mesh>
        )
      })}

      {/* === LIGHTING — single warm fill === */}
      <pointLight position={[0, 3, 5]} intensity={2.5} color="#f0e0c0" distance={35} decay={1} />
    </group>
  )
}
