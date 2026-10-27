const PROJECTS = [
  {
    image: '/images/summix.png',
    title: 'Summix - AI Powered PDF Summarizer',
    href: 'https://summix.vitthalgoel.com',
  },
  {
    image: '/images/tasktide.png',
    title: 'TaskTide - Task Manager (FastAPI Project)',
    href: 'https://tasktide.vitthalgoel.com',
  },
]

export default function Projects() {
  return (
    <section>
      <h2 className="font-inter-tight text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Featured Projects
      </h2>
      <div className="grid min-[580px]:grid-cols-2 gap-4 group">
        {PROJECTS.map((project) => (
          <article
            key={project.href}
            className="relative aspect-video rounded-xl shadow-lg overflow-hidden min-[580px]:odd:-rotate-2 min-[580px]:even:rotate-2 group-hover:rotate-0 transition duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)]"
          >
            <figure className="absolute inset-0 before:absolute before:inset-0 before:bg-gradient-to-t before:to-75% before:from-gray-950/50 before:to-transparent">
              <img
                className="h-full w-full object-cover"
                src={project.image}
                width={600}
                height={338}
                alt={project.title}
              />
            </figure>
            <div className="relative flex flex-col justify-end h-full w-full px-6 py-5">
              <h3 className="text-sm font-medium text-white">
                {/* The stretched pseudo-element makes the whole card clickable. */}
                <a
                  className="before:absolute before:inset-0"
                  href={project.href}
                  target="_blank"
                >
                  {project.title}
                </a>
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
