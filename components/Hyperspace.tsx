'use client'

import { useEffect, useRef } from 'react'

// Direct port of js/hyperspace.js. Stars fly outward from the centre of the
// screen, accelerating and lengthening into streaks; each one is recycled once
// it leaves the viewport.
const BASE_SIZE = 1
const VELOCITY_INC = 1.01
const SIZE_INC = 1.01
const RAD = Math.PI / 180
const STAR_COUNT = 300

type StarState = {
  alpha: number
  x: number
  y: number
  vX: number
  vY: number
  size: number
}

const randomInRange = (max: number, min: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

function makeStar(): StarState {
  const angle = randomInRange(0, 360) * RAD
  const vX = Math.cos(angle)
  const vY = Math.sin(angle)
  const w = window.innerWidth
  const h = window.innerHeight
  const travelled =
    Math.random() > 0.5
      ? Math.random() * Math.max(w, h) + Math.random() * (w * 0.24)
      : Math.random() * (w * 0.25)
  return {
    alpha: Math.random(),
    x: Math.floor(vX * travelled) + w / 2,
    y: Math.floor(vY * travelled) + h / 2,
    vX,
    vY,
    size: BASE_SIZE,
  }
}

export default function Hyperspace({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !active) return
    const context = canvas.getContext('2d')
    if (!context) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    let stars: StarState[] = []
    let rafId = 0
    let running = true

    function setup() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = window.innerWidth * dpr
      canvas!.height = window.innerHeight * dpr
      context!.setTransform(dpr, 0, 0, dpr, 0, 0)
      context!.lineCap = 'round'
    }

    function seed() {
      stars = Array.from({ length: STAR_COUNT }, makeStar)
    }

    // Reduced-motion visitors get a calm, static field instead of the streaks.
    function drawStatic() {
      const w = window.innerWidth
      const h = window.innerHeight
      context!.clearRect(0, 0, w, h)
      for (const s of stars) {
        context!.fillStyle = `rgba(255,255,255,${s.alpha})`
        context!.fillRect(s.x, s.y, 1.4, 1.4)
      }
    }

    function render() {
      if (!running) return
      const w = window.innerWidth
      const h = window.innerHeight
      context!.clearRect(0, 0, w, h)
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        if (s.x < 0 || s.x > w || s.y < 0 || s.y > h) {
          stars[i] = makeStar()
          continue
        }
        const prevX = s.x
        const prevY = s.y
        s.x += s.vX
        s.y += s.vY
        s.vX *= VELOCITY_INC
        s.vY *= VELOCITY_INC
        s.size *= SIZE_INC
        context!.strokeStyle = `rgba(255,255,255,${s.alpha})`
        context!.lineWidth = s.size
        context!.beginPath()
        context!.moveTo(prevX, prevY)
        context!.lineTo(s.x, s.y)
        context!.stroke()
      }
      rafId = requestAnimationFrame(render)
    }

    setup()
    seed()
    if (prefersReducedMotion) {
      drawStatic()
    } else {
      rafId = requestAnimationFrame(render)
    }

    let resizeTimer: ReturnType<typeof setTimeout>
    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        setup()
        seed()
        if (prefersReducedMotion) drawStatic()
      }, 250)
    }
    window.addEventListener('resize', onResize)

    return () => {
      running = false
      cancelAnimationFrame(rafId)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)
    }
  }, [active])

  return <canvas id="hyperspace" ref={canvasRef} aria-hidden="true" />
}
