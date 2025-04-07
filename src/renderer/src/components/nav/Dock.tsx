import { cn } from '@/lib/utils'
import { Bookmark, Heart, Home, User } from 'lucide-react'
import { Link, useLocation } from 'wouter'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Library', href: '/library', icon: Bookmark },
  { name: 'Bomba', href: '/1', icon: Heart },
  { name: 'Profilo', href: '/2', icon: User }
]

const Dock = () => {
  const [location] = useLocation()

  return (
    <div className="fixed bottom-5 left-[50%] -translate-x-2/4 p-1 bg-card backdrop-blur-md border-t rounded-2xl bg-dock">
      <nav className="grid grid-cols-4 gap-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'relative border-solid inline-flex flex-col items-center justify-center px-5 py-3 text-white',
              'hover:scale-125',
              'active:scale-100',
              location === item.href ? 'text-white' : 'opacity-50'
            )}
          >
            {/* {location === item.href && (
              <div className="absolute bottom-0 w-[18px] h-[4px] bg-red-500 rounded-full" />
            )} */}

            <item.icon className={'text-lg h-5 w-5'} strokeWidth={2} />
            
            {/* <span className="mt-1 text-xs font-medium">{item.name}</span> */}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Dock
