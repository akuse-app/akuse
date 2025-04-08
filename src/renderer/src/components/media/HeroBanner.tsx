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
      className={cn(
        'relative w-full flex items-end text-white overflow-hidden',
        className
      )}
    >
      {/* Banner Image */}
      <img
        src={media.bannerImage?.extraLarge}
        alt={media.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl px-6 pb-16 md:px-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          {media.title}
        </h1>
        <p className="text-sm md:text-base max-w-xl text-muted-foreground mb-6 line-clamp-3">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sed turpis ac justo viverra convallis.
        </p>
        <Button variant="default" className="text-base">
          Guarda ora
        </Button>
      </div>
    </section>
  )
}

export default HeroBanner
