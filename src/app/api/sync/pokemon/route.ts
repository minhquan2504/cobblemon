import { NextRequest, NextResponse } from "next/server"
import { getPokemon, getPokemonList, transformPokemonData } from "@/lib/pokeapi"

export async function POST(request: NextRequest) {
  try {
    const { limit = 20, offset = 0 } = await request.json()
    
    // Get Pokemon list from PokeAPI
    const pokemonList = await getPokemonList(limit, offset)
    
    // Fetch detailed data for each Pokemon
    const pokemonData = []
    for (const pokemon of pokemonList.results.slice(0, 10)) { // Limit to 10 for demo
      try {
        const detailedData = await getPokemon(pokemon.name)
        const transformedData = transformPokemonData(detailedData)
        pokemonData.push(transformedData)
      } catch (error) {
        console.error(`Error fetching ${pokemon.name}:`, error)
      }
    }
    
    return NextResponse.json({
      success: true,
      data: pokemonData,
      total: pokemonList.count,
      next: pokemonList.next,
      previous: pokemonList.previous
    })
  } catch (error) {
    console.error("Error syncing Pokemon data:", error)
    return NextResponse.json(
      { success: false, error: "Failed to sync Pokemon data" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const idOrName = searchParams.get("id") || searchParams.get("name")
  
  if (!idOrName) {
    return NextResponse.json(
      { success: false, error: "ID or name parameter required" },
      { status: 400 }
    )
  }
  
  try {
    const pokemonData = await getPokemon(idOrName)
    const transformedData = transformPokemonData(pokemonData)
    
    return NextResponse.json({
      success: true,
      data: transformedData
    })
  } catch (error) {
    console.error(`Error fetching Pokemon ${idOrName}:`, error)
    return NextResponse.json(
      { success: false, error: "Pokemon not found" },
      { status: 404 }
    )
  }
}
