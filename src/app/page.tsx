import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Zap, 
  Search, 
  Users,
  BarChart3,
  Star
} from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "Pokédex Đầy Đủ",
    description: "Tra cứu thông tin chi tiết về tất cả Pokémon với stats, moves, abilities và evolution tree.",
    href: "/pokedex",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Trophy,
    title: "Luật Giải Đấu",
    description: "Cập nhật luật và format thi đấu mới nhất, banlist và điều kiện đặc biệt.",
    href: "/tournament-rules",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: TrendingUp,
    title: "Luật Rank",
    description: "Hệ thống xếp hạng và luật thi đấu cho từng season với lịch sử thay đổi.",
    href: "/rank-rules",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Zap,
    title: "EV Training Guide",
    description: "Hướng dẫn EV training, calculator và farm guide để tối ưu hóa Pokémon.",
    href: "/ev-training",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Search,
    title: "Tìm Kiếm Thông Minh",
    description: "Tìm kiếm nhanh Pokémon, moves, items và luật với autocomplete.",
    href: "/search",
    color: "from-indigo-500 to-blue-500"
  },
  {
    icon: BarChart3,
    title: "So Sánh Pokémon",
    description: "So sánh stats, type match-up và khả năng của các Pokémon.",
    href: "/compare",
    color: "from-red-500 to-rose-500"
  }
]

const stats = [
  { label: "Pokémon", value: "1000+", description: "Trong database" },
  { label: "Moves", value: "800+", description: "Chiêu thức" },
  { label: "Formats", value: "20+", description: "Format thi đấu" },
  { label: "Users", value: "500+", description: "Thành viên" }
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Cobblemon Hub
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Trung tâm thông tin giải đấu Pokémon cho cộng đồng Cobblemon. 
            Tìm hiểu luật, tra cứu Pokédex và hướng dẫn EV Training.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/pokedex">
                <BookOpen className="mr-2 h-5 w-5" />
                Khám phá Pokédex
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="/tournament-rules">
                <Trophy className="mr-2 h-5 w-5" />
                Xem Luật Giải Đấu
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CSS Test Section (đã gỡ trong production) */}

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tất cả công cụ bạn cần để trở thành master Pokémon trong cộng đồng Cobblemon
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Link href={feature.href}>
                        Khám phá ngay
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sẵn sàng tham gia cộng đồng?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Đăng ký ngay để truy cập đầy đủ tính năng và cập nhật mới nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link href="/auth/signup">
                <Users className="mr-2 h-5 w-5" />
                Đăng ký miễn phí
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/about">
                <Star className="mr-2 h-5 w-5" />
                Tìm hiểu thêm
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}