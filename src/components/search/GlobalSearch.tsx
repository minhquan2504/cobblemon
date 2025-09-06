"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Zap, Shield, Sword, Star } from "lucide-react"
import { searchPokeAPI } from "@/lib/pokeapi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SearchResult {
  id: string
  type: "pokemon" | "move" | "item" | "format"
  name: string
  description?: string
  category?: string
  url: string
}

interface GlobalSearchProps {
  className?: string
  placeholder?: string
}

// Mock search data - trong thực tế sẽ fetch từ API
const mockSearchData: SearchResult[] = [
  // Pokémon
  { id: "1", type: "pokemon", name: "Bulbasaur", description: "Grass/Poison", category: "Gen 1", url: "/pokedex?pokemon=bulbasaur" },
  { id: "4", type: "pokemon", name: "Charmander", description: "Fire", category: "Gen 1", url: "/pokedex?pokemon=charmander" },
  { id: "7", type: "pokemon", name: "Squirtle", description: "Water", category: "Gen 1", url: "/pokedex?pokemon=squirtle" },
  { id: "25", type: "pokemon", name: "Pikachu", description: "Electric", category: "Gen 1", url: "/pokedex?pokemon=pikachu" },
  
  // Moves
  { id: "m1", type: "move", name: "Thunderbolt", description: "Electric Special", category: "90 Power", url: "/pokedex?move=thunderbolt" },
  { id: "m2", type: "move", name: "Flamethrower", description: "Fire Special", category: "90 Power", url: "/pokedex?move=flamethrower" },
  { id: "m3", type: "move", name: "Surf", description: "Water Special", category: "90 Power", url: "/pokedex?move=surf" },
  { id: "m4", type: "move", name: "Earthquake", description: "Ground Physical", category: "100 Power", url: "/pokedex?move=earthquake" },
  
  // Items
  { id: "i1", type: "item", name: "Master Ball", description: "Poké Ball", category: "100% Catch Rate", url: "/tournament-rules?item=master-ball" },
  { id: "i2", type: "item", name: "Rare Candy", description: "Consumable", category: "Level Up", url: "/tournament-rules?item=rare-candy" },
  { id: "i3", type: "item", name: "Leftovers", description: "Held Item", category: "HP Recovery", url: "/tournament-rules?item=leftovers" },
  
  // Formats
  { id: "f1", type: "format", name: "VGC 2024", description: "Video Game Championships", category: "Official", url: "/tournament-rules?format=vgc-2024" },
  { id: "f2", type: "format", name: "Smogon OU", description: "OverUsed Tier", category: "Community", url: "/tournament-rules?format=smogon-ou" },
]

const typeIcons = {
  pokemon: Star,
  move: Sword,
  item: Shield,
  format: Zap
}

const typeColors = {
  pokemon: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  move: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  item: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  format: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
}

const typeLabels = {
  pokemon: "Pokémon",
  move: "Move",
  item: "Item",
  format: "Format"
}

export function GlobalSearch({ className, placeholder = "Tìm kiếm Pokémon, moves, items..." }: GlobalSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Search logic
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    const searchPokeAPIAsync = async () => {
      try {
        const pokeApiResults = await searchPokeAPI(query, 5)
        const transformedResults = pokeApiResults.map((result, index) => ({
          id: `pokeapi-${index}`,
          type: result.type as "pokemon" | "move" | "item" | "format",
          name: result.data.name,
          description: result.data.types?.join("/") || "",
          category: `Gen ${result.data.gen}`,
          url: `/pokedex?pokemon=${result.data.name}`
        }))

        // Combine with mock data for other types
        const mockFiltered = mockSearchData.filter(item =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 3)

        const allResults = [...transformedResults, ...mockFiltered]
        setResults(allResults.slice(0, 8))
        setIsOpen(allResults.length > 0)
        setSelectedIndex(-1)
      } catch (error) {
        console.error("Search error:", error)
        // Fallback to mock data
        const filtered = mockSearchData.filter(item =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase())
        )
        setResults(filtered.slice(0, 8))
        setIsOpen(filtered.length > 0)
        setSelectedIndex(-1)
      }
    }

    searchPokeAPIAsync()
  }, [query])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        )
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelectResult(results[selectedIndex])
        }
        break
      case "Escape":
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  const handleSelectResult = (result: SearchResult) => {
    router.push(result.url)
    setQuery("")
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleClear = () => {
    setQuery("")
    setIsOpen(false)
    inputRef.current?.focus()
  }

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={cn("relative w-full max-w-md", className)} ref={resultsRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Search Results */}
      {isOpen && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-2">
            <div className="space-y-1">
              {results.map((result, index) => {
                const Icon = typeIcons[result.type]
                const isSelected = index === selectedIndex
                
                return (
                  <div
                    key={result.id}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors",
                      isSelected ? "bg-muted" : "hover:bg-muted/50"
                    )}
                    onClick={() => handleSelectResult(result)}
                  >
                    <div className="flex-shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{result.name}</span>
                        <Badge className={cn("text-xs", typeColors[result.type])}>
                          {typeLabels[result.type]}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {result.description}
                      </div>
                      {result.category && (
                        <div className="text-xs text-muted-foreground">
                          {result.category}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {isOpen && query.length >= 2 && results.length === 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50">
          <CardContent className="p-4 text-center text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Không tìm thấy kết quả cho &quot;{query}&quot;</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
