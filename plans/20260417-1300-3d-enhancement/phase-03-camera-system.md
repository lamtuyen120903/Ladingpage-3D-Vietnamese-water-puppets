# Phase 3: Cinematic Camera System

## Context
- Links: [plan.md](../plan.md), [phase-02-particle-systems.md](./phase-02-particle-systems.md)
- Camera currently static at position [0, 2.2, 9], fov 56

## Overview
**Date:** 2026-04-17 | **Priority:** P2 | **Status:** Pending

Implement cinematic camera movements and interactive orbit controls for immersive audience experience.

## Key Insights
- Camera currently static — smooth transitions between phases would enhance drama
- Opening phase: pull back slightly to reveal full stage
- Performing phase: move in for closer puppet view
- OrbitControls with constraints prevents disorienting angles
- Smooth dampening creates theatrical camera movement feel

## Requirements
- @react-three/drei OrbitControls (already installed with drei)
- Smooth camera position interpolation using useFrame + lerp
- Camera waypoints for each phase
- Constraints: polar angle 30°-80°, azimuth ±45°

## Architecture
```
CinematicCamera.tsx (new)
├── Camera rig with target (lookAt) position
├── OrbitControls with dampening and constraints
├── Phase-based camera waypoints:
│   ├── opening: [0, 2.8, 10] — wider view
│   ├── performing: [0, 2.2, 9] — default view
│   └── act-specific: slight variations per act
└── Smooth interpolation between waypoints
```

## Implementation Steps
1. Create `src/components/CinematicCamera.tsx`
2. Import OrbitControls from @react-three/drei
3. Define camera waypoints per phase
4. Use useFrame to lerp camera position and target
5. Set orbit controls enableDamping = true, dampingFactor = 0.05
6. Constrain polar angle: [Math.PI/6, Math.PI/2.2]
7. Integrate into PuppetStage, pass phase as prop
8. Test transitions feel smooth and theatrical

## Related Code Files
- `src/components/PuppetStage.tsx:24` — current camera configuration
- `src/App.tsx:12` — phase state definition

## Todo
- [ ] Create CinematicCamera.tsx
- [ ] Define phase-based camera waypoints
- [ ] Implement smooth lerp transitions
- [ ] Add OrbitControls with constraints
- [ ] Integrate into PuppetStage
- [ ] Test camera feels cinematic

## Success Criteria
- Camera smoothly transitions between phases over 2-3 seconds
- OrbitControls allow audience to look around within constraints
- Camera never goes below stage floor or too high
- No jarring jumps when phase changes

## Risk Assessment
- **Risk:** OrbitControls conflict with programmatic camera movement
- **Mitigation:** Use ref-based control, disable controls during transitions
- **Fallback:** Fall back to static camera if controls cause issues

## Security Considerations
- No user input to camera beyond mouse/touch
- No external dependencies

## Next Steps
→ Phase 4: Interactive Elements & Performance Optimization
