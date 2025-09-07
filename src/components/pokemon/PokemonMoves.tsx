"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { getMove } from "@/lib/pokeapi"

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

interface PokemonMovesProps {
  pokemon: Pokemon
}

type FetchedMove = {
  name: string
  type: string
  category: "Physical" | "Special" | "Status"
  power: number | null
  accuracy: number | null
  pp: number
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

const categoryColors: Record<string, string> = {
  Physical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Special: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Status: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
}

export function PokemonMoves({ pokemon }: PokemonMovesProps) {
  const [moves, setMoves] = useState<FetchedMove[]>([])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        // Fetch the pokemon details to get move names (already available in parent but safe)
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
        const data = await res.json()
        const moveNames: string[] = (data.moves || []).map((m: any) => m.move.name)
          .slice(0, 40) // limit for performance
        const detailed = await Promise.all(
          moveNames.map(async (name) => {
            try {
              const mv = await getMove(name)
              const effectEntry = mv.effect_entries?.find(e => e.language.name === "en")
              const category = (mv.damage_class?.name || "status").toLowerCase()
              return {
                name: mv.name.replace(/-/g, " "),
                type: mv.type?.name || "normal",
                category: category === "physical" ? "Physical" : category === "special" ? "Special" : "Status",
                power: mv.power,
                accuracy: mv.accuracy,
                pp: mv.pp,
              } as FetchedMove
            } catch (e) {
              return null
            }
          })
        )
        const cleaned = detailed.filter(Boolean) as FetchedMove[]
        if (!cancelled) setMoves(cleaned)
      } catch (e) {
        if (!cancelled) setMoves([])
      }
    }
    load()
    return () => { cancelled = true }
  }, [pokemon.name])
  
  const physicalMoves = moves.filter(move => move.category === "Physical")
  const specialMoves = moves.filter(move => move.category === "Special")
  const statusMoves = moves.filter(move => move.category === "Status")

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="physical">Vật lý</TabsTrigger>
          <TabsTrigger value="special">Đặc biệt</TabsTrigger>
          <TabsTrigger value="status">Trạng thái</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-2">
          {moves.map((move, index) => (
            <Card key={index}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{move.name}</h4>
                    <Badge className={`${typeColors[move.type.toLowerCase()] || 'bg-gray-500'} text-white text-xs`}>
                      {move.type}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${categoryColors[move.category]}`}>
                      {move.category}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    {move.power && <span>Power: {move.power}</span>}
                    {move.accuracy && <span>Acc: {move.accuracy}%</span>}
                    <span>PP: {move.pp}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="physical" className="space-y-2">
          {physicalMoves.map((move, index) => (
            <Card key={index}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{move.name}</h4>
                    <Badge className={`${typeColors[move.type.toLowerCase()] || 'bg-gray-500'} text-white text-xs`}>
                      {move.type}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Power: {move.power}</span>
                    <span>Acc: {move.accuracy}%</span>
                    <span>PP: {move.pp}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="special" className="space-y-2">
          {specialMoves.map((move, index) => (
            <Card key={index}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{move.name}</h4>
                    <Badge className={`${typeColors[move.type.toLowerCase()] || 'bg-gray-500'} text-white text-xs`}>
                      {move.type}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Power: {move.power}</span>
                    <span>Acc: {move.accuracy}%</span>
                    <span>PP: {move.pp}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="status" className="space-y-2">
          {statusMoves.map((move, index) => (
            <Card key={index}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{move.name}</h4>
                    <Badge className={`${typeColors[move.type.toLowerCase()] || 'bg-gray-500'} text-white text-xs`}>
                      {move.type}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    {move.accuracy && <span>Acc: {move.accuracy}%</span>}
                    <span>PP: {move.pp}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
