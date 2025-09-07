"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Grid, List, Eye, Filter } from "lucide-react"
import { PokemonCard } from "@/components/pokemon/PokemonCard"
import { PokemonStats } from "@/components/pokemon/PokemonStats"
import { PokemonMoves } from "@/components/pokemon/PokemonMoves"
import { PokemonEvolution } from "@/components/pokemon/PokemonEvolution"
import { PokemonComparison } from "@/components/pokemon/PokemonComparison"
import { TypeChart } from "@/components/pokemon/TypeChart"
import { PokemonRadarChart } from "@/components/pokemon/PokemonRadarChart"
import { PokemonSprites } from "@/components/pokemon/PokemonSprites"
import Image from "next/image"
import { useShiny } from "@/components/providers/Providers"
import { getPokemon, transformPokemonData, getPokemonSpecies, getPokemonSpeciesList } from "@/lib/pokeapi"

interface Pokemon {
  id: number
  name: string
  gen: number
  types: string[]
  stats: {
    hp: number
    atk: number
    def: number
    spa: number
    spd: number
    spe: number
  }
  abilities: string[]
  spriteUrl?: string
}

const typeColors: Record<string, string> = {
  normal: "bg-gray-500",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-500",
  grass: "bg-green-500",
  ice: "bg-cyan-500",
  fighting: "bg-orange-500",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-sky-500",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-amber-600",
  ghost: "bg-indigo-500",
  dragon: "bg-violet-500",
  dark: "bg-gray-700",
  steel: "bg-gray-400",
  fairy: "bg-pink-300"
}

export default function PokedexPage() {
  const { shiny, setShiny } = useShiny()
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedGen, setSelectedGen] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [totalCount, setTotalCount] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const isLoadingMoreRef = useRef<boolean>(false)
  const [comparisonPokemon1, setComparisonPokemon1] = useState<Pokemon | null>(null)
  const [comparisonPokemon2, setComparisonPokemon2] = useState<Pokemon | null>(null)

  const BATCH_SIZE = 60

  const loadMore = async () => {
    if (isLoadingMoreRef.current || isLoadingMore || !hasMore) return
    isLoadingMoreRef.current = true
    setIsLoadingMore(true)
    try {
      const list = await getPokemonSpeciesList(BATCH_SIZE, offset)
      setTotalCount(list.count)
      const details = await Promise.all(
        list.results.map(async (p) => {
          const species = await getPokemonSpecies(p.name)
          const defaultVarietyName = (species as any)?.varieties?.find((v: any) => v.is_default)?.pokemon?.name || p.name
          const data = await getPokemon(defaultVarietyName)
          return transformPokemonData(data, (species as any)?.generation?.name) as unknown as Pokemon
        })
      )
      setPokemon(prev => {
        const byId = new Map<number, Pokemon>(prev.map(item => [item.id, item]))
        details.forEach(item => {
          byId.set(item.id, item)
        })
        return Array.from(byId.values())
      })
      setOffset(prev => {
        const next = prev + BATCH_SIZE
        setHasMore(next < list.count)
        return next
      })
    } catch (e) {
      console.error("Fetch PokeAPI error:", e)
    } finally {
      setIsLoadingMore(false)
      isLoadingMoreRef.current = false
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!sentinelRef.current) return
    const el = sentinelRef.current
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isLoadingMoreRef.current) {
          loadMore()
        }
      })
    }, { rootMargin: "400px" })
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentinelRef.current, offset, hasMore])

  const filteredPokemon = pokemon.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || p.types.includes(selectedType)
    const matchesGen = selectedGen === "all" || p.gen.toString() === selectedGen
    return matchesSearch && matchesType && matchesGen
  })

  const types = Array.from(new Set(pokemon.flatMap(p => p.types))).sort()
  const generations = Array.from(new Set(pokemon.map(p => p.gen))).sort()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Pokédex</h1>
              <p className="text-muted-foreground">Khám phá tất cả Pokémon trong Cobblemon</p>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm Pokémon..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-bar pl-10"
                />
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Bộ lọc
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Generation Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Thế hệ</label>
                  <Select value={selectedGen} onValueChange={setSelectedGen}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn thế hệ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {generations.map(gen => (
                        <SelectItem key={gen} value={gen.toString()}>
                          Gen {gen}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Hệ</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn hệ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {types.map(type => (
                        <SelectItem key={type} value={type}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${typeColors[type] || 'bg-gray-500'}`} />
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sprite Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Sprite</label>
                  <Select value={shiny ? "shiny" : "normal"} onValueChange={(v) => setShiny(v === "shiny")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn sprite" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="shiny">Shiny</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Results Count */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Hiển thị {filteredPokemon.length} / {pokemon.length} Pokémon
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedPokemon ? (
              <div className="space-y-6">
                {/* Pokemon Detail Header */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-muted rounded-2xl flex items-center justify-center">
                          {selectedPokemon.spriteUrl ? (
                            <Image
                              src={selectedPokemon.spriteUrl}
                              alt={selectedPokemon.name}
                              width={80}
                              height={80}
                              className="w-20 h-20 object-contain"
                            />
                          ) : (
                            <span className="text-4xl">?</span>
                          )}
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold">{selectedPokemon.name}</h2>
                          <p className="text-muted-foreground">#{selectedPokemon.id.toString().padStart(3, '0')}</p>
                          <div className="flex gap-2 mt-2">
                            {selectedPokemon.types.map(type => (
                              <span
                                key={type}
                                className={`px-3 py-1 rounded-full text-xs font-medium text-white ${typeColors[type] || 'bg-gray-500'}`}
                              >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedPokemon(null)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Xem danh sách
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Pokemon Detail Tabs */}
                <Tabs defaultValue="stats" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                    <TabsTrigger value="moves">Moves</TabsTrigger>
                    <TabsTrigger value="evolution">Evolution</TabsTrigger>
                    <TabsTrigger value="radar">Radar</TabsTrigger>
                    <TabsTrigger value="sprites">Sprites</TabsTrigger>
                  </TabsList>

                  <TabsContent value="stats" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <PokemonStats pokemon={selectedPokemon} />
                      <PokemonRadarChart pokemon={selectedPokemon} />
                    </div>
                    <TypeChart defendingTypes={selectedPokemon.types} />
                  </TabsContent>

                  <TabsContent value="moves">
                    <PokemonMoves pokemon={selectedPokemon} />
                  </TabsContent>

                  <TabsContent value="evolution">
                    <PokemonEvolution pokemon={selectedPokemon} />
                  </TabsContent>

                  <TabsContent value="radar">
                    <PokemonRadarChart pokemon={selectedPokemon} />
                  </TabsContent>

                  <TabsContent value="sprites">
                    <PokemonSprites pokemon={selectedPokemon} />
                  </TabsContent>
                  
                  {/* TODO: Form selector could be a future tab or dropdown here */}
                </Tabs>
              </div>
            ) : (
              <div>
                {/* Pokemon Grid */}
                <div className="grid-responsive">
                  {filteredPokemon.map(p => (
                    <PokemonCard
                      key={p.id}
                      pokemon={p}
                      onClick={() => setSelectedPokemon(p)}
                    />
                  ))}
                </div>

                {/* Infinite scroll sentinel */}
                {hasMore && (
                  <div ref={sentinelRef} className="w-full h-10 flex items-center justify-center mt-6">
                    {isLoadingMore && <span className="text-sm text-muted-foreground">Đang tải thêm...</span>}
                  </div>
                )}

                {filteredPokemon.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <div className="text-muted-foreground">
                        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Không tìm thấy Pokémon nào</p>
                        <p className="text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}