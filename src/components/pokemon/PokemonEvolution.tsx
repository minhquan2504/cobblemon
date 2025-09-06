"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
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

interface PokemonEvolutionProps {
  pokemon: Pokemon
}

// Mock evolution data - trong thực tế sẽ fetch từ PokeAPI
const evolutionChains = {
  1: [ // Bulbasaur evolution chain
    { id: 1, name: "Bulbasaur", spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png", condition: "Base form" },
    { id: 2, name: "Ivysaur", spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png", condition: "Level 16" },
    { id: 3, name: "Venusaur", spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png", condition: "Level 32" }
  ],
  4: [ // Charmander evolution chain
    { id: 4, name: "Charmander", spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png", condition: "Base form" },
    { id: 5, name: "Charmeleon", spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png", condition: "Level 16" },
    { id: 6, name: "Charizard", spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png", condition: "Level 36" }
  ],
  7: [ // Squirtle evolution chain
    { id: 7, name: "Squirtle", spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png", condition: "Base form" },
    { id: 8, name: "Wartortle", spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png", condition: "Level 16" },
    { id: 9, name: "Blastoise", spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png", condition: "Level 36" }
  ],
  25: [ // Pikachu evolution chain
    { id: 172, name: "Pichu", spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/172.png", condition: "Base form" },
    { id: 25, name: "Pikachu", spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png", condition: "High Friendship" },
    { id: 26, name: "Raichu", spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png", condition: "Thunder Stone" }
  ]
}

export function PokemonEvolution({ pokemon }: PokemonEvolutionProps) {
  const evolutionChain = evolutionChains[pokemon.id as keyof typeof evolutionChains] || []
  
  if (evolutionChain.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>Không có thông tin tiến hóa cho Pokémon này.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-4 overflow-x-auto">
        {evolutionChain.map((evolution, index) => (
          <div key={evolution.id} className="flex items-center">
            <Card className={`w-32 ${evolution.id === pokemon.id ? 'ring-2 ring-primary' : ''}`}>
              <CardContent className="p-3 text-center">
                <div className="mb-2">
                  <Image
                    src={evolution.spriteUrl}
                    alt={evolution.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 mx-auto object-contain"
                  />
                </div>
                <h4 className="font-medium text-sm mb-1">{evolution.name}</h4>
                <Badge variant="outline" className="text-xs">
                  {evolution.condition}
                </Badge>
              </CardContent>
            </Card>
            {index < evolutionChain.length - 1 && (
              <ArrowRight className="h-6 w-6 text-muted-foreground mx-2 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Nhấp vào từng Pokémon để xem chi tiết</p>
      </div>
    </div>
  )
}
