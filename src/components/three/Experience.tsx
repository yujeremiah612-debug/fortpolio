import { useMemo, useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { ascent, sampleCamera } from '../../lib/ascent'

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

/* ── Faceted crystalline summit mass ─────────────────────────── */

function SummitMass({ mobile }: { mobile: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  const detail = mobile ? 1 : 2

  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.rotation.y += dt * 0.04
    const p = ascent.progress
    // mass drifts downward relative to camera as we climb past it
    ref.current.position.y = THREE.MathUtils.lerp(0.2, -2.5, p)
    ref.current.position.z = THREE.MathUtils.lerp(-1.2, 1.5, p)
    ref.current.scale.setScalar(THREE.MathUtils.lerp(1, 0.55, p))
  })

  return (
    <mesh ref={ref} position={[1.6, 0.2, -1.2]} castShadow>
      <icosahedronGeometry args={[2.35, detail]} />
      <meshStandardMaterial
        color="#1a1c28"
        metalness={0.85}
        roughness={0.22}
        flatShading
        envMapIntensity={1.2}
      />
    </mesh>
  )
}

/* ── Ascending platform staircase (Apex-style climb path) ────── */

function Platforms({ mobile }: { mobile: boolean }) {
  const group = useRef<THREE.Group>(null)
  const count = mobile ? 8 : 14

  const slabs = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const t = i / (count - 1)
      const angle = t * Math.PI * 1.85 - 0.55
      const radius = 3.6 - t * 1.8
      return {
        position: [
          Math.cos(angle) * radius * 0.95,
          -0.8 + t * 8.5,
          -2.2 + Math.sin(angle) * radius * 0.7 - t * 0.8,
        ] as [number, number, number],
        scale: [1.65 - t * 0.7, 0.1, 1.15 - t * 0.4] as [number, number, number],
        rotY: -angle + Math.PI / 2,
        emissive: 0.05 + t * 0.22,
      }
    })
  }, [count])

  useFrame(() => {
    if (!group.current) return
    const p = ascent.progress
    // platforms rotate slightly and sink as camera climbs through them
    group.current.rotation.y = p * 0.55
    group.current.position.y = -p * 6.2
  })

  return (
    <group ref={group}>
      {slabs.map((s, i) => (
        <mesh key={i} position={s.position} scale={s.scale} rotation={[0.02, s.rotY, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#12141c"
            emissive="#7db4ff"
            emissiveIntensity={s.emissive}
            metalness={0.65}
            roughness={0.35}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ── Debris / floating tetrahedrons ──────────────────────────── */

function Debris({ mobile }: { mobile: boolean }) {
  const group = useRef<THREE.Group>(null)
  const count = mobile ? 12 : 28

  const items = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2
      const r = 2.5 + (i % 5) * 0.7
      return {
        position: [
          Math.cos(a) * r,
          (i % 7) * 1.1 - 1,
          Math.sin(a) * r - 2,
        ] as [number, number, number],
        scale: 0.06 + (i % 4) * 0.04,
        speed: 0.15 + (i % 5) * 0.05,
      }
    })
  }, [count])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const p = ascent.progress
    group.current.position.y = -p * 4
    group.current.children.forEach((child, i) => {
      child.rotation.x = t * items[i].speed
      child.rotation.y = t * items[i].speed * 0.7
    })
  })

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh key={i} position={it.position} scale={it.scale}>
          <tetrahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={i % 7 === 0 ? '#7db4ff' : '#2a2e3a'}
            emissive={i % 7 === 0 ? '#7db4ff' : '#000000'}
            emissiveIntensity={i % 7 === 0 ? 0.6 : 0}
            metalness={0.5}
            roughness={0.4}
            flatShading
          />
        </mesh>
      ))}
    </group>
  )
}

/* ── Soft ground haze plane ──────────────────────────────────── */

function Haze() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(() => {
    if (!ref.current) return
    ref.current.position.y = -1.8 - ascent.progress * 5
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, -2]}>
      <circleGeometry args={[18, 48]} />
      <meshBasicMaterial color="#060608" transparent opacity={0.85} />
    </mesh>
  )
}

/* ── Camera driven by scrub progress + pointer parallax ──────── */

function CameraRig() {
  const { camera, pointer, size } = useThree()
  const look = useRef(new THREE.Vector3())
  const isMobile = size.width < 768

  useFrame(() => {
    const sample = sampleCamera(ascent.progress)
    const parallax = isMobile || ascent.reduced ? 0 : 1
    const tx = sample.pos[0] + pointer.x * 0.45 * parallax
    const ty = sample.pos[1] + pointer.y * 0.25 * parallax
    const tz = sample.pos[2]

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, tx, 0.06)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, ty, 0.06)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, tz, 0.06)

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, sample.fov, 0.06)
      camera.updateProjectionMatrix()
    }

    look.current.set(
      sample.look[0] + pointer.x * 0.3 * parallax,
      sample.look[1],
      sample.look[2],
    )
    camera.lookAt(look.current)
  })

  return null
}

/* ── Lighting that shifts with altitude ──────────────────────── */

function Lights() {
  const key = useRef<THREE.DirectionalLight>(null)
  const rim = useRef<THREE.PointLight>(null)

  useFrame(() => {
    const p = ascent.progress
    if (key.current) key.current.intensity = 0.55 + p * 0.55
    if (rim.current) {
      rim.current.intensity = 0.8 + p * 1.4
      rim.current.position.y = 4 + p * 6
    }
  })

  return (
    <>
      <ambientLight intensity={0.22} color="#8aa0c0" />
      <directionalLight
        ref={key}
        position={[5, 8, 3]}
        intensity={0.7}
        color="#cfe0ff"
        castShadow={!ascent.reduced}
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight ref={rim} position={[-3, 4, 2]} intensity={1} color="#7db4ff" distance={18} />
      <pointLight position={[2, 1, -4]} intensity={0.35} color="#4a6a9a" distance={12} />
    </>
  )
}

export function ExperienceFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 50% at 60% 70%, rgba(125,180,255,0.16), transparent 55%), radial-gradient(50% 40% at 30% 30%, rgba(80,100,160,0.12), transparent 50%), #060608',
        }}
      />
      <div
        className="absolute right-[8%] bottom-[18%] h-[42vmin] w-[42vmin] opacity-70"
        style={{
          background:
            'linear-gradient(145deg, rgba(40,48,70,0.9), rgba(12,14,22,0.95))',
          clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
          filter: 'blur(0.3px)',
        }}
      />
    </div>
  )
}

function Scene({ mobile }: { mobile: boolean }) {
  return (
    <>
      <color attach="background" args={['#060608']} />
      <fog attach="fog" args={['#060608', 6, 22]} />
      <Lights />
      <SummitMass mobile={mobile} />
      <Platforms mobile={mobile} />
      <Debris mobile={mobile} />
      <Haze />
      {!mobile && (
        <Sparkles
          count={90}
          size={1.4}
          scale={[16, 14, 12]}
          position={[0, 4, -3]}
          speed={0.2}
          opacity={0.45}
          color="#9cc3ff"
        />
      )}
      <CameraRig />
    </>
  )
}

/**
 * Fixed full-viewport WebGL experience.
 * Camera / objects are driven by `ascent.progress` from ScrollTrigger.
 */
export default function Experience() {
  const [webgl, setWebgl] = useState<boolean | null>(null)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const ok = supportsWebGL()
    setWebgl(ok)
    const mq = window.matchMedia('(max-width: 767px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    setMobile(mq.matches)
    ascent.reduced = reduced.matches || !ok
    const onResize = () => setMobile(mq.matches)
    mq.addEventListener('change', onResize)
    return () => mq.removeEventListener('change', onResize)
  }, [])

  if (webgl === null) return <div className="fixed inset-0 -z-10 bg-void" />
  if (!webgl) {
    return (
      <div className="fixed inset-0 -z-10">
        <ExperienceFallback />
      </div>
    )
  }

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        dpr={[1, mobile ? 1.4 : 1.75]}
        camera={{ position: [0.4, 1.4, 9.2], fov: 48, near: 0.1, far: 60 }}
        gl={{
          antialias: !mobile,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
        }}
        shadows={!mobile}
        onCreated={({ gl }) => {
          gl.setClearColor('#060608')
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
        }}
      >
        <Suspense fallback={null}>
          <Scene mobile={mobile} />
        </Suspense>
      </Canvas>
    </div>
  )
}
