"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { getEvolutionChainBySpeciesId, getPokemonSpecies, PokeAPIEvolutionChain } from "@/lib/pokeapi"

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

type EvoNode = { id: number; name: string; spriteUrl: string; condition: string }

export function PokemonEvolution({ pokemon }: PokemonEvolutionProps) {
  const [chain, setChain] = useState<EvoNode[]>([])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const species = await getPokemonSpecies(pokemon.id)
        const evo = await getEvolutionChainBySpeciesId((species as any).id)
        const flat = flattenEvolutionChain(evo)
        if (!cancelled) setChain(flat)
      } catch (e) {
        if (!cancelled) setChain([])
      }
    }
    load()
    return () => { cancelled = true }
  }, [pokemon.id])
  
  if (chain.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>Không có thông tin tiến hóa cho Pokémon này.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-4 overflow-x-auto">
        {chain.map((evolution, index) => (
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
            {index < chain.length - 1 && (
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

function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/)
  return match ? parseInt(match[1], 10) : 0
}

function flattenEvolutionChain(evo: PokeAPIEvolutionChain): EvoNode[] {
  const nodes: EvoNode[] = []
  function walk(node: PokeAPIEvolutionChain["chain"], trigger?: any) {
    const speciesName = node.species.name
    const speciesId = extractIdFromUrl(node.species.url)
    const condition = triggerToText(trigger)
    nodes.push({
      id: speciesId,
      name: speciesName,
      spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesId}.png`,
      condition: condition || "Base form",
    })
    for (const nxt of node.evolves_to) {
      // Attempt to read first trigger; PokeAPI puts evolution_details array on the evolves_to item
      const anyNxt: any = nxt as any
      const details = Array.isArray(anyNxt.evolution_details) ? anyNxt.evolution_details[0] : undefined
      walk(nxt as any, details)
    }
  }
  walk(evo.chain)
  // de-duplicate consecutive
  const map = new Map<number, EvoNode>()
  for (const n of nodes) map.set(n.id, n)
  return Array.from(map.values())
}

function triggerToText(details?: any): string {
  if (!details) return "Base form"
  if (details.min_level) return `Level ${details.min_level}`
  if (details.trigger?.name === "use-item" && details.item?.name) return camelToTitle(details.item.name)
  if (details.trigger?.name === "trade") return "Trade"
  if (details.trigger?.name === "level-up") return "Level up"
  return camelToTitle(details.trigger?.name || "Evolve")
}

function camelToTitle(s: string): string {
  return s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
}
