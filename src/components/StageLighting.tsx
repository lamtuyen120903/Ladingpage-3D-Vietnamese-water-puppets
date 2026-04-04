import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ActId } from '../App'

interface Props {
  currentAct: ActId
}

const actColors: Record<ActId, { main: string; fill: string; ambient: number }> = {
  intro: { main: '#e080a0', fill: '#4060c0', ambient: 1.0 },
  automation: { main: '#d880a0', fill: '#5070c0', ambient: 1.05 },
  ai: { main: '#e090b0', fill: '#6080d0', ambient: 1.1 },
}

/**
 * Stage lighting — optimized from 11 to 7 lights.
 * Combined overlapping lights, increased intensity to compensate.
 */
export default function StageLighting({ currentAct }: Props) {
  const mainRef = useRef<THREE.SpotLight>(null)
  const fillRef = useRef<THREE.SpotLight>(null)
  const ambientRef = useRef<THREE.AmbientLight>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const cfg = actColors[currentAct]
    const targetMain = new THREE.Color(cfg.main)
    const targetFill = new THREE.Color(cfg.fill)

    if (mainRef.current) {
      mainRef.current.color.lerp(targetMain, 0.03)
      mainRef.current.intensity = 6 + Math.sin(t * 0.4) * 0.4
    }
    if (fillRef.current) {
      fillRef.current.color.lerp(targetFill, 0.03)
      fillRef.current.intensity = 4.5 + Math.sin(t * 0.5 + 1) * 0.3
    }
    if (ambientRef.current) {
      ambientRef.current.intensity += (cfg.ambient - ambientRef.current.intensity) * 0.02
    }
  })

  return (
    <>
      {/* Ambient — very bright */}
      <ambientLight ref={ambientRef} intensity={1.2} color="#808088" />

      {/* Main stage spotlight — pink wash */}
      <spotLight
        ref={mainRef}
        position={[0, 8, 5]}
        angle={0.7}
        penumbra={0.85}
        intensity={12}
        color="#e080a0"
        castShadow
        shadow-mapSize={[512, 512]}
        target-position={[0, 1, -2]}
        distance={35}
        decay={0.8}
      />

      {/* Fill — blue, both sides combined into wider angle */}
      <spotLight
        ref={fillRef}
        position={[0, 6, 3]}
        angle={0.9}
        penumbra={1}
        intensity={10}
        color="#6888d0"
        target-position={[0, 2, -2]}
        distance={30}
        decay={0.8}
      />

      {/* Pink roof wash from above */}
      <spotLight
        position={[0, 9, -2]}
        angle={0.5}
        penumbra={0.8}
        intensity={10}
        color="#d070a0"
        target-position={[0, 3, -3]}
        distance={22}
        decay={1}
      />

      {/* Backlight blue glow */}
      <pointLight position={[0, 5, -6]} intensity={8} color="#4060b0" distance={22} decay={1} />

      {/* Warm gold center + overhead combined */}
      <pointLight position={[0, 5, 1]} intensity={8} color="#e0c070" distance={20} decay={0.8} />

      {/* Side platform warm fill */}
      <pointLight position={[-5, 2, 4]} intensity={5} color="#e0c880" distance={16} decay={1} />
      <pointLight position={[5, 2, 4]} intensity={5} color="#e0c880" distance={16} decay={1} />

      {/* Extra overhead bright wash */}
      <pointLight position={[0, 8, 3]} intensity={6} color="#f0e0c0" distance={25} decay={0.8} />
    </>
  )
}
