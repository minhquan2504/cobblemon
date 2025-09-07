"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { TrendingUp, Calendar, Users } from "lucide-react"
import { fetchBannedLists, SeasonEntry } from "@/lib/rank"
import { SeasonTable } from "@/components/rank/SeasonTable"

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
  const [seasonInfo, setSeasonInfo] = useState<Record<number, { time?: string; note?: string }>>({})

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

  useEffect(() => {
    fetch('/season-info.json').then(r => r.ok ? r.json() : {}).then((data) => {
      if (data) setSeasonInfo(data)
    }).catch(() => {})
  }, [])

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

  const [bans, setBans] = useState<{ pok: string[]; held: string[]; carried: string[]; moves: string[] }>({ pok: [], held: [], carried: [], moves: [] })
  const [searchQuery, setSearchQuery] = useState("")
  const [seasonTab, setSeasonTab] = useState<'s1' | 's2' | 's3'>('s2')
  useEffect(() => {
    // Read the full global rank bans from JSON if available; fallback to txt inside fetchBannedLists
    fetchBannedLists().then(data => setBans({ pok: data.bannedPokemon, held: data.bannedHeldItems, carried: data.bannedCarriedItems, moves: data.bannedMoves })).catch(() => {})
  }, [])

  const s1v1: SeasonEntry[] = [
    { rank: 1, name: "CHAULOC", elo: 1031, wins: 2, losses: 0, disconnects: 0 },
    { rank: 2, name: "DDUowg", elo: 1018, wins: 2, losses: 1, disconnects: 0 },
    { rank: 3, name: "huyhayho", elo: 1017, wins: 1, losses: 0, disconnects: 0 },
    { rank: 4, name: "Waraino", elo: 1016, wins: 1, losses: 0, disconnects: 0 },
    { rank: 5, name: "Pheo8", elo: 1015, wins: 3, losses: 2, disconnects: 1 },
    { rank: 6, name: "DHTB_234", elo: 1000, wins: 1, losses: 1, disconnects: 0 },
    { rank: 7, name: "WinJ", elo: 995, wins: 3, losses: 3, disconnects: 1 },
    { rank: 8, name: "ABai", elo: 985, wins: 0, losses: 1, disconnects: 0 },
    { rank: 9, name: "kundz24", elo: 984, wins: 0, losses: 1, disconnects: 0 },
    { rank: 10, name: "HarryDepZai", elo: 970, wins: 0, losses: 2, disconnects: 0 },
  ]
  const s1v2: SeasonEntry[] = [
    { rank: 1, name: "WinJ", elo: 1016, wins: 1, losses: 0, disconnects: 0 },
    { rank: 2, name: "naniahiaha", elo: 984, wins: 0, losses: 1, disconnects: 0 },
  ]
  const s2v1: SeasonEntry[] = [
    { rank: 1, name: "suthaibopdai", elo: 1454, wins: 68, losses: 7, disconnects: 1 },
    { rank: 2, name: "HikaruMaruyama", elo: 1339, wins: 50, losses: 2, disconnects: 1 },
    { rank: 3, name: "Hoang3108", elo: 1208, wins: 91, losses: 24, disconnects: 0 },
    { rank: 4, name: "kiettuando", elo: 1166, wins: 19, losses: 3, disconnects: 0 },
    { rank: 5, name: "slim3", elo: 1148, wins: 20, losses: 6, disconnects: 0 },
    { rank: 6, name: "siro1256", elo: 1147, wins: 23, losses: 7, disconnects: 0 },
    { rank: 7, name: "NamTheGame", elo: 1100, wins: 8, losses: 7, disconnects: 1 },
    { rank: 8, name: "nhatprozz", elo: 1088, wins: 22, losses: 8, disconnects: 0 },
    { rank: 9, name: "AQD2124", elo: 1066, wins: 18, losses: 14, disconnects: 1 },
    { rank: 10, name: "natsuandhao", elo: 1056, wins: 6, losses: 3, disconnects: 0 },
  ]
  const s2v2: SeasonEntry[] = [
    { rank: 1, name: "AQD2124", elo: 1317, wins: 46, losses: 3, disconnects: 0 },
    { rank: 2, name: "kiettuando", elo: 1227, wins: 37, losses: 6, disconnects: 2 },
    { rank: 3, name: "meaningggg", elo: 1143, wins: 13, losses: 0, disconnects: 0 },
    { rank: 4, name: "Hoang3108", elo: 1121, wins: 18, losses: 2, disconnects: 0 },
    { rank: 5, name: "Kendumboy_", elo: 1016, wins: 1, losses: 0, disconnects: 0 },
    { rank: 6, name: "DANNs", elo: 1016, wins: 1, losses: 0, disconnects: 0 },
    { rank: 7, name: "cacdianhthtin", elo: 1016, wins: 1, losses: 0, disconnects: 0 },
    { rank: 8, name: "CHAULOC", elo: 1016, wins: 1, losses: 0, disconnects: 0 },
    { rank: 9, name: "yrt1", elo: 1016, wins: 2, losses: 1, disconnects: 0 },
    { rank: 10, name: "_iBlank_", elo: 1015, wins: 5, losses: 3, disconnects: 0 },
  ]

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
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
        {/* Season Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin Season</CardTitle>
              <CardDescription>Thời gian và ghi chú</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <h4 className="font-medium">Thời gian</h4>
                  <p className="text-muted-foreground">{seasonInfo[selectedSeason?.id ?? 0]?.time || "Chưa cập nhật"}</p>
                </div>
                {seasonInfo[selectedSeason?.id ?? 0]?.note && (
                  <div>
                    <h4 className="font-medium">Ghi chú</h4>
                    <p className="text-muted-foreground">{seasonInfo[selectedSeason?.id ?? 0]?.note}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedSeason ? (
            <Tabs defaultValue="rules" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="rules">Luật Rank</TabsTrigger>
                <TabsTrigger value="seasons">Seasons</TabsTrigger>
              </TabsList>

              <TabsContent value="rules" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Luật Rank</CardTitle>
                    <CardDescription>Danh sách ban áp dụng toàn bộ Season</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="flex-1">
                        <Input placeholder="Tìm kiếm Pokémon, item, move..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                      </div>
                    </div>
                    <Tabs defaultValue="pokemon" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="pokemon">Pokémon</TabsTrigger>
                        <TabsTrigger value="held">Held Items</TabsTrigger>
                        <TabsTrigger value="carried">Carried Items</TabsTrigger>
                        <TabsTrigger value="moves">Moves</TabsTrigger>
                      </TabsList>
                      <TabsContent value="pokemon" className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {bans.pok.filter(x => x.toLowerCase().includes(searchQuery.toLowerCase())).map((x, i) => (<Badge key={i} variant="outline">{x}</Badge>))}
                        </div>
                      </TabsContent>
                      <TabsContent value="held" className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {bans.held.filter(x => x.toLowerCase().includes(searchQuery.toLowerCase())).map((x, i) => (<Badge key={i} variant="outline">{x}</Badge>))}
                        </div>
                      </TabsContent>
                      <TabsContent value="carried" className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {bans.carried.filter(x => x.toLowerCase().includes(searchQuery.toLowerCase())).map((x, i) => (<Badge key={i} variant="outline">{x}</Badge>))}
                        </div>
                      </TabsContent>
                      <TabsContent value="moves" className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {bans.moves.filter(x => x.toLowerCase().includes(searchQuery.toLowerCase())).map((x, i) => (<Badge key={i} variant="outline">{x}</Badge>))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seasons" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hạng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex gap-2">
                      <Button variant={seasonTab==='s1'?'default':'outline'} onClick={() => setSeasonTab('s1')}>Season 1</Button>
                      <Button variant={seasonTab==='s2'?'default':'outline'} onClick={() => setSeasonTab('s2')}>Season 2</Button>
                      <Button variant={seasonTab==='s3'?'default':'outline'} onClick={() => setSeasonTab('s3')}>Season 3</Button>
                    </div>
                    {seasonTab==='s1' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SeasonTable title="1vs1" entries={s1v1} />
                        <SeasonTable title="2vs2" entries={s1v2} />
                      </div>
                    )}
                    {seasonTab==='s2' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SeasonTable title="1vs1" entries={s2v1} />
                        <SeasonTable title="2vs2" entries={s2v2} />
                      </div>
                    )}
                    {seasonTab==='s3' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SeasonTable title="1vs1" entries={[]} />
                        <SeasonTable title="2vs2" entries={[]} />
                      </div>
                    )}
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
