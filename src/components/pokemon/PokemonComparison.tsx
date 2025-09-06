"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Swords, Shield, Zap, Eye, Star, X } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

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

interface PokemonComparisonProps {
  pokemon1: Pokemon | null
  pokemon2: Pokemon | null
  onSelectPokemon: (slot: 1 | 2, pokemon: Pokemon) => void
  onClearPokemon: (slot: 1 | 2) => void
}

// Mock data
const mockPokemon: Pokemon[] = [
  {
    id: 1,
    name: "Bulbasaur",
    gen: 1,
    types: ["grass", "poison"],
    stats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
    abilities: ["Overgrow", "Chlorophyll"],
    spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
  },
  {
    id: 4,
    name: "Charmander",
    gen: 1,
    types: ["fire"],
    stats: { hp: 39, atk: 52, def: 43, spa: 60, spd: 50, spe: 65 },
    abilities: ["Blaze", "Solar Power"],
    spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
  },
  {
    id: 7,
    name: "Squirtle",
    gen: 1,
    types: ["water"],
    stats: { hp: 44, atk: 48, def: 65, spa: 50, spd: 64, spe: 43 },
    abilities: ["Torrent", "Rain Dish"],
    spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png"
  },
  {
    id: 25,
    name: "Pikachu",
    gen: 1,
    types: ["electric"],
    stats: { hp: 35, atk: 55, def: 40, spa: 50, spd: 50, spe: 90 },
    abilities: ["Static", "Lightning Rod"],
    spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
  }
]

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

const statIcons = {
  hp: Heart,
  atk: Swords,
  def: Shield,
  spa: Zap,
  spd: Eye,
  spe: Star
}

const statLabels = {
  hp: "HP",
  atk: "Tấn công",
  def: "Phòng thủ",
  spa: "Tấn công đặc biệt",
  spd: "Phòng thủ đặc biệt",
  spe: "Tốc độ"
}

export function PokemonComparison({ pokemon1, pokemon2, onSelectPokemon, onClearPokemon }: PokemonComparisonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const maxStat = Math.max(
    ...Object.values(pokemon1?.stats || {}),
    ...Object.values(pokemon2?.stats || {})
  )

  const renderPokemonCard = (pokemon: Pokemon | null, slot: 1 | 2) => {
    if (!pokemon) {
      return (
        <Card className="h-80 flex items-center justify-center">
          <CardContent className="text-center">
            <div className="text-muted-foreground mb-4">
              <Star className="h-12 w-12 mx-auto opacity-50" />
            </div>
            <p className="text-sm mb-4">Chọn Pokémon để so sánh</p>
            <Select onValueChange={(value) => {
              const selectedPokemon = mockPokemon.find(p => p.id.toString() === value)
              if (selectedPokemon) onSelectPokemon(slot, selectedPokemon)
            }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Chọn Pokémon" />
              </SelectTrigger>
              <SelectContent>
                {mockPokemon.map(p => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    <div className="flex items-center gap-2">
                      <Image src={p.spriteUrl || ""} alt={p.name} width={20} height={20} />
                      {p.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src={pokemon.spriteUrl || ""} alt={pokemon.name} width={48} height={48} />
              <div>
                <CardTitle className="text-lg">{pokemon.name}</CardTitle>
                <p className="text-sm text-muted-foreground">Gen {pokemon.gen}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClearPokemon(slot)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-1">
            {pokemon.types.map(type => (
              <Badge
                key={type}
                className={`${typeColors[type] || 'bg-gray-500'} text-white text-xs`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Base Stats</h4>
            {Object.entries(pokemon.stats).map(([stat, value]) => {
              const Icon = statIcons[stat as keyof typeof statIcons]
              const label = statLabels[stat as keyof typeof statLabels]
              const percentage = (value / maxStat) * 100
              
              return (
                <div key={stat} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon className="h-3 w-3 text-muted-foreground" />
                      <span>{label}</span>
                    </div>
                    <span className="font-medium">{value}</span>
                  </div>
                  <Progress value={percentage} className="h-1.5" />
                </div>
              )
            })}
          </div>

          {/* Abilities */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Abilities</h4>
            <div className="flex flex-wrap gap-1">
              {pokemon.abilities.map(ability => (
                <Badge key={ability} variant="outline" className="text-xs">
                  {ability}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderComparison = () => {
    if (!pokemon1 || !pokemon2) return null

    const stats1 = pokemon1.stats
    const stats2 = pokemon2.stats

    return (
      <div className="space-y-4">
        <h4 className="font-medium text-center">So sánh Stats</h4>
        <div className="space-y-2">
          {Object.keys(stats1).map(stat => {
            const value1 = stats1[stat as keyof typeof stats1]
            const value2 = stats2[stat as keyof typeof stats2]
            const diff = value1 - value2
            const Icon = statIcons[stat as keyof typeof statIcons]
            const label = statLabels[stat as keyof typeof statLabels]
            
            return (
              <div key={stat} className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{value1}</div>
                    <div className="text-xs text-muted-foreground">{pokemon1.name}</div>
                  </div>
                  <div className={cn(
                    "text-sm font-bold",
                    diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-muted-foreground"
                  )}>
                    {diff > 0 ? "+" : ""}{diff}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{value2}</div>
                    <div className="text-xs text-muted-foreground">{pokemon2.name}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Star className="mr-2 h-4 w-4" />
          So sánh Pokémon
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>So sánh Pokémon</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Pokémon Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Pokémon 1</h3>
              {renderPokemonCard(pokemon1, 1)}
            </div>
            <div>
              <h3 className="font-medium mb-2">Pokémon 2</h3>
              {renderPokemonCard(pokemon2, 2)}
            </div>
          </div>

          {/* Comparison Results */}
          {pokemon1 && pokemon2 && (
            <div className="border-t pt-6">
              {renderComparison()}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
