import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const Header = () => {
  return (
    <header className="glass-card via-primary-50/70 ring-primary-100/70 sticky top-4 z-50 mb-8 flex items-center justify-between rounded-3xl bg-gradient-to-r from-white/85 to-white/85 px-6 py-4 shadow-md transition-all dark:from-gray-900/80 dark:via-gray-900/70 dark:to-gray-900/80">
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          <div className="mr-3">
            <Logo className="fill-primary-700 dark:fill-primary-200 h-8 w-auto" />
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="text-primary-800 dark:text-primary-100 hidden h-6 text-xl font-bold tracking-wide sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-primary-800 hover:text-primary-600 dark:text-primary-100 dark:hover:text-primary-200 font-medium transition"
              >
                {link.title}
              </Link>
            ))}
        </div>
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
