const SUBTITLE = 'text-[13px] font-medium text-gray-600 dark:text-gray-400'

// Same thing with a space missing after `text-gray-600`, which fuses the two
// class names into one unknown token — so neither colour lands and the line
// inherits from <body> instead. The old site has this on the Amity and MRIS
// entries only; Writesonic's is written correctly. Kept verbatim so the port
// stays pixel-identical. To fix it, point those two entries at SUBTITLE.
const SUBTITLE_LEGACY =
  'text-[13px] font-medium text-gray-600dark:text-gray-400'

const ENTRIES = [
  {
    logo: '/images/writesonic.svg',
    alt: 'Writesonic logo',
    period: 'May 2026 - July 2026',
    title: 'Writesonic',
    href: 'https://writesonic.com',
    subtitle: 'Software Engineering Intern',
    subtitleClass: SUBTITLE,
    body: 'Full-time Software Engineering Internship',
  },
  {
    logo: '/images/Amity.png',
    alt: 'Amity University logo',
    period: '2024 - 2028',
    title: 'Amity University',
    href: '#0',
    subtitle: 'Noida, India',
    subtitleClass: SUBTITLE_LEGACY,
    body: 'Bachelors of Technology in Artifical Intelligence',
  },
  {
    logo: '/images/MRIS.png',
    alt: 'Manav Rachna International School logo',
    period: '2011 - 2024',
    title: 'Manav Rachna International School',
    href: '#0',
    subtitle: 'Noida, India',
    subtitleClass: SUBTITLE_LEGACY,
    body: 'Grade 1 to 12',
  },
]

export default function Education() {
  return (
    <section>
      <h2 className="font-inter-tight text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Education and Experience
      </h2>
      <div className="space-y-1">
        {ENTRIES.map((entry) => (
          // The alternating card background comes from `odd:` variants, so the
          // rendered order of these articles is what decides which ones are
          // tinted — don't reorder without checking the result.
          <article
            key={entry.title}
            className="p-5 rounded-xl odd:bg-gradient-to-tr odd:from-gray-100 odd:to-gray-50 dark:odd:bg-gradient-to-tr dark:odd:from-gray-800 dark:odd:to-gray-800/[0.65]"
          >
            <div className="sm:flex gap-5">
              <div className="w-11 h-11 rounded-full flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600/[0.65] shadow-sm mb-4">
                <img src={entry.logo} alt={entry.alt} width={44} height={44} />
              </div>
              <div>
                <div className="space-y-1.5 mb-3">
                  <div className="text-[13px] italic text-gray-500/70">
                    {entry.period}
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    <a
                      className="hover:underline decoration-2 decoration-gray-300 dark:decoration-gray-600 underline-offset-2"
                      href={entry.href}
                    >
                      {entry.title}
                    </a>
                  </h3>
                  <div className={entry.subtitleClass}>
                    {entry.subtitle}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {entry.body}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
