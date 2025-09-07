// PokeAPI integration utilities
const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2"

export interface PokeAPIPokemon {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number
  order: number
  is_default: boolean
  moves?: Array<{
    move: { name: string; url: string }
    version_group_details: Array<{
      level_learned_at: number
      move_learn_method: { name: string; url: string }
      version_group: { name: string; url: string }
    }>
  }>
  sprites: {
    front_default: string
    front_shiny: string
    front_female?: string
    front_shiny_female?: string
    back_default: string
    back_shiny: string
    back_female?: string
    back_shiny_female?: string
    other: {
      "official-artwork": {
        front_default: string
        front_shiny: string
      }
    }
  }
  types: Array<{
    slot: number
    type: {
      name: string
      url: string
    }
  }>
  stats: Array<{
    base_stat: number
    effort: number
    stat: {
      name: string
      url: string
    }
  }>
  abilities: Array<{
    ability: {
      name: string
      url: string
    }
    is_hidden: boolean
    slot: number
  }>
  species: {
    name: string
    url: string
  }
}

// Species and evolution types (minimal fields we use)
export interface PokeAPIPokemonSpecies {
  id: number
  name: string
  generation: { name: string; url: string }
  evolution_chain: { url: string }
  varieties: Array<{
    is_default: boolean
    pokemon: { name: string; url: string }
  }>
}

export interface PokeAPIEvolutionChain {
  id: number
  chain: {
    species: { name: string; url: string }
    evolves_to: PokeAPIEvolutionChain["chain"][]
  }
}

// Pokemon form
export interface PokeAPIPokemonForm {
  id: number
  name: string
  form_name: string | null
  is_mega: boolean
  is_battle_only: boolean
  is_default: boolean
  pokemon: { name: string; url: string }
  sprites: {
    front_default: string | null
    back_default: string | null
    front_shiny: string | null
    back_shiny: string | null
  }
}

// Ability
export interface PokeAPIAbilityListEntry { name: string; url: string }
export interface PokeAPIAbility {
  id: number
  name: string
  effect_entries: Array<{
    effect: string
    short_effect: string
    language: { name: string; url: string }
  }>
}

export interface PokeAPIMove {
  id: number
  name: string
  accuracy: number
  effect_chance: number | null
  pp: number
  priority: number
  power: number | null
  damage_class: {
    name: string
    url: string
  }
  type: {
    name: string
    url: string
  }
  effect_entries: Array<{
    effect: string
    language: {
      name: string
      url: string
    }
    short_effect: string
  }>
  flavor_text_entries: Array<{
    flavor_text: string
    language: {
      name: string
      url: string
    }
    version_group: {
      name: string
      url: string
    }
  }>
}

export interface PokeAPIType {
  id: number
  name: string
  damage_relations: {
    double_damage_from: Array<{ name: string; url: string }>
    double_damage_to: Array<{ name: string; url: string }>
    half_damage_from: Array<{ name: string; url: string }>
    half_damage_to: Array<{ name: string; url: string }>
    no_damage_from: Array<{ name: string; url: string }>
    no_damage_to: Array<{ name: string; url: string }>
  }
}

export interface PokeAPIItem {
  id: number
  name: string
  cost: number
  fling_power: number | null
  fling_effect: {
    name: string
    url: string
  } | null
  attributes: Array<{
    name: string
    url: string
  }>
  category: {
    name: string
    url: string
  }
  effect_entries: Array<{
    effect: string
    language: {
      name: string
      url: string
    }
    short_effect: string
  }>
  flavor_text_entries: Array<{
    flavor_text: string
    language: {
      name: string
      url: string
    }
    version_group: {
      name: string
      url: string
    }
  }>
}

// Cache for API responses
type CacheEntry<T> = { data: T; timestamp: number }
const cache = new Map<string, CacheEntry<unknown>>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function fetchWithCache<T>(url: string): Promise<T> {
  const cached = cache.get(url)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = (await response.json()) as T
    cache.set(url, { data, timestamp: Date.now() })
    return data
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
    throw error
  }
}

// Pokemon API functions
export async function getPokemon(idOrName: string | number): Promise<PokeAPIPokemon> {
  const url = `${POKEAPI_BASE_URL}/pokemon/${idOrName}`
  return fetchWithCache<PokeAPIPokemon>(url)
}

export async function getPokemonList(limit: number = 20, offset: number = 0): Promise<{
  count: number
  next: string | null
  previous: string | null
  results: Array<{ name: string; url: string }>
}> {
  const url = `${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  return fetchWithCache(url)
}

export async function getPokemonSpecies(idOrName: string | number): Promise<PokeAPIPokemonSpecies> {
  const url = `${POKEAPI_BASE_URL}/pokemon-species/${idOrName}`
  return fetchWithCache<PokeAPIPokemonSpecies>(url)
}

export async function getPokemonSpeciesList(limit: number = 20, offset: number = 0): Promise<{
  count: number
  next: string | null
  previous: string | null
  results: Array<{ name: string; url: string }>
}> {
  const url = `${POKEAPI_BASE_URL}/pokemon-species?limit=${limit}&offset=${offset}`
  return fetchWithCache(url)
}

// Move API functions
export async function getMove(idOrName: string | number): Promise<PokeAPIMove> {
  const url = `${POKEAPI_BASE_URL}/move/${idOrName}`
  return fetchWithCache<PokeAPIMove>(url)
}

export async function getMoveList(limit: number = 20, offset: number = 0): Promise<{ count: number; results: Array<{ name: string; url: string }> }> {
  const url = `${POKEAPI_BASE_URL}/move?limit=${limit}&offset=${offset}`
  return fetchWithCache(url)
}

// Type API functions
export async function getType(idOrName: string | number): Promise<PokeAPIType> {
  const url = `${POKEAPI_BASE_URL}/type/${idOrName}`
  return fetchWithCache<PokeAPIType>(url)
}

export async function getTypeList(): Promise<{ results: Array<{ name: string; url: string }> }> {
  const url = `${POKEAPI_BASE_URL}/type`
  return fetchWithCache(url)
}

// Item API functions
export async function getItem(idOrName: string | number): Promise<PokeAPIItem> {
  const url = `${POKEAPI_BASE_URL}/item/${idOrName}`
  return fetchWithCache<PokeAPIItem>(url)
}

export async function getItemList(limit: number = 20, offset: number = 0): Promise<{ count: number; results: Array<{ name: string; url: string }> }> {
  const url = `${POKEAPI_BASE_URL}/item?limit=${limit}&offset=${offset}`
  return fetchWithCache(url)
}

// Ability API functions
export async function getAbility(idOrName: string | number): Promise<PokeAPIAbility> {
  const url = `${POKEAPI_BASE_URL}/ability/${idOrName}`
  return fetchWithCache<PokeAPIAbility>(url)
}

export async function getAbilityList(limit: number = 20, offset: number = 0): Promise<{ count: number; results: PokeAPIAbilityListEntry[] }> {
  const url = `${POKEAPI_BASE_URL}/ability?limit=${limit}&offset=${offset}`
  return fetchWithCache(url)
}

// Form API functions
export async function getPokemonForm(idOrName: string | number): Promise<PokeAPIPokemonForm> {
  const url = `${POKEAPI_BASE_URL}/pokemon-form/${idOrName}`
  return fetchWithCache<PokeAPIPokemonForm>(url)
}

// Utility functions
function generationNameToNumber(generationName?: string): number | undefined {
  if (!generationName) return undefined
  const mapping: Record<string, number> = {
    "generation-i": 1,
    "generation-ii": 2,
    "generation-iii": 3,
    "generation-iv": 4,
    "generation-v": 5,
    "generation-vi": 6,
    "generation-vii": 7,
    "generation-viii": 8,
    "generation-ix": 9,
  }
  return mapping[generationName]
}

export function transformPokemonData(pokeApiData: PokeAPIPokemon, speciesGenerationName?: string) {
  return {
    id: pokeApiData.id,
    name: pokeApiData.name,
    gen: generationNameToNumber(speciesGenerationName) || Math.ceil(pokeApiData.id / 151),
    types: pokeApiData.types.map(t => t.type.name),
    stats: {
      hp: pokeApiData.stats.find(s => s.stat.name === "hp")?.base_stat || 0,
      atk: pokeApiData.stats.find(s => s.stat.name === "attack")?.base_stat || 0,
      def: pokeApiData.stats.find(s => s.stat.name === "defense")?.base_stat || 0,
      spa: pokeApiData.stats.find(s => s.stat.name === "special-attack")?.base_stat || 0,
      spd: pokeApiData.stats.find(s => s.stat.name === "special-defense")?.base_stat || 0,
      spe: pokeApiData.stats.find(s => s.stat.name === "speed")?.base_stat || 0,
    },
    abilities: pokeApiData.abilities.map(a => a.ability.name),
    spriteUrl: pokeApiData.sprites.front_default,
    shinySpriteUrl: pokeApiData.sprites.front_shiny,
    femaleSpriteUrl: pokeApiData.sprites.front_female,
    backSpriteUrl: pokeApiData.sprites.back_default,
    height: pokeApiData.height,
    weight: pokeApiData.weight,
    baseExperience: pokeApiData.base_experience,
  }
}

export function getTypeEffectiveness(attackingType: string, defendingType: string): number {
  // This would be implemented based on PokeAPI type data
  // For now, return a mock value
  return 1
}

// Compute defensive multipliers for a Pokemon's type combination
export async function getDefensiveTypeMultipliers(pokemonTypes: string[]): Promise<Record<string, number>> {
  // Fetch type data for each defending type
  const typeDataList = await Promise.all(
    pokemonTypes.map(async (t) => getType(t))
  )
  // Initialize multipliers for all attack types
  const allTypesResp = await getTypeList()
  const allTypes: string[] = (allTypesResp?.results || [])
    .map((t) => t.name)
    .filter((n: string) => !["unknown", "shadow"].includes(n))

  const multipliers: Record<string, number> = {}
  for (const atk of allTypes) multipliers[atk] = 1

  for (const defending of typeDataList) {
    const rel = defending.damage_relations
    const apply = (names: Array<{ name: string }>, factor: number) => {
      for (const n of names) {
        if (multipliers[n.name] !== undefined) multipliers[n.name] *= factor
      }
    }
    apply(rel.double_damage_from, 2)
    apply(rel.half_damage_from, 0.5)
    apply(rel.no_damage_from, 0)
  }
  return multipliers
}

// Search function
export async function searchPokeAPI(query: string, limit: number = 10) {
  const results = []
  
  try {
    // Search Pokemon
    const pokemonList = await getPokemonList(1000, 0)
    const matchingPokemon = pokemonList.results
      .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, Math.max(1, Math.floor(limit / 2)))
    
    for (const pokemon of matchingPokemon) {
      try {
        const pokemonData = await getPokemon(pokemon.name)
        results.push({
          type: "pokemon",
          data: transformPokemonData(pokemonData)
        })
      } catch (error) {
        console.error(`Error fetching pokemon ${pokemon.name}:`, error)
      }
    }

    // Search Moves
    const moveList = await getMoveList(500, 0)
    const matchingMoves = moveList.results
      .filter((m) => m.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, Math.max(1, Math.floor(limit / 3)))
    for (const mv of matchingMoves) {
      try {
        const m = await getMove(mv.name)
        results.push({
          type: "move",
          data: { name: m.name, gen: 0, types: [m.type?.name].filter(Boolean) }
        })
      } catch {}
    }

    // Search Abilities
    const abilityList = await getAbilityList(500, 0)
    const matchingAbilities = abilityList.results
      .filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, Math.max(1, Math.floor(limit / 3)))
    for (const ab of matchingAbilities) {
      try {
        const a = await getAbility(ab.name)
        results.push({ type: "ability", data: { name: a.name, gen: 0, types: [] } })
      } catch {}
    }

    // Search Items
    const itemList = await getItemList(500, 0)
    const matchingItems = itemList.results
      .filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, Math.max(1, Math.floor(limit / 3)))
    for (const it of matchingItems) {
      results.push({ type: "item", data: { name: it.name, gen: 0, types: [] } })
    }
  } catch (error) {
    console.error("Error searching Pokemon:", error)
  }
  
  return results.slice(0, limit)
}

// Evolution helpers
export async function getEvolutionChainBySpeciesId(speciesId: number): Promise<PokeAPIEvolutionChain> {
  const species = await getPokemonSpecies(speciesId) as PokeAPIPokemonSpecies
  const url = (species.evolution_chain?.url) as string
  return fetchWithCache<PokeAPIEvolutionChain>(url)
}

export async function getEvolutionChainBySpeciesName(speciesName: string): Promise<PokeAPIEvolutionChain> {
  const species = await getPokemonSpecies(speciesName) as PokeAPIPokemonSpecies
  const url = (species.evolution_chain?.url) as string
  return fetchWithCache<PokeAPIEvolutionChain>(url)
}
