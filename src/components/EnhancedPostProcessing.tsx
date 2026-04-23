import { useMemo } from 'react'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

export default function EnhancedPostProcessing() {
  // Subtle chromatic aberration offset — cinematic lens effect
  const chromaticOffset = useMemo(() => new THREE.Vector2(0.0003, 0.0003), [])

  return (
    <EffectComposer>
      {/* Existing Bloom — keep intensity at 0.4 */}
      <Bloom
        intensity={0.4}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      {/* Vignette — theatrical darkening at edges */}
      <Vignette
        offset={0.3}
        darkness={0.6}
        blendFunction={BlendFunction.NORMAL}
      />
      {/* Chromatic Aberration — subtle color fringing */}
      <ChromaticAberration
        offset={chromaticOffset}
        radialModulation={false}
        modulationOffset={0}
      />
    </EffectComposer>
  )
}
