import NextImage, { ImageProps } from 'next/image'

const basePath = process.env.BASE_PATH

const Image = ({ src, ...rest }: ImageProps) => (
  <NextImage
    src={`${basePath || ''}${src}`}
    placeholder={rest.placeholder ?? 'empty'}
    loading={rest.loading ?? 'lazy'}
    {...rest}
  />
)

export default Image
