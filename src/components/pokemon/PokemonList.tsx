"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Image from "next/image"

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

interface PokemonListProps {
  pokemon: Pokemon
  onClick: () => void
  isSelected?: boolean
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

export function PokemonList({ pokemon, onClick, isSelected }: PokemonListProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected && "ring-2 ring-primary shadow-lg"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Pokemon Image */}
          <div className="flex-shrink-0">
            {pokemon.spriteUrl ? (
              <Image
                src={pokemon.spriteUrl}
                alt={pokemon.name}
                width={64}
                height={64}
                className="w-16 h-16 object-contain"
              />
            ) : (
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <span className="text-xl">?</span>
              </div>
            )}
          </div>

          {/* Pokemon Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg truncate">{pokemon.name}</h3>
              <Badge variant="secondary">Gen {pokemon.gen}</Badge>
            </div>
            
            {/* Types */}
            <div className="flex gap-1 mb-2">
              {pokemon.types.map(type => (
                <Badge
                  key={type}
                  className={`${typeColors[type] || 'bg-gray-500'} text-white text-xs`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Badge>
              ))}
            </div>

            {/* Base Stats */}
            <div className="grid grid-cols-6 gap-2 text-xs">
              <div className="text-center">
                <div className="text-muted-foreground">HP</div>
                <div className="font-medium">{pokemon.stats.hp}</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">ATK</div>
                <div className="font-medium">{pokemon.stats.atk}</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">DEF</div>
                <div className="font-medium">{pokemon.stats.def}</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">SPA</div>
                <div className="font-medium">{pokemon.stats.spa}</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">SPD</div>
                <div className="font-medium">{pokemon.stats.spd}</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">SPE</div>
                <div className="font-medium">{pokemon.stats.spe}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
