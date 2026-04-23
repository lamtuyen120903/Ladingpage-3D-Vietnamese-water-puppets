# Phase 4: Interactive Elements & Performance Optimization

## Context
- Links: [plan.md](../plan.md), [phase-03-camera-system.md](./phase-03-camera-system.md)
- Final phase: enhance interactivity and optimize for real-time performance

## Overview
**Date:** 2026-04-17 | **Priority:** P2 | **Status:** Pending

Add enhanced hover effects, performance optimizations via LOD and frustum culling, and overall polish.

## Key Insights
- Puppet.tsx already has hover effects — enhance with scale + glow
- Water surface ripple effects can respond to puppet positions
- Performance: many mesh objects in ThuyDinh need optimization
- Use drei's `<Detailed>` for distance-based LOD on complex elements

## Requirements
- Enhanced hover: puppet scale 1.15x + stronger glow on hover
- Water ripple shader enhancement: react to puppet positions
- Performance: frustum culling, instanced meshes where possible
- Responsive: handle window resize gracefully

## Architecture
```
Enhancements to existing files:
├── Puppet.tsx — enhanced hover scale + glow
├── WaterSurface.tsx — position-reactive ripples
├── PuppetStage.tsx — responsive canvas, performance monitoring
└── ThuyDinh.tsx — detailed LOD for complex elements
```

## Implementation Steps
1. Puppet hover enhancement:
   - Current: scale 1.12x on hover — increase to 1.15x
   - Add subtle glow intensity boost
   - Add emissive pulse animation on hover
2. Water ripple enhancement:
   - Add uniform array for puppet positions
   - Ripple waves emanate from puppet XZ positions
3. Performance:
   - Add `<Detailed distances={[5, 15, 30]}>` to ThuyDinh complexity levels
   - Ensure all meshes have frustum culling enabled (default)
   - Monitor with Stats widget during dev
4. Responsive:
   - Canvas already uses dpr={[1, 2]} — good
   - Add useWindowResize handler if needed

## Related Code Files
- `src/components/Puppet.tsx:352` — current hover scale
- `src/components/WaterSurface.tsx` — existing shader
- `src/components/PuppetStage.tsx:32-33` — canvas dpr

## Todo
- [ ] Enhance puppet hover scale/glow
- [ ] Add position-reactive water ripples
- [ ] Add LOD to complex ThuyDinh elements
- [ ] Performance test and optimize
- [ ] Verify responsive behavior

## Success Criteria
- Hover effect more pronounced and satisfying
- Water ripples respond to puppet positions naturally
- 60fps maintained on mid-range laptop
- No visible pop-in of LOD elements
- Responsive on mobile (touch orbit controls)

## Risk Assessment
- **Risk:** Too many LOD levels cause complexity
- **Mitigation:** Only 2-3 levels, max distance 30 units
- **Fallback:** Disable LOD if it causes issues

## Security Considerations
- No security implications for UI/interaction enhancements

## Next Steps
→ Update docs/design-guidelines.md with shader patterns and 3D components
