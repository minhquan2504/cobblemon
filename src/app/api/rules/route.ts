import { NextRequest, NextResponse } from 'next/server'
import { SmogonService } from '@/lib/smogon'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format')

    if (!format) {
      return NextResponse.json(
        { error: 'Format parameter is required' },
        { status: 400 }
      )
    }

    // Validate format
    const validFormats = ['2v2', '1v1']
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { error: `Invalid format. Supported formats: ${validFormats.join(', ')}` },
        { status: 400 }
      )
    }

    // Lấy banlist kết hợp từ Smogon và custom
    const banlistData = await SmogonService.getCombinedBanlist(format)

    return NextResponse.json(banlistData)

  } catch (error) {
    console.error('Error fetching rules:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, format } = body

    if (action === 'refresh') {
      // Làm mới cache và trả về banlist mới
      SmogonService.clearCache()
      
      if (!format) {
        return NextResponse.json(
          { error: 'Format parameter is required for refresh' },
          { status: 400 }
        )
      }

      const banlistData = await SmogonService.getCombinedBanlist(format)
      return NextResponse.json(banlistData)
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error processing rules request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
