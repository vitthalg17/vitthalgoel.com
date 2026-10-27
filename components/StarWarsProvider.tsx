'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react'
import { flushSync } from 'react-dom'
import { useTheme } from 'next-themes'
import Hyperspace from './Hyperspace'

const SEQUENCE = 'star'
const PROMPT_DELAY_MS = 30000
const HOVER_DELAY_MS = 80 // ignore a cursor just passing over the picture
const EXPAND = { duration: 750, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' } // blasts out, then settles
const COLLAPSE = { duration: 550, easing: 'cubic-bezier(0.7, 0, 0.84, 0)' } // implodes, fastest at the end

type StarWarsContextValue = {
  picRef: RefObject<HTMLImageElement | null>
  // the gold glow + sonar rings nudging undiscovered visitors to the picture
  prompting: boolean
  // switch the theme off at once: the BB-8 toggle is about to set the theme itself
  exit: () => void
}

const StarWarsContext = createContext<StarWarsContextValue | null>(null)

export function useStarWars() {
  const context = useContext(StarWarsContext)
  if (!context) {
    throw new Error('useStarWars must be used inside <StarWarsProvider>')
  }
  return context
}

type Geometry = { x: number; y: number; r0: number; far: number }
type Reveal = {
  target: boolean
  anim: Animation | null
  waves: Animation[]
  transition: ViewTransition | null
}

// The Star Wars easter egg. Hovering the profile picture previews the theme:
// gold shockwaves blast out of the picture and the theme spreads from it in a
// growing circle; moving off collapses it back into the picture. One click (or
// tap) keeps it on; another click, Escape or the BB-8 toggle turns it off.
// Typing "star" toggles it. The circle reveal uses View Transitions where the
// browser has them; elsewhere the theme just swaps.
//
// The reveal is driven imperatively, like the script it replaces: the theme
// has to change inside startViewTransition's callback, and the clip and wave
// animations are Web Animations that reverse mid-flight when the cursor
// changes its mind. React only owns the hyperspace canvas and the prompt.
export default function StarWarsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const picRef = useRef<HTMLImageElement>(null)
  const wavesRef = useRef<HTMLDivElement>(null)
  const exitRef = useRef<() => void>(() => {})
  const [hyperspace, setHyperspace] = useState(false)
  const [prompting, setPrompting] = useState(false)

  // Read through a ref so the effect below runs once and never sees a stale setter.
  const { setTheme } = useTheme()
  const setThemeRef = useRef(setTheme)
  useEffect(() => {
    setThemeRef.current = setTheme
  }, [setTheme])

  useEffect(() => {
    const html = document.documentElement
    const pic = picRef.current
    const wavesEl = wavesRef.current
    if (!pic || !wavesEl) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let committed = false // clicked on: stays on when the cursor leaves
    let want = false // whether the theme should be showing
    let shown = false // whether the page currently has the theme
    let wasDark = false // theme to return to when it switches off: the one before a preview, dark once clicked on
    let hadLight = false // next-themes marks light mode with a class too; set aside while the theme shows
    let run: Reveal | null = null // the reveal in flight

    function persistDark() {
      // keep dark mode afterwards, with the BB-8 toggle flipped so clicking it returns to light mode
      wasDark = true
      setThemeRef.current('dark')
    }

    function apply(on: boolean) {
      if (on === shown) return
      shown = on
      if (on) {
        wasDark = html.classList.contains('dark')
        hadLight = html.classList.contains('light')
        html.classList.remove('light')
        html.classList.add('dark', 'sw')
        if (committed) persistDark()
      } else {
        html.classList.remove('sw')
        if (!wasDark) {
          html.classList.remove('dark')
          if (hadLight) html.classList.add('light')
        }
      }
      // synchronously, so the starfield is already in the page the view transition captures
      flushSync(() => setHyperspace(on))
    }

    function geometry(): Geometry {
      const r = pic!.getBoundingClientRect()
      const x = r.left + r.width / 2
      const y = r.top + r.height / 2
      return {
        x,
        y,
        r0: r.width / 2,
        far: Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)),
      }
    }
    const circle = (g: Geometry, r: number) => `circle(${r}px at ${g.x}px ${g.y}px)`

    // gold rings riding the edge of the reveal: blasting out from the picture, or collapsing back into it
    function makeWaves(g: Geometry, out: boolean, timing: typeof EXPAND) {
      wavesEl!.textContent = ''
      return [0, 1, 2].map((i) => {
        const w = document.createElement('div')
        w.className = 'sw-wave'
        w.style.left = `${g.x}px`
        w.style.top = `${g.y}px`
        wavesEl!.appendChild(w)
        const small = 2 * g.r0
        const big = 2 * g.far * (out ? 1 - 0.16 * i : 1 + 0.12 * i)
        const strength = 1 - 0.28 * i
        const a = { width: `${small}px`, height: `${small}px`, opacity: out ? strength : 1 }
        const b = { width: `${big}px`, height: `${big}px`, opacity: out ? 0 : strength * 0.4 }
        return w.animate(out ? [a, b] : [b, a], { ...timing, fill: 'both' })
      })
    }

    function punch() {
      pic!.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.15)', offset: 0.35 }, { transform: 'scale(1)' }],
        { duration: 450, easing: 'ease-out' }
      )
    }

    function finish(r: Reveal) {
      if (run !== r) return
      run = null
      apply(r.target) // after a reversal this puts the page back where it started
      wavesEl!.textContent = ''
      delete html.dataset.swAnim
      reconcile()
    }

    function start(on: boolean) {
      if (reduced) {
        apply(on)
        return
      }
      const g = geometry()
      const timing = on ? EXPAND : COLLAPSE
      const r: Reveal = { target: on, anim: null, waves: makeWaves(g, on, timing), transition: null }
      run = r
      if (on) punch()
      if (!document.startViewTransition) {
        apply(on)
        r.anim = r.waves[0]
        r.anim.onfinish = () => finish(r)
        return
      }
      html.dataset.swAnim = on ? 'expand' : 'collapse'
      r.transition = document.startViewTransition(() => apply(on))
      r.transition.ready.then(
        () => {
          if (run !== r) return
          // expanding: the new (themed) page grows out of the picture; collapsing: the old one shrinks into it
          const big = circle(g, g.far)
          const small = circle(g, g.r0)
          r.anim = html.animate(
            { clipPath: on ? [small, big] : [big, small] },
            {
              ...timing,
              fill: 'both',
              pseudoElement: on ? '::view-transition-new(root)' : '::view-transition-old(root)',
            }
          )
          if (r.target !== on) r.anim.reverse() // the cursor already left while the page was being captured
          r.anim.onfinish = () => finish(r)
        },
        () => finish(r)
      )
    }

    // the cursor changed its mind mid-animation: play back from where it is instead of jumping
    function reverse(r: Reveal) {
      r.target = !r.target
      r.waves.forEach((a) => a.reverse())
      if (!r.transition) apply(r.target) // no circle reveal to wait for
      else if (r.anim) r.anim.reverse()
    }

    function reconcile() {
      if (run) {
        if (run.target !== want) reverse(run)
        return
      }
      if (want !== shown) start(want)
    }

    function cancel() {
      if (!run) return
      const r = run
      run = null
      r.waves.forEach((a) => a.cancel())
      r.transition?.skipTransition()
      wavesEl!.textContent = ''
      delete html.dataset.swAnim
    }

    function activate() {
      committed = true
      want = true
      hidePrompt()
      if (shown) persistDark() // already showing as a preview
      reconcile()
    }

    function deactivate(instant: boolean) {
      committed = false
      want = false
      if (instant) {
        cancel()
        apply(false)
      } else {
        reconcile()
      }
    }

    const toggle = () => (committed ? deactivate(false) : activate())
    exitRef.current = () => deactivate(true)

    // Hover previews it, leaving collapses it, one click keeps it. Whether the
    // cursor is over the picture comes from its position on every mouse move,
    // not from pointerenter/pointerleave: the reveal covers the page with the
    // view transition's snapshot, and Chrome then fires a leave while the
    // cursor is still on the picture and none when it really leaves, which
    // used to leave the theme stuck on after a quick hover.
    let hoverTimer = 0
    let over = false
    let pointer: { x: number; y: number } | null = null

    function setOver(next: boolean) {
      if (next === over) return
      over = next
      clearTimeout(hoverTimer)
      if (committed) return
      if (next) {
        hoverTimer = window.setTimeout(() => {
          want = true
          reconcile()
        }, HOVER_DELAY_MS)
      } else {
        want = false
        reconcile()
      }
    }

    function track() {
      if (!pointer) return setOver(false)
      const r = pic!.getBoundingClientRect()
      setOver(
        pointer.x >= r.left && pointer.x <= r.right && pointer.y >= r.top && pointer.y <= r.bottom
      )
    }

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType !== 'mouse') return
      pointer = { x: e.clientX, y: e.clientY }
      track()
    }

    // the cursor left the window
    function onMouseOut(e: MouseEvent) {
      if (e.relatedTarget) return
      const outside =
        e.clientX <= 0 || e.clientY <= 0 || e.clientX >= innerWidth || e.clientY >= innerHeight
      if (!outside) return
      pointer = null
      track()
    }

    function onPicClick() {
      clearTimeout(hoverTimer)
      toggle()
    }

    // Typing "star" toggles it, Escape exits
    let buffer = ''
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      // Don't swallow real typing in the contact form.
      if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return
      if (e.key === 'Escape') {
        if (committed) deactivate(false)
        buffer = ''
        return
      }
      if (e.key && e.key.length === 1) {
        buffer = (buffer + e.key.toLowerCase()).slice(-SEQUENCE.length)
        if (buffer === SEQUENCE) {
          buffer = ''
          toggle()
        }
      }
    }

    // After 30s on the page, a pulsing gold glow nudges undiscovered visitors to click the picture
    const promptTimer = window.setTimeout(() => {
      if (!committed) setPrompting(true)
    }, PROMPT_DELAY_MS)
    function hidePrompt() {
      clearTimeout(promptTimer)
      setPrompting(false)
    }

    addEventListener('pointermove', onPointerMove, { passive: true })
    addEventListener('scroll', track, { passive: true }) // scrolling moves the picture under a still cursor
    document.addEventListener('mouseout', onMouseOut)
    addEventListener('keydown', onKeyDown)
    pic.addEventListener('click', onPicClick)

    return () => {
      removeEventListener('pointermove', onPointerMove)
      removeEventListener('scroll', track)
      document.removeEventListener('mouseout', onMouseOut)
      removeEventListener('keydown', onKeyDown)
      pic.removeEventListener('click', onPicClick)
      clearTimeout(hoverTimer)
      clearTimeout(promptTimer)
      cancel()
      html.classList.remove('sw')
      exitRef.current = () => {}
    }
  }, [])

  const value = useMemo(
    () => ({ picRef, prompting, exit: () => exitRef.current() }),
    [prompting]
  )

  return (
    <StarWarsContext.Provider value={value}>
      <Hyperspace active={hyperspace} />
      <div id="sw-waves" ref={wavesRef} aria-hidden="true" />
      {children}
    </StarWarsContext.Provider>
  )
}
