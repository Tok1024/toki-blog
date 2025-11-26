import Link from '@/components/Link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center pt-24 text-center">
      <h1 className="text-primary-600 dark:text-primary-400 text-9xl font-extrabold tracking-tight">
        404
      </h1>
      <div className="mt-8 max-w-md space-y-4">
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">Page not found</p>
        <p className="text-gray-500 dark:text-gray-400">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link
          href="/"
          className="bg-primary-600 hover:bg-primary-500 focus:ring-primary-500 inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm transition focus:ring-2 focus:ring-offset-2 focus:outline-none dark:ring-offset-gray-900"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  )
}
