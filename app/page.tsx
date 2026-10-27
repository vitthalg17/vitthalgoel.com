import ContactForm from '@/components/ContactForm'
import Education from '@/components/Education'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Languages from '@/components/Languages'
import Projects from '@/components/Projects'
import StarWarsProvider from '@/components/StarWarsProvider'

export default function Home() {
  return (
    // StarWarsProvider also renders the hyperspace canvas, which has to sit
    // outside the content wrapper below — that wrapper is what globals.css
    // lifts above the starfield with `body > .overflow-hidden`.
    <StarWarsProvider>
      <div className="overflow-hidden supports-[overflow:clip]:overflow-clip">
        <div className="max-w-[728px] mx-auto">
          <div className="w-full sw-frame bg-white dark:bg-gray-900 border-x border-gray-100 dark:border-gray-800 box-content">
            <div className="px-3 md:px-16">
              <div className="flex flex-col min-h-screen">
                <Header />

                <main className="grow py-12 space-y-12">
                  <Education />
                  <Projects />
                  <Languages />

                  <section id="contact-section" className="mb-4">
                    <h2 className="font-inter-tight text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">
                      Contact Me
                    </h2>
                    <ContactForm />
                  </section>
                </main>

                <Footer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </StarWarsProvider>
  )
}
