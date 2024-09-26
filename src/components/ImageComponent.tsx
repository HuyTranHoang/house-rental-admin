import { PropertyImage } from '@/types/property.type.ts'
import { useState } from 'react'
import { Blurhash } from 'react-blurhash'
import { Image } from 'antd'
import { EyeOutlined } from '@ant-design/icons'

interface ImageComponentProps {
  image: PropertyImage
  className?: string
}

function ImageComponent({ image, className }: ImageComponentProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <>
      {!imageLoaded && <Blurhash hash={image.blurhash} className='w-full h-full' />}

      <Image
        preview={{
          mask: (
            <>
              <EyeOutlined style={{ marginRight: 6 }} /> Chi tiết
            </>
          )
        }}
        src={image.imageUrl}
        alt={image.imageUrl}
        onLoad={() => setImageLoaded(true)}
        style={{ display: imageLoaded ? 'block' : 'none' }}
        className={className}
      />
    </>
  )
}

export default ImageComponent
