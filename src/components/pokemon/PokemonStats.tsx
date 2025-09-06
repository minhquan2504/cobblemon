"use client"

import { Progress } from "@/components/ui/progress"
import { Heart, Swords, Shield, Zap, Eye, Star } from "lucide-react"
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

interface PokemonStatsProps {
  pokemon: Pokemon
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

export function PokemonStats({ pokemon }: PokemonStatsProps) {
  const maxStat = Math.max(...Object.values(pokemon.stats))
  
  const stats = Object.entries(pokemon.stats).map(([key, value]) => ({
    name: key as keyof typeof pokemon.stats,
    value,
    percentage: (value / maxStat) * 100
  }))

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        {pokemon.spriteUrl && (
          <Image
            src={pokemon.spriteUrl}
            alt={pokemon.name}
            width={96}
            height={96}
            className="w-24 h-24 mx-auto object-contain"
          />
        )}
      </div>

      <div className="space-y-3">
        {stats.map((stat) => {
          const Icon = statIcons[stat.name]
          const label = statLabels[stat.name]
          
          return (
            <div key={stat.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <span className="text-sm font-bold">{stat.value}</span>
              </div>
              <Progress value={stat.percentage} className="h-2" />
            </div>
          )
        })}
      </div>

      {/* Total Stats */}
      <div className="pt-4 border-t">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Tổng cộng:</span>
          <span className="text-lg font-bold">
            {Object.values(pokemon.stats).reduce((a, b) => a + b, 0)}
          </span>
        </div>
      </div>
    </div>
  )
}
