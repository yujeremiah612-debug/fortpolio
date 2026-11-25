import { useState, useCallback, useEffect } from 'react'
import Loader from '../components/Loader'
import Experience from '../components/three/Experience'
import Ascent from '../sections/Ascent'
import { WhatIBuild } from '../sections/Chapters'
import ProjectFilm from '../sections/ProjectFilm'
import Archive from '../sections/Archive'
import About from '../sections/About'
import Technology from '../sections/Technology'
import Process from '../sections/Process'
import Contact from '../sections/Contact'
import { useReveals } from '../hooks/useReveals'
import { ScrollTrigger } from '../lib/gsap'

let hasLoadedOnce = false

export default function Home() {
  const [ready, setReady] = useState(hasLoadedOnce)
  const onLoaderDone = useCallback(() => {
    hasLoadedOnce = true
    setReady(true)
    // measure pins after loader unlocks scroll
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [])

  useReveals(ready)

  useEffect(() => {
    document.body.style.overflow = ready ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [ready])

  return (
    <>
      {!ready && <Loader onDone={onLoaderDone} />}

      {/* Fixed WebGL world — always behind the climb */}
      <Experience />

      {/* Continuous ascent (scroll track + fixed overlay) */}
      <Ascent />

      {/* Base camp — content after the summit */}
      <div className="relative z-10 bg-void">
        <WhatIBuild />
        <ProjectFilm />
        <Archive />
        <About />
        <Technology />
        <Process />
        <Contact />
      </div>
    </>
  )
}
