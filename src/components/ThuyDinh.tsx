import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

import * as THREE from 'three'

/**
 * Vietnamese water puppet theater stage (Thủy Đình) — Thăng Long style.
 * Pink/magenta tiled roofs, gray stone pillars, red dragon panels,
 * salmon-pink side platforms with green fringe, blue backdrop curtains.
 */
export default function ThuyDinh() {
  // Roof tiles — terracotta red/orange like reference
  const roofTileMat = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256; canvas.height = 256
    const ctx = canvas.getContext('2d')!
    // Base terracotta
    ctx.fillStyle = '#c05028'
    ctx.fillRect(0, 0, 256, 256)
    // Tile rows
    for (let row = 0; row < 16; row++) {
      const y = row * 16
      const offset = row % 2 === 0 ? 0 : 16
      ctx.fillStyle = row % 2 === 0 ? '#b84820' : '#c85830'
      for (let col = 0; col < 9; col++) {
        const x = col * 32 + offset
        // Tile shape — rounded bottom
        ctx.beginPath()
        ctx.moveTo(x + 2, y + 1)
        ctx.lineTo(x + 30, y + 1)
        ctx.lineTo(x + 28, y + 14)
        ctx.quadraticCurveTo(x + 16, y + 17, x + 4, y + 14)
        ctx.closePath()
        ctx.fill()
        // Highlight
        ctx.fillStyle = '#d86838'
        ctx.fillRect(x + 4, y + 2, 24, 3)
        ctx.fillStyle = row % 2 === 0 ? '#b84820' : '#c85830'
      }
      // Row shadow line
      ctx.fillStyle = '#903818'
      ctx.fillRect(0, y + 14, 256, 2)
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(4, 3)
    return new THREE.MeshStandardMaterial({
      map: tex, roughness: 0.6, emissive: '#803020', emissiveIntensity: 0.15,
    })
  }, [])
  const roofTileDark = useMemo(() => mat('#a04020', 0.55, '#803018', 0.2), [])
  const roofRidge = useMemo(() => mat('#d08030', 0.4, '#b06820', 0.3), [])

  // Gray stone — weathered look like reference
  const stoneGray = useMemo(() => mat('#889098', 0.6, '#687880', 0.1), [])
  const stoneDark = useMemo(() => mat('#687078', 0.65, '#586068', 0.08), [])
  const stoneBase = useMemo(() => mat('#788088', 0.6, '#607078', 0.08), [])

  // Red panels with gold trim — brighter
  const redPanel = useMemo(() => mat('#d04848', 0.45, '#b03838', 0.3), [])
  const redPanelDark = useMemo(() => mat('#b84040', 0.5, '#983030', 0.25), [])
  const gold = useMemo(() => mat('#f0c848', 0.18, '#d0a038', 0.55, 0.75), [])
  const goldDim = useMemo(() => mat('#d8b040', 0.25, '#b89030', 0.4, 0.6), [])

  // Salmon-pink side walls — significantly brighter
  const salmon = useMemo(() => mat('#d89888', 0.45, '#c08070', 0.25), [])
  const salmonDark = useMemo(() => mat('#c88070', 0.5, '#a86858', 0.2), [])

  // Green fringe — brighter
  const greenFringe = useMemo(() => mat('#2a8a4a', 0.5, '#1a6a38', 0.28), [])
  const greenDark = useMemo(() => mat('#2a7040', 0.55, '#1a5830', 0.22), [])

  // Dark teal/green curtains — like reference
  const curtainBlue = useMemo(() => mat('#1a3838', 0.65, '#0a2828', 0.12), [])
  const curtainBlueDark = useMemo(() => mat('#0a1a20', 0.7, '#050e10', 0.08), [])

  // Backdrop & wood — lighter
  const backdrop = useMemo(() => mat('#1a1a2a', 0.7, '#101020', 0.1), [])
  const wood = useMemo(() => mat('#5a4a30', 0.6, '#3a2a18', 0.12), [])
  const lattice = useMemo(() => mat('#90a0b8', 0.45, '#7888a0', 0.12), [])

  // Flag colors
  const flagRed = useMemo(() => mat('#cc2020', 0.5, '#aa1818', 0.25), [])
  const flagGreen = useMemo(() => mat('#208830', 0.5, '#106820', 0.2), [])
  const flagYellow = useMemo(() => mat('#d8c030', 0.45, '#b0a020', 0.2), [])

  return (
    <group position={[0, -0.4, -4.5]}>
      {/* ===== CUNG ĐÌNH — Thăng Long water puppet theater (reference-accurate) ===== */}
      <group position={[0, -0.6, 0.5]} scale={[1.3, 1, 1]}>

      {/* === DARK BACKDROP === */}
      <mesh position={[0, 2.5, -1.2]} material={curtainBlueDark}>
        <boxGeometry args={[8, 6, 0.08]} />
      </mesh>

      {/* === DARK TEAL CURTAINS hanging behind building === */}
      {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((x, i) => (
        <mesh key={`crt-${i}`} position={[x, 2.5, -0.6]} material={curtainBlue}>
          <boxGeometry args={[0.9, 3.5, 0.03]} />
        </mesh>
      ))}
      {/* Curtain folds — slight depth variation */}
      {[-2, -1, 0, 1, 2].map((x, i) => (
        <mesh key={`cfold-${i}`} position={[x, 2.5, -0.55]} material={curtainBlueDark}>
          <boxGeometry args={[0.15, 3.5, 0.02]} />
        </mesh>
      ))}

      {/* === LOWER WALL — gray stone with red dragon band (like reference) === */}
      {/* Main stone wall */}
      <mesh position={[0, 1, 0.9]} material={stoneGray}>
        <boxGeometry args={[6.2, 2, 0.12]} />
      </mesh>
      {/* Stone wall texture — vertical panel lines */}
      {[-2.6, -1.3, 0, 1.3, 2.6].map((x, i) => (
        <mesh key={`sline-${i}`} position={[x, 1, 0.97]} material={stoneDark}>
          <boxGeometry args={[0.03, 1.9, 0.01]} />
        </mesh>
      ))}

      {/* RED DRAGON BAND — horizontal red strip with gold dragons (center of wall) */}
      <mesh position={[0, 1.1, 0.97]} material={redPanel}>
        <boxGeometry args={[5.8, 0.55, 0.03]} />
      </mesh>
      {/* Gold borders on dragon band */}
      <mesh position={[0, 1.38, 0.985]} material={gold}><boxGeometry args={[5.9, 0.04, 0.02]} /></mesh>
      <mesh position={[0, 0.82, 0.985]} material={gold}><boxGeometry args={[5.9, 0.04, 0.02]} /></mesh>
      {/* Gold dragon relief panels */}
      {[-1.8, -0.6, 0.6, 1.8].map((x, i) => (
        <group key={`dragon-${i}`} position={[x, 1.1, 1.0]}>
          <mesh material={gold}><boxGeometry args={[0.9, 0.35, 0.015]} /></mesh>
          {/* Dragon body swirl */}
          <mesh position={[0.15, 0, 0.01]} material={gold}>
            <sphereGeometry args={[0.08, 32, 24]} />
          </mesh>
          <mesh position={[-0.2, 0.05, 0.01]} material={gold} rotation={[0, 0, 0.4]}>
            <boxGeometry args={[0.25, 0.04, 0.01]} />
          </mesh>
          <mesh position={[0.2, -0.05, 0.01]} material={gold} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.2, 0.04, 0.01]} />
          </mesh>
        </group>
      ))}

      {/* Hoa văn chữ Thọ 壽 lattice panels — gray stone with geometric pattern */}
      {[-2.6, 2.6].map((x, i) => (
        <group key={`tho-panel-${i}`} position={[x, 1.1, 0.98]}>
          {/* Frame */}
          <mesh material={stoneBase}><boxGeometry args={[0.5, 0.5, 0.02]} /></mesh>
          {/* Cross-hatch geometric Thọ pattern */}
          <mesh material={stoneDark} position={[0, 0, 0.01]}><boxGeometry args={[0.35, 0.35, 0.01]} /></mesh>
          {/* Inner square */}
          <mesh material={stoneBase} position={[0, 0, 0.015]}><boxGeometry args={[0.22, 0.22, 0.008]} /></mesh>
          {/* Cross lines */}
          <mesh material={stoneDark} position={[0, 0, 0.02]}><boxGeometry args={[0.3, 0.03, 0.005]} /></mesh>
          <mesh material={stoneDark} position={[0, 0, 0.02]}><boxGeometry args={[0.03, 0.3, 0.005]} /></mesh>
          {/* Diagonal crosses */}
          <mesh material={stoneDark} position={[0, 0, 0.02]} rotation={[0, 0, 0.785]}>
            <boxGeometry args={[0.25, 0.025, 0.005]} />
          </mesh>
          <mesh material={stoneDark} position={[0, 0, 0.02]} rotation={[0, 0, -0.785]}>
            <boxGeometry args={[0.25, 0.025, 0.005]} />
          </mesh>
        </group>
      ))}

      {/* === STONE PILLARS — gray like reference (NOT red lacquer) === */}
      {[-3.1, 3.1].map((x, i) => (
        <group key={`sp-${i}`} position={[x, 1.5, 0.5]}>
          <mesh material={stoneGray}><boxGeometry args={[0.4, 3, 0.6]} /></mesh>
          {/* Capital */}
          <mesh position={[0, 1.55, 0]} material={stoneBase}>
            <boxGeometry args={[0.5, 0.1, 0.7]} />
          </mesh>
          {/* Base */}
          <mesh position={[0, -1.55, 0]} material={stoneDark}>
            <boxGeometry args={[0.5, 0.1, 0.7]} />
          </mesh>
        </group>
      ))}

      {/* === HOÀNH PHI — red/gold sign board above wall === */}
      <mesh position={[0, 2.5, 0.92]} material={redPanel}>
        <boxGeometry args={[5.6, 0.6, 0.08]} />
      </mesh>
      {/* Gold frame around hoành phi */}
      <mesh position={[0, 2.81, 0.96]} material={gold}><boxGeometry args={[5.7, 0.05, 0.025]} /></mesh>
      <mesh position={[0, 2.19, 0.96]} material={gold}><boxGeometry args={[5.7, 0.05, 0.025]} /></mesh>
      {[-2.85, 2.85].map((x, i) => (
        <mesh key={`hpv-${i}`} position={[x, 2.5, 0.96]} material={gold}>
          <boxGeometry args={[0.05, 0.65, 0.025]} />
        </mesh>
      ))}
      {/* Gold text/ornament blocks inside */}
      {[-1.8, -0.6, 0.6, 1.8].map((x, i) => (
        <mesh key={`hptxt-${i}`} position={[x, 2.5, 0.97]} material={gold}>
          <boxGeometry args={[0.8, 0.3, 0.015]} />
        </mesh>
      ))}

      {/* ===== LOWER ROOF — wide, curved upward at edges ===== */}
      {/* Main roof slab */}
      <mesh position={[0, 3.1, 0.2]} material={roofRidge}>
        <boxGeometry args={[7.5, 0.12, 2.8]} />
      </mesh>
      {/* Front slope — terracotta tiles */}
      <mesh position={[0, 3.25, 1.35]} rotation={[0.32, 0, 0]} material={roofTileMat}>
        <boxGeometry args={[8, 0.08, 2.4]} />
      </mesh>
      {/* Tile rows on front slope */}
      {Array.from({ length: 10 }).map((_, r) => (
        <mesh key={`ftile-${r}`} position={[0, 3.2 + r * 0.035, 1.6 - r * 0.2]}
          rotation={[0.32, 0, 0]} material={roofTileMat}>
          <boxGeometry args={[8.2, 0.02, 0.18]} />
        </mesh>
      ))}
      {/* Back slope */}
      <mesh position={[0, 3.25, -0.9]} rotation={[-0.32, 0, 0]} material={roofTileMat}>
        <boxGeometry args={[8, 0.08, 2]} />
      </mesh>
      {/* Roof edge — curved upward at left/right corners (đao mái cong) */}
      {[-1, 1].map((side) => (
        <group key={`rcurve-${side}`}>
          {/* Progressive upward curve — 5 segments */}
          {[0, 1, 2, 3, 4].map((seg) => {
            const xOff = side * (3.6 + seg * 0.35)
            const yOff = seg * seg * 0.04
            const rotZ = side * seg * 0.06
            return (
              <mesh key={`rc-${seg}`} position={[xOff, 3.15 + yOff, 1.6 - seg * 0.1]}
                rotation={[0.32 - seg * 0.03, 0, rotZ]} material={roofTileMat}>
                <boxGeometry args={[0.5, 0.06, 1.8 - seg * 0.2]} />
              </mesh>
            )
          })}
        </group>
      ))}
      {/* Gold ridge beam on lower roof */}
      <mesh position={[0, 3.55, 0.2]} material={gold}>
        <boxGeometry args={[8, 0.1, 0.1]} />
      </mesh>
      {/* Ridge ornament — gold ball */}
      <mesh position={[0, 3.65, 0.2]} material={gold}>
        <sphereGeometry args={[0.1, 32, 24]} />
      </mesh>
      {/* Gold eave trim along front edge */}
      <mesh position={[0, 3.05, 2.35]} rotation={[0.32, 0, 0]} material={gold}>
        <boxGeometry args={[8.5, 0.06, 0.08]} />
      </mesh>

      {/* ===== UPPER LEVEL — red wall between two roofs ===== */}
      <mesh position={[0, 3.9, 0.1]} material={redPanel}>
        <boxGeometry args={[3.8, 0.6, 0.7]} />
      </mesh>
      {/* Gold trim on upper wall */}
      <mesh position={[0, 4.21, 0.46]} material={gold}><boxGeometry args={[3.9, 0.04, 0.02]} /></mesh>
      <mesh position={[0, 3.59, 0.46]} material={gold}><boxGeometry args={[3.9, 0.04, 0.02]} /></mesh>
      {/* Red panel detail */}
      <mesh position={[0, 3.9, 0.47]} material={redPanelDark}>
        <boxGeometry args={[3.6, 0.4, 0.02]} />
      </mesh>
      {/* Gold decorative squares */}
      {[-1.2, 0, 1.2].map((x, i) => (
        <mesh key={`usq-${i}`} position={[x, 3.9, 0.49]} material={gold}>
          <boxGeometry args={[0.2, 0.2, 0.01]} />
        </mesh>
      ))}

      {/* ===== UPPER ROOF — smaller, also curved ===== */}
      <mesh position={[0, 4.55, 0.1]} material={roofRidge}>
        <boxGeometry args={[4.5, 0.1, 1.8]} />
      </mesh>
      <mesh position={[0, 4.7, 0.7]} rotation={[0.38, 0, 0]} material={roofTileMat}>
        <boxGeometry args={[5, 0.07, 1.2]} />
      </mesh>
      {Array.from({ length: 6 }).map((_, r) => (
        <mesh key={`utile-${r}`} position={[0, 4.65 + r * 0.03, 0.85 - r * 0.18]}
          rotation={[0.38, 0, 0]} material={roofTileMat}>
          <boxGeometry args={[5.1, 0.018, 0.15]} />
        </mesh>
      ))}
      <mesh position={[0, 4.7, -0.5]} rotation={[-0.38, 0, 0]} material={roofTileMat}>
        <boxGeometry args={[5, 0.07, 1.2]} />
      </mesh>
      {/* Curved edge on upper roof */}
      {[-1, 1].map((side) => (
        <group key={`urcurve-${side}`}>
          {[0, 1, 2, 3].map((seg) => (
            <mesh key={`urc-${seg}`}
              position={[side * (2.2 + seg * 0.35), 4.6 + seg * seg * 0.035, 0.85 - seg * 0.1]}
              rotation={[0.38 - seg * 0.04, 0, side * seg * 0.07]} material={roofTileMat}>
              <boxGeometry args={[0.45, 0.05, 1.1 - seg * 0.15]} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Gold upper ridge */}
      <mesh position={[0, 4.95, 0.1]} material={gold}>
        <boxGeometry args={[5.2, 0.08, 0.08]} />
      </mesh>
      <mesh position={[0, 5.05, 0.1]} material={gold}>
        <sphereGeometry args={[0.1, 32, 24]} />
      </mesh>
      {/* Gold eave trim */}
      <mesh position={[0, 4.5, 1.2]} rotation={[0.38, 0, 0]} material={gold}>
        <boxGeometry args={[5.3, 0.05, 0.06]} />
      </mesh>

      {/* ===== ĐAO MÁI — Dragon heads at roof corner tips ===== */}
      {([
        [-4.5, 3.3, 1.8, .32, 0, -.35], [4.5, 3.3, 1.8, .32, 0, .35],
        [-4.5, 3.3, -1.2, -.32, 0, -.35], [4.5, 3.3, -1.2, -.32, 0, .35],
        [-2.8, 4.75, 0.9, .38, 0, -.28], [2.8, 4.75, 0.9, .38, 0, .28],
        [-2.8, 4.75, -0.5, -.38, 0, -.28], [2.8, 4.75, -0.5, -.38, 0, .28],
      ] as [number,number,number,number,number,number][]).map(([x,y,z,rx,ry,rz], i) => {
        const dir = i % 2 === 0 ? -1 : 1
        return (
          <group key={`dm${i}`} position={[x,y,z]} rotation={[rx,ry,rz]}>
            {/* Curved extension arm */}
            <mesh material={roofRidge}><boxGeometry args={[1.4, 0.08, 0.1]} /></mesh>
            {/* Dragon head — sphere + snout + horns */}
            <mesh position={[dir * 0.8, 0.15, 0]} material={gold}>
              <sphereGeometry args={[0.12, 32, 24]} />
            </mesh>
            {/* Snout */}
            <mesh position={[dir * 0.95, 0.18, 0]} rotation={[0, 0, dir * -0.3]} material={gold}>
              <boxGeometry args={[0.15, 0.06, 0.06]} />
            </mesh>
            {/* Horn/crest */}
            <mesh position={[dir * 0.75, 0.3, 0]} rotation={[0, 0, dir * 0.4]} material={gold}>
              <boxGeometry args={[0.08, 0.15, 0.04]} />
            </mesh>
            {/* Jaw */}
            <mesh position={[dir * 0.88, 0.08, 0]} material={gold}>
              <boxGeometry args={[0.12, 0.04, 0.05]} />
            </mesh>
          </group>
        )
      })}

      {/* ===== CỜ — flag on left side ===== */}
      <group position={[-3.5, 4.8, 0.6]} rotation={[0.1, 0.3, -0.1]}>
        <mesh position={[0, 0.3, 0]} material={wood}>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 32]} />
        </mesh>
        {/* Layered flag — red/green/gold stripes */}
        <mesh position={[0.25, 0.5, 0]} material={redPanel}>
          <boxGeometry args={[0.6, 0.5, 0.015]} />
        </mesh>
        <mesh position={[0.25, 0.48, 0.01]} material={greenFringe}>
          <boxGeometry args={[0.4, 0.12, 0.01]} />
        </mesh>
        <mesh position={[0.25, 0.38, 0.01]} material={gold}>
          <boxGeometry args={[0.35, 0.1, 0.008]} />
        </mesh>
      </group>

      {/* ===== SIDE BALUSTRADES — stone railings extending forward ===== */}
      {[-3.3, 3.3].map((x, i) => (
        <group key={`balustrade-${i}`} position={[x, 0.4, 2.5]}>
          {/* Top rail */}
          <mesh material={stoneBase}><boxGeometry args={[0.12, 0.06, 3]} /></mesh>
          {/* Bottom rail */}
          <mesh position={[0, -0.4, 0]} material={stoneBase}><boxGeometry args={[0.1, 0.05, 3]} /></mesh>
          {/* Vertical balusters */}
          {Array.from({ length: 10 }).map((_, bi) => (
            <mesh key={`blst-${bi}`} position={[0, -0.2, -1.3 + bi * 0.29]} material={stoneGray}>
              <boxGeometry args={[0.04, 0.35, 0.06]} />
            </mesh>
          ))}
          {/* End post */}
          <mesh position={[0, -0.1, 1.5]} material={stoneDark}>
            <boxGeometry args={[0.12, 0.5, 0.12]} />
          </mesh>
          {/* Dragon/ornament on post top */}
          <mesh position={[0, 0.18, 1.5]} material={stoneGray}>
            <sphereGeometry args={[0.08, 32, 24]} />
          </mesh>
        </group>
      ))}

      </group>
      {/* ===== SIDE PLATFORMS (wings) — beside the water pool ===== */}
      {[-1, 1].map((side) => (
        <group key={`wing-${side}`} position={[side * 5.2, -0.5, 5.3]}>
          {/* Platform base */}
          <mesh position={[0, 0.6, 0]} material={salmon}>
            <boxGeometry args={[1.5, 1.2, 4.5]} />
          </mesh>
          {/* Top surface */}
          <mesh position={[0, 1.22, 0]} material={salmonDark}>
            <boxGeometry args={[1.6, 0.04, 4.6]} />
          </mesh>
          {/* Front face panel — Vietnamese decorative motifs */}
          <mesh position={[0, 0.6, 2.28]} material={salmon}>
            <boxGeometry args={[1.4, 1, 0.04]} />
          </mesh>
          {/* Red center panel with gold dragon border */}
          <mesh position={[0, 0.6, 2.31]} material={redPanel}>
            <boxGeometry args={[0.9, 0.7, 0.02]} />
          </mesh>
          {/* Gold border frame around red panel */}
          <mesh position={[0, 0.96, 2.32]} material={gold}>
            <boxGeometry args={[0.95, 0.03, 0.015]} />
          </mesh>
          <mesh position={[0, 0.24, 2.32]} material={gold}>
            <boxGeometry args={[0.95, 0.03, 0.015]} />
          </mesh>
          <mesh position={[-0.46, 0.6, 2.32]} material={gold}>
            <boxGeometry args={[0.03, 0.7, 0.015]} />
          </mesh>
          <mesh position={[0.46, 0.6, 2.32]} material={gold}>
            <boxGeometry args={[0.03, 0.7, 0.015]} />
          </mesh>
          {/* Hoa văn chữ Thọ / 壽 pattern — concentric gold squares */}
          <mesh position={[0, 0.6, 2.33]} material={gold}>
            <boxGeometry args={[0.4, 0.4, 0.01]} />
          </mesh>
          <mesh position={[0, 0.6, 2.335]} material={redPanel}>
            <boxGeometry args={[0.3, 0.3, 0.008]} />
          </mesh>
          <mesh position={[0, 0.6, 2.34]} material={gold}>
            <boxGeometry args={[0.18, 0.18, 0.006]} />
          </mesh>
          {/* Corner dragon scrollwork — gold swirls at 4 corners */}
          {[[-0.32, 0.82], [0.32, 0.82], [-0.32, 0.38], [0.32, 0.38]].map(([cx, cy], ci) => (
            <group key={`scroll-${ci}`} position={[cx, cy, 2.33]}>
              <mesh material={gold}><boxGeometry args={[0.12, 0.02, 0.008]} /></mesh>
              <mesh material={gold}><boxGeometry args={[0.02, 0.12, 0.008]} /></mesh>
              <mesh position={[ci < 2 ? 0.04 : -0.04, ci % 2 === 0 ? -0.04 : 0.04, 0]} material={gold}>
                <sphereGeometry args={[0.025, 32, 24]} />
              </mesh>
            </group>
          ))}
          {/* Side decorative panels — lotus petal motifs */}
          {[-0.6, 0.6].map((px, pi) => (
            <group key={`lotus-${pi}`} position={[px, 0.6, 2.32]}>
              {/* Lotus petal shape — layered ovals */}
              <mesh material={gold}><sphereGeometry args={[0.08, 32, 24]} /></mesh>
              <mesh position={[0, 0.08, 0]} material={goldDim} rotation={[0, 0, 0.3]}>
                <boxGeometry args={[0.06, 0.06, 0.008]} />
              </mesh>
              <mesh position={[0, -0.08, 0]} material={goldDim} rotation={[0, 0, -0.3]}>
                <boxGeometry args={[0.06, 0.06, 0.008]} />
              </mesh>
            </group>
          ))}

          {/* Inner face panels (facing water) — salmon with red/gold motifs */}
          <mesh position={[side * -0.76, 0.6, 0]} material={salmon}>
            <boxGeometry args={[0.04, 1, 4.4]} />
          </mesh>
          {/* Red panels with gold trim along inner wall */}
          {[-1.5, -0.5, 0.5, 1.5].map((lz, li) => (
            <group key={`inner-motif-${li}`} position={[side * -0.78, 0.6, lz]}>
              <mesh material={redPanel}><boxGeometry args={[0.02, 0.6, 0.5]} /></mesh>
              <mesh position={[0, 0.32, 0]} material={gold}><boxGeometry args={[0.015, 0.02, 0.55]} /></mesh>
              <mesh position={[0, -0.32, 0]} material={gold}><boxGeometry args={[0.015, 0.02, 0.55]} /></mesh>
              {/* Small gold diamond/hoa văn */}
              <mesh material={gold} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[0.06, 0.06, 0.015]} /></mesh>
            </group>
          ))}

          {/* Gold trim on top edges */}
          <mesh position={[0, 1.24, 2.3]} material={goldDim}>
            <boxGeometry args={[1.6, 0.04, 0.04]} />
          </mesh>
          <mesh position={[side * -0.77, 1.24, 0]} material={goldDim}>
            <boxGeometry args={[0.04, 0.04, 4.6]} />
          </mesh>

          {/* Railing — inner side (facing water) — dark wood balustrade */}
          {/* Top rail */}
          <mesh position={[side * -0.77, 1.65, 0]} material={wood}>
            <boxGeometry args={[0.06, 0.05, 4.5]} />
          </mesh>
          {/* Bottom rail */}
          <mesh position={[side * -0.77, 1.28, 0]} material={wood}>
            <boxGeometry args={[0.05, 0.04, 4.5]} />
          </mesh>
          {/* Vertical balusters */}
          {Array.from({ length: 28 }).map((_, bi) => (
            <mesh key={`bal-${bi}`} position={[side * -0.77, 1.46, -2.1 + bi * 0.16]} material={wood}>
              <boxGeometry args={[0.02, 0.32, 0.025]} />
            </mesh>
          ))}
          {/* Corner posts */}
          {[-2.2, 2.2].map((rz, ri) => (
            <mesh key={`cpost-${ri}`} position={[side * -0.77, 1.46, rz]} material={wood}>
              <boxGeometry args={[0.05, 0.42, 0.05]} />
            </mesh>
          ))}

          {/* Railing — front face (facing audience) */}
          <mesh position={[0, 1.65, 2.28]} material={wood}>
            <boxGeometry args={[1.55, 0.05, 0.06]} />
          </mesh>
          <mesh position={[0, 1.28, 2.28]} material={wood}>
            <boxGeometry args={[1.5, 0.04, 0.05]} />
          </mesh>
          {Array.from({ length: 10 }).map((_, bi) => (
            <mesh key={`fbal-${bi}`} position={[-0.65 + bi * 0.145, 1.46, 2.28]} material={wood}>
              <boxGeometry args={[0.025, 0.32, 0.02]} />
            </mesh>
          ))}
          {[-0.72, 0.72].map((rx, ri) => (
            <mesh key={`fcpost-${ri}`} position={[rx, 1.46, 2.28]} material={wood}>
              <boxGeometry args={[0.05, 0.42, 0.05]} />
            </mesh>
          ))}

          {/* Musicians on platform — 4 per side, styled like traditional illustration */}
          {side === -1 ? (
            <group position={[0, 1.25, 0]} scale={1.5}>
              {/* 1. Nam — đàn nguyệt (standing, holding lute up) */}
              <group position={[0, 0, -1.3]}>
                <MusicianV2 pose="standing" gender="male" facingAngle={Math.PI / 2}
                  tunicColor="#1a1a28" pantsColor="#1a1a28" headwear="khan" />
                {/* Đàn nguyệt — moon lute */}
                <group position={[0.12, 0.35, 0.06]} rotation={[0, 0, 0.6]}>
                  <mesh><cylinderGeometry args={[0.1, 0.1, 0.035, 24]} />
                    <meshStandardMaterial color="#8a5a28" roughness={0.45} emissive="#5a3818" emissiveIntensity={0.15} /></mesh>
                  <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.085, 0.085, 0.02, 24]} />
                    <meshStandardMaterial color="#d4a840" roughness={0.35} metalness={0.3} /></mesh>
                  <mesh position={[0, 0.28, 0]}><boxGeometry args={[0.04, 0.38, 0.02]} />
                    <meshStandardMaterial color="#5a3018" roughness={0.5} /></mesh>
                  <mesh position={[0, 0.5, 0]}><boxGeometry args={[0.06, 0.06, 0.02]} />
                    <meshStandardMaterial color="#4a2810" roughness={0.5} /></mesh>
                  {/* Tuning pegs */}
                  {[-0.03, 0.03].map((x, i) => (
                    <mesh key={`peg-${i}`} position={[x, 0.48, 0.015]}><boxGeometry args={[0.008, 0.04, 0.008]} />
                      <meshStandardMaterial color="#3a2010" roughness={0.6} /></mesh>
                  ))}
                  {/* Strings */}
                  {[-0.008, 0.008].map((x, i) => (
                    <mesh key={`str-${i}`} position={[x, 0.16, 0.02]}><boxGeometry args={[0.002, 0.5, 0.002]} />
                      <meshStandardMaterial color="#c8c8c8" roughness={0.3} metalness={0.7} /></mesh>
                  ))}
                </group>
              </group>
              {/* 2. Nam — đàn nhị (sitting) */}
              <group position={[0, 0, -0.4]}>
                <MusicianV2 pose="sitting" gender="male" facingAngle={Math.PI / 2}
                  tunicColor="#1a1a28" pantsColor="#1a1a28" headwear="khan" />
                {/* Đàn nhị — two-string fiddle */}
                <group position={[0.15, 0.08, 0]}>
                  <mesh><cylinderGeometry args={[0.05, 0.04, 0.1, 12]} />
                    <meshStandardMaterial color="#6a3a18" roughness={0.5} emissive="#4a2810" emissiveIntensity={0.12} /></mesh>
                  <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.012, 0.012, 0.52, 32]} />
                    <meshStandardMaterial color="#5a3018" roughness={0.5} /></mesh>
                  <mesh position={[0, 0.58, 0]}><sphereGeometry args={[0.025, 32, 24]} />
                    <meshStandardMaterial color="#4a2810" roughness={0.5} /></mesh>
                  {/* Bow */}
                  <mesh position={[0.08, 0.2, 0]} rotation={[0, 0, 0.2]}><cylinderGeometry args={[0.003, 0.003, 0.4, 6]} />
                    <meshStandardMaterial color="#5a3818" roughness={0.5} /></mesh>
                </group>
              </group>
              {/* 3. Nữ — sáo trúc (standing, with bag) */}
              <group position={[0, 0, 0.3]}>
                <MusicianV2 pose="standing" gender="female" facingAngle={Math.PI / 2}
                  tunicColor="#e8e0d8" pantsColor="#1a1a28" headwear="bun" />
                {/* Sáo trúc — bamboo flute */}
                <mesh position={[0.18, 0.42, 0.06]} rotation={[0, Math.PI / 2, 0.15]}>
                  <cylinderGeometry args={[0.012, 0.012, 0.35, 32]} />
                  <meshStandardMaterial color="#b8a050" roughness={0.4} emissive="#887830" emissiveIntensity={0.15} />
                </mesh>
                {/* Small shoulder bag */}
                <group position={[0.04, 0.12, 0.04]}>
                  <mesh><boxGeometry args={[0.08, 0.07, 0.04]} />
                    <meshStandardMaterial color="#8a6838" roughness={0.55} emissive="#5a4820" emissiveIntensity={0.1} /></mesh>
                  <mesh position={[0, 0.04, 0]}><boxGeometry args={[0.09, 0.015, 0.045]} />
                    <meshStandardMaterial color="#6a5028" roughness={0.5} /></mesh>
                  {/* Bag strap */}
                  <mesh position={[-0.02, 0.18, -0.01]} rotation={[0, 0, -0.3]}><boxGeometry args={[0.015, 0.25, 0.005]} />
                    <meshStandardMaterial color="#6a5028" roughness={0.5} /></mesh>
                </group>
              </group>
              {/* 4. Nam — ca sĩ/chỉ huy (standing, singing) */}
              <group position={[0, 0, 1]}>
                <MusicianV2 pose="standing" gender="male" facingAngle={Math.PI / 2}
                  tunicColor="#1a2a3a" pantsColor="#1a1a28" headwear="none" armsOut />
              </group>
            </group>
          ) : (
            <group position={[0, 1.25, 0]} scale={1.5}>
              {/* 1. Nữ — ca sĩ (standing, singing) */}
              <group position={[0, 0, -1.3]}>
                <MusicianV2 pose="standing" gender="female" facingAngle={-Math.PI / 2}
                  tunicColor="#1a1a28" pantsColor="#1a1a28" headwear="bun" armsOut />
              </group>
              {/* 2. Nam — trống (standing, with drum on tripod) */}
              <group position={[0, 0, -0.4]}>
                <MusicianV2 pose="standing" gender="male" facingAngle={-Math.PI / 2}
                  tunicColor="#1a1a28" pantsColor="#1a1a28" headwear="khan" />
                {/* Trống — drum on tripod stand */}
                <group position={[-0.2, 0.08, 0]}>
                  <mesh><cylinderGeometry args={[0.07, 0.06, 0.1, 32]} />
                    <meshStandardMaterial color="#5a2a10" roughness={0.5} emissive="#3a1808" emissiveIntensity={0.12} /></mesh>
                  {/* Drum head */}
                  <mesh position={[0, 0.052, 0]}><cylinderGeometry args={[0.072, 0.072, 0.008, 32]} />
                    <meshStandardMaterial color="#d8c898" roughness={0.6} /></mesh>
                  {/* Gold rim */}
                  <mesh position={[0, 0.048, 0]}><cylinderGeometry args={[0.075, 0.075, 0.006, 32]} />
                    <meshStandardMaterial color="#c8a040" roughness={0.3} metalness={0.5} /></mesh>
                  {/* Tripod legs */}
                  {[0, 2.1, 4.2].map((a, i) => (
                    <mesh key={`tleg-${i}`} position={[Math.sin(a) * 0.04, -0.12, Math.cos(a) * 0.04]}
                      rotation={[Math.cos(a) * 0.25, 0, -Math.sin(a) * 0.25]}>
                      <cylinderGeometry args={[0.008, 0.008, 0.2, 6]} />
                      <meshStandardMaterial color="#3a2010" roughness={0.6} />
                    </mesh>
                  ))}
                </group>
                {/* Drum sticks in hands */}
                <mesh position={[-0.16, 0.28, 0.06]} rotation={[0.5, 0, -0.3]}>
                  <cylinderGeometry args={[0.005, 0.005, 0.18, 6]} />
                  <meshStandardMaterial color="#5a3818" roughness={0.5} />
                </mesh>
              </group>
              {/* 3. Nam — đàn tỳ bà (standing, holding up) */}
              <group position={[0, 0, 0.3]}>
                <MusicianV2 pose="standing" gender="male" facingAngle={-Math.PI / 2}
                  tunicColor="#1a1a28" pantsColor="#1a1a28" headwear="khan" />
                {/* Đàn tỳ bà — pipa lute */}
                <group position={[-0.14, 0.3, 0.05]} rotation={[0, 0, -0.4]}>
                  <mesh scale={[1, 1.3, 0.3]}><sphereGeometry args={[0.1, 32, 24]} />
                    <meshStandardMaterial color="#b07830" roughness={0.4} emissive="#805020" emissiveIntensity={0.15} /></mesh>
                  <mesh position={[0, 0.22, 0]}><boxGeometry args={[0.04, 0.22, 0.02]} />
                    <meshStandardMaterial color="#6a4020" roughness={0.5} /></mesh>
                  <mesh position={[0, 0.35, 0]}><boxGeometry args={[0.05, 0.05, 0.015]} />
                    <meshStandardMaterial color="#4a2810" roughness={0.5} /></mesh>
                  {[-0.01, 0.01].map((x, i) => (
                    <mesh key={`pstr-${i}`} position={[x, 0.1, 0.018]}><boxGeometry args={[0.002, 0.4, 0.002]} />
                      <meshStandardMaterial color="#c8c8c8" roughness={0.3} metalness={0.7} /></mesh>
                  ))}
                </group>
              </group>
              {/* 4. Nữ — khăn hồng, cầm dải lụa */}
              <group position={[0, 0, 1]}>
                <MusicianV2 pose="standing" gender="female" facingAngle={-Math.PI / 2}
                  tunicColor="#1a1a28" pantsColor="#1a1a28" headwear="pink-wrap" />
                {/* Pink silk ribbon */}
                <mesh position={[-0.22, 0.3, 0.04]} rotation={[0.2, 0, -0.5]}>
                  <boxGeometry args={[0.04, 0.3, 0.008]} />
                  <meshStandardMaterial color="#e8889a" roughness={0.5} emissive="#c06878" emissiveIntensity={0.15} side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[-0.28, 0.18, 0.06]} rotation={[0.3, 0.2, -0.8]}>
                  <boxGeometry args={[0.035, 0.2, 0.006]} />
                  <meshStandardMaterial color="#e898a8" roughness={0.5} emissive="#c07888" emissiveIntensity={0.12} side={THREE.DoubleSide} />
                </mesh>
              </group>
            </group>
          )}
        </group>
      ))}


      {/* ===== PALM TREE (right side, between stage and water) ===== */}
      <group position={[3.0, 0, 3.5]}>
        {/* Trunk — green bamboo-like */}
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.04, 0.06, 3, 12]} />
          <meshStandardMaterial color="#2a8830" roughness={0.5} emissive="#1a5818" emissiveIntensity={0.15} />
        </mesh>
        {/* Trunk segments */}
        {[0.5, 1.0, 1.5, 2.0].map((y, i) => (
          <mesh key={`seg-${i}`} position={[0, y, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.03, 12]} />
            <meshStandardMaterial color="#1a6820" roughness={0.5} emissive="#0a4810" emissiveIntensity={0.1} />
          </mesh>
        ))}
        {/* Palm fronds */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          return (
            <mesh key={`frond-${i}`}
              position={[Math.sin(rad) * 0.25, 2.9, Math.cos(rad) * 0.25]}
              rotation={[Math.cos(rad) * 0.8, 0, Math.sin(rad) * 0.8]}>
              <boxGeometry args={[0.08, 0.02, 0.6]} />
              <meshStandardMaterial color="#2a8830" roughness={0.5} emissive="#1a6820" emissiveIntensity={0.2} />
            </mesh>
          )
        })}
        {/* Smaller fronds */}
        {[30, 90, 150, 210, 270, 330].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          return (
            <mesh key={`frond2-${i}`}
              position={[Math.sin(rad) * 0.2, 2.95, Math.cos(rad) * 0.2]}
              rotation={[Math.cos(rad) * 0.6, 0, Math.sin(rad) * 0.6]}>
              <boxGeometry args={[0.06, 0.015, 0.45]} />
              <meshStandardMaterial color="#38a840" roughness={0.5} emissive="#208828" emissiveIntensity={0.15} />
            </mesh>
          )
        })}
      </group>

      {/* ===== FLAG (upper left) — red/green/yellow ===== */}
      <group position={[-3.2, 4.8, 0.8]} rotation={[0.1, 0.3, -0.1]}>
        {/* Flag pole */}
        <mesh position={[0, 0.4, 0]} material={wood}>
          <cylinderGeometry args={[0.02, 0.02, 1, 12]} />
        </mesh>
        {/* Flag fabric — layered colored strips */}
        <mesh position={[0.3, 0.5, 0]} material={flagRed}>
          <boxGeometry args={[0.7, 0.55, 0.015]} />
        </mesh>
        <mesh position={[0.3, 0.5, 0.02]} material={flagGreen}>
          <boxGeometry args={[0.5, 0.38, 0.01]} />
        </mesh>
        <mesh position={[0.3, 0.5, 0.035]} material={flagYellow}>
          <boxGeometry args={[0.3, 0.2, 0.008]} />
        </mesh>
      </group>




      {/* ===== SIDE WALLS with 壽 (thọ) lattice panels ===== */}
      {[-3.2, 3.2].map((x, i) => (
        <group key={`sw-${i}`} position={[x, 1.5, 0.3]}>
          <mesh material={stoneGray}>
            <boxGeometry args={[0.6, 2.8, 1.8]} />
          </mesh>
          <mesh position={[0, 0.2, 0.92]} material={stoneBase}>
            <boxGeometry args={[0.5, 1.8, 0.04]} />
          </mesh>
          <mesh position={[0, 0.2, 0.95]} material={goldDim}>
            <boxGeometry args={[0.55, 1.9, 0.02]} />
          </mesh>
          {[-0.15, 0, 0.15].map((lx, li) => (
            <mesh key={`tv-${li}`} position={[lx, 0.2, 0.97]} material={stoneGray}>
              <boxGeometry args={[0.025, 1.5, 0.01]} />
            </mesh>
          ))}
          {[-0.5, -0.15, 0.2, 0.55].map((ly, li) => (
            <mesh key={`th-${li}`} position={[0, ly, 0.97]} material={stoneGray}>
              <boxGeometry args={[0.4, 0.025, 0.01]} />
            </mesh>
          ))}
          <mesh position={[0, 0.5, 0.97]} material={stoneGray}>
            <boxGeometry args={[0.25, 0.25, 0.01]} />
          </mesh>
          <mesh position={[0, -0.1, 0.97]} material={stoneGray}>
            <boxGeometry args={[0.25, 0.25, 0.01]} />
          </mesh>
        </group>
      ))}




    </group>
  )
}

function mat(color: string, roughness: number, emissive: string, emissiveIntensity: number, metalness = 0.05) {
  // Handle potentially malformed hex gracefully
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, emissive: emissive.length <= 7 ? emissive : color, emissiveIntensity })
}

function LatticePanel({ position, lattice, frame }: { position: [number, number, number]; lattice: THREE.Material; frame: THREE.Material }) {
  return (
    <group position={position}>
      <mesh material={frame}><boxGeometry args={[0.9, 1.5, 0.025]} /></mesh>
      {[-0.4, -0.15, 0.1, 0.35].map((y, i) => (
        <mesh key={`h${i}`} position={[0, y, 0.015]} material={lattice}><boxGeometry args={[0.75, 0.025, 0.01]} /></mesh>
      ))}
      {[-0.25, 0, 0.25].map((x, i) => (
        <mesh key={`v${i}`} position={[x, 0, 0.015]} material={lattice}><boxGeometry args={[0.025, 1.3, 0.01]} /></mesh>
      ))}
    </group>
  )
}

function WingFringeSide({ x, z, greenFringe }: { x: number; z: number; greenFringe: THREE.Material }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.5 + z * 5) * 0.04
  })
  return (
    <mesh ref={ref} position={[x, -0.15, z]} material={greenFringe}>
      <boxGeometry args={[0.01, 0.22, 0.015]} />
    </mesh>
  )
}

function WingFringe({ x, z, greenFringe }: { x: number; z: number; greenFringe: THREE.Material }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5 + x * 5) * 0.04
  })
  return (
    <mesh ref={ref} position={[x, -0.15, z]} material={greenFringe}>
      <boxGeometry args={[0.015, 0.22, 0.01]} />
    </mesh>
  )
}

/** Musician figure — traditional Vietnamese illustration style with cute round face */
function MusicianV2({ pose, gender, facingAngle, tunicColor, pantsColor, headwear, armsOut }: {
  pose: 'standing' | 'sitting'
  gender: 'male' | 'female'
  facingAngle: number
  tunicColor: string
  pantsColor: string
  headwear: 'khan' | 'bun' | 'pink-wrap' | 'none'
  armsOut?: boolean
}) {
  const isFemale = gender === 'female'
  const isStanding = pose === 'standing'
  const skinColor = '#ecd8b8'
  const hairColor = '#1a1018'
  const groupRef = useRef<THREE.Group>(null)
  const seed = useMemo(() => Math.random() * 100, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime() + seed
    // Body sway — playing music, 2x speed
    groupRef.current.rotation.y = facingAngle + Math.sin(t * 1.6) * 0.1
    groupRef.current.rotation.z = Math.sin(t * 2.4 + 1) * 0.05
    // Head bob — 2x speed
    if (groupRef.current.children[0]) {
      groupRef.current.children[0].position.y = (isStanding ? 0.54 : 0.52) + Math.sin(t * 3) * 0.015
    }
  })

  return (
    <group ref={groupRef} rotation={[0, facingAngle, 0]}>
      {/* === HEAD — round cute face with closed happy eyes === */}
      <mesh position={[0, isStanding ? 0.54 : 0.52, 0]}>
        <sphereGeometry args={[0.075, 32, 24]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} emissive="#c8b090" emissiveIntensity={0.1} />
      </mesh>
      {/* Hair back shell */}
      <mesh position={[0, isStanding ? 0.56 : 0.54, -0.02]}>
        <sphereGeometry args={[0.078, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
        <meshStandardMaterial color={hairColor} roughness={0.7} />
      </mesh>
      {/* Bangs/fringe */}
      <mesh position={[0, isStanding ? 0.59 : 0.57, 0.04]}>
        <boxGeometry args={[0.12, 0.025, 0.04]} />
        <meshStandardMaterial color={hairColor} roughness={0.7} />
      </mesh>
      {/* Closed happy eyes — curved lines ^_^ */}
      {[-0.025, 0.025].map((x, i) => (
        <mesh key={`eye-${i}`} position={[x, isStanding ? 0.545 : 0.525, 0.07]}>
          <boxGeometry args={[0.02, 0.006, 0.003]} />
          <meshBasicMaterial color="#2a1808" />
        </mesh>
      ))}
      {/* Rosy cheeks */}
      {[-0.04, 0.04].map((x, i) => (
        <mesh key={`ck-${i}`} position={[x, isStanding ? 0.53 : 0.51, 0.065]}>
          <sphereGeometry args={[0.012, 32, 24]} />
          <meshStandardMaterial color="#e09888" roughness={0.6} emissive="#c07868" emissiveIntensity={0.1} />
        </mesh>
      ))}
      {/* Tiny smile */}
      <mesh position={[0, isStanding ? 0.52 : 0.50, 0.072]}>
        <boxGeometry args={[0.02, 0.005, 0.003]} />
        <meshStandardMaterial color="#c06050" roughness={0.5} />
      </mesh>
      {/* Nose dot */}
      <mesh position={[0, isStanding ? 0.54 : 0.52, 0.075]}>
        <sphereGeometry args={[0.006, 32, 24]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>

      {/* === HEADWEAR === */}
      {headwear === 'khan' && (
        /* Khăn đóng — dark male turban/headpiece */
        <group position={[0, isStanding ? 0.6 : 0.58, 0]}>
          <mesh><boxGeometry args={[0.13, 0.05, 0.11]} />
            <meshStandardMaterial color="#1a1828" roughness={0.65} /></mesh>
          <mesh position={[0, 0.015, 0.02]}><boxGeometry args={[0.11, 0.035, 0.06]} />
            <meshStandardMaterial color="#222238" roughness={0.6} /></mesh>
        </group>
      )}
      {headwear === 'bun' && (
        /* Hair bun on top */
        <group position={[0, isStanding ? 0.62 : 0.6, -0.01]}>
          <mesh><sphereGeometry args={[0.04, 32, 24]} />
            <meshStandardMaterial color={hairColor} roughness={0.7} /></mesh>
          {/* Decorative hairpin */}
          <mesh position={[0.02, 0.02, 0.01]}><boxGeometry args={[0.05, 0.006, 0.006]} />
            <meshStandardMaterial color="#d4a540" roughness={0.3} metalness={0.6} /></mesh>
        </group>
      )}
      {headwear === 'pink-wrap' && (
        /* Pink headwrap/khăn */
        <group position={[0, isStanding ? 0.58 : 0.56, 0]}>
          <mesh><sphereGeometry args={[0.082, 32, 24]} />
            <meshStandardMaterial color="#e8889a" roughness={0.55} emissive="#c07080" emissiveIntensity={0.1} /></mesh>
          {/* Wrap tail hanging */}
          <mesh position={[0.04, -0.04, -0.05]} rotation={[0.3, 0, 0.3]}>
            <boxGeometry args={[0.03, 0.1, 0.015]} />
            <meshStandardMaterial color="#e898a8" roughness={0.5} /></mesh>
        </group>
      )}

      {/* === BODY === */}
      {/* Upper body / áo */}
      <mesh position={[0, isStanding ? 0.32 : 0.30, 0]}>
        <boxGeometry args={[0.17, isStanding ? 0.3 : 0.28, 0.11]} />
        <meshStandardMaterial color={tunicColor} roughness={0.6} emissive={tunicColor} emissiveIntensity={0.06} />
      </mesh>
      {/* Collar V-neck */}
      <mesh position={[0, isStanding ? 0.44 : 0.42, 0.05]}>
        <boxGeometry args={[0.06, 0.06, 0.02]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>
      {/* Belt/sash */}
      <mesh position={[0, isStanding ? 0.19 : 0.18, 0]}>
        <boxGeometry args={[0.18, 0.02, 0.12]} />
        <meshStandardMaterial color="#4a3a2a" roughness={0.5} />
      </mesh>

      {/* === LOWER BODY === */}
      {isStanding ? (
        /* Standing legs */
        <>
          <mesh position={[-0.04, 0.06, 0]}>
            <boxGeometry args={[0.07, 0.22, 0.08]} />
            <meshStandardMaterial color={pantsColor} roughness={0.65} />
          </mesh>
          <mesh position={[0.04, 0.06, 0]}>
            <boxGeometry args={[0.07, 0.22, 0.08]} />
            <meshStandardMaterial color={pantsColor} roughness={0.65} />
          </mesh>
          {/* Feet */}
          {[-0.04, 0.04].map((x, i) => (
            <mesh key={`ft-${i}`} position={[x, -0.05, 0.02]}>
              <boxGeometry args={[0.06, 0.02, 0.07]} />
              <meshStandardMaterial color="#2a2018" roughness={0.7} />
            </mesh>
          ))}
        </>
      ) : (
        /* Sitting — crossed/folded legs */
        <>
          <mesh position={[-0.04, 0.07, 0.02]}>
            <boxGeometry args={[0.07, 0.1, 0.1]} />
            <meshStandardMaterial color={pantsColor} roughness={0.7} />
          </mesh>
          <mesh position={[0.04, 0.07, 0.02]}>
            <boxGeometry args={[0.07, 0.1, 0.1]} />
            <meshStandardMaterial color={pantsColor} roughness={0.7} />
          </mesh>
          {/* Stool */}
          <mesh position={[0, -0.02, 0]}>
            <boxGeometry args={[0.18, 0.05, 0.16]} />
            <meshStandardMaterial color="#6a2020" roughness={0.6} emissive="#4a1010" emissiveIntensity={0.1} />
          </mesh>
        </>
      )}

      {/* === ARMS === */}
      {armsOut ? (
        /* Arms outstretched — singing/conducting pose */
        <>
          <mesh position={[-0.14, 0.35, 0.04]} rotation={[0.2, 0, -0.8]}>
            <capsuleGeometry args={[0.025, 0.14, 12, 24]} />
            <meshStandardMaterial color={tunicColor} roughness={0.6} emissive={tunicColor} emissiveIntensity={0.06} />
          </mesh>
          <mesh position={[0.14, 0.35, 0.04]} rotation={[0.2, 0, 0.8]}>
            <capsuleGeometry args={[0.025, 0.14, 12, 24]} />
            <meshStandardMaterial color={tunicColor} roughness={0.6} emissive={tunicColor} emissiveIntensity={0.06} />
          </mesh>
          {/* Hands */}
          <mesh position={[-0.24, 0.26, 0.06]}>
            <sphereGeometry args={[0.02, 32, 24]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
          <mesh position={[0.24, 0.26, 0.06]}>
            <sphereGeometry args={[0.02, 32, 24]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
        </>
      ) : (
        /* Normal arms — reaching toward instrument */
        <>
          <mesh position={[-0.11, 0.33, 0.04]} rotation={[0.3, 0, -0.35]}>
            <capsuleGeometry args={[0.025, 0.14, 12, 24]} />
            <meshStandardMaterial color={tunicColor} roughness={0.6} emissive={tunicColor} emissiveIntensity={0.06} />
          </mesh>
          <mesh position={[0.11, 0.33, 0.04]} rotation={[0.3, 0, 0.35]}>
            <capsuleGeometry args={[0.025, 0.14, 12, 24]} />
            <meshStandardMaterial color={tunicColor} roughness={0.6} emissive={tunicColor} emissiveIntensity={0.06} />
          </mesh>
          {/* Hands */}
          <mesh position={[-0.17, 0.24, 0.08]}>
            <sphereGeometry args={[0.02, 32, 24]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
          <mesh position={[0.17, 0.24, 0.08]}>
            <sphereGeometry args={[0.02, 32, 24]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
        </>
      )}
    </group>
  )
}

function Tassel({ x }: { x: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.7 + x * 3) * 0.05
  })
  return (
    <mesh ref={ref} position={[x, -0.38, 0]}>
      <boxGeometry args={[0.012, 0.25, 0.008]} />
      <meshStandardMaterial color="#c8a030" roughness={0.35} metalness={0.65} emissive="#7a5818" emissiveIntensity={0.3} />
    </mesh>
  )
}
