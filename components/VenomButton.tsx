'use client'

import { useEffect } from 'react'

const STAR_PATH =
  'M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'

// The six stars only become visible once the easter egg is running; until then
// globals.css keeps them display:none.
const STAR_INDICES = [1, 2, 3, 4, 5, 6]

const CTA_CLASS =
  'star-btn btn-sm text-gray-200 dark:text-gray-800 bg-gradient-to-r from-gray-800 to-gray-700 dark:from-gray-300 dark:to-gray-100 dark:hover:bg-gray-100 shadow relative before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white/.2)_50%,transparent_75%,transparent_100%)] dark:before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:[transition:background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] hover:before:duration-[1500ms]'

// "Available For Internships". In light and dark mode lib/venom-button.js
// draws a WebGL goo pill over the canvas and turns the link into an invisible
// hit target; in the Star Wars theme it steps aside for the star button. The
// link stays a real link either way, so the page works without WebGL or JS.
export default function VenomButton() {
  useEffect(() => {
    // The script finds #venom-hit and #venom-stage on load and owns them from
    // then on. Module caching makes it run once, even when Strict Mode mounts
    // this component twice in development.
    import('@/lib/venom-button.js')
  }, [])

  return (
    <span className="venom-slot">
      <a id="venom-hit" className={CTA_CLASS} href="#contact-section">
        Available For Internships
        {STAR_INDICES.map((index) => (
          <div key={index} className={`star-${index}`}>
            <svg viewBox="0 0 784.11 815.53" xmlns="http://www.w3.org/2000/svg">
              <path className="fil0" d={STAR_PATH} />
            </svg>
          </div>
        ))}
      </a>
      <canvas id="venom-stage" className="venom-stage" aria-hidden="true" />
    </span>
  )
}
