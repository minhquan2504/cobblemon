"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Shield, AlertTriangle, CheckCircle, Clock, RefreshCw, Loader2 } from "lucide-react"
import { toast } from "sonner"

type DataSource = "Smogon" | "Custom"

interface BanlistEntry {
  name: string
  source: DataSource
}

interface BanlistData {
  format: string
  ruleset: string[]
  clauses: string[]
  bannedPokemon: BanlistEntry[]
  bannedMoves: BanlistEntry[]
  bannedAbilities: BanlistEntry[]
  bannedItems: BanlistEntry[]
}

interface Format {
  id: string
  name: string
  description: string
  format: string
}

// Available formats
const availableFormats: Format[] = [
  {
    id: "2v2",
    name: "2vs2 Doubles (All Gen)",
    description: "Format đấu đôi 2vs2 dựa trên Smogon Doubles OU với banlist custom",
    format: "2v2"
  },
  {
    id: "1v1", 
    name: "1vs1 Singles (All Gen)",
    description: "Format đấu đơn 1vs1 dựa trên Smogon 1v1 với banlist custom",
    format: "1v1"
  }
]

const statusColors = {
  Banned: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Allowed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
}

const statusIcons = {
  Banned: AlertTriangle,
  Allowed: CheckCircle
}

export default function TournamentRulesPage() {
  const [formats] = useState<Format[]>(availableFormats)
  const [selectedFormat, setSelectedFormat] = useState<Format | null>(null)
  const [banlistData, setBanlistData] = useState<BanlistData | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    if (availableFormats.length > 0) {
      setSelectedFormat(availableFormats[0])
      loadBanlistData(availableFormats[0].format)
    }
  }, [])

  const loadBanlistData = async (format: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/rules?format=${format}`)
      if (!response.ok) {
        throw new Error('Failed to fetch banlist data')
      }
      const data: BanlistData = await response.json()
      setBanlistData(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error loading banlist data:', error)
      toast.error('Không thể tải dữ liệu banlist')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshBanlist = async () => {
    if (!selectedFormat) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'refresh',
          format: selectedFormat.format
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to refresh banlist')
      }
      
      const data = await response.json()
      setBanlistData(data)
      setLastUpdated(new Date())
      toast.success('Banlist đã được cập nhật')
    } catch (error) {
      console.error('Error refreshing banlist:', error)
      toast.error('Không thể cập nhật banlist')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormatChange = (format: Format) => {
    setSelectedFormat(format)
    loadBanlistData(format.format)
  }

  const getFilteredItems = (items: BanlistEntry[], type: string) => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = filterType === "all" || filterType === type
      return matchesSearch && matchesType
    })
  }

  const pokemonEntries = banlistData ? getFilteredItems(banlistData.bannedPokemon, "pokemon") : []
  const moveEntries = banlistData ? getFilteredItems(banlistData.bannedMoves, "moves") : []
  const abilityEntries = banlistData ? getFilteredItems(banlistData.bannedAbilities, "abilities") : []
  const itemEntries = banlistData ? getFilteredItems(banlistData.bannedItems, "items") : []

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Luật Giải Đấu</h1>
        <p className="text-xl text-muted-foreground">
          Banlist động từ Smogon kết hợp với custom rules
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Format Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Formats</CardTitle>
              <CardDescription>Chọn format thi đấu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {formats.map(format => (
                <Button
                  key={format.id}
                  variant={selectedFormat?.id === format.id ? "default" : "ghost"}
                  size="lg"
                  className="w-full justify-start h-14 text-base rounded-xl"
                  onClick={() => handleFormatChange(format)}
                >
                  <div className="text-left">
                    <div className="font-semibold text-[1.1rem]">{format.format.toUpperCase()}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Refresh Button */}
          <Card className="mt-4">
            <CardContent className="pt-6">
              <Button
                onClick={refreshBanlist}
                disabled={isLoading || !selectedFormat}
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Làm mới banlist
              </Button>
              {lastUpdated && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Cập nhật lần cuối: {lastUpdated.toLocaleTimeString('vi-VN')}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Rules Content */}
        <div className="lg:col-span-3">
          {banlistData ? (
            <div className="space-y-6">
              {/* Format Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedFormat?.name}</CardTitle>
                      <CardDescription>{selectedFormat?.description}</CardDescription>
                    </div>
                    <Badge variant="default">
                      {banlistData.format.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Clauses:</h4>
                      <div className="flex flex-wrap gap-2">
                        {banlistData.clauses.map((clause, index) => (
                          <Badge key={index} variant="outline">
                            {clause}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            placeholder="Tìm kiếm Pokémon, moves, abilities, items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Select value={filterType} onValueChange={setFilterType}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="pokemon">Pokémon</SelectItem>
                            <SelectItem value="moves">Moves</SelectItem>
                            <SelectItem value="abilities">Abilities</SelectItem>
                            <SelectItem value="items">Items</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Banlist Entries */}
              <Tabs defaultValue="pokemon" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="pokemon">
                    Pokémon ({pokemonEntries.length})
                  </TabsTrigger>
                  <TabsTrigger value="moves">
                    Moves ({moveEntries.length})
                  </TabsTrigger>
                  <TabsTrigger value="abilities">
                    Abilities ({abilityEntries.length})
                  </TabsTrigger>
                  <TabsTrigger value="items">
                    Items ({itemEntries.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pokemon" className="space-y-2">
                  {pokemonEntries.length > 0 ? (
                    pokemonEntries.map((pokemon, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                              <span className="font-medium">{pokemon.name}</span>
                              <Badge variant="outline" className="text-xs">{pokemon.source}</Badge>
                            </div>
                            <Badge className={statusColors.Banned}>
                              Banned
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center text-muted-foreground">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                        <p>Không có Pokémon nào bị ban trong format này</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="moves" className="space-y-2">
                  {moveEntries.length > 0 ? (
                    moveEntries.map((move, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                              <span className="font-medium">{move.name}</span>
                              <Badge variant="outline" className="text-xs">{move.source}</Badge>
                            </div>
                            <Badge className={statusColors.Banned}>
                              Banned
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center text-muted-foreground">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                        <p>Không có Move nào bị ban trong format này</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="abilities" className="space-y-2">
                  {abilityEntries.length > 0 ? (
                    abilityEntries.map((ability, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                              <span className="font-medium">{ability.name}</span>
                              <Badge variant="outline" className="text-xs">{ability.source}</Badge>
                            </div>
                            <Badge className={statusColors.Banned}>
                              Banned
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center text-muted-foreground">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                        <p>Không có Ability nào bị ban trong format này</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="items" className="space-y-2">
                  {itemEntries.length > 0 ? (
                    itemEntries.map((item, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                              <span className="font-medium">{item.name}</span>
                              <Badge variant="outline" className="text-xs">{item.source}</Badge>
                            </div>
                            <Badge className={statusColors.Banned}>
                              Banned
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center text-muted-foreground">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                        <p>Không có Item nào bị ban trong format này</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>

            </div>
          ) : isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-muted-foreground">
                  <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin" />
                  <p>Đang tải banlist...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chọn một format để xem banlist</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
