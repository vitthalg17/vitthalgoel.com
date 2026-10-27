'use client'

import { useStarWars } from './StarWarsProvider'

// The way into the Star Wars easter egg. Hover, click and the 30s prompt are
// all handled by StarWarsProvider, which drives the reveal from this picture.
export default function ProfilePic() {
  const { picRef, prompting } = useStarWars()

  return (
    <span className={`sw-pfp${prompting ? ' sw-prompt' : ''}`}>
      <img
        ref={picRef}
        id="profile-pic"
        // Inside the Venom button's canvas, but not part of it: without this
        // the goo reaches for a cursor hovering the picture and swaps in its
        // 3D hand, which the reveal's snapshot then freezes on screen.
        data-venom-ignore=""
        className="inline-flex rounded-full shadow-lg mb-4"
        style={{ touchAction: 'manipulation' }}
        src="/images/unnamed.webp"
        width={48}
        height={48}
        alt="Vitthal Goel"
      />
    </span>
  )
}
