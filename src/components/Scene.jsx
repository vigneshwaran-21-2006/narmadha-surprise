import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'
import { Environment } from '@react-three/drei'
import Particles from './Particles'

export default function Scene({ isLetterOpen }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        {/* Soft lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4444ff" />
        
        {/* The Physics engine: gravity points down unless isLetterOpen is true */}
        <Physics gravity={[0, isLetterOpen ? 0 : -0.5, 0]}>
          <Particles isLetterOpen={isLetterOpen} />
        </Physics>
        
        {/* Minimalist environment for subtle reflections */}
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
