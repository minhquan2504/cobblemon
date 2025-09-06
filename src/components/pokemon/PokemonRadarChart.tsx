"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

interface PokemonRadarChartProps {
  pokemon: Pokemon
  className?: string
}

const statLabels = {
  hp: "HP",
  atk: "ATK",
  def: "DEF",
  spa: "SPA",
  spd: "SPD",
  spe: "SPE"
}

export function PokemonRadarChart({ pokemon, className }: PokemonRadarChartProps) {
  // Convert stats to radar chart format
  const radarData = Object.entries(pokemon.stats).map(([stat, value]) => ({
    stat: statLabels[stat as keyof typeof statLabels],
    value: value,
    fullMark: 150 // Max value for scaling
  }))

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Base Stats Radar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="stat" />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 150]} 
                tick={false}
                axisLine={false}
              />
              <Radar
                name={pokemon.name}
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Stats Summary */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {Object.entries(pokemon.stats).map(([stat, value]) => (
            <div key={stat} className="flex justify-between">
              <span className="text-muted-foreground">
                {statLabels[stat as keyof typeof statLabels]}:
              </span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
