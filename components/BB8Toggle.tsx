'use client'

import { useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'
import { useStarWars } from './StarWarsProvider'

// "Have we hydrated yet?" as an external store rather than the usual
// useState + useEffect pair: the server snapshot is false, the client snapshot
// is true, and nothing calls setState from inside an effect.
const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

// The BB8 animation is driven entirely by CSS sibling selectors hanging off
// the native checkbox's :checked state (`input:checked + .container .child`),
// so the markup below has to keep its exact shape and order. React only owns
// the checked value; the animation is untouched by the rewrite.
export default function BB8Toggle() {
  const { theme, setTheme } = useTheme()
  const { exit } = useStarWars()
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  // Until next-themes has read localStorage on the client we don't know which
  // way the switch points, and guessing would both flash and trip hydration.
  // The placeholder reserves the toggle's exact footprint so nothing shifts.
  // The placeholder carries the .bb8-toggle class so it picks up that rule's
  // font-size (5.616px) and --toggle-* variables. Those dimensions are in em,
  // so without the class they would resolve against the inherited 16px and
  // reserve roughly three times too much space.
  if (!mounted) {
    return (
      <div
        className="bb8-toggle"
        style={{ width: 'var(--toggle-width)', height: 'var(--toggle-height)' }}
        aria-hidden="true"
      />
    )
  }

  const isDark = theme === 'dark'

  return (
    <label className="bb8-toggle">
      <input
        id="theme-toggle"
        className="bb8-toggle__checkbox"
        type="checkbox"
        aria-label="Toggle dark mode"
        checked={isDark}
        onChange={() => {
          // Reaching for the toggle is how a visitor leaves the easter egg.
          // Exit first: it restores the pre-egg theme, which setTheme then
          // replaces with the one the visitor picked.
          exit()
          setTheme(isDark ? 'light' : 'dark')
        }}
      />
      <div className="bb8-toggle__container">
        <div className="bb8-toggle__scenery">
          <div className="bb8-toggle__star" />
          <div className="bb8-toggle__star" />
          <div className="bb8-toggle__star" />
          <div className="bb8-toggle__star" />
          <div className="bb8-toggle__star" />
          <div className="bb8-toggle__star" />
          <div className="bb8-toggle__star" />
          <div className="tatto-1" />
          <div className="tatto-2" />
          <div className="gomrassen" />
          <div className="hermes" />
          <div className="chenini" />
          <div className="bb8-toggle__cloud" />
          <div className="bb8-toggle__cloud" />
          <div className="bb8-toggle__cloud" />
        </div>
        <div className="bb8">
          <div className="bb8__head-container">
            <div className="bb8__antenna" />
            <div className="bb8__antenna" />
            <div className="bb8__head" />
          </div>
          <div className="bb8__body" />
        </div>
        <div className="artificial__hidden">
          <div className="bb8__shadow" />
        </div>
      </div>
    </label>
  )
}
