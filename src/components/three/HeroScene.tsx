import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { ascent } from '../../lib/ascent'

export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    )
  } catch {
    return false
  }
}

/* ── Digital mountain terrain ───────────────────────────────── */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform float uPixelRatio;

  varying float vElevation;
  varying float vDist;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float ridged(vec2 p) {
    float amp = 0.5;
    float freq = 1.0;
    float sum = 0.0;
    for (int i = 0; i < 5; i++) {
      float n = noise(p * freq);
      n = 1.0 - abs(n * 2.0 - 1.0);
      n *= n;
      sum += n * amp;
      freq *= 2.04;
      amp *= 0.46;
    }
    return sum;
  }

  void main() {
    vec3 pos = position;
    vec2 p = pos.xy * 0.32 + vec2(uTime * 0.015, uTime * 0.008);
    vec2 peakCenter = vec2(0.0, 5.5);
    float d = distance(pos.xy, peakCenter);
    float massif = 3.6 * exp(-d * d / 26.0);
    float e = ridged(p) * (0.9 + massif * 0.9) + massif;
    pos.z = e;
    vElevation = e;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
    float size = (2.4 + vElevation * 1.1) * uPixelRatio;
    gl_PointSize = size * (9.0 / vDist);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uScroll;
  varying float vElevation;
  varying float vDist;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float a = smoothstep(0.5, 0.05, length(uv));

    vec3 base   = vec3(0.075, 0.095, 0.16);
    vec3 accent = vec3(0.49, 0.705, 1.0);
    vec3 tip    = vec3(0.92, 0.95, 1.0);

    float t = smoothstep(0.0, 3.4, vElevation);
    vec3 color = mix(base, accent, t);
    color = mix(color, tip, smoothstep(2.6, 4.6, vElevation));
    color *= 0.85 + uScroll * 0.55 + t * 0.55;

    float fog = smoothstep(26.0, 7.0, vDist);
    gl_FragColor = vec4(color, a * fog * 0.9);
    if (gl_FragColor.a < 0.01) discard;
  }
`

function Terrain({ mobile }: { mobile: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const geometry = useMemo(() => {
    const seg = mobile ? 110 : 190
    return new THREE.PlaneGeometry(30, 24, seg, seg)
  }, [mobile])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    }),
    [],
  )

  useFrame((state) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime
    matRef.current.uniforms.uScroll.value = THREE.MathUtils.lerp(
      matRef.current.uniforms.uScroll.value,
      ascent.progress,
      0.08,
    )
  })

  return (
    <points geometry={geometry} rotation={[-Math.PI / 2.15, 0, 0]} position={[0, -1.4, -4]}>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ── Ascending platform slabs (inspired by apex-style climb) ── */

function Platforms({ mobile }: { mobile: boolean }) {
  const group = useRef<THREE.Group>(null)
  const count = mobile ? 7 : 12

  const slabs = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const t = i / (count - 1)
      const angle = t * Math.PI * 1.6 - 0.4
      const radius = 3.2 - t * 1.4
      return {
        position: [
          Math.cos(angle) * radius,
          -0.6 + t * 5.8,
          -3.5 + Math.sin(angle) * radius * 0.55 - t * 1.2,
        ] as [number, number, number],
        scale: [1.5 - t * 0.55, 0.12, 1.05 - t * 0.35] as [number, number, number],
        rotY: -angle + Math.PI / 2,
      }
    })
  }, [count])

  useFrame(() => {
    if (!group.current) return
    const p = ascent.progress
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, p * 0.35, 0.05)
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, -p * 1.8, 0.05)
  })

  return (
    <group ref={group}>
      {slabs.map((s, i) => (
        <mesh key={i} position={s.position} scale={s.scale} rotation={[0, s.rotY, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#14141c"
            emissive="#7db4ff"
            emissiveIntensity={0.08 + (i / count) * 0.18}
            metalness={0.7}
            roughness={0.35}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ── Camera climbs with ascent progress + pointer parallax ──── */

function Rig() {
  const { camera, pointer } = useThree()
  const look = useRef(new THREE.Vector3(0, 1.0, -6))

  useFrame(() => {
    const p = ascent.progress
    // dramatic ascent: rise + push forward toward the summit
    const tx = pointer.x * (0.55 - p * 0.15)
    const ty = 1.6 + pointer.y * 0.3 + p * 4.6
    const tz = 8.2 - p * 4.4

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, tx, 0.045)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, ty, 0.045)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, tz, 0.055)

    look.current.set(pointer.x * 0.5, 0.8 + p * 3.4, -6 + p * 1.5)
    camera.lookAt(look.current)
  })
  return null
}

export function HeroFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 65% at 50% 100%, rgba(125,180,255,0.14), transparent 60%), radial-gradient(60% 45% at 50% 85%, rgba(255,255,255,0.06), transparent 55%), linear-gradient(180deg, #060608 0%, #0a0b10 70%, #0d1018 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(transparent 0%, transparent calc(100% - 1px), rgba(125,180,255,0.35) 100%), linear-gradient(90deg, transparent 0%, transparent calc(100% - 1px), rgba(125,180,255,0.2) 100%)',
          backgroundSize: '72px 72px',
          transform: 'perspective(600px) rotateX(60deg) translateY(18%)',
          transformOrigin: 'bottom',
          maskImage: 'linear-gradient(to top, black 30%, transparent 90%)',
        }}
      />
    </div>
  )
}

export default function HeroScene() {
  const [webgl, setWebgl] = useState<boolean | null>(null)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    setWebgl(supportsWebGL())
    setMobile(window.innerWidth < 768)
  }, [])

  if (webgl === null) return <div className="absolute inset-0 bg-void" />
  if (!webgl) return <HeroFallback />

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, mobile ? 1.5 : 1.75]}
        camera={{ position: [0, 1.6, 8.2], fov: 52, near: 0.1, far: 60 }}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
        onCreated={({ gl }) => gl.setClearColor('#060608')}
        fallback={<HeroFallback />}
      >
        <fog attach="fog" args={['#060608', 8, 28]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 8, 2]} intensity={0.55} color="#9cc3ff" />
        <Terrain mobile={mobile} />
        <Platforms mobile={mobile} />
        {!mobile && (
          <Sparkles
            count={130}
            size={1.6}
            scale={[22, 12, 14]}
            position={[0, 4, -6]}
            speed={0.25}
            opacity={0.55}
            color="#9cc3ff"
          />
        )}
        <Rig />
      </Canvas>
    </div>
  )
}
