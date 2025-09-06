import { NextRequest, NextResponse } from 'next/server'
import { SmogonService } from '@/lib/smogon'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format')
    const pokemon = searchParams.get('pokemon')
    const move = searchParams.get('move')
    const ability = searchParams.get('ability')
    const item = searchParams.get('item')

    if (!format) {
      return NextResponse.json(
        { error: 'Format parameter is required' },
        { status: 400 }
      )
    }

    const validFormats = ['2v2', '1v1']
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { error: `Invalid format. Supported formats: ${validFormats.join(', ')}` },
        { status: 400 }
      )
    }

    const results: Record<string, boolean> = {}

    if (pokemon) {
      results.pokemon = await SmogonService.isPokemonBanned(pokemon, format)
    }

    if (move) {
      results.move = await SmogonService.isMoveBanned(move, format)
    }

    if (ability) {
      const banlist = await SmogonService.getCombinedBanlist(format)
      results.ability = banlist.bannedAbilities.includes(ability)
    }

    if (item) {
      const banlist = await SmogonService.getCombinedBanlist(format)
      results.item = banlist.bannedItems.includes(item)
    }

    return NextResponse.json({
      format,
      results
    })

  } catch (error) {
    console.error('Error checking ban status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
