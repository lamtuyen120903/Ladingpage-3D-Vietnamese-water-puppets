# Phase 2: GPU Particle Systems

## Context
- Links: [plan.md](../plan.md), [phase-01-postprocessing.md](./phase-01-postprocessing.md)
- New particle systems for immersive water puppet theater atmosphere

## Overview
**Date:** 2026-04-17 | **Priority:** P1 | **Status:** Pending

Implement GPU-accelerated particle systems for:
1. Water splash particles when puppets emerge from water
2. Ambient firefly particles floating around the stage
3. Ripple effects on water surface

## Key Insights
- WaterSurface.tsx already has custom GLSL — particle system should complement it
- Puppet emergence animations (0-1.2s) are ideal triggers for splash particles
- Fireflies add magical nighttime theater atmosphere
- BufferGeometry with typed arrays for GPU-side particle animation
- Instanced rendering for performance with many particles

## Requirements
- Three.js BufferGeometry with Float32Array attributes
- useFrame hook for per-frame particle position updates
- Event system to trigger splash particles from Puppet emergence
- Particle count caps: 200 splash, 80 fireflies max

## Architecture
```
WaterParticles.tsx (new) — GPU splash particles
├── BufferGeometry with position, velocity, lifetime attributes
├── ShaderMaterial (custom vertex/fragment for circular sprites)
├── Emitter pool — recycle particles when lifetime expires
└── Trigger: puppet emergence events

AmbientParticles.tsx (new) — Firefly system
├── InstancedMesh for 80 firefly sprites
├── Per-instance color/intensity attributes
├── Brownian motion via noise-based position updates
└── Glow material: emissive yellow-green sprites
```

## Implementation Steps
1. Create `src/components/WaterParticles.tsx`
   - Define particle attributes: position (vec3), velocity (vec3), life (float), size (float)
   - ShaderMaterial with circular sprite, alpha fade based on life
   - Pool of 200 particles, emit on puppet rise
   - Gravity and drag physics in vertex shader
2. Create `src/components/AmbientParticles.tsx`
   - InstancedMesh with 80 instances
   - Brownian motion: `pos += noise(pos * scale + time) * amplitude`
   - Color variation: warm yellow (#f8e868) to soft green (#88f088)
   - Blink animation: sin(time + instanceId) controlling opacity
3. Integrate both into PuppetStage.tsx
4. Tune particle counts for 60fps target

## Related Code Files
- `src/components/PuppetStage.tsx` — main canvas
- `src/components/WaterSurface.tsx` — existing water shader
- `src/components/Puppet.tsx:145-155` — emergence animation trigger zone

## Todo
- [ ] Create WaterParticles.tsx with splash effect
- [ ] Create AmbientParticles.tsx with firefly system
- [ ] Integrate particles into PuppetStage
- [ ] Tune particle counts and performance
- [ ] Test emergence trigger timing

## Success Criteria
- Splash particles emit when puppet rises from water
- Fireflies float with organic Brownian motion
- Particle count capped: 200 splash + 80 fireflies
- Maintains 55+ fps on mid-range GPU
- No particle z-fighting with stage elements

## Risk Assessment
- **Risk:** Particle systems can cause draw call overhead
- **Mitigation:** Use InstancedMesh, merge geometries where possible
- **Risk:** Particle recycling logic can cause visual pop
- **Mitigation:** Fade out particles gradually, not instant removal

## Security Considerations
- No user input to particle systems
- No network requests
- All computation on GPU/CPU

## Next Steps
→ Phase 3: Cinematic Camera System — smooth phase transitions
