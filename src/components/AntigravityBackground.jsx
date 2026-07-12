import React, { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

function ParticleSwarm({ isOpen, count = 400 }) {
  const pointsRef = useRef()
  const [explosionStarted, setExplosionStarted] = useState(false)

  // Generate initial particle positions and random offsets for math
  const { positions, randoms } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const randoms = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Start randomly across the screen width and height
      positions[i * 3] = (Math.random() - 0.5) * 25      // X
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20  // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10  // Z

      // Random factors for unique swirling speeds per particle
      randoms[i * 3] = Math.random()
      randoms[i * 3 + 1] = Math.random()
      randoms[i * 3 + 2] = Math.random()
    }
    return { positions, randoms }
  }, [count])

  // Track the explosion state
  useEffect(() => {
    if (isOpen) {
      setExplosionStarted(true)
    }
  }, [isOpen])

  // Physics loop without physics engine (mathematically controlled)
  useFrame((state, delta) => {
    if (!pointsRef.current) return

    const positions = pointsRef.current.geometry.attributes.position.array
    const time = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      if (!explosionStarted) {
        // Gentle downward gravity
        positions[i3 + 1] -= delta * (0.5 + randoms[i3 + 1] * 0.5)
        
        // Reset at top if they fall too far down
        if (positions[i3 + 1] < -12) {
          positions[i3 + 1] = 12
        }
        
        // Gentle sway horizontally
        positions[i3] += Math.sin(time * 0.5 + randoms[i3] * Math.PI * 2) * 0.01
      } else {
        // ANTIGRAVITY EXPLOSION (Swirling upwards)
        // Upward acceleration
        const upwardSpeed = 5 + (randoms[i3 + 1] * 10)
        positions[i3 + 1] += delta * upwardSpeed

        // Swirling vortex effect on X and Z axis
        const swirlRadius = 0.05 + randoms[i3] * 0.1
        const swirlSpeed = 2 + randoms[i3 + 2] * 3
        positions[i3] += Math.cos(time * swirlSpeed + randoms[i3]) * swirlRadius
        positions[i3 + 2] += Math.sin(time * swirlSpeed + randoms[i3]) * swirlRadius
      }
    }
    
    // Tell Three.js the positions array has been updated
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffd700"
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  )
}

export default function AntigravityBackground({ isOpen, children }) {
  const [showSignature, setShowSignature] = useState(false)

  // Trigger signature fade-in 2.5 seconds after envelope is opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowSignature(true)
      }, 2500)
      return () => clearTimeout(timer)
    } else {
      setShowSignature(false)
    }
  }, [isOpen])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white">
      {/* 3D Background Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <ParticleSwarm isOpen={isOpen} count={400} />
        </Canvas>
      </div>

      {/* Main Content (The Envelope, etc.) injected via children */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none">
        {/* We use pointer-events-none here so clicks pass through to children cleanly, 
            but we re-enable pointer events on the children container */}
        <div className="pointer-events-auto">
          {children}
        </div>
      </div>

      {/* The Signature */}
      <AnimatePresence>
        {showSignature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute bottom-10 right-10 z-20"
          >
            <p className="font-serif text-2xl italic text-gray-200 drop-shadow-md">
              With love, Vignesh
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
