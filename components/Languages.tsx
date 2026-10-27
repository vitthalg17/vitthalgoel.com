const LANGUAGES = [
  {
    logo: '/images/logos/Python.webp',
    alt: 'Python Logo',
    name: 'Python',
    body: 'Proficient in Python for AI/ML, web development, and scripting.',
  },
  {
    logo: '/images/logos/JavaScript.webp',
    alt: 'JavaScript Logo',
    name: 'JavaScript',
    body: 'Experienced in JavaScript for web development, including frontend frameworks.',
  },
  {
    logo: '/images/logos/HTMLCSS.webp',
    alt: 'HTML & CSS Logo',
    name: 'HTML & CSS',
    body: 'Proficient in HTML and CSS for building responsive and accessible web interfaces.',
  },
  {
    logo: '/images/logos/C.webp',
    alt: 'C Language Logo',
    name: 'C',
    body: 'Strong foundation in C programming for system-level and embedded applications.',
  },
]

export default function Languages() {
  return (
    <section>
      <h2 className="font-inter-tight text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Coding Languages
      </h2>
      <div className="grid min-[580px]:grid-cols-2 gap-4">
        {LANGUAGES.map((language) => (
          <article
            key={language.name}
            className="relative p-5 rounded-xl odd:bg-gradient-to-tr odd:from-gray-100 odd:to-gray-50 dark:odd:bg-gradient-to-tr dark:odd:from-gray-800 dark:odd:to-gray-800/[0.65] group"
          >
            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600/[0.65] shadow-sm mb-4">
              <img
                src={language.logo}
                alt={language.alt}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                <a className="before:absolute before:inset-0" href="#0">
                  {language.name}
                </a>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
