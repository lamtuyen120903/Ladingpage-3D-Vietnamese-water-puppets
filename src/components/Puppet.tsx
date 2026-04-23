import { useRef, useMemo, useState, useCallback } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'

export interface PuppetConfig {
  id: string
  position: [number, number, number]
  skin: string
  outfit: string
  outfitSecondary: string
  headwear: string
  scale: number
  animation: string
  animationSpeed: number
  animationOffset: number
  /** Index within the group — used for staggered entrance */
  groupIndex?: number
  /** Total puppets in the group */
  groupTotal?: number
}

interface Props {
  config: PuppetConfig
  highlighted: boolean
  onClick?: () => void
  onHover?: (hovering: boolean) => void
}

export default function Puppet({ config, highlighted, onClick, onHover }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const armLRef = useRef<THREE.Group>(null)
  const armRRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [performing, setPerforming] = useState(false)
  const performStartRef = useRef(0)

  const glow = highlighted || hovered || performing

  // === Materials — bright & vivid ===
  const skinMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: config.skin, roughness: 0.4, emissive: config.skin, emissiveIntensity: glow ? 0.45 : 0.2,
  }), [config.skin, glow])

  // Gold ornate vest — brighter
  const goldVestMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#d8a838', roughness: 0.25, metalness: 0.55,
    emissive: '#a88028', emissiveIntensity: glow ? 0.55 : 0.35,
  }), [glow])

  // Dark brown/maroon inner tunic — lighter
  const darkTunicMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#7a3828', roughness: 0.45, emissive: '#5a2818', emissiveIntensity: glow ? 0.35 : 0.2,
  }), [glow])

  // Red accent — vivid
  const redMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e03030', roughness: 0.35, emissive: '#cc2020', emissiveIntensity: 0.3,
  }), [])

  // Skirt base — slightly lighter
  const skirtDarkMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2a2028', roughness: 0.5, emissive: '#1a1418', emissiveIntensity: glow ? 0.25 : 0.12,
  }), [glow])

  // Skirt stripe colors — more vivid
  const stripeGreenMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#28a858', roughness: 0.4, emissive: '#1a7838', emissiveIntensity: 0.25,
  }), [])
  const stripePinkMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e05888', roughness: 0.4, emissive: '#c84070', emissiveIntensity: 0.25,
  }), [])
  const stripeYellowMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e0b848', roughness: 0.35, emissive: '#b89030', emissiveIntensity: 0.25,
  }), [])
  const stripeRedMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#d04040', roughness: 0.4, emissive: '#a83030', emissiveIntensity: 0.25,
  }), [])

  // Gold trim/belt — shinier
  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e0b848', roughness: 0.2, metalness: 0.7, emissive: '#b89038', emissiveIntensity: 0.35,
  }), [])

  // Hat/cap red — vivid
  const hatRedMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e03030', roughness: 0.35, emissive: '#cc2020', emissiveIntensity: 0.3,
  }), [])

  // Parasol
  const parasolMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e03038', roughness: 0.35, emissive: '#a82020', emissiveIntensity: 0.25,
    side: THREE.DoubleSide,
  }), [])

  // Hair — slightly lighter for visibility
  const hairMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1418', roughness: 0.6, emissive: '#0a0808', emissiveIntensity: 0.08,
  }), [])

  // Base/platform — brighter green
  const baseMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#38883a', roughness: 0.5, emissive: '#286828', emissiveIntensity: 0.18,
  }), [])

  // Control rod — lighter
  const rodMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8a5a30', roughness: 0.6, emissive: '#4a3018', emissiveIntensity: 0.08,
  }), [])

  // Face details — brighter
  const cheekMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e89090', roughness: 0.45, emissive: '#d07070', emissiveIntensity: 0.25,
  }), [])
  const eyeMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#1a0a04' }), [])
  const eyebrowMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#2a1808' }), [])
  const mouthMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e03838', roughness: 0.4, emissive: '#cc2828', emissiveIntensity: 0.3,
  }), [])
  const whiteMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#f8f0e8', roughness: 0.4, emissive: '#e0d8c8', emissiveIntensity: 0.2,
  }), [])

  // Sleeve colors — brighter
  const sleeveMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: config.outfit, roughness: 0.35, emissive: config.outfit, emissiveIntensity: glow ? 0.4 : 0.22,
  }), [config.outfit, glow])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const elapsed = clock.getElapsedTime()
    const t = elapsed * config.animationSpeed + config.animationOffset
    const g = groupRef.current

    // === PERFORMANCE khi click — trước khi show modal ===
    if (performing) {
      if (performStartRef.current < 0) performStartRef.current = elapsed
      const pt = elapsed - performStartRef.current
      const baseY = config.position[1]
      const baseX = config.position[0]
      const isIntro = config.id.startsWith('intro')

      if (isIntro) {
        // ===== MÀN GIỚI THIỆU — múa rối nước truyền thống =====

        // 1. EMERGENCE — trồi lên từ dưới nước (0–1.2s)
        if (pt < 1.2) {
          const rise = Math.min(pt / 1.0, 1)
          const eased = rise * rise * (3 - 2 * rise)
          g.position.y = baseY - 0.5 + eased * 0.5
          g.position.x = baseX
          g.rotation.set(0, 0, 0)
          g.rotation.z = Math.sin(pt * 8) * 0.02 * (1 - eased)
          if (armLRef.current) armLRef.current.rotation.z = 0.1
          if (armRRef.current) armRRef.current.rotation.z = -0.1
        }
        // 2. NHÚN CHÀO — signature puppet bow (1.2–2.8s)
        else if (pt < 2.8) {
          const p2 = pt - 1.2
          g.position.x = baseX
          g.rotation.z = 0
          let dip = 0
          if (p2 < 0.3) { dip = (p2 / 0.3) * 0.08 }
          else if (p2 < 0.5) { dip = 0.08 }
          else if (p2 < 0.9) { dip = 0.08 + ((p2 - 0.5) / 0.4) * 0.12 }
          else if (p2 < 1.2) { dip = 0.2 }
          else { const up = Math.min((p2 - 1.2) / 0.4, 1); dip = 0.2 * (1 - up * up) }
          g.position.y = baseY - dip
          g.rotation.x = dip * 1.2
          if (armLRef.current) armLRef.current.rotation.z = dip * 2
          if (armRRef.current) armRRef.current.rotation.z = -dip * 2
        }
        // 3. XOAY KHỰNG — jerky rotation (2.8–3.8s)
        else if (pt < 3.8) {
          const p3 = pt - 2.8
          g.position.x = baseX; g.position.y = baseY; g.rotation.x = 0
          if (p3 < 0.2) { g.rotation.y = -(p3 / 0.2) * 0.26 }
          else if (p3 < 0.4) { g.rotation.y = -0.26 }
          else if (p3 < 0.6) { g.rotation.y = -0.26 + ((p3 - 0.4) / 0.2) * 0.52 }
          else if (p3 < 0.8) { g.rotation.y = 0.26 }
          else { g.rotation.y = 0.26 * (1 - Math.min((p3 - 0.8) / 0.2, 1)) }
          if (armLRef.current) armLRef.current.rotation.z = 0.15
          if (armRRef.current) armRRef.current.rotation.z = -0.15
        }
        // 4. TAY VẪY — jerky arm wave (3.8–4.6s)
        else if (pt < 4.6) {
          const p4 = pt - 3.8
          g.position.x = baseX; g.position.y = baseY; g.rotation.set(0, 0, 0)
          let a = 0
          if (p4 < 0.15) { a = (p4 / 0.15) * 0.8 }
          else if (p4 < 0.25) { a = 0.8 }
          else if (p4 < 0.4) { a = 0.8 - ((p4 - 0.25) / 0.15) * 0.8 }
          else if (p4 < 0.5) { a = 0 }
          else if (p4 < 0.65) { a = ((p4 - 0.5) / 0.15) * 0.8 }
          else if (p4 < 0.75) { a = 0.8 }
          else { a = 0.8 * Math.max(0, 1 - (p4 - 0.75) / 0.05) }
          if (armLRef.current) armLRef.current.rotation.z = a
          if (armRRef.current) armRRef.current.rotation.z = -0.1
          g.rotation.z = a * 0.05
        }
        // 5. IDLE — float chờ modal (4.6–5s)
        else {
          const p5 = pt - 4.6
          g.position.x = baseX
          g.position.y = baseY + Math.sin(p5 * 3) * 0.015
          g.rotation.x = 0
          g.rotation.y = Math.sin(p5 * 1.5) * 0.04
          g.rotation.z = Math.sin(p5 * 2) * 0.015
          if (armLRef.current) armLRef.current.rotation.z = Math.sin(p5 * 2) * 0.08
          if (armRRef.current) armRRef.current.rotation.z = -Math.sin(p5 * 2 + 1) * 0.08
        }

      } else {
        // ===== MÀN 2/3 (Automation, AI) — đội hình rối nước =====
        const idx = config.groupIndex ?? 0
        const total = config.groupTotal ?? 1
        const delay = idx * 0.3 // staggered entrance
        const apt = pt - delay // adjusted time after this puppet's delay

        if (apt < 0) {
          // Chưa đến lượt — ẩn dưới nước
          g.position.y = baseY - 0.6
          g.position.x = baseX
          return
        }

        // 1. XUẤT HIỆN THEO NHỊP (0–0.8s mỗi con, staggered)
        if (apt < 0.8) {
          const rise = Math.min(apt / 0.7, 1)
          const eased = rise * rise * (3 - 2 * rise)
          g.position.y = baseY - 0.5 + eased * 0.5
          g.position.x = baseX
          g.rotation.set(0, 0, 0)
          g.rotation.z = Math.sin(apt * 10) * 0.02 * (1 - eased)
          if (armLRef.current) armLRef.current.rotation.z = 0.1
          if (armRRef.current) armRRef.current.rotation.z = -0.1
        }

        // 2. NHÚN ĐỒNG BỘ (0.8–2s) — tất cả cùng nhún
        else if (apt < 2) {
          const p2 = apt - 0.8
          g.position.x = baseX
          g.rotation.y = 0; g.rotation.z = 0
          let dip = 0
          if (p2 < 0.25) { dip = (p2 / 0.25) * 0.12 } // xuống
          else if (p2 < 0.4) { dip = 0.12 } // dừng
          else if (p2 < 0.6) { dip = 0.12 * (1 - (p2 - 0.4) / 0.2) } // lên
          else if (p2 < 0.75) { dip = 0 } // dừng
          else if (p2 < 1.0) { dip = ((p2 - 0.75) / 0.25) * 0.08 } // xuống nhẹ
          else { dip = 0.08 * (1 - Math.min((p2 - 1.0) / 0.2, 1)) } // lên
          g.position.y = baseY - dip
          g.rotation.x = dip * 1.0
          if (armLRef.current) armLRef.current.rotation.z = dip * 1.5
          if (armRRef.current) armRRef.current.rotation.z = -dip * 1.5
        }

        // 3. DI CHUYỂN THEO CUNG TRÒN (2–3.5s)
        else if (apt < 3.5) {
          const p3 = apt - 2
          const progress = p3 / 1.5
          // Mỗi con đi 1 cung khác nhau dựa trên index
          const arcAngle = progress * Math.PI * 0.8 // cung ~144°
          const arcOffset = (idx / Math.max(total - 1, 1)) * Math.PI * 2 // spread
          const radius = 0.8 + idx * 0.15
          g.position.x = baseX + Math.sin(arcOffset + arcAngle) * radius - Math.sin(arcOffset) * radius
          g.position.z = config.position[2] + Math.cos(arcOffset + arcAngle) * radius * 0.3 - Math.cos(arcOffset) * radius * 0.3
          g.position.y = baseY + Math.sin(p3 * 4) * 0.02
          g.rotation.y = arcAngle * 0.5 * (idx % 2 === 0 ? 1 : -1)
          g.rotation.x = 0; g.rotation.z = 0
          if (armLRef.current) armLRef.current.rotation.z = 0.2 + Math.sin(p3 * 5) * 0.2
          if (armRRef.current) armRRef.current.rotation.z = -0.2 - Math.sin(p3 * 5 + 1) * 0.2
        }

        // 4. GIAO NHAU — 2 con cắt nhau chậm + pause (3.5–4.3s)
        else if (apt < 4.3) {
          const p4 = apt - 3.5
          const crossDir = idx % 2 === 0 ? 1 : -1
          let crossX = 0
          if (p4 < 0.3) {
            crossX = (p4 / 0.3) * 0.4 * crossDir // đi sang
          } else if (p4 < 0.45) {
            crossX = 0.4 * crossDir // pause giữa đường
          } else {
            crossX = 0.4 * crossDir * (1 - Math.min((p4 - 0.45) / 0.35, 1)) // quay về
          }
          g.position.x = baseX + crossX
          g.position.z = config.position[2]
          g.position.y = baseY + Math.sin(p4 * 3) * 0.015
          g.rotation.y = crossX * 0.3
          g.rotation.x = 0; g.rotation.z = 0
          if (armLRef.current) armLRef.current.rotation.z = 0.15
          if (armRRef.current) armRRef.current.rotation.z = -0.15
        }

        // 5. HIGHLIGHT POSE — nhún mạnh + xoay về camera (4.3–5s)
        else {
          const p5 = apt - 4.3
          g.position.x = baseX
          g.position.z = config.position[2]
          // Nhún mạnh
          let dip = 0
          if (p5 < 0.2) { dip = (p5 / 0.2) * 0.15 }
          else if (p5 < 0.35) { dip = 0.15 }
          else { dip = 0.15 * Math.max(0, 1 - (p5 - 0.35) / 0.2) }
          g.position.y = baseY - dip
          // Xoay về phía camera (z+)
          g.rotation.y *= 0.9 // ease to 0 = face camera
          g.rotation.x = dip * 0.8
          g.rotation.z = 0
          if (armLRef.current) armLRef.current.rotation.z = Math.sin(p5 * 2) * 0.1
          if (armRRef.current) armRRef.current.rotation.z = -Math.sin(p5 * 2 + 1) * 0.1
        }
      }

      const performScale = config.scale * 1.15
      g.scale.lerp(new THREE.Vector3(performScale, performScale, performScale), 0.08)
      return
    }

    // === NORMAL ANIMATIONS ===
    const anim = config.animation

    // Water bob
    g.position.y = config.position[1] + Math.sin(t * 0.6) * 0.03

    if (anim === 'idle') {
      g.rotation.y = Math.sin(t * 0.3) * 0.1
      g.rotation.z = Math.sin(t * 0.4) * 0.03
      if (armLRef.current) armLRef.current.rotation.z = Math.sin(t * 0.5) * 0.2
      if (armRRef.current) armRRef.current.rotation.z = -Math.sin(t * 0.5 + 1) * 0.2
    } else if (anim === 'bow') {
      const bowCycle = (Math.sin(t * 0.4) + 1) * 0.5
      g.rotation.x = bowCycle * 0.25
      g.rotation.y = Math.sin(t * 0.3) * 0.15
      if (armLRef.current) armLRef.current.rotation.z = bowCycle * 0.6
      if (armRRef.current) armRRef.current.rotation.z = -bowCycle * 0.6
    } else if (anim === 'wave') {
      g.rotation.y = Math.sin(t * 0.4) * 0.15
      if (armLRef.current) armLRef.current.rotation.z = 0.4 + Math.sin(t * 1.5) * 0.5
      if (armRRef.current) armRRef.current.rotation.z = -Math.sin(t * 0.5) * 0.2
    } else if (anim === 'dance') {
      g.rotation.y = Math.sin(t * 0.6) * 0.25
      g.rotation.z = Math.sin(t * 0.8) * 0.08
      g.position.x = config.position[0] + Math.sin(t * 0.5) * 0.2
      if (armLRef.current) armLRef.current.rotation.z = 0.2 + Math.sin(t * 1) * 0.5
      if (armRRef.current) armRRef.current.rotation.z = -0.2 - Math.sin(t * 1 + 2) * 0.5
    } else if (anim === 'glow') {
      g.rotation.y = Math.sin(t * 0.3) * 0.2
      if (armLRef.current) armLRef.current.rotation.z = 0.3 + Math.sin(t * 0.6) * 0.3
      if (armRRef.current) armRRef.current.rotation.z = -0.3 - Math.sin(t * 0.6 + 1) * 0.3
    }

    const targetScale = glow ? config.scale * 1.15 : config.scale
    g.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
  })

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
    onHover?.(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setHovered(false)
    onHover?.(false)
    document.body.style.cursor = 'default'
  }

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (performing) return
    setPerforming(true)
    performStartRef.current = -1 // signal to capture clock time on next frame

    setTimeout(() => {
      setPerforming(false)
      onClick?.()
    }, 5000)
  }, [performing, onClick])

  return (
    <group
      ref={groupRef}
      position={config.position}
      scale={config.scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* ===== Floating platform/base ===== */}
      <mesh position={[0, -0.08, 0]} material={baseMat}>
        <cylinderGeometry args={[0.28, 0.32, 0.1, 32]} />
      </mesh>
      <mesh position={[0, -0.02, 0]} material={goldMat}>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
      </mesh>

      {/* ===== SKIRT — layered with colorful horizontal stripes ===== */}
      {/* Main dark skirt body — flared cone */}
      <mesh position={[0, 0.14, 0]} material={skirtDarkMat} castShadow>
        <cylinderGeometry args={[0.15, 0.28, 0.35, 32]} />
      </mesh>
      {/* Horizontal stripe bands on skirt */}
      {/* Bottom gold/yellow stripe */}
      <mesh position={[0, 0.0, 0]} material={stripeYellowMat}>
        <cylinderGeometry args={[0.27, 0.285, 0.025, 32]} />
      </mesh>
      {/* Green stripe */}
      <mesh position={[0, 0.04, 0]} material={stripeGreenMat}>
        <cylinderGeometry args={[0.26, 0.275, 0.03, 32]} />
      </mesh>
      {/* Pink/magenta stripe */}
      <mesh position={[0, 0.09, 0]} material={stripePinkMat}>
        <cylinderGeometry args={[0.245, 0.26, 0.025, 32]} />
      </mesh>
      {/* Red stripe near waist */}
      <mesh position={[0, 0.14, 0]} material={stripeRedMat}>
        <cylinderGeometry args={[0.225, 0.245, 0.025, 32]} />
      </mesh>
      {/* Thin gold stripe highlights */}
      <mesh position={[0, 0.065, 0]} material={goldMat}>
        <cylinderGeometry args={[0.252, 0.268, 0.008, 32]} />
      </mesh>
      <mesh position={[0, 0.115, 0]} material={goldMat}>
        <cylinderGeometry args={[0.237, 0.253, 0.008, 32]} />
      </mesh>
      {/* Skirt bottom hem — decorative edge */}
      <mesh position={[0, -0.04, 0]} material={stripeGreenMat}>
        <cylinderGeometry args={[0.28, 0.29, 0.015, 32]} />
      </mesh>

      {/* ===== UPPER BODY — dark tunic with gold vest ===== */}
      {/* Inner dark brown tunic */}
      <mesh position={[0, 0.42, 0]} material={darkTunicMat} castShadow>
        <cylinderGeometry args={[0.12, 0.155, 0.3, 32]} />
      </mesh>
      {/* Gold ornate vest/bodice overlay — front */}
      <mesh position={[0, 0.44, 0.07]} material={goldVestMat}>
        <boxGeometry args={[0.22, 0.26, 0.04]} />
      </mesh>
      {/* Gold vest — back */}
      <mesh position={[0, 0.44, -0.07]} material={goldVestMat}>
        <boxGeometry args={[0.22, 0.26, 0.03]} />
      </mesh>
      {/* Vest side panels */}
      {[-0.1, 0.1].map((x) => (
        <mesh key={`vest-${x}`} position={[x, 0.44, 0]} material={goldVestMat}>
          <boxGeometry args={[0.03, 0.24, 0.12]} />
        </mesh>
      ))}
      {/* Red trim on vest edges */}
      <mesh position={[0, 0.32, 0.09]} material={redMat}>
        <boxGeometry args={[0.24, 0.025, 0.015]} />
      </mesh>
      <mesh position={[0, 0.56, 0.09]} material={redMat}>
        <boxGeometry args={[0.24, 0.025, 0.015]} />
      </mesh>
      {/* Vest center line — ornamental */}
      <mesh position={[0, 0.44, 0.095]} material={redMat}>
        <boxGeometry args={[0.02, 0.24, 0.008]} />
      </mesh>
      {/* Gold cross-body decorative patterns on vest */}
      <mesh position={[-0.05, 0.48, 0.092]} material={redMat}>
        <boxGeometry args={[0.08, 0.015, 0.006]} />
      </mesh>
      <mesh position={[0.05, 0.40, 0.092]} material={redMat}>
        <boxGeometry args={[0.08, 0.015, 0.006]} />
      </mesh>

      {/* Gold belt/sash at waist */}
      <mesh position={[0, 0.315, 0]} material={goldMat}>
        <cylinderGeometry args={[0.158, 0.158, 0.035, 32]} />
      </mesh>

      {/* Collar — white/cream with red trim */}
      <mesh position={[0, 0.58, 0]} material={whiteMat}>
        <cylinderGeometry args={[0.09, 0.115, 0.04, 32]} />
      </mesh>
      <mesh position={[0, 0.6, 0]} material={redMat}>
        <cylinderGeometry args={[0.092, 0.092, 0.012, 32]} />
      </mesh>

      {/* ===== HEAD — painted wooden face ===== */}
      {/* Hair base — black, slightly larger than head */}
      <mesh position={[0, 0.78, -0.02]} material={hairMat}>
        <sphereGeometry args={[0.165, 48, 36]} />
      </mesh>
      {/* Hair bun on top */}
      <mesh position={[0, 0.92, -0.04]} material={hairMat}>
        <sphereGeometry args={[0.06, 32, 24]} />
      </mesh>
      {/* Side hair tufts */}
      <mesh position={[-0.14, 0.78, -0.04]} material={hairMat}>
        <sphereGeometry args={[0.05, 32, 24]} />
      </mesh>
      <mesh position={[0.14, 0.78, -0.04]} material={hairMat}>
        <sphereGeometry args={[0.05, 32, 24]} />
      </mesh>
      {/* Hair hanging — side braids/strands */}
      <mesh position={[-0.13, 0.68, -0.02]} material={hairMat}>
        <capsuleGeometry args={[0.015, 0.1, 12, 24]} />
      </mesh>
      <mesh position={[0.13, 0.68, -0.02]} material={hairMat}>
        <capsuleGeometry args={[0.015, 0.1, 12, 24]} />
      </mesh>

      {/* Face — skin colored front hemisphere */}
      <mesh position={[0, 0.78, 0.02]} material={skinMat}>
        <sphereGeometry args={[0.155, 48, 36, 0, Math.PI * 2, 0, Math.PI / 2 + 0.3]} />
      </mesh>
      {/* Full face overlay for smooth look */}
      <mesh position={[0, 0.78, 0]} material={skinMat}>
        <sphereGeometry args={[0.16, 48, 36]} />
      </mesh>

      {/* Cheeks — rosy painted circles */}
      <mesh position={[-0.09, 0.76, 0.13]} material={cheekMat}>
        <sphereGeometry args={[0.03, 32, 24]} />
      </mesh>
      <mesh position={[0.09, 0.76, 0.13]} material={cheekMat}>
        <sphereGeometry args={[0.03, 32, 24]} />
      </mesh>

      {/* Eyes — black painted almond shapes */}
      <mesh position={[-0.05, 0.81, 0.145]} material={eyeMat}>
        <sphereGeometry args={[0.018, 32, 24]} />
      </mesh>
      <mesh position={[0.05, 0.81, 0.145]} material={eyeMat}>
        <sphereGeometry args={[0.018, 32, 24]} />
      </mesh>
      {/* Eye whites (tiny) */}
      <mesh position={[-0.05, 0.81, 0.14]} material={whiteMat}>
        <sphereGeometry args={[0.022, 32, 24]} />
      </mesh>
      <mesh position={[0.05, 0.81, 0.14]} material={whiteMat}>
        <sphereGeometry args={[0.022, 32, 24]} />
      </mesh>

      {/* Eyebrows — painted arcs */}
      <mesh position={[-0.05, 0.845, 0.145]} material={eyebrowMat} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.045, 0.01, 0.008]} />
      </mesh>
      <mesh position={[0.05, 0.845, 0.145]} material={eyebrowMat} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.045, 0.01, 0.008]} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0.79, 0.16]} material={skinMat}>
        <sphereGeometry args={[0.013, 32, 24]} />
      </mesh>

      {/* Mouth — red painted smile */}
      <mesh position={[0, 0.755, 0.155]} material={mouthMat}>
        <boxGeometry args={[0.045, 0.015, 0.008]} />
      </mesh>

      {/* ===== RED HAT/CAP ===== */}
      {/* Cap base */}
      <mesh position={[0, 0.92, 0.01]} material={hatRedMat}>
        <cylinderGeometry args={[0.1, 0.14, 0.08, 32]} />
      </mesh>
      {/* Cap top */}
      <mesh position={[0, 0.97, 0.01]} material={hatRedMat}>
        <cylinderGeometry args={[0.04, 0.1, 0.04, 32]} />
      </mesh>
      {/* Gold band on cap */}
      <mesh position={[0, 0.9, 0.01]} material={goldMat}>
        <cylinderGeometry args={[0.142, 0.142, 0.02, 32]} />
      </mesh>
      {/* Gold ornament on top of cap */}
      <mesh position={[0, 1.0, 0.01]} material={goldMat}>
        <sphereGeometry args={[0.025, 32, 24]} />
      </mesh>


      {/* ===== ARMS ===== */}
      {/* Left arm group */}
      <group ref={armLRef} position={[-0.16, 0.48, 0]}>
        {/* Upper arm (sleeve) */}
        <mesh position={[-0.08, -0.02, 0]} rotation={[0, 0, 0.5]} material={sleeveMat}>
          <capsuleGeometry args={[0.04, 0.14, 12, 24]} />
        </mesh>
        {/* Forearm */}
        <mesh position={[-0.18, -0.06, 0.02]} rotation={[0, 0, 0.8]} material={sleeveMat}>
          <capsuleGeometry args={[0.03, 0.12, 12, 24]} />
        </mesh>
        {/* Sleeve trim */}
        <mesh position={[-0.14, -0.04, 0]} rotation={[0, 0, 0.6]} material={goldMat}>
          <cylinderGeometry args={[0.042, 0.042, 0.02, 32]} />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.26, -0.08, 0.03]} material={skinMat}>
          <sphereGeometry args={[0.025, 32, 24]} />
        </mesh>
        {/* Holding object — white cloth/paper */}
        <mesh position={[-0.26, -0.14, 0.03]} material={whiteMat}>
          <boxGeometry args={[0.04, 0.1, 0.02]} />
        </mesh>
      </group>

      {/* Right arm group */}
      <group ref={armRRef} position={[0.16, 0.48, 0]}>
        {/* Upper arm (sleeve) */}
        <mesh position={[0.08, -0.02, 0]} rotation={[0, 0, -0.5]} material={sleeveMat}>
          <capsuleGeometry args={[0.04, 0.14, 12, 24]} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0.18, -0.06, 0.02]} rotation={[0, 0, -0.8]} material={sleeveMat}>
          <capsuleGeometry args={[0.03, 0.12, 12, 24]} />
        </mesh>
        {/* Sleeve trim */}
        <mesh position={[0.14, -0.04, 0]} rotation={[0, 0, -0.6]} material={goldMat}>
          <cylinderGeometry args={[0.042, 0.042, 0.02, 32]} />
        </mesh>
        {/* Hand */}
        <mesh position={[0.26, -0.08, 0.03]} material={skinMat}>
          <sphereGeometry args={[0.025, 32, 24]} />
        </mesh>
      </group>

      {/* ===== Control rod into water ===== */}
      <mesh position={[0, -0.25, 0]} material={rodMat}>
        <cylinderGeometry args={[0.012, 0.015, 0.4, 32]} />
      </mesh>

      {/* Highlight glow — enhanced for hover */}
      {glow && (
        <pointLight position={[0, 0.6, 0.3]} intensity={1.5} color="#d4a94a" distance={3} decay={2} />
      )}
      {config.animation === 'glow' && (
        <pointLight position={[0, 0.5, 0]} intensity={0.5} color="#d4a94a" distance={2} decay={2} />
      )}
    </group>
  )
}
