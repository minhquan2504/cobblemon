import Link from "next/link"
import { Github, Twitter, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo và mô tả */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">PT</span>
              </div>
              <span className="font-bold text-lg">Pokémon Tournament Hub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Trung tâm thông tin giải đấu Pokémon cho cộng đồng Cobblemon. 
              Tìm hiểu luật, tra cứu Pokédex và hướng dẫn EV Training.
            </p>
          </div>

          {/* Liên kết nhanh */}
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

          {/* Hỗ trợ */}
          <div className="space-y-4">
            <h3 className="font-semibold">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                  Trợ giúp
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/bug-report" className="text-muted-foreground hover:text-foreground transition-colors">
                  Báo lỗi
                </Link>
              </li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div className="space-y-4">
            <h3 className="font-semibold">Liên hệ</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:support@pokemontournament.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2024 Pokémon Tournament Hub. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
