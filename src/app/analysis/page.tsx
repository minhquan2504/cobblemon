"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { getDefensiveTypeMultipliers, getPokemon, getPokemonList, transformPokemonData } from "@/lib/pokeapi"
import Image from "next/image"
import { PokemonRadarChart } from "@/components/pokemon/PokemonRadarChart"
import { useShiny } from "@/components/providers/Providers"

interface Pokemon {
  id: number
  name: string
  gen: number
  types: string[]
  stats: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number }
  abilities: string[]
  spriteUrl?: string
  shinySpriteUrl?: string
}

const typeOrder = [
  "normal","fire","water","electric","grass","ice","fighting","poison","ground","flying","psychic","bug","rock","ghost","dragon","dark","steel","fairy"
]

const typeColors: Record<string, string> = {
  normal: "bg-gray-500", fire: "bg-red-500", water: "bg-blue-500", electric: "bg-yellow-500", grass: "bg-green-500",
  ice: "bg-cyan-500", fighting: "bg-orange-500", poison: "bg-purple-500", ground: "bg-yellow-600", flying: "bg-sky-500",
  psychic: "bg-pink-500", bug: "bg-lime-500", rock: "bg-amber-600", ghost: "bg-indigo-500", dragon: "bg-violet-500",
  dark: "bg-gray-700", steel: "bg-gray-400", fairy: "bg-pink-300"
}

export default function AnalysisPage() {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Pokemon | null>(null)
  const [defensive, setDefensive] = useState<Record<string, number> | null>(null)
  const { shiny, setShiny } = useShiny()
  const [allNames, setAllNames] = useState<Array<{ id: number; name: string }>>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [errorText, setErrorText] = useState<string>("")

  useEffect(() => {
    if (!selected) return
    getDefensiveTypeMultipliers(selected.types).then(setDefensive).catch(() => setDefensive(null))
  }, [selected?.id])

  useEffect(() => {
    // load species list for autocomplete
    getPokemonList(1025, 0).then((list: any) => {
      const entries = list.results.map((r: any) => {
        const idMatch = r.url.match(/\/(\d+)\/?$/)
        const id = idMatch ? parseInt(idMatch[1], 10) : 0
        return { id, name: r.name as string }
      })
      setAllNames(entries)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) { setSuggestions([]); return }
    const sugg = allNames
      .filter(e => e.name.includes(q))
      .slice(0, 10)
      .map(e => e.name)
    setSuggestions(sugg)
  }, [query, allNames])

  const handleSearch = async (name: string) => {
    const q = name.trim().toLowerCase()
    setErrorText("")
    try {
      const pdata = await getPokemon(q)
      const p = transformPokemonData(pdata) as Pokemon
      setSelected(p)
      return
    } catch (e) {
      // Try best suggestion
      const best = allNames.find(e => e.name === q) || allNames.find(e => e.name.startsWith(q)) || allNames.find(e => e.name.includes(q))
      if (best) {
        try {
          const pdata = await getPokemon(best.name)
          const p = transformPokemonData(pdata) as Pokemon
          setSelected(p)
          setQuery(best.name)
          return
        } catch {}
      }
      setSelected(null)
      setErrorText(`Không tìm thấy Pokémon "${name}". Hãy chọn từ gợi ý bên dưới.`)
    }
  }

  const grouped = useMemo(() => {
    const g: Record<string, string[]> = { "4x": [], "2x": [], "1x": [], "0.5x": [], "0x": [] }
    if (defensive) {
      for (const t of typeOrder) {
        const v = defensive[t] ?? 1
        if (v >= 4) g["4x"].push(t)
        else if (v >= 2) g["2x"].push(t)
        else if (v === 1) g["1x"].push(t)
        else if (v === 0) g["0x"].push(t)
        else g["0.5x"].push(t)
      }
    }
    return g
  }, [defensive])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Phân tích chiến thuật</h1>
          <p className="text-muted-foreground">Chọn Pokémon để xem khắc hệ và thông tin stats</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Sprite</label>
          <button className={`px-3 py-1 rounded-full text-sm font-medium ${!shiny ? "bg-primary text-primary-foreground" : "bg-muted"}`} onClick={() => setShiny(false)}>Normal</button>
          <button className={`px-3 py-1 rounded-full text-sm font-medium ${shiny ? "bg-primary text-primary-foreground" : "bg-muted"}`} onClick={() => setShiny(true)}>Shiny</button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Tìm Pokémon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input placeholder="Nhập tên Pokémon (ví dụ: pikachu)" value={query} onChange={(e) => setQuery(e.target.value)} />
              <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground" onClick={() => handleSearch(query)}>Chọn</button>
            </div>
            {errorText && (
              <div className="text-sm text-destructive">{errorText}</div>
            )}
            {suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {suggestions.map(s => (
                  <button key={s} className="px-2 py-1 rounded bg-muted text-sm hover:bg-muted/70" onClick={() => handleSearch(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selected && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Pokemon Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-muted rounded-2xl flex items-center justify-center">
                  <Image src={shiny && (selected as any).shinySpriteUrl ? (selected as any).shinySpriteUrl : selected.spriteUrl || "/placeholder.png"} alt={selected.name} width={80} height={80} className="w-20 h-20 object-contain" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold capitalize">{selected.name}</h2>
                  <div className="text-sm text-muted-foreground">#{selected.id.toString().padStart(3, '0')}</div>
                  <div className="flex gap-2 mt-2">
                    {selected.types.map(t => (
                      <span key={t} className={`px-3 py-1 rounded-full text-xs font-medium text-white ${typeColors[t] || 'bg-gray-500'}`}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <PokemonRadarChart pokemon={selected} />
              </div>
            </CardContent>
          </Card>

          {/* Type Effectiveness */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Khắc hệ (Defensive Multipliers)</CardTitle>
            </CardHeader>
            <CardContent>
              {defensive ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(["4x","2x","1x","0.5x","0x"] as const).map(group => (
                    <div key={group}>
                      <div className="font-semibold mb-2">{group}</div>
                      <div className="flex flex-wrap gap-2">
                        {grouped[group].length === 0 && (
                          <span className="text-sm text-muted-foreground">Không có</span>
                        )}
                        {grouped[group].map(t => (
                          <span key={t} className={`px-2 py-1 rounded text-white text-xs ${typeColors[t] || 'bg-gray-500'}`}>{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground">Chưa có dữ liệu. Hãy chọn Pokémon.</div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}


