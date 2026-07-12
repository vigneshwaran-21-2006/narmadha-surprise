import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Scene from './components/Scene'
import { Heart } from 'lucide-react' // Use lucide-react for the SVG hearts

// A simple component to render floating hearts in the background
const FloatingHearts = () => {
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    // Generate random hearts
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // random horizontal position
      animationDuration: 8 + Math.random() * 10,
      delay: Math.random() * 5,
      size: 16 + Math.random() * 24
    }))
    setHearts(newHearts)
  }, [])

  return (
    <>
      {hearts.map(h => (
        <Heart
          key={h.id}
          className="floating-heart"
          style={{
            left: `${h.left}%`,
            animationDuration: `${h.animationDuration}s`,
            animationDelay: `${h.delay}s`,
            width: h.size,
            height: h.size
          }}
          fill="currentColor"
        />
      ))}
    </>
  )
}

export default function App() {
  const [appState, setAppState] = useState(1) // 1: Landing, 2: Letter, 3: Transition, 4: Final Message
  const [typedText, setTypedText] = useState('')

  const fullLetter = `You are one in a million feeling, I love u friend!

These past 2 months have truly been some of the happiest for me. Your presence has brought so much light and joy.

No matter where we go or what we do, I know that we will be good friends forever.

With love,
Vignesh

Chella Kutty!`

  // Typing effect logic
  useEffect(() => {
    if (appState === 2) {
      let i = 0
      const interval = setInterval(() => {
        setTypedText(fullLetter.substring(0, i))
        i++
        if (i > fullLetter.length) clearInterval(interval)
      }, 30) // typing speed
      return () => clearInterval(interval)
    }
  }, [appState, fullLetter])

  const handleOpenLetter = () => setAppState(2)
  
  const handleCloseLetter = () => {
    setAppState(3)
    // Wait for the envelope to fly away, then show the final message
    setTimeout(() => {
      setAppState(4)
    }, 2000)
  }

  // Background shifts to black space when transitioning
  const bgClass = appState >= 3 ? 'bg-space' : 'bg-hearts'

  return (
    <div className={`bg-container ${bgClass}`}>
      {/* CSS Floating Hearts (Only visible before space transition) */}
      <AnimatePresence>
        {appState < 3 && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}>
            <FloatingHearts />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Particle Background (Invisible until State 3, or we can just let it sit there and shoot up) */}
      <Scene isLetterOpen={appState >= 3} />

      {/* UI Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <AnimatePresence mode="wait">
          
          {/* State 1: Landing Page */}
          {appState === 1 && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 1 }}
              style={{ textAlign: 'center', marginTop: '40vh' }}
            >
              <h1 style={{ color: '#fff', fontSize: '3rem', marginBottom: '2rem', letterSpacing: '2px', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                A Letter For Narmadha.
              </h1>
              <button className="main-btn" onClick={handleOpenLetter}>Open Envelope</button>
            </motion.div>
          )}

          {/* State 2 & 3: The Envelope UI */}
          {(appState === 2 || appState === 3) && (
            <motion.div
              key="envelope"
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={
                appState === 2 
                ? { opacity: 1, y: 0, scale: 1 } 
                : { opacity: 0, y: -800, scale: 0.8, rotate: 10 } // Shoots up off screen
              }
              transition={{ duration: appState === 3 ? 1.5 : 0.8, ease: "easeInOut" }}
              className="envelope-wrapper"
            >
              <div className="envelope-back"></div>
              
              {/* The Letter inside the envelope */}
              <motion.div 
                className="letter-paper"
                initial={{ y: 250 }} 
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: "backOut" }}
              >
                <div className="letter-text">
                  {typedText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    style={{ display: 'inline-block', width: '8px', height: '1.2em', background: '#e60039', verticalAlign: 'middle', marginLeft: '4px' }}
                  />
                </div>
                
                {appState === 2 && typedText.length === fullLetter.length && (
                  <motion.button 
                    className="got-it-btn"
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: 0.5 }}
                    onClick={handleCloseLetter}
                  >
                    Got it.
                  </motion.button>
                )}
              </motion.div>

              <div className="envelope-front"></div>
            </motion.div>
          )}

          {/* State 4: Final Message */}
          {appState === 4 && (
            <motion.div
              key="final"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              style={{ textAlign: 'center', maxWidth: '800px', padding: '0 2rem', marginTop: '40vh' }}
            >
              <p style={{ color: '#fff', fontSize: '1.5rem', lineHeight: '2', fontWeight: 300, fontFamily: 'Poppins, sans-serif' }}>
                By the way... I'm building something special just for you. To make it perfect, please make sure you have a profile picture set on Instagram right now. It’s an important part of the surprise!
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
