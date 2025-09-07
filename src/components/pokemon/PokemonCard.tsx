"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TypeChip } from "./TypeChip"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useShiny } from "@/components/providers/Providers"

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

interface PokemonCardProps {
  pokemon: Pokemon
  onClick: () => void
  isSelected?: boolean
}


export function PokemonCard({ pokemon, onClick, isSelected }: PokemonCardProps) {
  const { shiny } = useShiny()
  return (
    <Card 
      className={cn(
        "pokemon-card relative",
        isSelected && "ring-2 ring-primary shadow-lg"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="text-center">
          {/* Pokemon Image */}
          <div className="mb-4">
            {pokemon.spriteUrl ? (
              <Image
                src={(shiny ? (pokemon as any).shinySpriteUrl : undefined) || pokemon.spriteUrl}
                alt={pokemon.name}
                width={80}
                height={80}
                className="pokemon-sprite"
              />
            ) : (
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">?</span>
              </div>
            )}
          </div>

          {/* Pokemon Number */}
          <p className="pokemon-number">#{pokemon.id.toString().padStart(3, '0')}</p>

          {/* Pokemon Name */}
          <h3 className="pokemon-name">{pokemon.name}</h3>
          
          <p className="text-xs text-muted-foreground mb-3">Gen {pokemon.gen}</p>

          {/* Types */}
          <div className="flex justify-center gap-1 mb-3 flex-wrap">
            {pokemon.types.map(type => (
              <TypeChip
                key={type}
                type={type}
                size="sm"
              />
            ))}
          </div>

          

          {/* Base Stats Preview */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">HP:</span>
              <span className="font-medium">{pokemon.stats.hp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ATK:</span>
              <span className="font-medium">{pokemon.stats.atk}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">DEF:</span>
              <span className="font-medium">{pokemon.stats.def}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SPE:</span>
              <span className="font-medium">{pokemon.stats.spe}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
