import Image from './Image'
import Link from './Link'

const Card = ({ title, description, imgSrc, href }) => (
  <div className="md max-w-[544px] p-4 md:w-1/2">
    <div
      className={`${
        imgSrc && 'h-full'
      } glass-card group via-primary-50/70 overflow-hidden rounded-3xl bg-gradient-to-br from-white/95 to-white/95 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900`}
    >
      {imgSrc &&
        (href ? (
          <Link href={href} aria-label={`Link to ${title}`}>
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover object-center transition duration-300 group-hover:scale-105 md:h-36 lg:h-48"
              width={544}
              height={306}
            />
          </Link>
        ) : (
          <Image
            alt={title}
            src={imgSrc}
            className="object-cover object-center md:h-36 lg:h-48"
            width={544}
            height={306}
          />
        ))}
      <div className="p-6">
        <h2 className="mb-3 text-2xl leading-8 font-bold tracking-tight">
          {href ? (
            <Link href={href} aria-label={`Link to ${title}`}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="prose text-primary-800/80 dark:text-primary-100/80 mb-3 max-w-none">
          {description}
        </p>
        {href && (
          <Link
            href={href}
            className="text-primary-700 hover:text-primary-600 dark:text-primary-200 dark:hover:text-primary-100 text-base leading-6 font-medium"
            aria-label={`Link to ${title}`}
          >
            Learn more &rarr;
          </Link>
        )}
      </div>
    </div>
  </div>
)

export default Card
