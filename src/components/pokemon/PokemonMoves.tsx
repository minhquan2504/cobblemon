"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

// Mock moves data - trong thực tế sẽ fetch từ API
const mockMoves = {
  1: [ // Bulbasaur
    { name: "Tackle", type: "Normal", category: "Physical", power: 40, accuracy: 100, pp: 35 },
    { name: "Growl", type: "Normal", category: "Status", power: null, accuracy: 100, pp: 40 },
    { name: "Vine Whip", type: "Grass", category: "Physical", power: 45, accuracy: 100, pp: 25 },
    { name: "Growth", type: "Normal", category: "Status", power: null, accuracy: null, pp: 20 },
    { name: "Leech Seed", type: "Grass", category: "Status", power: null, accuracy: 90, pp: 10 },
    { name: "Razor Leaf", type: "Grass", category: "Physical", power: 55, accuracy: 95, pp: 25 },
    { name: "Sweet Scent", type: "Normal", category: "Status", power: null, accuracy: 100, pp: 20 },
    { name: "Synthesis", type: "Grass", category: "Status", power: null, accuracy: null, pp: 5 },
    { name: "Worry Seed", type: "Grass", category: "Status", power: null, accuracy: 100, pp: 10 },
    { name: "Seed Bomb", type: "Grass", category: "Physical", power: 80, accuracy: 100, pp: 15 }
  ],
  4: [ // Charmander
    { name: "Scratch", type: "Normal", category: "Physical", power: 40, accuracy: 100, pp: 35 },
    { name: "Growl", type: "Normal", category: "Status", power: null, accuracy: 100, pp: 40 },
    { name: "Ember", type: "Fire", category: "Special", power: 40, accuracy: 100, pp: 25 },
    { name: "Smokescreen", type: "Normal", category: "Status", power: null, accuracy: 100, pp: 20 },
    { name: "Dragon Rage", type: "Dragon", category: "Special", power: null, accuracy: 100, pp: 10 },
    { name: "Scary Face", type: "Normal", category: "Status", power: null, accuracy: 100, pp: 10 },
    { name: "Fire Fang", type: "Fire", category: "Physical", power: 65, accuracy: 95, pp: 15 },
    { name: "Flame Burst", type: "Fire", category: "Special", power: 70, accuracy: 100, pp: 15 },
    { name: "Slash", type: "Normal", category: "Physical", power: 70, accuracy: 100, pp: 20 },
    { name: "Flamethrower", type: "Fire", category: "Special", power: 90, accuracy: 100, pp: 15 }
  ],
  7: [ // Squirtle
    { name: "Tackle", type: "Normal", category: "Physical", power: 40, accuracy: 100, pp: 35 },
    { name: "Tail Whip", type: "Normal", category: "Status", power: null, accuracy: 100, pp: 30 },
    { name: "Water Gun", type: "Water", category: "Special", power: 40, accuracy: 100, pp: 25 },
    { name: "Withdraw", type: "Water", category: "Status", power: null, accuracy: null, pp: 40 },
    { name: "Bite", type: "Dark", category: "Physical", power: 60, accuracy: 100, pp: 25 },
    { name: "Water Pulse", type: "Water", category: "Special", power: 60, accuracy: 100, pp: 20 },
    { name: "Bubble Beam", type: "Water", category: "Special", power: 65, accuracy: 100, pp: 20 },
    { name: "Protect", type: "Normal", category: "Status", power: null, accuracy: null, pp: 10 },
    { name: "Rain Dance", type: "Water", category: "Status", power: null, accuracy: null, pp: 5 },
    { name: "Aqua Tail", type: "Water", category: "Physical", power: 90, accuracy: 90, pp: 10 }
  ],
  25: [ // Pikachu
    { name: "Thunder Shock", type: "Electric", category: "Special", power: 40, accuracy: 100, pp: 30 },
    { name: "Tail Whip", type: "Normal", category: "Status", power: null, accuracy: 100, pp: 30 },
    { name: "Quick Attack", type: "Normal", category: "Physical", power: 40, accuracy: 100, pp: 30 },
    { name: "Thunder Wave", type: "Electric", category: "Status", power: null, accuracy: 90, pp: 20 },
    { name: "Electro Ball", type: "Electric", category: "Special", power: null, accuracy: 100, pp: 10 },
    { name: "Double Team", type: "Normal", category: "Status", power: null, accuracy: null, pp: 15 },
    { name: "Thunderbolt", type: "Electric", category: "Special", power: 90, accuracy: 100, pp: 15 },
    { name: "Agility", type: "Psychic", category: "Status", power: null, accuracy: null, pp: 30 },
    { name: "Discharge", type: "Electric", category: "Special", power: 80, accuracy: 100, pp: 15 },
    { name: "Thunder", type: "Electric", category: "Special", power: 110, accuracy: 70, pp: 10 }
  ]
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
  const moves = mockMoves[pokemon.id as keyof typeof mockMoves] || []
  
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
