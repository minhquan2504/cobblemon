export type BannedLists = {
  bannedPokemon: string[]
  bannedHeldItems: string[]
  bannedCarriedItems: string[]
  bannedMoves: string[]
}

// Parse a simple ini-like txt with sections in square brackets
export async function fetchBannedLists(relativePath?: string): Promise<BannedLists> {
  // Try JSON source first (preferred)
  try {
    const jsonRes = await fetch(relativePath || "/rank/banned.json")
    if (jsonRes.ok) {
      const data = await jsonRes.json() as Partial<BannedLists>
      return {
        bannedPokemon: data.bannedPokemon || [],
        bannedHeldItems: data.bannedHeldItems || [],
        bannedCarriedItems: data.bannedCarriedItems || [],
        bannedMoves: data.bannedMoves || [],
      }
    }
  } catch {}

  // Fallback to txt ini-like format
  const res = await fetch(relativePath || "/bannedPokemon.txt")
  if (!res.ok) {
    return { bannedPokemon: [], bannedHeldItems: [], bannedCarriedItems: [], bannedMoves: [] }
  }
  const text = await res.text()
  const lines = text.split(/\r?\n/)
  let current: keyof BannedLists | null = null
  const out: BannedLists = { bannedPokemon: [], bannedHeldItems: [], bannedCarriedItems: [], bannedMoves: [] }
  const sectionMap: Record<string, keyof BannedLists> = {
    "banned pokemon": "bannedPokemon",
    "banned held items": "bannedHeldItems",
    "banned carried items": "bannedCarriedItems",
    "banned moves": "bannedMoves",
  }
  for (const raw of lines) {
    const line = raw.trim()
    if (!line || line.startsWith("#")) continue
    const sec = line.match(/^\[(.+?)\]$/i)
    if (sec) {
      const key = sec[1].toLowerCase()
      current = sectionMap[key] ?? null
      continue
    }
    if (current) {
      out[current].push(line)
    }
  }
  return out
}

export type SeasonEntry = {
  rank: number
  name: string
  elo: number
  wins: number
  losses: number
  disconnects: number
}


