import BB8Toggle from './BB8Toggle'
import ImageCarousel from './ImageCarousel'
import ProfilePic from './ProfilePic'
import VenomButton from './VenomButton'

export default function Header() {
  return (
    <header className="text-center pt-6">
      <div className="flex justify-end mb-2">
        <div className="inline-flex items-center justify-center ml-auto">
          <BB8Toggle />
        </div>
      </div>

      <div className="mb-10">
        <ProfilePic />
        <div className="mb-5">
          <h1 className="font-inter-tight font-bold text-gray-800 dark:text-gray-100 text-2xl mb-1">
            Vitthal Goel
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Beginner Software &amp; AI Engineer
          </p>
        </div>
        <VenomButton />
      </div>

      <ImageCarousel />
    </header>
  )
}
