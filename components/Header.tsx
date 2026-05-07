import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 mb-8 flex items-center justify-between border-b border-black/6 bg-[rgba(248,250,252,0.88)] py-3.5 backdrop-blur-md dark:border-white/8 dark:bg-[rgba(3,7,18,0.76)]">
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          <div className="mr-3">
            <Logo className="fill-primary-700 dark:fill-primary-200 h-7 w-auto" />
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="dark:text-primary-100 hidden h-6 text-[1.05rem] font-medium text-gray-900 sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-5">
        <div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="hover:text-primary-700 dark:hover:text-primary-200 text-[0.92rem] text-gray-500 transition dark:text-gray-400"
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
