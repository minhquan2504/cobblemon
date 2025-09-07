"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, User, ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useShiny } from "@/components/providers/Providers"

interface PokemonSprites {
  normal: {
    front: string
    back: string
  }
  shiny: {
    front: string
    back: string
  }
  female?: {
    front: string
    back: string
  }
  shinyFemale?: {
    front: string
    back: string
  }
}

interface PokemonSpritesProps {
  pokemon: {
    id: number
    name: string
    sprites?: PokemonSprites
    spriteUrl?: string
    shinySpriteUrl?: string
  }
  className?: string
}

export function PokemonSprites({ pokemon, className }: PokemonSpritesProps) {
  const [currentView, setCurrentView] = useState<"front" | "back">("front")
  const { shiny, setShiny } = useShiny()
  const [currentVariant, setCurrentVariant] = useState<"normal" | "shiny" | "female" | "shinyFemale">("normal")
  const activeVariant: "normal" | "shiny" | "female" | "shinyFemale" = shiny ? "shiny" : currentVariant

  const getCurrentSprite = () => {
    if (pokemon.sprites) {
      const variant = pokemon.sprites[activeVariant as keyof PokemonSprites] as any
      if (!variant) return pokemon.sprites.normal[currentView]
      return variant[currentView]
    }
    // Fallback cho dữ liệu mock chỉ có spriteUrl
    if (shiny && pokemon.shinySpriteUrl) return pokemon.shinySpriteUrl
    return pokemon.spriteUrl || "/placeholder.png"
  }

  const getVariantLabel = (variant: string) => {
    switch (variant) {
      case "normal": return "Normal"
      case "shiny": return "Shiny"
      case "female": return "Female"
      case "shinyFemale": return "Shiny Female"
      default: return variant
    }
  }

  const isVariantAvailable = (variant: string) => {
    if (!pokemon.sprites) return variant === "normal" && Boolean(pokemon.spriteUrl)
    return pokemon.sprites[variant as keyof PokemonSprites] !== undefined
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Sprites
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Variant Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="font-medium">Sprite</div>
          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium ${activeVariant === "normal" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              onClick={() => { setShiny(false); setCurrentVariant("normal") }}
            >
              Normal
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium ${activeVariant === "shiny" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              onClick={() => { setShiny(true); setCurrentVariant("shiny") }}
            >
              Shiny
            </button>
          </div>
        </div>

        <Tabs value={activeVariant} onValueChange={(value) => setCurrentVariant(value as "normal" | "shiny" | "female" | "shinyFemale")} className="w-full">
          
          <TabsContent value="normal" className="space-y-4">
            <div className="space-y-4">
              {/* Sprite Display */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Image
                    src={getCurrentSprite()}
                    alt={`${pokemon.name} ${getVariantLabel(activeVariant)} ${currentView}`}
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                  
                  {/* View Toggle Buttons */}
                  <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentView("front")}
                      className={cn(
                        "h-8 w-8 p-0",
                        currentView === "front" && "bg-primary text-primary-foreground"
                      )}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentView("back")}
                      className={cn(
                        "h-8 w-8 p-0",
                        currentView === "back" && "bg-primary text-primary-foreground"
                      )}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sprite Info */}
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">
                  {pokemon.name} {" "}
                  {activeVariant === "shiny" ? (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">Shiny</Badge>
                  ) : (
                    <Badge variant="outline">Normal</Badge>
                  )}
                </h3>
                <div className="flex justify-center gap-2">
                  <Badge variant="outline">
                    {currentView === "front" ? "Front" : "Back"} View
                  </Badge>
                  {(activeVariant === "female" || activeVariant === "shinyFemale") && (
                    <Badge className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                      <User className="h-3 w-3 mr-1" />
                      Female
                    </Badge>
                  )}
                </div>
              </div>

              {/* All Sprites Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-center">Normal</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <Image
                        src={pokemon.sprites?.normal.front || pokemon.spriteUrl || "/placeholder.png"}
                        alt={`${pokemon.name} normal front`}
                        width={80}
                        height={80}
                        className="mx-auto object-contain"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Front</p>
                    </div>
                    <div className="text-center">
                      <Image
                        src={pokemon.sprites?.normal.back || pokemon.spriteUrl || "/placeholder.png"}
                        alt={`${pokemon.name} normal back`}
                        width={80}
                        height={80}
                        className="mx-auto object-contain"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Back</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-center flex items-center justify-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Shiny
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <Image
                        src={pokemon.sprites?.shiny.front || pokemon.spriteUrl || "/placeholder.png"}
                        alt={`${pokemon.name} shiny front`}
                        width={80}
                        height={80}
                        className="mx-auto object-contain"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Front</p>
                    </div>
                    <div className="text-center">
                      <Image
                        src={pokemon.sprites?.shiny.back || pokemon.spriteUrl || "/placeholder.png"}
                        alt={`${pokemon.name} shiny back`}
                        width={80}
                        height={80}
                        className="mx-auto object-contain"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Back</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Female Variants (if available) */}
              {(isVariantAvailable("female") || isVariantAvailable("shinyFemale")) && (
                <div className="grid grid-cols-2 gap-4">
                  {isVariantAvailable("female") && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-center flex items-center justify-center gap-1">
                        <User className="h-3 w-3" />
                        Female
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center">
                          <Image
                            src={pokemon.sprites?.female?.front || pokemon.spriteUrl || "/placeholder.png"}
                            alt={`${pokemon.name} female front`}
                            width={80}
                            height={80}
                            className="mx-auto object-contain"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Front</p>
                        </div>
                        <div className="text-center">
                          <Image
                            src={pokemon.sprites?.female?.back || pokemon.spriteUrl || "/placeholder.png"}
                            alt={`${pokemon.name} female back`}
                            width={80}
                            height={80}
                            className="mx-auto object-contain"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Back</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {isVariantAvailable("shinyFemale") && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-center flex items-center justify-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        <User className="h-3 w-3" />
                        Shiny Female
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center">
                          <Image
                            src={pokemon.sprites?.shinyFemale?.front || pokemon.spriteUrl || "/placeholder.png"}
                            alt={`${pokemon.name} shiny female front`}
                            width={80}
                            height={80}
                            className="mx-auto object-contain"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Front</p>
                        </div>
                        <div className="text-center">
                          <Image
                            src={pokemon.sprites?.shinyFemale?.back || pokemon.spriteUrl || "/placeholder.png"}
                            alt={`${pokemon.name} shiny female back`}
                            width={80}
                            height={80}
                            className="mx-auto object-contain"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Back</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="shiny" className="space-y-4">
            <div className="space-y-4">
              {/* Shiny Sprite Display */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Image
                    src={getCurrentSprite()}
                    alt={`${pokemon.name} shiny ${currentView}`}
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                  
                  {/* View Toggle Buttons */}
                  <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentView("front")}
                      className={cn(
                        "h-8 w-8 p-0",
                        currentView === "front" && "bg-primary text-primary-foreground"
                      )}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentView("back")}
                      className={cn(
                        "h-8 w-8 p-0",
                        currentView === "back" && "bg-primary text-primary-foreground"
                      )}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Shiny Info */}
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg flex items-center justify-center gap-2">
                  {pokemon.name}
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Shiny
                  </Badge>
                </h3>
                <Badge variant="outline">
                  {currentView === "front" ? "Front" : "Back"} View
                </Badge>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
