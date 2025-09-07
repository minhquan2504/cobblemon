"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calculator, MapPin, Zap } from "lucide-react"
import Image from "next/image"
import { getPokemon, getPokemonList, transformPokemonData } from "@/lib/pokeapi"

interface Pokemon {
  id: number
  name: string
  types: string[]
  stats: {
    hp: number
    atk: number
    def: number
    spa: number
    spd: number
    spe: number
  }
  spriteUrl?: string
  shinySpriteUrl?: string
}

interface EVSpread {
  hp: number
  atk: number
  def: number
  spa: number
  spd: number
  spe: number
}

interface SimpleListEntry { id: number; name: string }

const evTrainingSpots = [
  { stat: "HP", pokemon: "Bidoof", location: "Route 201", evs: 1 },
  { stat: "ATK", pokemon: "Machop", location: "Route 207", evs: 1 },
  { stat: "DEF", pokemon: "Geodude", location: "Route 207", evs: 1 },
  { stat: "SPA", pokemon: "Psyduck", location: "Route 203", evs: 1 },
  { stat: "SPD", pokemon: "Tentacool", location: "Route 205", evs: 1 },
  { stat: "SPE", pokemon: "Zubat", location: "Oreburgh Gate", evs: 1 }
]

const powerItems = [
  { name: "Power Weight", stat: "HP", evs: 8 },
  { name: "Power Bracer", stat: "ATK", evs: 8 },
  { name: "Power Belt", stat: "DEF", evs: 8 },
  { name: "Power Lens", stat: "SPA", evs: 8 },
  { name: "Power Band", stat: "SPD", evs: 8 },
  { name: "Power Anklet", stat: "SPE", evs: 8 }
]

export default function EVTrainingPage() {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [allList, setAllList] = useState<SimpleListEntry[]>([])
  const [displayPokemon, setDisplayPokemon] = useState<Pokemon[]>([])
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterGen, setFilterGen] = useState<string>("all")
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [errorText, setErrorText] = useState<string>("")
  const [filterName, setFilterName] = useState<string>("")
  const [evSpread, setEVSpread] = useState<EVSpread>({ hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 })
  const [level, setLevel] = useState(50)
  // const [nature] = useState("Hardy") // TODO: Implement nature effects
  const [ivs, setIVs] = useState<EVSpread>({ hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 })
  const [calculatedStats, setCalculatedStats] = useState<EVSpread | null>(null)

  useEffect(() => {
    // Load 1025 names quickly
    getPokemonList(1025, 0).then((list: any) => {
      const entries: SimpleListEntry[] = list.results.map((r: any) => {
        const idMatch = r.url.match(/\/(\d+)\/?$/)
        const id = idMatch ? parseInt(idMatch[1], 10) : 0
        return { id, name: r.name }
      })
      setAllList(entries)
      // Prefetch first 60 for display
      return Promise.all(entries.slice(0, 60).map(async (e) => {
        try { return transformPokemonData(await getPokemon(e.name)) as Pokemon } catch { return null }
      }))
    }).then((arr) => {
      if (arr) setDisplayPokemon((arr.filter(Boolean) as Pokemon[]).sort((a,b) => a.id - b.id))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) { setSuggestions([]); return }
    const sugg = allList
      .filter(e => e.name.includes(q))
      .slice(0, 10)
      .map(e => e.name)
    setSuggestions(sugg)
  }, [query, allList])

  const calculateStats = () => {
    if (!selectedPokemon) return

    const baseStats = selectedPokemon.stats
    const stats: EVSpread = {
      hp: Math.floor(((2 * baseStats.hp + ivs.hp + Math.floor(evSpread.hp / 4)) * level / 100) + level + 10),
      atk: Math.floor(((2 * baseStats.atk + ivs.atk + Math.floor(evSpread.atk / 4)) * level / 100) + 5),
      def: Math.floor(((2 * baseStats.def + ivs.def + Math.floor(evSpread.def / 4)) * level / 100) + 5),
      spa: Math.floor(((2 * baseStats.spa + ivs.spa + Math.floor(evSpread.spa / 4)) * level / 100) + 5),
      spd: Math.floor(((2 * baseStats.spd + ivs.spd + Math.floor(evSpread.spd / 4)) * level / 100) + 5),
      spe: Math.floor(((2 * baseStats.spe + ivs.spe + Math.floor(evSpread.spe / 4)) * level / 100) + 5)
    }

    setCalculatedStats(stats)
  }

  const totalEVs = Object.values(evSpread).reduce((a, b) => a + b, 0)
  const isValidEVSpread = totalEVs <= 510 && Object.values(evSpread).every(ev => ev <= 252)

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">EV Training Guide</h1>
        <p className="text-xl text-muted-foreground">
          Hướng dẫn EV Training và calculator để tối ưu hóa Pokémon
        </p>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculator">Tính EV</TabsTrigger>
          <TabsTrigger value="guides">Hướng dẫn EV</TabsTrigger>
          <TabsTrigger value="farming">Địa điểm luyện EV</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Tính EV
                </CardTitle>
                <CardDescription>
                  Tính toán stats cuối cùng dựa trên EVs, IVs và level
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pokemon Selection */}
                <div className="space-y-2">
                  <Label>Pokémon</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input placeholder="Nhập tên Pokémon (ví dụ: pikachu)" value={query} onChange={(e) => setQuery(e.target.value)} />
                      <Button onClick={async () => {
                        const q = query.trim().toLowerCase()
                        setErrorText("")
                        try {
                          const pdata = await getPokemon(q)
                          setSelectedPokemon(transformPokemonData(pdata) as Pokemon)
                        } catch {
                          const best = allList.find(e => e.name === q) || allList.find(e => e.name.startsWith(q)) || allList.find(e => e.name.includes(q))
                          if (best) {
                            try {
                              const pdata = await getPokemon(best.name)
                              setSelectedPokemon(transformPokemonData(pdata) as Pokemon)
                              setQuery(best.name)
                            } catch { setErrorText(`Không tìm thấy Pokémon "${query}"`) }
                          } else {
                            setErrorText(`Không tìm thấy Pokémon "${query}"`)
                          }
                        }
                      }}>Chọn</Button>
                    </div>
                    {errorText && (
                      <div className="text-sm text-destructive">{errorText}</div>
                    )}
                    {suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map(s => (
                          <Button key={s} variant="outline" size="sm" onClick={async () => {
                            try {
                              const pdata = await getPokemon(s)
                              setSelectedPokemon(transformPokemonData(pdata) as Pokemon)
                              setQuery(s)
                              setErrorText("")
                            } catch {}
                          }}>
                            {s}
                          </Button>
                        ))}
                      </div>
                    )}

                    {selectedPokemon && (
                      <div className="flex items-center gap-3 pt-1">
                        <Image src={selectedPokemon.spriteUrl || ""} alt={selectedPokemon.name} width={32} height={32} />
                        <span className="font-medium capitalize">{selectedPokemon.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Level */}
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value))}
                  />
                </div>

                {/* EVs */}
                <div className="space-y-4">
                  <Label>EVs (Tổng: {totalEVs}/510)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(evSpread).map(([stat, value]) => (
                      <div key={stat} className="space-y-1">
                        <Label className="text-sm">{stat.toUpperCase()}</Label>
                        <Input
                          type="number"
                          min="0"
                          max="252"
                          value={value}
                          onChange={(e) => setEVSpread(prev => ({
                            ...prev,
                            [stat]: Number(e.target.value)
                          }))}
                        />
                      </div>
                    ))}
                  </div>
                  {!isValidEVSpread && (
                    <p className="text-sm text-destructive">
                      EVs không hợp lệ! Tổng EVs phải &le; 510 và mỗi stat &le; 252
                    </p>
                  )}
                </div>

                {/* IVs */}
                <div className="space-y-4">
                  <Label>IVs (Mặc định: 31)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(ivs).map(([stat, value]) => (
                      <div key={stat} className="space-y-1">
                        <Label className="text-sm">{stat.toUpperCase()}</Label>
                        <Input
                          type="number"
                          min="0"
                          max="31"
                          value={value}
                          onChange={(e) => setIVs(prev => ({
                            ...prev,
                            [stat]: Number(e.target.value)
                          }))}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={calculateStats} 
                  disabled={!selectedPokemon || !isValidEVSpread}
                  className="w-full"
                >
                  Tính toán Stats
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle>Kết quả</CardTitle>
                <CardDescription>
                  Stats cuối cùng của Pokémon
                </CardDescription>
              </CardHeader>
              <CardContent>
                {calculatedStats ? (
                  <div className="space-y-3">
                    {Object.entries(calculatedStats).map(([stat, value]) => (
                      <div key={stat} className="flex justify-between items-center">
                        <span className="font-medium">{stat.toUpperCase()}:</span>
                        <span className="text-lg font-bold">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Chọn Pokémon và nhấn &quot;Tính toán Stats&quot;</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-48">
              <Label>Lọc theo vai trò</Label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger><SelectValue placeholder="Vai trò" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Sweeper">Sweeper</SelectItem>
                  <SelectItem value="Tank">Tank</SelectItem>
                  <SelectItem value="Balanced">Balanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Label>Thế hệ</Label>
              <Select value={filterGen} onValueChange={setFilterGen}>
                <SelectTrigger><SelectValue placeholder="Gen" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {[1,2,3,4,5,6,7,8,9].map(g => (
                    <SelectItem key={g} value={g.toString()}>Gen {g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[200px] flex-1">
              <Label>Tìm kiếm Pokémon</Label>
              <Input placeholder="Nhập tên để lọc danh sách" value={filterName} onChange={(e) => setFilterName(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayPokemon
              .filter(p => filterGen === "all" || Math.ceil(p.id / 151).toString() === filterGen)
              .filter(p => !filterName || p.name.toLowerCase().includes(filterName.toLowerCase()))
              .slice(0, 60)
              .map(p => {
                const s = p.stats
                const suggestions: Record<string, EVSpread> = {
                  Sweeper: { hp: 0, atk: s.spa > s.atk ? 0 : 252, def: 0, spa: s.spa > s.atk ? 252 : 0, spd: 4, spe: 252 },
                  Tank: { hp: 252, atk: 0, def: s.def >= s.spd ? 252 : 0, spa: 0, spd: s.spd > s.def ? 252 : 0, spe: 4 },
                  Balanced: { hp: 172, atk: 84, def: 84, spa: 84, spd: 84, spe: 92 },
                }
                const role = filterRole === "all" ? "Sweeper" : filterRole
                const spread = suggestions[role]
                return (
                  <Card key={p.id}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Image 
                          src={p.spriteUrl || ""} 
                          alt={p.name}
                          width={48}
                          height={48}
                        />
                        <div>
                          <CardTitle className="text-lg">{p.name}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h4 className="font-medium">Phân bổ EV ({role}):</h4>
                        <div className="grid grid-cols-2 gap-1 text-sm">
                          {Object.entries(spread).map(([stat, value]) => (
                            <div key={stat} className="flex justify-between">
                              <span>{stat.toUpperCase()}:</span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full mt-3"
                          onClick={() => setEVSpread(spread)}
                        >
                          Áp dụng EV Spread
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </TabsContent>

        <TabsContent value="farming" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Training Spots */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Địa điểm luyện EV
                </CardTitle>
                <CardDescription>
                  Các địa điểm tốt nhất để farm EVs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {evTrainingSpots.map((spot, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{spot.stat} EVs</div>
                        <div className="text-sm text-muted-foreground">
                          {spot.pokemon} - {spot.location}
                        </div>
                      </div>
                      <Badge variant="outline">
                        +{spot.evs} EV
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Power Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Trang bị hỗ trợ EV
                </CardTitle>
                <CardDescription>
                  Các item hỗ trợ EV Training
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {powerItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Tăng {item.stat} EVs
                        </div>
                      </div>
                      <Badge variant="outline">
                        +{item.evs} EV
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
