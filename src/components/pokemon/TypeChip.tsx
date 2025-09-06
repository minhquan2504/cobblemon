"use client"

import { cn } from "@/lib/utils"

interface TypeChipProps {
  type: string
  className?: string
  size?: "sm" | "md" | "lg"
}

const typeColors: Record<string, string> = {
  fire: "type-fire",
  water: "type-water", 
  grass: "type-grass",
  electric: "type-electric",
  psychic: "type-psychic",
  ice: "type-ice",
  dragon: "type-dragon",
  dark: "type-dark",
  fairy: "type-fairy",
  fighting: "type-fighting",
  poison: "type-poison",
  ground: "type-ground",
  flying: "type-flying",
  bug: "type-bug",
  rock: "type-rock",
  ghost: "type-ghost",
  steel: "type-steel",
  normal: "type-normal"
}

const sizeClasses = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1 text-sm", 
  lg: "px-4 py-2 text-base"
}

export function TypeChip({ type, className, size = "md" }: TypeChipProps) {
  const normalizedType = type.toLowerCase()
  const typeClass = typeColors[normalizedType] || "type-normal"
  
  return (
    <span 
      className={cn(
        "type-chip",
        typeClass,
        sizeClasses[size],
        className
      )}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  )
}
