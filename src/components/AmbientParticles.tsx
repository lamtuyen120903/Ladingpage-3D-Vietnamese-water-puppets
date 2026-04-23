import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const FIREFLY_COUNT = 60

// Warm yellow to soft green color range
const COLOR_WARM = new THREE.Color('#f8e868')
const COLOR_GREEN = new THREE.Color('#88f088')

export default function AmbientParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Store base positions and random offsets for Brownian motion
  const particleData = useMemo(() => {
    const data: Array<{
      baseX: number
      baseY: number
      baseZ: number
      phaseX: number
      phaseY: number
      phaseZ: number
      speedX: number
      speedY: number
      speedZ: number
      blinkPhase: number
      blinkSpeed: number
    }> = []

    for (let i = 0; i < FIREFLY_COUNT; i++) {
      // Spread around the stage area
      const angle = Math.random() * Math.PI * 2
      const radius = 2 + Math.random() * 5
      data.push({
        baseX: Math.cos(angle) * radius,
        baseY: 0.5 + Math.random() * 2.5,
        baseZ: -3 + Math.sin(angle) * radius * 0.5,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2,
        speedX: 0.3 + Math.random() * 0.4,
        speedY: 0.2 + Math.random() * 0.3,
        speedZ: 0.25 + Math.random() * 0.35,
        blinkPhase: Math.random() * Math.PI * 2,
        blinkSpeed: 1.5 + Math.random() * 2.0,
      })
    }
    return data
  }, [])

  // Precompute colors for each firefly
  const colors = useMemo(() => {
    const colorArray = new Float32Array(FIREFLY_COUNT * 3)
    for (let i = 0; i < FIREFLY_COUNT; i++) {
      // Blend between warm yellow and soft green
      const t = Math.random()
      const c = COLOR_WARM.clone().lerp(COLOR_GREEN, t)
      colorArray[i * 3] = c.r
      colorArray[i * 3 + 1] = c.g
      colorArray[i * 3 + 2] = c.b
    }
    return colorArray
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const elapsed = clock.getElapsedTime()

    for (let i = 0; i < FIREFLY_COUNT; i++) {
      const p = particleData[i]

      // Brownian motion via noise-based position offsets
      const noiseX = Math.sin(elapsed * p.speedX + p.phaseX) * 0.3
      const noiseY = Math.cos(elapsed * p.speedY + p.phaseY) * 0.2
      const noiseZ = Math.sin(elapsed * p.speedZ + p.phaseZ) * 0.25

      dummy.position.set(
        p.baseX + noiseX,
        p.baseY + noiseY,
        p.baseZ + noiseZ
      )

      // Blink animation — sin wave controlling opacity
      const blink = (Math.sin(elapsed * p.blinkSpeed + p.blinkPhase) + 1) * 0.5
      const scale = 0.04 + blink * 0.04 // size pulses too
      dummy.scale.set(scale, scale, scale)

      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)

      // Apply color with blink intensity via setColorAt
      const colorIdx = i * 3
      const r = colors[colorIdx] * (0.6 + blink * 0.4)
      const g = colors[colorIdx + 1] * (0.6 + blink * 0.4)
      const b = colors[colorIdx + 2] * (0.5 + blink * 0.5)
      meshRef.current.setColorAt(i, new THREE.Color(r, g, b))
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, FIREFLY_COUNT]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color="#c8f088"
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  )
}
