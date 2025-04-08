import React from 'react'
import { cn } from '@renderer/lib/utils'
import { Button } from '@renderer/components/ui/button'
import { MediaData } from '@/models/media'

type HeroBannerProps = {
  media: MediaData
  className?: string
}

const HeroBanner: React.FC<HeroBannerProps> = ({ media, className }) => {
  return (
    <section
      className={cn('relative w-full flex items-end text-white overflow-hidden', className)}
    >
      <img src={media.bannerImage?.extraLarge} alt={media.title} />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background w-[50%]" />

      <div className="absolute z-10 max-w-5xl px-6 pb-16 md:px-10">
        <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">{media.title}</h1>
        <p className="text-sm md:text-base max-w-xl text-muted-foreground mb-6 line-clamp-3">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sed turpis ac justo
          viverra convallis.
        </p>

        <div className="flex gap-5">
          <Button variant="muted" className="text-base">
            Guarda ora
          </Button>
          <Button variant="muted" className="text-base">
            More Info
          </Button>
        </div>
      </div>
    </section>
  )
}

export default HeroBanner
