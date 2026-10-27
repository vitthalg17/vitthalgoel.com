'use client'

import { useEffect, useState } from 'react'

const IMAGES = [
  '/images/header-image-01.webp',
  '/images/header-image-02.webp',
  '/images/header-image-03.webp',
]

// Plain <img> rather than next/image on purpose: next/image wraps its output,
// and the `even:`/`odd:` Tailwind variants below select on sibling position —
// an extra wrapper element would shift which images tilt which way.
const IMG_CLASS =
  'rounded-xl even:rotate-2 odd:-rotate-2 group-hover:rotate-0 transition duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] shadow-lg'

export default function ImageCarousel() {
  const [rotation, setRotation] = useState(0)
  const [rotating, setRotating] = useState(false)

  useEffect(() => {
    // Mirrors the old main.js timing exactly: every 1500ms, fade/scale out for
    // 300ms, swap the sources, then drop the class 50ms later so the images
    // settle back in.
    const timers: ReturnType<typeof setTimeout>[] = []

    const interval = setInterval(() => {
      setRotating(true)
      timers.push(
        setTimeout(() => {
          setRotation((r) => (r + 1) % IMAGES.length)
          timers.push(setTimeout(() => setRotating(false), 50))
        }, 300)
      )
    }, 1500)

    return () => {
      clearInterval(interval)
      timers.forEach(clearTimeout)
    }
  }, [])

  return (
    <div className="swipe-container group flex justify-center gap-4">
      {IMAGES.map((_, index) => (
        <img
          key={index}
          className={`${IMG_CLASS}${rotating ? ' rotating' : ''}`}
          src={IMAGES[(index + rotation) % IMAGES.length]}
          width={245}
          height={160}
          alt={`Header 0${index + 1}`}
        />
      ))}
    </div>
  )
}
