# Phase 1: Post-Processing Pipeline Enhancement

## Context
- Links: [plan.md](../plan.md)
- Extends existing `PuppetStage.tsx` which currently only has Bloom effect

## Overview
**Date:** 2026-04-17 | **Priority:** P1 | **Status:** Pending

Add selective advanced post-processing effects to enhance the theatrical, warm atmosphere of the Vietnamese water puppet stage without impacting performance.

## Key Insights
- Current Bloom intensity: 0.4, threshold 0.6 — good foundation
- Vignette will frame the scene cinematically, drawing focus to center stage
- Chromatic aberration at subtle levels adds organic lens character
- Tone mapping already uses ACESFilmic — keep and enhance exposure
- Selective effects prevent full-screen performance cost

## Requirements
- `@react-three/postprocessing` — already in package.json
- Effects: Vignette, ChromaticAberration, ToneMapping, BrightnessContrast
- Selective application — not every effect on every frame
- Preserve existing Bloom by adjusting intensity

## Architecture
```
EnhancedPostProcessing.tsx (new)
├── EffectComposer (existing)
│   ├── Bloom (existing — adjust intensity)
│   ├── Vignette (new)
│   ├── ChromaticAberration (new)
│   └── ToneMapping (existing — tune exposure)
```

## Implementation Steps
1. Create `src/components/EnhancedPostProcessing.tsx`
2. Import Vignette, ChromaticAberration from postprocessing
3. Wrap existing EffectComposer with new effects
4. Tune vignette offset/smoothness for theatrical framing
5. Set chromatic aberration offset to 0.0003 (subtle)
6. Test performance with stats panel
7. Iterate on intensity values

## Related Code Files
- `src/components/PuppetStage.tsx:51-58` — existing EffectComposer with Bloom

## Todo
- [ ] Create EnhancedPostProcessing.tsx
- [ ] Add Vignette effect
- [ ] Add ChromaticAberration effect
- [ ] Tune bloom parameters
- [ ] Verify 60fps performance

## Success Criteria
- Vignette darkens edges by ~40%, focus on center stage
- Chromatic aberration only visible on high-contrast edges
- Bloom still works for gold/emissive glow
- No performance drop below 50fps on mid-range GPU

## Risk Assessment
- **Risk:** Post-processing stack order matters (bloom before vignette)
- **Mitigation:** Test each effect individually, maintain order: bloom → vignette → chromatic
- **Fallback:** Remove chromatic aberration if performance impact >10%

## Security Considerations
- No user input to post-processing shaders
- No external texture dependencies
- All effects computed on GPU

## Next Steps
→ Phase 2: GPU Particle Systems — water splashes and fireflies
