import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { StagePhase } from '../App'

interface CinematicCameraProps {
  phase: StagePhase
}

const WAYPOINTS = {
  opening: new THREE.Vector3(0, 2.8, 10),
  performing: new THREE.Vector3(0, 2.2, 9),
}

export default function CinematicCamera({ phase }: CinematicCameraProps) {
  const controlsRef = useRef<any>(null)
  const { camera } = useThree()
  const targetPosition = useRef(new THREE.Vector3(0, 2.2, 9))
  const currentPosition = useRef(new THREE.Vector3(0, 2.2, 9))

  // Update target when phase changes
  useEffect(() => {
    targetPosition.current.copy(WAYPOINTS[phase] || WAYPOINTS.performing)
  }, [phase])

  // Initialize camera position
  useEffect(() => {
    camera.position.copy(WAYPOINTS.performing)
    currentPosition.current.copy(WAYPOINTS.performing)
  }, [camera])

  useFrame((_, delta) => {
    // Smooth lerp between current and target position
    currentPosition.current.lerp(targetPosition.current, delta * 1.5)

    // Apply to camera
    camera.position.copy(currentPosition.current)

    // Update controls target if they exist
    if (controlsRef.current) {
      controlsRef.current.target.lerp(
        new THREE.Vector3(0, 0.5, -1),
        delta * 1.2
      )
      controlsRef.current.update()
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      // Polar angle constraints: [Math.PI/6, Math.PI/2.2] (30° to ~82°)
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.2}
      // No azimuth constraint — full 360°
      // enableDamping for smooth motion
      enableDamping
      dampingFactor={0.05}
      // Subtle zoom constraints
      minDistance={6}
      maxDistance={14}
      // Don't allow panning (focus on stage)
      enablePan={false}
      // Smooth target following
      target={[0, 0.5, -1]}
    />
  )
}
