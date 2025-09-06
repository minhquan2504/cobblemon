import Link from "next/link"
import { Facebook, Link as LinkIcon } from "lucide-react"
import { FaDiscord } from "react-icons/fa"

 

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Cột trái: Logo và mô tả */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/logo/logo.webp" alt="Harry Cobblemon" className="h-6 w-6" />
              <span className="font-bold text-lg">Harry Cobblemon</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Server Cobblemon chính thức. Tham gia thưởng đấu, tra cứu Pokédex và khám phá meta Muôn vàn Pokémon.
            </p>
          </div>

          {/* Cột giữa: Liên kết nhanh */}
          <div className="space-y-4">
            <h3 className="font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pokedex" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pokédex
                </Link>
              </li>
              <li>
                <Link href="/tournament-rules" className="text-muted-foreground hover:text-foreground transition-colors">
                  Luật Giải Đấu
                </Link>
              </li>
              <li>
                <Link href="/rank-rules" className="text-muted-foreground hover:text-foreground transition-colors">
                  Luật Rank
                </Link>
              </li>
              <li>
                <Link href="/ev-training" className="text-muted-foreground hover:text-foreground transition-colors">
                  EV Training
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột phải: Liên hệ + Discord & Icons cùng hàng */}
          <div className="space-y-4 md:text-right md:flex md:flex-col md:items-end">
            <h3 className="font-semibold">Liên hệ</h3>
            <div className="flex items-center gap-4">
              <a
                href="https://discord.gg/Gby4u9g2"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
              >
                <FaDiscord className="w-6 h-6" />
                JOIN US ON DISCORD
              </a>
              <a
                href="https://www.facebook.com/quan.hominh.52"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Facebook className="h-7 w-7 md:h-8 md:w-8" />
              </a>
              <a
                href="https://discord.gg/Gby4u9g2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <LinkIcon className="h-7 w-7 md:h-8 md:w-8" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              © {new Date().getFullYear()} Harry Cobblemon. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
