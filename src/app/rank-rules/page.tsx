"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Trophy, Calendar, Users } from "lucide-react"

interface Season {
  id: number
  name: string
  startDate: string
  endDate: string
  active: boolean
  ruleset: string
  participants: number
}

interface RankRule {
  id: number
  seasonId: number
  title: string
  description: string
  category: string
  priority: number
}

interface LeaderboardEntry {
  id: number
  playerName: string
  rating: number
  wins: number
  losses: number
  winRate: number
  rank: number
}

// Mock data
const mockSeasons: Season[] = [
  {
    id: 1,
    name: "Season 1 - 2024",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    active: true,
    ruleset: "VGC 2024 Regulation F",
    participants: 1250
  },
  {
    id: 2,
    name: "Season 2 - 2024",
    startDate: "2024-04-01",
    endDate: "2024-06-30",
    active: false,
    ruleset: "VGC 2024 Regulation G",
    participants: 1180
  },
  {
    id: 3,
    name: "Season 3 - 2024",
    startDate: "2024-07-01",
    endDate: "2024-09-30",
    active: false,
    ruleset: "VGC 2024 Regulation H",
    participants: 1320
  }
]

const mockRankRules: RankRule[] = [
  {
    id: 1,
    seasonId: 1,
    title: "Hệ thống Elo Rating",
    description: "Sử dụng hệ thống Elo để tính điểm dựa trên kết quả trận đấu",
    category: "Scoring",
    priority: 1
  },
  {
    id: 2,
    seasonId: 1,
    title: "Điều kiện tham gia",
    description: "Người chơi phải có ít nhất 10 trận đấu để được xếp hạng",
    category: "Eligibility",
    priority: 2
  },
  {
    id: 3,
    seasonId: 1,
    title: "Reset điểm mùa",
    description: "Điểm sẽ được reset về 1000 khi bắt đầu mùa mới",
    category: "Reset",
    priority: 3
  },
  {
    id: 4,
    seasonId: 1,
    title: "Thời gian thi đấu",
    description: "Mỗi trận đấu có thời gian tối đa 20 phút",
    category: "Time",
    priority: 4
  },
  {
    id: 5,
    seasonId: 1,
    title: "Cấm sử dụng hack",
    description: "Nghiêm cấm sử dụng hack, cheat hoặc bất kỳ hình thức gian lận nào",
    category: "Fair Play",
    priority: 5
  }
]

const mockLeaderboard: LeaderboardEntry[] = [
  { id: 1, playerName: "PokemonMaster123", rating: 1850, wins: 45, losses: 12, winRate: 78.9, rank: 1 },
  { id: 2, playerName: "CobblemonPro", rating: 1820, wins: 42, losses: 15, winRate: 73.7, rank: 2 },
  { id: 3, playerName: "VGCChampion", rating: 1795, wins: 38, losses: 18, winRate: 67.9, rank: 3 },
  { id: 4, playerName: "EliteTrainer", rating: 1760, wins: 35, losses: 20, winRate: 63.6, rank: 4 },
  { id: 5, playerName: "BattleAce", rating: 1730, wins: 32, losses: 22, winRate: 59.3, rank: 5 },
  { id: 6, playerName: "PokemonKing", rating: 1700, wins: 30, losses: 25, winRate: 54.5, rank: 6 },
  { id: 7, playerName: "CobblemonElite", rating: 1675, wins: 28, losses: 27, winRate: 50.9, rank: 7 },
  { id: 8, playerName: "VGCWarrior", rating: 1650, wins: 26, losses: 29, winRate: 47.3, rank: 8 },
  { id: 9, playerName: "BattleMaster", rating: 1620, wins: 24, losses: 31, winRate: 43.6, rank: 9 },
  { id: 10, playerName: "PokemonAce", rating: 1595, wins: 22, losses: 33, winRate: 40.0, rank: 10 }
]

const ruleCategories = [
  { value: "all", label: "Tất cả" },
  { value: "Scoring", label: "Hệ thống điểm" },
  { value: "Eligibility", label: "Điều kiện tham gia" },
  { value: "Reset", label: "Reset điểm" },
  { value: "Time", label: "Thời gian" },
  { value: "Fair Play", label: "Công bằng" }
]

export default function RankRulesPage() {
  const [seasons, setSeasons] = useState<Season[]>([])
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null)
  const [rankRules, setRankRules] = useState<RankRule[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    setSeasons(mockSeasons)
    setSelectedSeason(mockSeasons.find(s => s.active) || mockSeasons[0])
  }, [])

  useEffect(() => {
    if (selectedSeason) {
      const seasonRules = mockRankRules.filter(rule => rule.seasonId === selectedSeason.id)
      setRankRules(seasonRules)
      setLeaderboard(mockLeaderboard)
    }
  }, [selectedSeason])

  const filteredRules = selectedCategory === "all" 
    ? rankRules 
    : rankRules.filter(rule => rule.category === selectedCategory)

  const getRankBadgeColor = (rank: number) => {
    if (rank <= 3) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    if (rank <= 10) return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return `#${rank}`
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Luật Rank</h1>
        <p className="text-xl text-muted-foreground">
          Hệ thống xếp hạng và luật thi đấu cho từng season
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Season Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Seasons</CardTitle>
              <CardDescription>Chọn season để xem luật</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {seasons.map(season => (
                <Button
                  key={season.id}
                  variant={selectedSeason?.id === season.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedSeason(season)}
                >
                  <div className="text-left">
                    <div className="font-medium">{season.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {season.startDate} - {season.endDate}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant={season.active ? "default" : "secondary"} className="text-xs">
                        {season.active ? "Active" : "Ended"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {season.participants} players
                      </span>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedSeason ? (
            <Tabs defaultValue="rules" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="rules">Luật Rank</TabsTrigger>
                <TabsTrigger value="leaderboard">Bảng xếp hạng</TabsTrigger>
                <TabsTrigger value="info">Thông tin Season</TabsTrigger>
              </TabsList>

              <TabsContent value="rules" className="space-y-6">
                {/* Category Filter */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Luật Rank - {selectedSeason.name}</CardTitle>
                        <CardDescription>{selectedSeason.ruleset}</CardDescription>
                      </div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          {ruleCategories.map(category => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredRules.map(rule => (
                        <Card key={rule.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold">{rule.title}</h3>
                                  <Badge variant="outline">{rule.category}</Badge>
                                </div>
                                <p className="text-muted-foreground">{rule.description}</p>
                              </div>
                              <Badge variant="secondary" className="ml-4">
                                Priority {rule.priority}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="leaderboard" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Bảng xếp hạng - {selectedSeason.name}
                    </CardTitle>
                    <CardDescription>
                      Top {leaderboard.length} người chơi hàng đầu
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {leaderboard.map(entry => (
                        <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="text-2xl font-bold w-8">
                              {getRankIcon(entry.rank)}
                            </div>
                            <div>
                              <div className="font-semibold">{entry.playerName}</div>
                              <div className="text-sm text-muted-foreground">
                                {entry.wins}W - {entry.losses}L ({entry.winRate.toFixed(1)}%)
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{entry.rating}</div>
                            <Badge className={getRankBadgeColor(entry.rank)}>
                              Rank {entry.rank}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="info" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Thông tin Season
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium">Tên Season</h4>
                        <p className="text-muted-foreground">{selectedSeason.name}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Thời gian</h4>
                        <p className="text-muted-foreground">
                          {new Date(selectedSeason.startDate).toLocaleDateString('vi-VN')} - {new Date(selectedSeason.endDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">Ruleset</h4>
                        <p className="text-muted-foreground">{selectedSeason.ruleset}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Trạng thái</h4>
                        <Badge variant={selectedSeason.active ? "default" : "secondary"}>
                          {selectedSeason.active ? "Đang diễn ra" : "Đã kết thúc"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Thống kê
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Tổng người chơi</span>
                        <span className="text-2xl font-bold">{selectedSeason.participants}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Tổng luật</span>
                        <span className="text-2xl font-bold">{rankRules.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Trung bình rating</span>
                        <span className="text-2xl font-bold">
                          {Math.round(leaderboard.reduce((sum, entry) => sum + entry.rating, 0) / leaderboard.length)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chọn một season để xem luật</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
