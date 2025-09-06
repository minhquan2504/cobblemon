"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, Shield, BarChart3 } from "lucide-react"
import { MobileNav } from "./MobileNav"
import { GlobalSearch } from "../search/GlobalSearch"
import { RoleGuard } from "../auth/RoleGuard"
import Image from "next/image"

export function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo và Navigation */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">PT</span>
            </div>
            <span className="font-bold text-xl">Cobblemon Hub</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/pokedex" className="nav-link">
              Pokédex
            </Link>
            <Link href="/tournament-rules" className="nav-link">
              Tournament Rules
            </Link>
            <Link href="/rank-rules" className="nav-link">
              Rank Rules
            </Link>
            <Link href="/ev-training" className="nav-link">
              EV Training
            </Link>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <GlobalSearch placeholder="Tìm kiếm Pokémon, moves, items..." />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <MobileNav />
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {status === "loading" ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user?.name || "Người dùng"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Vai trò: {session.user?.role === "admin" ? "Quản trị viên" : 
                               session.user?.role === "mod" ? "Điều hành viên" : "Người xem"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Hồ sơ cá nhân</span>
                  </Link>
                </DropdownMenuItem>
                {session.user?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Quản trị</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Cài đặt</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => signIn()}>
                Đăng nhập
              </Button>
              <Button onClick={() => signIn()}>
                Đăng ký
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
