"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calculator, MapPin, Zap } from "lucide-react"
import Image from "next/image"

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
}

interface EVSpread {
  hp: number
  atk: number
  def: number
  spa: number
  spd: number
  spe: number
}

interface EVTrainingGuide {
  id: number
  pokemonId: number
  spread: EVSpread
  strategy: string
  pokemon: Pokemon
}

// Mock data
const mockPokemon: Pokemon[] = [
  {
    id: 1,
    name: "Bulbasaur",
    types: ["grass", "poison"],
    stats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
    spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
  },
  {
    id: 4,
    name: "Charmander",
    types: ["fire"],
    stats: { hp: 39, atk: 52, def: 43, spa: 60, spd: 50, spe: 65 },
    spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
  },
  {
    id: 7,
    name: "Squirtle",
    types: ["water"],
    stats: { hp: 44, atk: 48, def: 65, spa: 50, spd: 64, spe: 43 },
    spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png"
  }
]

const mockEVGuides: EVTrainingGuide[] = [
  {
    id: 1,
    pokemonId: 1,
    spread: { hp: 252, atk: 0, def: 0, spa: 252, spd: 4, spe: 0 },
    strategy: "Special Attacker - Tối ưu hóa tấn công đặc biệt",
    pokemon: mockPokemon[0]
  },
  {
    id: 2,
    pokemonId: 4,
    spread: { hp: 0, atk: 252, def: 0, spa: 0, spd: 4, spe: 252 },
    strategy: "Physical Sweeper - Tối ưu hóa tấn công vật lý và tốc độ",
    pokemon: mockPokemon[1]
  },
  {
    id: 3,
    pokemonId: 7,
    spread: { hp: 252, atk: 0, def: 252, spa: 0, spd: 4, spe: 0 },
    strategy: "Defensive Wall - Tối ưu hóa phòng thủ",
    pokemon: mockPokemon[2]
  }
]

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
  const [evSpread, setEVSpread] = useState<EVSpread>({ hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 })
  const [level, setLevel] = useState(50)
  // const [nature] = useState("Hardy") // TODO: Implement nature effects
  const [ivs, setIVs] = useState<EVSpread>({ hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 })
  const [calculatedStats, setCalculatedStats] = useState<EVSpread | null>(null)

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
          <TabsTrigger value="calculator">EV Calculator</TabsTrigger>
          <TabsTrigger value="guides">EV Guides</TabsTrigger>
          <TabsTrigger value="farming">Farming Spots</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  EV Calculator
                </CardTitle>
                <CardDescription>
                  Tính toán stats cuối cùng dựa trên EVs, IVs và level
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pokemon Selection */}
                <div className="space-y-2">
                  <Label>Pokémon</Label>
                  <Select onValueChange={(value) => {
                    const pokemon = mockPokemon.find(p => p.id.toString() === value)
                    setSelectedPokemon(pokemon || null)
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn Pokémon" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPokemon.map(pokemon => (
                        <SelectItem key={pokemon.id} value={pokemon.id.toString()}>
                                                  <div className="flex items-center gap-2">
                          <Image src={pokemon.spriteUrl || ""} alt={pokemon.name} width={24} height={24} />
                          {pokemon.name}
                        </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockEVGuides.map(guide => (
              <Card key={guide.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Image 
                      src={guide.pokemon.spriteUrl || ""} 
                      alt={guide.pokemon.name}
                      width={48}
                      height={48}
                    />
                    <div>
                      <CardTitle className="text-lg">{guide.pokemon.name}</CardTitle>
                      <CardDescription>{guide.strategy}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium">EV Spread:</h4>
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      {Object.entries(guide.spread).map(([stat, value]) => (
                        <div key={stat} className="flex justify-between">
                          <span>{stat.toUpperCase()}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => setEVSpread(guide.spread)}
                    >
                      Áp dụng EV Spread
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="farming" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Training Spots */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Địa điểm Training
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
                  Power Items
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
