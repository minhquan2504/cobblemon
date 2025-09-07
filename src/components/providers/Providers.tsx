"use client"

import { SessionProvider } from "next-auth/react"

import { createContext, useContext, useMemo, useState } from "react"

type ShinyContextValue = {
  shiny: boolean
  setShiny: (value: boolean) => void
}

const ShinyContext = createContext<ShinyContextValue | undefined>(undefined)

export function useShiny() {
  const ctx = useContext(ShinyContext)
  if (!ctx) throw new Error("useShiny must be used within ShinyProvider")
  return ctx
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [shiny, setShiny] = useState(false)
  const value = useMemo(() => ({ shiny, setShiny }), [shiny])
  return (
    <SessionProvider>
      <ShinyContext.Provider value={value}>
        {children}
      </ShinyContext.Provider>
    </SessionProvider>
  )
}
