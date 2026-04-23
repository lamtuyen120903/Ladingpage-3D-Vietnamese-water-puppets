# 3D Enhancement Plan — Múa Rối Nước Portfolio

## Overview
Enhancing the Vietnamese Water Puppet Theater 3D scene with advanced post-processing, GPU particle systems, cinematic camera work, and immersive interactive elements.

**Date:** 2026-04-17 | **Priority:** High | **Status:** In Progress

---

## Phases

### [Phase 1: Post-Processing Pipeline Enhancement](./phase-01-postprocessing.md)
Advanced effects: vignette, chromatic aberration, tone mapping, SSAO.
**Status:** Pending

### [Phase 2: GPU Particle Systems](./phase-02-particle-systems.md)
Water splash particles, firefly ambient particles, ripple effects.
**Status:** Pending

### [Phase 3: Cinematic Camera System](./phase-03-camera-system.md)
Phase transitions, orbit controls, smooth interpolation.
**Status:** Pending

### [Phase 4: Interactive Elements & Performance](./phase-04-interaction-performance.md)
Hover effects enhancement, drag interactions, LOD optimization.
**Status:** Pending

---

## Key Insights
- Water surface already has custom GLSL shader (caustics, waves, shimmer)
- Post-processing currently only has Bloom — room for vignette, DOF, SSAO
- No particle system for water splashes or ambient fireflies
- Camera is static — cinematic transitions between phases would enhance immersion
- Scene already uses GPU-based animations via useFrame

## Requirements
- Three.js postprocessing library
- @react-three/postprocessing already installed
- GPU-accelerated particles via BufferGeometry with instanced rendering
- Camera controls with smooth dampening

## Architecture
- Extend `PuppetStage.tsx` with new post-processing effects
- Create `WaterParticles.tsx` for GPU splash particles
- Create `AmbientParticles.tsx` for firefly system
- Create `CinematicCamera.tsx` for camera transitions
- Create `EnhancedPostProcessing.tsx` for advanced effects

## Related Code Files
- `src/components/PuppetStage.tsx` — main 3D canvas and composition
- `src/components/WaterSurface.tsx` — existing GLSL water shader
- `src/components/Puppet.tsx` — puppet animation system
- `src/components/StageLighting.tsx` — lighting system
- `package.json` — Three.js ecosystem dependencies

## Implementation Stack
- Three.js / React Three Fiber
- @react-three/postprocessing (already installed)
- Custom GLSL shaders
- BufferGeometry with typed arrays for particle systems
- useFrame for GPU-side animation

## Success Criteria
- [ ] Post-processing: vignette, chromatic aberration, enhanced bloom visible
- [ ] Water splash particles emit when puppets emerge from water
- [ ] Firefly/ambient particles float around the stage
- [ ] Camera smoothly transitions between opening and performing phases
- [ ] OrbitControls allow subtle audience interaction
- [ ] 60fps maintained on mid-range devices
- [ ] No visual artifacts or z-fighting

## Risk Assessment
- Post-processing stacking may impact performance → use selective effects
- Particle count may cause GPU pressure → implement count caps and LOD
- Custom shaders may not compile on all devices → add fallbacks

## Next Steps
→ Begin with Phase 1: Post-Processing Pipeline Enhancement
