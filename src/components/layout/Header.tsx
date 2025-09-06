"use client"

import Link from "next/link"
import { MobileNav } from "./MobileNav"
import Image from "next/image"
import { FaDiscord } from "react-icons/fa"

 

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo và Navigation */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo/logo.webp" alt="Harry Cobblemon" width={32} height={32} />
            <span className="font-bold text-xl">Harry Cobblemon</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-10 tracking-wide">
            <Link href="/pokedex" className="nav-link">
              Pokédex
            </Link>
            <Link href="/tournament-rules" className="nav-link">
              Luật Giải Đấu
            </Link>
            <Link href="/rank-rules" className="nav-link">
              Luật Rank
            </Link>
            <Link href="/ev-training" className="nav-link">
              Hướng dẫn EV
            </Link>
          </nav>
        </div>

        {/* Search Bar removed as requested */}

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <MobileNav />
        </div>
        {/* Discord CTA */}
        <div className="hidden md:flex">
          <a
            href="https://discord.gg/Gby4u9g2"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300 uppercase"
          >
            <FaDiscord className="w-6 h-6" />
            THAM GIA DISCORD
          </a>
        </div>
      </div>
    </header>
  )
}
