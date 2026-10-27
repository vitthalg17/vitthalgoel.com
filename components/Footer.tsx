const ICON_CLASS =
  'w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600/[0.65] shadow-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-colors'

export default function Footer() {
  // Evaluated during `next build`, which is correct for a static export: the
  // year is baked into the HTML instead of being patched in by JS on load.
  // A site left deployed across a New Year needs a rebuild to roll over.
  const year = new Date().getFullYear()

  return (
    <footer className="space-y-12 text-center pb-16">
      <div className="space-y-6">
        <ul className="inline-flex gap-4">
          <li>
            <a
              className={ICON_CLASS}
              href="https://www.twitter.com/@vitthal_goel"
              target="_blank"
              aria-label="Twitter"
            >
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="16"
                height="16"
              >
                <path d="M16 3.039a6.461 6.461 0 0 1-1.885.516A3.301 3.301 0 0 0 15.555 2c-.638.378-1.348.654-2.104.805A3.286 3.286 0 0 0 7.875 5.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 5.578v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115c-.211 0-.417-.021-.616-.061a3.293 3.293 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.142-.004-.284-.01-.425A6.673 6.673 0 0 0 16 3.039z" />
              </svg>
            </a>
          </li>
          <li>
            <a
              className={ICON_CLASS}
              href="https://github.com/vitthalg17"
              target="_blank"
              aria-label="GitHub"
            >
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
              >
                <path d="M7.95 0C3.578 0 0 3.578 0 7.95c0 3.479 2.286 6.46 5.466 7.553.397.1.497-.199.497-.397v-1.392c-2.187.497-2.683-.994-2.683-.994-.398-.894-.895-1.192-.895-1.192-.696-.497.1-.497.1-.497.795.1 1.192.795 1.192.795.696 1.292 1.888.894 2.286.696.1-.497.298-.895.497-1.093-1.79-.2-3.578-.895-3.578-3.976 0-.894.298-1.59.795-2.087-.1-.198-.397-.993.1-2.086 0 0 .695-.2 2.186.795a6.408 6.408 0 0 1 1.987-.299c.696 0 1.392.1 1.988.299 1.49-.994 2.186-.796 2.186-.796.398 1.094.199 1.889.1 2.087.496.597.795 1.292.795 2.087 0 3.081-1.889 3.677-3.677 3.876.298.398.596.895.596 1.59v2.187c0 .198.1.496.596.397C13.714 14.41 16 11.43 16 7.95 15.9 3.578 12.323 0 7.95 0Z" />
              </svg>
            </a>
          </li>
          <li>
            <a
              className={ICON_CLASS}
              href="https://www.linkedin.com/in/vitthalgoel/"
              target="_blank"
              aria-label="LinkedIn"
            >
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
              >
                <path d="M13 0H1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zM4 12H2V5h2v7zM3 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm9 8h-2V9c0-.6-.4-1-1-1s-1 .4-1 1v3H6V5h2v1.2c.4-.7 1.2-1.2 2-1.2 1.6 0 3 1.3 3 3v4z" />
              </svg>
            </a>
          </li>
        </ul>
        <p className="text-sm text-gray-400 dark:text-gray-600">
          &copy; {year} Vitthal Goel. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
