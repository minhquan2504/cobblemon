"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface FormatLegalityBadgeProps {
  status?: "Allowed" | "Banned" | "Conditional"
  format?: string
  className?: string
  pokemonName?: string
  moveName?: string
  abilityName?: string
  itemName?: string
}

const statusConfig = {
  Allowed: {
    icon: CheckCircle,
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    label: "Allowed"
  },
  Banned: {
    icon: XCircle,
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    label: "Banned"
  },
  Conditional: {
    icon: AlertTriangle,
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    label: "Conditional"
  }
}

export function FormatLegalityBadge({ 
  status, 
  format, 
  className, 
  pokemonName, 
  moveName, 
  abilityName, 
  itemName 
}: FormatLegalityBadgeProps) {
  const [isBanned, setIsBanned] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!format || (!pokemonName && !moveName && !abilityName && !itemName)) {
      return
    }

    const checkBanStatus = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({ format })
        if (pokemonName) params.append('pokemon', pokemonName)
        if (moveName) params.append('move', moveName)
        if (abilityName) params.append('ability', abilityName)
        if (itemName) params.append('item', itemName)

        const response = await fetch(`/api/rules/check?${params}`)
        if (response.ok) {
          const data = await response.json()
          const result = data.results
          const banned = result.pokemon || result.move || result.ability || result.item || false
          setIsBanned(banned)
        }
      } catch (error) {
        console.error('Error checking ban status:', error)
        setIsBanned(false) // Default to allowed if error
      } finally {
        setIsLoading(false)
      }
    }

    checkBanStatus()
  }, [format, pokemonName, moveName, abilityName, itemName])

  // Use provided status if available, otherwise use dynamic status
  const finalStatus = status || (isBanned === null ? undefined : isBanned ? "Banned" : "Allowed")
  
  if (isLoading) {
    return (
      <Badge 
        className={cn(
          "flex items-center gap-1 text-xs",
          "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
          className
        )}
      >
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Checking...</span>
      </Badge>
    )
  }

  if (!finalStatus) {
    return null
  }

  const config = statusConfig[finalStatus]
  const Icon = config.icon

  return (
    <Badge 
      className={cn(
        "flex items-center gap-1 text-xs",
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
      {format && (
        <span className="ml-1 opacity-75">({format})</span>
      )}
    </Badge>
  )
}
