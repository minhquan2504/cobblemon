"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Sword } from "lucide-react"
import { cn } from "@/lib/utils"
import { getDefensiveTypeMultipliers, getTypeList } from "@/lib/pokeapi"

interface TypeEffectiveness {
  attacking: Record<string, Record<string, number>>
  defending: Record<string, Record<string, number>>
}

// Fallback minimal table if network fails
const mockTypeEffectiveness: TypeEffectiveness = {
  attacking: {
    normal: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 0.5, ghost: 0, dragon: 1, dark: 1, steel: 0.5, fairy: 1 },
    fire: { normal: 1, fire: 0.5, water: 0.5, electric: 1, grass: 2, ice: 2, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 2, rock: 0.5, ghost: 1, dragon: 0.5, dark: 1, steel: 2, fairy: 1 },
    water: { normal: 1, fire: 2, water: 0.5, electric: 1, grass: 0.5, ice: 1, fighting: 1, poison: 1, ground: 2, flying: 1, psychic: 1, bug: 1, rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 1, fairy: 1 },
    electric: { normal: 1, fire: 1, water: 2, electric: 0.5, grass: 0.5, ice: 1, fighting: 1, poison: 1, ground: 0, flying: 2, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 0.5, dark: 1, steel: 1, fairy: 1 },
    grass: { normal: 1, fire: 0.5, water: 2, electric: 1, grass: 0.5, ice: 1, fighting: 1, poison: 0.5, ground: 2, flying: 0.5, psychic: 1, bug: 0.5, rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 0.5, fairy: 1 },
    ice: { normal: 1, fire: 0.5, water: 0.5, electric: 1, grass: 2, ice: 0.5, fighting: 1, poison: 1, ground: 2, flying: 2, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5, fairy: 1 },
    fighting: { normal: 2, fire: 1, water: 1, electric: 1, grass: 1, ice: 2, fighting: 1, poison: 0.5, ground: 1, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dragon: 1, dark: 2, steel: 2, fairy: 0.5 },
    poison: { normal: 1, fire: 1, water: 1, electric: 1, grass: 2, ice: 1, fighting: 1, poison: 0.5, ground: 0.5, flying: 1, psychic: 1, bug: 1, rock: 0.5, ghost: 0.5, dragon: 1, dark: 1, steel: 0, fairy: 2 },
    ground: { normal: 1, fire: 2, water: 1, electric: 2, grass: 0.5, ice: 1, fighting: 1, poison: 2, ground: 1, flying: 0, psychic: 1, bug: 0.5, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 2, fairy: 1 },
    flying: { normal: 1, fire: 1, water: 1, electric: 0.5, grass: 2, ice: 1, fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 2, rock: 0.5, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1 },
    psychic: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 2, poison: 2, ground: 1, flying: 1, psychic: 0.5, bug: 1, rock: 1, ghost: 1, dragon: 1, dark: 0, steel: 0.5, fairy: 1 },
    bug: { normal: 1, fire: 0.5, water: 1, electric: 1, grass: 2, ice: 1, fighting: 0.5, poison: 0.5, ground: 1, flying: 0.5, psychic: 2, bug: 1, rock: 1, ghost: 0.5, dragon: 1, dark: 2, steel: 0.5, fairy: 0.5 },
    rock: { normal: 1, fire: 2, water: 1, electric: 1, grass: 1, ice: 2, fighting: 0.5, poison: 1, ground: 0.5, flying: 2, psychic: 1, bug: 2, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1 },
    ghost: { normal: 0, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 2, bug: 1, rock: 1, ghost: 2, dragon: 1, dark: 0.5, steel: 1, fairy: 1 },
    dragon: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5, fairy: 0 },
    dark: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 0.5, poison: 1, ground: 1, flying: 1, psychic: 2, bug: 1, rock: 1, ghost: 2, dragon: 1, dark: 0.5, steel: 1, fairy: 0.5 },
    steel: { normal: 1, fire: 0.5, water: 0.5, electric: 0.5, grass: 1, ice: 2, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 2 },
    fairy: { normal: 1, fire: 0.5, water: 1, electric: 1, grass: 1, ice: 1, fighting: 2, poison: 0.5, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 2, steel: 0.5, fairy: 1 }
  },
  defending: {
    normal: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 0, dragon: 1, dark: 1, steel: 1, fairy: 1 },
    fire: { normal: 1, fire: 0.5, water: 2, electric: 1, grass: 0.5, ice: 0.5, fighting: 1, poison: 1, ground: 2, flying: 1, psychic: 1, bug: 0.5, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 0.5 },
    water: { normal: 1, fire: 0.5, water: 0.5, electric: 2, grass: 2, ice: 0.5, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1 },
    electric: { normal: 1, fire: 1, water: 1, electric: 0.5, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 2, flying: 0.5, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1 },
    grass: { normal: 1, fire: 2, water: 0.5, electric: 0.5, grass: 0.5, ice: 2, fighting: 1, poison: 2, ground: 0.5, flying: 2, psychic: 1, bug: 2, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 1, fairy: 1 },
    ice: { normal: 1, fire: 2, water: 1, electric: 1, grass: 1, ice: 0.5, fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 2, fairy: 1 },
    fighting: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 2, psychic: 2, bug: 0.5, rock: 0.5, ghost: 1, dragon: 1, dark: 0.5, steel: 1, fairy: 2 },
    poison: { normal: 1, fire: 1, water: 1, electric: 1, grass: 0.5, ice: 1, fighting: 0.5, poison: 0.5, ground: 2, flying: 1, psychic: 2, bug: 0.5, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 1, fairy: 0.5 },
    ground: { normal: 1, fire: 1, water: 2, electric: 0, grass: 2, ice: 2, fighting: 1, poison: 0.5, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 0.5, ghost: 1, dragon: 1, dark: 1, steel: 1, fairy: 1 },
    flying: { normal: 1, fire: 1, water: 1, electric: 2, grass: 0.5, ice: 2, fighting: 0.5, poison: 1, ground: 0, flying: 1, psychic: 1, bug: 0.5, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 1, fairy: 1 },
    psychic: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 0.5, poison: 1, ground: 1, flying: 1, psychic: 0.5, bug: 2, rock: 1, ghost: 2, dragon: 1, dark: 2, steel: 1, fairy: 1 },
    bug: { normal: 1, fire: 2, water: 1, electric: 1, grass: 0.5, ice: 1, fighting: 0.5, poison: 1, ground: 0.5, flying: 2, psychic: 1, bug: 1, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 1, fairy: 1 },
    rock: { normal: 0.5, fire: 0.5, water: 2, electric: 1, grass: 2, ice: 1, fighting: 2, poison: 0.5, ground: 2, flying: 0.5, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 2, fairy: 1 },
    ghost: { normal: 0, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 0, poison: 0.5, ground: 1, flying: 1, psychic: 1, bug: 0.5, rock: 1, ghost: 2, dragon: 1, dark: 2, steel: 1, fairy: 1 },
    dragon: { normal: 1, fire: 0.5, water: 0.5, electric: 0.5, grass: 0.5, ice: 2, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 1, fairy: 2 },
    dark: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 0, bug: 2, rock: 1, ghost: 0.5, dragon: 1, dark: 0.5, steel: 1, fairy: 2 },
    steel: { normal: 0.5, fire: 2, water: 1, electric: 1, grass: 0.5, ice: 0.5, fighting: 2, poison: 0, ground: 2, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 0.5, ghost: 1, dragon: 0.5, dark: 1, steel: 0.5, fairy: 0.5 },
    fairy: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 0.5, poison: 2, ground: 1, flying: 1, psychic: 1, bug: 0.5, rock: 1, ghost: 1, dragon: 0, dark: 0.5, steel: 2, fairy: 1 }
  }
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

const effectivenessColors = {
  0: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  0.5: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  1: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  2: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
}

const effectivenessLabels = {
  0: "No Effect",
  0.5: "Not Very Effective",
  1: "Normal",
  2: "Super Effective"
}

export function TypeChart({ defendingTypes }: { defendingTypes?: string[] }) {
  const [selectedType, setSelectedType] = useState<string>("normal")
  const [mode, setMode] = useState<"attacking" | "defending">("attacking")
  const [allTypes, setAllTypes] = useState<string[]>(Object.keys(mockTypeEffectiveness.attacking))
  const [defensive, setDefensive] = useState<Record<string, number> | null>(null)

  useEffect(() => {
    getTypeList().then((res) => {
      const list = (res?.results || [])
        .map((t) => t.name)
        .filter((n: string) => !["unknown", "shadow"].includes(n))
      if (list.length) setAllTypes(list)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!defendingTypes || defendingTypes.length === 0) return
    getDefensiveTypeMultipliers(defendingTypes).then(setDefensive).catch(() => setDefensive(null))
  }, [defendingTypes?.join(",")])

  const effectiveness = useMemo(() => {
    if (mode === "defending" && defensive) {
      return defensive
    }
    // Attacking mode uses fallback table for now
    const table = mockTypeEffectiveness.attacking[selectedType]
    return table
  }, [mode, defensive, selectedType])

  const getEffectivenessColor = (value: number) => {
    if (value === 0) return effectivenessColors[0]
    if (value === 0.5) return effectivenessColors[0.5]
    if (value === 1) return effectivenessColors[1]
    if (value === 2) return effectivenessColors[2]
    return effectivenessColors[1]
  }

  const getEffectivenessLabel = (value: number) => {
    if (value === 0) return effectivenessLabels[0]
    if (value === 0.5) return effectivenessLabels[0.5]
    if (value === 1) return effectivenessLabels[1]
    if (value === 2) return effectivenessLabels[2]
    return effectivenessLabels[1]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {mode === "attacking" ? <Sword className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
          Type Chart
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={mode} onValueChange={(value) => setMode(value as "attacking" | "defending")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="attacking" className="flex items-center gap-2">
              <Sword className="h-4 w-4" />
              Tấn công
            </TabsTrigger>
            <TabsTrigger value="defending" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Phòng thủ
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="attacking" className="space-y-4">
            <div>
              <h3 className="font-medium mb-3">Chọn type để tấn công:</h3>
              <div className="grid grid-cols-6 gap-2 mb-4">
                {allTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      "p-2 rounded-md text-white text-sm font-medium transition-all",
                      selectedType === type 
                        ? "ring-2 ring-primary ring-offset-2" 
                        : "hover:opacity-80",
                      typeColors[type] || "bg-gray-500"
                    )}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Hiệu quả tấn công:</h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(effectiveness).map(([targetType, value]) => (
                  <div
                    key={targetType}
                    className={cn(
                      "p-3 rounded-lg text-center transition-all",
                      getEffectivenessColor(value)
                    )}
                  >
                    <div className="font-medium text-sm">
                      {targetType.charAt(0).toUpperCase() + targetType.slice(1)}
                    </div>
                    <div className="text-xs mt-1">
                      {value}x - {getEffectivenessLabel(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="defending" className="space-y-4">
            <div>
              <h3 className="font-medium mb-3">Chọn type để phòng thủ:</h3>
              <div className="grid grid-cols-6 gap-2 mb-4">
                {allTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      "p-2 rounded-md text-white text-sm font-medium transition-all",
                      selectedType === type 
                        ? "ring-2 ring-primary ring-offset-2" 
                        : "hover:opacity-80",
                      typeColors[type] || "bg-gray-500"
                    )}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Hiệu quả phòng thủ:</h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(effectiveness).map(([attackerType, value]) => (
                  <div
                    key={attackerType}
                    className={cn(
                      "p-3 rounded-lg text-center transition-all",
                      getEffectivenessColor(value)
                    )}
                  >
                    <div className="font-medium text-sm">
                      {attackerType.charAt(0).toUpperCase() + attackerType.slice(1)}
                    </div>
                    <div className="text-xs mt-1">
                      {value}x - {getEffectivenessLabel(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
