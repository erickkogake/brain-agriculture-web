'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, Home, CalendarDays, Sprout, ExternalLink, Leaf,
} from 'lucide-react'

const navItems = [
  { href: '/',            label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/produtores',  label: 'Produtores', icon: Users },
  { href: '/fazendas',    label: 'Fazendas',   icon: Home },
  { href: '/safras',      label: 'Safras',     icon: CalendarDays },
  { href: '/culturas',    label: 'Culturas',   icon: Sprout },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-stone-950 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-stone-800/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-meadow-600 flex items-center justify-center flex-shrink-0">
            <Leaf className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <div>
            <div className="font-display text-white text-sm font-semibold leading-tight">
              Brain Agriculture
            </div>
            <div className="text-stone-500 text-[10px] uppercase tracking-widest mt-0.5">
              Gestão Rural
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        <p className="text-stone-600 text-[10px] uppercase tracking-widest font-medium px-3 mb-3">
          Menu
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
                active
                  ? 'bg-meadow-600/20 text-meadow-400'
                  : 'text-stone-400 hover:bg-stone-800/60 hover:text-stone-200',
              )}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-meadow-400' : 'text-stone-500')} />
              {label}
            </Link>
          )
        })}

        <div className="pt-4 mt-4 border-t border-stone-800/60">
          <p className="text-stone-600 text-[10px] uppercase tracking-widest font-medium px-3 mb-3">
            Sistema
          </p>
          <a
            href="http://localhost:3000/docs"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-400 hover:bg-stone-800/60 hover:text-stone-200 transition-all"
          >
            <ExternalLink className="w-4 h-4 text-stone-500" />
            API Docs
          </a>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-stone-800/60">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-meadow-400 animate-pulse-slow" />
          <span className="text-stone-500 text-xs">API conectada</span>
        </div>
      </div>
    </aside>
  )
}
