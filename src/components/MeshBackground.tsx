import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface RibbonProps {
  startX: number
  endX: number
  baseY: number
  baseZ: number
  width: number
  ampY: number
  ampZ: number
  waveFreq: number
  twists: number
  speed: number
  twistSpeed: number
  color: string
  opacity?: number
  phase?: number
}

/**
 * FlowingLiquidRibbon — Smooth, undulating 3D Liquid Glass Ribbon Strip
 * Replaces generic circles and rings with flowing silk-like dimensional ribbons
 */
function FlowingLiquidRibbon({
  startX,
  endX,
  baseY,
  baseZ,
  width,
  ampY,
  ampZ,
  waveFreq,
  twists,
  speed,
  twistSpeed,
  color,
  opacity = 0.85,
  phase = 0,
}: RibbonProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const segments = 120

  const { geometry, positions } = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array((segments + 1) * 2 * 3)
    const uvs = new Float32Array((segments + 1) * 2 * 2)
    const indices: number[] = []

    for (let i = 0; i <= segments; i++) {
      const u = i / segments
      uvs[i * 4] = u
      uvs[i * 4 + 1] = 0
      uvs[i * 4 + 2] = u
      uvs[i * 4 + 3] = 1

      if (i < segments) {
        const a = i * 2
        const b = i * 2 + 1
        const c = (i + 1) * 2
        const d = (i + 1) * 2 + 1
        indices.push(a, b, c)
        indices.push(b, d, c)
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    geo.setIndex(indices)
    return { geometry: geo, positions: pos }
  }, [segments])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime() * speed + phase
    const hw = width * 0.5

    for (let i = 0; i <= segments; i++) {
      const u = i / segments
      const x = startX + (endX - startX) * u
      const y = baseY + Math.sin(u * waveFreq + t * 1.3) * ampY + Math.cos(u * 4.0 + t * 0.9) * (ampY * 0.35)
      const z = baseZ + Math.cos(u * waveFreq * 0.8 + t * 1.1) * ampZ + Math.sin(u * 3.0 + t * 0.7) * 0.6

      const twist = u * twists * Math.PI * 2 + t * twistSpeed
      const nx = -Math.sin(twist) * 0.3
      const ny = Math.cos(twist)
      const nz = Math.sin(twist) * 0.85

      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1
      const unx = (nx / len) * hw
      const uny = (ny / len) * hw
      const unz = (nz / len) * hw

      const idx = i * 6
      positions[idx] = x + unx
      positions[idx + 1] = y + uny
      positions[idx + 2] = z + unz

      positions[idx + 3] = x - unx
      positions[idx + 4] = y - uny
      positions[idx + 5] = z - unz
    }

    geometry.attributes.position.needsUpdate = true
    geometry.computeVertexNormals()
  })

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color={color}
        roughness={0.12}
        metalness={0.45}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/**
 * LoopingMobiusRibbon — An endless 3D Mobius / Trefoil twisting glass ribbon
 */
function LoopingMobiusRibbon({
  radius,
  width,
  color,
  speed,
  position,
}: {
  radius: number
  width: number
  color: string
  speed: number
  position: [number, number, number]
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const segments = 100

  const { geometry, positions } = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array((segments + 1) * 2 * 3)
    const indices: number[] = []

    for (let i = 0; i <= segments; i++) {
      if (i < segments) {
        const a = i * 2
        const b = i * 2 + 1
        const c = (i + 1) * 2
        const d = (i + 1) * 2 + 1
        indices.push(a, b, c)
        indices.push(b, d, c)
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setIndex(indices)
    return { geometry: geo, positions: pos }
  }, [segments])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime() * speed
    const hw = width * 0.5

    for (let i = 0; i <= segments; i++) {
      const u = (i / segments) * Math.PI * 2
      // Figure-8 infinity curve in 3D
      const x = Math.sin(u) * radius * 1.4
      const y = Math.sin(u * 2) * (radius * 0.55) + Math.cos(t + u) * 0.25
      const z = Math.cos(u) * radius * 0.8

      const twist = u * 1.5 + t * 0.8
      const nx = -Math.sin(twist) * 0.4
      const ny = Math.cos(twist)
      const nz = Math.sin(twist)

      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1
      const unx = (nx / len) * hw
      const uny = (ny / len) * hw
      const unz = (nz / len) * hw

      const idx = i * 6
      positions[idx] = x + unx
      positions[idx + 1] = y + uny
      positions[idx + 2] = z + unz

      positions[idx + 3] = x - unx
      positions[idx + 4] = y - uny
      positions[idx + 5] = z - unz
    }

    geometry.attributes.position.needsUpdate = true
    geometry.computeVertexNormals()
    meshRef.current.rotation.y = t * 0.15
  })

  return (
    <mesh ref={meshRef} position={position} geometry={geometry}>
      <meshStandardMaterial
        color={color}
        roughness={0.1}
        metalness={0.5}
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function Floating3DRibbonScene() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime() * 0.12
    groupRef.current.rotation.y = Math.sin(t) * 0.08
    groupRef.current.rotation.x = Math.cos(t * 0.7) * 0.05
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={1.15} color="#FAF7FD" />
      <pointLight position={[6, 8, 6]} color="#FCE7F3" intensity={2.6} />
      <pointLight position={[-8, -4, 4]} color="#C084FC" intensity={2.4} />
      <pointLight position={[0, -6, -2]} color="#BAE6FD" intensity={2.0} />
      <pointLight position={[2, 4, -4]} color="#FF66A3" intensity={1.8} />

      {/* ── 3D Flowing Liquid Glass Ribbons matching Psykie Mascot ── */}
      {/* Primary Candy Bubblegum Pink Ribbon */}
      <FlowingLiquidRibbon
        startX={-9}
        endX={9}
        baseY={1.2}
        baseZ={-3}
        width={0.88}
        ampY={1.6}
        ampZ={1.2}
        waveFreq={3.5}
        twists={2.5}
        speed={0.45}
        twistSpeed={0.5}
        color="#FF66A3"
        opacity={0.88}
        phase={0}
      />

      {/* Secondary Pearlescent Opal Sky Ribbon (Matching the planet's halo ring) */}
      <FlowingLiquidRibbon
        startX={-8}
        endX={8}
        baseY={-1.5}
        baseZ={-3.5}
        width={0.78}
        ampY={1.4}
        ampZ={1.5}
        waveFreq={4.0}
        twists={3.0}
        speed={0.35}
        twistSpeed={-0.45}
        color="#7DD3FC"
        opacity={0.8}
        phase={2.5}
      />

      {/* Tertiary Electric Amethyst Purple Glass Ribbon */}
      <FlowingLiquidRibbon
        startX={-10}
        endX={10}
        baseY={-0.2}
        baseZ={-4.5}
        width={1.05}
        ampY={2.1}
        ampZ={1.8}
        waveFreq={2.8}
        twists={2.0}
        speed={0.28}
        twistSpeed={0.35}
        color="#A855F7"
        opacity={0.75}
        phase={4.8}
      />

      {/* Endless Looping 3D Mobius Ribbon matching Iris Purple */}
      <LoopingMobiusRibbon
        radius={2.2}
        width={0.45}
        color="#8B5CF6"
        speed={0.3}
        position={[4.5, 0.8, -4.5]}
      />

      {/* Endless Looping 3D Mobius Ribbon matching Marshmallow Pink */}
      <LoopingMobiusRibbon
        radius={1.8}
        width={0.38}
        color="#FF80BF"
        speed={0.25}
        position={[-5.0, -1.2, -4.0]}
      />
    </group>
  )
}

/**
 * MeshBackground — 3D Liquid Glass Ribbon Ambient Canvas Background
 * Interactive 3D WebGL Ribbon Tapestry flowing behind all liquid glass panels
 */
export function MeshBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      style={{
        background: `
          radial-gradient(circle at 10% 15%, rgba(254, 215, 236, 0.75) 0%, transparent 45%),
          radial-gradient(circle at 90% 20%, rgba(233, 213, 255, 0.75) 0%, transparent 45%),
          radial-gradient(circle at 50% 85%, rgba(186, 230, 253, 0.35) 0%, transparent 50%),
          #FAF7FD
        `,
      }}
    >
      {/* 3D WebGL Ribbon Canvas */}
      <div className="absolute inset-0 opacity-92">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
          style={{ width: '100%', height: '100%' }}
        >
          <Floating3DRibbonScene />
        </Canvas>
      </div>

      {/* Subtle geometric star dot matrix overlay for architectural depth */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 select-none"
        style={{
          backgroundImage: `radial-gradient(#A855F7 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  )
}
