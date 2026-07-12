import React, { useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSphere } from '@react-three/cannon'
import * as THREE from 'three'

export default function Particles({ count = 200, isLetterOpen }) {
  // We use useSphere hook from cannon to manage the physics of all instances
  const [ref, api] = useSphere(() => ({
    mass: 0.1,
    args: [0.15], // Approximate radius of our icosahedron
    position: [
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20 + 5,
      (Math.random() - 0.5) * 10 - 5
    ],
    rotation: [
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    ],
    linearDamping: 0.5,
    restitution: 0.5,
    friction: 0
  }))

  // Create geometry and material outside instancedMesh args to prevent Three.js null errors
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(0.15, 0), [])
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ffd700",
    emissive: "#ffd700",
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.8
  }), [])

  // Update damping when letter opens so they fly up faster
  useEffect(() => {
    if (isLetterOpen) {
      for (let i = 0; i < count; i++) {
        api.at(i).linearDamping.set(0.1)
      }
    }
  }, [isLetterOpen, count, api])

  // Apply antigravity force when isLetterOpen is true
  useFrame(() => {
    if (isLetterOpen) {
      for (let i = 0; i < count; i++) {
        // Apply a continuous upward force (antigravity)
        api.at(i).applyForce([0, Math.random() * 2 + 2, 0], [0, 0, 0])
      }
    }
  })

  return (
    <instancedMesh ref={ref} args={[geometry, material, count]} />
  )
}
