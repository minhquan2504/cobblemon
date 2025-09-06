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

export async function getPokemonSpecies(idOrName: string | number) {
  const url = `${POKEAPI_BASE_URL}/pokemon-species/${idOrName}`
  return fetchWithCache(url)
}

// Move API functions
export async function getMove(idOrName: string | number): Promise<PokeAPIMove> {
  const url = `${POKEAPI_BASE_URL}/move/${idOrName}`
  return fetchWithCache<PokeAPIMove>(url)
}

export async function getMoveList(limit: number = 20, offset: number = 0) {
  const url = `${POKEAPI_BASE_URL}/move?limit=${limit}&offset=${offset}`
  return fetchWithCache(url)
}

// Type API functions
export async function getType(idOrName: string | number): Promise<PokeAPIType> {
  const url = `${POKEAPI_BASE_URL}/type/${idOrName}`
  return fetchWithCache<PokeAPIType>(url)
}

export async function getTypeList() {
  const url = `${POKEAPI_BASE_URL}/type`
  return fetchWithCache(url)
}

// Item API functions
export async function getItem(idOrName: string | number): Promise<PokeAPIItem> {
  const url = `${POKEAPI_BASE_URL}/item/${idOrName}`
  return fetchWithCache<PokeAPIItem>(url)
}

export async function getItemList(limit: number = 20, offset: number = 0) {
  const url = `${POKEAPI_BASE_URL}/item?limit=${limit}&offset=${offset}`
  return fetchWithCache(url)
}

// Utility functions
export function transformPokemonData(pokeApiData: PokeAPIPokemon) {
  return {
    id: pokeApiData.id,
    name: pokeApiData.name,
    gen: Math.ceil(pokeApiData.id / 151), // Rough generation calculation
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

// Search function
export async function searchPokeAPI(query: string, limit: number = 10) {
  const results = []
  
  try {
    // Search Pokemon
    const pokemonList = await getPokemonList(1000, 0)
    const matchingPokemon = pokemonList.results
      .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, limit)
    
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
  } catch (error) {
    console.error("Error searching Pokemon:", error)
  }
  
  return results
}
