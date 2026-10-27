'use client'

import { useState } from 'react'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xblrklqj'

const FIELD_CLASS =
  'w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 focus:border-transparent'

const LABEL_CLASS =
  'block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1'

const BUTTON_CLASS =
  'w-full btn-sm text-gray-200 dark:text-gray-800 bg-gradient-to-r from-gray-800 to-gray-700 dark:from-gray-300 dark:to-gray-100 dark:hover:bg-gray-100 shadow relative before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white/.2)_50%,transparent_75%,transparent_100%)] dark:before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:[transition:background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] hover:before:duration-[1500ms]'

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setStatus('sending')

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) throw new Error('Form submission failed')
      form.reset()
      setStatus('success')
    } catch (error) {
      console.error('Error:', error)
      setStatus('error')
      // Matches the old behaviour — the form stays put so the message isn't
      // lost and the visitor can retry.
      alert('There was an error submitting the form. Please try again.')
    }
  }

  return (
    <div className="p-5 rounded-xl bg-gradient-to-tr from-gray-100 to-gray-50 dark:bg-gradient-to-tr dark:from-gray-800 dark:to-gray-800/[0.65]">
      {/* On success the old page hid the form outright and revealed the
          confirmation in its place. */}
      {status !== 'success' && (
        <form id="contactForm" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className={LABEL_CLASS}>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className={FIELD_CLASS}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="email" className={LABEL_CLASS}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className={FIELD_CLASS}
              />
            </div>
            <div className="mt-4 mb-4">
              <label htmlFor="message" className={LABEL_CLASS}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className={FIELD_CLASS}
              />
            </div>
            <div>
              <button
                type="submit"
                id="submitButton"
                disabled={status === 'sending'}
                className={BUTTON_CLASS}
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </form>
      )}

      {status === 'success' && (
        <div className="mt-1 p-4 bg-green-100 text-green-700 rounded-lg">
          Thank you for your message! I&apos;ll get back to you soon.
        </div>
      )}
    </div>
  )
}
