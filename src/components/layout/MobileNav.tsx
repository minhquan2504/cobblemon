"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, BookOpen, Trophy, TrendingUp, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Trang chủ", href: "/", icon: Home },
  { name: "Pokédex", href: "/pokedex", icon: BookOpen },
  { name: "Luật Giải Đấu", href: "/tournament-rules", icon: Trophy },
  { name: "Luật Rank", href: "/rank-rules", icon: TrendingUp },
  { name: "EV Training", href: "/ev-training", icon: Zap },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="fixed top-16 left-0 right-0 bg-background border-b">
            <nav className="p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
