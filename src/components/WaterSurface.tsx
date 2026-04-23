import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  uniform float uTime;
  uniform vec3 uRipplePos1;
  uniform vec3 uRipplePos2;
  uniform vec3 uRipplePos3;
  uniform float uRippleStrength;
  varying vec2 vUv;
  varying float vWaveHeight;

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(dot(hash(i),f), dot(hash(i+vec2(1,0)),f-vec2(1,0)),u.x),
               mix(dot(hash(i+vec2(0,1)),f-vec2(0,1)), dot(hash(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);
  }

  // Ripple function — circular waves from puppet positions
  float ripple(vec3 pos, vec3 rippleCenter, float t) {
    float dist = length(pos.xz - rippleCenter.xz);
    float speed = 2.5;
    float wavelength = 0.8;
    float rippleWave = sin(dist * (6.28 / wavelength) - t * speed) * 0.015;
    float fade = smoothstep(3.0, 0.3, dist);
    return rippleWave * fade;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    float t = uTime;
    float w1 = sin(pos.x*0.8+t*0.3)*0.04;
    float w2 = sin(pos.z*1.2+t*0.25)*0.03;
    float w3 = sin(pos.x*2.5+pos.z*1.8+t*0.6)*0.02;
    float r = noise(pos.xz*3.0+t*0.4)*0.012;
    float d = length(pos.xz-vec2(0.0,1.0));
    float cr = sin(d*6.0-t*1.5)*0.008*smoothstep(3.0,0.5,d);

    // Puppet position ripples — water disturbance from puppet emergence
    float rip1 = ripple(pos, uRipplePos1, t);
    float rip2 = ripple(pos, uRipplePos2, t);
    float rip3 = ripple(pos, uRipplePos3, t);

    float total = w1+w2+w3+r+cr + (rip1 + rip2 + rip3) * uRippleStrength;
    pos.y += total;
    vWaveHeight = total;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vWaveHeight;

  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float noise(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }

  void main() {
    float t = uTime;
    vec2 uv = vUv;

    // Bright teal-turquoise water base — vivid & luminous
    vec3 green = vec3(0.22, 0.65, 0.62);
    vec3 greenLight = vec3(0.35, 0.78, 0.75);
    vec3 greenDark = vec3(0.12, 0.48, 0.50);

    // Gradient: lighter in center, darker at edges
    float cx = smoothstep(0.0, 0.35, uv.x) * smoothstep(1.0, 0.65, uv.x);
    float cy = smoothstep(0.0, 0.3, uv.y) * smoothstep(1.0, 0.7, uv.y);
    float center = cx * cy;

    vec3 col = mix(greenDark, green, center * 0.8);
    col = mix(col, greenLight, center * 0.4);

    // Warm golden reflection from roof (upper part)
    float roofReflect = smoothstep(0.55, 0.95, uv.y) * 0.2;
    col += vec3(0.3, 0.2, 0.08) * roofReflect;

    // Warm center glow from stage lighting — stronger
    float sd = length((uv - vec2(0.5, 0.6)) * vec2(1.0, 1.3));
    float sr = smoothstep(0.5, 0.0, sd) * 0.3;
    float distort = sin(uv.x * 12.0 + t * 0.4) * sin(uv.y * 10.0 + t * 0.3) * 0.25;
    sr *= (0.8 + distort);
    col += vec3(0.35, 0.55, 0.48) * sr;

    // Caustics — brighter teal-white shimmer
    float c1 = noise(uv * 18.0 + t * vec2(0.2, 0.15));
    float c2 = noise(uv * 12.0 - t * vec2(0.15, 0.2) + 5.0);
    float cs = smoothstep(0.15, 0.5, c1 * c2);
    col += vec3(0.25, 0.4, 0.35) * cs * center * 0.6;

    // White highlights/shimmer spots — brighter
    float sh = pow(noise(uv * 25.0 + t * vec2(0.3, -0.2)), 3.0) * 0.35 * center;
    col += vec3(0.85, 0.95, 0.9) * sh;

    // Wave crest highlights — more visible
    col += vec3(0.35, 0.55, 0.5) * smoothstep(0.0, 0.03, vWaveHeight) * 0.35;

    // Lily pad / white spots (static circles on water)
    float lp1 = smoothstep(0.025, 0.015, length(uv - vec2(0.35, 0.4)));
    float lp2 = smoothstep(0.02, 0.012, length(uv - vec2(0.6, 0.35)));
    float lp3 = smoothstep(0.018, 0.01, length(uv - vec2(0.5, 0.55)));
    col += vec3(0.6, 0.7, 0.65) * (lp1 + lp2 + lp3) * 0.4;

    float edge = smoothstep(0.0, 0.06, uv.y) * smoothstep(1.0, 0.94, uv.y) * smoothstep(0.0, 0.04, uv.x) * smoothstep(1.0, 0.96, uv.x);
    gl_FragColor = vec4(col, 0.94 * edge);
  }
`

export default function WaterSurface() {
  const ref = useRef<THREE.Mesh>(null)
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uRipplePos1: { value: new THREE.Vector3(0, -0.5, 0) },
    uRipplePos2: { value: new THREE.Vector3(1.5, -0.5, -1) },
    uRipplePos3: { value: new THREE.Vector3(-1.5, -0.5, -1) },
    uRippleStrength: { value: 0.0 },
  }), [])

  // Animate ripple strength for puppet emergence effect
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    uniforms.uTime.value = t
    // Pulse ripple strength to simulate puppet splashes
    const pulse = Math.sin(t * 3.0) * 0.3 + 0.7
    uniforms.uRippleStrength.value = pulse
    // Move ripple positions in circular patterns
    uniforms.uRipplePos1.value.set(
      Math.sin(t * 0.7) * 2.0,
      -0.5,
      Math.cos(t * 0.5) * 1.5 - 1
    )
    uniforms.uRipplePos2.value.set(
      Math.cos(t * 0.6) * 2.5,
      -0.5,
      Math.sin(t * 0.8) * 2.0 - 1
    )
    uniforms.uRipplePos3.value.set(
      Math.sin(t * 0.9 + 2) * 1.8,
      -0.5,
      Math.cos(t * 0.7 + 1) * 1.8 - 1
    )
  })

  const poolW = 8
  const poolD = 10.5
  const poolX = 0
  const poolZ = -1
  const poolY = -0.75
  const borderH = 0.15
  const borderThick = 0.12

  const darkFloor = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a1a', roughness: 0.85, emissive: '#080808', emissiveIntensity: 0.05
  }), [])
  const borderWood = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#5a4a30', roughness: 0.6, emissive: '#3a2a18', emissiveIntensity: 0.12
  }), [])
  const borderTop = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#d8b048', roughness: 0.3, emissive: '#b09038', emissiveIntensity: 0.25, metalness: 0.55
  }), [])

  return (
    <group>
      {/* Water — contained within pool */}
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[poolX, poolY, poolZ]} receiveShadow>
        <planeGeometry args={[poolW, poolD, 80, 80]} />
        <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader}
          uniforms={uniforms} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Pool border — dark wood frame */}
      {/* Front border */}
      <mesh position={[poolX, poolY + borderH / 2, poolZ + poolD / 2]} material={borderWood}>
        <boxGeometry args={[poolW + borderThick * 2, borderH, borderThick]} />
      </mesh>
      {/* Back border */}
      <mesh position={[poolX, poolY + borderH / 2, poolZ - poolD / 2]} material={borderWood}>
        <boxGeometry args={[poolW + borderThick * 2, borderH, borderThick]} />
      </mesh>
      {/* Left border */}
      <mesh position={[poolX - poolW / 2, poolY + borderH / 2, poolZ]} material={borderWood}>
        <boxGeometry args={[borderThick, borderH, poolD]} />
      </mesh>
      {/* Right border */}
      <mesh position={[poolX + poolW / 2, poolY + borderH / 2, poolZ]} material={borderWood}>
        <boxGeometry args={[borderThick, borderH, poolD]} />
      </mesh>

      {/* Gold trim on top of border */}
      <mesh position={[poolX, poolY + borderH, poolZ + poolD / 2]} material={borderTop}>
        <boxGeometry args={[poolW + 0.3, 0.03, 0.16]} />
      </mesh>
      <mesh position={[poolX, poolY + borderH, poolZ - poolD / 2]} material={borderTop}>
        <boxGeometry args={[poolW + 0.3, 0.03, 0.16]} />
      </mesh>
      <mesh position={[poolX - poolW / 2, poolY + borderH, poolZ]} material={borderTop}>
        <boxGeometry args={[0.16, 0.03, poolD + 0.3]} />
      </mesh>
      <mesh position={[poolX + poolW / 2, poolY + borderH, poolZ]} material={borderTop}>
        <boxGeometry args={[0.16, 0.03, poolD + 0.3]} />
      </mesh>

      {/* Dark floor around the pool */}
      <mesh position={[0, poolY - 0.02, 2]} rotation={[-Math.PI / 2, 0, 0]} material={darkFloor} receiveShadow>
        <planeGeometry args={[20, 16]} />
      </mesh>
    </group>
  )
}
